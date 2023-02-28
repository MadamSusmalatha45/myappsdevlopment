
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
import { getAPI, postAPI } from "../../network";
import Loader from "../../common/Loader";
import EmptyTable from "../../common/EmptyTable";
import { checkAuthority,tableHeader,tableData} from "../../utils";

export default function Guards() {
  const [open, setOpen] = React.useState(false);
  const [loader, setLoader] = useState(false)
  const [users, setUsers] = useState([]);
  const permissions = localStorage.getItem('permissions')

  const { siteId } = useParams();
  useEffect(() => {
    getGuards()

  }, []);

  const getGuards = async() => {
    setLoader(true)
    let data = await getAPI(`/admin/guards`)

    if(data){
      const newUsers = data.map((user) => ({
        id: user._id,
        email: user.email,
        name: `${user.firstname} ${user.lastname}`,
        contact: user.phone,
        licenseNumber: user.licenseNumber,
        expiry: user.expiryDate,
        postcode: user.postcode,
      }));
      
      setUsers(newUsers);
      // setGuards(data)  
    }
    setLoader(false)
  }

  useEffect(() => {
    getGuards()
  }, []);

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

  const onSubmit = async(form) => {
    setLoader(true)
    let data = await postAPI(`/sites/add-member/${siteId}`, {email : form.email})
    if(data){
      getGuards()
      handleClose();
      reset();
    }
    setLoader(false)
  };

  return (
    <Box sx={{ height: "inherit" }}>
      <Loader loader={loader} />
      <PageTitle
        title="Security Guards"
      />
      <Box display="flex" sx={{ my: "3rem" }}>

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
                <TableCell align="left" component="th" sx={tableHeader}>
                  Expiry
                </TableCell>
                <TableCell align="left" component="th" sx={tableHeader}>
                  Postcode
                </TableCell>
                <TableCell
                  align="left"
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
                    <Link href={`/user/profile/${item.id}`}> {item.email}</Link>
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
                  <TableCell align="left" sx={tableData}>
                    {item.expiry}
                  </TableCell>
                  <TableCell align="left" sx={tableData}>
                    {item.postcode}
                  </TableCell>
                  <TableCell align="center" sx={tableData}>
                    <Link href={`/user/license/${item?.id}`} underline="none">
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
          </Table>
          {/* </div> */}
        </TableContainer>
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
