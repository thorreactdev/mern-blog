import express from "express";

const app = express();

app.get("/about" , (req,res)=>{
    res.send("Welcome To about");

})

app.listen(3000 , ()=>{
    console.log("Server is running on port 3000!!");
})