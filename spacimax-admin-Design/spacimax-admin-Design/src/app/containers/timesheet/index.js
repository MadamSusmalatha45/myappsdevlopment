import React, {useEffect, useState} from "react";
import { Box, Link , Grid, Button } from "@mui/material";
import PageTitle from "../../common/PageTitle";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableFooter from '@mui/material/TableFooter';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TableHead from '@mui/material/TableHead';
// import { blue } from '@mui/material/colors';
// import AddCircleIcon from '@mui/icons-material/AddCircle';
// import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
// import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
// import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import LocalDateSelector from "../../common/LocalDateSelector";
// import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../../utils/axiosSetup";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import "./style.css";
import { getSites } from "../../../features/sites/sitesAPI";
import { selectSites } from "../../../features/sites/sitesSlice";
import { useDispatch, useSelector } from "react-redux";
import { selectGuards } from "../../../features/sites/sitesSlice";
import FilterAltOffIcon from '@mui/icons-material/FilterAltOff';
import { getAPI } from "../../network";
import Loader from "../../common/Loader";
import EmptyTable from "../../common/EmptyTable";
import { checkAuthority,tableHeader,tableData} from "../../utils";

export default function TimesheetPage(props) {

  const navigateTo = useNavigate();
  const current = new Date();
  const [selectedSite, setSelectedSite] = React.useState('');
  const [selectedGuard, setSelectedGuard] = React.useState('');
  const [selectedStatus, setSelectedStatus] = React.useState('');
  const [users, setUsers] = React.useState([]);
  const [guardList, setGuardList] = React.useState([]);
  const [statusList, setStatusList] = React.useState([]);
  const [selectedDate, setSelectedDate] = React.useState(null);
  const [loader, setLoader] = useState([])
  const [sites, setSites] = useState([])

  const [perPages, setPerPages] = useState([10,25, 50]);
  const [perPage, setPerPage] = useState(10)
  const [page, setPage] = useState(0)
 
  useEffect(() => {
    getSites()
    getTimeSheet();
    getGuardData();
    getTimeSheetStatus();
  }, []);

  const getSites = async() => {
    setLoader(true)
    let data = await getAPI('/sites');
    console.log(data,"DATA")
    if(data){
      setSites(data)
    }
    setLoader(false)
 
  }

  const getGuardData = async () => {
    setLoader(true)
    let data = await getAPI(`/admin/guards`);
    console.log("guards DATA--------",data)
    if(data){
      setGuardList(data)
    }
    setLoader(false)
  };

  const getTimeSheet = async () => {
    setLoader(true)
    let data = await getAPI(`/admin/timesheet`);
    console.log("timesheet DATA--------",data)
    if(data){
      setUsers(data)
    }
    setLoader(false)
  };

  const formatDate = (date) => {
    var d = new Date(date);
    return  (d.getFullYear().toString().length === 1 ? `0${d.getFullYear()}` : d.getFullYear()) + '-' + (d.getMonth().toString().length === 1 ? `0${d.getMonth()}` : d.getMonth()) + '-' + (d.getDate().toString().length === 1 ? `0${d.getDate()}` : d.getDate())  ;
  }
  
  const getTimeSheetFiltered = async (siteId = null, guardId = null, date = null, statusId = null) => {
    try {
      var siteId = siteId !== null ? siteId : selectedSite;
      var guardId = guardId !== null ? guardId : selectedGuard;
      var date = date !== null ? date : selectedDate;
      var statusId = statusId !== null ? statusId : selectedStatus;

      var extension = '';
      var first = true;
      if(siteId !== ''){
        extension += (first ? '?' : '&') + `siteId=${siteId}`;
        first = false;
      }
      if(guardId !== ''){
        extension += (first ? '?' : '&') + `guardId=${guardId}`;
        first = false;
      }
      if(date !== '' && date !== null){
        extension += (first ? '?' : '&') + `createdAt=${formatDate(date)}`;
        first = false;
      }
      if(statusId !== ''){
        extension += (first ? '?' : '&') + `statusId=${statusId}`;
        first = false;
      }
      const res = await axiosInstance.get(`/admin/timesheet${extension}`);
      setUsers(res.data?.data);
    } catch (error) {
      return error.message || error.msg;
    }
  };


  const getTimeSheetStatus = async () => {
    setLoader(true)
    let data = await getAPI(`/timesheet-statuses`);
    if(data){
      setStatusList(data)
    }
    setLoader(false)
    
  };

  const changeSite = (event) => {
    setSelectedSite(event.target.value);
    getTimeSheetFiltered(event.target.value, null, null, null);
  };

  const changeGuard = (event) => {
    setSelectedGuard(event.target.value);
    getTimeSheetFiltered(null, event.target.value, null, null);
  };

  const changeStatus = (event) => {
    
    setSelectedStatus(event.target.value);
    getTimeSheetFiltered(null, null, null, event.target.value);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    console.log(event.target.value)
    setPerPage(event.target.value)
    setPage(0);
  };

  // const handleSiteId= (id) => {
   
  //   navigate(`${window.location.pathname}/result`);
 
  //   props.onHandler(id);
  //   handleChangePage(id);
        
  // }

  const changeDate = (event) => {
   
    setSelectedDate(event);
    getTimeSheetFiltered(null, null, event, null);
  };

  const clearFilter = () => {
    setSelectedDate(null);
    setSelectedGuard('');
    setSelectedSite('');
    setSelectedStatus('');
    getTimeSheet();
  }


  return (
    <Box sx={{ height: "inherit" }}>
      <Loader loader={loader} />
      <PageTitle title="Timesheets"  />
      {
         checkAuthority('VIEW_TIMESHEETS') &&
         <>
         <Box
        display="flex"
        justifyContent="flex-end"
        alignItems="flex-end"
        sx={{mx : 8}}
      >
        <Button variant="contained" style={{backgroundColor : "grey"}} sx={{ height: 50 }} onClick={clearFilter}>
          <FilterAltOffIcon />
          Clear Filter
        </Button>
      </Box>

      <Grid container  className="sort-box" sx={{mx : "0.4rem",mt: "2rem", pr : "2rem"}} >
            <Grid item xs={3}>
            <FormControl sx={{ m: 1, width : "90%" }}>
                <Select
                    value={selectedSite}
                    onChange={changeSite}
                    displayEmpty 
                    inputProps={{ 'aria-label': 'Without label' }}
                    style={{borderRadius : 10, boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px', borderColor : "#707070", backgroundColor : 'white'}}
                 
                    >
                    <MenuItem value="">
                    <div className="selectitem">Select Site</div>
                    </MenuItem>
                    {
                        sites.map((item, index) => (
                            <MenuItem value={item?._id} key={index}>{item?.name}</MenuItem>
                        ))
                    }
                </Select>
            </FormControl>
            </Grid>   
            {/* <Grid item xs={3}>
            <FormControl sx={{ m: 1, width : "90%" }}>
                <Select
                    value={selectedGuard}
                    onChange={changeGuard}
                    displayEmpty
                    inputProps={{ 'aria-label': 'Without label' }}
                    style={{borderRadius : 10, boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px', borderColor : "#707070" , backgroundColor : 'white'}}
                    >
                    <MenuItem value="">
                    <div className="selectitem">Select Guard</div>
                    </MenuItem>
                  
                    {
                        guardList.map((item, index) => (
                            <MenuItem value={item?._id} key={index} >{item?.firstname} {item?.lastname}</MenuItem>
                        ))
                    }
                </Select>
                {/* <FormHelperText>Without label</FormHelperText> */}
            {/* </FormControl>
            </Grid> */} 
            {/* <Grid item xs={3}>
                <FormControl sx={{ m: 1, width : "90%" }}>
                        
                        <LocalDateSelector label="none" value={selectedDate} onChange={changeDate}/>
                    
                </FormControl>
            </Grid> */}
            <Grid item xs={3}>
                <FormControl sx={{ m: 1, width : "90%" }}>
                    <Select
                        value={selectedStatus}
                        onChange={changeStatus}
                        displayEmpty
                        inputProps={{ 'aria-label': 'Without label' }}
                        style={{borderRadius : 10, boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px', borderColor : "#707070", backgroundColor : 'white'}}
                        
                        >
                        <MenuItem value="" className="selectitem">
                            <div className="selectitem">Approval Status</div>
                        </MenuItem>
                        {
                            statusList.map((item, index) => (
                                <MenuItem value={item.id} key={index} >{item.name}</MenuItem>
                            ))
                        }
                    </Select>
                    {/* <FormHelperText>Without label</FormHelperText> */}
                </FormControl>
            </Grid>
      </Grid>
      <Box display="flex" sx={{ my: "2rem" }}>
        <TableContainer component={Paper} sx={{ mx: "0.8rem" }} >
         
            <Table sx={{ minWidth: 'auto' }} aria-label="custom pagination table" className="responsive-table">
                <TableHead >  
                    <TableRow className="table-header">
                        <TableCell align="left" component="th"  sx={tableHeader} style={{width : "13%"}}>Guard Name</TableCell>
                        <TableCell align="left" component="th"  sx={tableHeader}>Week Starting</TableCell>
                        <TableCell align="left" component="th"  sx={tableHeader}>Week Ending</TableCell>
                        <TableCell align="left" component="th"  sx={tableHeader}>Site Name</TableCell>
                        <TableCell align="left" component="th"  sx={tableHeader} style={{width : "8%"}}>Hours Worked</TableCell>
                        <TableCell align="left" component="th"  sx={tableHeader}>Date Submitted</TableCell>
                        <TableCell align="left" component="th"  sx={tableHeader}>Status</TableCell>
                        <TableCell align="center" component="th"  sx={tableHeader}>Options</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {
                        users.slice(page * perPage, page * perPage + perPage).map((item, index) => (
                            <TableRow key={index}>
                                <TableCell  align="left"  sx={tableData}>
                                    { (item?.userId?.firstname !== '' && item?.userId?.firstname !== undefined) ?  `${item?.userId?.firstname} ${item?.userId?.lastname}` : 'NA'}
                                </TableCell>
                                <TableCell align="left"  sx={tableData}>
                                    {moment(item?.startTime).format("MMM Do YY")}
                                </TableCell>
                                <TableCell align="left"  sx={tableData}>
                                    {moment(item?.endTime).format("MMM Do YY")}
                                </TableCell>
                                <TableCell align="left"  sx={tableData} style={{width : "20%"}}>
                                    {item.siteId?.name}
                                </TableCell>
                                <TableCell  align="left"  sx={tableData}>
                                    {item?.totalHours}
                                </TableCell>
                                <TableCell align="left"  sx={tableData}>
                                    {moment(item?.createdAt).format("MMM Do YY")}
                                </TableCell>
                                <TableCell align="left"  sx={tableData}>
                                    {item?.statusId?.name}
                                </TableCell>
                                <TableCell  align="center"  sx={tableData}>
                                <Link  underline="always" className="fileclass"  onClick={(e) => {
                        navigateTo(`${window.location.pathname}/result`, { state: {id: item._id} })
                      }}>
                                    View
                                </Link>
                                {/* <Link  underline="always" className="fileclass" onClick={() => navigate(`${window.location.pathname}/result`),{ state: {id:item.id}}}> 
                                    View
                                </Link> */}
                                </TableCell>
                            </TableRow>
                        ))
                    }

                    {
                      users.length === 0 &&
                      <EmptyTable colSpan={8} />
                    }
                </TableBody>
                <TableFooter>
                <TableRow>
                  
                    <TablePagination
                    align="right"
                    rowsPerPageOptions={perPages}
                    colSpan={7}
                    count={users.length}
                    rowsPerPage={perPage}
                    page={page}
                    SelectProps={{  
                        inputProps: {  
                        'aria-label': 'rows per page',
                        },
                        native: true, 
                    }}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    // ActionsComponent={TablePaginationActions}
                      />
                </TableRow>
                </TableFooter>
            </Table>
          
        </TableContainer>

      </Box>
      </>
      }
      
    </Box>
  );
}


