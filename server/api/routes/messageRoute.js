import express from "express"
import { getMessage, sendMessage } from "../controllers/messageController.js";
import isAuthenticated from "../middleware/isAuthenticated.js";
import { verifyToken } from "../utils/verifyUser.js";
import { getOtherUsers } from "../controllers/chatController.js";

const router= express.Router();

router.route("/message/send/:id").post(verifyToken,sendMessage);
router.route("/message/:id").get(getMessage);
console.log("message")
router.route("/user").get(getOtherUsers)

export default router;  