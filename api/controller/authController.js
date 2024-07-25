import User from "../models/userModel.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

export const signUp = async(req, res, next) => {
    const { username, email, password } = req.body;
    
    if(!username || !email || !password || username === "" || email === "" || password === ""){
        return next(errorHandler(400 , "All The Fields are Required"));
    }
    
    let regex = /^[a-z0-9]+@[a-z]+\.[a-z]{2,3}$/;
    if(!regex.test(email)){
        return next(errorHandler(400 , "Invalid Email"));
    }
    if(password.length < 8 || password.length > 15){
        return next(errorHandler(400 ,"Password must be between 8 and 15 characters"));
    }
    
    const userData = await User.find();

    const isUsernameTaken = userData.some(user => user.username === username);
    if(isUsernameTaken){
        return next(errorHandler(400 ,  "Username already taken"));
    }

    const isEmailTaken = userData.some(user => user.email === email);
    if(isEmailTaken){
        return next(errorHandler(400 , "Email already exists"));
    }

    const hashPassword = bcryptjs.hashSync(password, 10);
    const newUser = new User({ username, email, password: hashPassword });

    try {
        await newUser.save();
        res.status(201).json({ message: `${username} Registered successfully` });
    } catch (error) {
        next(error);
    }
};

export const signIn = async(req,res,next)=>{
    const { email , password } = req.body;
    try {
        if(!email || !password || email === "" || password === ""){
            return next(errorHandler(400 , "All The Fields Are Required"));
        }
        let regex = /^[a-z0-9]+@[a-z]+\.[a-z]{2,3}$/;
        if(!regex.test(email)){
            return next(errorHandler(400 , "Invalid Email"));
        }
        const userData = await User.findOne({ email });
        if(!userData){
            return next(errorHandler(400 , "User Not Found"));
        }
        const isPasswordCorrect = bcryptjs.compareSync(password , userData?.password);
        if(!isPasswordCorrect){
            return next(errorHandler(400 , "Invalid Credentials"));
        }
        const token = jwt.sign({ id : userData?._id , isAdmin : userData.isAdmin} , process.env.JWT_SECRET);
        const { password : pass , ...rest} = userData?._doc;
        res.status(200).cookie("access_token" , token , {  httpOnly: true,}).json(rest);
    } catch (error) {
        next(error);
    }
};

export const google = async (req, res, next) => {
    const { email, name, googlePhotoUrl } = req.body;
    try {
      const user = await User.findOne({ email });
      if (user) {
        const token = jwt.sign(
          { id: user._id , isAdmin : user.isAdmin},
          process.env.JWT_SECRET
        );
        const { password, ...rest } = user._doc;
        res
          .status(200)
          .cookie('access_token', token, {
            httpOnly: true,
          })
          .json(rest);
      } else {
        const generatedPassword =
          Math.random().toString(36).slice(-8) +
          Math.random().toString(36).slice(-8);
        const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
        const newUser = new User({
          username:
            name.toLowerCase().split(' ').join('') +
            Math.random().toString(9).slice(-4),
          email,
          password: hashedPassword,
          profilePicture: googlePhotoUrl,
        });
        await newUser.save();
        const token = jwt.sign(
          { id: newUser._id , isAdmin: newUser.isAdmin },
          process.env.JWT_SECRET
        );
        const { password, ...rest } = newUser._doc;
        res
          .status(200)
          .cookie('access_token', token, {
            httpOnly: true,
          })
          .json(rest);
      }
    } catch (error) {
      next(error);
    }
  };



