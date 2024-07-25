import SubscribeSchema from "../models/susbcribeModel.js";
import User from "../models/userModel.js";
import { errorHandler } from "../utils/error.js";
import bcryptjs from "bcryptjs";

export const updateUser = async (req, res, next) => {
  console.log(req.user);
  if (req.user.id !== req.params.id){
      return next(errorHandler(401, "You Can Update only Your Own account"));
  }
  if (req.body.password) {
    if (req.body.password.length < 8 || req.body.password.length > 15) {
      return next(
        errorHandler(400, "Password must be between 8 and 15 characters")
      );
    }
    req.body.password = bcryptjs.hashSync(req.body.password, 10);
  }
  if (req.body.username) {
    if (req.body.username.length < 5 || req.body.username.length > 20) {
      return next(
        errorHandler(400, "Username must be between 7 and 20 characters")
      );
    }
  }
  const usernameRegex = /^[a-zA-Z0-9_]+$/;
  if (!usernameRegex.test(req.body.username)) {
    return next(errorHandler(400 , "Username should not contain special characters."));
}
  try {
    const updateUserData = await User.findByIdAndUpdate(req.params.id , {
        $set:{
            username : req.body.username,
            email : req.body.email,
            password : req.body.password,
            profilePicture : req.body.profilePicture
        }
    } , { new : true})

    const { password : pass , ...rest} = updateUserData._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

export const signOut = async(req,res,next)=>{
  try {
    res.clearCookie("access_token").status(200).json("Sign Out Successfull");
  } catch (error) {
    next(error);
  }
}

export const deleteUser = async(req, res, next)=>{
  if(!req.user.isAdmin && req.user.id !== req.params.id){
    return next(errorHandler(401 , "You cannot delete this account"));
  }
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json("User Deleted SuccessFull");

  } catch (error) {
    next(error);
  }
}

export const getUsers = async(req,res,next)=>{
  if(!req.user.isAdmin){
    return next(errorHandler(401, "You are allowe to see the users"));
  }

  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
  const limit = parseInt(req.query.limit) || 9;
  const sortDirection = req.query.sort === "asc" ? 1: -1;

  const users = await User.find().sort({ createdAt : sortDirection}).skip(startIndex).limit(limit);
  const userWithoutPassword = users.map((user)=>{
    const {password , ...rest} = user._doc;
    return rest;
  });

  const totalUsers = await User.countDocuments();
  const now = new Date();
  const oneMonthAgo = new Date(
    now.getFullYear(),
    now.getMonth() - 1,
    now.getDate()
  );

  const lastMonthUser = await User.countDocuments({
    createdAt: { $gte: oneMonthAgo }
  })

  res.status(200).json({ users : userWithoutPassword , totalUsers , lastMonthUser});
  } catch (error) {
    next(error);
  }
}

export const getCommentUser = async(req,res,next)=>{
  try {
    const users = await User.findById(req.params.userId);
    if(!users){
      return next(errorHandler(400 , "User Not Found"));
    }
    const { password , ...rest} = users._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
}

export const subscribedUser = async(req,res,next) =>{
  const { email , userRef } = req.body;
  if(!req.user.id){
    return next(errorHandler(401 , "Unathourized"));
  }
  if(!email || !userRef){
      return next(errorHandler(404 , "Please Enter Valid Email"))
  }
  try {
      let subscription = await SubscribeSchema.findOne({ email });
      if(subscription) return next(errorHandler(404 , "You Have Already Subscribed"));
      subscription = new SubscribeSchema({ email , userRef });
      await subscription.save();
      res.status(200).json("Subscribed Successfully");
  } catch (error) {
      console.log(error);
      next(error); 
  }
}