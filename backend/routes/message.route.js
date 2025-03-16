import express from "express";
import isAuthenticated from "../middlewares/auth.middleware.js";
import { upload } from "../utils/multer.js";
import { sendMessage,getMessages } from "../controllers/message.controller.js";

const router=express.Router();

router.post("/send/:id",isAuthenticated,sendMessage);
router.get("/all/:id",isAuthenticated,getMessages);

export default router;