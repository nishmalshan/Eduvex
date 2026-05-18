import express from 'express';
const router = express.Router();
import { adminLogin, checkAdminAuth, logoutAdmin } from '../controllers/adminAuth.controller.js';
import { protectAdmin } from '../middlewares/protectAdmin.js';
import { getApplications, approveApplication, rejectApplication } from '../controllers/tutor.controller.js';
import { getAllUsers, blockUser, unblockUser } from '../controllers/user.controller.js';

router.post("/login", adminLogin);
router.post("/logout", logoutAdmin)
router.get("/check-auth", protectAdmin, checkAdminAuth)



// Admin-only routes for tutor
router.get("/tutor-applications", protectAdmin, getApplications);
router.patch("/tutor-applications/:id/approve", protectAdmin, approveApplication);
router.patch("/tutor-applications/:id/reject", protectAdmin, rejectApplication)



// Admin-only routes for users will go here (e.g., get all users, block/unblock users)
router.get("/users", protectAdmin, getAllUsers);
router.patch("/users/:id/block", protectAdmin, blockUser);
router.patch("/users/:id/unblock", protectAdmin, unblockUser);

export default router;