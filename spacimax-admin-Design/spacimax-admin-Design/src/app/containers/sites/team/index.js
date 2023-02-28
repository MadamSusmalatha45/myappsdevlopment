import React, { useEffect, useState } from "react";
import { Alert, Box, Link, Skeleton,  Button, Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  FormControl,
  InputLabel, } from "@mui/material";
import PageTitle from "../../../common/PageTitle";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import TableHead from "@mui/material/TableHead";
import "./style.css";
import { useParams } from "react-router-dom";
import { getAPI, postAPI } from "../../../network";
import { checkAuthority, formatDate, fullName, setTitle } from "../../../utils";
import Loader from "../../../common/Loader";
import Select from 'react-select'
import {tableHeader, tableData} from '../../../utils'

export default function SiteTeamPage() {
  const [open, setOpen] = React.useState(false);
  const [sites, setSites] = useState([]);
  const [users, setUsers] = useState([]);
  const [members, setMembers] = useState([]);
  const [all, setAll] = useState([])
  const [user, setUser] = useState([]);
  const [loader, setLoader] = useState(false);
  const [show, setShow] = useState(false)
  const [member, setMember] = useState({})
  const { siteId } = useParams();
  const userType = localStorage.getItem('userType')
 

  useEffect(() => {
    getSite();
    getSiteTeamMembers();
    getUsers();
    setTitle('Site | Site Team');
  }, [ siteId]);

  const getUsers = async() => {
    setLoader(true);
    let data = await getAPI('/users/app');
    if(data){
      let emails = data.map((item) => ({
        id : item.id,
        label : fullName(item) + `(${item.email})`,
        value : item.email
      }))
      setUsers(emails) 
    }
    setLoader(false);
  }
 const getSiteTeamMembers = async() => {
    setLoader(true);
    let data = await getAPI(`/sites/site-team/${siteId}`)
    if(data){
      setAll(data)
      const newUsers = data.map((user) => ({
        id: user._id,
        email: user.email.toLowerCase(),
        name: fullName(user),
        contact: ('+' + user.phone).toString(),
        role: user.role,
      }));
      setMembers(newUsers)
    }
    setLoader(false);
  }
 

 
  const getSite = async() => {
     let url = userType === 'admin' ? '/sites' : '/company/sites';
     let data = await getAPI(url);
     if(data){
      setSites(data)
     }
  }

  const handleClickOpen = () => {
    setUser('')
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const getSiteName = () => {
    if(sites.length > 0){
      let site =  sites.filter((item) => item._id === siteId)[0];
      return site.name + ', ' + site.address + ', ' + site.city?.name ;
    }
    else{
      return '';
    }
  }

  const onSubmit = async() => {
    let payload = {
      email : user.value
    }
    setLoader(true)
    let data = await postAPI(`/sites/add-member/${siteId}`, payload)
    if(data) {
      getSiteTeamMembers();
      setOpen(false)
    }
    setLoader(false)
  };

  const viewMember = (id) => {
    let member = all.filter((item) => item._id === id)[0];
    setMember(member);
    setShow(true)
  }



  return (
    <Box sx={{ height: "inherit" }}>
      <Loader loader={loader} />
      <PageTitle
        title="Site View"
        subTitle={`${getSiteName()} / Site Team`}
      />
      {
        checkAuthority('VIEW_SITE_TEAMS') &&
        <Box display="flex" sx={{ my: "3rem" }}>
        <TableContainer component={Paper} sx={{ mx: "0.8rem" }}>
          <Table
            sx={{ minWidth: "auto" }}
            aria-label="custom pagination table"
            className="responsive-table"
          >
            <TableHead>
              <TableRow className="table-header">
                <TableCell align="left" component="th"  sx={tableHeader}>
                  Role
                </TableCell>
                <TableCell align="left" component="th"  sx={tableHeader}>
                  Name
                </TableCell>
                <TableCell align="left" component="th"  sx={tableHeader}>
                  Contact
                </TableCell>
                <TableCell align="left" component="th"  sx={tableHeader}>
                  Email
                </TableCell>
                <TableCell align="left" component="th"  sx={tableHeader}>
                 License
                </TableCell>
                <TableCell align="center" component="th" sx={tableHeader}
                  style={{ width: "13%" }}
                >
                  View Information
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {members.map((item, index) => (
                <TableRow key={index}>
                  <TableCell align="left" sx={tableData}>
                    {item.role}
                  </TableCell>
                  <TableCell align="left" sx={tableData}>
                    {item.name}
                  </TableCell>
                  <TableCell align="left" sx={tableData}>
                    {item.contact}
                  </TableCell>
                  <TableCell align="left" sx={tableData}>
                    {item.email.toLowerCase()}
                  </TableCell>
                  <TableCell align="center" sx={tableData}>
                    <Link href={`/user/license/${item?.id}`} underline="none">
                      {"View"}
                    </Link> 
                  </TableCell>
                  <TableCell align="center" sx={tableData}>
                    <Link href="#" underline="none" className="file" onClick={() => {viewMember(item.id)}}>
                      {"View"}
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
              <TableRow key="last" >
                <TableCell
                  direction="column" justifycontent="center" colSpan={2}
                >
                  <Link href="#" underline="none" onClick={handleClickOpen}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        justifyContent: 'space-between'

                    }}>
                        <span className="add">Add Site Team Member</span>
                        <AddCircleIcon className="add-icon" fontSize="medium"/>
                    </div>  
                  </Link>
                
                </TableCell>
                <TableCell align="left"  sx={tableData}></TableCell>
                <TableCell align="left"  sx={tableData}></TableCell>
                <TableCell align="left"  sx={tableData}></TableCell>
              </TableRow>
            </TableBody>
          </Table>
         
        </TableContainer>
        <Dialog open={open} onClose={handleClose} fullWidth={true}>
          <DialogTitle align="center">Add Team Member</DialogTitle>
          <DialogContent sx={{width : '100%'}} style={{width : '100%',height:'20rem'}}>
             <FormControl fullWidth sx={{my : 2, mb :10}}>
              <span style={{fontWeight : 'bold', fontSize : 18, marginBottom : 5}}>Search Email</span>
             <Select
                value={user}
                onChange={(data) => setUser(data)}
                options={users}
                style={{zIndex :900}}
              />
             </FormControl>
          </DialogContent>
          <DialogActions sx={{mb : 2 , mx : 4}}>
                <Button onClick={onSubmit} variant="contained" color="primary" disabled={user === '' ? true : false} >Add</Button> &nbsp; &nbsp;
                <Button onClick={handleClose} variant="outlined">Cancel</Button>
          </DialogActions>
        </Dialog>

        <Dialog open={show} onClose={() => setShow(false)} fullWidth={true}>
          <DialogTitle align="center">Team Member Information</DialogTitle>
          <DialogContent style={{width : '100%' , paddingTop : 40, paddingLeft : 20 }}>
            <FormControl fullWidth  sx={{p : 4}}>
          <Table
            // sx={{ minWidth: "auto" }}
            aria-label="custom pagination table"
            className="responsive-table"
          >
            
            <TableHead>
              <TableRow className="table-header">
                <TableCell align="left" component="th"  sx={tableHeader}>
                  Key
                </TableCell>
                <TableCell align="left" component="th"  sx={tableHeader}>
                  Value
                </TableCell>
               
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow >
                  <TableCell align="left"  sx={tableData}>
                    Name
                  </TableCell>
                  <TableCell align="left"  sx={tableData}>
                   {fullName(member)}
                  </TableCell>
              </TableRow>
              <TableRow >
                  <TableCell align="left"  sx={tableData}>
                    Role
                  </TableCell>
                  <TableCell align="left"  sx={tableData}>
                   {member.role}
                  </TableCell>
              </TableRow>
              <TableRow >
                  <TableCell align="left"  sx={tableData}>
                    Email
                  </TableCell>
                  <TableCell align="left"  sx={tableData}>
                   {member.email}
                  </TableCell>
              </TableRow>
              <TableRow >
                  <TableCell align="left"  sx={tableData}>
                    Gender
                  </TableCell>
                  <TableCell align="left"  sx={tableData}>
                   {member.gender}
                  </TableCell>
              </TableRow>
              <TableRow >
                  <TableCell align="left"  sx={tableData}>
                    Logged In As
                  </TableCell>
                  <TableCell align="left"  sx={tableData}>
                   {member.login_as}
                  </TableCell>
              </TableRow>
              <TableRow >
                  <TableCell align="left"  sx={tableData}>
                    Phone
                  </TableCell>
                  <TableCell align="left"  sx={tableData}>
                   {member.phone}
                  </TableCell>
              </TableRow>
              <TableRow >
                  <TableCell align="left"  sx={tableData}>
                    Postal Code
                  </TableCell>
                  <TableCell align="left"  sx={tableData}>
                   {member.postcode}
                  </TableCell>
              </TableRow>
              <TableRow >
                  <TableCell align="left"  sx={tableData}>
                    Created At
                  </TableCell>
                  <TableCell align="left"  sx={tableData}>
                   {formatDate(member.createdAt)}
                  </TableCell>
              </TableRow>
            </TableBody>
            </Table>
            </FormControl>
          </DialogContent>
          <DialogActions sx={{mb : 2 , mx : 4}}>
                <Button onClick={() => setShow(false)} variant="outlined">Cancel</Button>
          </DialogActions>
        </Dialog>
      </Box>
      }
      
    </Box>
  );
}
