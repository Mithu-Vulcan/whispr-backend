import e from "express";
import { createRoom, joinRoom, removeUser } from "../controllers/roomController.js";

const router = e.Router();

router.post("/create", createRoom)

export default router
