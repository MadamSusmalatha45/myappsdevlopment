import React, { useEffect, useState } from "react";
import { Box, Button, Grid,Link} from "@mui/material";
import PageTitle from "../../../common/PageTitle";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableFooter from "@mui/material/TableFooter";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import TableHead from "@mui/material/TableHead";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import LocalDateSelector from "../../../common/LocalDateSelector";
import { getAPI, getExportAPI } from "../../../network";
import { formatDate,tableHeader,tableData , formatDatePost} from "../../../utils";
import Loader from "../../../common/Loader";
import "./style.css";
import GetAppRoundedIcon from '@mui/icons-material/GetAppRounded';
import FilterAltOffIcon from '@mui/icons-material/FilterAltOff';
// import {  Modal} from "@mui/material";
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import { AllInbox } from "@material-ui/icons";
import { BASE_URL } from "../../../../constant";

export default function CustomReportPage() {
  const [logs, setLogs] = useState([]);
  const [shiftLogs, setShiftLogs] = useState([]);
  const [roasterLogs, setRoasterLogs] = useState([])
  const [lateLogs, setLateLogs] = useState([])
  const [failLogs, setFailLogs] = useState([])
  const [taskLogs, setTaskLogs] = useState([])
  const [supportLogs, setSupportLogs] = useState([])
  const [shifts, setShifts] = useState([])
  const [show, setShow] = useState(false);
  const [alarmLogs, setAlarmLogs] = useState([])
  const [sites, setSites] = useState([])
  const [all, setAll] = useState([])
  const [questions,setQuestions]=useState([])
  const [loader, setLoader]  = useState(false)
  const [page, setPage] = useState(0);
  const [perPage, setPerPage] = useState(10)
  const [report, setReport] = useState({
    reportId : 6,
    siteId : '',
    shiftId:'',
    startDate : null,
    endDate : null,
  })

  const clearFilter = () => {
    setReport({
      ...report,
      siteId : '',
      shiftId:'',
      startDate : null,
      endDate : null,
    })

    let id = report.reportId;

    if(id === 1){
      getLogs()
    }
    if(id === 2){
      getCasualShifts()
    }
    if(id === 3){
      getRoasterShifts()
    }
    if(id === 4){
      getLateClockIn()
    }
    if(id === 5){
      getFailClock()
    }
    if(id === 6){
      getAllReports()
    }
    if(id === 7){
      getTask()
    }
    if(id === 8){
      getSupport()
    }
    if(id === 9){
      getAlarm()
    }
    if(id === 10){
      getShifts()
    }


  }

  useEffect(() => {
     getAllReports()
     getLogs()
     getSites()
     getRoasterShifts()
     getLateClockIn()
     getFailClock()
     getTask()
     getSupport()
     getAlarm()
     getShifts()
  },[])

  
  const handleShowClose = () => {
    setShow(false);
  }
  const getAllReports = async(sId = null, sDate = null, eDate = null) => {
    let dSId = sId === null ? report.siteId : sId;
    let dSDate = sDate === null ? report.startDate : sDate;
    let dEDate = eDate === null ? report.endDate : eDate;
    setLoader(true)

  
    let data = await getAPI('/reports/get/file' + generateUrl(dSId, dSDate, dEDate));
    console.log('URL LINK','/reports/get/file' + generateUrl(dSId, dSDate, dEDate))
    
    if(data){

      setAll(data)
      console.log("data from APi*******************",data)
    }
    setLoader(false)
  }
  
  
  const getShifts= async(sId = null, sDate = null, eDate = null) => {
    let dSId = sId === null ? report.siteId : sId;
    let dSDate = sDate === null ? report.startDate : sDate;
    let dEDate = eDate === null ? report.endDate : eDate;
    setLoader(true)
    let data = await getAPI('/shift-logs' + generateUrl(dSId, dSDate, dEDate));
    console.log('SHIFT LOGS', data)

    if(data){
      setShifts(data)
    }
    setLoader(false)
  }

  const generateUrl = ( sId, sDate, eDate) => {
    var additional_url = '';
    var isFirst = true;
    if(sId !== null && sId !== ''){
      additional_url += isFirst ? `?siteId=${sId}` : `&siteId=${sId}`;
      isFirst = false;
    }
    if(sDate !== null && sDate !== ''){
      additional_url += isFirst ? `?startDate=${formatDatePost(sDate)}` : `&startDate=${formatDatePost(sDate)}`;
      isFirst = false;
    }

    if(eDate !== null && eDate !== ''){
      additional_url += isFirst ? `?endDate=${formatDatePost(eDate)}` : `&endDate=${formatDatePost(eDate)}`;
      isFirst = false;
    }

    return additional_url;
  }

  const getLogs = async(sId = null, sDate = null, eDate = null) => {
    let dSId = sId === null ? report.siteId : sId;
    let dSDate = sDate === null ? report.startDate : sDate;
    let dEDate = eDate === null ? report.endDate : eDate;
    setLoader(true)
    let data = await getAPI('/tenancy-check/fetchList' + generateUrl(dSId, dSDate, dEDate));
    if(data){
      setLogs(data)
    }
    setLoader(false)
  }

  const getCasualShifts = async(sId = null, sDate = null, eDate = null) => {
    let dSId = sId === null ? report.siteId : sId;
    let dSDate = sDate === null ? report.startDate : sDate;
    let dEDate = eDate === null ? report.endDate : eDate;
    setLoader(true)
    let data = await getAPI('/company/shifts/list'+ generateUrl(dSId, dSDate, dEDate));
    if(data){
      setShiftLogs(data)
    }
    setLoader(false)
  }

  const getRoasterShifts = async(sId = null, sDate = null, eDate = null) => {
    let dSId = sId === null ? report.siteId : sId;
    let dSDate = sDate === null ? report.startDate : sDate;
    let dEDate = eDate === null ? report.endDate : eDate;
    setLoader(true)
    let data = await getAPI('/company/roster/shift/list' + generateUrl(dSId, dSDate, dEDate));
    if(data){
      setRoasterLogs(data)
    }
    setLoader(false)
  }



  const getLateClockIn = async(sId = null, sDate = null, eDate = null) => {
    let dSId = sId === null ? report.siteId : sId;
    let dSDate = sDate === null ? report.startDate : sDate;
    let dEDate = eDate === null ? report.endDate : eDate;
    setLoader(true)
    let data = await getAPI('/sites/list/clockinout' + generateUrl(dSId, dSDate, dEDate));
    if(data){
      setLateLogs(data)
    }
    setLoader(false)
  }

  const getFailClock = async(sId = null, sDate = null, eDate = null) => {
    let dSId = sId === null ? report.siteId : sId;
    let dSDate = sDate === null ? report.startDate : sDate;
    let dEDate = eDate === null ? report.endDate : eDate;
    setLoader(true)
    let data = await getAPI('/sites/list/failedclock'  + generateUrl(dSId, dSDate, dEDate));
    if(data){
      setFailLogs(data)
    }
    setLoader(false)
  }

  const getTask= async(sId = null, sDate = null, eDate = null) => {
    let dSId = sId === null ? report.siteId : sId;
    let dSDate = sDate === null ? report.startDate : sDate;
    let dEDate = eDate === null ? report.endDate : eDate;
    setLoader(true)
    let data = await getAPI('/tasks'  + generateUrl(dSId, dSDate, dEDate).replace("startDate", "dueDate"));
    if(data){
      setTaskLogs(data)
    }
    setLoader(false)
  }

  const getAlarm= async(sId = null, sDate = null, eDate = null) => {
    let dSId = sId === null ? report.siteId : sId;
    let dSDate = sDate === null ? report.startDate : sDate;
    let dEDate = eDate === null ? report.endDate : eDate;
    setLoader(true)
    let data = await getAPI('/alarm'  + generateUrl(dSId, dSDate, dEDate));
    if(data){
      setAlarmLogs(data)
    }
    setLoader(false)
  }

  const getSupport= async( sId = null, sDate = null, eDate = null) => {
    let dSId = sId === null ? report.siteId : sId;
    let dSDate = sDate === null ? report.startDate : sDate;
    let dEDate = eDate === null ? report.endDate : eDate;
    setLoader(true)

    console.log('SUPPORT URL #####', generateUrl(dSId, dSDate, dEDate).replace('startDate','issueDate').replace('endDate','closeDate'))
    // generateUrl(dSId, dSDate, dEDate).replace('startDate','issueDate').replace('endDate','closeDate'))
    let data = await getAPI('/support'  + generateUrl(dSId, dSDate, dEDate));
    if(data){

      console.log('Support', data)
      setSupportLogs(data)
    }
    setLoader(false)
  }

  const getSites = async() => {
    setLoader(true)
    let userType = localStorage.getItem('userType')
    let data = await getAPI(userType === 'admin' ? '/sites' : '/company/sites');
    if(data){
      setSites(data)
    }
    setLoader(false)
  }

  const reports = [
    { id: 6, name: "Complete Report" },
    { id: 7, name: "Task Report"},
    { id: 8, name: "Support Report" },
    { id: 9, name: "Scheduler(Alarm) Report" },
    { id: 10, name: "Shift logs Report" },
    { id: 1, name: "Tendency Check Report" },
    { id: 2, name: "Casual Shifts Advertised Incl. Report" },
    { id: 3, name: "Rostered Shifts Incl. Report" },
    { id: 4, name: "late In / Out Clock Report" },
    { id: 5, name: "Failed Clock ins Incl." },
  ];

  const changeSite = (event) => {
    let id = event.target.value;
    let reportId = report.reportId
    if(reportId === 1){
      getLogs(id)
    }
    if(reportId === 2){
      getCasualShifts(id)
    }
    if(reportId === 3){
      getRoasterShifts(id)
    }
    if(reportId === 4){
      getLateClockIn(id)
    }
    if(reportId === 5){
      getFailClock(id)
    }
    if(reportId === 6){
      getAllReports(id)
    }
    if(reportId === 7){
      getTask(id)
    }
    if(reportId === 8){
      getSupport(id)
    }
    if(reportId === 9){
      getAlarm(id)
    }
    if(reportId === 10){
      getShifts(id)
    }
    setReport(prevState => ({
      ...prevState,
      siteId : id
    }))

  };


  const changeShift = (event) => {
    let id = event.target.value;
    let reportId = report.reportId
    if(reportId === 1){
      getLogs(id)
    }
    if(reportId === 2){
      getCasualShifts(id)
    }
    if(reportId === 3){
      getRoasterShifts(id)
    }
    if(reportId === 4){
      getLateClockIn(id)
    }
    if(reportId === 5){
      getFailClock(id)
    }
    if(reportId === 6){
      getAllReports(id)
    }
    if(reportId === 7){
      getTask(id)
    }
    if(reportId === 8){
      getSupport(id)
    }
    if(reportId === 9){
      getAlarm(id)
    }
    if(reportId === 10){
      getShifts(id)
    }
    setReport(prevState => ({
      ...prevState,
      shiftId : id
    }))

  };

  const changeReport = (event) => {
    let id = event.target.value;
    if(id === 1){
      getLogs()
    }
    if(id === 2){
      getCasualShifts()
    }
    if(id === 3){
      getRoasterShifts()
    }
    if(id === 4){
      getLateClockIn()
    }
    if(id === 5){
      getFailClock()
    }
    if(id === 6){
      getAllReports()
    }
    if(id === 7){
      getTask()
    }
    if(id === 8){
      getSupport()
    }
    if(id === 9){
      getAlarm()
    }
    if(id === 10){
      getShifts()
    }
    setReport(prevState => ({
      ...prevState,
      reportId : id
    }))

    setReport({
      ...report,
      reportId : id
    })
  };

  const changeStartDate = (event) =>{
    let id = event
    let reportId = report.reportId
    if(reportId === 1){
      getLogs(null,id)
    }
    if(reportId === 2){
      getCasualShifts(null,id)
    }
    if(reportId === 3){
      getRoasterShifts(null,id)
    }
    if(reportId === 4){
      getLateClockIn(null,id)
    }
    if(reportId === 5){
      getFailClock(null,id)
    }
    if(reportId === 6){
      getAllReports(null,id)
    }
    if(reportId === 7){
      getTask(null,id)
    }
    if(reportId === 8){
      getSupport(null,id)
    }
    if(reportId === 9){
      getAlarm(null,id)
    }
    if(reportId === 10){
      getShifts(null,id)
    }

    setReport({
      ...report,
      startDate : id
    })
  }

  const changeEndDate = (event) =>{
    let id = event
    let reportId = report.reportId
    if(reportId === 1){
      getLogs(null,null,id)
    }
    if(reportId === 2){
      getCasualShifts(null,null,id)
    }
    if(reportId === 3){
      getRoasterShifts(null,null,id)
    }
    if(reportId === 4){
      getLateClockIn(null,null,id)
    }
    if(reportId === 5){
      getFailClock(null,null,id)
    }
    if(reportId === 6){
      getAllReports(null,null,id)
    }
    if(reportId === 7){
      getTask(null,null,id)
    }
    if(reportId === 8){
      getSupport(null,null,id)
    }
    if(reportId === 9){
      getAlarm(null,null,id)
    }
    if(reportId === 10){
      getShifts(null,null,id)
    }

    setReport({
      ...report,
      endDate : id
    })
  }

  const rowCount = () => {
    if(report.reportId === 1){
      return logs.length;
    }
    else if(report.reportId === 2){
      return shiftLogs.length;
    }
    else if(report.reportId === 3){
      return roasterLogs.length;
    }
    else if(report.reportId === 4){
      return lateLogs.length;
    }
    else if(report.reportId === 5){
      return failLogs.length;
    }
    else if(report.reportId === 6){
      return all.length;
    }
    else if(report.reportId === 7){
      return taskLogs.length;
    }
    else if(report.reportId === 8){
      return supportLogs.length;
    }
    else if(report.reportId === 9){
      return alarmLogs.length;
    }
    else if(report.reportId === 10){
      return shifts.length;
    }
  }

  const getColSpan = () => {
    if(report.reportId === 1){
      return 4;
    }
    else if(report.reportId === 2){
      return 17;
    }
    else if(report.reportId === 3){
      return 10;
    }
    else if(report.reportId === 4){
      return 9;
    }
    else if(report.reportId === 5){
      return 12;
    }
    else if(report.reportId === 6){
      return 6;
    }
    else if(report.reportId === 7){
      return 9;
    }
    else if(report.reportId === 8){
      return 8;
    }
    else if(report.reportId === 9){
      return 11;
    }
    else if(report.reportId === 10){
      return 6;
    }
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const TablePaginationActions = () => {};

  const exportDoc = async() => {
    var url = generateUrl( report.siteId, report.startDate, report.endDate);
    let reportId = report.reportId
    var exportfile=""
    if(reportId === 1){
      exportfile="tenancy-check";
    }
    if(reportId === 2){
      exportfile="casual-shifts";
    }
    if(reportId === 3){
      exportfile="roster";
    }
    if(reportId === 4){
      exportfile="clockinout";
    }
    if(reportId === 5){
      exportfile="failedclock";
    }
    if(reportId === 6){
      exportfile="report";
    }
    if(reportId === 7){
      exportfile="tasks";
    }
    if(reportId === 8){
      exportfile="support";
    }
    if(reportId === 9){
      exportfile="alarms";
    }
    if(reportId === 10){
      exportfile="shift-logs";
    }
    // else{
    //   exportfile="complete-report";
    // }
    
    // exportfile = (exportfile == '' || exportfile == null) ? "complete-report" : exportfile;
    setLoader(true)
    let data = await getExportAPI(`${BASE_URL}/export/file/${exportfile.trim()}`+url);
    
    if(data){
      // alert(`${BASE_URL}/${exportfile}/export/file${url}`)
    }   
    setLoader(false)
   
  }

  const viewQuestionsModel=(item)=>{
    const question=item.questions
    setQuestions(question)
    setShow(true)
  }

  
   const exportQue = async(id)=>{
    console.log("item---",id)
    let data = await getExportAPI(`${BASE_URL}/export/file/report-question/${id}`);
    if(data){
      
    }   
    setLoader(false)
  }


  return (
    <Box sx={{ height: "inherit" }}>
      <Loader loader={loader} />
      <PageTitle title="Reports" subTitle="Custom Reports" />
      <Box
            display="flex"
            justifyContent="flex-end"
            alignItems="flex-end"
            sx={{mx : 6, width:" 54rem"}}
        >
            <Button variant="contained" style={{backgroundColor : "grey"}} sx={{ height: 50 , mx : 2 }} onClick={clearFilter}>
              <FilterAltOffIcon  /> &nbsp; &nbsp;
              Clear Filter
            </Button>

            <Button variant="contained" style={{backgroundColor : "grey"}} sx={{ height: 50 }} onClick={exportDoc}>
              <GetAppRoundedIcon  /> &nbsp; &nbsp;
              Export Report
            </Button>
        </Box> 

      <Grid
        container
        className="sortbox"
        sx={{ mx: "0.4rem", mt: "1rem", pr: "2rem"}}
      >
        <Grid item xs={3}>
          <FormControl sx={{ m: 1, flexBasis: '10%',width: "90%", backgroundColor: "white" }}>
            <Select
              value={report.reportId}
              onChange={(event) => {
                changeReport(event)
              }}
              displayEmpty
              inputProps={{ "aria-label": "Without label"}}
              style={{
                borderRadius: 10,
                boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
                borderColor: "#707070",
              }}
            >
              <MenuItem value="">
                <div className="selectitem">Select Report</div>
              </MenuItem>
              {reports.map((item, index) => (
                <MenuItem value={item.id} key={index}>
                  {item.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {
          (report.reportId !== 8 && report.reportId !== 10 && report.reportId !== 1 && report.reportId !== 2 && report.reportId !== 6) &&
          <Grid item xs={3}>
            <FormControl sx={{ m: 1,flexBasis: '10%', width: "90%", backgroundColor: "white" }}>
              <Select
                value={report.siteId}
                onChange={(event) => {
                  setPage(0)
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
        }
       

        <Grid item xs={{maxWidth:'37%'}}>
          <FormControl sx={{ m: 1, width: "20rem", flexBasis: '10%',}}>
            <LocalDateSelector title={report.reportId === 7 ? "Due Date" : ( report.reportId === 8 ? "Start Date" : "Start Date")} value={report.startDate} onChange={(event) => {
              setPage(0)
              changeStartDate(event)
            }}/>
          </FormControl>
        </Grid>
        {
          report.reportId !== 7 &&
          <Grid item xs={{maxWidth:'37%'}}>
            <FormControl sx={{ m: 1, width: "20rem",flexBasis: '10%', }}>
              <LocalDateSelector title={report.reportId === 8 ? "End Date" : "End Date"} value={report.endDate} onChange={(event) => {
                setPage(0)
                changeEndDate(event)
              }}/>
            </FormControl>
          </Grid>
        }
        
      </Grid>
      <Box display="flex" sx={{ my: "2rem" }}>
      {
        (report.reportId === 1 && logs.length > 0) &&
        <TableContainer component={Paper} sx={{ mx: "0.8rem" }}>
          <Table
            sx={{ minWidth: "auto" }}
            aria-label="custom pagination table"
            className="responsive-table"
          >
            <TableHead>
              <TableRow className="table-header">
                <TableCell align="center" component="th" sx={tableHeader}>
                  Shift 
                </TableCell>
                <TableCell align="center" component="th" sx={tableHeader}>
                 Floor
                </TableCell>
                <TableCell align="center" component="th" sx={tableHeader}>
                  Status
                </TableCell>
                <TableCell align="center" component="th" sx={tableHeader}>
                  Created At
                </TableCell>
               
              </TableRow>
            </TableHead>
            <TableBody>
              {logs.slice(page * perPage, page * perPage + perPage).map((item, index) => (
                <TableRow key={index}>
                  <TableCell align="left" sx={tableData}>
                    <table className="table">
                      <tr>
                        <th>Shift Type</th>
                        <th>Type</th>
                        <th>Start Time</th>
                        <th>End Time</th>
                        <th>Clock In</th>
                        <th>Clock Out</th>
                      </tr>
                      <tr>
                        <td>{item.shiftId?.shiftType}</td>
                        <td>{item.shiftId?.inOut}</td>
                        <td>{item.shiftId?.startTime}</td>
                        <td>{item.shiftId?.endTime}</td>
                        <td>{item.shiftId?.clockInTime  ? formatDate(item.shiftId?.clockInTime) : 'NA'}</td>
                        <td>{item.shiftId?.clockOutTime  ? formatDate(item.shiftId?.clockOutTime) : 'NA'}</td>
                      </tr>
                      
                    </table>
                  </TableCell>
                  <TableCell align="left" sx={tableData}>
                    {
                      Array.isArray(item.floors) &&
                      item.floors.length > 0 &&
                      <Table className="table">
                        <tr>
                          <th>Floor</th>
                          <th>Start Time</th>
                          <th>End Time</th>
                          <th>Note</th>
                          <th>Created</th>
                        </tr>
                        {
                          item.floors.map((floor, index) => (
                            <tr>
                              <td>{floor.floor}</td>
                              <td>{formatDate(floor.startTime)}</td>
                              <td>{floor.endTime != null ? formatDate(floor.endTime) : 'NA'}</td>
                              <td>{floor.note}</td>
                              <td>{formatDate(floor.createdAt)}</td>
                            </tr>
                          ))
                        }
                      </Table>
                    }
                    
                  </TableCell>
                  <TableCell align="center" sx={tableData}>
                    {item.shiftStatus}
                  </TableCell>
                  <TableCell align="center" sx={tableData}>
                    {formatDate(item.createdAt)}
                  </TableCell>
              
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TablePagination
                  align="right"
                  rowsPerPageOptions={[10, 25, 50]}
                  colSpan={getColSpan()}
                  count={rowCount()}
                  rowsPerPage={perPage}
                  page={page}
                  SelectProps={{
                    inputProps: {
                      "aria-label": "rows per page",
                    },
                    native: true,
                  }}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
      }
      {
        (report.reportId === 2 && shiftLogs.length > 0) &&
        <TableContainer component={Paper} sx={{ mx: "0.8rem" }} style={{overflowX :'auto'}}>
          <Table
            sx={{ minWidth: "auto" }}
            aria-label="custom pagination table"
            className="responsive-table"
          >
            {console.log('REPORT 2', shiftLogs)}
            <TableHead>
              <TableRow className="table-header">
                <TableCell align="center" component="th" sx={tableHeader}>
                  Work Order 
                </TableCell>
                <TableCell align="center" component="th" sx={tableHeader}>
                  Shift Code
                </TableCell>
                <TableCell align="center" component="th" sx={tableHeader} width="5%">
                  Site 
                </TableCell>
                <TableCell align="center" component="th" sx={tableHeader}>
                  Shift Type
                </TableCell>
                <TableCell align="center" component="th" sx={tableHeader}>
                  Break
                </TableCell>
                <TableCell align="center" component="th" sx={tableHeader}>
                  Parking
                </TableCell>
                <TableCell align="center" component="th" sx={tableHeader}>
                  Recurrence
                </TableCell>
                <TableCell align="center" component="th" sx={tableHeader}>
                  Start Time
                </TableCell>
                <TableCell align="center" component="th" sx={tableHeader}>
                  End Time
                </TableCell>
                <TableCell align="center" component="th" sx={tableHeader}>
                  Start Date
                </TableCell>
                <TableCell align="center" component="th" sx={tableHeader}>
                  End Date
                </TableCell>
                <TableCell align="center" component="th" sx={tableHeader}>
                  Created By
                </TableCell>
                <TableCell align="center" component="th" sx={tableHeader}>
                  Assign To
                </TableCell>
                <TableCell align="center" component="th" sx={tableHeader}>
                  Intrusted Users
                </TableCell>
                <TableCell align="center" component="th" sx={tableHeader}>
                  Total Hours
                </TableCell>
                <TableCell align="center" component="th" sx={tableHeader}>
                  Status
                </TableCell>
                <TableCell align="center" component="th" sx={tableHeader}>
                  Created At
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {shiftLogs.slice(page * perPage, page * perPage + perPage).map((item, index) => (
                <TableRow key={index} >
                  <TableCell align="left" sx={tableData}>
                    {item.woNumber}
                  </TableCell>
                  <TableCell align="left" sx={tableData}>
                   {item.shiftCode}
                  </TableCell>
                  <TableCell align="center" sx={tableData} style={{whiteSpace: 'nowrap'}}>
                    {item.siteId?.name}
                  </TableCell>
                  <TableCell align="center" sx={tableData} style={{whiteSpace: 'nowrap'}}>
                    {item.shiftType?.name}
                  </TableCell>
                  <TableCell align="center" sx={tableData}>
                    {item.allowedBreaks === null ? 'NA' : (item.allowedBreaks === true ? 'YES' : 'NO')}
                  </TableCell>
                  <TableCell align="center" sx={tableData}>
                    {item.parkingRequired  === null ? 'NA' : (item.parkingRequired === true ? 'YES' : 'NO')}
                  </TableCell>
                  <TableCell align="center" sx={tableData}>
                    {item.shiftRecurrence?.name}
                  </TableCell>
                  <TableCell align="center" sx={tableData}>
                    {item.startTime}
                  </TableCell>
                  <TableCell align="center" sx={tableData}>
                    {item.endTime}
                  </TableCell>
                  <TableCell align="center" sx={tableData} style={{whiteSpace: 'nowrap'}}>
                    {formatDate(item.startDate)}
                  </TableCell>
                  <TableCell align="center" sx={tableData} style={{whiteSpace: 'nowrap'}}>
                    {formatDate(item.endDate)}
                  </TableCell>
                  <TableCell align="center" sx={tableData}>
                    {item.userId?.name}
                  </TableCell>
                
                  <TableCell align="center" sx={tableData}>
                    {item.assignedUser?.firstname} {' '} {item.assignedUser?.lastname}
                  </TableCell>
                  <TableCell align="center" sx={tableData} style={{width :'20% !important'}}>
                    {
                      Array.isArray(item.intrestedUsers)?
                      item.intrestedUsers.map((item, index) => (
                        <div style={{backgroundColor : 'blue', padding : 2, borderRadius : 10, margin : 5, color :'white', display :'inline-block', width :'100%', fontSize : 10,whiteSpace: 'nowrap'}} key={index}>{item?.firstname} {' '} {item?.lastname}</div>
                      ))
                      : null
                    }
                  </TableCell>
                  <TableCell align="center" sx={tableData}>
                    {item.totalHours}
                  </TableCell>
                  <TableCell align="center" sx={tableData}>
                    {item.status}
                  </TableCell>
                  <TableCell align="center" sx={tableData} style={{whiteSpace: 'nowrap'}}>
                    {formatDate(item.createdAt)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow >
                <TablePagination
                  align="right"
                  rowsPerPageOptions={[10, 25, 50]}
                  colSpan={getColSpan()}
                  count={rowCount()}
                  rowsPerPage={perPage}
                  page={page}
                  SelectProps={{
                    inputProps: {
                      "aria-label": "rows per page",
                    },
                    native: true,
                  }}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
      }
      {
        (report.reportId === 3 && roasterLogs.length > 0) &&
        <TableContainer component={Paper} sx={{ mx: "0.8rem" }}>
          <Table
            sx={{ minWidth: "auto" }}
            aria-label="custom pagination table"
            className="responsive-table"
          >
            <TableHead>
              <TableRow className="table-header">
                <TableCell align="center" component="th" sx={tableHeader}>
                  Shift Code
                </TableCell>
                <TableCell align="center" component="th" sx={tableHeader}>
                  Role
                </TableCell>
                <TableCell align="center" component="th" sx={tableHeader}>
                  Site
                </TableCell>
                <TableCell align="center" component="th" sx={tableHeader}>
                  Assigned User
                </TableCell>
                <TableCell align="center" component="th" sx={tableHeader}>
                  Start Time
                </TableCell>
                <TableCell align="center" component="th" sx={tableHeader}>
                  End Time
                </TableCell>
                <TableCell align="center" component="th" sx={tableHeader}>
                  Start Date
                </TableCell>
                <TableCell align="center" component="th" sx={tableHeader}>
                  End Date
                </TableCell>
                <TableCell align="center" component="th" sx={tableHeader}>
                  Created By
                </TableCell>
                <TableCell align="center" component="th" sx={tableHeader}>
                  Total Hours
                </TableCell>
                {/* <TableCell align="center" component="th" sx={tableHeader}>
                  Created At
                </TableCell> */}
              </TableRow>
            </TableHead>
            <TableBody>
              {roasterLogs.slice(page * perPage, page * perPage + perPage).map((item, index) => (
                <TableRow key={index}>
                  <TableCell align="left" sx={tableData}>
                   {item.shiftCode}
                  </TableCell>
                  <TableCell align="left" sx={tableData}>
                    {item.role?.name}
                  </TableCell>
                  <TableCell align="center" sx={tableData}>
                    {item.siteId?.name}
                  </TableCell>
                  <TableCell align="center" sx={tableData}>
                    {item.assignedUser?.firstname} {' '}  {item.assignedUser?.firstname}
                  </TableCell>
                  <TableCell align="center" sx={tableData}>
                    {item.startTime}
                  </TableCell>
                  <TableCell align="center" sx={tableData}>
                    {item.endTime}
                  </TableCell>
                  <TableCell align="center" sx={tableData}>
                    {formatDate(item.startDate)}
                  </TableCell>
                  <TableCell align="center" sx={tableData}>
                   {formatDate(item.endDate)}
                  </TableCell>
                  <TableCell align="center" sx={tableData}>
                  {item.userId?.firstname} {' '}  {item.userId?.firstname}
                  </TableCell>
                  <TableCell align="center" sx={tableData}>
                   {item.totalHours}
                  </TableCell>
                 
                  {/* <TableCell align="center" sx={tableData}>
                    {formatDate(item.createdAt)}
                  </TableCell> */}
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
              <TablePagination
                  align="right"
                  rowsPerPageOptions={[10, 25, 50]}
                  colSpan={getColSpan()}
                  count={rowCount()}
                  rowsPerPage={perPage}
                  page={page}
                  SelectProps={{
                    inputProps: {
                      "aria-label": "rows per page",
                    },
                    native: true,
                  }}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
            
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
      }

      {
        (report.reportId === 4 && lateLogs.length > 0) &&
        <TableContainer component={Paper} sx={{ mx: "0.8rem" }}>
          <Table
            sx={{ minWidth: "auto" }}
            aria-label="custom pagination table"
            className="responsive-table"
          >
            <TableHead>
              <TableRow className="table-header">
                <TableCell align="center" component="th" sx={tableHeader}>
                  Shift 
                </TableCell>
                <TableCell align="center" component="th" sx={tableHeader}>
                  Site 
                </TableCell>
                <TableCell align="center" component="th" sx={tableHeader}>
                  User
                </TableCell>
                <TableCell align="center" component="th" sx={tableHeader}>
                  Type
                </TableCell>
                <TableCell align="center" component="th" sx={tableHeader}>
                  Start Date
                </TableCell>
                <TableCell align="center" component="th" sx={tableHeader}>
                  End Date
                </TableCell>
                <TableCell align="center" component="th" sx={tableHeader}>
                  Break Duration
                </TableCell>
                <TableCell align="center" component="th" sx={tableHeader}>
                  Status
                </TableCell>
                <TableCell align="center" component="th" sx={tableHeader}>
                  Created At
                </TableCell>
               
              </TableRow>
            </TableHead>
            <TableBody>
              {lateLogs.slice(page * perPage, page * perPage + perPage).map((item, index) => (
                <TableRow key={index}>
                  <TableCell align="left" sx={tableData}>
                    {item.shiftId}
                  </TableCell>
                  <TableCell align="left" sx={tableData}>
                    {item.siteId?.name}
                  </TableCell>
                  <TableCell align="left" sx={tableData}>
                    {item.userId?.firstname}  {' '} {item.userId?.lastname}
                  </TableCell>
                  <TableCell align="center" sx={tableData}>
                    {item.type}
                  </TableCell>
                  <TableCell align="center" sx={tableData}>
                    {formatDate(item.startDate)}
                  </TableCell>
                  <TableCell align="center" sx={tableData}>
                    {formatDate(item.endDate)}
                  </TableCell>
                  <TableCell align="center" sx={tableData}>
                    {item.breakDuration}
                  </TableCell>
                  <TableCell align="center" sx={tableData}>
                    {item.status}
                  </TableCell>
                  <TableCell align="center" sx={tableData}>
                    {formatDate(item.createdAt)}
                  </TableCell>
              
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
              <TablePagination
                  align="right"
                  rowsPerPageOptions={[10, 25, 50]}
                  colSpan={getColSpan()}
                  count={rowCount()}
                  rowsPerPage={perPage}
                  page={page}
                  SelectProps={{
                    inputProps: {
                      "aria-label": "rows per page",
                    },
                    native: true,
                  }}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
      }

      {
        (report.reportId === 5 && failLogs.length > 0) &&
        <TableContainer component={Paper} sx={{ mx: "0.8rem" }}>
          <Table
            sx={{ minWidth: "auto" }}
            aria-label="custom pagination table"
            className="responsive-table"
          >
            <TableHead>
              <TableRow className="table-header">
                <TableCell align="center" component="th" sx={tableHeader}>
                  Shift Code
                </TableCell>
                <TableCell align="center" component="th" sx={tableHeader}>
                  Shift Type
                </TableCell>
                <TableCell align="center" component="th" sx={tableHeader}>
                  Site
                </TableCell>
                {/* <TableCell align="center" component="th" sx={tableHeader}>
                  Roaster
                </TableCell> */}
             
           
                <TableCell align="center" component="th" sx={tableHeader}>
                  Shift Date
                </TableCell>
                <TableCell align="center" component="th" sx={tableHeader}>
                  Start Date
                </TableCell>
                <TableCell align="center" component="th" sx={tableHeader}>
                  End Date
                </TableCell>
                <TableCell align="center" component="th" sx={tableHeader}>
                  Start Time
                </TableCell>
                <TableCell align="center" component="th" sx={tableHeader}>
                  End Time
                </TableCell>
                <TableCell align="center" component="th" sx={tableHeader}>
                  Clock In Time
                </TableCell>
                <TableCell align="center" component="th" sx={tableHeader}>
                  Clock Out Time
                </TableCell>
                <TableCell align="center" component="th" sx={tableHeader}>
                  Failed Date
                </TableCell>
                <TableCell align="center" component="th" sx={tableHeader}>
                  Created At
                </TableCell>
               
              </TableRow>
            </TableHead>
            <TableBody>
              {failLogs.slice(page * perPage, page * perPage + perPage).map((item, index) => (
                <TableRow key={index}>
                  <TableCell align="left" sx={tableData}>
                    {item.shift.shiftCode}
                  </TableCell>
                  <TableCell align="left" sx={tableData}>
                    {item.shift.shiftType}
                  </TableCell>
                  <TableCell align="left"  sx={tableData} className=" no-wrap">
                    {item.shift.siteId?.name}
                  </TableCell>
                  {/* <TableCell align="center" className="t-body-cell no-wrap">
                    <table className="table">
                      <tr>
                        <th>Shift</th>
                        <th>Site</th>
                        <th>Assigned User</th>
                        <th>Date</th>
                        <th>Time</th>
                      </tr>
                      <tr>
                        <td>{item.shift.rosterId?.shiftCode}</td>
                        <td>{item.shift.rosterId?.siteId?.name}</td>
                        <td>{item.shift.rosterId?.assignedUser?.firstname}{' '}{item.shift.rosterId?.assignedUser?.lastname}</td>
                        <td>
                          {formatDate(item.shift.rosterId?.startDate) + ' - ' + formatDate(item.shift.rosterId?.endDate)}
                        </td>
                        <td>
                          {item.shift.rosterId?.startTime + ' - ' + item.shift.rosterId?.endTime}
                        </td>
                      </tr>
                    </table>
                  </TableCell> */}
                  <TableCell align="center"  sx={tableData} className="no-wrap">
                    {formatDate(item.shift.shiftDate)}
                  </TableCell>
                  <TableCell align="center"  sx={tableData} className="no-wrap">
                    {formatDate(item.shift.startDate)}
                  </TableCell>
                  <TableCell align="center"  sx={tableData} className="no-wrap">
                    {formatDate(item.shift.endDate)}
                  </TableCell>
                  <TableCell align="center"  sx={tableData} className="no-wrap">
                    {item.shift.startTime}
                  </TableCell>
                  <TableCell align="center"   sx={tableData} className=" no-wrap">
                    {item.shift.endTime}
                  </TableCell>
                  <TableCell align="center"  sx={tableData}  className="no-wrap">
                    {item.shift.clockInTime !== null  ? formatDate(item.shift.clockInTime) :'NA'}
                  </TableCell>
                  <TableCell align="center" sx={tableData} className="no-wrap">
                   {item.shift.clockOutTime !== null  ? formatDate(item.shift.clockOutTime) :'NA'}
                  </TableCell>
                  <TableCell align="center" sx={tableData}>
                   {
                    item.failedDate.map((item,index) => (
                      <span style={{backgroundColor : '#0069D9',  borderRadius : 10, margin : 5, color :'white', display :'inline-block', fontSize : 10,whiteSpace: 'nowrap', paddingHorizontal :  60}} key={index}>&nbsp;&nbsp;{item}&nbsp;&nbsp;</span>
                    ))
                   }
                  </TableCell>
                  <TableCell align="center"  sx={tableData} className="no-wrap">
                    {formatDate(item.shift.createdAt)}
                  </TableCell>
              
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
              <TablePagination
                   align="right"
                   rowsPerPageOptions={[10, 25, 50]}
                   colSpan={getColSpan()}
                   count={rowCount()}
                   rowsPerPage={perPage}
                   page={page}
                   SelectProps={{
                     inputProps: {
                       "aria-label": "rows per page",
                     },
                     native: true,
                   }}
                   onPageChange={handleChangePage}
                   onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
      }


      {
        (report.reportId === 6 && all.length > 0) &&
        <TableContainer component={Paper} sx={{ mx: "0.8rem" }}>
          <Table
            sx={{ minWidth: "auto" }}
            aria-label="custom pagination table"
            className="responsive-table"
          >
            <TableHead>
              <TableRow className="table-header">
                <TableCell align="center" component="th" sx={tableHeader}>
                  Report Type
                </TableCell>
                <TableCell align="center" component="th" sx={tableHeader}>
                  Site 
                </TableCell>
                <TableCell align="center" component="th" sx={tableHeader}>
                Report Date		
                </TableCell>
               
                <TableCell align="center" component="th" sx={tableHeader}>
                  Note
                </TableCell>
                <TableCell align="center" component="th" sx={tableHeader}>
                 View  Questions
                </TableCell>
                <TableCell align="center" component="th" sx={tableHeader}>
                 Export File
                </TableCell>
               
              </TableRow>
            </TableHead>
            <TableBody>
             
              {all.map((item, index) => (
                <TableRow key={index}>
                  <TableCell align="left" sx={tableData}>
                    {item.reportTypeId?.name}
                  </TableCell>
                  <TableCell align="left" sx={tableData}>
                   
                  </TableCell>
                 
                  <TableCell align="center"  sx={tableData} className="no-wrap">
                    {formatDate(item.createdAt)}
                  </TableCell>
                  
                  <TableCell align="center"  sx={tableData} className="wrap">
                   {item?.note}
                  </TableCell>
                  <TableCell align="center" sx={tableData}>
                  <button className="pointer" onClick={()=>{viewQuestionsModel(item)}}>View</button>
                  </TableCell>
                  <TableCell align="center" sx={tableData}>
                   <div className="pointer" >
                   <Link onClick={()=>exportQue(item?._id)}> Export File</Link>
                  </div>
                  </TableCell>
              
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
              <TablePagination
                  align="right"
                  rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
                  colSpan={getColSpan()}
                  count={rowCount()}
                  rowsPerPage={10}
                  page={0}
                  SelectProps={{
                    inputProps: {
                      "aria-label": "rows per page",
                    },
                    native: true,
                  }}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  ActionsComponent={TablePaginationActions}
                />
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
      }

      {
        (report.reportId === 7 && taskLogs.length > 0) &&
        <TableContainer component={Paper} sx={{ mx: "0.8rem" }}>
          <Table
            sx={{ minWidth: "auto" }}
            aria-label="custom pagination table"
            className="responsive-table"
          >
            <TableHead>
              <TableRow className="table-header">
                <TableCell align="center" component="th" sx={tableHeader}>
                  WO. Number
                </TableCell>
                <TableCell align="center" component="th" sx={tableHeader}>
                  Company
                </TableCell>
                <TableCell align="center" component="th" sx={tableHeader}>
                  Site
                </TableCell>
                {/* <TableCell align="center" component="th" sx={tableHeader}>
                  Service
                </TableCell> */}
                <TableCell align="center" component="th" sx={tableHeader}>
                  Title
                </TableCell>
                <TableCell align="center" component="th" sx={{width: '20% !important', tableHeader}}>
                  Description
                </TableCell>
                <TableCell align="center" component="th" sx={tableHeader}>
                  Due Date
                </TableCell>
                <TableCell align="center" component="th" sx={tableHeader}>
                  Due Time
                </TableCell>
                <TableCell align="center" component="th" sx={tableHeader}>
                  Status
                </TableCell>
                <TableCell align="center" component="th" sx={tableHeader}>
                  Created At
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {taskLogs.slice(page * perPage, page * perPage + perPage).map((item, index) => (
                <TableRow key={index}>
                  <TableCell align="left" sx={tableData}>
                    {item?.workOrderNo}
                  </TableCell>
                  <TableCell align="left" sx={tableData}>
                   {item?.companyId?.name}
                  </TableCell>
                  <TableCell align="center"  sx={tableData} className="no-wrap">
                    {item?.siteId?.name}
                  </TableCell>
                  {/* <TableCell align="center"  sx={tableData} className=" no-wrap">
                   {item?.serviceCategory}
                  </TableCell> */}
                  <TableCell align="center"  sx={tableData} className="no-wrap">
                   {item?.title}
                  </TableCell>
                  <TableCell align="center"  sx={tableData} className="wrap" style={{width : 70, wordBreak : 'break-word'}}>
                    {item?.description.slice(0, 70)}...
                  </TableCell>
                  <TableCell align="center"  sx={tableData} className="no-wrap">
                   {formatDate(item?.dueDate)}
                  </TableCell>
                  <TableCell align="center"  sx={tableData} className="no-wrap">
                   {item?.timeDue}
                  </TableCell>
                  <TableCell align="center"  sx={tableData} className=" no-wrap">
                   {item?.status}
                  </TableCell>
                  <TableCell align="center"  sx={tableData} className=" no-wrap">
                    {formatDate(item.createdAt)}
                  </TableCell>
              
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
              <TablePagination
                  align="right"
                  rowsPerPageOptions={[10, 25, 50]}
                  colSpan={getColSpan()}
                  count={rowCount()}
                  rowsPerPage={perPage}
                  page={page}
                  SelectProps={{
                    inputProps: {
                      "aria-label": "rows per page",
                    },
                    native: true,
                  }}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
      }

      {
        (report.reportId === 8 && supportLogs.length > 0) &&
        <TableContainer component={Paper} sx={{ mx: "0.8rem" }}>
          <Table
            sx={{ minWidth: "auto" }}
            aria-label="custom pagination table"
            className="responsive-table"
          >
            <TableHead>
              <TableRow className="table-header">
                <TableCell align="center" component="th" sx={tableHeader}>
                Ticket Id
                </TableCell>
                <TableCell align="center" component="th" sx={tableHeader}>
                  User
                </TableCell>
                <TableCell align="center" component="th" sx={tableHeader}>
                  Title
                </TableCell>
                <TableCell align="center" component="th" sx={tableHeader}>
                  Issue
                </TableCell>
                <TableCell align="center" component="th" sx={tableHeader}>
                  Issue Date
                </TableCell>
                <TableCell align="center" component="th" sx={tableHeader}>
                  Close Date
                </TableCell>
                <TableCell align="center" component="th" sx={tableHeader} >
                  Status
                </TableCell>
                <TableCell align="center" component="th" sx={tableHeader}>
                  Created At
                </TableCell>
               
              </TableRow>
            </TableHead>
            <TableBody>
              {supportLogs.slice(page * perPage, page * perPage + perPage).map((item, index) => (
                <TableRow key={index}>
                  <TableCell align="left" sx={tableData}>
                    {item?.ticketId}
                  </TableCell>
                  <TableCell align="left" sx={tableData}>
                   {item?.userId?.firstname ? `${item?.userId?.firstname} ${item?.userId?.lastname}` : 'NA'}
                  </TableCell>
                  <TableCell align="center"  sx={tableData} className="no-wrap">
                    {item?.title}
                  </TableCell>
                  <TableCell align="center"  sx={tableData} className=" no-wrap">
                   {item?.issue}
                  </TableCell>
                  <TableCell align="center"  sx={tableData} className="no-wrap">
                   {formatDate(item?.issueDate)}
                  </TableCell>
                  <TableCell align="center"  sx={tableData} className=" no-wrap" >
                   {item?.closeDate !== null ? formatDate(item?.closeDate) : 'NA'}
                  </TableCell>
                  <TableCell align="center"  sx={tableData} className=" no-wrap">
                   {item?.statusId?.name}
                  </TableCell>
                  <TableCell align="center" className="t-body-cell no-wrap">
                    {formatDate(item.createdAt)}
                  </TableCell>
              
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
              <TablePagination
                  align="right"
                  rowsPerPageOptions={[10, 25, 50]}
                  colSpan={getColSpan()}
                  count={rowCount()}
                  rowsPerPage={perPage}
                  page={page}
                  SelectProps={{
                    inputProps: {
                      "aria-label": "rows per page",
                    },
                    native: true,
                  }}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
      }

      {
        (report.reportId === 9 && alarmLogs.length > 0) &&
        <TableContainer component={Paper} sx={{ mx: "0.8rem" }}>
          {console.log('ALARM RESPONSE', alarmLogs)}
          <Table
            sx={{ minWidth: "auto" }}
            aria-label="custom pagination table"
            className="responsive-table"
          >
            <TableHead>
              <TableRow className="table-header">
                <TableCell align="center" component="th" sx={tableHeader}>
                 Company
                </TableCell>
                <TableCell align="center" component="th" sx={tableHeader}>
                  User
                </TableCell>
                <TableCell align="center" component="th" sx={tableHeader}>
                  Mobile 
                </TableCell>
                <TableCell align="center" component="th" sx={tableHeader}>
                  Site 
                </TableCell>
                <TableCell align="center" component="th" sx={tableHeader}>
                  Shift Recurrence
                </TableCell>
                <TableCell align="center" component="th" sx={tableHeader}>
                  Start Date
                </TableCell>
                <TableCell align="center" component="th" sx={tableHeader}>
                  End Date
                </TableCell>
                <TableCell align="center" component="th" sx={tableHeader}>
                  Start Time
                </TableCell>
                <TableCell align="center" component="th" sx={tableHeader}>
                  End Time
                </TableCell>
                <TableCell align="center" component="th" sx={tableHeader} >
                  Status
                </TableCell>
            
                <TableCell align="center" component="th" sx={tableHeader}>
                  Created At
                </TableCell>
               
              </TableRow>
            </TableHead>
            <TableBody>
              {alarmLogs.slice(page * perPage, page * perPage + perPage).map((item, index) => (
                <TableRow key={index}>
                  <TableCell align="left" sx={tableData}>
                    {item?.company?.name}
                  </TableCell>
                  <TableCell align="left" sx={tableData}>
                   {(item?.userId?.firstname !== undefined && item?.userId?.firstname !== null) ? `${item?.userId?.firstname} ${item?.userId?.lastname}`  : 'NA'}
                  </TableCell>
                  <TableCell align="center"  sx={tableData} className="no-wrap">
                    {item?.mobileNumber}
                  </TableCell>
                  <TableCell align="center"  sx={tableData} className="no-wrap">
                    {
                      item.sites.length > 0 ?
                      item.sites.map((item, index) => (
                        <div key={index}>
                          {item?.siteId?.name} 
                        </div>
                      ))
                      :
                      'NA'
                    }
                  </TableCell>
                  <TableCell align="center"  sx={tableData} className="no-wrap">
                    {item?.shiftRecurrence?.name}
                  </TableCell>
                  <TableCell align="center"  sx={tableData} className="no-wrap">
                   {formatDate(item?.startDate)}
                  </TableCell>
                  <TableCell align="center"  sx={tableData} className=" no-wrap">
                   {formatDate(item?.endDate)}
                  </TableCell>
                  <TableCell align="center"  sx={tableData} className="no-wrap" >
                   {item?.startTime}
                  </TableCell>
                  <TableCell align="center"  sx={tableData} className="no-wrap" >
                   {item?.endTime}
                  </TableCell>
                  <TableCell align="center" className="t-body-cell no-wrap">
                   {item?.status}
                  </TableCell>
                  <TableCell align="center" className="t-body-cell no-wrap">
                    {formatDate(item.createdAt)}
                  </TableCell>
              
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
              <TablePagination
                  align="right"
                  rowsPerPageOptions={[10, 25, 50]}
                  colSpan={getColSpan()}
                  count={rowCount()}
                  rowsPerPage={perPage}
                  page={page}
                  SelectProps={{
                    inputProps: {
                      "aria-label": "rows per page",
                    },
                    native: true,
                  }}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
      }


      {
        (report.reportId === 10 && shifts.length > 0) &&
        <TableContainer component={Paper} sx={{ mx: "0.8rem" }}>
          <Table
            sx={{ minWidth: "auto" }}
            aria-label="custom pagination table"
            className="responsive-table"
          >
            <TableHead>
              <TableRow className="table-header">
                <TableCell align="center" component="th" sx={tableHeader}>
                 Shift Code
                </TableCell>
                <TableCell align="center" component="th" sx={tableHeader}>
                  Media
                </TableCell>
                <TableCell align="center" component="th" sx={tableHeader}>
                  Log 
                </TableCell>
                <TableCell align="center" component="th" sx={tableHeader}>
                  Created At
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {shifts.slice(page * perPage, page * perPage + perPage).map((item, index) => (
                <TableRow key={index}>
                  <TableCell align="left" sx={tableData}>
                    {item?.shiftId?.shiftCode}
                  </TableCell>
                  <TableCell align="left" sx={tableData}>
                   {
                    item.media !== null ?
                    <img src={item.media}  style={{width : 120, height : 90}}/>
                    :
                    null
                   }
                  </TableCell>
                  <TableCell align="center"  sx={tableData} className="wrap">
                    <div style={{wordWrap: 'break-word !important', width : 400}}>
                       {item?.log.slice(0, 100)}...     
                    </div>
                  </TableCell>
                  <TableCell align="center"  sx={tableData} className="no-wrap">
                    {formatDate(item.createdAt)}
                  </TableCell>
              
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TablePagination
                  align="right"
                  rowsPerPageOptions={[10, 25, 50]}
                  colSpan={getColSpan()}
                  count={rowCount()}
                  rowsPerPage={perPage}
                  page={page}
                  SelectProps={{
                    inputProps: {
                      "aria-label": "rows per page",
                    },
                    native: true,
                  }}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
      }

      {
        rowCount() <= 0 &&
        <TableContainer style={{backgroundColor : '#FFFFFF'}}>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell>
                  <h2 variant="h1" align="center">No Record Found</h2>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      }

      {/* View Modal */}
      <Dialog open={show} onClose={handleShowClose} fullWidth={true}>
        <DialogTitle sx={{ mb: 6 , textAlign :"center" }}>Questions</DialogTitle>
        
        <DialogContent>
          <Box
            component="form"
            sx={{
              '& .MuiTextField-root': { m: 5,   p:5, width: '100%' },
            }}
            noValidate
            autoComplete="off"
          >
                    <table className="table">
                      <tr>
                        <th>Question</th>
                        <th>Answer</th>
                        <th>Comment</th>
                      </tr>
                      {
                        questions.map((item, index) => (
                          <tr>
                            <td>{item?.questionId?.question}</td>
                            <td>{item?.answer}</td>
                            <td>{item?.comment}</td>
                          </tr>
                        ))
                        
                      }
                    </table>
           
          </Box>
        </DialogContent>
        
      </Dialog>
      </Box>
    </Box>
  );
}
