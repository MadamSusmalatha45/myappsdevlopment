import React from "react";
import {
  Box,
  FormControl,
  Grid,
  FormLabel,
  TextField,
  Button,
} from "@mui/material";
import MuiPhoneNumber from "material-ui-phone-number";

import { makeStyles } from "@mui/styles";
import BasicSelector from "../../common/Selector";
import PageTitle from "../../common/PageTitle";

const useStyles = makeStyles(() => ({
  buttoRoot: {
    borderColor: "#707070 !important;",
    color: "#202E43 !important;",
    borderRadius: "8px !important;",
    fontSize: "16px  !important;",
    textTransform: "none !important;",
    padding: "0px 30px !important;",
    marginRight: "15px !important;",
    "&:hover": {
      backgroundColor: " #42505C !important;",
      color: "white !important",
    },
  },
}));

export default function AddUser() {
  const classes = useStyles();

  const userTypes = ["User", "Admin"];
  return (
    <Box>
      <PageTitle title="User List" />
      <Box ml={5}>
        <FormControl sx={{ display: "flex" }}>
          <Grid container alignItems="center">
            <Grid item xs={1}>
              <FormLabel
                style={{
                  fontSize: "larger",
                  color: "black",
                }}
                component="h4"
              >
                Name
              </FormLabel>
            </Grid>
            <Grid item xs={3} py={2}>
              <TextField
                sx={{ background: "white" }}
                fullWidth
                placeholder="Name"
              />
            </Grid>
          </Grid>
        </FormControl>
        <FormControl sx={{ display: "flex" }}>
          <Grid container alignItems="center">
            <Grid item xs={1}>
              <FormLabel
                style={{
                  fontSize: "larger",
                  color: "black",
                }}
                component="h4"
              >
                Email
              </FormLabel>
            </Grid>
            <Grid item xs={3} py={2}>
              <TextField
                sx={{ background: "white" }}
                fullWidth
                type="email"
                placeholder="Email"
              />
            </Grid>
          </Grid>
        </FormControl>
        <FormControl sx={{ display: "flex" }}>
          <Grid container alignItems="center">
            <Grid item xs={1}>
              <FormLabel
                style={{
                  fontSize: "larger",
                  color: "black",
                }}
                component="h4"
              >
                Types
              </FormLabel>
            </Grid>
            <Grid item xs={3} py={2}>
              <BasicSelector
                disableAll={true}
                options={userTypes}
                selectorHight={"53px"}
                name={"Types"}
                selectorWidth={"100%"}
              />
            </Grid>
          </Grid>
        </FormControl>

        <FormControl sx={{ display: "flex" }}>
          <Grid container alignItems="center">
            <Grid item xs={1}>
              <FormLabel
                style={{
                  fontSize: "larger",
                  color: "black",
                }}
                component="h3"
              >
                Phone
              </FormLabel>
            </Grid>
            <Grid item xs={5} py={2}>
              <MuiPhoneNumber defaultCountry={"et"} />
            </Grid>
          </Grid>
        </FormControl>

        <FormControl>
          <Button
            variant="outlined"
            sx={{
              py: "10px !important",
              px: "50px !important",
            }}
            className={classes.buttoRoot}
          >
            Add User
          </Button>
        </FormControl>
      </Box>
    </Box>
  );
}
