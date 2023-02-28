import React, {useEffect, useState} from "react";
import { Box ,Grid, FormControl, Button } from "@mui/material";
import PageTitle from "../../../common/PageTitle";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
  } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import {faker} from '@faker-js/faker';
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import LocalDateSelector from "../../../common/LocalDateSelector";
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import "./style.css";
import { getAPI } from "../../../network";
import Loader from "../../../common/Loader";
import { formatDate,tableHeader,tableData } from "../../../utils";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

export default function PorfolioReportPage() {
    const [loader, setLoader] =  useState(false)
    const [sites, setSites] = useState([])
    const [reportData, setReportData] = useState(null)
    const [reportDataTwo, setReportDataTwo] = useState(null)
    const [report, setReport] = useState({
      siteId : '',
      type : 'month',
      fromDate : null,
      toDate : null,
      reports : null,
      options : null,
      siteIdTwo : '',
      typeTwo : '',
      fromDateTwo : null,
      toDateTwo : null
    })
    useEffect(() => {
      getSites()
    },[])

    const setData = (data) =>{
    var options = [
      'Total Fixed Roster Hrs',
      'Total Casual Hrs',
      'Actual Roster Hrs',
      'Actual Casual Hrs',
      'No Of Shifts',
      'Clock Ins',
      'Clock Outs'
    ];
  
    var fixedRoasterHour = [];
    var totalCasualHour = [];
    var actualCasualHour = [];
    var roasterHour  = [];
    var noOfShift = [];
    var clockIn = [];
    var clockOut = []
    var labels = []

    for(var i = 0 ; i < data.data.length ; i++){
      labels.push(data.data[i].month)
      fixedRoasterHour.push(data.data[i].totalFixedRosterHrs)
      totalCasualHour.push(data.data[i].totalCasualHrs)
      roasterHour.push(data.data[i].actualRosterHrs)
      actualCasualHour.push(data.data[i].actualCasualHrs)
      noOfShift.push(data.data[i].noOfShifts)
      clockIn.push(data.data[i].clockins)
      clockOut.push(data.data[i].clockouts)
    }

    var reports = [
      {
        label: 'Total Fixed Roster Hrs',
        data: fixedRoasterHour,
        backgroundColor: 'rgb(116,103,240)',
      },
      {
        label: 'Total Casual Hrs',
        data: totalCasualHour,
        backgroundColor: 'rgb(243,111,78)',
      },
      {
        label: 'Actual Roster Hrs',
        data: roasterHour,
        backgroundColor: 'rgb(128,145,170)',
      },
      {
        label: 'Actual Casual Hrs',
        data: actualCasualHour,
        backgroundColor: 'rgb(254,202,87)',
      },
      {
        label: 'No Of Shifts',
        data: noOfShift,
        backgroundColor: 'rgb(39,152,247)',
      },
      {
        label: 'Clock Ins',
        data: clockIn,
        backgroundColor: 'rgb(87,234,3)',
      },
      {
        label: 'Clock Outs',
        data: clockOut,
        backgroundColor: 'rgb(30,52,136)',
      }
    ]

    setReportData({
      labels,
      datasets : reports
    })

    }

    const setDataTwo = (data) =>{
      var options = [
        'Total Fixed Roster Hrs',
        'Total Casual Hrs',
        'Actual Roster Hrs',
        'Actual Casual Hrs',
        'No Of Shifts',
        'Clock Ins',
        'Clock Outs'
      ];
    
      var fixedRoasterHour = [];
      var totalCasualHour = [];
      var actualCasualHour = [];
      var roasterHour  = [];
      var noOfShift = [];
      var clockIn = [];
      var clockOut = []
      var labels = []
  
      for(var i = 0 ; i < data.data.length ; i++){
        labels.push(data.data[i].month)
        fixedRoasterHour.push(data.data[i].totalFixedRosterHrs)
        totalCasualHour.push(data.data[i].totalCasualHrs)
        roasterHour.push(data.data[i].actualRosterHrs)
        actualCasualHour.push(data.data[i].actualCasualHrs)
        noOfShift.push(data.data[i].noOfShifts)
        clockIn.push(data.data[i].clockins)
        clockOut.push(data.data[i].clockouts)
      }
  
      var reports = [
        {
          label: 'Total Fixed Roster Hrs',
          data: fixedRoasterHour,
          backgroundColor: 'rgb(116,103,240)',
        },
        {
          label: 'Total Casual Hrs',
          data: totalCasualHour,
          backgroundColor: 'rgb(243,111,78)',
        },
        {
          label: 'Actual Roster Hrs',
          data: roasterHour,
          backgroundColor: 'rgb(128,145,170)',
        },
        {
          label: 'Actual Casual Hrs',
          data: actualCasualHour,
          backgroundColor: 'rgb(254,202,87)',
        },
        {
          label: 'No Of Shifts',
          data: noOfShift,
          backgroundColor: 'rgb(39,152,247)',
        },
        {
          label: 'Clock Ins',
          data: clockIn,
          backgroundColor: 'rgb(87,234,3)',
        },
        {
          label: 'Clock Outs',
          data: clockOut,
          backgroundColor: 'rgb(30,52,136)',
        }
      ]
  
      setReportDataTwo({
        labels,
        datasets : reports
      })
  
      }

    const getSites = async() => {
       let userType = localStorage.getItem('userType')
       setLoader(true)
       let data = await getAPI(userType === 'admin' ? '/sites' : '/company/site')
       if(data){
        setSites(data)
       }
       setLoader(false)
    }

    const generateUrl = ( siteId, type, fromDate, toDate) => {
      var additional_url = '';
      var isFirst = true;
      if(siteId){
        additional_url += isFirst ? `?siteId=${siteId}` : `&siteId=${siteId}`;
        isFirst = false;
      }

      if(type){
        additional_url += isFirst ? `?type=${type}` : `&type=${type}`;
        isFirst = false;
      }
      if(fromDate){
        additional_url += isFirst ? `?fromDate=${formatDate(fromDate)}` : `&fromDate=${formatDate(fromDate)}`;
        isFirst = false;
      }

      if(toDate){
        additional_url += isFirst ? `?toDate=${formatDate(toDate)}` : `&toDate=${formatDate(toDate)}`;
        isFirst = false;
      }

      return additional_url;
    }

    const getReports = async(siteId = null, type = null, fromDate =  null, toDate = null) => {
      let sId = siteId !== null ? siteId : report.siteId;
      let dType = type !== null ? type : report.type;
      let fDate = fromDate !== null ? fromDate : report.fromDate;
      let tDate = toDate !== null ? toDate : report.toDate;
      let url = generateUrl(sId, dType, fDate, tDate);
      setLoader(true)
      let data = await getAPI(`/admin/reports/admin/portfolio${url}`)
      if(data){
        setData(data)
      }
      setLoader(false)
    }

    const getReportsTwo = async(siteId = null, type = null, fromDate =  null, toDate = null) => {
      let sId = siteId !== null ? siteId : report.siteId;
      let dType = type !== null ? type : report.type;
      let fDate = fromDate !== null ? fromDate : report.fromDate;
      let tDate = toDate !== null ? toDate : report.toDate;
      let url = generateUrl(sId, dType, fDate, tDate);
      setLoader(true)
      let data = await getAPI(`/admin/reports/admin/portfolio${url}`)
      if(data){
        setDataTwo(data)
      } 
      setLoader(false)
    }

    const exportReport = async(url) =>{
      setLoader(true)
      let data = await getAPI('/admin/reports/admin/portfolio/export' + url)
      if(data){
        alert('Done')
      }
      else{
        alert('Export Report')
      }
      setLoader(false)
    }

    const changeSite = (e) => {
      setReport({
        ...report,
        siteId : e.target.value
      })
      getReports(e.target.value, null, null, null)
    }

    const changeType = (e) => {
      setReport({
        ...report,
        type : e.target.value
      })
      getReports(null , e.target.value, null, null)
    }

    const changeFromDate = (e) => {
      setReport({
        ...report,
        fromDate : e
      })
      getReports(null , null,e, null)
    }

    const changeToDate = (e) => {
      setReport({
        ...report,
        toDate : e
      })
      getReports(null , null, null, e)
    }

    const changeSiteTwo = (e) => {
      setReport({
        ...report,
        siteIdTwo : e.target.value
      })
      getReportsTwo(e.target.value, null, null, null)
    }

    const changeTypeTwo = (e) => {
      setReport({
        ...report,
        typeTwo : e.target.value
      })
      getReportsTwo(null , e.target.value, null, null)
    }

    const changeFromDateTwo = (e) => {
      setReport({
        ...report,
        fromDateTwo : e
      })
      getReportsTwo(null , null,e, null)
    }

    const changeToDateTwo = (e) => {
      setReport({
        ...report,
        toDateTwo : e
      })
      getReportsTwo(null , null, null, e)
    }

    const options = {
        responsive: true,
        layout: {
            height : 400,
            fontSize : 18
        },
        plugins: {
          legend: {
            position: 'bottom' ,
          },
          title: {
            display: true,
            text: 'Fixed Roaster Hours Performed',
          },
        },
    };

    const optionsCasual = {
    responsive: true,
    layout: {
        // padding: {
        //     top: 5,
        //     left: 15,
        //     right: 15,
        //     bottom: 15
        // }
        height : 400,
        fontSize : 18
    },
    plugins: {
        legend: {
        position: 'bottom' ,
        },
        title: {
        display: true,
        text: 'Casual Shift Performance',
        },
    },
    };

    const labels = ['Jan - 22', 'Feb - 22', 'Mar - 22', 'Apr - 22', 'May - 22', 'Jun - 22', 'Jul - 22'];


    const dataCasual = {
    labels,
    datasets: [
        {
        label: 'Booked Hours',
        data: labels.map(() => faker.datatype.number({ min: 0, max: 1400 })),
        backgroundColor: '#2896E9',
        },
        {
        label: 'Actual Hours',
        data: labels.map(() => faker.datatype.number({ min: 0, max: 1400 })),
        backgroundColor: '#F36F4E',
        },
        {
        label: 'Lost Time',
        data: labels.map(() => faker.datatype.number({ min: 0, max: 1400 })),
        backgroundColor: '#8091AA',
        },
    ],
    };
    
  return (
    <Box sx={{ height: "inherit" }}>
      <Loader loader={loader} />
      <PageTitle title="Reports"  subTitle="Portfolio Reports"/>
      <Box>
        <Grid
          container
          className="sort-box"
          sx={{  mt: "1rem"}}
        >
          <Grid item xs={3}>
            <FormControl sx={{ m: 1, width: "90%", backgroundColor: "white" }}>
              <Select
                value={report.siteId}
                onChange={(event) => {
                  changeSite(event)
                }}
                displayEmpty
                inputProps={{ "aria-label": "Without label" }}
                style={{
                  borderRadius: 10,
                  boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
                  borderColor: "#707070",
                }}
              >
                <MenuItem value="">
                  <div className="selectitem">Select Site</div>
                </MenuItem>
                {sites.map((item, index) => (
                  <MenuItem value={item._id} key={index}>
                    {item.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={3}>
            <FormControl sx={{ m: 1, width: "90%", backgroundColor: "white" }}>
              <Select
                value={report.type}
                onChange={(event) => {
                  changeType(event)
                }}
                displayEmpty
                inputProps={{ "aria-label": "Without label" }}
                style={{
                  borderRadius: 10,
                  boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
                  borderColor: "#707070",
                }}
              >
                <MenuItem value="">
                  <div className="selectitem">Select Type</div>
                </MenuItem>
                  <MenuItem value={'month'} key={1}>
                    Monthly
                  </MenuItem>
                  <MenuItem value={'quarter'} key={2}>
                    Quarterly
                  </MenuItem>
                  <MenuItem value={'year'} key={3}>
                    Yearly
                  </MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={3}>
            <FormControl sx={{ m: 1, width: "90%" }}>
              <LocalDateSelector title="From Date" value={report.fromDate} onChange={(event) => {
                changeFromDate(event)
              }}/>
            </FormControl>
          </Grid>

          <Grid item xs={3}>
            <FormControl sx={{ m: 1, width: "90%" }}>
              <LocalDateSelector title="To Date" value={report.toDate} onChange={(event) => {
                changeToDate(event)
              }}/>
            </FormControl>
          </Grid>
        </Grid>
      </Box>
      
      <Box display="flex" sx={{  mx : "0.5rem", p : "1rem", position :'relative' }} className="bar-box">
       
        {
          reportData != null ?
          <Bar options={options} data={reportData} className="bar-chart"/>
          :
          <div style={{width : '100%', height : '400px'}}>

          </div>
        }
        {/* <div style={{position : 'absolute', right : 0, top : 0}}>
          <Button variant="outlined" onClick={() => exportReport(generateUrl(report.siteId, report.type,report.fromDate,report.toDate))} size="small" color="primary" startIcon={<FileDownloadIcon />}>
            Export
          </Button>
        </div> */}
      </Box>

      <Box>
        <Grid
          container
          className="sort-box"
          sx={{  mt: "1rem"}}
        >
          <Grid item xs={3}>
            <FormControl sx={{ m: 1, width: "90%", backgroundColor: "white" }}>
              <Select
                value={report.siteIdTwo}
                onChange={(event) => {
                  changeSiteTwo(event)
                }}
                displayEmpty
                inputProps={{ "aria-label": "Without label" }}
                style={{
                  borderRadius: 10,
                  boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
                  borderColor: "#707070",
                }}
              >
                <MenuItem value="">
                  <div className="selectitem">Select Site</div>
                </MenuItem>
                {sites.map((item, index) => (
                  <MenuItem value={item._id} key={index}>
                    {item.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={3}>
            <FormControl sx={{ m: 1, width: "90%", backgroundColor: "white" }}>
              <Select
                value={report.typeTwo}
                onChange={(event) => {
                  changeTypeTwo(event)
                }}
                displayEmpty
                inputProps={{ "aria-label": "Without label" }}
                style={{
                  borderRadius: 10,
                  boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
                  borderColor: "#707070",
                }}
              >
                <MenuItem value="">
                  <div className="selectitem">Select Type</div>
                </MenuItem>
                  <MenuItem value={'month'} key={1}>
                    Monthly
                  </MenuItem>
                  <MenuItem value={'quarter'} key={2}>
                    Quarterly
                  </MenuItem>
                  <MenuItem value={'year'} key={3}>
                    Yearly
                  </MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={3}>
            <FormControl sx={{ m: 1, width: "90%" }}>
              <LocalDateSelector title="From Date" value={report.fromDateTwo} onChange={(event) => {
                changeFromDateTwo(event)
              }}/>
            </FormControl>
          </Grid>

          <Grid item xs={3}>
            <FormControl sx={{ m: 1, width: "90%" }}>
              <LocalDateSelector title="To Date" value={report.toDateTwo} onChange={(event) => {
                changeToDateTwo(event)
              }}/>
            </FormControl>
          </Grid>
        </Grid>
      </Box>
      <Box display="flex" sx={{  mx : "0.5rem", p : "1rem", position :'relative' }} className="bar-box">
        <Bar options={optionsCasual} data={dataCasual} className="bar-chart"/>
        {/* <div style={{position : 'absolute', right : 0, top : 0}}>
          <Button variant="outlined" onClick={() => exportReport(generateUrl(report.siteId, report.type,report.fromDate,report.toDate))} size="small" color="primary" startIcon={<FileDownloadIcon />}>
            Export
          </Button>
        </div> */}
      </Box>
    </Box>
  );
}


