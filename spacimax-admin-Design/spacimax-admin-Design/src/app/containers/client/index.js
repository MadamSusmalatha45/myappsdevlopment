import React, { useEffect, useState } from "react";
import { Alert, Box, Link, Skeleton,  Button, Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid, TextField, FormControl } from "@mui/material";
  import Select from 'react-select'
  import InputLabel from '@mui/material/InputLabel';
  import MenuItem from '@mui/material/MenuItem';
  import { Select as Choice }  from '@mui/material';
import PageTitle from "../../common/PageTitle";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import TableHead from "@mui/material/TableHead";
// import { blue } from '@mui/material/colors';
import { Controller, useForm } from "react-hook-form";
import { red } from "@mui/material/colors";
import "./style.css";
import { selectGuards } from "../../../features/sites/sitesSlice";
import { getSiteTeam,getGuards, addSiteTeam } from "../../../features/sites/sitesAPI";
import { useParams } from "react-router-dom";
import { getAPI, postAPI } from "../../network";
import Loader from "../../common/Loader";
import EmptyTable from "../../common/EmptyTable";
import { checkAuthority,tableHeader,tableData, validation, fullName} from "../../utils";
import TableFooter from '@mui/material/TableFooter';
import TablePagination from '@mui/material/TablePagination';


export default function Person() {
  const [open, setOpen] = React.useState(false);
  const [loader, setLoader] = useState(false)
  const [filtered, setfiltered] = useState([]);
  const [allUsers, setAllUsers] = useState([])
  const [countries, setCountries] = useState([])
  const [cities, setCities] = useState([])
  const [users, setUsers] = useState([]);
  const [input, setInput] = useState('');
  const [action, setAction] = useState('');
  const permissions = localStorage.getItem('permissions')
  const [genders, setGenders] = useState([
    {id : 1, label :'Male', value :'male'},
    {id : 2, label :'Female', value :'female'},
    {id : 3, label :'Prefer not to say ', value :'Prefernottosay '}
  ])
  const styleInfo = {
    padding:'10px',
    marginLeft:"10px"
  } 
  const [perPages, setPerPages] = useState([10,25, 50,70]);
  const [perPage, setPerPage] = useState(10)
  const [page, setPage] = useState(0)
  const { siteId } = useParams();

  const [person, setPerson] = useState({
    firstname :'',
    lastname :'',
    email :'',
    userAs:'',
    gender:'',
    country:'',
    phone:'',
    city : '',
    postcode:'',
    firstnameError : false,
    lastnameError : false,
    emailError : false,
    phoneError : false,
    genderError : false,
    countryError : false,
    userAsError : false,
    postcodeError : false,
    cityError : false
  })
 

  const getGuards = async() => {
    setLoader(true)
    let data = await getAPI(`/admin/guards`)   
 
    
    setAllUsers(data);
    setUsers(data)
    setLoader(false)
  }
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    console.log(event.target.value)
    setPerPage(event.target.value)
    setPage(0);
  };

  const getCountries = async() => {
    setLoader(true)
    const data = await getAPI('/countries');
    if(data){
        setCountries(data)
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

  const updateInput = async (input) => {
    console.log("length----",input.length)
   
    if(input!==null && input.length>=1){
      const filtered = allUsers.filter(user => {
        return user.firstname.toLowerCase().includes(input.toLowerCase())
       })
    console.log("filtered------",filtered)
    
    setUsers(filtered);
    }
    else if(input.length===0 && input===null){
      getGuards()
    }
    
    setInput(input);
    
 }

  useEffect(() => {
    getGuards()
    updateInput()
    getCities()
    getCountries()
  }, []);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };


  // const editUser = (e, id) => {
  //   e.preventDefault();
  //   setEditId(id)
  //   clearAll();


  //   let data = users.filter(item => item._id === id)[0];
  //   let siteChoices = sites.filter((item) => {
  //       if(data.sites.includes(item.id)){
  //           return item;
  //       }
  //   })    
 

  //   setPerson(prevState => ({
  //       ...prevState,
  //       firstname : data?.firstname,
  //       lastname : data?.lastname,
  //       email : data?.email,
  //       password:data?.password,
  //       sites : siteChoices,
  //       vendor : data?.vendor?._id,
  //       company : data?.company,
  //       roles: data?.roleId?._id,
  //       firstnameError : false,
  //       lastnameError : false,
  //       vendorError : false,
  //       emailError : false,
  //       sitesError : false
  //       // roleError : false
  //   }))

  //   // getCities(data.countryId._id)
  //   setAction('edit');
  //   setOpen(true)
  // }

  const clearAll = () => {
    setPerson({
      firstname :'',
      lastname :'',
      email :'',
      userAs:'',
      gender:'',
      country:'',
      phone:'',
      city : '',
      postcode:'',
      firstnameError : false,
      lastnameError : false,
      emailError : false,
      phoneError : false,
      genderError : false,
      countryError : false,
      userAsError : false,
      postcodeError : false,
      cityError : false
      })
  }
  const addUser = (e) => {
    e.preventDefault();
    setAction('add');
    clearAll();
    setOpen(true)
  }

  const handleSubmit = async(e) => {
    e.preventDefault();
    setAction("Add")
    setPerson(prevState => ({
        ...prevState,
        firstnameError : false,
        lastnameError : false,
        emailError : false,
        phoneError : false,
        genderError : false,
        countryError : false,
        userAsError : false,
        postcodeError : false,
        cityError : false
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
    else if(validation('mobile', 'phone', person.phone)){
        setPerson(prevState => ({
            ...prevState,
            phoneError: true,
        }))
        return;
    }
    else if(validation('empty', 'Password', person.password)){
        setPerson(prevState => ({
            ...prevState,
            passwordError: true,
        }))
        return;
    }
    else if(validation('empty', 'Gender', person.gender)){
      setPerson(prevState => ({
          ...prevState,
          genderError: true,
      }))
      return;
  }
    else if(validation('empty', 'Country', person.country)){
      setPerson(prevState => ({
          ...prevState,
          countryError: true,
      }))
      return;
    }
    
  else if(validation('empty', 'Postcode', person.postcode)){
    setPerson(prevState => ({
        ...prevState,
        postcodeError: true,
    }))
    return;
}

// var ids = person.sites.map((item) => {
//   return item.value
// });

let payload = {
    firstname : person.firstname,
    lastname : person.lastname,
    email :person.email,
    gender: person.gender,
    phone:person.phone,
    country:person.country,
    postcode:person.postcode,
    password:person.password,
    company : person.company,
    // sites : ids
}
  
if(action === 'add'){
  setLoader(true)
  let data = await postAPI('/admin/guards', payload)
  if(data){
    getGuards()
   setOpen(false)
  }
  setLoader(false)
}
else{
   setLoader(true)
   let data = await 
  //  (`/admin/guards/${editId}`, formData)
  //  if(data){
  //   getGuards()
  //   setOpen(false)
  //  }
   setLoader(false)
}
}

  // const onSubmit = async(form) => {
  //   setLoader(true)
  //   let data = await postAPI(`/sites/add-member/${siteId}`, )
  //   if(data){
  //     getGuards()
  //     handleClose();
   
  //   }
  //   setLoader(false)
  // };
 
  return (
    <Box sx={{ height: "inherit" }}>
      <Loader loader={loader} />
      <PageTitle
        title="Secuber All Resources"
      />
     
    <input 
     style={styleInfo}
     key="random1" 
     type={"text"}
     placeholder={"Search by Name.."}
     onChange={(e) =>{ 
      updateInput(e.target.value)
    }}
     
    />
       <Box
        display="flex"
        justifyContent="flex-end"
        alignItems="flex-end"
        sx={{mx : 2}}
        >
        <Button variant="contained" style={{backgroundColor : "grey"}} sx={{ height: 50 }} onClick={addUser}>
          <AddCircleIcon /> &nbsp; &nbsp;
            Add Resource
        </Button>
      </Box>
      <Box display="flex" sx={{ my: "3rem",mt:"2rem" }}>

        {
          checkAuthority('VIEW_GUARDS')  &&
          <TableContainer component={Paper} sx={{ mx: "0.8rem" }}>
          {/* <div style={{width: 'auto', overflowX: 'scroll'}}> */}
          
          <Table
            sx={{ minWidth: "auto" }}
            aria-label="custom pagination table"
            className="responsive-table"
          >
            <TableHead>
              <TableRow className="table-header">
                <TableCell align="left" component="th" sx={tableHeader}>
                  Name
                </TableCell>
                <TableCell align="left" component="th" sx={tableHeader}>
                  Email
                </TableCell>
                <TableCell align="left" component="th" sx={tableHeader}>
                  Contact
                </TableCell>
                <TableCell align="left" component="th" sx={tableHeader}>
                  Country
                </TableCell>
                <TableCell align="left" component="th" sx={tableHeader}>
                  Postcode
                </TableCell>
                <TableCell align="left" component="th" sx={tableHeader}>
                  User As
                </TableCell>
                <TableCell
                  align="center"
                  component="th"
                  sx={tableHeader}
                  style={{ width: "10%" }}
                >
                  Profile
                </TableCell>
                <TableCell
                  align="center"
                  component="th"
                  sx={tableHeader}
                  style={{ width: "10%" }}
                >
                  Licenses
                </TableCell>
              </TableRow>
            </TableHead>
{/* {console.log("Users---",users)} */}
            <TableBody>
              {
              users.slice(page * perPage, page * perPage + perPage).map((item, index) => (
                <TableRow key={index}>
                  <TableCell align="left" sx={tableData}>
                    {fullName(item)}
                  </TableCell>
                  <TableCell align="left" sx={tableData}>
                    {item.email}
                  </TableCell>
                  <TableCell align="left" sx={tableData}>
                    {item.phone}
                  </TableCell>
                  <TableCell align="left" sx={tableData}>
                    {item.country?.name}
                  </TableCell>
                  <TableCell align="left" sx={tableData}>
                    {item.postcode}
                  </TableCell>
                  <TableCell align="left" sx={tableData}>
                    {item.login_as}
                  </TableCell>
                  <TableCell align="center" sx={tableData}>
                    <Link href={`/user/profile/${item?._id}`} underline="none">
                      {"View"}
                    </Link>
                  </TableCell>
                  <TableCell align="center" sx={tableData}>
                    <Link href={`/user/license/${item?._id}`} underline="none">
                      {"View"}
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
              {
                users.length === 0 && 
                <EmptyTable colSpan={7} />
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
          {/* </div> */}
        </TableContainer>
        }
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle style={{height:"60px"}}> Add Resource</DialogTitle>
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
              label="First Name" 
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
           <FormControl sx={{  minWidth : '97%' }}>
            <TextField 
              id="phone" 
              label="Phone" 
              variant="outlined" 
              type="text" 
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
            <Choice
              labelId="country-label"
              id="country"
              value={person.country}
              label="Country"
              error={person.countryIdError}  
              onChange={(data) => {
                  setPerson(prevState => ({
                      ...prevState,
                      country : data.target.value,
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
          </FormControl>

          {/* <FormControl  sx={{  minWidth : '97%', mt :4 }}>
            <InputLabel id="city-label">CIty</InputLabel>
            <Choice
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
            </Choice> */}
          {/* </FormControl> */}
          <FormControl  sx={{  minWidth : '97%', mt :4 }}>
            <InputLabel id="gender-label">Gender</InputLabel>
            <Choice
              labelId="gender-label"
              id="gender"
              value={person.gender}
              error={person.genderError}
              label="gender"
              onChange={(data) => {
                  setPerson(prevState => ({
                      ...prevState,
                      gender : data.target.value,
                  }))
              }}
            >
              {
                genders.map((item,index) => (
                    <MenuItem value={item.value} key={index}>{item.label}</MenuItem>
                ))
              }
            </Choice>
          </FormControl>
          
          <FormControl sx={{  minWidth : '97%', mt :2 }}>
            <TextField 
              id="postcode" 
              label="postcode" 
              variant="outlined" 
              type="text" 
              error={person.postcodeError}
              value={person.postcode}
              onChange={(data) => {
                setPerson(prevState => ({
                    ...prevState,
                    postcode: data.target.value,
                }))
              }}
              fullWidth
            />
          </FormControl>

          <FormControl  sx={{  minWidth : '97%', mt :4 }}>
            <InputLabel id="userAs-label">Login As</InputLabel>
            <Choice
              labelId="userAs-label"
              id="userAs"
              value={person.userAs}
              error={person.userAsError}
              label="Login As"
              onChange={(data) => {
                  setPerson(prevState => ({
                      ...prevState,
                      userAs : data.target.value,
                  }))
              }}
            >
              <MenuItem value={"Gaurd"} >Gaurd</MenuItem>
              <MenuItem value={"Cleanser"} >Cleanser</MenuItem>
             
              
            </Choice>
          </FormControl>
        </Box>
          </DialogContent>
          <DialogActions>
            <Grid
              container
              spacing={2}
              justifyContent="center"
              my={3}
              component="form"
            >
              <Grid item xs={7} justifyContent="space-around" display="flex">
                <Button
                  disabled={false}
                  color="secondary"
                  onClick={handleClose}
                >
                  Cancel
                </Button>
                <Button disabled={false} onClick={handleSubmit}>
                  Add
                </Button>
              </Grid>
            </Grid>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
}
