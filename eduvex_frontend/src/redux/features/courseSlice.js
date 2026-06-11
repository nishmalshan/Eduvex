// store/slices/courseSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import API_URL from "../../api/axios";

const BASE_URL = import.meta.env.VITE_API_URL || "/api";

// ─── Async Thunks ────────────────────────────────────────────────────────────

export const fetchTutorCourses = createAsyncThunk(
  "courses/fetchTutorCourses",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await API_URL.get(`/tutor/courses/tutor/my-courses`);
      return data.courses;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch courses");
    }
  }
);

export const createCourse = createAsyncThunk(
  "courses/createCourse",
  async (courseData, { rejectWithValue }) => {
    try {
      const { data } = await API_URL.post(`/tutor/courses`, courseData);
      return data.course;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to create course");
    }
  }
);

export const updateCourse = createAsyncThunk(
  "courses/updateCourse",
  async ({ courseId, updates }, { rejectWithValue }) => {
    try {
      const { data } = await API_URL.put(`/tutor/courses/${courseId}`, updates);
      return data.course;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to update course");
    }
  }
);

export const deleteCourse = createAsyncThunk(
  "courses/deleteCourse",
  async (courseId, { rejectWithValue }) => {
    try {
      await API_URL.delete(`/tutor/courses/${courseId}/delete`);
      return courseId;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to delete course");
    }
  }
);

export const publishCourse = createAsyncThunk(
  "courses/publishCourse",
  async (courseId, { rejectWithValue }) => {
    try {
      const { data } = await API_URL.patch(`/tutor/courses/${courseId}/publish`);
      return data.course;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to publish course");
    }
  }
);

export const fetchCourseById = createAsyncThunk(
  "courses/fetchCourseById",
  async (courseId, { rejectWithValue }) => {
    try {
      const { data } = await API_URL.get(`/tutor/courses/${courseId}`);
      return data.course;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch course");
    }
  }
);

export const addSection = createAsyncThunk(
  "courses/addSection",
  async ({ courseId, sectionData }, { rejectWithValue }) => {
    try {
      const { data } = await API_URL.post(
        `/tutor/courses/${courseId}/sections`,
        sectionData
      );
      return data.course;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to add section");
    }
  }
);

export const addLecture = createAsyncThunk(
  "courses/addLecture",
  async ({ courseId, sectionId, lectureData }, { rejectWithValue }) => {
    try {
      const { data } = await API_URL.post(
        `/tutor/courses/${courseId}/sections/${sectionId}/lectures`,
        lectureData
      );
      return data.course;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to add lecture");
    }
  }
);

// ─── Initial State ────────────────────────────────────────────────────────────

const initialState = {
  // List view
  courses: [],
  totalCourses: 0,

  // Detail view / editor
  activeCourse: null,

  // UI state
  loading: false,
  detailLoading: false,
  actionLoading: false, // for publish/delete actions
  error: null,
  actionError: null,
  successMessage: null,

  // Filters & pagination
  filters: {
    status: "all",      // all | draft | pending_review | published | archived
    search: "",
    page: 1,
    limit: 10,
    sortBy: "createdAt",
    sortOrder: "desc",
  },

  // Onboarding
  onboardingCompleted: false,
};

// ─── Slice ────────────────────────────────────────────────────────────────────

