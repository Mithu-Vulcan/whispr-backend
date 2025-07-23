import { addRoom, addUserToRoom, checkRoom, getAllRooms, getAllUsers } from "./dbManager.js";

const rooms = new Map();

export async function generateRoomCode() {
	const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
	const rooms = await getAllRooms();
	const existingCodes = new Set(rooms.map((room) => room.roomCode));
	let code = "";

	do {
		code = "";
		for (let i = 0; i < 6; i++) {
			code += chars[Math.floor(Math.random() * chars.length)];
		}
	} while (existingCodes.has(code));

	await addRoom(code);
	console.log(code);
	return code;
}

export async function attemptJoinRoom(name, code, socketId) {
	const users = await getAllUsers();
	const currentUsers = new Set(users.map((user) => user.username));
	const exists = await checkRoom(code);
	if (exists) {
		if (currentUsers.has(name)) {
			return { exists: true, msg: "Username exists" };
		}
		const response = await addUserToRoom(name, socketId, code)
		return { exists: true, msg: "Joined Successfully" };
	} else {
		return { exists: false, msg: "Room Not Found" };
	}
}

export function attemptRemoveUser(name, code) {
	if (!rooms.has(code)) {
		return { success: false, msg: "Room not Found" };
	}

	const users = rooms.get(code);
	const updatedUsers = users.filter((user) => user.name !== name);

	if (users.length === updatedUsers.length) {
		return { success: false, msg: "User not Found in the room" };
	}

	rooms.set(code, updatedUsers);
	return { success: true, msg: "User removed Successfully" };
}

export default rooms;
