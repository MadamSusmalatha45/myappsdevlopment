import React, { useEffect, useState } from "react";
import { Box, MenuItem, FormControl, Select, Button } from "@mui/material";
import Table from "@mui/material/Table";
import InputLabel from '@mui/material/InputLabel';
import TableFooter from "@mui/material/TableFooter";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TablePagination from "@mui/material/TablePagination";
import EditIcon from '@mui/icons-material/Edit';
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import TableHead from "@mui/material/TableHead";
import DeleteIcon from '@mui/icons-material/Delete';
import PageTitle from "../../common/PageTitle";
import { Link, useNavigate } from "react-router-dom";
import Loader from "../../common/Loader";
import { getAPI, patchAPI, postAPI, deleteAPI } from "../../network";
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
  const [open, setOpen] = useState();
  const [show, setShow] = useState(false);
  const [assignuser, setAssignUser] = useState('');
  const [site, setSite] = useState("");
  const [editdelId ,setDelEditId]=useState('');
  const [del,setDel]=useState(false);
  const [sites, setSites] = useState([])
  const [editId, setEditId] = useState('');
  const [assignId, setAssignId] = useState('')
  const [page, setPage] = useState(0);
  const navigateTo = useNavigate();

  const [perPages, setPerPages] = useState([10, 25, 50]);
  const [perPage, setPerPage] = useState(10)


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

  var casualData = []
  schedulers.map((item) => {
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
    if (data) {
      let outputs = data.map((item) => ({
        id: item._id,
        label: item.name,
        value: item._id
      }))
      setSites(outputs)
    }
    setLoader()
  }


  const handleChangeRowsPerPage = (event) => {
    console.log(event.target.value)
    setPerPage(event.target.value)
    setPage(0);
  };
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };


  const ReassignShift = async(id, user = null)=> {

    if (user != null) {
      setAssignUser(fullName(user))
      // setMsg('Shift is Not Approved by Any User')
    }
    else{
      setAssignUser('')
    }
    // console.log("approve by", user)
    setAssignId(id)
    setOpen(true)

  }
  const payload = {
    status: "Assigned"
  }
  const handleAssign = async () => {

    setLoader(true)
    let data = await patchAPI(`/company/shifts/${assignId}`, payload);
    if (data) {
      setOpen(false);
      setLoader(false)
      getShedulers()
    }

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
    else if (event.target.name === 'alarmStatus') {
      getAlarms(Alarmlabel.label)
    }
  };
  const advertisedStatus = [
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
  const advertiseStatus = (id, stat) => {
    setLoader(true)
    // console.log("id status*********",id)
    let datas = {
      status: stat
    }
    const data = patchAPI(`/company/shifts/change-status/${id}`, datas)
    if (data) {
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
  const handleDelete = async()=>{
      setLoader(true)
      const datas={
        status:"Cancel"
      }
      console.log("cancel shift")
    let data = await patchAPI(`/company/shifts/${editId}`,datas );
    if (data) {
      setShow(false);
      setLoader(false)
      getShedulers()
    }
  }

  const shiftDelete = (id) => {
    // console.log("id",id)
    setDelEditId(id);
    setDel(true);
  }

  const deleShift = async () => {
    setLoader(true);
    let process = await deleteAPI(`/company/shifts/${editdelId}`);

    if (process) {
      getShedulers()
      setDel(false);

    }
    getShedulers()
    setLoader(false)
  }


 
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
          {/* <FormControl sx={{ my: 1, minWidth: "30%" }}>
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
          </FormControl> */}
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
                {/* {console.log("schedular--------",scheduadvertiseStatuslers)} */}
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
                        {item.assignedUser ? fullName(item?.assignedUser) : ''}
                      </Link>
                    </TableCell>
                    <TableCell align="center" sx={tableData}>
                      {formatDate(item?.startDate)}
                    </TableCell>
                    <TableCell align="center" sx={tableData}>
                      {formatDate(item?.endDate)}
                    </TableCell>
                    <TableCell align="center" sx={tableData}>
                      {item?.status}
                    </TableCell>
                                       
                    <TableCell align="center" sx={tableData}>
                        {item?.assignedUser?
                        <Link to={`/user/license/${item.assignedUser?._id}`} underline="always" className="fileclass">
                        View
                        </Link> :
                        ''
                        }
                    </TableCell>
                    <TableCell align="center" sx={tableData}>
                      {item?.assignedUser?
                       <Link  to={`/user/profile/${item.assignedUser?._id}`} underline="always" className="fileclass">
                        View
                        </Link> :
                        ''
                        }
                       
                    
                    </TableCell>
                    <TableCell align="center" sx={tableData}>
                      {item?.status == 'Unassigned' || item?.status=="In Process"?
                        <Link to="#" underline="always" className="fileclass">
                          <div onClick={() => ReassignShift(item?._id, item?.assignedUser)}>Approve</div>
                        </Link> :
                        <Link to="#" underline="always" className="fileclass">
                          {
                            item.status=='Cancel'?
                            <div onClick={() => ReassignShift(item?._id, item?.assignedUser)}>Reassign</div>:
                            <div onClick={() => deleteshift(item?._id)}>Cancel</div>
                            
                          }
                          
                        </Link>
                      }

                    </TableCell>
                    <TableCell>
                      <Button className="btn-div" variant="outlined" color="info" sx={{ mx: 1 }} onClick={(e) => {
                        navigateTo('/scheduler/casual-shifts', { state: { action: 'edit', task: item } })
                      }}>
                        <EditIcon className="btn" />
                      </Button>


                      <Button variant="outlined" className="btn-div" color="error" onClick={() => shiftDelete(item?._id)}>
                        <DeleteIcon className="btn" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}

                {
                  schedulers.length === 0 &&
                  <EmptyTable colSpan={9} />
                }
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TablePagination
                    align="right"
                    rowsPerPageOptions={perPages}
                    colSpan={9}
                    count={temp.length}
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
        {/* <Box mt="7%" ml={-4}>
          <PageTitle title="View Alarm Response" />
        </Box>

        <Box mb="10%">
          
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
                  </TableCell> 
                </TableRow>
              </TableHead>


              <TableBody>
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

                   <TableCell align="center" sx={tableData}>
                      <Link to="#" underline="always" className="fileclass">
                        {item.status === 'Booked' ? 'Cancel' : item.status}
                      </Link>
                    </TableCell> 
                  </TableRow>
                ))}
              </TableBody>

            </Table>
          </TableContainer>
        </Box> */}
      </Box>

      <Dialog open={open} onClose={() => { setOpen(false) }} fullWidth>
        <DialogTitle align="center">{assignuser ? `Do You Want to Assign This Shift to ${assignuser} ?` : `User not shown interest in this shift`} </DialogTitle>
        <DialogContent>

        </DialogContent>
        {assignuser ?
          <DialogActions sx={{ mt: 10, mb: 2, alignItem: "center", justifyContent: "space-around" }}>
            <Box container>
              <Button onClick={handleAssign} variant="outlined">Yes</Button>
            </Box>
            <Button onClick={() => {
              setOpen(false)
            }} variant="outlined">No</Button>
          </DialogActions>
          :
          <DialogActions sx={{ mt: 10, mb: 2, alignItem: "center", justifyContent: "space-around" }}>
            <Box container>
              <Button onClick={() => setOpen(false)} variant="outlined">Ok</Button>
            </Box>
          </DialogActions>

        }
      </Dialog>

      <Dialog open={show} onClose={() => { setShow(false) }} fullWidth>
        <DialogTitle align="center">Do You Want to Cancel This Shift ?</DialogTitle>
        <DialogContent>

        </DialogContent>
        <DialogActions sx={{ mt: 10, mb: 2, alignItem: "center", justifyContent: "space-around" }}>
          <Box container>
            <Button onClick={handleDelete} variant="outlined">Yes</Button>
          </Box>
          <Button onClick={() => {
            setShow(false)
          }} variant="outlined">No</Button>
        </DialogActions>
      </Dialog>


      <Dialog open={del} onClose={() => { setDel(false) }} fullWidth>
        <DialogTitle align="center">Do You Want to Delete This Shift ?</DialogTitle>
        <DialogContent>

        </DialogContent>
        <DialogActions sx={{ mt: 10, mb: 2, alignItem: "center", justifyContent: "space-around" }}>
          <Box container>
            <Button onClick={deleShift} variant="outlined">Yes</Button>
          </Box>
          <Button onClick={() => {
            setDel(false)
          }} variant="outlined">No</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
