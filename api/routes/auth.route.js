import express from "express";
import {  deleteUser, getAllnote, signgin,   signup,  singOut, updateUser } from "../controllers/auth.controller.js";




const route = express.Router();

route.post("/signup", signup);
route.post("/signin", signgin);
route.put("/update/:userId", updateUser);
route.delete("/delete/:userId", deleteUser)
route.post("/signout", singOut);
route.get('/get', getAllnote);










export default route;
