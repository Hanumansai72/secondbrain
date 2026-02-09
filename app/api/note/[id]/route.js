import { NextResponse } from "next/server";
import connectDB from "@/app/lib/mongodb";
import Idea from "@/models/New";
import mongoose from "mongoose";

// GET handler to fetch a single note by ID
export async function GET(request, { params }) {
    try {
        await connectDB();
        const { id } = await params;

        // Validate ObjectId format
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json({
                success: false,
                message: "Invalid note ID format"
            }, { status: 400 });
        }

        const note = await Idea.findById(id);

        if (!note) {
            return NextResponse.json({
                success: false,
                message: "Note not found"
            }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            note: {
                id: note._id,
                title: note.Title,
                description: note.des,
                tags: note.tags || [],
                type: note.Type,
                createdAt: note.createdAt,
                updatedAt: note.updatedAt
            }
        });

    } catch (err) {
        console.error("Error fetching note:", err);
        return NextResponse.json({
            success: false,
            message: "Internal server error"
        }, { status: 500 });
    }
}
