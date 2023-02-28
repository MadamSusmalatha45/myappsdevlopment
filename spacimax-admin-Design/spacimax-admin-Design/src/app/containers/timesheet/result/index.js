import React, { useEffect } from "react";
import { Box, Grid, Button, Typography, Divider } from "@mui/material";
import PageTitle from "../../../common/PageTitle";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
// import TableFooter from '@mui/material/TableFooter';
// import TablePagination from '@mui/material/TablePagination'; 
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TableHead from '@mui/material/TableHead';
// import { blue } from '@mui/material/colors';
// import AddCircleIcon from '@mui/icons-material/AddCircle';
// import InputLabel from '@mui/material/InputLabel';
// import FormHelperText from '@mui/material/FormHelperText';
// import FormControl from '@mui/material/FormControl';
// import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { useNavigate, useLocation } from "react-router-dom";
import { tableHeader, tableData, getTimeFromDate } from "../../../utils";
import { getAPI } from "../../../network";
import "./style.css";
import { axiosInstance } from "../../../../utils/axiosSetup";
import moment from "moment";



export default function TimesheetResultPage(props) {
  const location = useLocation();
  const [siteId, setSiteId] = React.useState("");
  const [timeSheets, setTimeSheets] = React.useState({});
  const navigateTo = useNavigate();
  const Id = location.state.id

  if (location != null) {
    if (location?.state?.Item) {
      setTimeSheets(location.state.task)
    }
  }

  useEffect(() => {
    setSiteId(siteId);
    getTimeSheetData();

  }, []);
  const getTimeSheetData = async () => {
    try {
      const res = await getAPI(`/admin/timesheet/${Id}`);

      setTimeSheets(res);
      return res;
    } catch (error) {
      return error.message || error.msg;
    }
  };
  console.log("TimeSheet---+++++++++++++++++++++++++++", timeSheets)
  // const handleTimeSheetApproved = async (id) => {
  //   try {
  //     const res = await axiosInstance.patch(`/admin/timesheet/change-status/${id}`, {
  //       status: "62ad8408ae2a0f2b4881335f",
  //        notes: "Notes by approver"
  //     });
  //     navigateTo(-1);
  //     return res.data;
  //   } catch (error) {
  //     return error.message || error.msg;
  //   }
  // }

  const handleTimeSheet = async (id, action) => {
    try {
      if (action == 'reject') {
        const res = await axiosInstance.patch(`/admin/timesheet/change-status/${id}`, {
          statusId: "63179460c88973410f3bd040",
         
        });
        navigateTo(-1);
        return res.data;
      }
      else {
        const res = await axiosInstance.patch(`/admin/timesheet/change-status/${id}`, {
          statusId: "62ad8408ae2a0f2b4881335f",
         
        });
        navigateTo(-1);
        return res.data;
      }


    } catch (error) {
      return error.message || error.msg;
    }
  }

  return (
    <Box sx={{ height: "inherit" }}>
      <PageTitle title="Timesheets" />
      <Grid className="sort-box" container direction={"row"} sx={{ mr: "0.8rem", mt: "3rem" }} >
        {/* {console.log("timeSheets?.statusId?.name============",timeSheets)} */}
        {timeSheets?.statusId?.name === "Submitted" ?
          <Grid item xs={8} textAlign='center' >
            {/* <Button variant='outlined' className="btn-input" onClick={() => {
            alert('clicked');
          }}>
            Approve
          </Button> */}

            <Box sx={{ height: "inherit", mr: 1.5, my: 4 }} className="small-box"  >
              <Typography variant="h6" component="h5" className="box-heading">
                Timesheet Week Ending  {moment(timeSheets?.createdAt).format("MMM Do YYYY")}
              </Typography>
              <Divider />
              <Box sx={{ height: "inherit" }} className="hybrid-box" textAlign='left'>
                <div>
                  <span className="hybrid-box-heading">
                    Guard Name :
                  </span>
                  <span className="hybrid-box-value">
                    {timeSheets?.userId?.firstname + ' ' + timeSheets?.userId?.lastname}
                  </span>
                </div>
                <div>
                  <span className="hybrid-box-heading">
                    Site :
                  </span>
                  <span className="hybrid-box-value">
                    {timeSheets?.siteId?.name}

                  </span>
                </div>
                {/* <div>
                  <span className="hybrid-box-heading">
                    Role :
                  </span>
                  <span className="hybrid-box-value">
                    Roving Guard
                  </span>
                </div> */}
                {/* <div>
                  <span className="hybrid-box-heading">
                    Approver :
                  </span>
                  <span className="hybrid-box-value">
                    John Smith
                  </span> */}
                {/* </div> */}
              </Box>

              <TableContainer component={Paper}  >
                <Table sx={{ minWidth: 'auto' }} aria-label="custom pagination table" className="responsive-table">
                  <TableHead >
                    <TableRow className="table-header">
                      <TableCell align="center" component="th" sx={tableHeader}>Date</TableCell>
                      <TableCell align="center" component="th" sx={tableHeader}>Start time</TableCell>
                      <TableCell align="center" component="th" sx={tableHeader}>Finish time</TableCell>
                      <TableCell align="center" component="th" sx={tableHeader}>Break time</TableCell>
                      <TableCell align="center" component="th" sx={tableHeader}>Actual Start time</TableCell>
                      <TableCell align="center" component="th" sx={tableHeader}>Actual Finish time</TableCell>
                      <TableCell align="center" component="th" sx={tableHeader}>Actual Break time</TableCell>
                      <TableCell align="center" component="th" sx={tableHeader}>Total</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {console.log("TIMESHIT clock----", timeSheets.clock)}

                    {timeSheets.clock?.map((item, index) => (
                      <TableRow>
                        {/* {console.log(new Date(item?.endDateTime).toLocaleTimeString(), "items------*****************************")} */}
                        <TableCell align="center" sx={tableData}>
                          {moment(timeSheets?.createdAt).format("MMM Do YY")}
                        </TableCell>
                        <TableCell align="center" sx={tableData}>
                          {new Date(item?.startDateTime).toLocaleTimeString()}
                          {/* {moment(item?.startDateTime).format("MMM Do YY")} */}
                        </TableCell>
                        <TableCell align="center" sx={tableData}>
                        {new Date(item?.endDateTime).toLocaleTimeString()}

                          {/* {moment(item?.endDateTime).format("hh")} */}
                        </TableCell>
                        <TableCell align="center" sx={tableData} >
                          {item?.break}
                        </TableCell>
                        <TableCell align="center" sx={tableData} >
                          {new Date(item?.actualStartDateTime).toLocaleTimeString()}
                        </TableCell>
                        <TableCell align="center" sx={tableData} >
                        {new Date(item?.actualEndDateTime).toLocaleTimeString()}
                        </TableCell>
                        <TableCell align="center" sx={tableData} >
                          {item?.actualBreakTime}
                        </TableCell>
                        <TableCell align="center" sx={tableData}>
                          {item?.totalTime}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                  <div style={{ margin: 5 }}></div>
                  <TableHead >
                    <TableRow className="table-header table-bottom">
                      <TableCell align="center" component="th" className="t-cell-bottom">Total</TableCell >
                      <TableCell align="right" component="th" className="t-cell-bottom" colSpan={7}>{timeSheets?.totalHours}</TableCell>

                    </TableRow>
                  </TableHead>
                </Table>
              </TableContainer>

              <Box sx={{ height: "inherit" }} className="hybrid-bottom-box" textAlign='left'>
                <Typography className="hybrid-box-heading">
                  Workspace injuries :
                </Typography>
                <Typography className="hybrid-box-value" mx={{ mt: 2 }}>
                  I did not sustain a reportable workplace injury during this period.
                </Typography>
              </Box>

              <Box sx={{ height: "inherit", mx: 5 }} className="hybrid-bottom-box" display="flex" justifyContent="space-around">
                <Button variant='outlined' className="btn-input-dark" onClick={() => {
                  handleTimeSheet(timeSheets?.id, 'approve')


                }}>
                  Approved
                </Button>
                <Button variant='outlined' className="btn-input-dark" onClick={() => {
                  handleTimeSheet(timeSheets?.id, 'reject')

                }}>
                  Reject
                </Button>
              </Box>
              <div style={{ height: 90, backgroundColor: 'white' }}>

              </div>
            </Box>

          </Grid> :
          <Grid item xs={8} textAlign='center' >
            {/* <Button variant='outlined'  className="btn-input" onClick={() => {
          alert('clicked');
        }}>
          View
        </Button> */}
            <Box sx={{ height: "inherit" }} className="small-box" >
              <Typography variant="h6" component="h6" className="box-heading">
                Timesheet Week Ending 27 Apr 2002
              </Typography>
              <Divider />
              <Box sx={{ height: "inherit" }} className="hybrid-box" textAlign='left'>
                <div>
                  <span className="hybrid-box-heading">
                    Guard Name :
                  </span>
                  <span className="hybrid-box-value">
                    {timeSheets?.userId?.firstname + ' ' + timeSheets?.userId?.lastname}

                  </span>
                </div>
                <div>
                  <span className="hybrid-box-heading">
                    Site :
                  </span>
                  <span className="hybrid-box-value">
                    {timeSheets?.siteId?.name}

                  </span>
                </div>
                {/* <div>
                  <span className="hybrid-box-heading">
                    Role :
                  </span>
                  <span className="hybrid-box-value">
                    Roving Guard
                  </span>
                </div> */}
                <div>
                  <span className="hybrid-box-heading">
                    Approver :
                  </span>
                  <span className="hybrid-box-value">
                    John Smith
                  </span>
                </div>
              </Box>
              <TableContainer component={Paper}  >
                <Table sx={{ minWidth: 'auto' }} aria-label="custom pagination table" className="responsive-table">
                  <TableHead >
                    <TableRow className="table-header">
                      <TableCell align="center" component="th" sx={tableHeader}>Date</TableCell>
                      <TableCell align="center" component="th" sx={tableHeader}>Start time</TableCell>
                      <TableCell align="center" component="th" sx={tableHeader}>Finish time</TableCell>
                      <TableCell align="center" component="th" sx={tableHeader}>Break time</TableCell>
                      <TableCell align="center" component="th" sx={tableHeader}>Actual Start time</TableCell>
                      <TableCell align="center" component="th" sx={tableHeader}>Actual Finish time</TableCell>
                      <TableCell align="center" component="th" sx={tableHeader}>Actual Break time</TableCell>
                      <TableCell align="center" component="th" sx={tableHeader}>Total</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {timeSheets.clock?.map((item, index) => (
                      <TableRow>
                      {/* {console.log(new Date(item?.endDateTime).toLocaleTimeString(), "items------*****************************")} */}
                      <TableCell align="center" sx={tableData}>
                        {moment(timeSheets?.createdAt).format("MMM Do YY")}
                      </TableCell>
                      <TableCell align="center" sx={tableData}>
                        {new Date(item?.startDateTime).toLocaleTimeString()}
                        {/* {moment(item?.startDateTime).format("MMM Do YY")} */}
                      </TableCell>
                      <TableCell align="center" sx={tableData}>
                      {new Date(item?.endDateTime).toLocaleTimeString()}

                        {/* {moment(item?.endDateTime).format("hh")} */}
                      </TableCell>
                      <TableCell align="center" sx={tableData} >
                        {item?.break}
                      </TableCell>
                      <TableCell align="center" sx={tableData} >
                        {new Date(item?.actualStartDateTime).toLocaleTimeString()}
                      </TableCell>
                      <TableCell align="center" sx={tableData} >
                      {new Date(item?.actualEndDateTime).toLocaleTimeString()}
                      </TableCell>
                      <TableCell align="center" sx={tableData} >
                        {item?.actualBreakTime}
                      </TableCell>
                      <TableCell align="center" sx={tableData}>
                        {item?.totalTime}
                      </TableCell>
                    </TableRow>
                    ))}
                  </TableBody>
                  <div style={{ margin: 5 }}></div>
                  <TableHead >
                    <TableRow className="table-header table-bottom">
                      <TableCell align="center" component="th" className="t-cell-bottom">Total</TableCell >
                      <TableCell align="right" component="th" className="t-cell-bottom" colSpan={7}>{timeSheets?.totalHours}</TableCell>

                    </TableRow>
                  </TableHead>
                </Table>
              </TableContainer>
              <Box sx={{ height: "inherit" }} className="hybrid-bottom-box" textAlign='left'>
                <Typography className="hybrid-box-heading">
                  Workspace injuries :
                </Typography>
                <Typography className="hybrid-box-value" mx={{ mt: 2 }}>
                  I did not sustain a reportable workplace injury during this period.
                </Typography>
              </Box>
              <Box sx={{ height: "inherit" }} className="hybrid-box" textAlign='left'>
                {/* <div>
                  <span className="hybrid-box-heading">
                    Guard Name :
                  </span>
                  <span className="hybrid-box-value">
                    {timeSheets?.userId?.firstname + ' ' + timeSheets?.userId?.lastname}

                  </span>
                </div> */}
                {/* <div>
                  <span className="hybrid-box-heading">
                    Site :
                  </span>
                  <span className="hybrid-box-value">
                    {timeSheets?.siteId?.address}

                  </span>
                </div> */}
                {/* <div>
                  <span className="hybrid-box-heading">
                    Role :
                  </span>
                  <span className="hybrid-box-value">
                    Roving Guard
                  </span>
                </div> */}
                {/* <div>
                  <span className="hybrid-box-heading">
                    Approver :
                  </span>
                  <span className="hybrid-box-value">
                    John Smith
                  </span>
                </div> */}
              </Box>

            </Box>
          </Grid>
        }



      </Grid>
    </Box>
  );
}


