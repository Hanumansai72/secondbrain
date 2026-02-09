import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/app/lib/mongodb";
import Idea from "@/models/New";

// GET /api/public/brain/query?q=search_term&limit=10&type=note
export async function GET(request) {
    try {
        await connectDB();

        const { searchParams } = new URL(request.url);
        const query = searchParams.get("q") || "";
        const limit = Math.min(parseInt(searchParams.get("limit") || "10"), 50);
        const type = searchParams.get("type"); // note, link, insight

        // Build search filter
        const filter = {};

        // Text search across title and description
        if (query) {
            filter.$or = [
                { Title: { $regex: query, $options: "i" } },
                { des: { $regex: query, $options: "i" } },
                { tags: { $in: [new RegExp(query, "i")] } }
            ];
        }

        // Filter by type if specified
        if (type && ["note", "link", "insight"].includes(type)) {
            filter.Type = type;
        }

        // Fetch matching notes
        const notes = await Idea.find(filter)
            .sort({ createdAt: -1 })
            .limit(limit)
            .select("Title des tags Type createdAt")
            .lean();

        // Format response
        const results = notes.map(note => ({
            id: note._id.toString(),
            title: note.Title,
            summary: note.des ? note.des.slice(0, 200) + (note.des.length > 200 ? "..." : "") : "",
            tags: note.tags || [],
            type: note.Type,
            createdAt: note.createdAt
        }));

        return NextResponse.json({
            success: true,
            query: query,
            type: type || "all",
            results: results,
            count: results.length,
            timestamp: new Date().toISOString()
        });

    } catch (err) {
        console.error("Public API error:", err);
        return NextResponse.json({
            success: false,
            message: "Failed to query knowledge base",
            error: process.env.NODE_ENV === "development" ? err.message : undefined
        }, { status: 500 });
    }
}
