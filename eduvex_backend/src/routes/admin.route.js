import express from 'express';
const router = express.Router();
import { adminLogin } from '../controllers/adminAuth.controller.js';

router.post("/login", adminLogin);




export default router;