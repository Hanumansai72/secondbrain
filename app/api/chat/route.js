import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/app/lib/mongodb";
import Idea from "@/models/New";

// POST /api/chat - Conversational querying of knowledge base
export async function POST(request) {
    try {
        const { message, userId } = await request.json();

        if (!message || message.trim().length === 0) {
            return NextResponse.json({
                success: false,
                message: "Message is required"
            }, { status: 400 });
        }

        await connectDB();

        // Search for relevant notes based on the message
        const searchTerms = message.toLowerCase().split(" ").filter(term => term.length > 2);

        // Build search query
        const searchQuery = {
            $or: [
                { Title: { $regex: searchTerms.join("|"), $options: "i" } },
                { des: { $regex: searchTerms.join("|"), $options: "i" } },
                { tags: { $in: searchTerms.map(term => new RegExp(term, "i")) } }
            ]
        };

        // Add user filter if provided
        if (userId) {
            searchQuery.userid = userId;
        }

        // Find relevant notes
        const relevantNotes = await Idea.find(searchQuery)
            .sort({ createdAt: -1 })
            .limit(5)
            .lean();

        // Check if we have Gemini API key for AI response
        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            // Fallback response without AI
            if (relevantNotes.length === 0) {
                return NextResponse.json({
                    success: true,
                    response: "I couldn't find any relevant notes in your knowledge base. Try adding more content or rephrasing your question.",
                    sources: [],
                    aiGenerated: false
                });
            }

            const sources = relevantNotes.map(note => ({
                id: note._id.toString(),
                title: note.Title,
                snippet: note.des?.slice(0, 100) + "...",
                type: note.Type
            }));

            return NextResponse.json({
                success: true,
                response: `I found ${relevantNotes.length} relevant note${relevantNotes.length > 1 ? 's' : ''} related to your question. Here are the key insights from your knowledge base.`,
                sources: sources,
                aiGenerated: false
            });
        }

        // Prepare context from notes for AI
        const context = relevantNotes.map(note =>
            `Title: ${note.Title}\nContent: ${note.des}\nType: ${note.Type}\nTags: ${note.tags?.join(", ") || "none"}`
        ).join("\n\n---\n\n");

        // Call Gemini API for intelligent response
        const prompt = `You are an AI assistant helping users query their personal knowledge base. Based on the following context from their notes, provide a helpful, conversational response to their question.

Context from user's knowledge base:
${context || "No relevant notes found."}

User's question: "${message}"

Instructions:
- Answer based ONLY on the provided context
- If the context doesn't contain relevant information, say so politely
- Be conversational and helpful
- Keep responses concise but informative
- If referencing specific notes, mention them by title

Respond in a friendly, helpful manner:`;

        const geminiResponse = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }],
                    generationConfig: {
                        temperature: 0.7,
                        maxOutputTokens: 500,
                    }
                })
            }
        );

        if (!geminiResponse.ok) {
            throw new Error("Gemini API request failed");
        }

        const geminiData = await geminiResponse.json();
        const aiResponse = geminiData.candidates?.[0]?.content?.parts?.[0]?.text ||
            "I'm having trouble generating a response. Please try again.";

        const sources = relevantNotes.map(note => ({
            id: note._id.toString(),
            title: note.Title,
            snippet: note.des?.slice(0, 100) + "...",
            type: note.Type
        }));

        return NextResponse.json({
            success: true,
            response: aiResponse,
            sources: sources,
            aiGenerated: true
        });

    } catch (err) {
        console.error("Chat API error:", err);
        return NextResponse.json({
            success: false,
            message: "Failed to process your question"
        }, { status: 500 });
    }
}
