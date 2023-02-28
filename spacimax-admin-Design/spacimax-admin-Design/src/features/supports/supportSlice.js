import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../utils/axiosSetup";
import { toast } from "react-toastify";


export const getSupport = createAsyncThunk(
  "support/getSupport",
  async ({ rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/support");
      toast.success("Support list retrieved Successfully");
      console.log('SUPPORTS')
      console.log(response)
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
 }
);


export const createSupport = createAsyncThunk(
  "support/createSupport",
  async ({ userId, issue, issueDate,statusId }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/tour", updatedTourData);
      toast.success("Support added Successfully");
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);


export const updateSupport = createAsyncThunk(
  "support/updateSupport",
  async ({ id, updatedSupportData}, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch(`/support/${id}`, updatedTourData);
      toast.success("Support query Updated Successfully");
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);


export const deleteSupport = createAsyncThunk(
  "support/deleteSupport",
  async ({ id }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(`/support/${id}`);
      toast.success("Support query Deleted Successfully");
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);


const supportSlice = createSlice({
  name: "support",
  initialState: {
    support: {},
    supports: [],
    currentPage: 1,
    numberOfPages: null,
    error: "",
    loading: false,
  },

  reducers: {
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
  },

  extraReducers: {
    [getSupport.pending]: (state, action) => {
        state.loading = true;
    },

    [getSupport.fulfilled]: (state, action) => {
        state.loading = false;
        state.supports = [action.payload];
    },

    [getSupport.rejected]: (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
    },

    [createSupport.pending]: (state, action) => {
      state.loading = true;
    },
    [createSupport.fulfilled]: (state, action) => {
      state.loading = false;
      state.supports = [action.payload];
    },
    [createSupport.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload.message;
    },
   
    [updateSupport.pending]: (state, action) => {
      state.loading = true;
    },

    [updateSupport.fulfilled]: (state, action) => {
      state.loading = false;
      const {
        arg: { id },
      } = action.meta;
      if (id) {
        state.supports = state.supports.map((item) =>
          item._id === id ? action.payload : item
        );
      }
    },

    [updateSupport.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload.message;
    },

    [deleteSupport.pending]: (state, action) => {
      state.loading = true;
    },

    [deleteSupport.fulfilled]: (state, action) => {
      state.loading = false;
      const {
        arg: { id },
      } = action.meta;
      if (id) {
        state.support = state.support.filter((item) => item._id !== id);
      }
    },

    [deleteSupport.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload.message;
    },
  },
});

export const { setCurrentPage } = supportSlice.actions;
export default supportSlice.reducer;