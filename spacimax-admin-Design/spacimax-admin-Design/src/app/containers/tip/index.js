import React, {useEffect, useState} from "react";
import { Box, Link , Button, Grid } from "@mui/material";
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
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { deleteAPI, getAPI, patchAPI, postAPI } from "../../network";
import Loader from "../../common/Loader";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextareaAutosize from '@mui/base/TextareaAutosize';
import {RED, GREY} from "../../../constant"
import { toast } from "react-toastify";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import "./style.css";
import EmptyTable from "../../common/EmptyTable";
import { checkAuthority,tableHeader,tableData } from "../../utils";

export default function TipPage() {
    const [tips, setTips] = useState([]);
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
      getTips();
    },[])

    const getTips = async() => {
        setLoader(true);
        let tips = await getAPI('/safety-tips');
        if(tips){
            setTips(tips);
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

      if(title === '' || title.length < 3){
        toast.warning('Title is required! at least 3 character long.');
        setTitleError(true);
        return;
      }
      else if(desc === '' || desc.length < 10){
        toast.warning('Description is required! at least 10 character long.');
        setDescError(true);
        return;
      }

      let payload = {
        title : title,
        description : desc
      };


      if(action === 'add'){
        setLoader(true);
        let tips = await postAPI('/safety-tips', payload);
        if(tips){
            getTips();
            setOpen(false)
        }
        setLoader(false);
      }
      else if(action === 'edit'){
        setLoader(true);
        let tips = await patchAPI(`/safety-tips/${id}`, payload);
        if(tips){
            getTips();
            setOpen(false)
        }
        setLoader(false);
      }
    }

    const editClick = (id) => {
        setTitleError(false);
        setDescError(false);
        let tip = tips.filter(item => item.id === id)[0];
        setId(id)
        setTitle(tip.title)
        setDesc(tip.description);
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
        let tip = await deleteAPI(`/safety-tips/${id}`);
        if(tip){
            getTips()
            setShow(false)
        }
        setLoader(false);
    }


  return (
    <Box sx={{ height: "inherit" }}>
      <Loader loader={loader} />
      <PageTitle title="Safety Tips"  />
      {
        checkAuthority('VIEW_TIPS')  &&
        <Box display="flex" sx={{ my: "3rem" }}>
        <TableContainer component={Paper} sx={{ mx: "0.8rem" }} >
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
                        tips.map((item, index) => (
                            <TableRow key={index}>
                                <TableCell  align="left" sx={tableData}>
                                    {item.title}
                                </TableCell>
                                <TableCell align="left" sx={tableData}>
                                    {item.description}
                                </TableCell>
                                <TableCell align="center" sx={tableData}>
                                    {
                                        checkAuthority('EDIT_TIP') &&
                                        <Button  className="btn-div" color="primary" variant="outlined" sx={{mx : 2}} onClick={() => editClick(item.id)}>
                                            <EditIcon className="btn" />
                                        </Button>
                                    }
                                    {
                                        checkAuthority('DELETE_TIP') &&
                                        <Button  className="btn-div" color="error" variant="outlined"  onClick={() => deleteClick(item.id)}>
                                            <DeleteIcon className="btn" />
                                        </Button>
                                    } 
                                </TableCell>
                            </TableRow>
                        ))
                    }
                    {
                        tips.length === 0 &&
                        <EmptyTable colSpan={3} />
                    }
                </TableBody>
                <TableFooter>
                <TableRow>
                    <TableCell sx={tableData} direction="column" justifyContent="center">
                      <Link href="#" underline="none" >
                         {/* Add Guard <AddCircleOutlineIcon  className="add-icon"/> */}
                         <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            flexWrap: 'wrap',
                            justifyContent: 'space-between'

                        }}>
                            
                            <span className="add-title">Add Safety Tips</span>
                            <AddCircleIcon className="add-icon" fontSize="medium" onClick={handleClickOpen}/>
                        </div>  
                      </Link>
                    </TableCell>
                    <TablePagination
                    align="right"
                    rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                    colSpan={6}
                    count={tips.length}
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
    
        </TableContainer>
      </Box>
      }
      

      <Dialog open={open} onClose={handleClose}>
                <DialogTitle sx={{textAlign : 'center', mb : 8}}>{action === "add" ? 'Add' : 'Update'} Safety Tip</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="title"
                        label="Safety tip title"
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
                        label="Description for safety tip"
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
        <DialogTitle sx={{ mb: 4 , textAlign :"center" }}>Delete Safety Tip</DialogTitle>
        
        <DialogContent>
            <Box
              component="form"
              sx={{'& .MuiTextField-root': { my: 2, width: '100%' },}}
              noValidate
              autoComplete="off"
            >
                <h4 style={{textAlign : 'left', fontWeight :'bold'}}>Do you want's to delete this tip</h4>
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


