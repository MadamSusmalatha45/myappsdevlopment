import { AddBox } from "@mui/icons-material";
import { Alert, Box, Button, Grid, Skeleton, FormControl } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSites } from "../../../features/sites/sitesAPI";
import { selectSites } from "../../../features/sites/sitesSlice";
import Loader from "../../common/Loader"

import PageTitle from "../../common/PageTitle";
import SiteCard from "../../components/sites/SiteCard";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { deleteAPI, getAPI, patchAPI, postAPI } from "../../network";
import { validation } from "../../utils";


function SitePage() {
  const { loading, error, data } = useSelector(selectSites);
  const [loader, setLoader] = useState(false)
  const [open, setOpen] = useState(false)
  const [action, setAction] = useState('add')
  const [companies, setCompanies] = useState([])
  const [countries, setCountries] = useState([])
  const [cities, setCities] = useState([])
  const [show, setShow] = useState(false);
  const [id, setId] = useState('')
  const [site, setSite] = useState({
    companyId : '',
    name : '',
    address :'',
    countryId :'',
    cityId :'',
    latitude :'',
    longitude :'',
    companyIdError : false,
    nameError : false,
    addressError :false,
    cityIdError :false,
    countryIdError :false,
    latitudeError :false,
    longitudeError :false,
  })

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getSites());
    getCompanies()
    getCountries()
  }, []);

  const getCompanies = async () => {
    setLoader(true)
    let data = await getAPI('/companies');
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

  const getCountries = async() => {
    setLoader(true)
    const data = await getAPI('/countries');
    if(data){
        setCountries(data)
    }
    setLoader(false)
  }

  const addSite = () => {
   setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleSubmit = async() => {
    setSite(prevState => ({
      ...prevState,
      nameError: false,
      companyIdError : false,
      cityIdError : false,
      latitudeError : false,
      longitudeError : false,
      countryIdError : false,
      cityIdError :false,
      addressError : false
  }))

  
  if(validation('empty', 'Company', site.companyId)){
    setSite(prevState => ({
        ...prevState,
        companyIdError : true,
    }))
    return;
  }
  else if(validation(null, 'Name', site.name)){
    setSite(prevState => ({
        ...prevState,
        nameError: true,
    }))
    return;
  }
  else if(validation('empty', 'Country', site.countryId)){
    setSite(prevState => ({
        ...prevState,
        countryIdError: true,
    }))
    return;
  }
  else if(validation('empty', 'City', site.cityId)){
    setSite(prevState => ({
        ...prevState,
        cityIdError: true,
    }))
    return;
  }
  else if(validation('empty', 'Latitude', site.latitude)){
    setSite(prevState => ({
        ...prevState,
        latitudeError: true,
    }))
    return;
  }
  else if(validation('empty', 'Longitude', site.longitude)){
    setSite(prevState => ({
        ...prevState,
        longitudeError: true,
    }))
    return;
  }
  else if(validation('long', 'Address', site.address)){
      setSite(prevState => ({
          ...prevState,
          addressError: true,
      }))
      return;
  }

  let payload = {
      name : site.name,
      companyId : site.companyId,
      latitude : site.latitude,
      longitude : site.longitude,
      country : site.countryId,
      city : site.cityId,
      address : site.address
  }

  if(action === 'add'){
     setLoader(true)
     let data = await postAPI('/sites', payload)
     if(data){
        dispatch(getSites());
        setOpen(false)
     }
     setLoader(false)
  }
  else{
      setLoader(true)
      let data = await patchAPI(`/sites/${id}`, payload)
      if(data){
        dispatch(getSites());
        setOpen(false)
      }
      setLoader(false)
   }
  }

  const handleShowClose = () => {
    setShow(false)
  }

  const clickDelete = async() => {
     setLoader(true);
     let res = await deleteAPI(`/sites/${id}`);
     if(res){
      dispatch(getSites())
      setShow(false);
     }
     setLoader(false)
  }

  const handleDelete = () => {

  }

  const siteAction = (id, txt) => {
    setAction(txt)
      if(txt === 'edit'){
        setId(id);
        
        let site = data.filter((item) => item._id === id)[0];
        setSite(prevState => ({
          ...prevState,
          companyId : site.companyId._id,
          name : site.name,
          address :site.address,
          countryId : site.country._id,
          cityId : site.city._id,
          latitude : site.latitude,
          longitude :  site.longitude,
          companyIdError : false,
          nameError : false,
          addressError :false,
          cityIdError :false,
          countryIdError :false,
          latitudeError :false,
          longitudeError :false,
        }))
        getCities(site.country._id)
        setOpen(true)
      }
      else if(txt === 'add'){
        
        setSite(prevState => ({
          ...prevState,
          companyId : '',
          name : '',
          address :'',
          countryId : '',
          cityId : '',
          latitude : '',
          longitude :  ''
        }))

        setOpen(true);
      }
      else{
        setId(id);
        setShow(true)
      }
  }

  return (
    <Box>
      <Loader loader={loader} />
      <PageTitle title="Sites View" />
      <Box
        display="flex"
        justifyContent="flex-end"
        alignItems="flex-end"
        sx={{mx : 6, mb :2}}
      >
        <Button variant="contained" style={{backgroundColor : "grey"}}  onClick={() => siteAction(null,'add')} size="small">
          <AddCircleIcon /> &nbsp;
          Add Site
        </Button>  
      </Box>
 
      {error && <Alert severity="error">{error}</Alert>}
      <Grid container rowSpacing={7} columnSpacing={2} px={2}>
        {data.map((site) => (
          <SiteCard
            title={`${site.name}, ${site.address}, ${site.city?.name}`}
            key={site._id}
            id={site._id}
            option={true}
            btnClick={(id, txt) => {
              siteAction(id, txt)
            }}
          />
        ))}
      </Grid>
  
      {/* add/ edit Modal */}
      <Dialog open={open} onClose={handleClose} fullWidth={true}>
        <DialogTitle sx={{ mb: 4 , textAlign :"center" }}>{action === 'add' ? 'Add' : 'Edit'} Site</DialogTitle>
        <DialogContent>
          <Box
            component="form"
            sx={{
              '& .MuiTextField-root': { my: 2, width: '100%' },
            }}
            noValidate
            autoComplete="off"
          >

          <FormControl  sx={{  minWidth : '100%', mt : 1 }}>
            <InputLabel id="country-label">Company</InputLabel>
            <Select
                labelId="country-label"
                id="country"
                value={site.companyId}
                label="Country"
                error={site.companyIdError}
                onChange={(data) => {
                    setSite(prevState => ({
                        ...prevState,
                        companyId : data.target.value,
                    }))
                }}
            >
                {
                    companies.map((item,index) => (
                        <MenuItem value={item.id} key={index}>{item.name}</MenuItem>
                    ))
                }
            </Select>
          </FormControl>

          <FormControl sx={{  minWidth : '100%', mx : 0, px :0 }}>
            <TextField 
              id="name" 
              label="Site Name" 
              variant="outlined" 
              type="text" 
              error={site.nameError}
              value={site.name}
              onChange={(data) => {
                setSite(prevState => ({
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
                value={site.countryId}
                label="Country"
                error={site.countryIdError}
                onChange={(data) => {
                    setSite(prevState => ({
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

          <FormControl  sx={{  minWidth : '100%', mt : 2 }}>
            <InputLabel id="city-label">City</InputLabel>
            <Select
                labelId="city-label"
                id="city"
                value={site.cityId}
                label="City"
                error={site.cityIdError}
                onChange={(data) => {
                    setSite(prevState => ({
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

          <FormControl sx={{  minWidth : '100%', mx : 0, px :0 }}>
            <TextField 
              id="latitude" 
              label="Latitude" 
              variant="outlined" 
              type="text" 
              value={site.latitude}
              error={site.latitudeError}
              onChange={(data) => {
                setSite(prevState => ({
                    ...prevState,
                    latitude: data.target.value,
                }))
              }}
              fullWidth
              sx={{m : 0}}
            />
          </FormControl>

          <FormControl sx={{  minWidth : '100%', mx : 0, px :0 }}>
            <TextField 
              id="longitude" 
              label="Longitude" 
              variant="outlined" 
              type="text" 
              value={site.longitude}
              error={site.longitudeError}
              onChange={(data) => {
                setSite(prevState => ({
                    ...prevState,
                    longitude: data.target.value,
                }))
              }}
              fullWidth
              sx={{m : 0}}
            />
          </FormControl>

          <FormControl sx={{  minWidth : '100%', mx : 0, px :0 }}>
            <TextField 
              id="address" 
              label="Address" 
              variant="outlined" 
              multiline
              maxRows={4}
              value={site.address}
              error={site.addressError}
              onChange={(data) => {
                setSite(prevState => ({
                    ...prevState,
                    address: data.target.value,
                }))
              }}
              fullWidth
              sx={{m : 0}}
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
        <DialogTitle sx={{ mb: 4 , textAlign :"center" }}>Delete Site</DialogTitle>
        
        <DialogContent>
          <Box
            component="form"
            sx={{
              '& .MuiTextField-root': { my: 2, width: '100%' },
            }}
            noValidate
            autoComplete="off"
          >

            <h3 style={{textAlign : 'left', fontWeight :'bold'}}>Do you want's to delete this company site</h3>
          </Box>
        </DialogContent>
        <DialogActions sx={{mb : 2 , mx : 4}}>
          <Button onClick={clickDelete} variant="contained" color="error">Delete</Button>
          <Button onClick={handleShowClose} variant="outlined">Cancel</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default SitePage;
