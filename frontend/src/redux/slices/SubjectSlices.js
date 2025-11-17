import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  subjects: [],
  error: null,
};

const subjectSlice = createSlice({
  name: "subjects",
  initialState,
  reducers: {
    setSubjects: (state, action) => {
      state.subjects = action.payload;
    },

    addSubject: (state, action) => {
      state.subjects.push(action.payload);
    },

    updateSubject: (state, action) => {
      const updated = action.payload;
      state.subjects = state.subjects.map((s) =>
        s.id === updated.id || s._id === updated._id ? updated : s
      );
    },

    deleteSubject: (state, action) => {
      const id = action.payload;
      state.subjects = state.subjects.filter(
        (s) => s.id !== id && s._id !== id
      );
    },

    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const {
  setSubjects,
  addSubject,
  updateSubject,
  deleteSubject,
  setError,
} = subjectSlice.actions;

export default subjectSlice.reducer;
