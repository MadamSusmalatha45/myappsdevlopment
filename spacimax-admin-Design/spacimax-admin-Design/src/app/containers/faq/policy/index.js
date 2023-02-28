import React, {useEffect, useState} from "react";
import { Box, Grid , FormControl, Button} from "@mui/material";
import PageTitle from "../../../common/PageTitle";
import Loader from "../../../common/Loader";
import TextField from '@mui/material/TextField';
import { getAPI, patchAPI } from "../../../network";
import { toast } from "react-toastify";

export default function PrivacyPolicy() {
  const [loader, setLoader] = useState(false);

  useEffect(() => {

  },[])
  const [title, setTitle] = useState('')
  const [media, setMedia] = useState(null)
  const [titleError, setTitleError] = useState(false);
  const [mediaError, setMediaError] = useState(false);
  const [privacy, setPrivacy] = useState({})

  useEffect(() => {
    getPrivacy()
  }, [])

  const getPrivacy = async() => {
    setLoader(true)
    let data = await getAPI('/faqs/privacy')
    if(data){
        setTitle(data.title)
        setPrivacy(data)
    }
    setLoader(false)
  }
  
  const toastObj = {position: toast.POSITION.TOP_RIGHT};
  const updatePolicy = async() => {
   
    setTitleError(false);
    setMediaError(false)

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
        

    let formData = new FormData();
    formData.append('title', title);
    formData.append('picture', media);


    setLoader(true);
    let data = await patchAPI(`/faqs/privacy/${privacy.id}`, formData);
    if(data){
        getPrivacy()
    }
    setLoader(false);
   
  }
  return (
    <Box sx={{ height: "inherit" }}>
      <Loader loader={loader} />
      <PageTitle title="FAQ's" subTitle="Privacy Policy" />
     
      <Box display="flex">
        <Grid
          container
          rowSpacing={7}
          columnSpacing={{ xs: 1 }}
        >
            <Grid item xs={4}>
                <div style={{backgroundColor :'white', padding : 10, paddingTop : 20, paddingBottom : 20}}>
                <h3 style={{textAlign :'center'}}>Update Privacy Policy</h3>
                <FormControl sx={{  minWidth : '100%', mx : 0, my :2 }}>
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

                <div style={{border: `1px solid ${mediaError ? 'red' : 'gray'}`, width : "100%", padding : 13, }}>
                    <input type="file"
                        accept="application/pdf"
                        onChange={(e) => {
                            setMedia(e.target.files[0])
                        }}
                    />
                </div>
                <Button onClick={updatePolicy} variant="contained" sx={{my : 2}}>Update</Button>
                </div>

            </Grid>
            <Grid item xs={8}>
              <div>
                <h3  style={{textAlign : 'center'}}><b>Title : {privacy?.title}</b></h3>
              <iframe
                id="video"
                width="100%"
                height={750}
                src={privacy?.media}
                frameBorder="0"
                allow="accelerometer, autoplay; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
            />
             </div>
            </Grid>
        </Grid>
      </Box>

    
    </Box>
  );
}
