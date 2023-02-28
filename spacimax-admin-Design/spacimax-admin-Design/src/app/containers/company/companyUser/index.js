import React, {useEffect, useState} from "react";
import { Box, FormControl, Button} from "@mui/material";
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
import { getAPI, postAPI , patchAPI, deleteAPI, putAPI} from "../../../network";
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
import { formatDate, validation,tableHeader,tableData,tablebtn} from "../../../utils";
import Loader from "../../../common/Loader";
import Select from 'react-select';
import EmptyTable from "../../../common/EmptyTable";

export default function CompanyAllUsers() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState('');
  const [editId, setEditId] = useState('');
  const [action, setAction] = useState('');
  const [show, setShow] = useState(false);
  const [loader, setLoader] = useState(false);
  const [users, setUsers] = useState([]);
  const [countries, setCountries] = useState([])
  const [cities, setCities] = useState([])
  const [roles, setRoles] = useState([])
  const [sites, setSites] = useState([])
  const [companies, setCompanies] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [status, setStatus] = useState(false);
  const [statuses, setStatuses] = useState([{id:1,name:'Active'},{id:2,name:"InActive"}]);
  const [page, setPage] = useState(0);
  const[isVerified, setisVerified]=useState(false)


  
  const [person, setPerson] = useState({
    firstname :'',
    lastname :'',
    email :'',
    company:'',
    roles:'',
    // password:'',
    vendor:'',
    status:'',
    sites : [],
    firstnameError : false,
    lastnameError : false,
    emailError : false,
    vendorError : false,
    roleError : false,
    sitesError : false
  })
  const [perPages, setPerPages] = useState([10,25, 50]);
  const [perPage, setPerPage] = useState(10)


  useEffect(() => {
    getUsers();
    getCountries();
    getCompanies();
    getRoles();
    getSites();
    getVendor();
  },[]);

  const getUsers = async () => {
    setLoader(true)
    let data = await getAPI('/company-admin-users');
    if(data) {
        setUsers(data)
    }
    setLoader(false)
  }

  // const getCities = async(cityId) => {
  //   setLoader(true)   
  //   const data = await getAPI(`/cities/by-country/${cityId}`);
  //   if(data){
  //       setCities(data)
  //   }
  //   setLoader(false)
  // }

  const getRoles = async () => {
    setLoader(true)
    const data = await getAPI('/adm/roles');
    if(data){   
      setRoles(data)
    }
    setLoader(false)
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
     

    const getVendor = async () => {
    setLoader(true)
    let data = await getAPI('/vendors');
    if(data) {
        setVendors(data)
    }
    setLoader(false)
  }

  const getCountries = async() => {
    setLoader(true)
    const data = await getAPI('/countries');
    if(data){
        setCountries(data)
    }
    setLoader(false) 
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


    let data = users.filter(item => item._id === id)[0];
    let siteChoices = sites.filter((item) => {
        if(data.sites.includes(item.id)){
            return item;
        }
    })    
 

    setPerson(prevState => ({
        ...prevState,
        firstname : data?.firstname,
        lastname : data?.lastname,
        email : data?.email,
        // password:data?.password,
        sites : siteChoices,
        vendor : data?.vendor?._id,
        company : data?.company._id,
        roles: data?.roleId?._id,
        
        firstnameError : false,
        lastnameError : false,
        vendorError : false,
        emailError : false,
        sitesError : false,
        roleError : false,
        companyError : false,
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
        firstname :'',
        lastname :'',
        email :'',
        vendor :'',
        roles:'',
        // password:'',
        sites : [],
        firstnameError : false,
        lastnameError : false,
        emailError : false,
        vendorError : false,
        roleError : false,
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
        firstnameError : false,
        lastnameError : false,
        emailError : false,
        companyError : false,
        vendorError : false,
        roleError : false,
        sitesError : false
    }))

    if(validation(null, 'First Name', person.firstname)){
        setPerson(prevState => ({
            ...prevState,
            firstnameError: true,
        }))
        return;
    }
 
    if(validation(null, 'Last Name', person.lastname)){
        setPerson(prevState => ({
            ...prevState,
            lastnameError: true,
        }))
        return;
    }
    else if(validation('email', 'Email', person.email)){
        setPerson(prevState => ({
            ...prevState,
            emailError: true,
        }))
        return;
    }
    else if(validation('empty', 'Vendor', person.vendor)){
        setPerson(prevState => ({
            ...prevState,
            vendorError: true,
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
    else if(validation('empty', 'Role', person.roles)){
      setPerson(prevState => ({
          ...prevState,
          roleError: true,
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
    

    var ids = person.sites.map((item) => {
        return item.value
      });
    
    let formData = new FormData();
    formData.append('firstname', person.firstname);
    formData.append('lastname', person.lastname);
    formData.append('email', person.email);
    // formData.append('password', person.password);
    formData.append('vendor', person.vendor);
    formData.append('company', person.company);
    formData.append('roleId', person.roles);
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
       let data = await postAPI('/company-admin-users', formData)
       if(data){
        getUsers()
        setOpen(false)
       }
       setLoader(false)
    }
    else{
        setLoader(true)
        let data = await patchAPI(`/company-admin-users/${editId}`, formData)
        if(data){
         getUsers()
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
  const toggleStatus=((id,status)=>{
   
    let payload={}
    if (status==true){
      payload={
        "isVerified":false
      }
    }
    else{
      payload={
        "isVerified":true
      }
    }
    

    const data=putAPI(`/company-admin-users/change-status/${id}`,payload)
    if (data){
        getUsers()
    }
  })

  return (
    <Box sx={{ height: "inherit" }}>
      <Loader loader={loader} />
      <PageTitle title="Secuber" subTitle="Admin Users" />
      <Box
        display="flex"
        justifyContent="flex-end"
        alignItems="flex-end"
        sx={{mx : 2}}
        >
        <Button variant="contained" style={{backgroundColor : "grey"}} sx={{ height: 50 }} onClick={addUser}>
          <AddCircleIcon /> &nbsp; &nbsp;
            Add Admin User
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
                <TableCell align="left" component="th" sx={tableHeader}>
                  Email
                </TableCell>
                <TableCell align="left" component="th" sx={tableHeader}>
                  Role
                </TableCell>
                {/* <TableCell align="center" component="th" sx={tableHeader}>
                  vendor
                </TableCell> */}
                <TableCell align="center" component="th" sx={tableHeader}>
                  Company
                </TableCell>
                {/* <TableCell align="center" component="th" sx={tableHeader}>
                  Phone
                </TableCell>
                <TableCell align="center" component="th" sx={tableHeader}>
                  Postcode
                </TableCell> */}
                {/* <TableCell align="center" component="th" sx={tableHeader}>
                  Created At
                </TableCell> */}
                <TableCell align="center" component="th" sx={tableHeader} >
                  Action
                </TableCell>
                <TableCell align="center" component="th" sx={tableHeader} >
                  Status
                </TableCell>
              </TableRow>
            </TableHead>
         
            <TableBody>
              {console.log("users----",users)}
              {users.slice(page * perPage, page * perPage + perPage).map((item, index) => (
                <TableRow key={index}>
                  <TableCell align="left" sx={tableData}>
                    {item?.firstname} {' '} {item?.lastname}
                  </TableCell>
                  <TableCell align="left" sx={tableData}>
                    {item?.email}
                  </TableCell>
                 <TableCell align="left" sx={tableData}>
                    {item?.roleId?.name}
                  </TableCell>
                  {/*   <TableCell align="center" sx={tableData}>
                    {item.vendor?.name}
                  </TableCell> */}
                  <TableCell align="center" sx={tableData}>
                    {item?.company?.name}
                  </TableCell>
                  {/* <TableCell align="center" sx={tableData}>
                    {item?.phone}
                  </TableCell>
                  <TableCell align="center"  sx={tableData} className="address-width">
                    {item?.postcode}
                  </TableCell> */}
                  {/* <TableCell align="center" sx={tableData}>
                    {formatDate(item?.createdAt)}
                  </TableCell> */}
                  <TableCell align="center" className="action-div" sx={{textAlign : 'center'}}>
                    <Button size="small"  className="btn-div" variant="outlined" color="info" onClick={(e) => editUser(e,item?._id)}>
                      <EditIcon className="btn" />
                    </Button>
                    
                  </TableCell>
                  <TableCell align="center">
                    <Button style={{color:item.isVerified==true?"red":"green",border:"1px solid gray",width:"6rem"}} onClick={(e)=>toggleStatus(item?._id,item.isVerified)}>{item.isVerified===true?"Active":"InActive"}</Button>
                  </TableCell>
                 

                </TableRow>
              ))}
              {
                users.length === 0 &&
                <EmptyTable colSpan={9} />
              }
            </TableBody>
            <TableFooter>
              <TableRow >
                
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
        <DialogTitle sx={{ mb: 4 , textAlign :"center" }}>{action === 'add' ? 'Add' : 'Edit'} Admin User</DialogTitle>
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
              id="firstname" 
              label="Fist Name" 
              variant="outlined" 
              type="text" 
              value={person.firstname}
              error={person.firstnameError}
              onChange={(data) => {
                setPerson(prevState => ({
                    ...prevState,
                    firstname: data.target.value,
                }))
              }}
              fullWidth
              sx={{m : 0}}
            />
          </FormControl>

          <FormControl sx={{  minWidth : '97%', mx : 0, px :0 }}>
            <TextField 
              id="lastname" 
              label="Last Name" 
              variant="outlined" 
              type="text" 
              value={person.lastname}
              error={person.lastnameError}
              onChange={(data) => {
                setPerson(prevState => ({
                    ...prevState,
                    lastname: data.target.value,
                }))
              }}
              fullWidth
              sx={{m : 0}}
            />
          </FormControl> 

          <FormControl sx={{  minWidth : '97%' }}>
            <TextField 
              id="email" 
              label="Email" 
              variant="outlined" 
              type="text" 
              value={person.email}
              error={person.emailError}
              onChange={(data) => {
                setPerson(prevState => ({
                    ...prevState,
                    email: data.target.value,
                }))
              }}
              fullWidth
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
         

          <FormControl  sx={{  minWidth : '97%', mt : 2 }}>
            <InputLabel id="vendor-label">vendor</InputLabel>
            <Choice
              labelId="vendor-label"
              id="vendor"
              value={person.vendor}
              label="Vendor"
              error={person.vendorError}
              onChange={(data) => {
                  setPerson(prevState => ({
                      ...prevState,
                      vendor : data.target.value,
                  }))
              }}
            >
              {
                vendors.map((item,index) => (
                    <MenuItem value={item?.id} key={index}>{item?.name}</MenuItem>
                ))
              }
            </Choice>
          </FormControl>

          <FormControl  sx={{  minWidth : '97%', mt : 2 }}>
            <InputLabel id="gender-label">Role</InputLabel>
            <Choice
              labelId="gender-label"
              id="roles"
              value={person.roles}
              label="Role"
              error={person.roleError}
              onChange={(data) => {
                  setPerson(prevState => ({
                      ...prevState,
                      roles : data.target.value,
                  }))
              }}
            >
              {
                roles.map((item,index) => (
                    <MenuItem value={item.id} key={index}>{item.name}</MenuItem>
                ))
              }
            </Choice>
          </FormControl>

          {/* <FormControl  sx={{  minWidth : '97%', mt : 2 }}>
            <InputLabel id="status-label">Status</InputLabel>
            <Select
              labelId="status-label"
              id="status"
              value={person.status}
              error={person.statusError}
              onChange={(data) => {
                  setPerson(prevState => ({
                      ...prevState,
                      status : data.target.value,
                  }))
                  // getCities(data.target.value);
              }}
            >
           {/* {console.log("Status----",statuses)} */}
               {/* {
                statuses.map((item) => (
                    <MenuItem value={item.id}>{item.name}</MenuItem>
                ))
              }
            </Select>
          </FormControl>  */}

          {/* <FormControl sx={{  minWidth : '97%' }}>
            <TextField 
              id="phone" 
              label="Phone" 
              variant="outlined" 
              type="number" 
              value={person.phone}
              error={person.phoneError}
              onChange={(data) => {
                setPerson(prevState => ({
                    ...prevState,
                    phone: data.target.value,
                }))
              }}
              fullWidth
            />
          </FormControl> */}

          {/* <FormControl  sx={{  minWidth : '97%', mt : 2 }}>
            <InputLabel id="country-label">Country</InputLabel>
            <Choice
              labelId="country-label"
              id="country"
              value={person.countryId}
              label="Country"
              error={person.countryIdError}
              onChange={(data) => {
                  setPerson(prevState => ({
                      ...prevState,
                      countryId : data.target.value,
                  }))
                  getCities(data.target.value);
              }}
            >
              {
                countries.map((item,index) => (
                    <MenuItem value={item._id} key={index}>{item.name}</MenuItem>
                ))
              }
            </Choice>
          </FormControl> */}

          {/* <FormControl  sx={{  minWidth : '97%', mt :4 }}>
            <InputLabel id="city-label">CIty</InputLabel>
            <Select
              labelId="city-label"
              id="city"
              value={person.cityId}
              error={person.cityIdError}
              label="City"
              onChange={(data) => {
                  setPerson(prevState => ({
                      ...prevState,
                      cityId : data.target.value,
                  }))
              }}
            >
              {
                cities.map((item,index) => (
                    <MenuItem value={item._id} key={index}>{item.name}</MenuItem>
                ))
              }
            </Select>
          </FormControl> */}

          {/* <FormControl sx={{  minWidth : '97%', mt :2 }}>
            <TextField 
              id="password" 
              label="password" 
              variant="outlined" 
              type="number" 
              error={person.passwordError}
              value={person.password}
              onChange={(data) => {
                setPerson(prevState => ({
                    ...prevState,
                    password: data.target.value,
                }))
              }}
              fullWidth
            />
          </FormControl> */}


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
