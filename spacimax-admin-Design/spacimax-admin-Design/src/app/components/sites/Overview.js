/* eslint-disable react/prop-types */
import React from "react";
import { Box, Grid, Typography } from "@mui/material";

export default function SiteOverviewCard({ title, subTitle}) {

  const getTitle = (text) => {
    const result = text.replace(/([A-Z])/g, " $1");
    return result.charAt(0).toUpperCase() + result.slice(1);

  }
  return (
    <Grid item xs={12} md={6} lg={4} px={2}>
      <Grid container >
        <Grid item xs={12}>
          <Box
            sx={{
              px: 4,
              py: 4,
              display: "flex",
              // boxShadow: "0px 2px 4px 3px rgba(0, 0, 0, 0.08)",
              boxShadow:" 0 3px 6px rgb(0 0 0 / 0%), 0 3px 6px rgb(0 0 0 / 16%) !important", 
              borderRadius: "10px",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              color: "#202E43",
              backgroundColor: "#DAEEEF",
              rowGap: "25px",
              "&:hover": {
                backgroundColor: "#2A4556",
                color: "white",
                fontWeight: "medium",
              },
            }}
          >
            <Typography
              variant="h5"
              sx={{
                textTransform: "capitalize",
                lineHeight: "1.5rem",
                fontWeight: "500",
                fontSize:"1.1rem",
              }}
            >
              {getTitle(title)}
            </Typography>

            <Typography
              variant="h4"
              sx={{
                textTransform: "capitalize",
                fontWeight: "600",
                lineHeight: "10px",
                fontSize:"1.7rem",

              }}
            >
              {subTitle}
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Grid>
  );
}
