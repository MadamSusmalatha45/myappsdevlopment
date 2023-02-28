/* eslint-disable no-unused-vars */
import React, {useState, useEffect } from "react";
import { Alert, Box, Button, Grid, TextField, Typography,Link } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {Navigate, useLocation, useNavigate } from "react-router-dom";
import { grey, red } from "@mui/material/colors";
import LoginBgImage from "../../../assets/images/login.jpg";
import Logo from "../../../assets/images/logo.png"
import { selectAuth } from "../../../features/auth/authSlices";
import { loginUser, loginUserOtp } from "../../../features/auth/authAPI";
import { Controller, useForm } from "react-hook-form";

function Login() {
  const navigateTo = useNavigate();
  const { state } = useLocation();
  const { loading, error, isAuthenticated } = useSelector(selectAuth);
  const token = localStorage.getItem('token')
  const userType = localStorage.getItem('userType')
  const [otpForm, setOtpForm] = useState(false)
  const [email, setEmail] = useState('')
  const dispatch = useDispatch();

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      otp: "",
    },
  });

  // const onSubmit = (form) => {
  //   dispatch(loginUser({ ...form, otp: parseInt(form.otp) }));
  //   if (isAuthenticated){
  //       window.open(window.location.origin,"_self")
  //   }
  // };


  const handleLogin = (form) => {
    dispatch(loginUserOtp({ ...form, otp: parseInt(form.otp)}))
    setOtpForm(true)
    if (isAuthenticated){
      window.open(window.location.origin,"_self")
  }
  }



  
  const handleOtp = async(form) => {
    await dispatch(loginUser({ ...form,otp: parseInt(form.otp)}))
    setOtpForm(true)
    if (isAuthenticated){
      window.open(window.location.origin ,"_self")
      // window.location.reload();
  }
}
  const handleUserOtp = (form) => {
   
    // dispatch(loginUserOtp({ ...form}))
  }

  useEffect(() => {
    
    if (isAuthenticated) {
      // return navigateTo(state?.path || "/");
      window.open(window.location.origin ,"_self")
    }
    // return (token === null ?  navigateTo(state?.path) : (userType === 'admin' ? navigateTo('/') : navigateTo('/company')));
    // console.log(token);
    // return (token === null ?  navigateTo('/login'): navigateTo(state?.path));
    // if(token === null){
    //   return navigateTo(state?.path)
    // }
    // else{
    //   return navigateTo('/')
    // }
  }, [token, isAuthenticated]);

 
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
              backgroundRepeat:"no-repeat",
              backgroundSize: '100% 100vh'
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
              <img alt="logo" height={"120px"} width={"120px"} src={Logo} /> 
              </Grid>
              <Grid item xs={12} justifyContent="center" display="flex">
                <Typography
                  component="h6"
                  variant="h4"
                  fontWeight="600"
                  color={grey[900]}
                >
                 Secuber
                </Typography>
              </Grid>
              <Grid item xs={12} justifyContent="center" display="flex">
                <Typography component="h6" variant="h5" color={grey[800]}>
                  Admin Login
                </Typography>
              </Grid>
            </Grid>
            {error && (
              <Alert severity="error">Login Failed! Try Again {error}</Alert>
            )}
            <Grid
              container
              spacing={2}
              justifyContent="center"
              my={3}
              component="form"
            >
              {
                !otpForm &&
                <Grid item xs={7} justifyContent="center" display="flex">
                <Controller
                  name={"email"}
                  control={control}
                  rules={{
                    required: true,
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid Email Address",
                    },  
                  }}
                  render={({ field: { onChange, value } }) => (
                    <TextField
                      fullWidth
                      label="Email"
                      variant="standard"
                      type="email"
                      required
                      onChange={onChange}
                      value={value}
                      sx={{ borderColor: red[100] }}
                      error={!!errors.email}
                      helperText={errors.email ? errors.email?.message : null}
                    />
                  )}
                />
              </Grid>
              }
             
              {
                otpForm &&
              <Grid item xs={7} justifyContent="center" display="flex">
                <Controller
                  name="otp"
                  control={control}
                  rules={{
                    required: "An OTP is Required",
                    minLength: {
                      value: 4,
                      message: "Value should be more than 4!",
                    },
                    maxLength: {
                      value: 4,
                      message: "Value can't be more than 4!",
                    },
                  }}
                  render={({ field: { onChange, value } }) => (
                    <TextField
                      fullWidth
                      label="Enter OTP"
                      id="otp"
                      variant="standard"
                      name="otp"
                      type="text"
                      required
                      onChange={onChange}
                      value={value}
                      error={!!errors.otp}
                      helperText={errors.otp ? errors.otp?.message : null}
                    />
                  )}
                />
              </Grid>
              }
             
             {
              otpForm &&
              <Grid item xs={7} justifyContent="end" display="flex">
                <Button sx={{ float: "right"}} onClick={handleUserOtp}>OTP</Button>
              </Grid>
             }
             {
              otpForm && 
              <Grid item xs={7} justifyContent="center" display="flex">
                <Button sx={{ float: "left" }} onClick={handleSubmit(handleUserOtp)}>Resend OTP</Button>
              </Grid>
             }
              
              {/* 
             <Grid item xs={7} justifyContent="center" display="flex">
                <Controller
                  name="otp"
                  control={control}
                  rules={{
                    required: "An OTP is Required",
                    minLength: {
                      value: 4,
                      message: "Value can't be more than 4!",
                    },
                    maxLength: {
                      value: 4,
                      message: "Value can't be less than 4!",
                    },
                  }}
                  render={({ field: { onChange, value } }) => (
                    <TextField
                      fullWidth
                      label="Enter OTP"
                      id="otp"
                      variant="standard"
                      name="otp"
                      type="number"
                      required
                      onChange={onChange}
                      value={value}
                      error={!!errors.otp}
                      helperText={errors.otp ? errors.otp?.message : null}
                    />
                  )}
                />
              </Grid> 
*/}

              {/* <Grid item xs={7} justifyContent="end" display="flex">
                <Button sx={{ float: "right"}} onClick={handleUserOtp}>OTP</Button>
              </Grid> */}
              {/* <Grid item xs={7} justifyContent="center" display="flex">
                <Button sx={{ float: "left" }} onClick={handleSubmit(handleUserOtp)}>Resend OTP</Button>
              </Grid> */}
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
                  variant="contained"
                  onClick={otpForm ? handleSubmit(handleOtp) : handleSubmit(handleLogin)}
                  disabled={loading}
                >
                  {otpForm ? 'Verify' : 'Login'}
                </Button>
              </Grid>
              <Grid item xs={7} justifyContent="center" display="flex">
                  <Link href="/company/login" underline="always" sx={{fontWeight : 'bold', color : 'gray', textDecorationColor: 'gray'}}>
                    Company Login
                  </Link>
              </Grid>
            </Grid>
            
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Login;
