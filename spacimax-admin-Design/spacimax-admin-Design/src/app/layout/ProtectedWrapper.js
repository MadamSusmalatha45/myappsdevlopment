import { Toolbar, Box } from "@mui/material";
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import Header from "./Header";

// eslint-disable-next-line react/prop-types
function ProtectedWrapper({ children }) {
  const user = localStorage.getItem("user");
  const location = useLocation();
  const userType = localStorage.getItem('userType')

  return user ? (
    <>
      <Header />
      <Box
        component="main"
        sx={{
          backgroundColor: "#F5F7F9",
          flexGrow: 1,
          minHeight: "100vh",
          p: 2,
        }}
      >
        <Toolbar />
        {children}
      </Box>
    </>
  ) : (
    <Navigate to={userType === 'admin' ? "/login" : "/company/login"} replace state={{ path: location.pathname }} />
  );
}

export default ProtectedWrapper;
