import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
	room: { type: mongoose.Schema.Types.ObjectId, ref: "Room", required: true },
	//sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
	senderName: { type: String, required: true },
	content: { type: String, required: true },
	timestamp: { type: Date, default: Date.now },
});

export default mongoose.model("Message", messageSchema);
