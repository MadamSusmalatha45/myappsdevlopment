import { createSlice } from "@reduxjs/toolkit";
import {
  addCheckpoints,
  deleteCheckpoint,
  getSiteCheckpoints,
  getSites,
  getSiteTeam,
  getRoles,
  getGuards,
  getSitesInspectionForm,
  addQuestions,
  getSitesInspection,
  getSiteDocument,
  siteSaveDocument,
  siteDeleteDocument
} from "./sitesAPI";

const initialState = {
  error: null,
  loading: false,
  data: [],
  teams: {
    error: null,
    loading: false,
    data: [],
  },
  roles: {
    error: null,
    loading: false,
    data: [],
  },
  guards: {
    error: null,
    loading: false,
    data: [],
  },
  checkpoints: {
    error: null,
    loading: false,
    data: [],
  },
  inspectionForm: {
    error: null,
    loading: false,
    data: [],
  },
  inspection: {
    error: null,
    loading: false,
    data: [],
  },

  document: {
    error: null,
    loading: false,
    data: [],
  },
};

export const sitesSlice = createSlice({
  name: "sites",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getSites.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getSites.rejected, (state, action) => {
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    });
    builder.addCase(getSites.fulfilled, (state, { payload }) => {
      return {
        ...state,
        error: null,
        loading: false,
        data: payload.data,
      };
    });

    // Get Site Teams
    builder.addCase(getSiteTeam.pending, (state) => {
      state.teams.loading = true;
    });
    builder.addCase(getSiteTeam.rejected, (state, action) => {
      return {
        ...state,
        teams: {
          ...state.teams,
          loading: false,
          error: action.payload,
        },
      };
    });
    builder.addCase(getSiteTeam.fulfilled, (state, { payload }) => {
      return {
        ...state,
        teams: {
          ...state.teams,
          error: null,
          loading: false,
          data: payload.data,
        },
      };
    });

    //roles

    builder.addCase(getRoles.pending, (state) => {
      state.roles.loading = true;
    });
    builder.addCase(getRoles.rejected, (state, action) => {
      return {
        ...state,
        roles: {
          ...state.roles,
          loading: false,
          error: action.payload,
        },
      };
    });
    builder.addCase(getRoles.fulfilled, (state, { payload }) => {
      return {
        ...state,
        roles: {
          ...state.roles,
          error: null,
          loading: false,
          data: payload.data,
        },
      };
    });

    //Guards
    // Get Site Teams
    builder.addCase(getGuards.pending, (state) => {
      state.guards.loading = true;
    });
    builder.addCase(getGuards.rejected, (state, action) => {
      return {
        ...state,
        guards: {
          ...state.guards,
          loading: false,
          error: action.payload,
        },
      };
    });
    builder.addCase(getGuards.fulfilled, (state, { payload }) => {
      return {
        ...state,
        guards: {
          ...state.guards,
          error: null,
          loading: false,
          data: payload.data,
        },
      };
    });

    // Get Site Checkpoints
    builder.addCase(getSiteCheckpoints.pending, (state) => {
      state.checkpoints.loading = true;
    });
    builder.addCase(getSiteCheckpoints.rejected, (state, action) => {
      return {
        ...state,
        checkpoints: {
          ...state.checkpoints,
          loading: false,
          error: action.payload,
        },
      };
    });
    builder.addCase(getSiteCheckpoints.fulfilled, (state, { payload }) => {
      return {
        ...state,
        checkpoints: {
          ...state.checkpoints,
          error: null,
          loading: false,
          data: payload.data,
        },
      };
    });

    // Add Site Checkpoints
    builder.addCase(addCheckpoints.pending, (state) => {
      state.checkpoints.loading = true;
    });
    builder.addCase(addCheckpoints.rejected, (state, action) => {
      return {
        ...state,
        checkpoints: {
          ...state.checkpoints,
          loading: false,
          error: action.payload,
        },
      };
    });
    builder.addCase(addCheckpoints.fulfilled, (state, {}) => {
      return {
        ...state,
        checkpoints: {
          ...state.checkpoints,
          error: null,
          loading: false,
        },
      };
    });

    // Delete Site Checkpoints
    builder.addCase(deleteCheckpoint.pending, (state) => {
      state.checkpoints.loading = true;
    });
    builder.addCase(deleteCheckpoint.rejected, (state, action) => {
      return {
        ...state,
        checkpoints: {
          ...state.checkpoints,
          loading: false,
          error: action.payload,
        },
      };
    });
    builder.addCase(deleteCheckpoint.fulfilled, (state, {}) => {
      return {
        ...state,
        checkpoints: {
          ...state.checkpoints,
          error: null,
          loading: false,
        },
      };
    });

    // Get Site Inspection Form
    builder.addCase(getSitesInspectionForm.pending, (state) => {
      state.inspectionForm.loading = true;
    });
    builder.addCase(getSitesInspectionForm.rejected, (state, action) => {
      return {
        ...state,
        inspectionForm: {
          ...state.inspectionForm,
          loading: false,
          error: action.payload,
        },
      };
    });
    builder.addCase(getSitesInspectionForm.fulfilled, (state, { payload }) => {
      console.log("site inspection");
      return {
        ...state,
        inspectionForm: {
          ...state.inspectionForm,
          error: null,
          loading: false,
          data: payload.data,
        },
      };
    });

    
    // Get Site Inspection
    builder.addCase(getSitesInspection.pending, (state) => {
      state.inspection.loading = true;
    });
    builder.addCase(getSitesInspection.rejected, (state, action) => {
      return {
        ...state,
        inspection: {
          ...state.inspection,
          loading: false,
          error: action.payload,
        },
      };
    });
    builder.addCase(getSitesInspection.fulfilled, (state, { payload }) => {
      // console.log("site inspection");
      return {
        ...state,
        inspection: {
          ...state.inspection,
          error: null,
          loading: false,
          data: payload.data,
        },
      };
    });

    // Get Site Document
    builder.addCase(getSiteDocument.pending, (state) => {
      state.document.loading = true;
    });
    builder.addCase(getSiteDocument.rejected, (state, action) => {
      return {
        ...state,
        document: {
          ...state.document,
          loading: false,
          error: action.payload,
        },
      };
    });
    builder.addCase(getSiteDocument.fulfilled, (state, { payload }) => {
      console.log("site inspection");
      return {
        ...state,
        document: {
          ...state.document,
          error: null,
          loading: false,
          data: payload.data,
        },
      };
    });

    //delete site document
    builder.addCase(siteDeleteDocument.pending, (state) => {
      state.document.loading = true;
    });
    builder.addCase(siteDeleteDocument.rejected, (state, action) => {
      return {
        ...state,
        document: {
          ...state.document,
          loading: false,
          error: action.payload,
        },
      };
    });
    builder.addCase(siteDeleteDocument.fulfilled, (state, { payload }) => {
      console.log("site inspection");
      return {
        ...state,
        // document: {
        //   ...state.document,
        //   error: null,
        //   loading: false,
        //   data: payload.data,
        // },
      };
    });

    // Add Questions
    builder.addCase(addQuestions.pending, (state) => {
      state.inspectionForm.loading = true;
    });
    builder.addCase(addQuestions.rejected, (state, action) => {
      return {
        ...state,
        inspectionForm: {
          ...state.inspectionForm,
          loading: false,
          error: action.payload,
        },
      };
    });
    builder.addCase(addQuestions.fulfilled, (state, {}) => {
      return {
        ...state,
        inspectionForm: {
          ...state.inspectionForm,
          error: null,
          loading: false,
        },
      };
    });
  },
});

export const selectSites = (state) => state.sites;

export const selectSiteTeams = (state) => state.sites.teams;

export const selectRoles = (state) => state.sites.roles;

export const selectGuards = (state) => state.sites.guards;

export const selectSiteCheckpoints = (state) => state.sites.checkpoints;

export const selectSiteInspectionForm = (state) => state.sites.inspectionForm;

export const selectSiteInspection = (state) => state.sites.inspection;

export const selectSiteDocument = (state) => state.sites.document;

export default sitesSlice.reducer;
