import React, {useEffect, useState} from "react";
import { Box, FormControl, Grid, Link, Modal, Typography, Button} from "@mui/material";
import PageTitle from "../../common/PageTitle";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableFooter from "@mui/material/TableFooter";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import TableHead from "@mui/material/TableHead";
import { getAPI, postAPI , patchAPI, deleteAPI} from "../../network";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import LocalDateSelector from "../../common/LocalDateSelector";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { toast } from "react-toastify";
import CircularProgress from '@mui/material/CircularProgress';
import { tableHeader,tableData } from "../../utils";
import "./style.css";
import {formatDatePost,formatDate} from '../../utils'
import Loader from "../../common/Loader";

export default function SupportPage() {
  const [supports, setSupports] = useState([]);
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState('');
  const [users, setUsers] = useState([]);
  const [status, setStatus] = useState('');
  const [statuses, setStatuses] = useState([]);
  const [date, setDate] = useState(null);
  const [userError, setUserError] = useState(false);
  const [statusError, setStatusError] = useState(false);
  const [issue, setIssue] = useState('');
  const [issueError, setIssueError] = useState(false);
  const [dateError, setDateError] = useState(false);
  const [title, setTitle] = useState('');
  const [titleError, setTitleError] = useState(false);
  const [dialogTile, setDialogTitle] = useState('')
  const [editId, setEditId] = useState('');
  const [btnTxt, setBtnTxt] = useState('');
  const [ticket, setTicket] = useState('');
  const [action, setAction] = useState('');
  const [show, setShow] = useState(false);
  const [loader, setLoader] = useState(false);

  const [filter, setFilter] = useState({
    startDate : null, endDate : null
  })

  const [pagination, setPagination] = useState({
    rows : 10,
    data : [],
    page : 1,
    noOfPages : 0
  })

  useEffect(() => {
    getSupports();
    getUsers();
    getStatuses();
  },[]);

  const getSupports = async(startDate = null, endDate = null) => {
    var url = ''
    let newStartDate = startDate != null ? startDate : filter.startDate  
    let newEndDate = endDate != null ? endDate : filter.endDate

    var first  = true
    if(newStartDate !== '' && newStartDate !== null){
      url += first ? `?startDate=${formatDatePost(newStartDate)}` : `&startDate=${formatDatePost(newStartDate)}`;
      first = true;
    }
    if(newEndDate !== '' && newEndDate !== null){
      url += first ? `&endDate=${formatDatePost(newEndDate)}` : `?endDate=${formatDatePost(newEndDate)}`;
      first = true;

    }
    setLoader(true) 
    console.log('URL ----',`/support${url}`)
    const supports = await getAPI(`/support${url}`);
    setLoader(false);
    getPagination(supports)
    setSupports(supports);
  } 

  const getPagination = async(data = [] ,page = null, row = null) => {
    let newData = data.length !== 0 ? data : supports
    let newRow = row !== null ? row : pagination.rows
    let newPage = page !== null ? page : pagination.page
    console.log('newData', newData)
    console.log('newRow', newRow)
    console.log('newPage', newPage)
    if(newData.length > 0){
      console.log(newPage === 1 ? 0 :((newPage * newRow) - 1), ((newPage  * newRow) - 1) < newData.length ? ((newPage * newRow) - 1) : newData.length)
      let records = await newData.slice(newPage === 1 ? 0 :((newPage * newRow) - 1), ((newPage  * newRow) - 1) < newData.length ? ((newPage * newRow) - 1) : newData.length)
      console.log('RECORDS', records)
      await setPagination({
        ...filter,
        data:records,
        page : newPage,
        rows : newRow,
        noOfPages : Math.ceil(newData.length / newRow)
       })
    }
    else{
      await setPagination({
        ...filter,
        data:[],
        page : newPage,
        rows : newRow,
        noOfPages : 0
       })
    }
 
  }

  const getUsers = async() => {
    setLoader(true)
    const users = await getAPI('/users');
    setLoader(false)
    setUsers(users);
  }

  const getStatuses = async() => {
    setLoader(true)
    const statuses = await getAPI('/support-statuses');
    setLoader(false)
    setStatuses(statuses);
  }

  const handleChangePage = (value) => {
    console.log('Page Action', value)
  };

  const handleChangeRowsPerPage = (e) => {
    console.log('Row Action', e.target.value)
    getPagination([],null,e.target.value)
  };

  const TablePaginationActions = (value) => {
    console.log('Pagination Action', value)
  };

 

  const addSupport = (e) => {
    e.preventDefault();
    setDialogTitle('Add Support Issue');
    setBtnTxt('Submit');
    setAction('add');
    clearAll();
    setOpen(true)
  }

  const editSupport = (e, id) => {
    e.preventDefault();
    setEditId(id)
    setDialogTitle('Edit Support Issue');
    setBtnTxt('Edit');
    clearAll();
    let support = supports.filter(item => item._id === id)[0];
    setStatus(support?.statusId?._id);
    setUser(support?.userId?._id);
    setIssue(support?.issue);
    setTitle(support?.title);
    setTicket(support?.ticketId)
    setDate(formatDate(support?.issueDate))
    setAction('edit');
    setOpen(true)
  }

  const deleteSupport = (id) => {
    setEditId(id);
    clearAll();
    let support = supports.filter(item => item._id === id)[0];
    setTicket(support?.ticketId)
    setShow(true);
  }

  const clearAll = () => {
    setUser('');
    setIssue('');
    setStatus('');
    setDate(null);
    setTitle('');
  }

  const handleClose = () => {
    setOpen(false)
  }
  const handleShowClose = () => {
    setShow(false);
  }

  const handleUserChange = (event) => {
    setUser(event.target.value);

  };

  const handleStatusChange = (event) => {
    setStatus(event.target.value);
  };
  const toastObj = {position: toast.POSITION.TOP_RIGHT};


  const handleSubmit = async(e) => {
    e.preventDefault();
    setUserError(false);
    setIssueError(false);
    setStatusError(false);
    setDateError(false);
    setTitleError(false);

    if(user === ''){
      toast.warning('User is required!', toastObj);
      setUserError(true);
      return;
    }
    else if(title === ''){
      toast.warning('Title is required!', toastObj);
      setTitleError(true);
      return;
    }
    else if(issue === '' || issue.length < 10){
      toast.warning('Issue text is required! and at least 10 character long.', toastObj);
      setIssueError(true);
      return;
    }
    else if(date === null){
      toast.warning('Date is required!', toastObj);
      setDateError(true);
      return;
    }
    else if(status === ''){
      toast.warning('Status is required!', toastObj);
      setStatusError(true);
      return;
    }


    if(action === 'add'){
      let payload = {
        userId : user,
        statusId : status,
        title : title,
        issue : issue,
        issueDate : date
      };
      setLoader(true)
      var saveStatus = await postAPI('/support',payload);
      setLoader(false)
      if(saveStatus){
        getSupports();
        setOpen(false)
      }
    }
    else if(action === 'edit'){
      let payload = {
        userId : user,
        statusId : status,
        title : title,
        issue : issue,
        issueDate : date
      };
      let url = `/support/${editId}`;
      setLoader(true)
      var saveStatus = await patchAPI(url,payload);
      setLoader(false)
      if(saveStatus){
        getSupports();
        setOpen(false)
      }
    }
  }

  const handleDelete = async() => {
    setLoader(true);
    let process = await deleteAPI(`/support/${editId}`);
    setLoader(false);
    if(process){
      getSupports();
      setShow(false)
    }
  }

  return (
    <Box sx={{ height: "inherit" }}>
      {
        loader &&
        <Loader loader={loader}/>
      }
      <PageTitle title="Support" />
      
      <Grid   
        container
        className="sort-box"
        sx={{ mx: "0.4rem", mt: "5rem", width:"-1rem" }}
      >
        <Grid item xs={{m:3}}>
          <FormControl sx={{ m: 2,  width: "20rem" }}>
            <LocalDateSelector 
              title="Start Date" 
              value={filter.startDate}
              onChange={(value) => {
                setFilter({
                  ...filter,
                  startDate : value
                })
                getSupports(value)
              }}
            />
          </FormControl>
        </Grid>
        <Grid item xs={{m:3}}>
          <FormControl sx={{ m: 2,  width: "20rem" }}>
            <LocalDateSelector 
            title="End Date" 
            value={filter.endDate}
              onChange={(value) => {
                setFilter({
                  ...filter,
                  endDate : value
                })
                getSupports(null,value)
              }}
            
            />
          </FormControl>
        </Grid>
        <Grid item xs={3}></Grid>
      </Grid>
      <Box display="flex" sx={{ my: "2rem" }}>
        <TableContainer component={Paper} sx={{ mx: "0.8rem" }}>
          {/* <div style={{width: 'auto', overflowX: 'scroll'}}> */}
          <Table
            sx={{ minWidth: "auto" }}
            aria-label="custom pagination table"
            className="responsive-table"
          >
            <TableHead>
              <TableRow className="table-header" align="center">
                <TableCell align="center" component="th" sx={tableHeader}>
                  Ticket#
                </TableCell>
                <TableCell align="center" component="th" sx={tableHeader}>
                  Date Logged
                </TableCell>
                <TableCell align="center" component="th" sx={tableHeader}>
                  Date Closed
                </TableCell>
                <TableCell align="center" component="th" sx={tableHeader}>
                  Title
                </TableCell>
                <TableCell align="center" component="th" sx={tableHeader}>
                  Issue
                </TableCell>
                <TableCell align="center" component="th" sx={tableHeader}>
                  Status
                </TableCell>
                <TableCell align="center" component="th" sx={tableHeader} >
                  Action
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pagination.data.map((item, index) => (
                <TableRow key={index}>
                  <TableCell align="center" sx={tableData}>
                    {item?.ticketId}
                  </TableCell>
                  <TableCell align="center" sx={tableData}>
                    {formatDate(item?.issueDate)}
                  </TableCell>
                  <TableCell align="center" sx={tableData}>
                    {item?.closeDate ? formatDate(item?.closeDate) :  'NA'}
                  </TableCell>
                  <TableCell align="left" sx={tableData}>
                    {item?.title}
                  </TableCell>
                  <TableCell align="left" sx={tableData}>
                    {item?.issue}
                  </TableCell>
                  <TableCell align="center" sx={tableData}>
                    {item?.statusId?.name}
                  </TableCell>
                  <TableCell align="center"  sx={{textAlign : 'center',tableData}}>
                    <Button className="btn-div" variant="outlined" color="info" sx={{mx : 1}} onClick={(e) => editSupport(e, item?._id)}>
                      <EditIcon className="btn" />
                    </Button>
                    <Button className="btn-div" variant="outlined" color="error" onClick={() => deleteSupport(item?._id)}>
                      <DeleteIcon className="btn" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {
                pagination.data.length === 0 &&
                <TableRow>
                  <TableCell align="center" sx={tableData} colSpan={5}>
                    No records found
                  </TableCell>
                  
                </TableRow>
              }


            </TableBody>
            <TableFooter>
              <TableRow>
                  <TableCell sx={tableData} direction="column" justifycontent="center" colSpan={2}>
                      <Link href="#" underline="none" onClick={addSupport}>
                         <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            flexWrap: 'wrap',
                            justifyContent: 'space-between'

                        }}>
                            <span className="add-title">Add Support Query</span>
                            <AddCircleIcon className="add-icon" fontSize="medium"/>
                        </div>  
                      </Link>
                    </TableCell>
                <TablePagination
                  align="right"
                  rowsPerPageOptions={[ 10, 25,50, { label: "All", value: -1 }]}
                  colSpan={5}
                  count={supports.length}
                  rowsPerPage={pagination.rows}
                  page={pagination.noOfPages}
                  SelectProps={{
                    inputProps: {
                      "aria-label": "rows/page",
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
          {/* </div> */}
        </TableContainer>
      </Box>
      <Dialog open={open} onClose={handleClose} fullWidth={true}>
        <DialogTitle sx={{ mb: 4 , textAlign :"center" }}>{dialogTile}</DialogTitle>
        <h4 style={{textAlign : 'center'}}>TICKET : {ticket}</h4>
        <DialogContent>
          <Box
            component="form"
            sx={{
              '& .MuiTextField-root': { my: 2, width: '100%' },
            }}
            noValidate
            autoComplete="off"
          >
        
          
          <FormControl sx={{  minWidth : '97%' }}>
            <InputLabel id="demo-simple-select-helper-label">User</InputLabel>
            <Select
              labelId="demo-simple-select-standard-label"
              id="demo-simple-select-standard"
              value={user}
              label="Select User"
              fullWidth
              onChange={(e) => {handleUserChange(e)}}
            >
              {
                users.map((item,index) => (
                  <MenuItem value={item.id} key={index}>{item.firstname} {item.lastname}</MenuItem>
                ))
              }
            </Select>
          </FormControl>

          <FormControl sx={{  minWidth : '97%', mx : 0, px :0 }}>
            <TextField 
              id="title" 
              label="Title" 
              variant="outlined" 
              type="text" 
              defaultValue={title}
              onChange={(event) => {
                setTitle(event.target.value)
              }}
              fullWidth
              sx={{m : 0}}
            />
          </FormControl>

          <FormControl sx={{  minWidth : '97%' }}>
            <TextField 
              id="issue" 
              label="Issue Description" 
              variant="outlined" 
              type="text" 
              defaultValue={issue}
              onChange={(event) => {
                setIssue(event.target.value)
              }}
              fullWidth
            />
          </FormControl>
          <FormControl sx={{  minWidth : '97%' }}>
            <LocalizationProvider dateAdapter={AdapterMoment}>
              <DatePicker
               
                label="Finish Date"
                value={date}
                onChange={(newValue) => {
                  setDate(newValue);
                }}
                fullWidth
                renderInput={(params) => <TextField {...params} />}
                inputFormat="YYYY-MM-DD"
              />
            </LocalizationProvider>
          </FormControl>

          <FormControl sx={{ minWidth : '97%' }}>
            <InputLabel id="demo-select-standard-label">Status</InputLabel>
            <Select
              labelId="demo-simple-select-standard-label"
              id="demo-select-standard"
              value={status}
              label="Select Status"
              fullWidth
              onChange={(e) => {handleStatusChange(e)}}
            >
              {
                statuses.map((item,index) => (
                  <MenuItem value={item.id} key={index}>{item.name}</MenuItem>
                ))
              }
            </Select>
          </FormControl>
          </Box>
        </DialogContent>
        <DialogActions sx={{mb : 2 , mx : 4}}>
          <Button onClick={handleSubmit} variant="contained">{btnTxt}</Button>
          <Button onClick={handleClose} variant="outlined">Cancel</Button>
        </DialogActions>
      </Dialog>


      {/* delete Modal */}
      <Dialog open={show} onClose={handleClose} fullWidth={true} mt-10 sx={{"height": "20rem"}}>
        <DialogTitle sx={{ mb: 4 , textAlign :"center" }}>Delete Support Query</DialogTitle>
        
        <DialogContent>
          <Box
            component="form"
            sx={{
              '& .MuiTextField-root': { my: 2, width: '100%' },
            }}
            noValidate
            autoComplete="off"
          >

            <h3 style={{textAlign : 'left', fontWeight :'bold'}}>Do you want's to delete support query ticket {ticket}</h3>
          </Box>
        </DialogContent>
        <DialogActions sx={{mb : 2 , mx : 4}}>
          <Button onClick={handleDelete} variant="contained" color="error">Delete</Button>
          <Button onClick={handleShowClose} variant="outlined">Cancel</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
