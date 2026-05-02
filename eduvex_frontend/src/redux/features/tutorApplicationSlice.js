import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API_URL from '../../api/axios';

const initialState = {
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed',
    error: null,
    submittedData: null,
    form: {
        fullName: '',
        bio: '',
        skills: [],
        experience: '',
        categories: [],
        linkedin: '',
        portfolio: '',
        photo: null
    }
};

export const submitTutorApplication = createAsyncThunk(
    'tutor/submitApplication',
    async (formData, { rejectWithValue }) => {
        console.log('11111111111111111111111111111')
        try {
            console.log(formData,'formData')
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
            state.form = initialState.form;
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
            state.submittedData = action.payload;
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