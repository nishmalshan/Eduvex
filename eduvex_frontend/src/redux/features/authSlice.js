import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API_URL from "../../api/axios";

const initialState = {
    loading: false,
    error: null,
    user: null,
    token: null,
    isAuthenticated: false,
};


// Async thunk for signup 
export const registerUser = createAsyncThunk(
    "auth/registerUser",
    async (formData, thunkAPI) => {
        try {
            const response = await API_URL.post("/signup", formData);
            console.log(response.data,'register slice response')
            return response.data
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || "Signup failed"
            );
        }
    }
)

// Async thunk for login
export const loginUser = createAsyncThunk(
    "auth/loginUser",
    async (formData, { rejectWithValue }) => {
        try {
            const response = await API_URL.post("/login", formData)
            console.log(response.data, 'login slice response')
            return response.data
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Login failed"
            )
        }
    }
)


// Async thunk for logout user
export const logoutUser = createAsyncThunk(
    "auth/logoutUser",
    async () => {
        await API_URL.post("/logout")
    }
);

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        loginSuccess: (state, action) => {
            state.user = action.payload.user;
            state.token = action.payload.token || null;
            state.isAuthenticated = true;
        },
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
        }
    },
    extraReducers: (builder) => {
        builder

            // Signup
            .addCase(registerUser.pending, (state) => {
                state.loading = true
                state.error = null
            })

            .addCase(registerUser.fulfilled, (state, action) => {
                console.log(action,'register action')
                state.loading = false
                state.user = action.payload.user
                state.token = action.payload.token || null
                state.isAuthenticated = true
                saveAuthToStorage(action.payload.user)
            })

            // Login
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false
                state.user = action.payload.user
                state.token = action.payload.token || null
                state.isAuthenticated = true
            })

            // Logout
            .addCase(logoutUser.fulfilled, (state) => {
                state.user = null
                state.token = null
                state.isAuthenticated = false
            })
    }
});

export const { logout, loginSuccess } = authSlice.actions;
export default authSlice.reducer;