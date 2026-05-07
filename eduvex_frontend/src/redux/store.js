import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/authSlice";
import tutorApplicationReducer from "./features/tutorApplicationSlice";
import adminLoginReducer from "./features/adminAuthSlice";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        tutorApplication: tutorApplicationReducer,
        adminAuth: adminLoginReducer
    },

    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredPaths: ['tutorApplication.form.photo'],
                ignoredActionPaths: ['meta.arg.photo', 'payload.photo']
            }
        }),
})