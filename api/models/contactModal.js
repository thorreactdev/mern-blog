import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema({
    email : {
        type : String,
        required : true,
    },
    message : {
        type : String,
        default : "No Message"
    }
},{ timestamps : true});

const Contact  = new mongoose.model("contact", contactSchema);

export default Contact;