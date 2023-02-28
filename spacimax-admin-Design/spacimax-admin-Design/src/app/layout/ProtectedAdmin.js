import { Toolbar, Box } from "@mui/material";
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import Header from "./Header";

// eslint-disable-next-line react/prop-types
function ProtectedAdmin({ children }) {
  const userType = localStorage.getItem("userType");
  const location = useLocation();

  return userType === 'admin' ? (
    <>
        {children}
    </>
  ) : (
    <Navigate to="/permission" replace state={{ path: location.pathname }} />
  );
}

export default ProtectedAdmin;
