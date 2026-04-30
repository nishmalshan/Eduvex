import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/authSlice";
import tutorApplicationReducer from "./features/tutorApplicationSlice";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        tutorApplication: tutorApplicationReducer
    },

    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredPaths: ['tutorApplication.form.photo'],
                ignoredActionPaths: ['payload.photo'],
            },
        }),
})