import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const { text } = await request.json();

        if (!text || text.trim().length === 0) {
            return NextResponse.json({
                success: false,
                message: "Text content is required for summarization"
            }, { status: 400 });
        }

        // Check for Gemini API key
        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            // Return truncated text as fallback summary
            return NextResponse.json({
                success: true,
                summary: text.slice(0, 300) + (text.length > 300 ? "..." : ""),
                keyPoints: [],
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
                            text: `Summarize the following content concisely. Provide a JSON response with:
1. "summary": A clear, concise 2-3 sentence summary (max 250 characters)
2. "keyPoints": An array of 3-4 key takeaways (short phrases)

Content to summarize:
${text.slice(0, 6000)}

Respond ONLY with valid JSON, no markdown or explanation.`
                        }]
                    }],
                    generationConfig: {
                        temperature: 0.3,
                        maxOutputTokens: 400
                    }
                })
            }
        );

        if (!geminiResponse.ok) {
            console.error("Gemini API error:", await geminiResponse.text());
            // Fallback to basic summary
            return NextResponse.json({
                success: true,
                summary: text.slice(0, 300) + (text.length > 300 ? "..." : ""),
                keyPoints: [],
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
            // Fallback to basic summary
            return NextResponse.json({
                success: true,
                summary: text.slice(0, 300) + (text.length > 300 ? "..." : ""),
                keyPoints: [],
                aiGenerated: false
            });
        }

        return NextResponse.json({
            success: true,
            summary: aiResult.summary || text.slice(0, 300),
            keyPoints: aiResult.keyPoints || [],
            aiGenerated: true
        });

    } catch (err) {
        console.error("Error summarizing content:", err);
        return NextResponse.json({
            success: false,
            message: "Failed to summarize content"
        }, { status: 500 });
    }
}
