import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  students: [],
  loading: true,
  searchTerm: "",
  sortAsc: true,
  currentPage: 1,
  studentsPerPage: 5,
};

export const studentSlice = createSlice({
  name: "students",
  initialState,
  reducers: {
    setStudents: (state, action) => {
      state.students = action.payload;
      state.loading = false;
    },
    updateStudent: (state, action) => {
      const { id, data } = action.payload;
      state.students = state.students.map((s) =>
        s.id === id ? { ...s, ...data } : s
      );
    },
    deleteStudent: (state, action) => {
      state.students = state.students.filter((s) => s.id !== action.payload);
    },
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
      state.currentPage = 1;
    },
    toggleSort: (state) => {
      state.sortAsc = !state.sortAsc;
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
  },
});

export const {
  setStudents,
  updateStudent,
  deleteStudent,
  setSearchTerm,
  toggleSort,
  setCurrentPage,
} = studentSlice.actions;

export default studentSlice.reducer;


