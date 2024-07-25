import express from 'express';
import { updateUser, signOut, deleteUser, getUsers, getCommentUser , subscribedUser} from '../controller/userController.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.post("/update/:id" , verifyToken , updateUser);
router.post("/signout" , signOut);
router.delete("/delete/:id" , verifyToken , deleteUser);
router.get("/getusers" , verifyToken , getUsers);
router.get("/getcommentuser/:userId" , getCommentUser);
router.post("/subscribe" , verifyToken , subscribedUser);


export default router;