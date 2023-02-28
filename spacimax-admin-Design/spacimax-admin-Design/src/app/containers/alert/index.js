import React,{useEffect, useState} from "react";
import { Box, Button  } from "@mui/material";
import PageTitle from "../../common/PageTitle";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableFooter from '@mui/material/TableFooter';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TableHead from '@mui/material/TableHead';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import Loader from "../../common/Loader";
import "./style.css";
import { deleteAPI, getAPI, patchAPI, postAPI } from "../../network";
import { checkAuthority, validation ,tableData,tableHeader} from "../../utils";
import EmptyTable from "../../common/EmptyTable";

export default function AlertPage() {
    const [alerts, setAlerts] = useState([])
    const [loader, setLoader] = useState(false);
    const [open, setOpen] = React.useState(false);
    const [action, setAction] = useState('add');
    const [btnTxt, setBtnTxt] = useState('Add');
    const [id, setId] = useState('');
    const [title, setTitle] = useState('');
    const [desc, setDesc] = useState('');
    const [titleError, setTitleError] = useState(false);
    const [descError, setDescError] = useState(false);
    const [show, setShow] = useState(false)
  

    useEffect(() => {
        getAlerts();
    },[])

    const getAlerts = async() => {
        setLoader(true);
        let data = await getAPI('/alerts');
        if(data){
            setAlerts(data)
        }
        setLoader(false);
    }

    const handleClickOpen = () => {
        setTitleError(false);
        setDescError(false);
        setTitle('');
        setDesc('')
        setBtnTxt('Add')
        setAction('add')
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const addAction = () => {

    }
    
    const handleSubmit = async() => {
      setTitleError(false);
      setDescError(false);

      if(validation(null ,'Title', title)){
        setTitleError(true);
        return;
      }
      else if(validation('long', 'Description', desc)){
        setDescError(true);
        return;
      }

    //   if(title === '' || title.length < 3){
    //     toast.warning('Title is required! at least 3 character long.');
    //     setTitleError(true);
    //     return;
    //   }
    //   else if(desc === '' || desc.length < 10){
    //     toast.warning('Description is required! at least 10 character long.');
    //     setDescError(true);
    //     return;
    //   }

      let payload = {
        title : title,
        description : desc
      };


      if(action === 'add'){
        setLoader(true);
        let alerts = await postAPI('/alerts', payload);
        if(alerts){
            getAlerts();
            setOpen(false)
        }
        setLoader(false);
      }
      else if(action === 'edit'){
        setLoader(true);
        let alerts = await patchAPI(`/alerts/${id}`, payload);
        if(alerts){
            getAlerts();
            setOpen(false)
        }
        setLoader(false);
      }
    }
    
    const editClick = (id) => {
        setTitleError(false);
        setDescError(false);
        let alert = alerts.filter(item => item.id === id)[0];
        setId(id)
        setTitle(alert.title)
        setDesc(alert.description);
        setBtnTxt('Update');
        setAction('edit');
        setOpen(true);
    }

    const handleShowClose = () => {
        setShow(false)
    }

    const deleteClick = (id) => {
        setId(id);
        setShow(true)
    }

    const handleDelete = async() => {
        setLoader(true);
        let tip = await deleteAPI(`/alerts/${id}`);
        if(tip){
            getAlerts()
            setShow(false)
        }
        setLoader(false);
    }

  return (
    <Box sx={{ height: "inherit" }}>
      <Loader loader={loader} />
      <PageTitle title="Alert Information"  />
      {
        checkAuthority('ADD_ALERT') &&
        <Box
          display="flex"
          justifyContent="flex-end"
          alignItems="flex-end"
          sx={{mx : 2}}
        >
          <Button variant="contained" style={{backgroundColor : "grey"}} sx={{ height: 50 }} onClick={handleClickOpen}>
            <AddCircleIcon /> &nbsp;&nbsp;
            Add Alert
          </Button>
        </Box>
      }
      
      {
        checkAuthority('VIEW_ALERTS') &&
        <Box display="flex" sx={{ my: "3rem" }}>
        <TableContainer component={Paper} sx={{ mx: "0.8rem" }} >
          {/* <div style={{width: 'auto', overflowX: 'scroll'}}> */}
            <Table sx={{ minWidth: 'auto' }} aria-label="custom pagination table" className="responsive-table">
                <TableHead >
                    <TableRow className="table-header">
                        <TableCell align="left" component="th" sx={tableHeader}>Title</TableCell>
                        <TableCell align="left" component="th" sx={tableHeader}>Description</TableCell>
                        <TableCell align="center" component="th" sx={tableHeader}>Action</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {
                        alerts.map((item, index) => (
                            <TableRow key={index}>
                                <TableCell  align="left" sx={tableData}>
                                    {item.title}
                                </TableCell>
                                <TableCell align="left" sx={tableData}>
                                    {item.description}
                                </TableCell>
                                <TableCell align="center" sx={tableData}>
                                    {
                                      checkAuthority('EDIT_ALERT') &&
                                      <Button  className="btn-div" color="primary" variant="outlined" sx={{mx : 2}} onClick={() => editClick(item.id)}>
                                        <EditIcon className="btn" />
                                      </Button>
                                    }
                                    {
                                      checkAuthority('DELETE_ALERT') &&
                                      <Button  className="btn-div" color="error" variant="outlined"  onClick={() => deleteClick(item.id)}>
                                        <DeleteIcon  className="btn"/>
                                      </Button>
                                    }
                                </TableCell>
                            </TableRow>
                        ))
                    }
                    {
                      alerts.length === 0 &&
                      <EmptyTable colSpan={3} />
                    }
                </TableBody>
                <TableFooter>
                <TableRow>
                    
                    <TablePagination
                    align="right"
                    rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                    colSpan={2}
                    count={alerts.length}
                    rowsPerPage={10}
                    page={1}
                    SelectProps={{
                        inputProps: {
                        'aria-label': 'rows per page',
                        },
                        native: true,
                    }}
                    // onPageChange={handleChangePage}
                    // onRowsPerPageChange={handleChangeRowsPerPage}
                    // ActionsComponent={TablePaginationActions}
                    />
                </TableRow>
                </TableFooter>
            </Table>
            {/* </div> */}
        </TableContainer>
      </Box>
      }
      

      <Dialog open={open} onClose={handleClose}>
                <DialogTitle sx={{textAlign : 'center', mb : 8}}>{action === "add" ? 'Add' : 'Update'} Alert</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="title"
                        label="Alert title"
                        type="text"
                        defaultValue={title}
                        onChange={(event) => {setTitle(event.target.value)}}
                        fullWidth
                        error={titleError}
                    />
                    <TextField
                        autoFocus
                        margin="dense"
                        id="description"
                        label="Description for alert"
                        type="text"
                        defaultValue={desc}
                        onChange={(event) => {setDesc(event.target.value)}}
                        fullWidth
                        multiline
                        rows={4}
                        error={descError}
                    />
                    </DialogContent>
                <DialogActions sx={{mx : 2, mb :4}}>
                    <Button onClick={handleSubmit} variant="contained" color="primary">{btnTxt}</Button>
                    <Button onClick={handleClose} variant="outlined">Cancel</Button>
                </DialogActions>
            </Dialog>
            <Dialog open={show} onClose={handleClose} fullWidth={true}>
        <DialogTitle sx={{ mb: 4 , textAlign :"center" }}>Delete Alert</DialogTitle>
        
        <DialogContent>
            <Box
              component="form"
              sx={{'& .MuiTextField-root': { my: 2, width: '100%' },}}
              noValidate
              autoComplete="off"
            >
                <h4 style={{textAlign : 'left', fontWeight :'bold'}}>Do you want's to delete this alert</h4>
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


