import React, {useEffect, useState} from "react";
import { Box, FormControl, Grid, Link,  FormLabel, Modal, Typography, Button} from "@mui/material";
import PageTitle from "../../common/PageTitle";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import { Controller, useForm } from "react-hook-form";
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
import CircularProgress from '@mui/material/CircularProgress';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import BasicSelector from "../../common/Selector";

import { checkAuthority, formatDate, validation,tableHeader,tableData,tablebtn} from "../../utils";
import Loader from "../../common/Loader";
import EmptyTable from "../../common/EmptyTable";
import { Security } from "@material-ui/icons";

export default function Company() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState('');
  const [type,setType]=useState("");
  const [typeError,setTypeError]=useState(false);
  const [editId, setEditId] = useState('');
  const [action, setAction] = useState('');
  const [show, setShow] = useState(false);
  const [loader, setLoader] = useState(false);
  const [countries, setCountries] = useState([])
  const [cities, setCities] = useState([])
  const [companies, setCompanies] = useState([]);
  const [person, setPerson] = useState({
    name :'',
    country :'',
    state:'',
    type:'',
    nameError : false,
    countryError : false,
    stateError :false
  })
 

  useEffect(() => {
    getCompanies();
    getCountries();
    getCities();
  },[]);

  const getCompanies = async () => {
    setLoader(true)
    let data = await getAPI('/getlicense');
    if(data) {
        setCompanies(data)
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

  const alltypes=[
    {type:"Security"},
    {type:"Other"},

  ]
  const getCountries = async() => {
    setLoader(true)
    const data = await getAPI('/countries');
    if(data){
        setCountries(data)
    }
    setLoader(false)
  }

  const handleChangePage = () => {};

  const handleChangeRowsPerPage = () => {};

  const TablePaginationActions = () => {};


  const addLicense = (e) => {
    e.preventDefault();
    setAction('add');
    clearAll();
    setOpen(true)
  }

  const editlicense = (e, id) => {

    e.preventDefault();
    setEditId(id)
    clearAll();
    let data = companies.filter(item => item.id === id)[0];
    setPerson(prevState => ({
        ...prevState,
        name : data?.name,
        country : data?.country,
        state: data?.state,
        type:data?.type,
        nameError : false,
        countryError : false,
        stateError :false
    }))

    // console.log(person)

    // getCities(data.country)
    setAction('edit');
    setOpen(true)
   
  }

  const deleteCompany = (id) => {
  
    setEditId(id);
    clearAll();
    setShow(true);
  }

  const clearAll = () => {
    setPerson({
        name :'',
        country: '',
        state :'',
        type:'',
        nameError : false,
        countryError : false,
        stateError :false
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
        countryError : false,
        stateError :false,
        typeError :false,
    }))

    if(validation(null, 'Name', person.name)){
        setPerson(prevState => ({
            nameError: true,
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
    else if(validation('empty', 'State', person.state)){
        setPerson(prevState => ({
            ...prevState,
            stateError: true,
        }))
        return;
    }
    else if(validation('empty', 'Type', person.type)){
      setPerson(prevState => ({
          ...prevState,
          typeError: true,
      }))
      return;
  }
    


    let payload = {
        name : person.name,
        country : person.country,
        state : person.state,
        type : person.type,
    }


    if(action === 'add'){
       setLoader(true)
       let data = await postAPI('/getlicense', payload)
      //  console.log(data,"data")
       if(data){
        getCompanies()
        setOpen(false)
       }
       setLoader(false)
    }
    else{
        setLoader(true)
        let data = await patchAPI(`/getlicense/${editId}`, payload)
        if(data){
         getCompanies()
         setOpen(false)
        }
        setLoader(false)
     }
  }

  const handleDelete = async() => {
    setLoader(true);
    let process = await deleteAPI(`/getlicense/${editId}`);
    setLoader(false);
    if(process){
      getCompanies();
      setShow(false)
    }
  }

  return (
    <Box sx={{ height: "inherit" }}>
      <Loader loader={loader} />
      <PageTitle title="Secuber" subTitle="License" />
      {
        checkAuthority('ADD_COMPANY')  &&
        <Box
            display="flex"
            justifyContent="flex-end"
            alignItems="flex-end"
            sx={{mx : 2}}
        >
            <Button variant="contained" style={{backgroundColor : "grey"}} sx={{ height: 50 }} onClick={addLicense}>
              <AddCircleIcon /> &nbsp; &nbsp;
            Add License
            </Button>
        </Box> 
      }
      {
        checkAuthority('VIEW_COMPANIES') &&
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
                  License Name
                </TableCell>
                <TableCell align="center" component="th" sx={tableHeader}>
                  Country
                </TableCell>
                <TableCell align="center" component="th" sx={tableHeader}>
                 City
                </TableCell>
                <TableCell align="center" component="th" sx={tableHeader}>
                  Type
                </TableCell>
                
                <TableCell align="center" component="th" sx={tableHeader} >
                  Action
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {companies.map((item, index) => (
                <TableRow key={index}>
                  <TableCell align="left" sx={tableData}>
                    <Link to="#" underline="none" className="link-hover">
                     {item.name}
                    </Link>
                  </TableCell>
                  <TableCell align="center" sx={tableData}>
                    {item.country?.name}
                  </TableCell>
                  <TableCell align="center" sx={tableData}>
                    {item.state?.name}
                  </TableCell>
                  <TableCell align="center" sx={tableData}>
                    {item.type}
                  </TableCell>
      
                  <TableCell align="center" sx={tablebtn}>
                    {
                      checkAuthority('EDIT_LICENSE') &&
                      <Button variant="outlined" className="btn-div" color="info" sx={{mx : 1}} onClick={(e) => editlicense(e,item?.id)}>
                        <EditIcon className="btn"/>
                      </Button>
                    }
                    {
                      checkAuthority('DELETE_LICENSE') &&
                      <Button variant="outlined"  className="btn-div" color="error" onClick={() => deleteCompany(item?.id)}>
                        <DeleteIcon className="btn"/>
                      </Button>
                    }
                  </TableCell>
                  
                </TableRow>
              ))}
              {
                companies.length === 0 &&
                <EmptyTable colSpan={7} />
              }


            </TableBody>
            <TableFooter>
              <TableRow>
                <TablePagination
                  align="right"
                  rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
                  colSpan={5}
                  count={companies.length}
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
      }
      <Dialog open={open} onClose={handleClose} fullWidth={true}>
        <DialogTitle sx={{ mb: 4 , textAlign :"center" }}>{action === 'add' ? 'Add' : 'Edit'} License</DialogTitle>
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
              id="name" 
              label="License Name" 
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
          <FormControl  sx={{  minWidth : '100%', mt : 1 }}>
            <InputLabel id="country-label">Country</InputLabel>
            <Select
                labelId="country-label"
                id="country"
                value={person.country}
                label="Country"
                error={person.countryError}
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
            </Select>
          </FormControl>
        

          <FormControl  sx={{  minWidth : '100%', mt : 2 }}>
            <InputLabel id="city-label">State</InputLabel>
            <Select
                labelId="city-label"
                id="city"
                value={person.state}
                label="City"
                error={person.stateError}
                onChange={(data) => {
                    setPerson(prevState => ({
                        ...prevState,
                        state : data.target.value,
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
            <Select
              value={person.type}
              onChange={(data) => {
                setPerson(prevState => ({
                    ...prevState,
                    type: data.target.value,
                }))
              }}
              displayEmpty
              inputProps={{ "aria-label": "Without label"}}
            >
              <MenuItem value="">
                Type
              </MenuItem>
              {alltypes.map((item, index) => (
                <MenuItem value={item.type} key={index}>
                  {item.type}
                </MenuItem>
              ))}
            </Select>
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
        <DialogTitle sx={{ mb: 4 , textAlign :"center" }}>Delete License</DialogTitle>
        
        <DialogContent>
          <Box
            component="form"
            sx={{
              '& .MuiTextField-root': { my: 2, width: '100%' },
            }}
            noValidate
            autoComplete="off"
          >

            <h3 style={{textAlign : 'left', fontWeight :'bold'}}>Do you want's to delete this license </h3>
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
