import React, { useEffect, useState } from "react";
import {
  Box, Link, Button, Dialog, Skeleton,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
} from "@mui/material";
import PageTitle from "../../../common/PageTitle";
import Table from '@mui/material/Table';
import InputLabel from '@mui/material/InputLabel';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableFooter from '@mui/material/TableFooter';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TableHead from '@mui/material/TableHead';
import { useDispatch, useSelector } from "react-redux";
import { selectSiteInspection } from "../../../../features/sites/sitesSlice";
// import { blue } from '@mui/material/colors';
import MenuItem from '@mui/material/MenuItem';
import { Controller, useForm } from "react-hook-form";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { TextField, Select } from "@mui/material";
import { red } from "@mui/material/colors";
import "./style.css";
import {
  siteInspection,
  getSitesInspection,
} from "../../../../features/sites/sitesAPI";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { getAPI, postAPI } from "../../../network";
import Loader from "../../../common/Loader";
import { checkAuthority, tableHeader, tableData } from "../../../utils";
import { margin, padding } from "@mui/system";

export default function SiteInspectionPage() {
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { siteId } = useParams();
  const [loader, setLoader] = useState(false)
  const [inspections, setInspections] = useState([])
  const [sites, setSites] = useState([])
  const [allreports,setallReportsType]=useState([])
  // const { loading, error, data } = useSelector(selectSiteInspection);



  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      name: "",
      reportTypeId: "",
      siteId: siteId,
      description: "",

    },
  });
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  
  

  const onSubmit = async (form) => {
    
    setLoader(true)
    let data = await postAPI(`/report-types`, form)
    // console.log("data post-----------///////", data)
    if (data) {
      getSitesInspectionList()
      handleClose();
      reset();
    }
    setLoader(false)

  };

  useEffect(() => {
    getSitesInspectionList()
    getSites();
    getReportTypeList()
    // dispatch(getSitesInspection({ siteId: siteId }));
  }, []);

  const getSites = async () => {
    setLoader(true)
    let userType = localStorage.getItem('userType')
    let data = await getAPI(userType === 'admin' ? '/sites' : '/company/sites');
    if (data) {
      setSites(data)
    }
    setLoader(false)
  }





  const getSitesInspectionList = async () => {
    setLoader(true)

    let data = await getAPI(`/report-types?siteId=${siteId}`)
   
    if (data) {
      setInspections(data)
    }
    setLoader(false)
  }
  const getReportTypeList = async () => {
    setLoader(true)

    let data = await getAPI(`/all-report-types`)
    console.log("All get DATA-------------", data)
    if (data) {
      setallReportsType(data)
    }
    setLoader(false)
  }

  const handleNavigateForm = (id,repId,inspId) => {
    console.log("-----------------------------------------",id,repId.inspId)
    navigate(`${window.location.pathname}/form/${id}/${repId}/${inspId}`);
  }

  const getSiteName = () => {
    if (sites.length > 0) {
      let site = sites.filter((item) => item._id === siteId)[0];

      return site.name + ', ' + site.address + ', ' + site.city?.name + ' / Site Inspection'
    }
    else {
      return '';
    }
  }



  return (
    <Box sx={{ height: "inherit" }}>
      <Loader loader={loader} />
      <PageTitle title="Site View" subTitle={getSiteName()} />
      <Box display="flex" sx={{ my: "4rem" }}>

        {
          checkAuthority('VIEW_SITE_INSPECTIONS') &&
          <TableContainer component={Paper} sx={{ mx: "0.8rem" }} >
            <Table sx={{ minWidth: 'auto' }} aria-label="custom pagination table" className="responsive-table">
              <TableHead >
                <TableRow className="table-header">
                  <TableCell align="left" component="th" sx={tableHeader}>Report Category</TableCell>
                  <TableCell align="left" component="th" sx={tableHeader}>Report Name</TableCell>
                  <TableCell align="left" component="th" sx={tableHeader}>Description</TableCell>
                  <TableCell align="center" component="th" sx={tableHeader}>Form</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>

           
                {
                  inspections.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell align="left" sx={tableData}>
                        {item?.reportTypeId?.name}
                      </TableCell>
                      <TableCell align="left" sx={tableData}>
                        {item?.name}
                      </TableCell>
                      <TableCell align="left" sx={tableData}>
                        {item?.description}
                      </TableCell>
                      {
                        checkAuthority('ADD_INSPECTION_FORM') ?
                          <TableCell align="center" className="t-body-cell font-bold" onClick={() => handleNavigateForm(item?.siteId?._id,item?.reportTypeId?._id,item?._id)}>
                            <span className="formBtn">{'Create Form'}</span>
                          </TableCell>
                          :
                          <TableCell align="center" className="t-body-cell font-bold">
                            <span className="formBtn"></span>
                          </TableCell>
                      }

                    </TableRow>
                  ))
                }
              </TableBody>
              {
                checkAuthority('ADD_SITE_INSPECTION') &&
                <TableFooter>
                  <TableRow>
                    <TableCell sx={tableData} direction="column" justifyContent="center" onClick={handleClickOpen}>
                      <Link href="#" underline="none" >
                        <div className="custom-table-cell">
                          <span className="add-title">Add Report</span>
                          <AddCircleIcon className="add-icon" fontSize="medium" />
                        </div>
                      </Link>
                    </TableCell>
                    <TableCell align="left" sx={tableData}>
                    </TableCell>
                    <TableCell align="left" sx={tableData}>
                    </TableCell>
                    <TableCell align="left" sx={tableData}>
                    </TableCell>
                  </TableRow>
                </TableFooter>
              }

            </Table>
          </TableContainer>
        }


        <Dialog open={open} onClose={handleClose}>
          <DialogTitle align="center">Add Report</DialogTitle>
          <DialogContent height={"500px"}>
            <Grid
              container
              spacing={2}
              mt={3}
              component="form">
              <Grid item xs={12} display="flex">
            
                <Controller
                  name={"name"}
                  control={control}
                  rules={{
                    required: true,
                  }}
                  render={({ field: { onChange, value } }) => (
                    <TextField
                      fullWidth
                      label="Report Name"
                      variant="outlined"
                      type="text"
                      required
                      onChange={onChange}
                      value={value}
                      sx={{ borderColor: red[100] }}
                      error={!!errors.name}
                      helperText={
                        errors.name ? errors.name?.message : null
                      }
                    />
                  )}
                />
              </Grid>
                {/* <Grid item xs={12} display="flex" flexDirection="column" m={0}>
                  <div m={"0px"}>Report Name</div>
                  <Controller
                    name={"name"}
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
                        error={!!errors.site}
                        helperText={errors.site ? errors.site?.message : null}
                      >
                        <MenuItem value="">
                          <div className="selectitem">Select Report</div>
                        </MenuItem>
                        {reports.map((item, index) => (
                          <MenuItem value={item.} key={index}>
                            {item.name}
                          </MenuItem>
                        ))}
                      </Select>
                    )}
                  />
                </Grid> */}

                <Grid item xs={12} display="flex" flexDirection="column" m={0}>
                 
                  <InputLabel id="gender-label">Report Category</InputLabel>
                  <Controller
                    name={"reportTypeId"}
                    control={control}
                    rules={{
                      required: true,
                    }}

                    render={({ field: { onChange, value } }) => (
                      
                      <Select
                        fullWidth
                        labelId="gender-label"
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
                        {allreports.map((item, index) => (
                          <MenuItem value={item?.id} key={index}>
                            {item?.name}
                          </MenuItem>
                        ))}
                      </Select>
                    )}
                  />
                </Grid>



                <Grid item xs={12} display="flex">
                  <Controller
                    name={"description"}
                    control={control}
                    rules={{
                      required: true,
                      min: {
                        message: "Minimum Value Is Zero",
                        value: 0,
                      },
                    }}
                    render={({ field: { onChange, value } }) => (
                      <TextField
                        fullWidth
                        label="Description"
                        variant="outlined"
                        type="text"
                        required
                        onChange={onChange}
                        value={value}
                        error={!!errors.description}
                        helperText={errors.description ? errors.description?.message : null}
                      />
                    )}
                  />
                </Grid>
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
    </Box>
  );
}


