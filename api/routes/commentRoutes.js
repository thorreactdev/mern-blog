import express from "express";
import { createComment, deleteComment, editComment, getComments, getcommentsAdmin, getLikeComments } from "../controller/commentController.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.post("/create" ,verifyToken, createComment);
router.get("/getcomment/:postId", getComments);
router.put("/likeComment/:commentId",verifyToken,getLikeComments);
router.post("/editcomment/:commentId" , verifyToken , editComment);
router.delete("/deletecomment/:commentId", verifyToken,deleteComment);
router.get("/getcomment" , verifyToken , getcommentsAdmin);

export default router;