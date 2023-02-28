import React, {useEffect, useState} from "react";
import { Box, FormControl, Button, Link} from "@mui/material";
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
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { toast } from 'react-toastify';
import "./style.css";
import { formatDate, validation,tableHeader,tableData } from "../../utils";
import Loader from "../../common/Loader";
import EmptyTable from "../../common/EmptyTable";

export default function Vendor() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState('');
  const [editId, setEditId] = useState('');
  const [action, setAction] = useState('');
  const [show, setShow] = useState(false);
  const [loader, setLoader] = useState(false);
  const [vendors, setVendors] = useState([]);
  const [countries, setCountries] = useState([])
  const [cities, setCities] = useState([])
  const [roles, setRoles] = useState([])
  const [company, setCompany] = useState([])
  const [page, setPage] = useState(0)

  const toastObj = {position: toast.POSITION.TOP_CENTER};
  const [person, setPerson] = useState({
    name :'',
    email :'',
    phone :'',
    countryId :'',
    cityId:'',
    address:'',
    role:'',
    company:'',
    nameError : false,
    emailError : false,
    phoneError : false,
    countryIdError : false,
    cityIdError :false,
    addressError : false,
    roleError : false
  })
  

  useEffect(() => {
    getVendors();
    getCountries();
    getRoles();
    getCompany();
  },[]);



  const getVendors = async () => {
    setLoader(true)
    let data = await getAPI('/vendors');
    if(data) {
        setVendors(data)
    }
    setLoader(false)
  }

  const getCities = async(cityId) => {
    setLoader(true)
    const data = await getAPI(`/cities/by-country/${cityId}`);
    if(data){
        setCities(data)
    }
    setLoader(false)
  }

  const getRoles = async () => {
    setLoader(true)
    const data = await getAPI('/adm/roles');
    if(data){
      setRoles(data)
    }
    setLoader(false)
  }
  const getCompany = async () => {
    setLoader(true)
    const data = await getAPI('/companies');
    
    if(data){
      setCompany(data)
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

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const [perPages, setPerPages] = useState([10,25, 50]);
  const [perPage, setPerPage] = useState(10)

  const handleChangeRowsPerPage = (event) => {
    console.log(event.target.value)
    setPerPage(event.target.value)
    setPage(0);
  };
  const addVendor = (e) => {
    e.preventDefault();
    setAction('add');
    clearAll();
    setOpen(true)
  }

  const editVendor = (e, id) => {
    e.preventDefault();
    setEditId(id)
    clearAll();
    let data = vendors.filter(item => item.id === id)[0];
    setPerson(prevState => ({
        ...prevState,
        name : data?.name,
        email : data?.email,
        phone : data?.phone?.toString(),
        countryId : data?.countryId._id,
        cityId: data?.cityId._id,
        address: data?.address,
        role: data?.roleId?._id,
        company: data?.companyId?._id,
        nameError : false,
        emailError : false,
        passwordError : false,
        countryIdError : false,
        cityIdError :false,
        addressError : false,
        roleError : false
    }))

    getCities(data?.countryId?._id)
    setAction('edit');
    setOpen(true)
  }

  const deleteVendor = (id) => {
    setEditId(id);
    clearAll();
    setShow(true);
  }

  const clearAll = () => {
    setPerson({
        name :'',
        email :'',
        phone :'',
        countryId : '',
        cityId :'',
        address : '',
        role:'',
        company:'',
        nameError : false,
        emailError : false,
        phoneError : false,
        companyError: false,
        countryIdError : false,
        cityIdError :false,
        addressError : false,
        roleError : false
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
        nameError: false,
        emailError : false,
        phoneError : false,
        countryIdError : false,
        cityIdError :false,
        addressError : false,
        roleError : false,
        companyError: false
    }))

    if(validation(null, 'Name', person.name)){
        setPerson(prevState => ({
            ...prevState,
            nameError: true,
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
    else if(validation('empty', 'Role', person.role)){
      setPerson(prevState => ({
          ...prevState,
          roleError: true,
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
    else if(validation('phone', 'Phone', person.phone)){
        setPerson(prevState => ({
            ...prevState,
            phoneError: true,
        }))
        return;
    }
    
    else if(validation('empty', 'Country', person.countryId)){
        setPerson(prevState => ({
            ...prevState,
            countryIdError: true,
        }))
        return;
    }
    else if(validation('empty', 'City', person.cityId)){
        setPerson(prevState => ({
            ...prevState,
            cityIdError: true,
        }))
        return;
    }
    else if(validation('long', 'Address', person.address)){
        setPerson(prevState => ({
            ...prevState,
            addressError: true,
        }))
        return;
    }

    let payload = {
        name : person?.name,
        email :person?.email,
        phone : person?.phone,
        roleId : person?.role,
        companyId:person?.company,
        countryId : person?.countryId,
        cityId : person?.cityId,
        address : person?.address
    }


    if(action === 'add'){
       setLoader(true)
    
       let data = await postAPI('/vendors', payload)
       if(data){
        getVendors()
        setOpen(false)
        setShow(false)
       }
       else if(responseCheck(data)){
        toast.success(data.message,toastObj);
        return data;
        }
        else{
          toast.error(data.message,toastObj);
          return false;
        }
       setLoader(false)
    }
    else if (action === 'edit'){
        setLoader(true)
        let data = await patchAPI(`/vendors/${editId}`, payload)
        if(data){
         getVendors()
         setOpen(false)
        }
        setLoader(false)
     }
  }
  const responseCheck = (res) => {
   
    if(res.status === 200 || res.status === 201 || res.status === 204){
        return true;
    }
    else{
        return false;
    }
}
  const handleDelete = async() => {
    setLoader(true);
    let process = await deleteAPI(`/vendors/${editId}`);
    setLoader(false);
    if(process){
      getVendors();
      setShow(false) 
    }
  }

  return (
    <Box sx={{ height: "inherit" }}>
      <Loader loader={loader} />
      <PageTitle title="Specimax" subTitle="Vendors" />
      <Box
        display="flex"
        justifyContent="flex-end"
        alignItems="flex-end"
        sx={{mx : 2}}
        >
        <Button variant="contained" style={{backgroundColor : "grey"}} sx={{ height: 50 }} onClick={addVendor}>
          <AddCircleIcon /> &nbsp; &nbsp;
            Add Vendor
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
                  Vendor 
                </TableCell>
                <TableCell align="left" component="th" sx={tableHeader}>
                  Email
                </TableCell>
                <TableCell align="left" component="th" sx={tableHeader}>
                  Role
                </TableCell>
                
                <TableCell align="center" component="th" sx={tableHeader}>
                  Country
                </TableCell>
                <TableCell align="center" component="th" sx={tableHeader}>
                  City
                </TableCell>
                <TableCell align="center" component="th" sx={tableHeader}>
                  Phone
                </TableCell>
                <TableCell align="center" component="th" sx={tableHeader}>
                  Address
                </TableCell>
                <TableCell align="center" component="th" sx={tableHeader}>
                  Created At
                </TableCell>
                <TableCell align="center" component="th" sx={tableHeader} >
                  Action
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {vendors.slice(page * perPage, page * perPage + perPage).map((item, index) => (
                <TableRow key={index}>
                  <TableCell align="left" sx={tableData}>
                    <Link underline="none" href={`/vendor/${item.id}/clients`} className="pointer">
                     {item?.name}
                    </Link>
                  </TableCell>
                  <TableCell align="left" sx={tableData}>
                    {item?.email}
                  </TableCell>
                  <TableCell align="left" sx={tableData}>
                    {item?.roleId?.name}
                  </TableCell>
                  <TableCell align="center" sx={tableData}>
                    {item.countryId?.name}
                  </TableCell>
                  <TableCell align="center" sx={tableData}>
                    {item?.cityId?.name}
                  </TableCell>
                  <TableCell align="center" sx={tableData}>
                    {item?.phone}
                  </TableCell>
                  <TableCell align="center" sx={tableData} className="address-width">
                    {item?.address}
                  </TableCell>
                  <TableCell align="center" sx={tableData}>
                    {formatDate(item?.createdAt)}
                  </TableCell>
                  <TableCell align="center" className="action-div" sx={{textAlign : 'center'}}>
                    <Button size="small"  className="btn-div" variant="outlined" color="info" onClick={(e) => editVendor(e, item?.id)}>
                      <EditIcon className="btn"  />
                    </Button>
                    <Button size="small"  className="btn-div" variant="outlined" color="error" onClick={() => deleteVendor(item?.id)}>
                      <DeleteIcon className="btn" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {
                vendors.length === 0 &&
                <EmptyTable colSpan={9} />
              }
            </TableBody>
            <TableFooter>
              <TableRow >
                {/* <TablePagination
                  align="right"
                  rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
                  sx={{mr : 4}}
                  colSpan={9}
                  count={vendors.length}
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
                /> */}
                <TablePagination
                    align="right"
                    rowsPerPageOptions={perPages}
                    colSpan={9}
                    count={vendors.length}
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
        <DialogTitle sx={{ mb: 4 , textAlign :"center" }}>{action === 'add' ? 'Add' : 'Edit'} Vendor</DialogTitle>
        <DialogContent>
          <Box
            component="form"
            sx={{
              '& .MuiTextField-root': { my: 2, width: '100%' },
            }}action
            noValidate
            autoComplete="off"
          >
        
          <FormControl sx={{  minWidth : '97%', mx : 0, px :0 }}>
            <TextField 
              id="name" 
              label="Name" 
              variant="outlined" 
              type="text" 
              value={person.name}
              error={person.nameError}
              onChange={(data) => {
                setPerson(prevState => ({
                    ...prevState,
                    name: data.target.value,
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
            <InputLabel id="role-label">Role</InputLabel>
            <Select
              labelId="role-label"
              id="role"
              value={person.role}
              label="Role"
              error={person.roleError}
              onChange={(data) => {
                  setPerson(prevState => ({
                      ...prevState,
                      role : data.target.value,
                  }))
                  getCities(data.target.value);
              }}
            >
              
              {
                roles.map((item,index) => (
                    <MenuItem value={item.id} key={index}>{item.name}</MenuItem>
                ))
              }
            </Select>
          </FormControl>

          <FormControl  sx={{  minWidth : '97%', mt : 2 }}>
            <InputLabel id="role-label">Company</InputLabel>
            <Select
              labelId="company-label"
              id="company"
              value={person.company}
              label="Company"
              error={person.companyError}
              onChange={(data) => {
                  setPerson(prevState => ({
                      ...prevState,
                      company : data.target.value,
                  }))
                  getCities(data.target.value);
              }}
            >
              {
                company.map((item,index) => (
                    <MenuItem value={item.id} key={index}>{item.name}</MenuItem>
                ))
              }
            </Select>
          </FormControl>


          <FormControl sx={{  minWidth : '97%' }}>
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
          </FormControl>

          <FormControl  sx={{  minWidth : '97%', mt : 2 }}>
            <InputLabel id="country-label">Country</InputLabel>
            <Select
              labelId="country-label"
              id="country"action
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
            </Select>
          </FormControl>

          <FormControl  sx={{  minWidth : '97%', mt :4 }}>
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
          </FormControl>

          <FormControl sx={{  minWidth : '97%', mt :2 }}>
            <TextField 
              id="address" 
              label="Address" 
              variant="outlined" 
              type="address" 
              error={person.addressError}
              value={person.address}
              multiline={true}
              rows={3}
              onChange={(data) => {
                setPerson(prevState => ({
                    ...prevState,
                    address: data.target.value,
                }))
              }}
              fullWidth
            />
          </FormControl>
    
          </Box>
        </DialogContent>
        <DialogActions sx={{mb : 2 , mx : 4}}>
          <Button onClick={handleSubmit} variant="contained">{action === 'add' ? 'Submit' : 'Update'}</Button>
          <Button onClick={handleClose} variant="outlined">Cancel</Button>
        </DialogActions>
      </Dialog>

      {/* delete Modal */}
      <Dialog open={show} onClose={handleShowClose} fullWidth={true}>
        <DialogTitle sx={{ mb: 4 , textAlign :"center" }}>Delete Company</DialogTitle>
        <DialogContent>
          <Box
            component="form"
            sx={{
              '& .MuiTextField-root': { my: 2, width: '100%' },
            }}
            noValidate
            autoComplete="off"
          >
            <h3 style={{textAlign : 'center', fontWeight :'bold'}}>Do you want's to delete this vendor </h3>
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
