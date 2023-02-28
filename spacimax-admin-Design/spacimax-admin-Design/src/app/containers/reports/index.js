import React, { useEffect, useState } from "react";
import { Box, Grid } from "@mui/material";
import PageTitle from "../../common/PageTitle";
import SiteDetailCard from "../../components/sites/DetailCard";
import { checkAuthority } from "../../utils";

export default function ReportsPage() {
  const segments = window.location.pathname;
  const [urlType, setUrlType] = useState('')
  // const [reports, setReports] = useState([])

  useEffect(() => {
    // getReportList();
    if(segments.split('/')[1] === 'company'){
      setUrlType('/company');
    }
  },[])

  const getReportList = () => {
    var arr = [];
    if(checkAuthority('VIEW_CUSTOM_REPORTS')){
      arr.push({
        id: 1,
        title: "Custom Reports",
        url : `${urlType}/custom/reports`
      })
    }
    if(checkAuthority('VIEW_PORTFOLIO_REPORTS')){
      arr.push({
        id: 2,
        title: "Portfolio Reports",
        url : `${urlType}/portfolio/reports`
      })
    }
    if(checkAuthority('VIEW_SHIFT_REPORTS')){
      arr.push({
        id: 3,
        title: "Shift Reports",
        url : `${urlType}/shift/reports`
      })
    }
    if(checkAuthority('VIEW_INCIDENT_REPORTS')){
      arr.push({
        id: 3,
        title: "Shift Reports",
        url : `${urlType}/shift/reports`
      })
    }

    // setReports(arr)
  }


  const reports = [
    {
      id: 1,
      title: "Custom Reports",
      url : `${urlType}/custom/reports`
    },

    {
      id: 2,
      title: "Portfolio Reports",
      url : `${urlType}/portfolio/reports`
    },
    // {
    //   id: 3,
    //   title: "Shift Reports",
    //   url : `${urlType}/shift/reports`
    // },
    // {
    //   id: 4,
    //   title: "Incident Reports",
    //   url : `${urlType}/incident/reports`
    // },
  ];
  return (
    <Box sx={{ height: "inherit" }}>
      <PageTitle title="Reports" />
      <Box display="flex">
        <Grid
          container
          rowSpacing={7}
          columnSpacing={{ xs: 1 }}
          alignContent="center"
          justifyContent="center"
          alignItems="center"
          mt="1%"
        >
          {reports.map((report) => (
            <SiteDetailCard large title={report.title} key={report.id} url={report.url} />
          ))}
        </Grid>
      </Box>
    </Box>
  );
}
