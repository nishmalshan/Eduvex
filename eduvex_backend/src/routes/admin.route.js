import express from 'express';
const router = express.Router();
import { adminLogin, checkAdminAuth, logoutAdmin } from '../controllers/adminAuth.controller.js';
import { protectAdmin } from '../middlewares/protectAdmin.js';

router.post("/login", adminLogin);
router.post("/logout", logoutAdmin)
router.get("/check-auth", protectAdmin, checkAdminAuth)



export default router;