import { createSlice } from "@reduxjs/toolkit";
import { getCompanies } from "./companyAPI";

const initialState = {
  error: null,
  loading: false,
  data: [],
};

export const companySlice = createSlice({
  name: "companies",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getCompanies.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getCompanies.rejected, (state, action) => {
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    });
    builder.addCase(getCompanies.fulfilled, (state, { payload }) => {
      return {
        ...state,
        error: null,
        loading: false,
        data: payload.data,
      };
    });
  },
});

export const selectCompanies = (state) => state.companies;

export default companySlice.reducer;
