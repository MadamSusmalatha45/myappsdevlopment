import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../utils/axiosSetup";

export const getTasks = createAsyncThunk(
  "tasks/getTasks",
  async (params, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/tasks", params);

      return res.data;
    } catch (error) {
      return rejectWithValue(error.message || error.msg);
    }
  }
);

export const addTasks = createAsyncThunk(
  "tasks/addTasks",
  async (
    { companyId, title, dueDate, timeDue, siteId, description },
    { rejectWithValue }
  ) => {
    try {
      const res = await axiosInstance.post("/tasks", {
        companyId,
        title,
        dueDate,
        timeDue,
        siteId,
        description,
      });

      return res.data;
    } catch (error) {
      return rejectWithValue(error.message || error.msg);
    }
  }
);
