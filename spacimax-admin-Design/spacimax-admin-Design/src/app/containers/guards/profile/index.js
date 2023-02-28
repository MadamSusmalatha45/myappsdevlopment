import React, { useEffect, useState } from "react";
import {  Box,  Skeleton,  Button, Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid, Typography, FormControl} from "@mui/material";
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

import "./style.css";
import { SettingsInputAntenna, SettingsPhoneTwoTone } from "@material-ui/icons";
import { useParams } from 'react-router-dom';
import Loader from "../../../common/Loader";
import { getAPI, patchAPI, deleteAPI } from "../../../network";
import { formatDate, validation } from "../../../utils";
import { toast } from "react-toastify";


export default function Profile() {
  const [loader, setLoader] = useState(false);
  const [open, setOpen] = React.useState(false);
  const [show, setShow] = React.useState(false);
  const [profile, setProfile] = useState({})
  const [licenses, setLicenses] = useState([])
  const [countries, setCountries] = useState([])
  const [experiences, setExperiences] = useState([
    {index : 0, employer : '', role : '', duration : '', jobDescription :'' }
  ])
  const { id } = useParams();
  const [user, setUser] = useState({
    firstname :'',
    lastname : '',
    email : '',
    phone : '',
    postcode : '',
    about : '',
    country : '',
    login_as :'',
    experience:[],
    firstnameError :false,
    lastnameError : false,
    emailError : false,
    phoneError : false,
    postcodeError : false,
    aboutError : false,
    countryError : false,
    login_asError :false,
  })

  useEffect(() => {
    getProfile()
    getCountries()
  }, [id]);

  const getProfile = async () => {
    setLoader(true)
    let data = await getAPI(`/profile/${id}`)
    if(data){
      setUser((prevState) => ({ 
        firstname: data.firstname,
        lastname : data.lastname,
        email : data.email,
        phone : data.phone.toString(),
        postcode : data.postcode.toString() ,
        about : data.about,
        login_as : data.login_as,
        country : data.country._id,
        experiences:data.experiences._id
      }))


      var arr = [];
      var contain = false;
      if(data.experiences.length > 0){
        contain = true;
        for(var i = 0; i< data.experiences.length; i++){
          arr.push({index : i, employer : data.experiences[i].employer, role : data.experiences[i].role, duration : data.experiences[i].duration, jobDescription : data.experiences[i].jobDescription, id:data.experiences[i]._id});
        }
      }
      if(contain){
        setExperiences(arr)
      }
      setProfile(data)
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

  const toastObj = {position: toast.POSITION.TOP_RIGHT};

  const handleSubmit = async() => {
    setUser(prevState => ({
      ...prevState,
      firstnameError :false,
      lastnameError : false,
      emailError : false,
      phoneError : false,
      postcodeError : false,
      aboutError : false,
      countryError : false,
      login_asError :false
    }))

    if(validation(null, 'First Name', user.firstname)){
      setUser(prevState => ({
        ...prevState,
        firstnameError :true,
      }))
      return;
    }
    else if(validation(null, 'Last Name', user.lastname)){
      setUser(prevState => ({
        ...prevState,
        lastnameError :true,
      }))
      return;
    }
    else if(validation('email', 'Email Address', user.email)){
      setUser(prevState => ({
        ...prevState,
        emailError :true,
      }))
      return;
    }
    else if(validation('mobile', 'Mobile Number', user.phone)){
      setUser(prevState => ({
        ...prevState,
        phoneError :true,
      }))
      return;
    }
    else if(validation('empty', 'Country', user.country)){
      setUser(prevState => ({
        ...prevState,
        countryError :true,
      }))
      return;
    }
    else if(validation(null, 'Postcode', user.postcode)){
      setUser(prevState => ({
        ...prevState,
        postcodeError :true,
      }))
      return;
    }
    else if(validation(null, 'Login As', user.login_as)){
      setUser(prevState => ({
        ...prevState,
        login_asError :true,
      }))
      return;
    }

    for(var  i = 0 ;  i < experiences.length ; i++){
      if(validation('empty', 'Employer', experiences[i].employer)){
        return;
      }
      else if(validation('empty', 'Role', experiences[i].role)){
        return;
      }
      else if(validation('empty', 'Duration', experiences[i].duration)){
        return;
      }
    }


    let payload = {
      firstname: user.firstname,
      lastname : user.lastname,
      email : user.email,
      phone : user.phone,
      postcode : user.postcode ,
      about : user.about,
      login_as : user.login_as,
      country : user.country,
      experience : experiences
    }


    setLoader(true)
    let data = await patchAPI(`/profile/${id}`, payload);
    if(data){
      getProfile()
    }
    setLoader(false)

  };

  const addExperience = () => {
    let index = experiences.length;
    var exp = experiences;
    exp.push({index : index , employer : '', role :'', duration : '', jobDescription : ''});
    setExperiences([...exp])
  }

  

  const removeExperience = async (index,exp_id) => {
    console.log(index,"index=============")
    console.log(exp_id,"exp_id=============")
    var arr = [];
    if(experiences.length === 1){
      toast.error('At least one experience is required!',toastObj);
      return;
    }
    let data = await deleteAPI(`/profile/${id}/${exp_id}`);
    if(data){
      setExperiences(data)
    }

    for(var  i = 0; i < experiences.length ; i++){
      if(i !== index){
        arr.push(experiences[i])
      }
    }

    setExperiences([...arr])


  }

  const setInput = (index, key , value) => {
    var arr = [];
    for(var i = 0; i < experiences.length; i ++){
      if(i === index){
         arr.push({
          employer : key === 'employer' ? value : experiences[i].employer,
          role : key === 'role' ? value : experiences[i].role,
          duration : key === 'duration' ? value : experiences[i].duration,
          jobDescription : key === 'jobDescription' ? value : experiences[i].jobDescription,
          id : key=== "id" ? value : experiences[i].id
         })
      }
      else{
        arr.push(experiences[i])
      }
    }

    setExperiences([...arr])
  }

  return (
    <Box sx={{ height: "inherit" }}>
      <Loader loader={loader} />
      <PageTitle
        title="User Profile"
      />

      <Box display="flex" >
           <Grid
              container
              spacing={2}
              my={3}
            >
              <Grid item xs={7}>
                <div className="left-div">
                  <Grid
                    container
                    spacing={2}
                    my={1}
                    >
                        <Grid item xs={12}>
                            <h2 align="center">User Profile</h2>
                        </Grid>
                        <Grid item xs={6}>
                            <FormControl fullWidth>
                                <TextField label="First Name" variant="outlined"
                                 value={user.firstname}
                                 onChange={(data) => {
                                  setUser(prevState => ({
                                    ...prevState,
                                    firstname: data.target.value,
                                  }))
                                 }}
                                ></TextField>
                            </FormControl>
                        </Grid>
                        <Grid item xs={6}>
                            <FormControl fullWidth>
                                <TextField label="Last Name" variant="outlined"
                                value={user.lastname}
                                onChange={(data) => {
                                 setUser(prevState => ({
                                   ...prevState,
                                   lastname: data.target.value,
                                 }))
                                }}
                                ></TextField>
                            </FormControl>
                        </Grid>
                        <Grid item xs={6}>
                            <FormControl fullWidth>
                                <TextField label="Email" variant="outlined" type="email"
                                value={user.email}
                                onChange={(data) => {
                                 setUser(prevState => ({
                                   ...prevState,
                                   email: data.target.value,
                                 }))
                                }}
                                ></TextField>
                            </FormControl>
                        </Grid>
                        <Grid item xs={6}>
                            <FormControl fullWidth>
                                <TextField label="Mobile Number" variant="outlined"
                                type="number"
                                value={user.phone}
                                onChange={(data) => {
                                 setUser(prevState => ({
                                   ...prevState,
                                   phone: data.target.value,
                                 }))
                                }}
                                ></TextField>
                            </FormControl>
                        </Grid>
                        <Grid item xs={6}>
                            <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">Country</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={user.country}
                                    label="Country"
                                    onChange={(data) => {
                                      setUser(prevState => ({
                                        ...prevState,
                                        country: data.target.value,
                                      }))
                                     }}
                                >
                                   {
                                    countries.map((item, index) => (
                                      <MenuItem value={item._id} key={index}>{item.name}</MenuItem>
                                    ))
                                   }
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={6}>
                            <FormControl fullWidth>
                                <TextField label="Post Code" variant="outlined" type="number"
                                value={user.postcode}
                                onChange={(data) => {
                                 setUser(prevState => ({
                                   ...prevState,
                                   postcode: data.target.value,
                                 }))
                                }}
                                ></TextField>
                            </FormControl>
                        </Grid>


                     
                        <Grid item xs={6}>
                            <FormControl fullWidth>
                                <InputLabel id="demo-simple-selects-label">Login As</InputLabel>
                                <Select
                                    labelId="demo-simple-selects-label"
                                    id="demo-simple-selects"
                                    value={user.login_as}
                                    label="Login As"
                                    onChange={() => {}}
                                >
                                    <MenuItem value={'GUARD'}>GUARD</MenuItem>
                                    <MenuItem value={'CLEANER'}>CLEANER</MenuItem>
                                    
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={6}>
                            <FormControl fullWidth>
                                <TextField label="About" variant="outlined" multiline rows={4}
                                value={user.about}
                                onChange={(data) => {
                                 setUser(prevState => ({
                                   ...prevState,
                                   about: data.target.value,
                                 }))
                                }}
                                
                                ></TextField>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} align="right">
                            <Button align="right" variant="contained" onClick={addExperience}>Add Experience</Button>
                        </Grid>
                        {console.log("experiences=======",experiences)}
                        {
                          experiences.map((item, index) => (
                            <Grid  container key={index} sx={{ border : '1px solid lightgrey', p : 2, mt :2, position  :'relative'}}>
                                <Button variant="contained" color="error" size="small" onClick={() => {removeExperience(index,item.id)}} sx={{position :'absolute', right : -10, top : -10}}><DeleteIcon /></Button>
                                <Grid item xs={6} sx={{pl : 2, my : 2}}>
                                  <FormControl fullWidth>
                                      <TextField label="Employer" variant="outlined" 
                                      value={item.employer}
                                      onChange={(data) => {
                                       setInput(index,'employer', data.target.value)
                                      }}
                                      
                                      ></TextField>
                                  </FormControl>
                                </Grid>
                                <Grid item xs={6} sx={{pl : 2, my : 2}}>
                                  <FormControl fullWidth>
                                      <TextField label="Role" variant="outlined" 
                                      value={item.role}
                                      onChange={(data) => {
                                        setInput(index,'role', data.target.value)
                                      }}
                                      
                                      ></TextField>
                                  </FormControl>
                                </Grid>
                                <Grid item xs={6} sx={{pl : 2, my : 2}}>
                                  <FormControl fullWidth>
                                      <TextField label="Duration" variant="outlined" 
                                      value={item.duration}
                                      onChange={(data) => {
                                        setInput(index,'duration', data.target.value)
                                      }}
                                      
                                      ></TextField>
                                  </FormControl>
                                </Grid>
                                <Grid item xs={6} sx={{pl : 2, my : 2}}>
                                  <FormControl fullWidth>
                                      <TextField label="Job Description" variant="outlined" multiline rows={3}
                                      value={item.jobDescription}
                                      onChange={(data) => {
                                        setInput(index,'jobDescription', data.target.value)
                                      }}
                                      
                                      ></TextField>
                                  </FormControl>
                                </Grid>
                            </Grid>
                          ))
                        }
                        <Grid item xs={12} align="right">
                          <Button align="right" variant="contained" onClick={handleSubmit}>Update</Button>
                        </Grid>
                  </Grid>
                </div>
              </Grid>
              <Grid item xs={5}>
                <Card variant="outlined">
                   <CardContent>
                      <div className="avatar-box">
                        <img src='https://thumbs.dreamstime.com/b/man-portrait-face-icon-web-avatar-flat-style-vector-male-blocked-unknown-anonymous-silhouette-business-manager-character-85797128.jpg' className="avatar-img"/>
                        <EditIcon className="edit-img"/>
                      </div>
                      <div className="card" >
                        <div className="block">
                            <div className="card-txt-title">Name</div>
                            <div className="card-txt-value">: {profile?.firstname} {' '} {profile?.lastname}</div>
                        </div>
                        <div className="block">
                            <div className="card-txt-title">Email</div>
                            <div className="card-txt-value">: {profile?.email}</div>
                        </div>
                        <div className="block">
                            <div className="card-txt-title">Phone</div>
                            <div className="card-txt-value">: {profile?.phone}</div>
                        </div>
                        <div className="block">
                            <div className="card-txt-title">Country</div>
                            <div className="card-txt-value">: {profile?.country?.name}</div>
                        </div>
                        {/* <div className="block">
                            <div className="card-txt-title">State</div>
                            <div className="card-txt-value">: Maharashtra</div>
                        </div> */}
                        <div className="block">
                            <div className="card-txt-title">Post Code</div>
                            <div className="card-txt-value">: {profile?.postcode}</div>
                        </div>
                        <div className="block">
                            <div className="card-txt-title">Logged In As</div>
                            <div className="card-txt-value">: {profile?.login_as}</div>
                        </div>
                        {/* <div className="block">
                            <div className="card-txt-title">Experience</div>
                            <div className="card-txt-value">: {profile?.experiences[0]?.duration}</div>
                        </div> */}
                        <div className="block">
                            <div className="card-txt-title">About</div>
                            <div className="card-txt-value">: {profile?.about}</div>
                        </div>
                        <div className="block">
                            <div className="card-txt-title" align="top">Experience</div>
                            <div className="card-txt-value">: 
                            {console.log("Profile======", profile)}
                              {
                                profile?.experiences && profile?.experiences.map((item, index) => (
                                  <span value={item._id} key={index}>{index +1 }) 
                                  Employer - {item.employer} <br></br>
                                  Role - {item.role} <br></br>
                                  Duration - {item.duration} <br></br>
                                  Job Description - {item.jobDescription} <br></br>
                                  </span>
                                ))
                              }
                            </div>
                        </div>
                        </div>
                    </CardContent>
                    
                </Card>
              </Grid>
             
            </Grid>
      </Box>
      
    </Box>
  );
}
