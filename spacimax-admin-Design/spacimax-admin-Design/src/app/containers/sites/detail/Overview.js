import React, { useEffect, useState } from "react";
import {
  Box, Link, Button, Dialog, Skeleton,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Select,
} from "@mui/material";
import MenuItem from '@mui/material/MenuItem';
import PageTitle from "../../../common/PageTitle";
import SiteOverviewCard from "../../../components/sites/Overview";
import LocalDateSelector from "../../../common/LocalDateSelector";
import { useParams } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import TextField from '@mui/material/TextField';
import { getAPI ,postAPI} from "../../../network/index";
import { checkAuthority, formatDatePost } from "../../../utils";
import FilterAltOffIcon from '@mui/icons-material/FilterAltOff';
import Loader from "../../../common/Loader";

export default function SitesOverviewPage() {
  const [sites, setSites] = useState([])
  const [loader, setLoader] = useState(false)
  const [overviews, setOverviews] = useState([])
  const { siteId } = useParams();
  const [inspectionss, setInspections] = useState([])
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState({
    startDate: null,
    endDate: null
  })

  useEffect(() => {
    getSites();
    getOverview();
    getSitesInspectionList()
  }, [])

  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      siteId: siteId,
      reportTypeId: "",

    },
  });
  const onSubmit = async (form) => {
    
    setLoader(true)
    let data = await postAPI(`/dynamic-site-overview-report`, form)
    // console.log("data post-----------///////", data)
    if (data) {
      getSitesInspectionList();
      handleClose();
      reset();
      getOverview()
    }
    setLoader(false)

  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleClickOpen = () => {
    setOpen(true);
  };

  const getSites = async () => {
    setLoader(true)
    let userType = localStorage.getItem('userType')
    let data = await getAPI(userType === 'admin' ? '/sites' : '/company/sites');
    // console.log("DATA===========",data)
    if (data) {
      setSites(data)
    }
    setLoader(false)
  }

  const getSiteName = () => {
    if (sites.length > 0) {
      let site = sites.filter((item) => item._id === siteId)[0];
      return site.name + ', ' + site.address + ', ' + site.city?.name + ' / Site Overview'
    }
    else {
      return '';
    }
  }

  const getOverview = async (startDate = null, endDate = null) => {
    let newStartDate = startDate !== null ? startDate : filter.startDate;
    let newEndDate = endDate !== null ? endDate : filter.endDate;
    var start = true;
    var url = '';
    if (newStartDate !== '' && newStartDate !== null) {
      url += (start ? '?' : '&') + `startDate=${formatDatePost(newStartDate)}`
      start = false;
    }
    if (newEndDate !== '' && newEndDate !== null) {
      url += (start ? '?' : '&') + `endDate=${formatDatePost(newEndDate)}`
      start = false;
    }
    setLoader(true);
    console.log('url', `/sites/overview/${siteId}${url}`)
    let overview = await getAPI(`/sites/overview/${siteId}${url}`)
    // console.log("------overview---",overview)
    if (overview) {
      setOverviews(overview)
    }
    setLoader(false)
  }

  const clearFilter = () => {
    setFilter({
      startDate: null,
      endDate: null
    })
  }
  // const renderOverview=(items)=>{
  //   return Object.keys(items).map(key=>{

  //     const val=items[key]
  // {console.log(val,"val of items--")}

  //   <SiteOverviewCard
  //         title={items[key]}
  //         subTitle={items[key]}
  //         key={key}
  //  /> 
  //  } )

  // }



  let workForce = []
  let compliance = []
  let inspections = []
  let operational = []
  Object.keys(overviews).map(key => {
    if (key == 'workforce') {
      workForce = overviews[key]
    }
    if (key == 'compliance') {
      compliance = overviews[key]
    }
    if (key == 'inspections') {
      inspections = overviews[key]
    }
    if (key == 'operational') {
      operational = overviews[key]
    }

  })
  const AddReport=()=>{
    console.log("card clcik")
  }

  const getSitesInspectionList = async () => {
    setLoader(true)

    let data = await getAPI(`/all-report-types/site-overview`)
   
    if (data) {
      setInspections(data)
    }
    setLoader(false)
  }


  return (
    <Box>
      <Loader loader={loader} />
      <PageTitle
        title="Sites View"
        subTitle={getSiteName()}
      />
      {
        checkAuthority('VIEW_SITE_OVERVIEWS') &&
        <Box display="flex" flexDirection="column">
          <Box display="flex" flexDirection="row" columnGap={5} mb={5} ml={4}>
            {/* <LocalDateSelector title="Start Date" /> */}
            <LocalizationProvider dateAdapter={AdapterMoment}>
              <DatePicker
                label="Start Date"
                value={filter?.startDate}
                onChange={(newValue) => {
                  setFilter({
                    ...filter,
                    startDate: newValue
                  });
                  getOverview(newValue, null)
                }}
                renderInput={(params) => <TextField {...params} />}
              />
            </LocalizationProvider>
            {/* <LocalDateSelector title="Finish Date" /> */}
            <LocalizationProvider dateAdapter={AdapterMoment}>
              <DatePicker
                label="Finish Date"
                value={filter?.endDate}
                onChange={(newValue) => {
                  setFilter({
                    ...filter,
                    endDate: newValue
                  });
                  getOverview(null, newValue)
                }}
                renderInput={(params) => <TextField {...params} />}
              />
            </LocalizationProvider>

            {/* <Button variant="contained" style={{backgroundColor : "grey"}} sx={{ height: 50 , mx : 2 }} onClick={clearFilter()}>
              <FilterAltOffIcon  /> &nbsp; &nbsp;
              Clear Filter
          </Button> */}
          </Box>

          <h3><b>{loader?'':'Workforce Overview'}</b></h3>
          <Grid container rowSpacing={7} columnSpacing={{ xs: 1,marginTop:'3rem' }}>
           
            {workForce.map((report) => (
              <SiteOverviewCard
                title={report?.title}
                subTitle={report?.count}
                key={report?.id}
              />
            ))}
          </Grid>
          <h3 style={{marginTop:'2rem'}}><b>{loader?'':'Operational Overview'}</b></h3>
          <Grid container rowSpacing={7} columnSpacing={{ xs: 1 ,marginTop:'3rem' }}>
           
            {operational.map((report) => (
              <SiteOverviewCard
                title={report?.title}
                subTitle={report?.count}
                key={report?.id}
              />
            ))}
          </Grid>
          <h3 style={{marginTop:'2rem'}}><b>{loader?'':'Compliance Overview'}</b></h3>
          <Grid container rowSpacing={7} columnSpacing={{ xs: 1,marginTop:'3rem'  }}>
           
            {compliance.map((report) => (
              <SiteOverviewCard
                title={report?.title}
                subTitle={report?.count}
                key={report?.id}
              />
            ))}
          </Grid>
          <h3 style={{marginTop:'2rem'}}><b>{loader?'':'Inspections & Reports'}</b></h3>
          <Grid container rowSpacing={7} columnSpacing={{ xs: 1 ,marginTop:'3rem' }}>
           
            {inspections.map((report) => (
              <SiteOverviewCard
                title={report?.title}
                subTitle={report?.count}
                key={report?.id}
              />
            ))}

              {/* <SiteOverviewCard onClick={AddReport}
                title=" + Add Report (from site inspection & reports section)"
                subTitle = ""
              /> */}
              <div 
              style={{backgroundColor: "#DAEEEF",
              height:"8rem",
              width:"20rem",
              display: "flex",
              marginTop:"3.5rem",
              boxShadow:" 0 3px 6px rgb(0 0 0 / 0%), 0 3px 6px rgb(0 0 0 / 16%) !important", 
              borderRadius: "10px",
              alignItems: "center",
              cursor:"pointer",
              justifyContent: "center",}}>
              <button onClick={handleClickOpen}
                style={{
                padding:"2rem",
                cursor:"pointer",
                border:"none",
                textTransform: "capitalize",
                lineHeight: "1.5rem",
                fontWeight: "500",
                fontSize:"1.1rem",
                backgroundColor: "#DAEEEF"
              }}>+ Add Report (from site inspection & reports section)</button>
              </div>

          </Grid>
         

                  {/* {
          (work
          && Object.keys(work).length === 0
          && Object.getPrototypeOf(work)=== Object.prototype)?
          renderOverview({}):
          renderOverview(work)
        } */}

        </Box>
      }


    <Dialog open={open} onClose={handleClose} >
          <DialogTitle align="center">Add Report</DialogTitle>
          <DialogContent height={"500px"} style={{width:"20rem"}} >
            
                <Grid item xs={12} display="flex" flexDirection="column" mt={2}>
                  <div m={"0px"} xs={{color:'black'}}>Report Type</div>
                  <Controller
                    name={"reportTypeId"}
                    control={control}
                    rules={{
                      required: true,
                    }}

                    render={({ field: { onChange, value } }) => (
                      <Select
                        fullWidth
                        variant="outlined"
                        required
                        onChange={onChange}
                        value={value}
                        error={!!errors.category}
                        helperText={errors.category ? errors.category?.message : null}
                      >
                        {/* <MenuItem value={"HSW "}>HSW </MenuItem>
                        <MenuItem value={"Compliance"}>Compliance</MenuItem>
                        <MenuItem value={"Operational"}>Operational</MenuItem>
                        <MenuItem value={"General "}>General </MenuItem>
                        <MenuItem value={"Mandatory"}>Mandatory</MenuItem>
                        <MenuItem value={"Other "}>Other </MenuItem> */}
                       { console.log("inspections----",inspectionss)}
                        {inspectionss.map((item, index) => (
                          <MenuItem value={item?._id} key={index}>
                            {item?.name}
                          </MenuItem>
                        ))}
                      </Select>
                    )}
                  />
                </Grid>
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
                <Button disabled={false} onClick={handleSubmit(onSubmit)}>
                  Add
                </Button>
              </Grid>
            </Grid>
          </DialogActions>
        </Dialog>

    </Box>

    
  );
}
