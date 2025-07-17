import mongoose, { Schema } from "mongoose";

const roomSchema = new mongoose.Schema({
	roomCode: { type: String, required: true, unique: true },
	createdAt: { type: Date, default: Date.now },
	users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});

export default mongoose.model("Room", roomSchema);
