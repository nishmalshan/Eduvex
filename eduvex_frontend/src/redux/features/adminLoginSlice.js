import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API_URL from "../../api/axios";

const initialState = {
    isAuthenticated: false,
    admin: null,
    loading: false,
    error: null
}

const saveAuthToStorage = (admin) => {
    if (admin) {
        localStorage.setItem("authAdmin", JSON.stringify(admin));
    }
};

const clearAuthStorage = () => {
    localStorage.removeItem("authAdmin");
};


export const submintAdminLogin = createAsyncThunk(
    "admin/login",
    async ({ email, password }, { rejectWithValue }) => {
        try {
            const response = await API_URL.post("/admin/login", { email, password });
            console.log(response.data.admin, 'resssssssssssss')
            return response.data;
        } catch (error) {
            const serverError = error.response?.data;
            const errorMsg = serverError?.message || "Login failed. Please try again.";
            return rejectWithValue(errorMsg);
        }
    }
)

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
            clearAuthStorage();
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
                saveAuthToStorage(action.payload.admin);
            })
            .addCase(submintAdminLogin.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Logout case
            // .addCase(logoutUser.fulfilled, (state) => {
            //     state.isAuthenticated = false;
            //     state.admin = null;
            //     state.token = null;
            //     clearAuthStorage();
            // })
    }
})

export const { adminAuthSuccess, logout } = adminLoginSlice.actions;
export default adminLoginSlice.reducer;