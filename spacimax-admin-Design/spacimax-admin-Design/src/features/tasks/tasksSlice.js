import { createSlice } from "@reduxjs/toolkit";
import { getTasks, addTasks } from "./tasksAPI";

const initialState = {
  error: null,
  loading: false,
  data: [],
  teams: {
    error: null,
    loading: false,
    data: [],
  },
};

export const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getTasks.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getTasks.rejected, (state, action) => {
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    });
    builder.addCase(getTasks.fulfilled, (state, { payload }) => {
      return {
        ...state,
        error: null,
        loading: false,
        data: payload.data,
      };
    });

    // Add Site Checkpoints
    builder.addCase(addTasks.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(addTasks.rejected, (state, action) => {
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    });
    builder.addCase(addTasks.fulfilled, (state, {}) => {
      return {
        ...state,
        error: null,
        loading: false,
      };
    });
  },
});

export const selectTasks = (state) => state.tasks;

export default tasksSlice.reducer;
