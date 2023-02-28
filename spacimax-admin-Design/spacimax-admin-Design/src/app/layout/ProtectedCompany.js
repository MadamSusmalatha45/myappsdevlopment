import { Toolbar, Box } from "@mui/material";
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import Header from "./Header";

// eslint-disable-next-line react/prop-types
function ProtectedCompany({ children }) {
  const userType = localStorage.getItem("userType");
  const location = useLocation();

  return userType === 'company' ? (
    <>
        {children}
    </>
  ) : (
    <Navigate to="/permission" replace state={{ path: location.pathname }} />
  );
}

export default ProtectedCompany;
