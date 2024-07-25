import express from "express";
import { contactData } from "../controller/contactController.js";

const router = express.Router();

router.post("/contactdata",contactData);


export default router;