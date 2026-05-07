import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API_URL from "../../api/axios";

const initialState = {
    isAuthenticated: false,
    admin: null,
    loading: false,
    error: null
}



export const submintAdminLogin = createAsyncThunk(
    "admin/login",
    async ({ email, password }, { rejectWithValue }) => {
        try {
            const response = await API_URL.post("/admin/login", { email, password });
            console.log(response.data.admin, 'admin check-auth response')
            return response.data;
        } catch (error) {
            const serverError = error.response?.data;
            const errorMsg = serverError?.message || "Login failed. Please try again.";
            return rejectWithValue(errorMsg);
        }
    }
)


// Async thunk for logout user
export const logoutAdmin = createAsyncThunk(
    "auth/logoutAdmin",
    async () => {
        console.log('Logout 22222222222222222')
        await API_URL.post("/admin/logout")
    }
);

const adminLoginSlice = createSlice({
    name: "adminAuth",
    initialState,

    reducers: {
        adminAuthSuccess: (state, action) => {
            state.admin = action.payload.admin;
            state.token = action.payload.token || null;
            state.isAuthenticated = true;
        },
        logout: (state) => {
            state.isAuthenticated = false;
            state.admin = null;
            state.token = null;
        }
    },

    extraReducers: (builder) => {
        builder
            // Login cases
            .addCase(submintAdminLogin.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(submintAdminLogin.fulfilled, (state, action) => {
                console.log(action.payload, 'aaaaaaaaaaaa')
                state.loading = false;
                state.isAuthenticated = true;
                state.admin = action.payload.admin;
                state.token = action.payload.token || null;
            })
            .addCase(submintAdminLogin.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Logout case
            .addCase(logoutAdmin.fulfilled, (state) => {
                state.isAuthenticated = false;
                state.admin = null;
                state.token = null;
            })
    }
})

export const { adminAuthSuccess, logout } = adminLoginSlice.actions;
export default adminLoginSlice.reducer;