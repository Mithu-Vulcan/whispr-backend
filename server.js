import e from "express";
import cors from "cors";
import dotenv from "dotenv";
import roomRoutes from "./routes/room.js";
import { createServer } from "http";
import { Server } from "socket.io";
import socketHandler from "./socketHandler.js";
import connectDB from "./utils/db.js";

dotenv.config();
connectDB()

const app = e();
const PORT = process.env.PORT || 5000;
app.use(cors());
app.use(e.json());
app.use("/api/rooms", roomRoutes);

const httpServer = createServer(app);

const io = new Server(httpServer, {
	cors: {
		origin: "*",
		methods: ["GET", "POST"],
	},
});
socketHandler(io);

httpServer.listen(PORT, () => {
	console.log(`Whispr backend running at http://localhost:${PORT}`);
});
