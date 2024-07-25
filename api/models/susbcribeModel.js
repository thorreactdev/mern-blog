import mongoose from "mongoose";

const subscribeModal = new mongoose.Schema({
    email : {
        type : String,
        require : true
    },
    userRef : {
        type : String,
        require : true
    }
});

const SubscribeSchema = mongoose.model("subscribe" , subscribeModal);

export default SubscribeSchema;