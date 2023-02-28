/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import {
  Box,
  FormControl,
  Grid,
  FormLabel,
  TextField,
  Button,
  Alert,
} from "@mui/material";
import LocalDateSelector from "../../common/LocalDateSelector";
import { makeStyles } from "@mui/styles";
import BasicSelector from "../../common/Selector";
import LocalTimeSelector from "../../common/LocalTimeSelector";
import PageTitle from "../../common/PageTitle";

import { useDispatch, useSelector } from "react-redux";
import { addCheckpoints, getSites } from "../../../features/sites/sitesAPI";
import { Controller, useForm } from "react-hook-form";
import { selectTasks } from "../../../features/tasks/tasksSlice";

import { getCompanies } from "../../../features/company/companyAPI";
import { useNavigate } from "react-router-dom";
import { getAPI, postAPI, patchAPI } from "../../network";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from 'react-select';
import { useLocation } from "react-router-dom";
import Loader from '../../common/Loader'
import { toast } from "react-toastify";
import "./style.css";

const useStyles = makeStyles(() => ({

  buttoRoot: {
    borderColor: "#707070 !important;",
    color: "#202E43 !important;",
    borderRadius: "8px !important;",
    fontSize: "16px  !important;",
    textTransform: "none !important;",
    padding: "0px 30px !important;",
    marginRight: "15px !important;",
    "&:hover": {
      backgroundColor: " #42505C !important;",
      color: "white !important",
    },
  },
}));

