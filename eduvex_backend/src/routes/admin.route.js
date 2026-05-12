import express from 'express';
const router = express.Router();
import { adminLogin, checkAdminAuth, logoutAdmin } from '../controllers/adminAuth.controller.js';
import { protectAdmin } from '../middlewares/protectAdmin.js';
import { getApplications } from '../controllers/tutor.controller.js';

router.post("/login", adminLogin);
router.post("/logout", logoutAdmin)
router.get("/check-auth", protectAdmin, checkAdminAuth)



// Admin-only routes for tutor
router.get("/tutor-applications", protectAdmin, getApplications);



export default router;