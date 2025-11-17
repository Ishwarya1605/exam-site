import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  courses: [],
  error: null,
};

const courseSlice = createSlice({
  name: "courses",
  initialState,
  reducers: {
    setCourses: (state, action) => {
      state.courses = action.payload;
    },

    addCourse: (state, action) => {
      state.courses.push(action.payload);
    },

    updateCourse: (state, action) => {
      const updated = action.payload;
      state.courses = state.courses.map((course) =>
        course.id === updated.id || course._id === updated._id
          ? updated
          : course
      );
    },

    deleteCourse: (state, action) => {
      const id = action.payload;
      state.courses = state.courses.filter(
        (course) => course.id !== id && course._id !== id
      );
    },

    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const {
  setCourses,
  addCourse,
  updateCourse,
  deleteCourse,
  setError,
} = courseSlice.actions;

export default courseSlice.reducer;





