// import { error } from "console";
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import cookieParser from "cookie-parser";
import postRoutes from "./routes/postRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";

dotenv.config();
mongoose.connect(
  process.env.MONGO_DB
).then(()=>{
    console.log("Database Connected");
}).catch((error)=>{
    console.log(error);
});

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth" , authRoutes);
app.use("/api/user" , userRoutes);
app.use("/api/post" , postRoutes);
app.use("/api/comment" , commentRoutes);
app.use("/api/contact", contactRoutes);

app.listen(3000, () => {
  console.log("Server is running on port 3000!!");
});


// error middleware

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});
