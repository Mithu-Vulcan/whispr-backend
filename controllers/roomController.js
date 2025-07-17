import {
	attemptJoinRoom,
	attemptRemoveUser,
	generateRoomCode,
} from "../utils/roomManager.js";

export const createRoom = async (req, res) => {
	const newCode = await generateRoomCode();
	res.json({ roomCode: newCode });
};

export const joinRoom = async (name, roomCode, socketId) => {
	if (!name || !roomCode || !socketId) {
		return {"msg": "invalid"};
	}
	const response = await attemptJoinRoom(name, roomCode, socketId);
	return response
};

export const removeUser = (req, res) => {
	const { name, code } = req.body;
	if (!name || !code) {
		return res
			.status(400)
			.json({ status: "failed", error: "Missing name or code" });
	}
	const response = attemptRemoveUser(name, code);
	return res.json(response);
};