export default function AddTask() {
  const classes = useStyles();
  const location = useLocation();
  const navigateTo = useNavigate();
  const { loading, error } = useSelector(selectTasks);
  const [companies, setCompanies] = useState([]);
  const [company, setCompany] = useState('');
  const [companyError, setCompanyError] = useState(false);

  const [users, setUsers] = useState([]);
  const [user, setUser] = useState('');
  const [userError, setUserError] = useState(false);


  // const [statusError,setStatusError]=useState(false);
  // const [status,setStatus]=useState("");


  const [sites, setSites] = useState([]);
  const [site, setSite] = useState('');
  const [siteError, setSiteError] = useState(false);
  const [title, setTitle] = useState('');
  const [titleError, setTitleError] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [startDateError, setStartDateError] = useState(false);
  const [endDateError, setEndDateError] = useState(false);
  const [dueTime, setDueTime] = useState(null);
  const [dueTimeError, setDueTimeError] = useState(false);
  const [desc, setDesc] = useState('')
  const [descError, setDescError] = useState('')
  const [action, setAction] = useState('add');
  const [btnTxt, setBtnTxt] = useState('');
  const [loader, setLoader] = useState(false);
  const dispatch = useDispatch();
  const [editId, setEditId] = useState('');
  const [checked, setChecked] = useState([]);
  const checkListWeek = [{
    "name": "Mon",
    val: 0
  },
  {
    "name": "Tue",
    val: 1
  },
  {
    "name": "Wed",
    val: 2
  },
  {
    "name": "Thus",
    val: 3
  },
  {
    "name": "Fri",
    val: 4
  },
  {
    "name": "Sat",
    val: 5
  },
  {
    "name": "Sun",
    val: 6
  }];

  useEffect(() => {
    dispatch(getSites());
    dispatch(getCompanies());
    sideLists();
    companyLists();
    UserLists();
    if (location) {
      if (location.state) {
        const task = location.state.task;
        setAction('edit')
        setEditId(task._id);
        setCompany(task.companyId?._id)
        setSite(task.siteId?._id);  
        setTitle(task.title);
        setDesc(task.description);
        setEndDate(new Date(task.endDate));
        setStartDate(new Date(task.startDate));
        var date = new Date(task.endDate);
        let time = date.getFullYear() + '-' + date.getMonth() + '-' + date.getDate() + ' ' + task.timeDue;
        setDueTime(new Date(time))
      }
    }
  }, [location]);


  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      title: "",
      siteId: "",
      companyId: "",
      userId: "",
      startDate: new Date(),
      endDate: new Date(),
      timeDue: new Date(),
      description: "",
    },
  });


  function convert(str) {
    var date = new Date(str),
      mnth = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);
    return [date.getFullYear(), mnth, day].join("-");
  }

  const timeFormat = (time) => {
    var date = new Date(time);
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? `0${minutes}`.toString() : minutes;
    hours = hours < 10 ? `0${hours}`.toString() : hours;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
  }
 
  var isChecked = (item) =>
    checked.includes(item) ? "checked-item" : "not-checked-item";

  const handleCheck = (event) => {
    var updatedList = [...checked];
    console.log(event.target.checked, "event.target.checked")
    if (event.target.checked) {
      updatedList = [...checked, event.target.value];
    } else {
      updatedList.splice(checked.indexOf(event.target.value), 1);
    }
    setChecked(updatedList);
  };
  let checkedval = []
  if (checked.length > 0) {
    for (let i = 0; i < checked.length; i++) {
      checkedval.push(parseInt(checked[i]))
    }
  } else {
    for (let i = 0; i <= 6; i++) {
      checkedval.push(parseInt(i))
    }
  }

  


  const toastObj = { position: toast.POSITION.TOP_RIGHT };

  const onSubmit = async (e) => {
    e.preventDefault();

    setTitleError(false);
    setSiteError(false);
    setCompanyError(false);
    setUserError(false);
    setDescError(false);
    setStartDateError(false);
    setEndDateError(false);
    setDueTimeError(false);

    if (title === '' || title.length < 3) {
      toast.warning('Title is required! and at least 3 character long', toastObj);
      setTitleError(true);
      return;
    }
    else if (desc === '' || desc.length < 3) {
      toast.warning('Title is required! and at least 3 character long', toastObj);
      setTitleError(true);
      return;
    }
    else if (company === '') {
      toast.warning('Company ID is required!', toastObj);
      setCompanyError(true);
      return;
    }
    else if(startDate === null){
      toast.warning('Start date is required!', toastObj);
      setStartDateError(true);
      return;
    }
    else if (endDate === null) {
      toast.warning('End date is required!', toastObj);
      setEndDateError(true);
      return;
    }
    else if (dueTime === null) {
      toast.warning('Due time is required!', toastObj);
      setDueTimeError(true);
      return;
    }
    


    if (action === 'add') {
      let payload = {
        companyId: company,
        siteId: site,
        title: title,
        status: 'opened',
        shiftRecurrence: "Weekly",
        recurrenceDay: checkedval,
        startDate: convert(startDate),
        endDate: convert(endDate),
        timeDue: timeFormat(dueTime),
        description: desc
      };


      setLoader(true)
      var saveStatus = await postAPI('/tasks', payload);
      setLoader(false)
      if (saveStatus) {
        navigateTo("/tasks/list")
      }
    }
    else if (action === 'edit') {
      let payload = {
        companyId: company,
        siteId: site,
        title: title,
        startDate: convert(startDate),
        endDate: convert(endDate),
        timeDue: timeFormat(dueTime),
        description: desc
      };
      let url = `/tasks/${editId}`;
      setLoader(true)
      let saveStatus = await patchAPI(url, payload);
      setLoader(false)
      if (saveStatus) {
        navigateTo("/tasks/list")
      }
    }
  };

  const sideLists = async () => {
    let process = await getAPI('/sites');
    if (process) {
      var sites = [];
      for (var i = 0; i < process.length; i++) {
        sites.push({ label: process[i].name, value: process[i]._id })
      }
      setSites(sites);
    }
  }

  const companyLists = async () => {
    let process = await getAPI('/companies');
    if (process) {
      var companies = [];
      for (var i = 0; i < process.length; i++) {
        companies.push({ label: process[i].name, value: process[i].id })
      }
      setCompanies(companies);
    }
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
      console.log("users---array", users)
      setUsers(users);
    }
  }

  return (
    <Box>
      <Loader loader={loader} />
      <PageTitle title={action === 'add' ? 'Add Task' : 'Edit Task'} />
      <Box ml={5}>
        {error && <Alert severity="error"> {error}</Alert>}
        <FormControl sx={{ display: "flex" }}>
          <Grid container alignItems="center" >
            <Grid item xs={2}>
              <FormLabel
                style={{
                  fontSize: "larger",
                  color: "black",
                  width: "8rem",
                }}
                component="h4"
              >
                Title
              </FormLabel>
            </Grid>
            <Grid item xs={3} py={2}>
              <Controller
                name={"title"}
                control={control}
                rules={{
                  required: true,
                }}
                render={({ field: { onChange, value } }) => (
                  <TextField
                    fullWidth
                    type="text"
                    required
                    onChange={(e) => setTitle(e.target.value)}
                    value={title}
                    sx={{ background: "white", marginLeft: "2rem", width: "90%" }}
                    placeholder="Title"
                    // error={!!errors.title}
                    helperText={errors.title ? errors.title?.message : null}
                  />
                )}
              />
            </Grid>
          </Grid>
        </FormControl>


        <FormControl sx={{ display: "flex" }}>
          <Grid container alignItems="center">
            <Grid item xs={2} >
              <FormLabel
                style={{
                  fontSize: "larger",
                  color: "black",
                  width: "8rem",
                }}
                component="h4"
              >
                Company
              </FormLabel>
            </Grid>
            <Grid item xs={3} py={2}>
              <Controller
                name={"companyId"}
                control={control}
                rules={{
                  required: true,
                }}
                render={({ field: { onChange, value } }) => (
                  <BasicSelector
                    disableAll={true}
                    options={companies}
                    selectorHight={"53px"}
                    value={company}
                    sx={{ background: "white", marginLeft: "2rem" }}
                    onChange={(data) => { setCompany(data.target.value) }}
                    name={"Company "}
                    error={companyError}
                    helperText={
                      companyError ? 'Company is required !' : null
                    }
                  />
                )}
              />
            </Grid>
          </Grid>
        </FormControl>

        <FormControl sx={{ display: "flex" }}>
          <Grid container alignItems="center">
            <Grid item xs={2}>
              <FormLabel
                style={{
                  fontSize: "larger",
                  color: "black",
                  width: "8rem",
                }}
                component="h4"
              >
                Sites
              </FormLabel>
            </Grid>
            <Grid item xs={3} py={2}>
              <Controller
                name={"siteId"}
                control={control}
                rules={{
                  required: true,
                }}
                render={({ field: { onChange, value } }) => (
                  <BasicSelector
                    disableAll={true}
                    options={sites}
                    selectorHight={"53px"}
                    value={site}
                    onChange={(data) => { setSite(data.target.value) }}
                    name={"Site "}
                    sx={{ background: "white", marginLeft: "2rem" }}
                    error={siteError}
                    helperText={
                      siteError ? 'Site is required !' : null
                    }
                  />
                )}
              />
            </Grid>
          </Grid>
        </FormControl>


        {/* <FormControl sx={{ display: "flex" }}>
          <Grid container alignItems="center">
            <Grid item xs={2} >
              <FormLabel
                style={{
                  fontSize: "larger",
                  color: "black",
                  width: "8rem",
                }}
                component="h4"
              >
               User
              </FormLabel>
            </Grid>
            <Grid item xs={3} py={2}>
              <Controller
                name={"userId"}
                control={control}
                rules={{
                  required: true,
                }}
                render={({ field: { onChange, value } }) => (
                 
                    <Select
                        value={user}
                        onChange={(data) => {setUser(data)}}
                        name="permissions"
                        className="basic-multi-select select"
                        classNamePrefix="select"
                        error={userError}
                        sx={{ background: "white", marginLeft:"2rem" }}
                        options={users}
                      />
                )}
              />
            </Grid>
          
          </Grid>
        </FormControl> */}


        <FormControl sx={{ display: "flex" }}>
          <Grid container alignItems="center">
            <Grid item xs={2} >
              <FormLabel
                style={{
                  fontSize: "larger",
                  color: "black",
                  width: "10rem",
                }}
                component="h4"
              >
                Weekly Recurrance
              </FormLabel>
            </Grid>
            <Grid item xs={3} py={2}>
              <Controller
                name={"Status"}
                control={control}
                rules={{
                  required: true,
                }}
                render={({ field: { onChange, value } }) => (
                  <Grid sx={{ marginLeft: "2rem" }}>
                    <div className="h-10" >
                      {checkListWeek.map((item, index) => (
                        <div key={index} style={{ display: "inline" }}>
                          <input sx={{ fontSize: "12px" }} value={item.val} type="checkbox" onChange={handleCheck}
                          />
                          <span className={isChecked(item)} key={item} value={item.val}>{item.name}</span>
                        </div>
                      ))}
                    </div>
                  </Grid>
                )}
              />
            </Grid>
          </Grid>
        </FormControl>

        <FormControl sx={{ display: "flex" }}>
          <Grid container alignItems="center">
            <Grid item xs={2}>
              <FormLabel
                style={{
                  fontSize: "larger",
                  color: "black",
                  width: "8rem",
                }}
                component="h3"
              >
                Start Date
              </FormLabel>
            </Grid>
            <Grid item xs={5} py={2}>
              <FormControl sx={{ mb: 2, marginLeft: "2rem", width: " 21rem" }}>
                <Controller
                  name="startDate"
                  control={control}

                  render={({ field: { onChange, value } }) => (
                    <LocalDateSelector
                      label="none"
                      onChange={(text) => setStartDate(text)}
                      value={startDate}
                      inputFormat="YYYY-MM-DD"

                    />
                  )}
                />
              </FormControl>
            </Grid>
          </Grid>
        </FormControl>

        <FormControl sx={{ display: "flex" }}>
          <Grid container alignItems="center">
            <Grid item xs={2}>
              <FormLabel
                style={{
                  fontSize: "larger",
                  color: "black",
                  width: "8rem",
                }}
                component="h3"
              >
                End Date
              </FormLabel>
            </Grid>
            <Grid item xs={5} py={2}>
              <FormControl sx={{ mb: 2, marginLeft: "2rem", width: " 21rem" }}>
                <Controller
                  name="endDate"
                  control={control}

                  render={({ field: { onChange, value } }) => (
                    <LocalDateSelector
                      label="none"
                      onChange={(text) => setEndDate(text)}
                      value={endDate}
                      inputFormat="YYYY-MM-DD"

                    />
                  )}
                />
              </FormControl>
            </Grid>
          </Grid>
        </FormControl>
        <FormControl sx={{ display: "flex" }}>
          <Grid container alignItems="center">
            <Grid item xs={2}>
              <FormLabel
                style={{
                  fontSize: "larger",
                  color: "black",
                  width: "8rem",
                }}
                component="h3"
              >
                Due Time
              </FormLabel>
            </Grid>
            <Grid item xs={5} py={2}>
              <FormControl sx={{ mb: 2, background: "white", marginLeft: "2rem", width: " 21rem" }}>
                <Controller
                  name="timeDue"
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <LocalTimeSelector
                      label="none"
                      onChange={(text) => setDueTime(text)}
                      value={dueTime}

                    />
                  )}
                />
              </FormControl>
            </Grid>
          </Grid>
        </FormControl>


        <FormControl sx={{ display: "flex" }}>
          <Grid container alignItems="center">
            <Grid item xs={12}>
              <FormLabel
                style={{
                  fontSize: "larger",
                  color: "black",

                }}
                component="h3"
              >
                Description
              </FormLabel>
            </Grid>
            <Grid item xs={6} py={2}>
              <Controller
                name="description"
                control={control}
                rules={{
                  required: "Description is Required",
                  minLength: {
                    value: 4,
                    message: "Value can't be more than 4!",
                  },
                }}
                render={({ field: { onChange, value } }) => (
                  <TextField
                    fullWidth
                    label="Description"
                    variant="standard"
                    multiline
                    rows={3}
                    onChange={(e) => {
                      setDesc(e.target.value)
                    }}
                    value={desc}
                    sx={{ background: "white" }}
                    error={descError}
                    helperText={
                      'Description is required! and at least 10 character long'
                    }
                  />
                )}
              />
            </Grid>
          </Grid>
        </FormControl>
        <FormControl>
          <Button
            variant="outlined"
            sx={{
              py: "10px !important",
              px: "50px !important",
            }}
            className={classes.buttoRoot}
            // disabled={loading}
            onClick={(e) => onSubmit(e)}
          >
            {action === 'add' ? 'Add' : 'Update'} Task
          </Button>
        </FormControl>
      </Box>
    </Box>
  );
}