const courseSlice = createSlice({
  name: "courses",
  initialState,
  reducers: {
    setFilter(state, action) {
      state.filters = { ...state.filters, ...action.payload, page: 1 };
    },
    setPage(state, action) {
      state.filters.page = action.payload;
    },
    clearError(state) {
      state.error = null;
      state.actionError = null;
    },
    clearSuccess(state) {
      state.successMessage = null;
    },
    setActiveCourse(state, action) {
      state.activeCourse = action.payload;
    },
    clearActiveCourse(state) {
      state.activeCourse = null;
    },
    completeOnboarding(state) {
      state.onboardingCompleted = true;
    },
    resetOnboarding(state) {
      state.onboardingCompleted = false;
    },
    // Optimistic update helper
    updateCourseLocally(state, action) {
      const idx = state.courses.findIndex((c) => c._id === action.payload._id);
      if (idx !== -1) state.courses[idx] = action.payload;
    },
  },
  extraReducers: (builder) => {
    // fetchTutorCourses
    builder
      .addCase(fetchTutorCourses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTutorCourses.fulfilled, (state, action) => {
        state.loading = false;
        state.courses = action.payload;
        state.totalCourses = action.payload.length;
      })
      .addCase(fetchTutorCourses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // createCourse
    builder
      .addCase(createCourse.pending, (state) => {
        state.actionLoading = true;
        state.actionError = null;
      })
      .addCase(createCourse.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.courses.unshift(action.payload);
        state.totalCourses += 1;
        state.successMessage = "Course created successfully!";
        state.activeCourse = action.payload;
      })
      .addCase(createCourse.rejected, (state, action) => {
        state.actionLoading = false;
        state.actionError = action.payload;
      });

    // updateCourse
    builder
      .addCase(updateCourse.pending, (state) => {
        state.actionLoading = true;
        state.actionError = null;
      })
      .addCase(updateCourse.fulfilled, (state, action) => {
        state.actionLoading = false;
        const idx = state.courses.findIndex((c) => c._id === action.payload._id);
        if (idx !== -1) state.courses[idx] = action.payload;
        if (state.activeCourse?._id === action.payload._id) {
          state.activeCourse = action.payload;
        }
        state.successMessage = "Course updated successfully!";
      })
      .addCase(updateCourse.rejected, (state, action) => {
        state.actionLoading = false;
        state.actionError = action.payload;
      });

    // deleteCourse
    builder
      .addCase(deleteCourse.pending, (state) => {
        state.actionLoading = true;
        state.actionError = null;
      })
      .addCase(deleteCourse.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.courses = state.courses.filter((c) => c._id !== action.payload);
        state.totalCourses -= 1;
        if (state.activeCourse?._id === action.payload) state.activeCourse = null;
        state.successMessage = "Course deleted.";
      })
      .addCase(deleteCourse.rejected, (state, action) => {
        state.actionLoading = false;
        state.actionError = action.payload;
      });

    // publishCourse
    builder
      .addCase(publishCourse.pending, (state) => {
        state.actionLoading = true;
      })
      .addCase(publishCourse.fulfilled, (state, action) => {
        state.actionLoading = false;
        const idx = state.courses.findIndex((c) => c._id === action.payload._id);
        if (idx !== -1) state.courses[idx] = action.payload;
        state.successMessage = "Course submitted for review!";
      })
      .addCase(publishCourse.rejected, (state, action) => {
        state.actionLoading = false;
        state.actionError = action.payload;
      });

    // fetchCourseById
    builder
      .addCase(fetchCourseById.pending, (state) => {
        state.detailLoading = true;
      })
      .addCase(fetchCourseById.fulfilled, (state, action) => {
        state.detailLoading = false;
        state.activeCourse = action.payload;
      })
      .addCase(fetchCourseById.rejected, (state, action) => {
        state.detailLoading = false;
        state.error = action.payload;
      });

    // addSection / addLecture → update whole course
    builder
      .addCase(addSection.fulfilled, (state, action) => {
        const idx = state.courses.findIndex((c) => c._id === action.payload._id);
        if (idx !== -1) state.courses[idx] = action.payload;
        state.activeCourse = action.payload;
      })
      .addCase(addLecture.fulfilled, (state, action) => {
        const idx = state.courses.findIndex((c) => c._id === action.payload._id);
        if (idx !== -1) state.courses[idx] = action.payload;
        state.activeCourse = action.payload;
      });
  },
});

// ─── Actions ──────────────────────────────────────────────────────────────────
export const {
  setFilter,
  setPage,
  clearError,
  clearSuccess,
  setActiveCourse,
  clearActiveCourse,
  completeOnboarding,
  resetOnboarding,
  updateCourseLocally,
} = courseSlice.actions;

// ─── Selectors ────────────────────────────────────────────────────────────────
export const selectAllCourses = (state) => state.courses.courses;
export const selectActiveCourse = (state) => state.courses.activeCourse;
export const selectCourseLoading = (state) => state.courses.loading;
export const selectCourseActionLoading = (state) => state.courses.actionLoading;
export const selectCourseError = (state) => state.courses.error;
export const selectCourseActionError = (state) => state.courses.actionError;
export const selectCourseSuccess = (state) => state.courses.successMessage;
export const selectCourseFilters = (state) => state.courses.filters;
export const selectTotalCourses = (state) => state.courses.totalCourses;
export const selectOnboardingCompleted = (state) => state.courses.onboardingCompleted;

// Filtered + sorted selector
export const selectFilteredCourses = (state) => {
  const { courses, filters } = state.courses;
  let result = [...courses];

  if (filters.status !== "all") {
    result = result.filter((c) => c.status === filters.status);
  }
  if (filters.search) {
    const q = filters.search.toLowerCase();
    result = result.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.category?.name?.toLowerCase().includes(q)
    );
  }
  result.sort((a, b) => {
    const dir = filters.sortOrder === "asc" ? 1 : -1;
    if (filters.sortBy === "createdAt") {
      return dir * (new Date(a.createdAt) - new Date(b.createdAt));
    }
    if (filters.sortBy === "enrollmentCount") {
      return dir * (a.enrollmentCount - b.enrollmentCount);
    }
    if (filters.sortBy === "rating") {
      return dir * (a.rating.average - b.rating.average);
    }
    return 0;
  });

  // Pagination
  const start = (filters.page - 1) * filters.limit;
  return result.slice(start, start + filters.limit);
};

export default courseSlice.reducer;