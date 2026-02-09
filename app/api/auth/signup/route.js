import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectDB from "@/app/lib/mongodb";
import User from "@/models/Users";

export async function POST(request) {
    try {
        await connectDB()

        const { Full_Name, Email, Password } = await request.json()

        if (!Full_Name || !Email || !Password) {
            return NextResponse.json({
                success: false, message: "Email and password are required"
            },
                {
                    status: 400
                })

        }
        const existing = await User.findOne({ Email: Email })
        if (existing) {
            return NextResponse.json({
                success: false, message: "Email is already exists"
            },
                {
                    status: 400
                })
        }
        const hash = await bcrypt.hash(Password, 12)

        await User.create({ Full_Name: Full_Name, Email: Email, Password: hash })
        return NextResponse.json({
            success: true, message: "User registered successfully"
        })
    }
    catch (err) {
        return NextResponse.json({
            success: false, message: "Internal server error"
        })
    }


}