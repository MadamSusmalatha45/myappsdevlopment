import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlices";
import counterReducer from "../features/counter/counterSlice";
import sitesReducer from "../features/sites/sitesSlice";
import tasksReducer from "../features/tasks/tasksSlice";
import companiesReducer from "../features/company/companySlice";

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    auth: authReducer,
    sites: sitesReducer,
    tasks: tasksReducer,
    companies: companiesReducer,
  },
});

export default store;
