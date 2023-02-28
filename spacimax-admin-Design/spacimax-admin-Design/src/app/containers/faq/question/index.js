import React,{useEffect, useState} from "react" 
import { Box, Button, Grid } from "@mui/material"
import PageTitle from "../../../common/PageTitle";
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { deleteAPI, getAPI, patchAPI, postAPI } from "../../../network";
import Loader from "../../../common/Loader";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextareaAutosize from '@mui/base/TextareaAutosize';
import {RED, GREY} from "../../../../constant"
import { toast } from "react-toastify";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import "./style.css"

export default function FaqQuestion(){
    const [questions, setQuestions] = useState([]);
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
        getQuestions();
    },[])

    const getQuestions = async() => {
        setLoader(true);
        let questions = await getAPI('/faqs');
        if(questions){
            setQuestions(questions);
        }
        setLoader(false);
    }

    const handleClickOpen = () => {
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
        let question = await postAPI('/faqs', payload);
        if(question){
            getQuestions();
            setOpen(false)
        }
        setLoader(false);
      }
      else if(action === 'edit'){

        setLoader(true);
        let question = await patchAPI(`/faqs/${id}`, payload);
        if(question){
            getQuestions();
            setOpen(false)
        }
        setLoader(false);
      }
    }

    const editClick = (id) => {
        setTitleError(false);
        setDescError(false);
        let question = questions.filter(item => item.id === id)[0];
        setId(id)
        setTitle(question.title)
        setDesc(question.description);
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
        let question = await deleteAPI(`/faqs/${id}`);
        if(question){
            getQuestions()
            setShow(false)
        }
        setLoader(false);
    }

    return(
        <Box sx={{ height: "inherit" }}>
            <Loader loader={loader} />
            <PageTitle title="FAQ's" subTitle="Frequently Asked Questions" />
            <Box
                display="flex"
                justifyContent="flex-end"
                alignItems="flex-end"
                sx={{mx : 8 , my : 4}}
            >
                <Button variant="contained" style={{backgroundColor : "grey"}} sx={{ height: 50 }} onClick={() => {
                    setTitle('');
                    setDesc('');
                    setTitleError(false);
                    setDescError(false);
                    setBtnTxt('Add');
                    setAction('add');
                    setOpen(true)
                }}>
                <AddCircleOutlineIcon />
                   &nbsp; Add Question
                </Button>
            </Box>
            <Box display="flex" style={{mx :8}} alignContent="center"
               justifyContent="center">
                <Grid container spacing={2}>
                {
                    questions.map((item,index) => (
                      <>
                        <Grid item xs={10} sx={{m :0 ,p :0}}>
                            <Accordion sx={{width : '100%',}} key={index}>
                                <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel1a-content"
                                id="panel1a-header"
                               
                                >
                                <Typography  sx={{fontSize:"15px !important"}}>{item.title}</Typography>
                                </AccordionSummary>
                                <AccordionDetails sx={{backgroundColor : "white", height :'150px'}}>
                                <Typography sx={{fontSize:"14px !important"}}>
                                    {item.description}
                                </Typography>
                                </AccordionDetails>
                            </Accordion>
                        </Grid>
                        <Grid item xs={2} sx={{m :0 ,p :0}}>
                            <Button  className="btn-div" color="primary" variant="outlined" sx={{mx : 2, height : 50}} onClick={() => editClick(item.id)}>
                              <EditIcon className="btn" />
                            </Button>

                            <Button  className="btn-div" color="error" variant="outlined" sx={{height : 50}} onClick={() => deleteClick(item.id)}>
                              <DeleteIcon  className="btn"/>
                            </Button>
                        </Grid>
                      </>
                    ))
                }
                
                
                <Grid item xs={12}>
                    {
                        questions.length === 0 &&
                        <h4>No records found</h4>
                    }
                </Grid>
                    
                </Grid>
                
            </Box>

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle sx={{textAlign : 'center', mb : 8}}>{action === "add" ? 'Add' : 'Update'} Frequently Asked Question</DialogTitle>
                <DialogContent>
                    
                    <TextField
                        autoFocus
                        margin="dense"
                        id="title"
                        label="Question title"
                        type="text"
                        defaultValue={title}
                        onChange={(event) => {
                            setTitle(event.target.value)
                        }}
                        fullWidth
                        error={titleError}
                       
                    />
                    <TextField
                        autoFocus
                        margin="dense"
                        id="description"
                        label="Description for question"
                        type="text"
                        defaultValue={desc}
                        onChange={(event) => {
                            setDesc(event.target.value)
                        }}
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
        <DialogTitle sx={{ mb: 4 , textAlign :"center" }}>Delete Question</DialogTitle>
        
        <DialogContent>
            <Box
                component="form"
                sx={{
                '& .MuiTextField-root': { my: 2, width: '100%' },
                }}
                noValidate
                autoComplete="off"
            >

                <h4 style={{textAlign : 'left', fontWeight :'bold'}}>Do you want's to delete this question</h4>
            </Box>
            </DialogContent>
            <DialogActions sx={{mb : 2 , mx : 4}}>
            <Button onClick={handleDelete} variant="contained" color="error">Delete</Button>
            <Button onClick={handleShowClose} variant="outlined">Cancel</Button>
            </DialogActions>
        </Dialog>
        </Box>
    )
}