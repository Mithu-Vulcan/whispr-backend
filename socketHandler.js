import {
	addMessage,
	addUserToRoom,
	findBySocketId,
} from "./utils/dbManager.js";
import rooms, { attemptJoinRoom } from "./utils/roomManager.js";

export default async function socketHandler(io) {
	console.log("socket on");
	io.on("connection", (socket) => {
		console.log("User connected:", socket.id);

		socket.on("join-room", async (roomId, username) => {
			await attemptJoinRoom(username, roomId, socket.id);
			socket.join(roomId);
			console.log(`${username} joined room ${roomId}`);

			io.to(roomId).emit("chat message", {
				username: "System",
				message: `${username} has joined the room.`,
			});
		});

		socket.on("chat message", ({ roomId, username, message }) => {
			console.log(roomId, username, message);
			addMessage(roomId, username, message);
			io.to(roomId).emit("chat message", { username, message });
		});

		socket.on("leave-room", ({ roomId, username }) => {
			socket.leave(roomId);
			console.log(`${username} left room ${roomId}`);

			io.to(roomId).emit("chat message", {
				username: "System",
				message: `${username} has left the chat.`,
			});
		});

		socket.on("disconnect", async () => {
			const user = await findBySocketId(socket.id);
			console.log("User disconnected:", socket.id, user);
		});
	});
}
