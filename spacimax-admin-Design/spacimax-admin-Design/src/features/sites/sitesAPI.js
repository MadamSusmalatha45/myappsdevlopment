import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { axiosInstance } from "../../utils/axiosSetup";


export const getSites = createAsyncThunk(
  "sites/getSites",
  async (params, { rejectWithValue }) => {
    try {
      let userType = localStorage.getItem('userType')
      const res = await axiosInstance.get(userType === 'admin' ? "/sites" : "/company/sites", params);
      // console.log(params)
      // console.log('SITES ************************************************')
      // console.log(res)
      // console.log('SITES ************************************************')
      localStorage.setItem("siteId", res.data.data[0].siteId);
      // console.log(res.data.data[0].siteId)
      return res.data;
    } catch (error) {
      if(error.response.status === 500 || error.response.status === 401){
         toast.error(error.response.data.message)
      }
      return rejectWithValue(error.message || error.msg);
    }
  }
);

export const getSiteTeam = createAsyncThunk(
  "sites/getSiteTeam",
  async ({ id, ...params }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(`/sites/site-team/${id}`, params);
      // console.log(res.data);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.message || error.msg);
    }
  }
);
export const getRoles = createAsyncThunk(
  "sites/roles",
  async ({ id, ...params }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(`/roles`, params);
      // console.log(res.data);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.message || error.msg);
    }
  }
);

export const getGuards = createAsyncThunk(
  "guards",
  async ({ id, ...params }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(`/guards`, params);
      // console.log(res.data);
      return res.data;
    } catch (error) {
      if(error.response.status === 500 || error.response.status === 401){
        toast.error(error.response.data.message)
      }
      return rejectWithValue(error.message || error.msg);
    }
  }
);

export const addSiteTeam = createAsyncThunk(
  "sites/addSiteTeam",
  async ({ email, id }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post(`/sites/add-member/${id}`, {email});
      console.log(res.data);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.message || error.msg);
    }
  }
);

export const getSiteCheckpoints = createAsyncThunk(
  "sites/getSiteCheckpoints",
  async ({ id, ...params }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(`/checkpoints?siteId=${id}`, params);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.message || error.msg);
    }
  }
);

export const addCheckpoints = createAsyncThunk(
  "sites/addCheckpoints",
  async ({ name, longitude, latitude, siteId }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("/checkpoints", {
        name,
        longitude,
        latitude,
        siteId,
      });

      return res.data;
    } catch (error) {
      return rejectWithValue(error.message || error.msg);
    }
  }
);

export const deleteCheckpoint = createAsyncThunk(
  "sites/checkpoints",
  async ({ id, ...params }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.delete(`/checkpoints/${id}`);

      return res.data;
    } catch (error) {
      return rejectWithValue(error.message || error.msg);
    }
  }
);

export const getSitesInspectionForm = createAsyncThunk(
  "sites/getSitesInspectionForm",
  async ({ id }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(`/report-questions?reportType=${id}`);

      return res.data;
    } catch (error) {
      return rejectWithValue(error.message || error.msg);
    }
  }
);

export const getSitesInspection = createAsyncThunk(
  "sites/getSitesInspection",
  async ({ siteId }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(`/report-types?siteId=${siteId}`, siteId);

      return res.data;
    } catch (error) {
      return rejectWithValue(error.message || error.msg);
    }
  }
);

export const addQuestions = createAsyncThunk(
  "sites/addQuestions",
  async ({ question, type, notes, reportType }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("/report-questions", {
        question,
        type,
        notes,
        reportType,
      });

      return res.data;
    } catch (error) {
      return rejectWithValue(error.message || error.msg);
    }
  }
);

export const siteInspection = createAsyncThunk(
  "sites/siteInspection",
  async ({ name, category, description, position, siteId }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("/report-types", {
        name,
        category,
        description,
        position,
        siteId,
      });

      return res.data;
    } catch (error) {
      return rejectWithValue(error.message || error.msg);
    }
  }
);

export const getSiteDocument = createAsyncThunk(
  "sites/getSiteDocument",
  async ( {siteId}, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(`/user/site-specific-induction?siteId=${siteId}`);
      console.log(res.data.data);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.message || error.msg);
    }
  }
);

export const siteSaveDocument = createAsyncThunk(
  "sites/siteSaveDocument",
  async ({category,access, file, siteId }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("/user/site-specific-induction", {
        category: category,
        visibility: access,
        picture: file,
        siteId,
      });
      console.log(res.data, "res.data")
      return res.data;
    } catch (error) {
      return rejectWithValue(error.message || error.msg);
    }
  }
);

export const siteDeleteDocument = createAsyncThunk(
  "sites/siteSaveDocument",
  async ({id, ...params }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.delete(`/user/site-specific-induction/${id}`);
      console.log(res.data, "res.data")
      return res.data;
    } catch (error) {
      return rejectWithValue(error.message || error.msg);
    }
  }
);
