import React, {useEffect, useState} from "react";
import { Box, Button, FormControl, Grid, InputLabel, Link  } from "@mui/material";
import PageTitle from "../../../common/PageTitle";
import { getAPI, postAPI, deleteAPI, patchAPI } from "../../../network";
import Loader from "../../../common/Loader";
import TextField from '@mui/material/TextField';
import { toast } from "react-toastify";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import {useNavigate} from "react-router-dom"
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import TableHead from "@mui/material/TableHead";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Details } from "@material-ui/icons";
import { tableHeader,tableData } from "../../../utils";
import "./style.css"

export default function UserGuide() {
  const navigate = useNavigate();
  const [guides, setGuides] = useState([]);
  const [loader, setLoader] = useState(false);
  const [title, setTitle] = useState(null);
  const [media, setMedia] = useState(null);
  const [titleError, setTitleError] = useState(false);
  const [mediaError, setMediaError] = useState(false);
  const [open, setOpen] = useState(false);
  const [view, setView] = useState(false);
  const [modal, setModal] = useState(false)
  const [detail, setDetail] = useState({})
  const [action, setAction] = useState('add');
  const [id, setId] = useState('')

  useEffect(() => {
    getGuides();
  },[])

  const getGuides = async() => {
    setLoader(true);
    let guide = await getAPI(`/guide`);
    if(guide){
       setGuides(guide);
    }
    setLoader(false);
  }
  const toastObj = {position: toast.POSITION.TOP_RIGHT};

  const handleSubmit = async() => {
   
    setTitleError(false);
    setMediaError(false)

    if(action == 'add'){
        if(title === '' || title.length < 3){
          
            toast.warning('Title is required! at least 3 character long',toastObj);
            setTitleError(true);
            return;
        }
        else if(media == null || media == '' ){
           
            toast.warning('Media is required!',toastObj);
            setMediaError(true);
            return;
        }
        
    }
    else{
        if(title === '' || title.length < 3){
            toast.warning('Title is required! at least 3 character long',toastObj);
            setTitleError(true);
            return;
        }
    }



    if(action === 'add'){
        let formData = new FormData();
        formData.append('title', title);
        formData.append('picture', media);

        setLoader(true);
        let data = await postAPI(`/guide`, formData);
        if(data){
            getGuides()
            setOpen(false)
        }
        setLoader(false);
    }
    else{
        let formData = new FormData();
        formData.append('title', title);
        if(media != undefined){
            formData.append('picture', media);
        }

        setLoader(true);
        let data = await patchAPI(`/guide/${id}`, formData);
        if(data){
            getGuides()
            setOpen(false)
        }
        setLoader(false);
    }
  }

  

  const handleDelete = async() => {
    setLoader(true);
    let data = await deleteAPI(`/guide/${id}`);
    if(data){
        getGuides();
        setModal(false)
    }
    setLoader(false);
  }

  const addGuide = () => {
    setTitle('');
    setMedia(null);
    setTitleError(false);
    setMediaError(false)
    setAction('add');
    setOpen(true)
  }

  const editGuide = (id) => {
    let guide = guides.filter(item => item.id === id)[0];
    setId(id)
    setAction('edit')
    setMedia(null);
    setTitle('');
    setMediaError(false);
    setTitleError(false)
    setTitle(guide.title);
    setOpen(true)
  }

  const viewGuide = (item) => {
    setDetail(item);
    setView(true)
  }

  const deleteGuide = (id) => {
    setId(id)
    setModal(true)
  }

  const renderMedia =  (media, type, size = null) => {
    if(size === null){
        if(type.includes('image')){
            return <img src={media}  style={{height : 140}}/>;
            // return <img src="http://50.17.107.208:3004/uploads/picture-1663224658439.png"  style={{height : 140}}/>
        }
        else{
            return  <iframe
            id="video"
            width="250"
            heigh="70"
            src={media}
            frameBorder="0"
            allow="accelerometer, autoplay; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        }
    }
    else{
        if(type.includes('image')){
            return <img src={media}  style={{width : '100%'}}/>;
            // return <img src="http://50.17.107.208:3004/uploads/picture-1663224658439.png"  style={{width : '100%'}}/>
        }
        else{
            return  <iframe
            id="video"
            width="100%"
            // height={screen.availHeight}
            src={media}
            frameBorder="0"
            allow="accelerometer, autoplay; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        }
    }
  }

  return (
    <Box sx={{ height: "inherit" }}>
      <Loader loader={loader} />
      <PageTitle title="FAQ's" subTitle="Help Center" />
      <Box
        display="flex"
        justifyContent="flex-end"
        alignItems="flex-end"
        sx={{mx : 2}}
      >
        <Button variant="contained" style={{backgroundColor : "grey"}} sx={{ height: 50 }} onClick={addGuide}>
          <AddCircleIcon /> &nbsp;
          Add Media
        </Button>
      </Box>
      <Box display="flex" sx={{ my: "2rem" }}>
        <TableContainer component={Paper} sx={{ mx: "0.8rem" }}>
          {/* <div style={{width: 'auto', overflowX: 'scroll'}}> */}
          <Table
            sx={{ minWidth: "auto" }}
            aria-label="custom pagination table"
            className="responsive-table"
          >
            <TableHead>
              <TableRow className="table-header" align="center">
                <TableCell align="center" component="th" sx={tableHeader}>
                  Sr No.
                </TableCell>
                <TableCell align="center" component="th" sx={tableHeader}>
                  Title
                </TableCell>
                <TableCell align="center" component="th" sx={tableHeader}>
                  Media
                </TableCell>
                <TableCell align="center" component="th" sx={tableHeader} >
                  Action
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {guides.map((item, index) => (
                <TableRow key={index}>
                  <TableCell align="center" sx={tableData}>
                    {index + 1}
                  </TableCell>
                  <TableCell align="center" sx={tableData}>
                    {item.title}
                  </TableCell>
                  <TableCell align="center" sx={tableData}>
                    {item?.media ? renderMedia(item?.media, item?.mediaType) : null}
                  </TableCell>
                 
                  <TableCell align="left"  sx={{textAlign : 'center',tableData}}>
                    <Button  className="btn-div" variant="outlined" color="secondary" sx={{mx : 1}} onClick={(e) => viewGuide(item)}>
                      <VisibilityIcon className="btn"  />
                    </Button>
                    <Button  className="btn-div" variant="outlined" color="info" sx={{mx : 1}} onClick={(e) => editGuide(item?.id)}>
                      <EditIcon  className="btn" />
                    </Button>
                    <Button  className="btn-div" variant="outlined" color="error" onClick={() => deleteGuide(item?.id)}>
                      <DeleteIcon className="btn"  />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {
                guides.length === 0 &&
                <TableRow>
                  <TableCell align="center" sx={tableData} colSpan={5}>
                    No records found
                  </TableCell>
                  
                </TableRow>
              }


            </TableBody>
           
          </Table>
          {/* </div> */}
        </TableContainer>
      </Box>
      <Dialog open={view} onClose={() => setView(false)} fullScreen={true}>
        <DialogTitle sx={{ mb: 4 , textAlign :"center" }}>Guide Detail</DialogTitle>
        
        <DialogContent>
          <Box
            component="form"
            sx={{
              '& .MuiTextField-root': { my: 2, width: '100%' },
            }}
            noValidate
            autoComplete="off"
          >
           {
            Object.keys(detail).length !== 0 &&
            <>
               <h3 style={{textAlign : 'left', fontWeight :'bold'}}>{detail.title}</h3>
               {detail?.media ? renderMedia(detail.media, detail.mediaType, 'full') : null}
            </>
           }
          </Box>
        </DialogContent>
        <DialogActions sx={{mb : 2 , mx : 4}}>
          <Button onClick={() => setView(false)} variant="outlined">Cancel</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth={true}>
        <DialogTitle sx={{ mb: 4 , textAlign :"center" }}>{action === 'add' ? 'Add' : 'Edit'} User Guide</DialogTitle>
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
              id="title" 
              label="Title" 
              variant="outlined" 
              type="text" 
              value={title}
              onChange={(event) => {
                setTitle(event.target.value)
              }}
              error={titleError}
              fullWidth
              sx={{m : 0}}
            />
          </FormControl>

          <div style={{border: `1px solid ${mediaError ? 'red' : 'gray'}`, width : "97%", padding : 13, }}>
           <input type="file"
            accept="image/*"
            onChange={(e) => {
                setMedia(e.target.files[0])
            }}
           />
          </div>

          
          </Box>
        </DialogContent>
        <DialogActions sx={{mb : 2 , mx : 4}}>
          <Button onClick={handleSubmit} variant="contained">{action === 'add' ? 'Submit' : 'Update'}</Button>
          <Button onClick={() => setOpen(false)} variant="outlined">Cancel</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={modal} onClose={() => setModal(false)} fullWidth={true}>
        <DialogTitle sx={{ mb: 4 , textAlign :"center" }}>Delete User Guide</DialogTitle>
        
        <DialogContent>
          <Box
            component="form"
            sx={{
              '& .MuiTextField-root': { my: 2, width: '100%' },
            }}
            noValidate
            autoComplete="off"
          >

            <h3 style={{textAlign : 'left', fontWeight :'bold'}}>Do you want's to delete this user guide</h3>
          </Box>
        </DialogContent>
        <DialogActions sx={{mb : 2 , mx : 4}}>
          <Button onClick={handleDelete} variant="contained" color="error">Delete</Button>
          <Button onClick={() => setModal(false)} variant="outlined">Cancel</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
