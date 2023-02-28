import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../utils/axiosSetup";

export const getCompanies = createAsyncThunk(
  "companies/getCompanies",
  async (params, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/companies", params);

      return res.data;
    } catch (error) {
      return rejectWithValue(error.message || error.msg);
    }
  }
);
