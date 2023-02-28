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
  Alert
} from "@mui/material";
import { Link } from "react-router-dom";


import BasicSelector from "../../common/Selector";
import LocalTimeSelector from "../../common/LocalTimeSelector";
import LocalDateSelector from "../../common/LocalDateSelector";
import PageTitle from "../../common/PageTitle";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from "react-router-dom";
import Loader from "../../common/Loader"
import { deleteAPI, getAPI } from "../../network";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { toast } from "react-toastify";

import EmptyTable from "../../common/EmptyTable";
import { useDispatch, useSelector } from "react-redux";
import { checkAuthority,tableHeader,tableData, formatDate , timeFormat,formatDatePost} from "../../utils";
import "./style.css";
import { FilterList } from "@mui/icons-material";



export default function TaskList() {
  const dispatch = useDispatch();
  const navigateTo = useNavigate();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [deleteId, setDeleteId] = useState('');
  const [open, setOpen] = useState(false)
  const [loader, setLoader] = useState(false)
  const [tasks, setTasks] = useState([])
  const [sites, setSites] = useState([])

  const [filter, setFilter] = useState({
    siteId : '',
    startDate : null,
    endDate : null
  })
const taskData=[]
for(let j=0; j<tasks.length; j++){
  taskData.push(tasks[j].tasks) 
}

// console.log(taskData,"taskData$$$$$$$$$$$$$$")
const taskD=[]
for(let i=0; i<taskData.length;i++){
  taskD.push(taskData[i][0])

}


console.log(taskD,"taskD************************")


  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  useEffect(() => {
    getTasks()
    getSites()
  }, []);

  const getTasks = async(sId=null,sDate=null,eDate=null) => {
    
    sId = sId !== null ? sId : filter.siteId;
    eDate = eDate !== null ? eDate : filter.endDate;
    sDate = sDate !== null ? sDate : filter.startDate;
   
    var url = ''
    var start = true;
    if(sId !== '' && sId !== null ){
      url += (start ? '?' : '&') + `siteId=${sId}`
      start = false;
    }
    if(eDate !=='' && eDate !== null){
      url += (start ? '?' : '&') + `taskDate=${formatDatePost(eDate)}`
      start = false;
    }
    if(sDate!=='' && sDate !== null){
      url += (start ? '?' : '&') + `startDate=${formatDatePost(sDate)}`
      start = false;  
    }
    setLoader(true)
   
    let data = await getAPI('/tasks' +url)
    if(data){
      setTasks(data)
    }
    setLoader(false)
  }

  const getSites = async() => {
    setLoader(true)
    let data = await getAPI('/sites')
    if(data){
      var arr = []
      for(var i = 0; i< data.length; i++){
        var obj = data[i]
        obj['label'] = obj.name
        obj['value'] = obj._id
        arr.push(obj)
      }
      setSites(arr)
    }
    setLoader(false)
  }
 
  const deleteClick = (id) => {
    setDeleteId(id);
    setOpen(true)
  }

  const handleDelete = async(siteId = null) => {
    
    setLoader(true);
    let empty = await deleteAPI(`/tasks/${deleteId}`);
    if(empty){
      setOpen(false);
      getTasks()
      
    }
    setLoader(false);
  }

  return (
    <Box>
      <Loader loader={loader} />
      <PageTitle title="Task List" />
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
                <Grid item xs={6} md={6} lg={2}>
     
                  <BasicSelector
                    disableAll={true}
                    options={sites}
                    selectorHight={"53px"}
                    value={filter.siteId}
                    name={"Site Id"}
                    selectorWidth={"100%"}
                    onChange={(e) => {
                
                      setFilter({
                        ...filter,
                        siteId : e.target.value
                      })
                      getTasks(e.target.value)
                    }}
                  />
                </Grid>
                {/* <Grid item xs={6} md={6} lg={2}>
                  <LocalTimeSelector 
                    value={filter.time}
                    title="Select Time " 
                    onChange={(time) => {
         
                      setFilter({
                        ...filter,
                        time :time
                      })
                      getTasks(null,time,null)
                    }}
                    
                  />
                </Grid> */}
                {/* <Grid item xs={6} md={6} lg={4}>
                  <LocalDateSelector 
                    title="Start Date " 
                    value={filter.startDate}
                    
                    onChange={(date) => {
                      setFilter({
                        ...filter,
                        startDate : date
                      })
                      getTasks(null,date,null)
                    }}
                   />
                </Grid> */}
                <Grid item xs={6} md={6} lg={4}>
                  <LocalDateSelector 
                    title="Task Date " 
                    value={filter.endDate}
                    
                    onChange={(date) => {
                      setFilter({
                        ...filter,
                        endDate : date
                      })
                      getTasks(null,null,date)
                    }}
                   />
                </Grid>
                {
                  checkAuthority('ADD_TASK') &&
                  <Grid item xs={6} md={6} lg={4}  sx={{my :2}}>
                    <Link
                      to="/tasks/create"
                      style={{
                        backgroundColor: "grey",
                        color: "white",
                        padding: 15,
                        fontWeight:600,
                        borderRadius: 5,
                        textDecoration: "none",
                      }}
                    >
                      Create Task
                    </Link>
                  </Grid>
                }
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
                      Site 
                    </TableCell>
                    <TableCell align="left" component="th" sx={tableHeader}>
                      Start Date
                    </TableCell>
                    <TableCell align="left" component="th" sx={tableHeader}>
                      End Date
                    </TableCell>
                    <TableCell align="left" component="th" sx={tableHeader}>
                      Due Time
                    </TableCell>
                    <TableCell align="left" component="th" sx={tableHeader}>
                      Description
                    </TableCell>
                    
                    <TableCell align="center" component="th" sx={tableHeader}>
                      View Details
                    </TableCell>
                    <TableCell align="center" component="th" sx={tableHeader}>
                      Action
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
          
             
                  {taskD.map((task, index) => (
                      <TableRow key={index}>
                      <TableCell align="left"sx={tableData}>
                        {/* {console.log(item,"====item=====")} */}
                        {task?.title}
                      </TableCell>
                      <TableCell align="left"sx={tableData}>
                        {task?.siteId?.name}
                      </TableCell>
                      {/* <TableCell align="left"sx={tableData}>
                        {(task?.user?.firstname !== undefined && task?.user?.firstname !== '') ? `${task?.user?.firstname} ${task?.user?.lastname}` : 'NA'}
                      </TableCell> */}
                      <TableCell align="left"sx={tableData}>
                        {new Date(task?.startDate).toLocaleDateString("en-uk", {
                          year: "numeric",
                          month: "short",
                          day: "2-digit",
                        })}
                      </TableCell>
                      <TableCell align="left"sx={tableData}>
                        {new Date(task?.endDate).toLocaleDateString("en-uk", {
                          year: "numeric",
                          month: "short",
                          day: "2-digit",
                        })}
                      </TableCell>
                      <TableCell align="left"sx={tableData}>
                        {task?.timeDue}
                      </TableCell>
                      <TableCell align="left" sx={{tableData,width:"40%"}}>
                        {task?.description.slice(0, 120)}...
                      </TableCell>
                      <TableCell align="center" sx={{textAlign : 'center', tableData}}>
                       {/* { console.log(task.groupId,"taskgroupid---")} */}
                       
                        {
                          checkAuthority('VIEW_TASKS') &&
                          <Button className="btn-div" variant="outlined" color="info" sx={{mx : 1}} 
                          onClick={(e) => { navigateTo('/tasks/details',{state:task.groupId})
                          }}>
                            View
                          </Button>
                        }
                      
                        
                      </TableCell>
                      <TableCell>
                      {
                          checkAuthority('EDIT_TASK') &&
                          <Button className="btn-div" variant="outlined" color="info" sx={{mx : 1}} onClick={(e) => {
                            navigateTo('/tasks/create',{state:{action : 'edit', task : task}})
                          }}>
                            <EditIcon className="btn" />
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
        
      </Box>
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth={true}>
        <DialogTitle sx={{ mb: 4 , textAlign :"center" }}>Delete Task</DialogTitle>
        
        <DialogContent>
          <Box
            component="form"
            sx={{
              '& .MuiTextField-root': { my: 2, width: '100%' },
            }}
            noValidate
            autoComplete="off"
          >

            <h3 style={{textAlign : 'left', fontWeight :'bold'}}>Do you want's to delete this task</h3>
          </Box>
        </DialogContent>
        <DialogActions sx={{mb : 2 , mx : 4}}>
          <Button onClick={handleDelete} variant="contained" color="error">Delete</Button>
          <Button onClick={() => setOpen(false)} variant="outlined">Cancel</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
