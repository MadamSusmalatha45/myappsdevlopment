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
import EditIcon from '@mui/icons-material/Edit';
import TableHead from "@mui/material/TableHead";
import { getAPI, postAPI , putAPI, patchAPI} from "../../../network";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import "./style.css";
import { formatDate, validation ,tableHeader,tableData, fullName} from "../../../utils";
import Loader from "../../../common/Loader";
import { useParams } from "react-router-dom";
import Select from 'react-select'
import { toast } from "react-toastify";
import { Select as Choice }  from '@mui/material';
import EmptyTable from "../../../common/EmptyTable";

export default function VendorClient() {
  const [open, setOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [editId, setEditId] = useState('');
  const [action, setAction] = useState('');
  const [loader, setLoader] = useState(false);
  const [countries, setCountries] = useState([])
  const [oldSites, setOldSites] = useState([])
  const [sites, setSites] = useState([])
  const [multiple, setMultiple] = useState(true)
  const [clients, setClients] = useState([]);
  const [vendor, setVendor] = useState({})
  const { vendorId } = useParams();
  const [companies, setCompanies] = useState([]);
  const [cities, setCities] = useState([]);
  const [person, setPerson] = useState({
    firstname:'',
    lastname:'',
    email:'',
    latitude:'',
    longitude:'',
    company:'',
    address:'',
    sites :[],
    firstnameError : false,
    lastnameError : false,
    companyError : false,
    emailError : false,
    clientError : false,
    sitesError : false
  })

  useEffect(() => {
    // getClients()
    getSites();
    getVendor();
    getAllClients();
    getCities()
    getCountries()
    getCompanies()
  },[]);

  const toastObj = {position: toast.POSITION.TOP_RIGHT};


  const getCities = async() => {
    setLoader(true)
    const data = await getAPI(`/cities`);
    if(data){
        setCities(data)
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
  
  const getVendor = async () => {
    setLoader(true)
    let data = await getAPI(`/vendors/${vendorId}`)
    if(data){
      setVendor(data)
    }
    setLoader(false)
  }

  // const getClients = async () => {
  //   setLoader(true)
  //   let data = await getAPI(`/vendor/clients?vendor=${vendorId}`)
  //   if(data){
  //     if(data.length > 0){
  //       setUsers(data[0].clients)
  //       setOldSites(data[0].sites)
  //     }
  //   }
  //   setLoader(false)
  // }

  const getSites = async () => {
    setLoader()
    let data = await getAPI('/sites')
    if(data){
        var outputs = data.map((item) => ({
            id : item._id,
            label : item.name,
            value : item._id
        }))
        setSites(outputs)
    }
    setLoader()
  }


  const getAllClients = async () => {
    setLoader()
    let data = await getAPI('/company/clients')
    if(data){
        setUsers(data)
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
    

    const data = putAPI(`/company/clients/change-status/${id}`,payload)
    if (data){
      getAllClients()
    }
  })

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
 
//  console.log("data---",data)
    setPerson(prevState => ({
        ...prevState,
        firstname : data?.firstname,
        lastname : data?.lastname,
        email : data?.email,
        sites : siteChoices,
        latitude:data?.latitude,
        longitude:data?.longitude,
        company : data?.company?._id,
        address:data.address,
        firstnameError : false,
        lastnameError : false,
        companyError : false,
        addressError : false,
        emailError : false,
        clientError : false,
        sitesError : false
       
    }))

    // getCities(data.countryId._id)
    setAction('edit');
    setOpen(true)
  }

  const handleChangePage = () => {};

  const handleChangeRowsPerPage = () => {};

  const TablePaginationActions = () => {};


  const clientAction = (txt) => {
    clearAll(txt);
    setAction(txt);
    txt === 'add' ? setMultiple(true) : setMultiple(false)
    setOpen(true)
  }

  const clearAll = (txt) => {
    setPerson({
        sites : txt === 'add' ? [] : '',
        clients : txt === 'add' ? [] : '',
        siteError : false,
        clientError : false
      })
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleSubmit = async(e) => {
    e.preventDefault();
    setPerson(prevState => ({
        ...prevState,
        siteError : false,
        clientError : false
    }))

    if(action === 'add'){
      if(validation('array','Sites',person.sites)){
        setPerson({
          ...person,
          siteError : true
        })
        return false;
      }
      else if(validation('empty','FistName',person.firstname)){
        setPerson({
          ...person,
          firstNameError : true
        })
        return false;
      }
      else if(validation('empty','LastName',person.lastname)){
        setPerson({
          ...person,
        lastNameError : true
        })
        return false;
      }
      else if(validation('empty','Company',person.company)){
        setPerson({
          ...person,
        companyError : true
        })
        return false;
      }
      else if(validation('email','Email',person.email)){
        setPerson({
          ...person,
        emailError : true
        })
        return false;
      }
      else if(validation('empty','Address',person.address)){
        setPerson({
          ...person,
        addressError : true
        })
        return false;
      }

      if(person.sites.length === 0 && person.clients.length === 0){
        toast.error('At least one site or client must be select',toastObj);
        return ;
      }

      
    }
    else{
      // if(validation('empty','Sites',person.sites)){
      //   setPerson({
      //     ...person,
      //     siteError : true
      //   })
      //   return false;
      // }
      // else if(validation('empty','Clients',person.clients)){
      //   setPerson({
      //     ...person,
      //     clientError : true
      //   })
      //   return false;
      // }

      if(person.sites == '' && person.clients == ''){
        toast.error('At least site or client must be select',toastObj);
        return ;
      }
    }

    

    if(action === 'add'){
      setLoader(true)
      var site_ids = []
      for(var i = 0; i < person.sites.length; i++){
        site_ids.push(person.sites[i].id)
      }
     
      var formData = new FormData();
      formData.append('firstname', person.firstname);
      formData.append('lastname', person.lastname);
      formData.append('email', person.email);
      // formData.append('password', person.password);
      formData.append('address', person.address);
      formData.append('company', person.company);
      formData.append('latitude',person.latitude);
      formData.append('longitude', person.longitude);
      
      for(let i=0;i<site_ids.length;i++){
        formData.append(`sites[${i}]`,site_ids[i])
      }
  
     
      // let payload = {
      //   firstname : person.firstname,
      //   lastname : person.lastname,
      //   email:person.email,
      //   sites:site_ids,
      //   address:person.address,
      //   latitude:person.latitude,
      //   longitude:person.longitude,
      //   companyId:person.companyId
      // }
      // console.log('add')
      // console.log(payload)
      let data = await postAPI('/company/clients', formData)
      if(data){
        getAllClients()
       setOpen(false)
      }
      setLoader(false)
   }
   else{
    setLoader(true)
    let data = await patchAPI(`/company/clients/${editId}`, formData)
    if(data){
     getAllClients()
     setOpen(false)
    }
    setLoader(false)
    }
  }

  const getVendorSites = () => {
    var siteName = ''

    for(var i =  0; i < oldSites.length ; i ++){
      siteName += oldSites[i].name + ' ';
      
    }
    return siteName;
  }


  const getCountry= (id) => {
    var country = ''
    for(var i =  0; i < countries.length ; i ++){
      if(id === countries[i]._id){
        country = countries[i].name ;
      }
    }
    return country;
  }


  const getCity= (id) => {

    var city = ''
    for(var i =  0; i < cities.length ; i ++){
      if(id == cities[i].id){
        city = cities[i].name ;
      }
    }
    return city;
  }



  return (
    <Box sx={{ height: "inherit" }}>
      <Loader loader={loader} />
      <PageTitle title="Secuber" subTitle="Clients" />
      {/* <Box
        display="flex"
        
        sx={{mx : 2}}
        >
        <h3>Vendor Name - {vendor?.name}<br></br>
        Sites - {getVendorSites()}</h3>
      </Box>  */}
      <Box
        display="flex"
        justifyContent="flex-end"
        alignItems="flex-end"
        sx={{mx : 2}}
        >
        <Button variant="contained" style={{backgroundColor : "grey"}} sx={{ height: 50, mx : 2 }} onClick={ () => {clientAction('add')}}>
          <AddCircleIcon /> &nbsp; 
            Add Client
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
                  Client 
                </TableCell>
                <TableCell align="left" component="th" sx={tableHeader}>
                  Email
                </TableCell>
                <TableCell align="left" component="th" sx={tableHeader}>
                  Company
                </TableCell>
                <TableCell align="center" component="th" sx={tableHeader}>
                  User As
                </TableCell>
                <TableCell align="center" component="th" sx={tableHeader}>
                  Created At
                </TableCell>
                <TableCell align="center" component="th" sx={tableHeader} >
                  Action
                </TableCell>
                <TableCell align="center" component="th" sx={tableHeader}>
                  Status
                </TableCell>
              
              </TableRow>
            </TableHead>
            <TableBody>
              {console.log("Users=======",users)}
              {users.map((item, index) => (
                <TableRow key={index}>
                  <TableCell align="left" sx={tableData}>
                    {fullName(item)}
                  </TableCell>
                  <TableCell align="left" sx={tableData}>
                    {item?.email}
                  </TableCell>
                  <TableCell align="left" sx={tableData}>
                    {item?.company?.name}
                  </TableCell>
                  <TableCell align="center" sx={tableData} className="address-width">
                    {item?.login_as}
                  </TableCell>
                  <TableCell align="center" sx={tableData}>
                    {formatDate(item?.createdAt)}
                  </TableCell>
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
                <EmptyTable colSpan={8} />
                // <TableRow>
                //   <TableCell align="center" sx={tableData} colSpan={8}>
                //     No records found
                //   </TableCell>
                // </TableRow>
              }
            </TableBody>
            <TableFooter>
              <TableRow >
                <TablePagination
                  align="right"
                  rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
                  sx={{mr : 4}}
                  colSpan={8}
                  count={users.length}
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
      </Box>
      <Dialog open={open} onClose={handleClose} fullWidth={true}>
        <DialogTitle sx={{ mb: 4 , textAlign :"center" }}>{action === 'add' ? 'Add' : 'Remove'} Client</DialogTitle>
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
          <FormControl sx={{  minWidth : '97%' }}>
            <TextField 
              id="address" 
              label="Address" 
              variant="outlined" 
              type="text" 
              value={person.address}
              error={person.addressError}
              onChange={(data) => {
                setPerson(prevState => ({
                    ...prevState,
                    address: data.target.value,
                }))
              }}
              fullWidth
            />
          </FormControl>

           <FormControl sx={{  minWidth : '97%', mt :2 }}>
             <span style={{fontWeight :500, fontSize : 16, marginBottom : 5}}>Sites</span>
             <Select
                value={person.sites}
                error={person.sitesError}
                onChange={(data) => {
                    setPerson(prevState => ({
                        ...prevState,
                        sites : data,
                    }))
                }}
                isMulti={multiple}
                name="permissions"
                className="basic-multi-select"
                classNamePrefix="select"
   
                options={sites}
                style={{zIndex :1000}}
              />
          </FormControl>

          </Box>
        </DialogContent>
        <DialogActions sx={{mb : 2 , mx : 4}}>
          <Button onClick={handleSubmit} variant="contained">{action === 'add' ? 'Submit' : 'Remove'}</Button>
          <Button onClick={handleClose} variant="outlined">Cancel</Button>
        </DialogActions>
      </Dialog>


    </Box>
  );
}
