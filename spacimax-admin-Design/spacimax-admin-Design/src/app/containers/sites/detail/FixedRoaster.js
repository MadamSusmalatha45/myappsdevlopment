import React from "react";
import { Box, Grid } from "@mui/material";
import PageTitle from "../../../common/PageTitle";
import SiteDetailCard from "../../../components/sites/DetailCard";

export default function SiteFixedRoasterPage() {
  const siteDetails = [
    {
      id: 1,
      title: "Edit Fixed Roaster",
    },

    {
      id: 2,
      title: "View Fixed Roaster",
    },
    // {
    //   id: 3,
    //   title: "Create Roaster",
    // }
  ];
  return (
    <Box sx={{ height: "inherit" }}>
      <PageTitle
        title="Sites View"
        subTitle="111, ABC Street / Fixed Roaster"
      />
      <Box display="flex">
        <Grid
          container
          rowSpacing={7}
          columnSpacing={{ xs: 1 }}
          alignContent="center"
          justifyContent="center"
          alignItems="center"
          mt="10%"
        >
          {siteDetails.map((report) => (
            <SiteDetailCard large title={report.title} key={report.id} />
          ))}
        </Grid>
      </Box>
    </Box>
  );
}
