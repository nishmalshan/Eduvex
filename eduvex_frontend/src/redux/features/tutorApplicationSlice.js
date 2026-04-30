import { createSlice, createAsyncThunk, isRejectedWithValue } from '@reduxjs/toolkit';
import API_URL from '../../api/axios';

const initialState = {
    application: null,
    loading: false,
    error: null,
};

export const submitTutorApplication = createAsyncThunk(
    'tutor/submitApplication',
    async (FormData, { isRejectedWithValue }) => {
        try {
            console.log(FormData,'FormData')
            const payload = new FormData();

            payload.append('fullName', FormData.fullName.trim());
            payload.append('bio', FormData.bio.trim());
            payload.append('experience', FormData.experience);
            payload.append('linkedin', FormData.linkedin.trim());
            payload.append('portfolio', FormData.portfolio.trim());

            payload.append('skills', JSON.stringify(FormData.skills));
            payload.append('categories', JSON.stringify(FormData.categories));

            if (FormData.photo) {
                payload.append('photo', FormData.photo);
            }

            const response = await API_URL.post('/tutor-application', payload);
            return response.data;
        } catch (error) {
            // axios wraps 4xx/5xx in err.response
            const serverError = err.response?.data;
            const errorMsg = serverError?.errors
                ? serverError.errors.join(' - ')
                : serverError?.message || 'Something went wrong. Please try again.';
            return rejectWithValue(errorMsg);
        }
    }
)


const tutorApplicationSlice = createSlice({
    name: 'tutorApplication',
    initialState,

    reducers: {
        // Update any single form field
        updateField(state, action) {
            const { field, value } = action.payload;
            state.form[field] = value;
        },

        resetApplication(state) {
            state.status = 'idle';
            state.error = null;
            state.submittedData = null;
        },

        clearError(state) {
            state.error = null;
            state.status = 'idle';
        }
    },

    extraReducers: (builder) => {
        builder
        .addCase(submitTutorApplication.pending, (state) => {
            state.status = 'loading';
            state.error = null;
        })
        .addCase(submitTutorApplication.fulfilled, (state, action) => {
            state.status = 'succeeded';
            state.submitTutorApplication = action.payload;
            state.error = null;
        })
        .addCase(submitTutorApplication.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.payload || 'Failed to submit application. Please try again.';
        })
    }
})

export const { updateField, resetApplication, clearError } = tutorApplicationSlice.actions;
export default tutorApplicationSlice.reducer;