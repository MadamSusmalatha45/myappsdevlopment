import React, { useEffect, useState } from "react";
import { Box, Grid } from "@mui/material";
import PageTitle from "../../common/PageTitle";
import FAQCard from "../../components/faq/FAQCard";
import { checkAuthority } from "../../utils";


export default function SchedulerPage() {
  const segments = window.location.pathname;
  const [urlType, setUrlType] = useState('')
  const [schedule, setSchedule] = useState([])
  useEffect(() => {
    scheduleList()
    if(segments.split('/')[1] === 'company'){
      setUrlType('/company');
    }
  },[segments])

  const scheduleList =  () => {
    var arr = [];
    let url = segments.split('/')[1] == 'company' ? '/company' : ''
    if(checkAuthority('CREATE_ALARM_RESPONSE') ){
      arr.push({
        id: 1,
        title: "Create and View Alarm Response",
        url : `${url}/scheduler/create-alarm-response`
      })
    }
    
    if(checkAuthority('CREATE_CASUAL_SHIFT') ){
      arr.push({
        id: 2,
        title: "Create Casual Shifts",
        url : `${url}/scheduler/casual-shifts`
      })
    }


    if(checkAuthority('VIEW_ADVERTISED_SHIFT') ){
      arr.push({
          id: 3,
          title: "View Casual Shifts",
          url : `${url}/scheduler/view-advertised-shifts`
      })
    }

    setSchedule(arr) ;
  }

  // const schedule = [
  //   {
  //     id: 1,
  //     title: "Create Alarm Response",
  //     url : `${urlType}/scheduler/create-alarm-response`
  //   },

  //   {
  //     id: 2,
  //     title: "Casual Shifts",
  //     url : `${urlType}/scheduler/casual-shifts`
  //   },
  //   {
  //     id: 3,
  //     title: "Advertised Shifts",
  //     url : `${urlType}/scheduler/view-advertised-shifts`
  //   },
  // ];
  return (
    <Box sx={{ height: "inherit" }}>
      <PageTitle title="Scheduler" />
      <Box display="flex">
        <Grid
          container
          rowSpacing={7}
          columnSpacing={{ xs: 1 }}
          alignContent="center"
          justifyContent="center"
          alignItems="center"
          mt="5%"
        >

          {schedule.map((report) => (
            <FAQCard large title={report.title} key={report.id} url={report.url}/>
          ))}
        </Grid>
      </Box>
    </Box>
  );
}
