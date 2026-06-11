import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/authSlice";
import tutorApplicationReducer from "./features/tutorApplicationSlice";
import adminLoginReducer from "./features/adminAuthSlice";
import usersReducer from "./features/userSlice";
import tutorsReducer from "./features/tutorsSlice";
import coursesReducer from "./features/courseSlice";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        tutorApplications: tutorApplicationReducer,
        adminAuth: adminLoginReducer,
        users: usersReducer,
        tutors: tutorsReducer,
        courses: coursesReducer,
    },

    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredPaths: ['tutorApplication.form.photo'],
                ignoredActionPaths: ['meta.arg.photo', 'payload.photo']
            }
        }),
})