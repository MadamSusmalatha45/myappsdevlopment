import React, { useEffect, useState } from "react";
import { Alert, Box, Link, Skeleton,  Button, Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid, } from "@mui/material";
import PageTitle from "../../common/PageTitle";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import { useDispatch, useSelector } from "react-redux";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import TableHead from "@mui/material/TableHead";
// import { blue } from '@mui/material/colors';
import { Controller, useForm } from "react-hook-form";
import { TextField } from "@mui/material";
import { red } from "@mui/material/colors";
import "./style.css";
import { selectGuards } from "../../../features/sites/sitesSlice";
import { getSiteTeam,getGuards, addSiteTeam } from "../../../features/sites/sitesAPI";
import { useParams } from "react-router-dom";
import { getAPI } from "../../network";
import Loader from "../../common/Loader";
import { checkAuthority, noRecordFound ,tableHeader,tableData,tablebtn} from "../../utils";


export default function CompanyUsers() {
  const { loading, error, data } = useSelector(selectGuards);
  const [open, setOpen] = React.useState(false);
  const [users, setUsers] = useState([])
  const [loader, setLoader] = useState(false)
  const dispatch = useDispatch();


  const { siteId } = useParams();
  // const sideUserId = localStorage.getItem("siteId");
  useEffect(() => {
    getUsers()
  }, []);

  const getUsers = async() => {
    setLoader(true)
    let data = await getAPI('/company/users')
    if(data){
      const newUsers = data.map((user) => ({
        id: user._id,
        email: user.userId.email,
        name: `${user.userId.firstname} ${user.userId.lastname}`,
        contact: user.userId.phone,
        licenseNumber: user.userId.licenseNumber,
        expiry: user.userId.expiryDate,
        postcode: user.userId.postcode,
      }));
  
      setUsers(newUsers);
    }
    setLoader(false)
  }


  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = (form) => {
    dispatch(addSiteTeam({ ...form,  id: siteId }));
    handleClose();
    // dispatch(getSitesInspectionForm({ reportType: siteId }));
    reset();
  };

  return (
    <Box sx={{ height: "inherit" }}>
      <Loader loader={loader} />
      <PageTitle
        title="Company Users"
      />
      {
        checkAuthority('VIEW_GUARDS') &&
        <Box display="flex" sx={{ my: "3rem" }}>
        <TableContainer component={Paper} sx={{ mx: "0.8rem" }}>
          <Table
            sx={{ minWidth: "auto" }}
            aria-label="custom pagination table"
            className="responsive-table"
          >
            <TableHead>
              <TableRow className="table-header">
                <TableCell align="left" component="th" sx={tableHeader}>
                  Email
                </TableCell>
                <TableCell align="left" component="th" sx={tableHeader}>
                  Name
                </TableCell>
                <TableCell align="left" component="th" sx={tableHeader}>
                  Contact
                </TableCell>
                <TableCell align="left" component="th" sx={tableHeader}>
                  Security License Number
                </TableCell>
                <TableCell align="center" component="th" sx={tableHeader}>
                  Expiry
                </TableCell>
                <TableCell align="center" component="th" sx={tableHeader}>
                  Postcode
                </TableCell>
                <TableCell
                  align="center"
                  component="th"
                  sx={tableHeader}
                  style={{ width: "13%" }}
                >
                  Licenses
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {users.map((item, index) => (
                <TableRow key={index}>
                  <TableCell align="left" sx={tableData}>
                    {item.email}
                  </TableCell>
                  <TableCell align="left" sx={tableData}>
                    {item.name}
                  </TableCell>
                  <TableCell align="left" sx={tableData}>
                    {item.contact}
                  </TableCell>
                  <TableCell align="left" sx={tableData}>
                    {item.licenseNumber}
                  </TableCell>
                  <TableCell align="center" sx={tableData}>
                    {item.expiry}
                  </TableCell>
                  <TableCell align="center" sx={tableData}>
                    {item.postcode}
                  </TableCell>
                  <TableCell align="center" sx={tableData}>
                    <Link href="#" underline="none">
                      {"View"}
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
              {noRecordFound(users,7)}

              
              {/* <TableRow key="last">
                <TableCell
                  align="left"
                  sx={tableData}
                  component={Button}
                  sx={{
                    fontWeight: "bold !important",
                    py: 1,
                    ml: 1,
                    color: "#75859D !important",
                  }}
                  onClick={handleClickOpen}
                >
                  Add
                  <AddCircleIcon className="add-icon" fontSize="large" />
                </TableCell>
                <TableCell align="left" sx={tableData}></TableCell>
                <TableCell align="left" sx={tableData}></TableCell>
                <TableCell align="left" sx={tableData}></TableCell>
              </TableRow> */}
            </TableBody>
          </Table>
 
        </TableContainer>
       
      </Box>
      }
       <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Enter Email</DialogTitle>
          <DialogContent>
            <Grid
              container
              spacing={2}
              justifyContent="center"
              my={3}
              component="form"
            >
              <Grid item xs={7} justifyContent="center" display="flex">
                <Controller
                  name={"email"}
                  control={control}
                  rules={{
                    required: true,
                  }}
                  render={({ field: { onChange, value } }) => (
                    <TextField
                      fullWidth
                      label="email"
                      variant="standard"
                      type="email"
                      required
                      onChange={onChange}
                      value={value}
                      sx={{ borderColor: red[100] }}
                      error={!!errors.email}
                      helperText={
                        errors.email ? errors.email : null
                      }
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
                  disabled={loading}
                  color="secondary"
                  onClick={handleClose}
                >
                  Cancel
                </Button>
                <Button disabled={loading} onClick={handleSubmit(onSubmit)}>
                  Add
                </Button>
              </Grid>
            </Grid>
          </DialogActions>
        </Dialog>
    </Box>
  );
}
