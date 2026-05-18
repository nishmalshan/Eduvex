import { findUserById, findUserByIdAndUpdate, getUsers } from "../repositories/user.repository.js"

// Fetch all non-admin users for the admin dashboard
export const getAllUsers = async (req, res) => {
    try {
        const users = await getUsers();
        console.log(users, 'getAllUsers result')
        return res.status(200).json({ success: true, users });

    } catch (error) {
        console.error("getAllUsers error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch users",
        });
    }
}


// ── PATCH /api/admin/users/:id/block ─────────────────────────────────────

export const blockUser = async (req, res) => {
    try {
        const { id } = req.params;

        const target = await findUserById(id);

        if (!target) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        if (target.role === "admin") {
            return res.status(403).json({ success: false, message: "Cannot block an admin" });
        }
        if (target.isBlocked === true) {
            return res.status(400).json({ success: false, message: "User is already blocked" });
        }

        const updated = await findUserByIdAndUpdate(id, { isBlocked: true });
        
        if (updated) {
            return res.status(200).json({ success: true, message: "User blocked successfully", user: updated });
        }
    } catch (error) {
        console.error("blockUser error:", error);
        return res.status(500).json({ success: false, message: "Failed to block user" });
    }
}

export const unblockUser = async (req, res) => {
    try {
        const { id } = req.params;

        const target = await findUserById(id);
        
        if (!target) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        if (target.role === "admin") {
            return res.status(403).json({ success: false, message: "Cannot unblock an admin" });
        }
        if (target.isBlocked === false) {
            return res.status(400).json({ success: false, message: "User is already unblocked" });
        }

        const updated = await findUserByIdAndUpdate(id, { isBlocked: false });
        
        if (updated) {
            return res.status(200).json({ success: true, message: "User unblocked successfully", user: updated });
        }
    } catch (error) {
        console.error("unblockUser error:", error);
        return res.status(500).json({ success: false, message: "Failed to unblock user" });
    }
}