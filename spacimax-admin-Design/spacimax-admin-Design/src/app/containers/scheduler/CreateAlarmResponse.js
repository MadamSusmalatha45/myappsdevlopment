import React, {useEffect, useState} from "react";
import { Box, FormControl, Button} from "@mui/material";
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
import BasicSelector from "../../common/Selector";
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { getAPI, postAPI , patchAPI, deleteAPI, putAPI} from "../../network";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';  
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import { Select as Choice }  from '@mui/material';
import "./style.css";
import { timeFormat, formatDate, formatDatePost,getSetTime,validation,tableHeader,tableData,tablebtn} from "../../utils";
import Loader from "../../common/Loader";
import Select from 'react-select';
import EmptyTable from "../../common/EmptyTable";
import LocalTimeSelector from "../../common/LocalTimeSelector";
import LocalDateSelector from "../../common/LocalDateSelector";

export default function CompanyAllUsers() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState('');
  const [editId, setEditId] = useState('');
  const [action, setAction] = useState('');
  const [show, setShow] = useState(false);
  const [loader, setLoader] = useState(false);
  const [users, setUsers] = useState([]);
  const [alarm, setalarm] = useState([]);
  const [countries, setCountries] = useState([])
  const [cities, setCities] = useState([])
  const [roles, setRoles] = useState([])
  const [sites, setSites] = useState([])
  const [companies, setCompanies] = useState([]);
  const [TimeError, setEndTimeError] = useState(false)
  const [DateError, setStartDateError] = useState(false)

  const [page, setPage] = useState(0);
  const[isVerified, setisVerified]=useState(false)


  const Status = [
    { label: "Partially Completed", value: "Partially Completed" },
    { label: "Completed", value: "Completed" },
    { label: "UpComming", value: "UpComming" },
    { label: "Opened", value: "Opened" },

  ]
  const [person, setPerson] = useState({
    title:'',
    user :'',
    company:'',
    status:'',
    sites : [],
    description:'',
    dueDate:null,
    startTime:null,
    endTime:null,
    UserError : false,
    companyError : false,
    userError:false,
    statusError : false,
    dueDateError : false,
    dueTimeError : false
  })
  const [perPages, setPerPages] = useState([10,25, 50]);
  const [perPage, setPerPage] = useState(10)


  useEffect(() => {
    getalarm();
    getCompanies();
    getSites();
    UserLists()
  },[]);

  const getalarm = async () => {
    setLoader(true)
    let data = await getAPI('/alarm');
    if(data) {
        setalarm(data)
    }
    setLoader(false)
  }

  const UserLists = async () => {
    let process = await getAPI('/users/app');

    if (process) {
      var users = [];
      for (var i = 0; i < process.length; i++) {
        var obj = process[i]
        obj['fullName'] = process[i].firstname + ' ' + process[i].lastname
        obj['label'] = process[i].firstname + ' ' + process[i].lastname + ` (${process[i].email})`
        obj['value'] = process[i].id

        users.push(obj)

      }

      setUsers(users);
    }
  }

  // const getCities = async(cityId) => {
  //   setLoader(true)   
  //   const data = await getAPI(`/cities/by-country/${cityId}`);
  //   if(data){
  //       setCities(data)
  //   }
  //   setLoader(false)
  // }


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
  const getCompanies = async() => {
    let process = await getAPI('/companies');
    if(process){
      var companies = [];
      for(var i = 0; i< process.length ; i++){
        companies.push({label : process[i].name, value : process[i].id})
      }
      console.log("companies--",companies)
      setCompanies(companies);
    }
  }
   
  const handleChangeRowsPerPage = (event) => {
    console.log(event.target.value)
    setPerPage(event.target.value)
    setPage(0);
  };
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const addUser = (e) => {
    e.preventDefault();
    setAction('add');
    clearAll();
    setOpen(true)
  }

  const editUser = (e, id) => {
    e.preventDefault();
    setEditId(id)
    clearAll();


    let data = alarm.filter(item => item.id === id)[0];
    let siteChoices = person.sites.filter((item) => {
      console.log("---data.sites----",data)
        if(data.sites.includes(item)){
            return item;
        }
    })    
 
   
    setPerson(prevState => ({
        ...prevState,
       
        title:data?.title,
        sites : siteChoices,
        company : data?.company._id,
        status:data?.status,
        dueDate:data?.dueDate,
        startTime:getSetTime(data?.startTime),
        endTime:getSetTime(data?.endTime),
        user:data?.user?._id,
        description:data?.description,
        userError : false,
        companyError : false,
        dueDateError : false,
        dueTimeError : false,
        sitesError : false
        // roleError : false
    }))

    // getCities(data.countryId._id)
    setAction('edit');
    setOpen(true)

    
    
  }

  const deleteUser = (id) => {
    setEditId(id);
    clearAll();
    setShow(true);
  }

  const clearAll = () => {
    setPerson({
      title:'',
      user :'',
      company:'',
      status:'',
      dueDate:'',
      startTime:'',
      endTime:'',
      sites : [],
      description:'',
      userError : false,
      companyError : false,
      dueDateError : false,
      dueTimeError : false,
      sitesError : false
      })
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleShowClose = () => {
    setShow(false);
  }

  const handleSubmit = async(e) => {
    e.preventDefault();
    setPerson(prevState => ({
        ...prevState,
        userError : false,
        companyError : false,
        dueDateError : false,
        dueTimeError : false,
        sitesError : false
    }))


    if(validation(null, 'user', person.user)){
        setPerson(prevState => ({
            ...prevState,
            userError: true,
        }))
        return;
    }
    else if(validation('empty', 'Title', person.title)){
      setPerson(prevState => ({
          ...prevState,
          titleError: true,
      }))
      return;
  }
 
    else if(validation('empty', 'Company', person.company)){
        setPerson(prevState => ({
            ...prevState,
            companyError: true,
        }))
        return;
    }
    else if(validation('empty', 'Status', person.status)){
        setPerson(prevState => ({
            ...prevState,
            statusError: true,
        }))
        return;
    }
    else if(validation('empty', 'Duedate', person.dueDate)){
        setPerson(prevState => ({
            ...prevState,
            dueDateError: true,
        }))
        return;
    }
    else if(validation('empty', 'StartTime', person.startTime)){
      setPerson(prevState => ({
          ...prevState,
          dueTimeError: true,
      }))
      return;
  }
  else if(validation('empty', 'EndTime', person.endTime)){
    setPerson(prevState => ({
        ...prevState,
        dueTimeError: true,
    }))
    return;
}
    
    else if(validation('array', 'Sites', person.sites)){
        setPerson(prevState => ({
            ...prevState,
            sitesError: true,
        }))
        return;
    }
    

    console.log("person*******",person)
    var ids = person.sites.map((item) => {
        return item.value
      });
    
    let formData = new FormData();
    formData.append('title', person.title);
    formData.append('user', person.user);
    formData.append('company', person.company);
    formData.append('status', person.status);
    formData.append('dueDate', formatDatePost(person.dueDate));
    formData.append('startTime',  timeFormat(person.startTime));
    formData.append('endTime',  timeFormat(person.endTime));
    formData.append('description', person.description);
    // formData.append(`sites`,ids)
    for(let i=0;i<ids.length;i++){
      formData.append(`sites[${i}]`,ids[i])
    }

    

    // let payload = {
        // firstname : person.firstname,
        // lastname : person.lastname,
        // email :person.email,
        // vendorId: person.vendor,
        // password:person.password,
        // companyId : person.company,
        // roleId : person.roles,
        // siteId : ids
    // }

    // console.log(payload);
    // return;


    if(action === 'add'){
       setLoader(true)
       let data = await postAPI('/alarm', formData)
       if(data){
        getalarm()
        setOpen(false)
       }
       setLoader(false)
    }
    else{
        setLoader(true)
        let data = await putAPI(`/alarm/${editId}`, formData)
        if(data){
          getalarm()
         setOpen(false)
        }
        setLoader(false)
     }
  }

  // const handleDelete = async() => {
  //   setLoader(true);
  //   let data = await postAPI('/company-admin-users', payload)
  //   setLoader(false);
  //   if(process){
  //     getUsers();
  //     setShow(false)
  //   }
  // }

  // const getPagination = async(data = [] ,page = null, row = null) => {
  //   let newData = data.length !== 0 ? data : users
  //   let newRow = row !== null ? row : pagination.rows
  //   let newPage = page !== null ? page : pagination.page
  //   console.log('newData', newData)
  //   console.log('newRow', newRow)
  //   console.log('newPage', newPage)
  //   if(newData.length > 0){
  //     console.log(newPage === 1 ? 0 :((newPage * newRow) - 1), ((newPage  * newRow) - 1) < newData.length ? ((newPage * newRow) - 1) : newData.length)
  //     let records = await newData.slice(newPage === 1 ? 0 :((newPage * newRow) - 1), ((newPage  * newRow) - 1) < newData.length ? ((newPage * newRow) - 1) : newData.length)
  //     console.log('RECORDS', records)
  //     await setPagination({
        
  //       data:records,
  //       page : newPage,
  //       rows : newRow,
  //       noOfPages : Math.ceil(newData.length / newRow)
  //      })
  //   }
  //   else{
  //     await setPagination({
        
  //       data:[],
  //       page : newPage,
  //       rows : newRow,
  //       noOfPages : 0
  //      })
  //   }

  // }
  // const toggleStatus=((id,status)=>{
   
  //   let payload={}
  //   if (status==true){
  //     payload={
  //       "isVerified":false
  //     }
  //   }
  //   else{
  //     payload={
  //       "isVerified":true
  //     }
  //   }
    

  //   const data=putAPI(`/company-admin-users/change-status/${id}`,payload)
  //   if (data){
      
  //       getUsers()
  //   }
  // })

  return (
    <Box sx={{ height: "inherit" }}>
      <Loader loader={loader} />
      <PageTitle title="Secuber" subTitle="Create Alarm Response" />
      <Box
        display="flex"
        justifyContent="flex-end"
        alignItems="flex-end"
        sx={{mx : 2}}
        >
        <Button variant="contained" style={{backgroundColor : "grey"}} sx={{ height: 50 }} onClick={addUser}>
          <AddCircleIcon /> &nbsp; &nbsp;
           Create Alarm Response
        </Button>
      </Box> 
      <Box display="flex" sx={{ my: "2rem" }}>
        
        <TableContainer component={Paper} sx={{ mx: "0.8rem" }}>
          <Table
            sx={{ minWidth: "auto" }}
            aria-label="custom pagination table"
            className="responsive-table"
          >
            <TableHead>
              <TableRow className="table-header" align="center">
                <TableCell align="left" component="th" sx={tableHeader}>
                  User 
                </TableCell>
                <TableCell align="center" component="th" sx={tableHeader}>
                  Company
                </TableCell>
                <TableCell align="left" component="th" sx={tableHeader}>
                  Title
                </TableCell>
                <TableCell align="left" component="th" sx={tableHeader}>
                  DueDate
                </TableCell>
                <TableCell align="left" component="th" sx={tableHeader}>
                   StartTime
                </TableCell>
                <TableCell align="left" component="th" sx={tableHeader}>
                   EndTime
                </TableCell>
                <TableCell align="center" component="th" sx={tableHeader}>
                  Status
                </TableCell>
               
                <TableCell align="center" component="th" sx={tableHeader}>
                 Edit
                </TableCell>
              
                {/* <TableCell align="center" component="th" sx={tableHeader}>
                  Created At
                </TableCell> */}
               
              </TableRow>
            </TableHead>
         
            <TableBody>
              {console.log("users----",alarm)}
              {alarm.slice(page * perPage, page * perPage + perPage).map((item, index) => (
                <TableRow key={index}>
                  <TableCell align="left" sx={tableData}>
                    {item?.user?.firstname} {' '} {item?.user?.lastname}
                  </TableCell>
                  <TableCell align="center" sx={tableData}>
                    {item?.company?.name}
                  </TableCell>
                  <TableCell align="left" sx={tableData}>
                    {item?.title}
                  </TableCell>
                  <TableCell align="left" sx={tableData}>
                    {formatDate(item?.dueDate)}
                  </TableCell>
                  <TableCell align="left" sx={tableData}>
                    {item?.startTime}
                  </TableCell>
                  <TableCell align="left" sx={tableData}>
                    {item?.endTime}
                  </TableCell>
                 <TableCell align="left" sx={tableData}>
                    {item?.status}
                  </TableCell>
                 
                  <TableCell align="center" className="action-div" sx={{textAlign : 'center'}}>
                    <Button size="small"  className="btn-div" variant="outlined" color="info" onClick={(e) => editUser(e,item?.id)}>
                      <EditIcon className="btn" />
                    </Button>
                    
                  </TableCell>
                 
                 

                </TableRow>
              ))}
              {
                alarm.length === 0 &&
                <EmptyTable colSpan={9} />
              }
            </TableBody>
            <TableFooter>
              <TableRow >
                
                  {/* <TablePagination
                  align="right"
                  rowsPerPageOptions={[ 10, 25,50, { label: "All", value: -1 }]}
                  colSpan={5}
                  count={users.length}
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
                /> */}
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
      <Dialog open={open} onClose={handleClose} fullWidth={true}>
        <DialogTitle sx={{ mb: 4 , textAlign :"center" }}>{action === 'add' ? 'Add' : 'Edit'} Alarm Response</DialogTitle>
        <DialogContent>
          <Box
            component="form"
            sx={{
              '& .MuiTextField-root': { my: 2, width: '100%' },
            }}
            noValidate
            autoComplete="off"
          >
            <FormControl sx={{  minWidth : '97%', mx : 0, px :0 }}>
            <TextField 
              id="title" 
              label="Title" 
              variant="outlined" 
              type="text" 
              value={person.title}
              error={person.titleError}
              onChange={(data) => {
                setPerson(prevState => ({
                    ...prevState,
                    title: data.target.value,
                }))
              }}
              fullWidth
              sx={{m : 0}}
            />
          </FormControl>
          
        
          <FormControl  sx={{  minWidth : '97%', mt : 2 }}>
            <InputLabel id="gender-label">Company</InputLabel>
            <Choice
              labelId="gender-label"
              id="company"
              value={person.company}
              label="Company"
              error={person.companyError}
              onChange={(data) => {
                  setPerson(prevState => ({
                      ...prevState,
                      company : data.target.value,
                  }))
              }}
            >
           
              {
                companies.map((item,index) => (
                    <MenuItem value={item.value} key={index}>{item.label}</MenuItem>
                ))
              }
            </Choice>
          </FormControl>
          <FormControl sx={{  minWidth : '97%', mt :2 }}>
             <span style={{fontWeight : 'bold', fontSize : 16, marginBottom : 5}}>User</span>
             <Select
                value={person.user}
                onChange={(data) => {
                    setPerson(prevState => ({
                        ...prevState,
                        user : data,
                    }))
                }}
                name="permissions"
                className="basic-multi-select "
                classNamePrefix="select"
                error={person.userError}
                options={users}
              />
          </FormControl>

          {/* <FormControl  sx={{  minWidth : '97%', mt : 2 }}>
            <InputLabel id="gender-label">User</InputLabel>
            <Choice
              labelId="gender-label"
              id="user"
              value={person.user}
              label="User"
              error={person.userError}
              onChange={(data) => {
                  setPerson(prevState => ({
                      ...prevState,
                      user : data.target.value,
                  }))
              }}
            >
           
              {
                users.map((item,index) => (
                    <MenuItem value={item.value} key={index}>{item.label}</MenuItem>
                ))
              }
            </Choice>
          </FormControl> */}
         
         

          {/* <FormControl  sx={{  minWidth : '97%', mt : 2 }}>
            
            <BasicSelector
                      disableAll={true}
                      options={Status}
                      selectorHight={"53px"}
                      value={person.status}
                      sx={{ background: "white"}}
                      onChange={(data) => {
                        setPerson(prevState => ({
                            ...prevState,
                            status : data.target.value,
                        })) }}
                      name={"Status"}
                      error={person.statusError}
                      helperText={
                        person.statusError ? 'Status is required !' : null
                      }
                    />
          </FormControl>  */}


          <FormControl sx={{ my: 1,minWidth : '97%', }}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DesktopDatePicker
                className="modal-component"
                label="Due Date"
                inputFormat="dd/MM/yyyy"
                value={person.dueDate}
                onChange={(data) => {
                  setPerson(prevState => ({
                      ...prevState,
                      dueDate : data,
                  })) }}
                  renderInput={(params) => <TextField {...params} />}
                // error={startDateError}
                fullWidth
              />
            </LocalizationProvider>
          </FormControl>

          <FormControl sx={{ my: 1,minWidth : '97%', }}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <TimePicker
                label="Start Time"
                value={person.startTime}
                onChange={(data) => {
                  setPerson(prevState => ({
                      ...prevState,
                      startTime : data,
                  })) }}
                  renderInput={(params) => <TextField {...params} />}
              />
            </LocalizationProvider> 
          </FormControl>
          <FormControl sx={{ my: 1 ,minWidth : '97%',}} >
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <TimePicker
                label="End Time"
                value={person.endTime}
                onChange={(data) => {
                  setPerson(prevState => ({
                      ...prevState,
                      endTime : data,
                  })) }}
                  renderInput={(params) => <TextField {...params} />}
              />
            </LocalizationProvider> 
          </FormControl>
          

          
          <FormControl sx={{  minWidth : '97%', mt :2 }}>
            <TextField 
              id="description" 
              label="description" 
              variant="outlined" 
              type="text" 
              multiline
              error={person.descriptionError}
              value={person.description}
              onChange={(data) => {
                setPerson(prevState => ({
                    ...prevState,
                    description: data.target.value,
                }))
              }}
              fullWidth
              
            />
          </FormControl>

          <FormControl sx={{  minWidth : '97%', mt :2 }}>
             <span style={{fontWeight : 'bold', fontSize : 16, marginBottom : 5}}>Sites</span>
             <Select
                value={person.sites}
                onChange={(data) => {
                    setPerson(prevState => ({
                        ...prevState,
                        sites : data,
                    }))
                }}
                isMulti
                name="permissions"
                className="basic-multi-select"
                classNamePrefix="select"
                error={person.sitesError}
                options={sites}
                style={{zIndex :900}}
              />
          </FormControl>
    
          </Box>
        </DialogContent>
        <DialogActions sx={{mb : 2 , mx : 4}}>
          <Button onClick={handleSubmit} variant="contained">{action === 'add' ? 'Submit' : 'Update'}</Button>
          <Button onClick={handleClose} variant="outlined">Cancel</Button>
        </DialogActions>
      </Dialog>

      {/* delete Modal
      <Dialog open={show} onClose={handleShowClose} fullWidth={true}>
        <DialogTitle sx={{ mb: 4 , textAlign :"center" }}>Admin User</DialogTitle>
        <DialogContent>
          <Box
            component="form"
            sx={{
              '& .MuiTextField-root': { my: 2, width: '100%' },
            }}
            noValidate
            autoComplete="off"
          >
            <h3 style={{textAlign : 'center', fontWeight :'bold'}}>Do you want's to change Status </h3>
          </Box>
        </DialogContent>
        <DialogActions sx={{mb : 2 , mx : 4}}>
          <Button onClick={handleDelete} variant="contained" color="error">Active</Button>
          <Button onClick={handleShowClose} variant="outlined">Cancel</Button>
        </DialogActions>
      </Dialog> */}
    </Box>
  );
}
