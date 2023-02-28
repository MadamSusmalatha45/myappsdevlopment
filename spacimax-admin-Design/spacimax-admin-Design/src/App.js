import React from "react";
import { Box, CssBaseline } from "@mui/material";
import PageRoutes from "./app/routes";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
function App() {
  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <ToastContainer />
      <PageRoutes />
    </Box>
  );
}

export default App;
