/* eslint-disable no-unused-vars */

import React, { useEffect, useState } from "react";
import {
  Box,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TablePagination,
  Paper,
  Grid,
  FormControl,
  Skeleton,
  Button,
  Alert,
  InputLabel,
  Select
} from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import { Link, useLocation } from "react-router-dom";
import BasicSelector from "../../common/Selector";
import LocalTimeSelector from "../../common/LocalTimeSelector";
import LocalDateSelector from "../../common/LocalDateSelector";
import PageTitle from "../../common/PageTitle";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from "react-router-dom";
import Loader from "../../common/Loader"
import { deleteAPI, getAPI, patchAPI } from "../../network";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

import EmptyTable from "../../common/EmptyTable";
import { useDispatch, useSelector } from "react-redux";
import { checkAuthority, tableHeader, tableData, formatDate, timeFormat, formatDatePost } from "../../utils";
import "./style.css";




export default function TaskList({ route, navigation }) {
  const dispatch = useDispatch();
  const navigateTo = useNavigate();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [deleteId, setDeleteId] = useState('');
  const [open, setOpen] = useState(false)
  const [show, setShow] = useState(false)
  const [loader, setLoader] = useState(false)
  const [tasks, setTasks] = useState([])
  const [edit, setEdit] = useState('')
  const [expanded, setExpanded] = useState("panel_0");
  const location = useLocation();
  const [filter, setFilter] = useState({
    siteId: '',
    time: null,
    date: null
  })
  const [status,setStatus]=useState({
    status:''
  })

  var taskval = location.state

  const handleChangeExpanded = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  useEffect(() => {
    getTasks()
    getTasks()
  }, []);

  const getTasks = async (sId = null, sTime = null, TDate = null) => {

    sId = sId !== null ? sId : filter.siteId;
    sTime = sTime !== null ? sTime : filter.time;
    TDate = TDate !== null ? TDate : filter.date;

    var url = ''
    var start = true;
    if (sId !== '' && sId !== null) {
      url += (start ? '?' : '&') + `siteId=${sId}`
      start = false;
    }
    if (sTime !== '' && sTime !== null) {
      url += (start ? '?' : '&') + `timeDue=${timeFormat(sTime)}`
      start = false;
    }
    if (TDate !== '' && TDate !== null) {
      url += (start ? '?' : '&') + `taskDate=${formatDatePost(TDate)}`
      start = false;
    }
    setLoader(true)

    let data = await getAPI(`/tasks/group-by-id/${taskval}` + url)
    if (data) {
      setTasks(data)
    }
    setLoader(false)
  }


  const statuses = [
    {
      label: "Opened",
      value: "opened"
    },
    {
      label: "Closed",
      value: "closed"
    }
    
  ];
 
 
  const deleteClick = (id) => {
    setDeleteId(id);
    setOpen(true)
  }

  const EditClick=(id)=>{
      setShow(true)
      setEdit(id)
  }
  const handleChange = (event) => {
    setStatus(prevState => ({
      ...prevState,
      status: event.target.value,
    }))
  };

  const handleDelete = async (siteId = null) => {

    setLoader(true);
    let empty = await deleteAPI(`/tasks/${deleteId}`);
    if (empty) {
      setOpen(false);
      getTasks()

    }
    setLoader(false);
  }

  const handleEdit = async () => {
    const payload={
      "status":status.status
    }
    console.log(payload,"********payload---")
    setLoader(true);
    let empty = await patchAPI(`/tasks/${edit}`,payload);
    if (empty) {
      setShow(false);
      getTasks()

    }
    setLoader(false);
  }
  return (



    <Box>
      <Loader loader={loader} />
      <PageTitle title="Task Details" />
      <Box ml={5}>
        <FormControl
          sx={{
            width: "100%",
          }}
        >
          <Grid sx={{ my: "1rem" }} container spacing={3} width={"100%"}>
            {
              checkAuthority('VIEW_TASKS') &&
              <>
              
                {/* <Grid item xs={6} md={6} lg={2}>
                  <LocalTimeSelector
                    value={filter.time}
                    title="Select Time "
                    onChange={(time) => {

                      setFilter({
                        ...filter,
                        time: time
                      })
                      getTasks(null, time, null)
                    }}

                  />
                </Grid> */}
                <Grid item xs={6} md={6} lg={4}>
                  <LocalDateSelector
                    title="Task Date "
                    value={filter.date}
                    placeholder="Select Time"
                    onChange={(date) => {
                      setFilter({
                        ...filter,
                        date: date
                      })
                      getTasks(null, null, date)
                    }}
                  />
                </Grid>
                {/* {
                  checkAuthority('ADD_TASK') &&
                  <Grid item xs={6} md={6} lg={4} sx={{ my: 2 }}>
                    <Link
                      to="/tasks/create"
                      style={{
                        backgroundColor: "grey",
                        color: "white",
                        padding: 15,
                        fontWeight: 600,
                        borderRadius: 5,
                        textDecoration: "none",
                      }}
                    >
                      Create Task
                    </Link>
                  </Grid>
                } */}
              </>
            }

          </Grid>
        </FormControl>
        {
          checkAuthority('VIEW_TASKS') &&
          <Box display="flex" sx={{ my: "3rem" }}>
            <TableContainer component={Paper}>

              <Table
                sx={{ minWidth: "auto" }}
                aria-label="custom pagination table"
                className="responsive-table"
              >
                <TableHead>
                  <TableRow className="table-header">
                    <TableCell align="left" component="th" sx={tableHeader}>
                      Title
                    </TableCell>
                    <TableCell align="left" component="th" sx={tableHeader}>
                      Task Date
                    </TableCell>

                    <TableCell align="left" component="th" sx={tableHeader}>
                      Due Time
                    </TableCell>
                    <TableCell align="left" component="th" sx={tableHeader}>
                      Status
                    </TableCell>

                    <TableCell align="center" component="th" sx={tableHeader}>
                      Action
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tasks.map((task, index) => (
                    <TableRow key={index}>
                      <TableCell align="left" sx={tableData}>
                        {task?.title}
                      </TableCell>
                      {/* <TableCell align="left"sx={tableData}>
                        {(task?.user?.firstname !== undefined && task?.user?.firstname !== '') ? `${task?.user?.firstname} ${task?.user?.lastname}` : 'NA'}
                      </TableCell> */}
                      <TableCell align="left" sx={tableData}>
                        {new Date(task?.taskDate).toLocaleDateString("en-uk", {
                          year: "numeric",
                          month: "short",
                          day: "2-digit",
                        })}
                      </TableCell>

                      <TableCell align="left" sx={tableData}>
                        {task?.timeDue}
                      </TableCell>
                      <TableCell align="left" sx={tableData}>
                        {task?.status}
                      </TableCell>
                      <TableCell align="center" sx={{ textAlign: 'center', tableData }}>
                        {
                          checkAuthority('VIEW_TASKS') &&
                          <Button className="btn-div" variant="outlined" color="info" sx={{ mx: 1 }}
                            onClick={() => EditClick(task?._id)}>
                            <EditIcon className="btn" />
                          </Button>
                        }
                        {
                          checkAuthority('VIEW_TASKS') &&
                          <Button className="btn-div" variant="outlined" color="info" sx={{ mx: 1 }}
                            onClick={() => deleteClick(task?._id)}>

                            <DeleteIcon className="btn" />
                          </Button>
                        }

                      </TableCell>
                    </TableRow>

                  ))}

                  {
                    tasks.length === 0 &&
                    <EmptyTable colSpan={6} />
                  }
                </TableBody>
              </Table>
              <TablePagination
                rowsPerPageOptions={[10, 25, 100]}
                component="div"
                count={tasks.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />

            </TableContainer>
          </Box>
        }
        <Dialog open={show} onClose={() => setShow(false)} fullWidth>
        <DialogTitle sx={{ textAlign: 'center', mb: 8 }}>Edit Task</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel id="site-label" className="site">Status</InputLabel>
            <Select
              labelId="site-label"
              id="site-select"
              value={status.status}
              label="Site"
              onChange={handleChange}
              className="site"
            >
              {
                statuses.map((item, index) => (
                  <MenuItem value={item.value} key={index}>{item.label}</MenuItem>
                ))
              }
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions sx={{ mx: 2, mb: 4 }}>
          <Button onClick={handleEdit} variant="contained" color="primary">Update</Button>
          <Button onClick={() => setShow(false)} variant="outlined">Cancel</Button>
        </DialogActions>
      </Dialog>

       
        <Dialog open={open} onClose={() => setOpen(false)} fullWidth={true}>
          <DialogTitle sx={{ mb: 4, textAlign: "center" }}>Delete Task</DialogTitle>

          <DialogContent>
            <Box
              component="form"
              sx={{
                '& .MuiTextField-root': { my: 2, width: '100%' },
              }}
              noValidate
              autoComplete="off"
            >

              <h3 style={{ textAlign: 'left', fontWeight: 'bold' }}>Do you want's to delete this task</h3>
            </Box>
          </DialogContent>
          <DialogActions sx={{ mb: 2, mx: 4 }}>
            <Button onClick={handleDelete} variant="contained" color="error">Delete</Button>
            <Button onClick={() => setOpen(false)} variant="outlined">Cancel</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>

  );
}
