import { createSlice } from "@reduxjs/toolkit";
import { getRoasters, addRoasters } from "./roasterAPI";

const initialState = {
  error: null,
  loading: false,
  data: [],
  roasters: {
    error: null,
    loading: false,
    data: [],
  },
};

export const roastersSlice = createSlice({
  name: "roasters",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(addRoasters.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getRoasters.rejected, (state, action) => {
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    });
    builder.addCase(getRoasters.fulfilled, (state, { payload }) => {
      return {
        ...state,
        error: null,
        loading: false,
        data: payload.data,
      };
    });

    // Add Site Checkpoints
    builder.addCase(addRoasters.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(addRoasters.rejected, (state, action) => {
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    });
    builder.addCase(addRoasters.fulfilled, (state, {}) => {
      return {
        ...state,
        error: null,
        loading: false,
      };
    });
  },
});

export const selectRoasters = (state) => state.roasters;

export default roasterSlice.reducer;
