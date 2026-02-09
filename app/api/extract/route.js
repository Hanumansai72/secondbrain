import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const { url } = await request.json();

        if (!url) {
            return NextResponse.json({
                success: false,
                message: "URL is required"
            }, { status: 400 });
        }

        // Validate URL format
        try {
            new URL(url);
        } catch {
            return NextResponse.json({
                success: false,
                message: "Invalid URL format"
            }, { status: 400 });
        }

        // Fetch the webpage content
        const response = await fetch(url, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
            }
        });

        if (!response.ok) {
            return NextResponse.json({
                success: false,
                message: "Failed to fetch URL content"
            }, { status: 400 });
        }

        const html = await response.text();

        // Extract title from HTML
        const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
        const title = titleMatch ? titleMatch[1].trim() : "Untitled";

        // Extract meta description
        const descMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i) ||
            html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*name=["']description["']/i);
        const metaDescription = descMatch ? descMatch[1].trim() : "";

        // Extract main text content (remove scripts, styles, and HTML tags)
        let textContent = html
            .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
            .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
            .replace(/<nav[^>]*>[\s\S]*?<\/nav>/gi, "")
            .replace(/<footer[^>]*>[\s\S]*?<\/footer>/gi, "")
            .replace(/<header[^>]*>[\s\S]*?<\/header>/gi, "")
            .replace(/<[^>]+>/g, " ")
            .replace(/\s+/g, " ")
            .trim()
            .slice(0, 8000); // Limit content for AI processing

        // Check for Gemini API key
        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            // Return basic extraction without AI summary
            return NextResponse.json({
                success: true,
                title: title,
                summary: metaDescription || textContent.slice(0, 300) + "...",
                tags: extractBasicTags(textContent, title),
                content: textContent.slice(0, 500),
                aiGenerated: false
            });
        }

        // Call Gemini API for AI summary
        const geminiResponse = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: `Analyze this webpage content and provide a JSON response with:
1. "summary": A concise 2-3 sentence summary of the main content (max 200 chars)
2. "tags": An array of 3-5 relevant topic tags (single words, no hashtags)
3. "keyPoints": An array of 3 key takeaways (short phrases)

Content to analyze:
Title: ${title}
${metaDescription ? `Description: ${metaDescription}` : ""}
Content: ${textContent.slice(0, 4000)}

Respond ONLY with valid JSON, no markdown or explanation.`
                        }]
                    }],
                    generationConfig: {
                        temperature: 0.3,
                        maxOutputTokens: 500
                    }
                })
            }
        );

        if (!geminiResponse.ok) {
            console.error("Gemini API error:", await geminiResponse.text());
            // Fallback to basic extraction
            return NextResponse.json({
                success: true,
                title: title,
                summary: metaDescription || textContent.slice(0, 300) + "...",
                tags: extractBasicTags(textContent, title),
                content: textContent.slice(0, 500),
                aiGenerated: false
            });
        }

        const geminiData = await geminiResponse.json();
        const aiText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || "";

        // Parse AI response
        let aiResult;
        try {
            // Clean the response - remove markdown code blocks if present
            const cleanedText = aiText.replace(/```json\n?|\n?```/g, "").trim();
            aiResult = JSON.parse(cleanedText);
        } catch (parseError) {
            console.error("Failed to parse AI response:", aiText);
            // Fallback to basic extraction
            return NextResponse.json({
                success: true,
                title: title,
                summary: metaDescription || textContent.slice(0, 300) + "...",
                tags: extractBasicTags(textContent, title),
                content: textContent.slice(0, 500),
                aiGenerated: false
            });
        }

        return NextResponse.json({
            success: true,
            title: title,
            summary: aiResult.summary || metaDescription || textContent.slice(0, 300),
            tags: aiResult.tags || extractBasicTags(textContent, title),
            keyPoints: aiResult.keyPoints || [],
            content: textContent.slice(0, 500),
            aiGenerated: true
        });

    } catch (err) {
        console.error("Error extracting URL:", err);
        return NextResponse.json({
            success: false,
            message: "Failed to extract content from URL"
        }, { status: 500 });
    }
}

// Basic tag extraction without AI
function extractBasicTags(text, title) {
    const commonWords = new Set([
        "the", "a", "an", "and", "or", "but", "in", "on", "at", "to", "for",
        "of", "with", "by", "from", "is", "are", "was", "were", "be", "been",
        "being", "have", "has", "had", "do", "does", "did", "will", "would",
        "could", "should", "may", "might", "must", "can", "this", "that",
        "these", "those", "it", "its", "they", "them", "their", "we", "our",
        "you", "your", "i", "my", "me", "he", "she", "his", "her", "what",
        "which", "who", "when", "where", "why", "how", "all", "each", "every",
        "both", "few", "more", "most", "other", "some", "such", "no", "not",
        "only", "same", "so", "than", "too", "very", "just", "also", "now"
    ]);

    const words = (title + " " + text)
        .toLowerCase()
        .replace(/[^a-z\s]/g, "")
        .split(/\s+/)
        .filter(word => word.length > 4 && !commonWords.has(word));

    // Count word frequency
    const wordCount = {};
    words.forEach(word => {
        wordCount[word] = (wordCount[word] || 0) + 1;
    });

    // Get top 4 words as tags
    return Object.entries(wordCount)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 4)
        .map(([word]) => word.charAt(0).toUpperCase() + word.slice(1));
}
