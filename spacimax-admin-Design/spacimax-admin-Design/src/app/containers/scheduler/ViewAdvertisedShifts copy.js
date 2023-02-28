import React, { useEffect, useState } from "react";
import { Box, MenuItem, FormControl, Select, Button } from "@mui/material";
import Table from "@mui/material/Table";
import InputLabel from '@mui/material/InputLabel';
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";

import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import TableHead from "@mui/material/TableHead";
import DeleteIcon from '@mui/icons-material/Delete';
import PageTitle from "../../common/PageTitle";
import { Link } from "react-router-dom";
import Loader from "../../common/Loader";
import { getAPI, patchAPI, postAPI ,deleteAPI} from "../../network";
import { formatDate, formatDatePost, fullName, tableHeader, tableData } from "../../utils";
import EmptyTable from "../../common/EmptyTable";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

export default function ViewAdvertisedShiftsPage() {
  const [schedulers, setSchedulers] = useState([]);
  const [loader, setLoader] = useState(false);
  const [alarms, setAlarms] = useState([]);
  
  const [show, setShow] = useState(false);
  const [user, setUser] = useState([]);
  const [site, setSite] = useState("");
  const [sites,setSites]=useState([])
  const [advStatus, setAdvStatus] = useState("");
  const [editId, setEditId] = useState('');


  useEffect(() => {
    getShedulers()
    getAlarms()
    getSites()
  }, []);



  const getShedulers = async (statusid = null) => {
    var newStatus = statusid != null ? statusid : selectedStatus.shiftStatus
    var url = (newStatus != null && newStatus != "") ? `?status=${newStatus}` : ""
    setLoader(true)
    let data = await getAPI(`/company/shifts${url}`)
    if (data) {
      setSchedulers(data)
    }
    setLoader(false)
  }

  var casualData=[]
  schedulers.map((item)=>{
    casualData.push(item.shifts)
  })

  var temp = []
  for (let i = 0; i < casualData.length; i++) {
    for (let j = 0; j < casualData[i].length; j++) {
      temp.push(casualData[i][j])
    }
  }

  const getSites = async () => {
    setLoader()
    let data = await getAPI('/sites')    
    if(data){
        let outputs = data.map((item) => ({
            id : item._id,
            label : item.name,
            value : item._id
        }))
        setSites(outputs)
    }
    setLoader()
  }
  const deleteCompany = (sId, uId) => {
    
    setUser(uId)
    setSite(sId)
    setShow(true);
  }

  const payload = {
    "userId": user,
    "siteId": site
  }
  

  const reAssign = async () => {
    setLoader(true)
    let data = await postAPI('/company/shifts/accept-interest', payload);

    setShow(false);
    setLoader(false)
  }

  const getAlarms = async (statusid = null) => {
    var newStatus = statusid != null ? statusid : selectedStatus.alarmStatus
    var url = (newStatus != null && newStatus != "") ? `?status=${newStatus}` : ""
    setLoader(true)
    let data = await getAPI(`/alarm${url}`)
    if (data) {
      setAlarms(data)
    }
    setLoader(false)
  }


  const [selectedStatus, setSelectedStatus] = useState({});

  const onChange = (event) => {
    // console.log("event----", event.target)
    // console.log("event Name----", event.target.name)
    setSelectedStatus({
      [event.target.name]: event.target.value,
      ...selectedStatus,
    });
    // console.log("======selectedStatus====", selectedStatus)
    let label = status.filter((item) => item.id == event.target.value)[0]
    let Alarmlabel = astatus.filter((item) => item.id == event.target.value)[0]
    
    if (event.target.name === 'shiftStatus') {
      getShedulers(label.label)
    }
    else if (event.target.name === 'alarmStatus')  {
      getAlarms(Alarmlabel.label)
    }
  };
  const advertisedStatus=[
    {
      id: 1,
      label: "Reassign",
    },
    {
      id: 2,
      label: "Approved",
    },
    {
      id: 4,
      label: "Unassigned",
    },
  ]

  const status = [
    {
      id: 1,
      label: "Reassign",
    },
    {
      id: 2,
      label: "Approved",
    },
    {
      id: 4,
      label: "Unassigned",
    },
  ];

  const astatus = [
    {
      id: 1,
      label: "Partially Completed",
    },
    {
      id: 2,
      label: "Completed",
    },
    {
      id: 3,
      label: "UpComming",
    },
    {
      id: 4,
      label: "Opened",
    },
  ];
  // console.log("************AdvStatus*********",advStatus)
  // http://localhost:8000/v1/company/shifts/change-status/63e3338e47540a199ca07cbd
  const advertiseStatus=(id,stat)=>{
    setLoader(true) 
    // console.log("id status*********",id)
    let datas={
      status:stat
    }
     const data=patchAPI(`/company/shifts/change-status/${id}`,datas)
     if (data){
      getShedulers()
     }
     getShedulers()
     setLoader(false)
  }

  const deleteshift = (id) => {
    // console.log("id",id)
    setEditId(id);
    setShow(true);
  }
  const handleDelete = async() => {
    setLoader(true);
    let process = await deleteAPI(`/company/shifts/${editId}`);
    
    if (process){
      getShedulers()
      setShow(false);
    
     }
     getShedulers()
     setLoader(false)
  }

  // const filters = (type, data) => {
  //   if (type === 'schedular') {
  //     let url = `/company/shifts?status=${status}`;
  //     setLoader(true)
  //     let data = getAPI(url);

  //     if (data) {
  //       setSchedulers(data)
  //     }
  //     setLoader(false)
  //   }
  //   else {
  //     let url = `/alarm?status=${astatus}`;
  //     setLoader(true)
  //     let data = getAPI(url);

  //     if (data) {
  //       setAlarms(data)
  //     }
  //     setLoader(false)
  //   }
  // }
  return (
    <Box>
      <Loader loader={loader} />
      <PageTitle title="Scheduler" subTitle="View Casual Shifts" />
      <Box ml={4}>
        <Box>
          
          <FormControl sx={{ my: 1, minWidth: "30%" }}>
            <InputLabel id="status-label">Status</InputLabel>
            <Select
              value={selectedStatus.shiftStatus}
              onChange={onChange}
              displayEmpty
              name="shiftStatus"
              labelId="status-label"
              id="status"
              label="Status"
              sx={{
                borderRadius: "10px",
                borderColor: "#707070",
                pl: 2,
              }}
            >

              {
                status.map((item, index) => (
                  <MenuItem value={item.id} key={index}>
                    <div className="select_item" value={item.label}>{item.label}</div>
                  </MenuItem>
                ))
              }
            </Select>
          </FormControl>
          <FormControl sx={{ my: 1, minWidth: "30%" }}>
            <InputLabel id="status-label">Site</InputLabel>
            <Select
              // value={filter.site}
              // onChange={onsiteSelect}
              displayEmpty
              name="shiftStatus"
              labelId="status-label"
              id="status"
              label="Status"
              sx={{
                borderRadius: "10px",
                borderColor: "#707070",
                pl: 2,
              }}
            >

              {
                sites.map((item, index) => (
                  <MenuItem value={item.id} key={index}>
                    <div className="select_item" value={item.id}>{item.label}</div>
                  </MenuItem>
                ))
              }
            </Select>
          </FormControl>
          <Box my={5} />
          <TableContainer component={Paper} sx={{ mx: "0.8rem" }}>
            <Table
              sx={{ minWidth: "auto" }}
              aria-label="custom pagination table"
              className="responsive-table"
            >
              <TableHead>
                <TableRow className="table-header">
                  <TableCell
                    align="left"
                    component="th"
                    sx={tableHeader}
                    style={{ width: "13%" }}
                  >
                    Site
                  </TableCell>
                  <TableCell
                    align="center"
                    component="th"
                    sx={tableHeader}
                    style={{ width: "8%" }}
                  >
                    User
                  </TableCell>
                  <TableCell align="center" component="th" sx={tableHeader}>
                    Start Date
                  </TableCell>
                  <TableCell align="center" component="th" sx={tableHeader}>
                    Finish Date
                  </TableCell>
                  <TableCell align="center" component="th" sx={tableHeader}>
                    Status
                  </TableCell>
                 
                  <TableCell align="center" component="th" sx={tableHeader}>
                    View License
                  </TableCell>
                  <TableCell align="center" component="th" sx={tableHeader}>
                    View Profile
                  </TableCell>
                  <TableCell align="center" component="th" sx={tableHeader}>
                   Change Status
                  </TableCell>
                  <TableCell>
                    Action
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {/* {console.log("schedular--------",schedulers)} */}
                {temp.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell align="left" sx={tableData}>
                      {item.siteId?.name}
                    </TableCell>
                    <TableCell align="center" sx={tableData}>
                      <Link
                        to="#"
                        underline="always"
                        style={{ color: "black", textDecoration: "none" }}
                      >
                      {/* {fullName(item.assignedUser)}         */}
                      </Link>
                    </TableCell>
                    <TableCell align="center" sx={tableData}>
                      {formatDate(item.startDate)}
                    </TableCell>
                    <TableCell align="center" sx={tableData}>
                      {formatDate(item.endDate)}
                    </TableCell>
                    <TableCell align="center"sx={tableData}>
                      {item.status}
                    </TableCell>
                   
                    <TableCell align="center" sx={tableData}>
                      <Link to={`/user/license/${item.assignedUser?._id}`} underline="always" className="fileclass">
                        View
                      </Link>
                    </TableCell>
                    <TableCell align="center" sx={tableData}>
                      <Link to={`/user/profile/${item.assignedUser?._id}`} underline="always" className="fileclass">
                        View
                      </Link>
                    </TableCell>
                    <TableCell align="center" sx={tableData}>
                      <Link to="#" underline="always" className="fileclass">
                        {/* <div onClick={() => deleteCompany(item?.siteId?._id, item?.assignedUser?._id)}>{item.status === 'Unassigned' ? 'Reassign' : 'Approved/Cancel'}</div> */}
                        <FormControl sx={{ my: 1, minWidth: "80%" }}>
                        <InputLabel id="status-label">Status</InputLabel>
                        <Select
                            // value={}
                            onChange={(e)=>{
                              setAdvStatus(e.target.value)
                              advertiseStatus(item._id, e.target.value)
                            }
                            }
                            displayEmpty
                            name="shiftStatus"
                            labelId="status-label"
                            id="status"
                            label="Status"
                            sx={{
                              borderRadius: "10px",
                              borderColor: "#707070",
                              pl: 2,
                            }}
                          >

                            {
                              advertisedStatus.map((item, index) => (
                                <MenuItem value={item.label} key={index}>
                                  <div className="select_item" value={item.label}>{item.label}</div>
                                </MenuItem>
                              ))
                            }
                          </Select>
                          </FormControl>
                      </Link>
                    </TableCell>
                    <TableCell>
                    <Button variant="outlined"  className="btn-div" color="error" onClick={() => deleteshift  (item?._id)}>
                        <DeleteIcon className="btn"/>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}

                {
                  schedulers.length === 0 &&
                  <EmptyTable colSpan={8} />
                }
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
        <Box mt="7%" ml={-4}>
          <PageTitle title="View Alarm Response" />
        </Box>

        <Box mb="10%">
          {/* <FormControl sx={{ ml: 1, mr: 1, mt: 0, minWidth: "25%" }}>
            <Select
              value={selectedStatus.alarmStatus}
              onChange={onChange}
             
              displayEmpty
              name="alarmStatus"
              inputProps={{ "aria-label": "Without label" }}
              sx={{
                borderRadius: "10px",
                boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
                borderColor: "#707070",
                pl: 2,
                backgroundColor: 'white'
              }}

            >
              <MenuItem value="">
                <div className="selectitem">Status</div>
              </MenuItem>
              {astatus.map((item, index) => (
                <MenuItem value={item.lable} key={index}>
                  {item.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl> */}
          <FormControl sx={{ my: 1, minWidth: "30%" }}>
            <InputLabel id="status-label">Status</InputLabel>
            <Select
             value={selectedStatus.alarmStatus}
             onChange={onChange}
              displayEmpty
              name="alarmStatus"
              labelId="status-label"
              id="status"
              label="Status"
              sx={{
                borderRadius: "10px",
                borderColor: "#707070",
                pl: 2,
              }}
            >

              {
                astatus.map((item, index) => (
                  <MenuItem value={item.id} key={index}>
                    <div className="select_item" value={item.label}>{item.label}</div>
                  </MenuItem>
                ))
              }
            </Select>
          </FormControl>
          <Box my={5} />

          <TableContainer component={Paper} sx={{ mx: "0.8rem" }}>
            <Table
              sx={{ minWidth: "auto" }}
              aria-label="custom pagination table"
              className="responsive-table"
            >
              <TableHead>
                <TableRow className="table-header">
                  <TableCell
                    align="center"
                    component="th"
                    sx={tableHeader}
                    style={{ width: "13%" }}
                  >
                   Title
                  </TableCell>
                  <TableCell align="center" component="th" sx={tableHeader}>
                    Company
                  </TableCell>
                  <TableCell align="center" component="th" sx={tableHeader}>
                    DueDate
                  </TableCell>
                  <TableCell align="center" component="th" sx={tableHeader}>
                    StartTime
                  </TableCell>
                  <TableCell align="center" component="th" sx={tableHeader}>
                    EndTime
                  </TableCell>
                  <TableCell align="center" component="th" sx={tableHeader}>
                    Status
                  </TableCell>
                  <TableCell align="center" component="th" sx={tableHeader}>
                   Created At
                  </TableCell>
                 
                  {/* <TableCell align="center" component="th" sx={tableHeader}>
                    View License
                  </TableCell>
                  <TableCell align="center" component="th" sx={tableHeader}>
                    View Profile
                  </TableCell>
                  <TableCell align="center" component="th" sx={tableHeader}>
                    Action
                  </TableCell> */}
                </TableRow>
              </TableHead>

              
              <TableBody>
                {/* {console.log("ALARM Data---",alarms)} */}
                {alarms.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell align="center" sx={tableData}>
                      {item?.title}
                    </TableCell>
                    <TableCell align="center" sx={tableData}>
                      {item?.company?.name}
                    </TableCell>

                    <TableCell align="center" sx={tableData}>
                      {formatDate(item?.dueDate)}
                    </TableCell>
                    <TableCell align="center" sx={tableData}>
                      {item?.startTime}
                    </TableCell>
                    <TableCell align="center" sx={tableData}>
                      {item?.endTime}
                    </TableCell>
                    <TableCell align="center" sx={tableData}>
                      {item?.status}
                    </TableCell>
                    <TableCell align="center" sx={tableData}>
                     {formatDate(item.createdAt)}
                    </TableCell>

                    {/* <TableCell align="center" sx={tableData}>
                      <Link to="#" underline="always" className="fileclass">
                        {item.status === 'Booked' ? 'Cancel' : item.status}
                      </Link>
                    </TableCell> */}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
      <Dialog open={show} onClose={() => { setShow(false) }} fullWidth>
        <DialogTitle align="center">Do You Want to Cancel This Shift ?</DialogTitle>
        <DialogContent>
          
        </DialogContent>
        <DialogActions sx={{ mt: 10,mb:2, alignItem:"center",justifyContent:"space-around" }}>
           <Box container>
            <Button onClick={handleDelete} variant="outlined">Yes</Button>
          </Box>
          <Button onClick={() => {
            setShow(false)
          }} variant="outlined">No</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
