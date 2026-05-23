import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import API_URL from '../../api/axios';




// ── Fetch all approved tutors ─────────────────────────────────────────────
export const fetchApprovedTutors = createAsyncThunk(
    "tutors/fetchApproved",
    async (_, { rejectWithValue }) => {
        try {
            const response = await API_URL.get("/admin/tutors");
            return response.data; // expects { tutors: [...] }
        } catch (error) {
            const msg = error.response?.data?.message || "Failed to fetch tutors.";
            return rejectWithValue(msg);
        }
    }
);

// ── Toggle tutor active/inactive status ──────────────────────────────────
export const toggleTutorStatus = createAsyncThunk(
    "tutors/toggleStatus",
    async (id, { rejectWithValue }) => {
        try {
            const response = await API_URL.patch(`/admin/tutors/${id}/toggle-status`);
            return response.data; // expects { tutor: { ...updatedTutor } }
        } catch (error) {
            const msg = error.response?.data?.message || "Failed to update tutor status.";
            return rejectWithValue(msg);
        }
    }
);


const initialState = {
    tutors: [],
    loading: false,
    actionLoading: null, // tutor id currently being toggled
    error: null,
};

const tutorsSlice = createSlice({
    name: 'tutors',
    initialState,
    reducers: {
        clearTutorsError: (state) => { state.error = null; },
    },
    extraReducers: (builder) => {
        builder
            // ── fetchApprovedTutors ──
            .addCase(fetchApprovedTutors.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchApprovedTutors.fulfilled, (state, action) => {
                state.loading = false;
                state.tutors = action.payload.tutors ?? action.payload;
            })
            .addCase(fetchApprovedTutors.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // ── toggleTutorStatus ──
            .addCase(toggleTutorStatus.pending, (state, action) => {
                state.actionLoading = action.meta.arg;
            })
            .addCase(toggleTutorStatus.fulfilled, (state, action) => {
                state.actionLoading = null;
                const updated = action.payload.tutor ?? action.payload;
                state.tutors = state.tutors.map((t) =>
                    t._id === updated._id ? updated : t
                );
            })
            .addCase(toggleTutorStatus.rejected, (state, action) => {
                state.actionLoading = null;
                state.error = action.payload;
            });
    },
});

export const { clearTutorsError } = tutorsSlice.actions;
export default tutorsSlice.reducer;