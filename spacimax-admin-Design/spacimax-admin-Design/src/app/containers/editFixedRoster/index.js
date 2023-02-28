import React from "react";
import { Box, Grid } from "@mui/material";
import Selector from "../../common/Selector/index";
import PageTitle from "../../common/PageTitle";

export default function EditFixedRoster() {
  const role = [
    "Manager",
    "Asst.Manager",
    "Controller",
    "Rover",
    "Static",
    "Loss Prevention",
    "Engineer/Techincian",
    "Investigator",
    "Analyst",
    "Other",
  ];
  const frequency = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  return (
    <Box>
      <PageTitle
        title="Sites View"
        subTitle="111, ABC Street / Fixed Roaster / Edit Fixed Roster"
      />
      <Grid container spacing={3} justifyContent="start">
        <Grid item md={5} xs={12} lg={3}>
          <Selector
            disableAll={true}
            options={role}
            selectorHight={"53px"}
            selectorTop={"-6px"}
            value={role}
            name={"Select Role"}
          />
        </Grid>
        <Grid item md={5} xs={12} lg={3}>
          <Selector
            disableAll={true}
            isTimeSelector={true}
            options={role}
            selectorHight={"53px"}
            selectorTop={"-6px"}
            value={role}
            name={"Start Time"}
          />
        </Grid>
        <Grid item md={5} xs={12} lg={3}>
          <Selector
            disableAll={true}
            options={role}
            isTimeSelector={true}
            selectorHight={"53px"}
            selectorTop={"-6px"}
            showLabe={true}
            name={"Finish Time"}
            width="100%"
          />
        </Grid>
        <Grid item md={5} xs={12} lg={3}>
          <Selector
            disableAll={true}
            options={frequency}
            selectorHight={"53px"}
            selectorTop={"-6px"}
            showLabe={true}
            name={"Frequency"}
            width="100%"
          />
        </Grid>
      </Grid>
    </Box>
  );
}
