import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API_URL from "../../api/axios";

const initialState = {
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
            return response.data
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || "Signup failed"
            );
        }
    }
)

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        loginSuccess: (state, action) => {
            state.user = action.payload;
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

            // Loading 
            .addCase(registerUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
                // state.token = action.payload.token;
                state.isAuthenticated = true;
                console.log(action, 'action')
                // store token
                // localStorage.setItem("token", action.payload.token)
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
    }
});

export const { logout, loginSuccess } = authSlice.actions;

export default authSlice.reducer;