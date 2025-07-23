import Room from "../models/Room.js";
import User from "../models/User.js";
import Message from "../models/Message.js";

//Room helpers

//add
export async function addRoom(roomCode) {
	const room = new Room({ roomCode });
	await room.save();
	return room;
}

//get all rooms
export async function getAllRooms() {
	const rooms = await Room.find({}, "roomCode");
	return rooms.map((r) => r.roomCode);
}

//get the users with the rooms attributes
export async function getRoomByCode(roomCode) {
	return Room.findOne({ roomCode }).populate("users");
}

//delete
export async function deleteRoom(roomCode) {
	await Room.deleteOne({ roomCode });
    return true
}

//check if room available
export async function checkRoom (roomCode) {
    const rooms = await getAllRooms()
    if (rooms.includes(roomCode)) {
        return true
    } else {
        return false
    }
}

//User helper

// Add a user to a room
export async function addUserToRoom(username, socketId, roomCode) {
	const room = await Room.findOne({ roomCode });
	if (!room) throw new Error("Room not found");

	// Create user
	const user = new User({ username, socketId, room: room._id });
	await user.save();

	// Add user to room users list
	room.users.push(user._id);
	await room.save();

	return user;
}

// Get all users by room or all
export async function getAllUsers(roomCode) {
	if (roomCode) {
		const room = await Room.findOne({ roomCode }).populate("users");
		return room ? room.users : [];
	}
	return User.find({});
}

//find user by socketId
export async function findBySocketId(id) {
	const user = await User.findOne({ socketId: id });
	console.log(user)
	if (!user) {
		return "Not found"
	}
	return user.username
}

// Remove a user by socketId and update room
export async function removeUser(socketId) {
	if (!socketId) {
		return
	}
	const user = await User.findOne({ socketId });
	if (!user) return null;

	const room = await Room.findById(user.room);
	if (room) {
		room.users = room.users.filter((id) => !id.equals(user._id));
		await room.save();
	}

	await User.deleteOne({ _id: user._id });
	return user.username;
}

//Messages

// Add message to a room
export async function addMessage(roomCode, senderName, message) {
	const room = await Room.findOne({ roomCode });
	if (!room) {
		return "Room Not Found"
	};

	const newMessage = new Message({
		room: room._id,
		senderName: senderName,
		content: message,
	});
	await newMessage.save();
	return newMessage;
}

// Get messages by roomCode
export async function getMessagesByRoomCode(roomCode, limit = 50) {
	const room = await Room.findOne({ roomCode });
	if (!room) return [];

	return Message.find({ room: room._id }).sort({ timestamp: 1 }).limit(limit);
}

// Delete messages by roomCode
export async function deleteMessagesByRoom(roomCode) {
	const room = await Room.findOne({ roomCode });
	if (!room) return;

	await Message.deleteMany({ room: room._id });
}
