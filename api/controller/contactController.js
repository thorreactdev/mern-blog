
import Contact from "../models/contactModal.js";
import { errorHandler } from "../utils/error.js";

export const contactData = async(req,res,next)=>{
    try {
        const { email , message } = req.body;
        if(!email || email===""){
            return next(errorHandler(400 , "Please Provide The Email"));
        }
        const saveddata = new Contact({
            email, message
        })
        await saveddata.save();
        res.status(200).json({message:"Data Saved Successfully"});
    } catch (error) {
        next(error);
    }
}