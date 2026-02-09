import { NextResponse } from "next/server";
import connectDB from "@/app/lib/mongodb";
import Idea from "@/models/New";

// GET handler to fetch notes for a user
export async function GET(request) {
    try {
        await connectDB();
        const { searchParams } = new URL(request.url);
        const userid = searchParams.get("userid");
        const search = searchParams.get("search") || "";

        if (!userid) {
            return NextResponse.json({
                success: false,
                message: "User ID is required"
            }, { status: 400 });
        }

        // Build query
        let query = { userid: userid };

        // Add search filter if provided
        if (search) {
            query.$or = [
                { Title: { $regex: search, $options: "i" } },
                { tags: { $in: [new RegExp(search, "i")] } },
                { des: { $regex: search, $options: "i" } }
            ];
        }

        const notes = await Idea.find(query).sort({ createdAt: -1 });

        return NextResponse.json({
            success: true,
            notes: notes
        });

    } catch (err) {
        console.error("Error fetching notes:", err);
        return NextResponse.json({
            success: false,
            message: "Internal server error"
        }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        await connectDB();
        const { userid, title, tags, Type, des } = await request.json()
        if (!userid || !title) {
            return NextResponse.json({
                success: false, message: "User id is not found or Title is not provided"
            })
        }
        await Idea.create({ userid: userid, Title: title, tags: tags, Type: Type, des: des })
        return NextResponse.json({
            success: true, message: "note is added"

        })




    }
    catch (err) {
        return NextResponse.json({
            success: false, message: "Internal server error"
        })
    }
}