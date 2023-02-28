import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../utils/axiosSetup";

export const getRoasters = createAsyncThunk(
  "company/getRosters",
  async (params, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/tasks", params);

      return res.data;
    } catch (error) {
      return rejectWithValue(error.message || error.msg);
    }
  }
);

export const addRoasters = createAsyncThunk(
  "company/addRoasters",
  async (
    { siteId, assignedUser, startDate, endDate, startTime, endTime, key },
    { rejectWithValue }
  ) => {
    try {
      const res = await axiosInstance.post("/company/roster", {
        siteId,
        assignedUser,
        key,
        startDate,
        endDate,
        startTime,
        endTime,
      });

      return res.data;
    } catch (error) {
      return rejectWithValue(error.message || error.msg);
    }
  }
);
