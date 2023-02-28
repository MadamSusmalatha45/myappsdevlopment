import React, {useEffect, useState} from "react";
import { Box, FormControl, Grid, Link, Modal, Typography, Button} from "@mui/material";
import PageTitle from "../../common/PageTitle";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableFooter from "@mui/material/TableFooter";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import TableHead from "@mui/material/TableHead";
import { getAPI, postAPI , patchAPI, deleteAPI} from "../../network";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import CircularProgress from '@mui/material/CircularProgress';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

import { checkAuthority, formatDate, validation,tableHeader,tableData,tablebtn} from "../../utils";
import Loader from "../../common/Loader";
import EmptyTable from "../../common/EmptyTable";

export default function Shifttype() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState('');

  const [editId, setEditId] = useState('');
  const [action, setAction] = useState('');
  const [show, setShow] = useState(false);
  const [loader, setLoader] = useState(false);
  const [shifts, setShift] = useState([]);
  const [person, setPerson] = useState({
    name :'',
    nameError : false
  })
 

  useEffect(() => {
    getShifts();
  },[]);

  const getShifts = async () => {
    setLoader(true)
    let data = await getAPI('/shift-types');
    if(data) {
      setShift(data)
    }
    setLoader(false)
  }

 

  const handleChangePage = () => {};

  const handleChangeRowsPerPage = () => {};

  const TablePaginationActions = () => {};


  const addLicense = (e) => {
    e.preventDefault();
    setAction('add');
    clearAll();
    setOpen(true)
  }

  const editShift = (e, id) => {
    e.preventDefault();
    setEditId(id)
    setAction('edit');
    clearAll();
    let data = shifts.filter(item => item.id == id)[0];

    setPerson({
        ...person,
        name : data.name,
        nameError : false
    })

   
    setOpen(true)
    
  }

  const deleteshift = (id) => {
    
    setEditId(id);
    clearAll();
    setShow(true);
  }

  const clearAll = () => {
    setPerson({
        name :'',
        nameError : false
      })
  }

  const handleClose = () => {
    setOpen(false)
  }
  const handleShowClose = () => {
    setShow(false);
  }


  const handleSubmit = async(e) => {
    e.preventDefault();
    setPerson(prevState => ({
        ...prevState,
        nameError: false,
    }))

    if(validation(null, 'Name', person.name)){
        setPerson(prevState => ({
            nameError: true,
        }))
        return;
    }
   


    let payload = {
        name : person.name,
    }

    // console.log(payload,"pay")
    if(action === 'add'){
       setLoader(true)
       let data = await postAPI('/shift-types', payload)
       if(data){
        getShifts()
        setOpen(false)
       }
       setLoader(false)
    }
    else{
        setLoader(true)
        let data = await patchAPI(`/shift-types/${editId}`, payload)
        if(data){
         getShifts()
         setOpen(false)
        }
        setLoader(false)
     }
  }

  const handleDelete = async() => {
    setLoader(true);
    let process = await deleteAPI(`/shift-types/${editId}`);
    setLoader(false);
    if(process){
      getShifts();
      setShow(false)
    }
  }

  return (
    <Box sx={{ height: "inherit" }}>
      <Loader loader={loader} />
      <PageTitle title="Secuber" subTitle="Shift-Types" />
      {
        checkAuthority('ADD_SHIFT')  &&
        <Box
            display="flex"
            justifyContent="flex-end"
            alignItems="flex-end"
            sx={{mx : 2}}
        >
            <Button variant="contained" style={{backgroundColor : "grey"}} sx={{ height: 50 }} onClick={addLicense}>
              <AddCircleIcon /> &nbsp; &nbsp;
            Add SHIFT
            </Button>
        </Box> 
      }
      {
        checkAuthority('VIEW_SHIFTS') &&
        <Box display="flex" sx={{ my: "2rem" }}>
        <TableContainer component={Paper} sx={{ mx: "0.8rem" }}>
          <Table
            sx={{ minWidth: "auto" }}
            aria-label="custom pagination table"
            className="responsive-table"
          >
            <TableHead>
              <TableRow className="table-header" align="center">
                <TableCell align="left" component="th" sx={{width:'25rem',tableHeader}}>
                  Shift Name
                </TableCell>
               
                <TableCell align="center" component="th" sx={tableHeader} >
                  Action
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {shifts.map((item, index) => (
                <TableRow key={index}>
                  <TableCell align="left" sx={tableData}>
                    <Link to="#" underline="none" className="link-hover">
                     {item.name}
                    </Link>
                  </TableCell>
                  <TableCell align="center" sx={tablebtn}>
                    {
                      checkAuthority('EDIT_SHIFTTYPES') &&
                      <Button variant="outlined" className="btn-div" color="info" sx={{mx : 1}} onClick={(e) => editShift(e,item?.id)}>
                      
                        <EditIcon className="btn"/>
                      </Button>
                    }
                    {
                      checkAuthority('DELETE_LICENSE') &&
                      <Button variant="outlined"  className="btn-div" color="error" onClick={() => deleteshift(item?.id)}>
                        <DeleteIcon className="btn"/>
                      </Button>
                    }
                  </TableCell>
                </TableRow>
              ))}
              {
                shifts.length === 0 &&
                <EmptyTable colSpan={7} />
              }


            </TableBody>
            <TableFooter>
              <TableRow>
                <TablePagination
                  align="right"
                  rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
                  colSpan={5}
                  count={shifts.length}
                  rowsPerPage={10}
                  page={0}
                  SelectProps={{
                    inputProps: {
                      "aria-label": "rows per page",
                    },
                    native: true,
                  }}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  ActionsComponent={TablePaginationActions}
                />
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
      </Box>
      }
      <Dialog open={open} onClose={handleClose} fullWidth={true}>
        <DialogTitle sx={{ mb: 4 , textAlign :"center" }}>{action === 'add' ? 'Add' : 'Edit'} Shift-Type</DialogTitle>
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
              id="name" 
              label="Shift Name" 
              variant="outlined" 
              type="text" 
              value={person.name}
              error={person.nameError}
              onChange={(data) => {
                setPerson(prevState => ({
                    ...prevState,
                    name: data.target.value,
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
        <DialogTitle sx={{ mb: 4 , textAlign :"center" }}>Delete Company</DialogTitle>
        
        <DialogContent>
          <Box
            component="form"
            sx={{
              '& .MuiTextField-root': { my: 2, width: '100%' },
            }}
            noValidate
            autoComplete="off"
          >

            <h3 style={{textAlign : 'left', fontWeight :'bold'}}>Do you want's to delete this shift-type </h3>
          </Box>
        </DialogContent>
        <DialogActions sx={{mb : 2 , mx : 4}}>
          <Button onClick={handleDelete} variant="contained" color="error">Delete</Button>
          <Button onClick={handleShowClose} variant="outlined">Cancel</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
