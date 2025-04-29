import express from "express";
import { asigngin, asignup } from "../controllers/admin.controller.js";




const route = express.Router();

route.post("/asignup", asignup);
route.post("/asignin", asigngin);











export default route;
