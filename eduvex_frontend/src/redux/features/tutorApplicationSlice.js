import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API_URL from '../../api/axios';

const initialState = {
    applications: [],
    myApplication: null,
    hasApplied: null,
    loading: false,
    actionLoading: null, // stores the id of the app currently being acted on
    error: null,
};

// ── Fetch the logged-in user's own application ────────────────────────────
export const fetchMyApplication = createAsyncThunk(
    'tutorApplications/fetchMine',
    async (_, { rejectWithValue }) => {
        try {
            console.log('22222222222222111111')
            const response = await API_URL.get('/tutor/my-application');
            console.log(response.data, 'my application response')
            return response.data; // { hasApplied: bool, application: {...} | null }
        } catch (error) {
            console.log(error.response,'slice error')
            if (error.response?.status === 404) {
                return { hasApplied: false, application: null };
            }
            const msg = error.response?.data?.message || 'Failed to fetch your application.';
            return rejectWithValue(msg);
        }
    }
);

export const submitTutorApplication = createAsyncThunk(
    'tutor/submitApplication',
    async (formData, { rejectWithValue }) => {
        try {
            console.log(formData, 'formData')
            const payload = new FormData();

            payload.append('fullName', formData.fullName.trim());
            payload.append('bio', formData.bio.trim());
            payload.append('experience', formData.experience);
            payload.append('linkedin', formData.linkedin.trim());
            payload.append('portfolio', formData.portfolio.trim());

            payload.append('skills', JSON.stringify(formData.skills));
            payload.append('categories', JSON.stringify(formData.categories));

            if (formData.photo) {
                payload.append('photo', formData.photo);
            }
            console.log('22222222222222222')
            const response = await API_URL.post('/tutor/tutor-application', payload);
            return response.data;
        } catch (error) {
            // axios wraps 4xx/5xx in err.response
            const serverError = error.response?.data;
            const errorMsg = serverError?.errors
                ? serverError.errors.join(' - ')
                : serverError?.message || 'Something went wrong. Please try again.';
            return rejectWithValue(errorMsg);
        }
    }
)


// ── Fetch all tutor applications ──────────────────────────────────────────
export const fetchTutorApplications = createAsyncThunk(
    "tutorApplications/fetchAll",
    async (_, { rejectWithValue }) => {
        try {
            console.log('2222222222222222')
            const response = await API_URL.get("/admin/tutor-applications");
            console.log(response.data, 'application response')
            return response.data; // expects { applications: [...] }
        } catch (error) {
            const msg = error.response?.data?.message || "Failed to fetch applications.";
            return rejectWithValue(msg);
        }
    }
);


// ── Approve a tutor application ───────────────────────────────────────────
export const approveTutorApplication = createAsyncThunk(
    "tutorApplications/approve",
    async (id, { rejectWithValue }) => {
        try {
            const response = await API_URL.patch(`/admin/tutor-applications/${id}/approve`);
            return response.data;
        } catch (error) {
            const msg = error.response?.data?.message || "Failed to approve application.";
            return rejectWithValue(msg);
        }
    }
)


// ── Reject a tutor application ────────────────────────────────────────────
export const rejectTutorApplication = createAsyncThunk(
    "tutorApplications/reject",
    async (id, { rejectWithValue }) => {
        try {
            const response = await API_URL.patch(`/admin/tutor-applications/${id}/reject`);
            return response.data; // expects { application: { ...updatedApp } }
        } catch (error) {
            const msg = error.response?.data?.message || "Failed to reject application.";
            return rejectWithValue(msg);
        }
    }
);


const tutorApplicationSlice = createSlice({
    name: 'tutorApplications',
    initialState,

    reducers: {
        // Update any single form field
        // updateField(state, action) {
        //     const { field, value } = action.payload;
        //     state.form[field] = value;
        // },

        // resetApplication(state) {
        //     state.error = null;
        //     state.submittedData = null;
        //     state.form = initialState.form;
        // },

        clearError: (state) => {
            state.error = null;
        },
    },

    extraReducers: (builder) => {
        builder
            .addCase(submitTutorApplication.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(submitTutorApplication.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.submittedData = action.payload;
                state.error = null;
            })
            .addCase(submitTutorApplication.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload || 'Failed to submit application. Please try again.';
            })

            // ── fetchTutorApplications ──
            .addCase(fetchTutorApplications.pending, (state) => {
                state.loading = true;
                state.error = null
            })
            .addCase(fetchTutorApplications.fulfilled, (state, action) => {
                state.loading = false;
                state.applications = action.payload.applications ?? action.payload;
            })
            .addCase(fetchTutorApplications.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload
            })

            // ── approveTutorApplication ──
            .addCase(approveTutorApplication.pending, (state, action) => {
                state.actionLoading = action.meta.arg
            })
            .addCase(approveTutorApplication.fulfilled, (state, action) => {
                state.actionLoading = null
                const updated = action.payload.applications ?? action.payload;
                state.applications = state.applications.map((app) =>
                    app.id === updated.id ? updated : app)
            })
            .addCase(approveTutorApplication.rejected, (state, action) => {
                state.actionLoading = null;
                state.error = action.payload;
            })

            // ── rejectTutorApplication ──
            .addCase(rejectTutorApplication.pending, (state, action) => {
                state.actionLoading = action.meta.arg;
            })
            .addCase(rejectTutorApplication.fulfilled, (state, action) => {
                state.actionLoading = null;
                const updated = action.payload.application ?? action.payload;
                state.applications = state.applications.map((app) =>
                    app._id === updated._id ? updated : app
                );
            })
            .addCase(rejectTutorApplication.rejected, (state, action) => {
                state.actionLoading = null;
                state.error = action.payload;
            })

            // ── fetchMyApplication ──
            .addCase(fetchMyApplication.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMyApplication.fulfilled, (state, action) => {
                state.loading = false;
                state.hasApplied = action.payload.hasApplied;
                state.myApplication = action.payload.application;
            })
            .addCase(fetchMyApplication.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
    }
})

export const { updateField, resetApplication, clearError } = tutorApplicationSlice.actions;
export default tutorApplicationSlice.reducer;