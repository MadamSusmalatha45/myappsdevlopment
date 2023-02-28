/* eslint-disable no-unused-vars */
import React from "react";
import { Box, Button, Grid, TextField, Typography } from "@mui/material";
import { connect } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { grey, red } from "@mui/material/colors";
import LoginBgImage from "../../../../assets/images/login.jpg";

function SchedulerLogin(_props) {
  const navigateTo = useNavigate();
  const { state } = useLocation();

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem("user", "Authenticated");
    navigateTo(state?.path || "/");
  };
  return (
    <Box sx={{ height: "100vh", display: "flex", width: "100%" }}>
      <Grid container spacing={2}>
        <Grid item xs={0} md={7}>
          <Box
            sx={{
              height: "100vh",
              width: "100%",
              flexGrow: 2,
              backgroundColor: "#E0E7FF",
              backgroundImage: `url(${LoginBgImage})`,
              backgroundSize: "100%",
            }}
          />
        </Grid>
        <Grid item xs={12} md={5}>
          <Box
            display="flex"
            alignItems="center"
            height="100%"
            justifyContent="center"
            flexDirection="column"
          >
            <Grid container spacing={2} justifyContent="center">
              <Grid item xs={12} justifyContent="center" display="flex">
                <Typography
                  component="h4"
                  variant="h3"
                  fontWeight="700"
                  color={grey[900]}
                >
                  Secuber
                </Typography>
              </Grid>
              <Grid item xs={12} justifyContent="center" display="flex">
                <Typography component="h6" variant="h5" color={grey[800]}>
                  Scheduler Login
                </Typography>
              </Grid>
            </Grid>
            <Grid container spacing={2} justifyContent="center" my={3}>
              <Grid item xs={7} justifyContent="center" display="flex">
                <TextField
                  fullWidth
                  label="Email"
                  id="email"
                  variant="standard"
                  sx={{ borderColor: red[100] }}
                />
              </Grid>
              <Grid item xs={7} justifyContent="center" display="flex">
                <TextField
                  fullWidth
                  label="Enter OTP"
                  id="otp"
                  variant="standard"
                />
              </Grid>
              <Grid item xs={7} justifyContent="end" display="flex">
                <Button sx={{ float: "right", mt: 2 }}>Resend OTP</Button>
              </Grid>
              <Grid item xs={7} justifyContent="center" display="flex">
                <Typography component="p" variant="subtitle2" color={grey[500]}>
                  We will send you an One Time Password on your email
                </Typography>
              </Grid>
              <Grid item xs={7} justifyContent="center" display="flex">
                <Button
                  sx={{
                    float: "right",
                    mt: 2,
                    backgroundColor: "#42505C",
                    color: "white",
                    px: 5,
                    "&:hover": {
                      backgroundColor: "#343636",
                    },
                  }}
                  type="submit"
                  variant="contained"
                  onClick={handleSubmit}
                >
                  Login
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}

const mapStateToProps = (_state) => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(SchedulerLogin);
