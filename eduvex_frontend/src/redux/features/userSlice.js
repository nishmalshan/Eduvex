import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API_URL from "../../api/axios";


// Fetch all users (admin)
export const fetchAllUsers = createAsyncThunk(
    "users/fetchAll",
    async (_, thunkAPI) => {
        try {
            const response = await API_URL.get("/admin/users")
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || "Failed to fetch users"
            );
        }
    }
)

export const blockUser = createAsyncThunk(
    "users/blockUser",
    async (userId, thunkAPI) => {
        try {
            const response = await API_URL.patch(`/admin/users/${userId}/block`);
            return response.data.user; // expects updated user object
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || "Failed to block user"
            );
        }
    }
);

export const unblockUser = createAsyncThunk(
    "users/unblockUser",
    async (userId, thunkAPI) => {
        try {
            const response = await API_URL.patch(`/admin/users/${userId}/unblock`);
            return response.data.user; // expects updated user object
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || "Failed to unblock user"
            );
        }
    }
);

const initialState = {
    loading: false,
    error: null,
    users: [],
    actionLoading: null, // userId of the user being blocked/unblocked
    totalUsers: 0,
    blockLoading: {}, // { [userId]: true/false }
};

const usersSlice = createSlice({
    name: "users",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder

            // Fetch all users
            .addCase(fetchAllUsers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllUsers.fulfilled, (state, action) => {
                state.loading = false;
                state.users = action.payload.users || [];
            })
            .addCase(fetchAllUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to fetch users";
            })

            // ── Block User
            .addCase(blockUser.pending, (state, action) => {
                state.actionLoading = action.meta.arg; // userId being blocked
            })
            .addCase(blockUser.fulfilled, (state, action) => {
                state.actionLoading = null;
                state.error = null;
                const updated = action.payload;
                const idx = state.users.findIndex((u) => u._id === updated._id);
                if (idx !== -1) state.users[idx] = updated;
            })
            .addCase(blockUser.rejected, (state, action) => {
                state.actionLoading = null;
                state.error = action.payload;
            })

            // ── Unblock User
            .addCase(unblockUser.pending, (state, action) => {
                state.actionLoading = action.meta.arg; // userId
            })
            .addCase(unblockUser.fulfilled, (state, action) => {
                state.actionLoading = null;
                const updated = action.payload;
                const idx = state.users.findIndex((u) => u._id === updated._id);
                if (idx !== -1) state.users[idx] = updated;
            })
            .addCase(unblockUser.rejected, (state, action) => {
                state.actionLoading = null;
                state.error = action.payload;
            });
    }
});

export default usersSlice.reducer;