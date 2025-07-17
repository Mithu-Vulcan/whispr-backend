import mongoose, { Schema } from "mongoose";

const userSchema = new mongoose.Schema({
	username: { type: String, required: true },
	socketId: { type: String, required: true },
	room: { type: mongoose.Schema.Types.ObjectId, ref: "Room", required: true },
	createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("User", userSchema);
