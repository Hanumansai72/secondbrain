import mongoose from "mongoose"

const IdeaSchema = new mongoose.Schema({
    userid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true

    },
    Title: {
        type: String,
        required: true
    },
    tags: [String],
    Type: {
        type: String
    },
    des: {
        type: String

    }

}, { timestamps: true })
export default mongoose.models.Idea ||
    mongoose.model("Idea", IdeaSchema);