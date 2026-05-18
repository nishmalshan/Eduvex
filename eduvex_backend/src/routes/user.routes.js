import express from "express";
// import { getAllUsers } from "../controllers/user.controller.js";
import { protectAdmin } from "../middlewares/protectAdmin.js";

const router = express.Router();

