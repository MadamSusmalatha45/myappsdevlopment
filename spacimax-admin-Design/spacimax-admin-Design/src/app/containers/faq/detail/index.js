import React, {useEffect, useState} from "react";
import { Box, Button, FormControl, Grid, InputLabel  } from "@mui/material";
import PageTitle from "../../../common/PageTitle";
import { getAPI, postAPI, deleteAPI, patchAPI } from "../../../network";
import Loader from "../../../common/Loader";
import { useParams } from "react-router-dom";
import TextField from '@mui/material/TextField';
import TextareaAutosize from '@mui/base/TextareaAutosize';
import { toast } from "react-toastify";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import {useNavigate} from "react-router-dom"

export default function FaqDetail() {
  const { faqId } = useParams();
  const navigate = useNavigate();
  const [faq, setFaq] = useState({});
  const [loader, setLoader] = useState(false);
  const [identifier, setIdentifier] = useState(null);
  const [title, setTitle] = useState(null);
  const [desc, setDesc] = useState('');
  const [titleError, setTitleError] = useState(false);
  const [descError, setDescError] = useState(false);
  const [idError, setIdError] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    getFaq();
  },[faqId,title, identifier])

  const getFaq = async() => {
    setLoader(true);
    let faq = await getAPI(`/pages/${faqId}`);
    if(faq){
       
       setDesc(faq.description)
       await setIdentifier(faq.identifier);
       await setTitle(faq.title);
       setFaq(faq);
    }
    setLoader(false);
  }
  const toastObj = {position: toast.POSITION.TOP_RIGHT};

  const updateClick = async() => {
    setTitleError(false);
    setDescError(false);
    setIdError(false);
    var re = /^[a-z]+(?:_+[a-z]+)*$/;

    if(identifier === ''){
        toast.warning('Identifier is required!',toastObj);
        setIdError(true);
        return;
    }
    else if(!re.test(identifier)){
        toast.warning('Identifier allow  only underscore and small letter!',toastObj);
        setIdError(true);
        return;
    }
    else if(title === '' || title.length < 3){
        toast.warning('Title is required! at least 3 character long',toastObj);
        setTitleError(true);
        return;
    }
    else if(desc === '' || desc.length < 10){
        toast.warning('Description is required! at least 10 character long',toastObj);
        setDescError(true);
        return;
    }

    let payload = {
        identifier : identifier,
        title : title,
        description : desc
    }

    setLoader(true);
    let data = await patchAPI(`/pages/${faqId}`, payload);
    if(data){

    }
    setLoader(false);
  }

  const deleteClick = () => {
    setOpen(true)
  }

  const handleDelete = async() => {
    setLoader(true);
    let data = await deleteAPI(`/pages/${faqId}`);
    if(data){
        navigate('/faq');
    }
    setLoader(false);
  }

  return (
    <Box sx={{ height: "inherit" }}>
      <Loader loader={loader} />
      <PageTitle title="FAQ's" subTitle={faq?.title} />
      <Box display="flex">
        <Grid
          container
          rowSpacing={7}
          columnSpacing={{ xs: 1 }}
          alignContent="center"
          justifyContent="center"
          alignItems="center"
       
        >
            <Grid item xs={12} md={10} sx={{ px : 8}}>
              <InputLabel sx={{fontSize : 20, fontWeight :"bold", my :1}}>Identifier</InputLabel>
              <TextField 
                id="basic" 
                // label="Identifier" 
                variant="outlined" 
                // type="text"
                style={{backgroundColor : "white"}}  
                value={identifier}
                onChange={(event) => {
                    setIdentifier(event.target.value)
                }}
                error={idError}
                fullWidth  
              />
        
              
              <InputLabel htmlFor="title" sx={{fontSize : 20, fontWeight :"bold", my :1, mt:2}}>Title</InputLabel>
              <TextField 
                id="title" 
                // label="Title" 
                variant="outlined" 
                // type="text" 
                style={{backgroundColor : "white"}}
                value={title}
                onChange={(event) => {
                    setTitle(event.target.value)
                }}
                error={titleError}
                fullWidth
                />

              <InputLabel sx={{fontSize : 20, fontWeight :"bold", my :1, mt:2}}>Description</InputLabel>
              <TextareaAutosize
                maxRows={100}
                aria-label="maximum height"
                placeholder="Description"
                minRows={15}
                defaultValue={desc}
                onChange={(event) => {
                    setDesc(event.target.value)
                }}
                style={{ width : '100%', fontSize : 18,padding : 10 }}
                error={descError}
                fullWidth
                />

               <Button variant="contained" sx={{my :2}} onClick={updateClick}>Update</Button> &nbsp;&nbsp;
               <Button variant="contained" sx={{my :2}} color="error" onClick={deleteClick}>Delete</Button>
            </Grid>
           
        </Grid>
      </Box>
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth={true}>
        <DialogTitle sx={{ mb: 4 , textAlign :"center" }}>Delete Page</DialogTitle>
        
        <DialogContent>
          <Box
            component="form"
            sx={{
              '& .MuiTextField-root': { my: 2, width: '100%' },
            }}
            noValidate
            autoComplete="off"
          >

            <h3 style={{textAlign : 'left', fontWeight :'bold'}}>Do you want's to delete it</h3>
          </Box>
        </DialogContent>
        <DialogActions sx={{mb : 2 , mx : 4}}>
          <Button onClick={handleDelete} variant="contained" color="error">Delete</Button>
          <Button onClick={() => setOpen(false)} variant="outlined">Cancel</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
