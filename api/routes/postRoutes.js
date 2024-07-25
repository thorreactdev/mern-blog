import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import { createPost , deletePost, getPost, updatepost} from "../controller/postController.js";
const router = express.Router();

router.post("/create" , verifyToken , createPost);
router.get("/getposts" , getPost);
router.delete("/delete/:postId/:userId" , verifyToken , deletePost);
router.put("/update/:postId/:userId" , verifyToken , updatepost);

export default router;