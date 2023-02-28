import React from "react";
import { Grid, Typography, Box, useMediaQuery, useTheme } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { Link } from "react-router-dom";

// eslint-disable-next-line react/prop-types
export default function SiteDetailCard({ title, large, url = null, height = '20px' }) {
  const theme = useTheme();
  const isTablet = useMediaQuery(theme.breakpoints.down("lg"));
  return (
    <Grid item xs={12} sm={6} md={4} px={1} py={1}>
      <Grid container>
        <Grid item xs={11} >
          <Box
            py={large ? 8 : 5}
            display="flex"
            justifyContent="center"
            sx={{
              paddingTop: "3rem",
              paddingBottom:" 3rem",
              backgroundColor: "white",
              // boxShadow: "0px 2px 4px 3px rgba(0, 0, 0, 0.08)",
              boxShadow:"0 3px 6px rgb(0 0 0 / 0%), 0 3px 6px rgb(0 0 0 / 16%) !important",
              borderRadius: "5px 0 0 5px",
              px: {
                xs: 4,
                md: 1,
              },
            }}
          >
            <Typography
              variant="h3"
              sx={{
                fontSize: "20px",
                m: "auto 0",
                textTransform: "capitalize",
                fontWeight: 400,
                lineHeight: height,
              }}
            >
              <Link
                style={{ textDecoration: "none", color: "inherit" }}
                to={url !== null ? url : "#"}
              >
                {title}
              </Link>
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={1}>
          <Box
            py={3}
            mr={isTablet ? 0 : 2}
            display="flex"
            alignItems="center"
            justifyContent="center"
            component={Link}
            to={url !== null ? url : "#"}
            sx={{
              backgroundColor: "#42505C",
              height: "100%",
              boxShadow: "0px 2px 4px 3px rgba(0, 0, 0, 0.08)",
              borderRadius: "0 5px  5px 0",
              width: {
                xs: "50%",
                sm: "70%",
                md : "60%"
              },
            }}
          >
            <ArrowForwardIcon
              fontSize="small"
              style={{
                stroke: "#ffffff",
                strokeWidth: "2px",
                fill: "#fff",
                fontSize: "0.8rem",
              }}
            />
          </Box>
        </Grid>
      </Grid>
    </Grid>
  );
}
