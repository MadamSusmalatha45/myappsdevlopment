import React, {useEffect, useState} from "react";
import { Box, FormControl,Button} from "@mui/material";
import PageTitle from "../../common/PageTitle";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Loader from "../../common/Loader";
import Select from 'react-select'
import AsyncSelect from 'react-select/async';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';  
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableFooter from "@mui/material/TableFooter";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableHead from "@mui/material/TableHead";
import Paper from "@mui/material/Paper";
import Checkbox from '@mui/material/Checkbox';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid';


import './style.css'
import { deleteAPI, getAPI, patchAPI, postAPI } from "../../network";
import { setISODay } from "date-fns";
import { validation,tableHeader,tableData,tablebtn } from "../../utils";
import EmptyTable from "../../common/EmptyTable";

export default function Role() {
  const [loader, setLoader] = useState(false)
  const [open, setOpen] = useState(false)
  const [show, setShow] = useState(false)
  const [action, setAction] = useState('add')
  const [id, setId] = useState(0)
  const [newPermission, setNewPermission] = useState('')
  const [addPermission, setAddPermission] = useState(false)
  const [newPermissionError, setNewPermissionError] = useState(false)
  const [role, setRole] = useState({
    id : '',
    idError : false,
    name : '',
    nameError : false,
    permissions : [],
    permissionsError : false
  })

  const [permissions, setPermissions] = useState([
    // {label : 'USER LIST', value :'user_list'},
    // {label : 'USER ADD', value :'user_add'},
    // {label : 'USER EDIT', value :'user_edit'},
    // {label : 'USER DELETE', value :'user_delete'},
    // {label : 'COMPANY LIST', value :'company_list'},
    // {label : 'COMPANY ADD', value :'company_add'},
    // {label : 'COMPANY EDIT', value :'company_edit'},
    // {label : 'COMPANY DELETE', value :'company_delete'},
  ])

  const [roles, setRoles] = useState([
    // {id : 1, name :'Role 1', permissions : [
    //     {label : 'USER LIST', value :'user_list'},
    //     {label : 'USER ADD', value :'user_add'},
    //     {label : 'USER EDIT', value :'user_edit'},
    // ]},
    // {id : 2, name :'Role 2', permissions : [
    //     {label : 'COMPANY ADD', value :'company_add'},
    //     {label : 'COMPANY EDIT', value :'company_edit'},
    //     {label : 'COMPANY DELETE', value :'company_delete'},
    // ]},
    // {id : 3, name :'Role 3', permissions : [
    //     {label : 'USER EDIT', value :'user_edit'},
    //     {label : 'USER DELETE', value :'user_delete'},
    //     {label : 'COMPANY LIST', value :'company_list'},
    //     {label : 'COMPANY ADD', value :'company_add'},
    // ]}
  ])

  useEffect(() => {
    getRoles()
    getPermissions()
  },[]);

  const getRoles = async() => {
    setLoader(true)
    let data = await getAPI('/adm/roles');

    if(data){
         var arr = [];
         for(var i =0 ; i < data.length ; i++){
           var obj = {
            id : data[i].id,
             name : data[i].name
           }
           var perArr = [];

           for(var j = 0; j < data[i].permissions.length; j++){
              perArr.push({
                id : data[i].permissions[j]._id,
                label : data[i].permissions[j].name,
                value : data[i].permissions[j]._id
              })
           }
           obj['permissions'] = perArr;
           arr.push(obj)
         }

        setRoles(arr)
    }
    setLoader(false)
  }

  const getPermissions = async() => {
    setLoader(true)
    let data = await getAPI('/adm/modules');
    if(data){
        var arr = [];
        for(var i = 0; i < data.length; i++){
          arr.push({id : data[i].id, label : data[i].name, value : data[i].id});
        }
        setPermissions(arr)
    }
    setLoader(false)
  }

  const addRole = () => {
    setRole({
      id : '',
      idError : false,
      name : '',
      permissions : [],
      nameError : false,
      permissionsError : false,
    })
    setAction('add')
    setOpen(true)
  }

  const handleClose = () =>{
    setOpen(false)   
  }

  const handleSubmit = async(type) => {
     setRole({
        ...role,
        nameError : false,
        permissionsError : false
     })

     if(validation(null, 'Role Name', role.name)){
        setRole({
            ...role,
            nameError : true,
         })
         return false;
     }
     else if(validation('array','Permissions', role.permissions)){
        setRole({
            ...role,
            permissionsError : true,
         })
        return false;
     }

     var permissions = [];
     for(var i = 0 ; i< role.permissions.length ; i++){
      permissions.push(role.permissions[i].id);
     }

     
      let payload = {
        name : role.name,
        permissions : permissions
       }

      setLoader(true)

      var data = false;
      if(action === 'add'){
         data = await postAPI('/adm/roles',payload)
      }
      else{ 
        // console.log(`/adm/roles/${role.id}`)
        // console.log(payload)
         data = await patchAPI(`/adm/roles/${role.id}`,payload)
      }
      if(data){
       getRoles()
       getPermissions();
       setOpen(false)
      }

      setLoader(false)
     
     
  }

  const editRoleClick = (id) => {
    let data = roles.filter((item) => item.id === id)[0]
    setRole({
       id : id,
      name : data.name,
      permissions : data.permissions,
      idError : false,
      nameError : false,
      permissionsError : false
    });


    setAction('edit')

    setOpen(true)
  }

  const handleShowClose = () => {
    setShow(false)
  }

  const handleDelete = () => {

  }

  const changePermission = (data) => {
    setRole({
        ...role,
        permissions : data
    })
  }

  const deleteRoleClick = (id) => {
    setId(id)
    setShow(true)
  }

  const updatePermissions = async(chk, id, label, value) => {
     let data = roles.filter((item) => item.id === id)[0];
     var arr = [];
     for(var i = 0; i < data.permissions.length ; i++){
      arr.push(data.permissions[i].id)
     }
     if(chk){
       arr.push(value)
     }
     else{
       arr  = arr.filter(function(item) {
        return item !== value
       })
     }
     arr = arr.filter((item, i, ar) => ar.indexOf(item) === i);
     let payload = {
      name : data.name,
      permissions : arr
     }
    setLoader(true);
    let res = await patchAPI(`/adm/roles/${id}`,payload)
    if(res){
        getRoles()
    }
    setLoader(false)
  }

  const deleteRole = async() => {
    setLoader(true)
    let data = await deleteAPI(`/adm/roles/${id}`);
    if(data){
        getRoles()
        setShow(false)
    }
    setLoader(false)
  }
  
  const handleChange = async(id, value, e, label) => {
     let data = e.target.checked;
     let newRoles = roles.map((item) => {
        if(id === item.id){
          if(data){
            var perArr = [];
            let objs = item.permissions.filter((obj) => obj.value != value);
            perArr = objs
            let newItem = item;
            perArr.push({label : label, value : value})
            newItem['permissions'] = perArr
            return newItem;
          }
          else{
            let objs = item.permissions.filter((obj) => obj.value != value);
            let newItem = item;
            newItem['permissions'] = objs
            return newItem;
          }
        }
        else{
            return item;
        }
     })
     setRoles(newRoles)
     updatePermissions(data, id, label, value)
  }

  const renderItem = (item) => {
    var arr = []
    for(var i =0; i < permissions.length ; i++){
        let data = item.filter((per) => per.value === permissions[i].value);
        if(data.length > 0){
            arr.push({label : permissions[i].label , value :  permissions[i].value, checked : true})
        }
        else{
            arr.push({label :  permissions[i].label , value :  permissions[i].value, checked : false})
        }
    }
    return arr;
    // return [];
  }

  const addPermissionClick =  () => {
    setNewPermission('');
    setNewPermissionError(false)
    setAddPermission(true)
  }

  const handlePermissionClose = () => {
    setAddPermission(false)
  }

  const handlePermissionSubmit = async() => {
    setNewPermissionError(false);
    if(validation(null, 'Permission Name', newPermission)){
      setNewPermissionError(true)
      return false;
    }

    setLoader(true)
    let data = await postAPI('/adm/modules',{name : newPermission})
    if(data){
      getPermissions()
      setAddPermission(false)
    }
    setLoader(false)
  }

  return (
    <Box sx={{ height: "inherit" }}>
      <Loader loader={loader} />
      <PageTitle title="Specimax" subTitle="Companies Role" />
        <Box
            display="flex"
            justifyContent="flex-end"
            alignItems="flex-end"
            sx={{mx : 2}}
        >
            <Button variant="contained" size="medium" style={{backgroundColor : "grey"}} sx={{  }} onClick={addRole}>
              <AddCircleIcon /> &nbsp; &nbsp;
            Add Role
            </Button>

            <Button variant="contained" size="medium" style={{backgroundColor : "grey"}} sx={{ ml : 2 }} onClick={addPermissionClick}>
              <AddCircleIcon /> &nbsp; &nbsp;
            Add Permission
            </Button>
        </Box> 

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
                  Role
                </TableCell>
                <TableCell align="left" component="th" sx={tableHeader}>
                  Permissions
                </TableCell>
                <TableCell align="center" component="th" sx={tableHeader} >
                  Action
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {roles.map((item, index) => (
                <TableRow key={index}>
                  <TableCell align="left" sx={tableData}>
                    {item?.name}
                  </TableCell>
  
                  <TableCell align="left" sx={tableData} className="permission">
                    <Grid container spacing={2}>
                       {
                         renderItem(item.permissions).map((it, index) => (
                            <Grid item xs={12} sm={6} md={3}  key={index}  >
                                <FormControlLabel className="chkLabel" control={
                                    <Checkbox
                                    className="check"
                                    checked={it.checked}
                                    onChange={(data) => {handleChange(item.id, it.value, data, it.label)}}
                                    inputProps={{ 'aria-label': 'controlled' }}
                                   />
                                } 
                                label={it.label}
                               />
                            </Grid>
                         ))
                       }
                    </Grid>
                  </TableCell>
                  <TableCell align="center"  sx={{textAlign : 'center',tableData}}>
                    <Button variant="outlined" color="primary" className="btn-div" onClick={() => editRoleClick(item?.id)} sx={{mr : 2}}>
                      <EditIcon className="btn"/>
                    </Button>
                    {/* <Button variant="outlined" color="error" className="btn-div" onClick={() => deleteRoleClick(item?.id)}>
                      <DeleteIcon className="btn"/>
                    </Button> */}
                  </TableCell>
                </TableRow>
              ))}
              {
                roles.length === 0 &&
                <EmptyTable colSpan={3} />
              }


            </TableBody>
            
          </Table>
          {/* </div> */}
        </TableContainer>
      </Box>
   
      <Dialog open={open} onClose={handleClose} fullWidth={true} >
        <DialogTitle sx={{ mb: 4 , textAlign :"center"}}>
            {action === 'add' ? 'Add' : 'Edit'} Role
        </DialogTitle>
        <DialogContent sx={{height:"25rem"}}>
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
              label="Role Name" 
              variant="outlined" 
              type="text" 
              value={role.name}
              error={role.nameError}
              onChange={(data) => {
                setRole(prevState => ({
                    ...prevState,
                    name: data.target.value,
                }))
              }}
              fullWidth
              sx={{m : 0}}
            />
          </FormControl>

          <FormControl sx={{  minWidth : '97%', mx : 0, px :0 , mb : 4}}>
         
            <Select
                defaultValue={role.permissions}
                isMulti
                name="permissions"
                options={permissions}
                className="basic-multi-select"
                classNamePrefix="select"
                onChange={(data) => {changePermission(data)}}
                error={role.permissionsError}  
            />
          </FormControl>

          
          </Box>
        </DialogContent>
        <DialogActions sx={{mb : 2 , mx : 4}}>
          <Button onClick={handleSubmit} variant="contained">{action === 'add' ? 'Submit' : 'Update'}</Button>
          <Button onClick={handleClose} variant="outlined">Cancel</Button>
        </DialogActions>
      </Dialog>



      <Dialog open={addPermission} onClose={handlePermissionClose} fullWidth={true}>
        <DialogTitle sx={{ mb: 4 , textAlign :"center" }}>
            Add Permission
        </DialogTitle>
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
              id="permission_name" 
              label="Permission Name" 
              variant="outlined" 
              type="text" 
              value={newPermission}
              error={newPermissionError}
              onChange={(data) => {
                setNewPermission((data.target.value.toUpperCase()))
              }}
              fullWidth
              sx={{m : 0}}
            />
          </FormControl>

          </Box>
        </DialogContent>
        <DialogActions sx={{mb : 2 , mx : 4}}>
          <Button onClick={() => {handlePermissionSubmit(action)}} variant="contained">{action === 'add' ? 'Submit' : 'Update'}</Button>
          <Button onClick={handlePermissionClose} variant="outlined">Cancel</Button>
        </DialogActions>
      </Dialog>


      {/* delete Modal */}
      <Dialog open={show} onClose={handleShowClose} fullWidth={true}>
        <DialogTitle sx={{ mb: 4 , textAlign :"center" }}>Delete Role</DialogTitle>
        
        <DialogContent>
          <Box
            component="form"
            sx={{
              '& .MuiTextField-root': { my: 2, width: '100%' },
            }}
            noValidate
            autoComplete="off"
          >

            <h3 style={{textAlign : 'left', fontWeight :'bold', textAlign :'center'}}>Do you want's to delete this ROLE </h3>
          </Box>
        </DialogContent>
        <DialogActions sx={{mb : 2 , mx : 4}}>
          <Button onClick={deleteRole} variant="contained" color="error">Delete</Button>
          <Button onClick={handleShowClose} variant="outlined">Cancel</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
