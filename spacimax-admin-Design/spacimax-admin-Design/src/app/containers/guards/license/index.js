import React, { useEffect, useState } from "react";
import {  Box,  Skeleton,  Button, Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid, Typography, FormControl} from "@mui/material";
  import { toast } from "react-toastify";
import PageTitle from "../../../common/PageTitle";
import { TextField } from "@mui/material";
import { red } from "@mui/material/colors";
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { BASE_URL } from "../../../../constant";

import "./style.css";
import { SettingsPhoneTwoTone, SettingsSystemDaydreamSharp } from "@material-ui/icons";
import { useParams } from 'react-router-dom';
import Loader from "../../../common/Loader";
import { deleteAPI, getAPI, patchAPI, postAPI, getExportPdfAPI } from "../../../network";
import { checkImage, formatDate, formatDatePost, validation } from "../../../utils";
import ViewMedia from "../../../common/ViewMedia";


export default function License() {
  const [loader, setLoader] = useState(false);
  const [open, setOpen] = React.useState(false);
  const [show, setShow] = React.useState(false);
  const [licenses, setLicenses] = useState([])
  const [countries, setCountries] = useState([]);
  const [action, setAction] = useState('add')
  const [states, setStates] = useState([])
  const [editId, setEditId] = useState(0)
  const [state, setState] = useState('')
  const [stateError, setStateError] = useState(false)
  const [code, setCode] = useState('')
  const [names, setNames] = useState([])
  const [showMedia, setShowMedia] = useState(false)
  const [url, setUrl] = useState('')
  const { id } = useParams();

  const [license, setLicense] = useState({
    licenseName : '',
    licenseNumber : '',
    issuingAuthority : '',
    country :'',
    state : '',
    expiryDate : null,
    picture : null,
    licenseNameError : false,
    licenseNumberError : false,
    issuingAuthorityError : false,
    countryError :false,
    stateError : false,
    expiryDateError : false,
    pictureError : false
  })

  useEffect(() => {
    getUserLicenses()
    getCountries()
  }, [id]);

  const getUserLicenses = async() => {
    setLoader(true)
    let data = await getAPI(`/adm/liscense?user=${id}`);
    if(data){
      setLicenses(data)
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

  const getStates = async(countryId) => {
    setLoader(true)
    let code =   countries.filter((item) => item._id === countryId)[0]
    const data = await getAPI(`/states?country=${code.code}`);
    setCode(code.code)
    if(data){
        setStates([...data])
    }
    setLoader(false)
  }

  const getName  =  async(countryId, stateId) => {
    setLoader(true)
    let data = await getAPI(`/getlicense?country=${countryId}&state=${stateId}`)
    if(data){
      setNames(data)
    }
    setLoader(false)
  }

  const handleClickOpen = () => {
    setLicense({
      licenseName : '',
      licenseNumber : '',
      issuingAuthority : '',
      country :'',
      state : '',
      expiryDate : null,
      picture : null,
      licenseNameError : false,
      licenseNumberError : false,
      issuingAuthorityError : false,
      countryError :false,
      stateError : false,
      expiryDateError : false,
      pictureError : false
    })
  
    setAction('add')
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = async() => {
    setLicense(prevState => ({
      ...prevState,
      licenseNameError : false,
      licenseNumberError : false,
      issuingAuthorityError : false,
      countryError :false,
      stateError : false,
      expiryDateError : false,
      pictureError : false
    }))
    setStateError(false)

    if(validation(null, 'License Name' , license.licenseName)){
      setLicense(prevState => ({
        ...prevState,
        licenseNameError : true,
      }))
      return;
    }
    else if(validation(null, 'License Number' , license.licenseNumber)){
      setLicense(prevState => ({
        ...prevState,
        licenseNumberError : true,
      }))
      return;
    }
    else if(validation(null, 'Issuing Authority' , license.issuingAuthority)){
      setLicense(prevState => ({
        ...prevState,
        issuingAuthorityError : true,
      }))
      return;
    }
    else if(validation('empty', 'Country' , license.country)){
      setLicense(prevState => ({
        ...prevState,
        countryError : true,
      }))
      return;
    }
    else if(validation(null, 'State' , state)){
      setStateError(true)
      return;
    }
    else if(validation('date', 'Expiry Date' , license.expiryDate)){
      setLicense(prevState => ({
        ...prevState,
        expiryDateError : true,
      }))
      return;
    }
    else if(validation('empty', 'Picture' , license.picture)){
      setLicense(prevState => ({
        ...prevState,
        pictureError : true,
      }))
      return;
    }
    else if( license.picture === null ){
      alert("license Require");
    }

    let formData = new FormData();
    formData.append('licenseName', license.licenseName)
    formData.append('licenseNumber', license.licenseNumber)
    formData.append('issuingAuthority', license.issuingAuthority)
    formData.append('country', license.country)
    formData.append('expiryDate', formatDatePost(license.expiryDate))
    formData.append('picture', license.picture)
    formData.append('issuingState', license.state)

    var data = null;
    setLoader(true)
    if(action === 'add'){
      data = await postAPI(`/adm/liscense?user=${id}`, formData);
    }
    else{
      data = await patchAPI(`/adm/liscense/${editId}`, formData);
    }
    if(data){
      getUserLicenses()
      setOpen(false)
    }
    setLoader(false)
  };

  const handleChange = (event) => {
   
  };

  const handledDelete = async() =>{
    setLoader(true)
    let data = await deleteAPI(`adm/liscense/${editId}`)
    if(data) {
      getUserLicenses();
      setShow(false)
    }
    setLoader(false)
  }

  const clickAction = async(action, id) => {
    setEditId(id)
    if(action === 'edit'){
      setAction('edit')
      let data = licenses.filter((item) => item.id === id)[0]
      setLoader(true)
      let code =   countries.filter((item) => item._id === data.country._id)[0]
      setCode(code.code)
      const dataS = await getAPI(`/states?country=${code.code}`);
      var nameId = '';
      var stateId = ''
      if(dataS){
          setLoader(true)
         
          let stateId = dataS.filter((item) => item.isoCode === data.issuingState)[0];
          if(stateId){
            stateId = stateId.name
          }
          console.log("country---",data.licenseName.country)
          console.log("state---",data.licenseName.state)
          let nameApi = await getAPI(`/getlicense?country=${data.licenseName.country}&state=${data.licenseName.state}`)
         
          if(nameApi){
            setNames(nameApi)
            let getData = nameApi.filter((item) => item.id === data.licenseName._id)[0]
            
            if(getData){
              // console.log('RESPONSE',getData)
              nameId = getData.id
              
            }
          }
          setLoader(false)
          setStates(dataS)
      }
      setLoader(false)
      // console.log({
      //   licenseName : nameId,
      //   licenseNumber : data?.licenseNumber,
      //   issuingAuthority : data?.issuingAuthority,
      //   country : data?.country?._id,
      //   expiryDate : data?.expiryDate,
      //   state :stateId
      // })
     
      setLicense(prevState => ({
        ...prevState,
        licenseName : nameId,
        licenseNumber : data?.licenseNumber,
        issuingAuthority : data?.issuingAuthority,
        country : data?.country?._id,
        expiryDate : data?.expiryDate,
        state :data?.issuingState
      }))
      setState(data?.issuingState)

      setOpen(true)
    }
    else{
      setShow(true)
    }  
  }
  const clickDownload = async(id)=>{
    let data = await getExportPdfAPI(`${BASE_URL}/admin/user-license/download/${id}`);
    if(data){
      // window.open(data, "_blank")
      console.log(data,"data-----------")
    }
    
  }

  const card = (item) => {
    return(
      <React.Fragment>
      <CardContent className="card-main">
        <div className="card" >
        
          <div className="block">
            <div className="card-txt-title">License Name</div>
            <div className="card-txt-value">: {item?.licenseName?.name}</div>
          </div>
          <div className="block">
            <div className="card-txt-title">License Number</div>
            <div className="card-txt-value">: {item?.licenseNumber}</div>
          </div>
          <div className="block">
            <div className="card-txt-title">Issuing Authority</div>
            <div className="card-txt-value">: {item?.issuingAuthority}</div>
          </div>
          <div className="block">
            <div className="card-txt-title">Issuing State</div>
            <div className="card-txt-value">: {item?.issuingState}</div>
          </div>
          <div className="block">
            <div className="card-txt-title">Country</div>
            <div className="card-txt-value">: {item?.country?.name}</div>
          </div>
          <div className="block">
            <div className="card-txt-title">Expiry Date</div>
            <div className="card-txt-value">: {item?.expiryDate ?  formatDate(item.expiryDate) : 'NA'}</div>
          </div>
          
        </div>
        <Button variant="outlined" className="editBtn btn-div" color="secondary" onClick={(e) => {
          e.preventDefault()
          clickAction('edit', item.id)
        }}>
          <EditIcon className="btn"/>
        </Button>
        <Button variant="outlined" className="deleteBtn btn-div" color="error" onClick={(e) => {
          clickAction('delete', item.id)
        }}>
          <DeleteIcon className="btn"/>
        </Button>
        <Button variant="outlined" className="downloadeBtn btn-div" color="secondary" onClick={(e) => {
          clickDownload(item.id)
        }}>
       Download
        </Button>

       
        <img src={item.picture} className="license-pic" onClick={() => {
          setUrl(item.picture)
          setEditId(item.id)
          setShowMedia(true)
        }}/>

      {/* <Button  style={{marginLeft : '20px', }}variant="contained">Download</Button> */}
      </CardContent>
     
    </React.Fragment>
    )
  };

  return (
    <Box sx={{ height: "inherit" }}>
      <Loader loader={loader} />
      <PageTitle
        title="User License"
      />
      <Box
        display="flex"
        justifyContent="flex-end"
        alignItems="flex-end"
        sx={{mx : 2}}
      >
        <Button variant="contained" style={{backgroundColor : "grey"}} sx={{ height: 50 }} onClick={handleClickOpen}>
          <AddCircleIcon /> &nbsp;&nbsp;
           Add License
        </Button>
      </Box>
      <Box display="flex" >
           <Grid
              container
              spacing={2}
              justifyContent="center"
              my={3}
              component="form"
            >
              {
                licenses.map((item, index) => (
                  <Grid item xs={4} justifyContent="center" key={index}>
                    <Card variant="outlined">{card(item)}</Card>
                  </Grid>
                ))
              }
             
            </Grid>
      </Box>
      <Box display="flex" sx={{ my: "3rem" }}>
        
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle style={{height:"60px"}} align="center">{action === 'add' ? 'Add' : 'Edit'} License</DialogTitle>
          <DialogContent>
            <Box container>
              
              <FormControl fullWidth sx={{py : 1, mt : 6}}>
                 <TextField id="outlined-basic" label="License Number" variant="outlined" 
                  error={license.licenseNumberError}
                  value={license.licenseNumber}
                  onChange={(data) => {
                    setLicense(prevState => ({
                      ...prevState,
                      licenseNumber : data.target.value
                    }))
                  }}
                 />
              </FormControl>
              <FormControl fullWidth sx={{py : 1}}>
                 <TextField id="outlined-basic" label="Issuing Authority" variant="outlined" 
                    error={license.issuingAuthorityError}
                    value={license.issuingAuthority}
                    onChange={(data) => {
                      setLicense(prevState => ({
                        ...prevState,
                        issuingAuthority : data.target.value
                      }))
                    }}
                 />
              </FormControl>
              <FormControl fullWidth sx={{mt:2}}>
                <InputLabel id="demo-simple-select-autowidths-label">Country</InputLabel>
                <Select
                  labelId="demo-simple-select-autowidths-label"
                  id="demo-simple-select-autowidths"
                  error={license.countryError}
                  value={license.country}
                  onChange={(data) => {
                    
                    let id = data.target.value;
                    setLicense(prevState => ({
                      ...prevState,
                      country : id
                    }))
                    getStates(id)
                  }}
                  autoWidth
                  label="Country"
                >
                  
                  {
                    countries.map((item, index) => (
                      <MenuItem value={item._id} key={index}>{item.name}</MenuItem>
                    ))
                  }
                  
                </Select>
              </FormControl>

              
                <FormControl fullWidth sx={{mt:2}}>
                <InputLabel id="demo-simple-select-autowidth-label">Issuing State</InputLabel>
                <Select
                  labelId="demo-simple-select-autowidth-label"
                  id="demo-simple-select-autowidth"
                  error={stateError}
                  value={license.state}
                  onChange={(data) => {
                    let id = data.target.value;
                    
                    var myState = '';
                    if(id !== ''){
                       myState = states.filter((item) => item.isoCode === id)[0]
                       setState(myState.name)
                    }
                    getName(code, id)
                    setLicense(prevState => ({
                      ...prevState,
                      state : id
                    }))
                  }}
                  autoWidth
                  label="Issuing State"
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {
                    states.map((item, index) => (
                      <MenuItem value={item.isoCode} key={index}>{item.name}</MenuItem>
                    ))
                  }
                </Select>
              </FormControl>

              {/* <FormControl fullWidth sx={{py : 1, mb : 1}}>
                 <TextField id="outlined-basic" label="License Name" variant="outlined" 
                   error={license.licenseNameError}
                   value={license.licenseName}
                   onChange={(data) => {
                    setLicense(prevState => ({
                      ...prevState,
                      licenseName : data.target.value
                    }))
                   }}
                 />
              </FormControl> */}

              <FormControl fullWidth sx={{mt:2 }}>
                <InputLabel id="demo-simple-select-autowidthss-label">License Name</InputLabel>
                <Select
                  labelId="demo-simple-select-autowidthss-label"
                  id="demo-simple-select-autowidthss"
                  error={license.licenseNameError}
                  value={license.licenseName}
                  onChange={(data) => {
                    let id = data.target.value;
                    setLicense(prevState => ({
                      ...prevState,
                      licenseName : id
                    }))
                  }}
                  autoWidth
                  label="License Name"
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {
                    names.map((item, index) => (
                      <MenuItem value={item.id} key={index}>{item.name}</MenuItem>
                    ))
                  }
                  
                </Select>
              </FormControl>
              <FormControl fullWidth sx={{mt :2 }}>
              <LocalizationProvider dateAdapter={AdapterMoment}>
                  <DatePicker
                    label="Expiry Date"
                    value={license.expiryDate}
                    error={license.expiryDateError}
                    onChange={(data) => { 
                      setLicense(prevState => ({
                        ...prevState,
                        expiryDate : data
                      }))
                    }}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </LocalizationProvider>
              </FormControl>
              <InputLabel id="demo-simple-select-autowidthss-label" sx={{marginTop:"1rem"}}>Please Upload License</InputLabel>
              <FormControl fullWidth sx={{py : 2, my :1,px : 2, border : '1px solid lightgrey'}}>
              
                <input type="file"
                accept="image/*"
                required
                onChange={(e) => {
                  setLicense(prevState => ({
                    ...prevState,
                    picture : e.target.files[0]
                  }))
                }}
              />
              </FormControl>
            </Box>
          </DialogContent>
          <DialogActions sx={{mb : 2 , mx : 4}}>
              <Button onClick={handleSubmit} variant="contained" color="primary">{action === 'add' ? 'Submit' : 'Update'}</Button>
              <Button onClick={() => {
                setOpen(false)
              }} variant="outlined">Cancel</Button>
          </DialogActions>
        </Dialog>

        <Dialog open={show} onClose={() => {setShow(false)}} fullWidth>
          <DialogTitle align="center">Delete License</DialogTitle>
          <DialogContent>
            <Box container>
               <h3 align="center" className="delete-txt">Do you want to delete this user license</h3>
            </Box>
          </DialogContent>
          <DialogActions sx={{mb : 2 , mx : 4}}>
              <Button onClick={handledDelete} variant="contained" color="error">Delete</Button>
              <Button onClick={() => {
                setShow(false)
              }} variant="outlined">Cancel</Button>
          </DialogActions>
        </Dialog>
      </Box>
     
      <ViewMedia id={editId} show={showMedia} setShow={(bool) => setShowMedia(bool)} url={url}/>
    </Box>
  );
}
