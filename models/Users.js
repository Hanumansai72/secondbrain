import mongoose from "mongoose"
const UserSchema = new mongoose.Schema({
    Full_Name: { type: String, required: true },
    Email: { type: String, required: true, unique: true },
    Password: { type: String, required: true }
}, { timestamps: true })

export default mongoose.models.User ||
    mongoose.model("User", UserSchema);