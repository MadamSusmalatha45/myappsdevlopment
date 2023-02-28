import { Box } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
// import DialogActions from '@mui/material/DialogActions';
// import DialogContent from '@mui/material/DialogContent';
// import DialogContentText from '@mui/material/DialogContentText';
// import DialogTitle from '@mui/material/DialogTitle';
// import CancelIcon from '@mui/icons-material/Cancel';
import {getAPI} from "../network/index";

export default function ViewMedia(props){
    const {type = 'image', url, show, setShow, id } = props
    const checkImage = (url) => {
        var request = new XMLHttpRequest();
        request.open("GET", url, true);
        request.send();
        request.onload = function() {
          var status = request.status;
          if (request.status == 200) //if(statusText == OK)
          {
            return true;
          } else {
            return false
          }
        }
      }
    // const download = async(id)=>{
    //   let data = await getAPI(`/admin/user-license/download/${id}`);
    //   if(data){
    //     window.open(data.data, "_blank")
    //   }
      
    // }
   
    return(
        <Dialog
            open={show}
            keepMounted
            onClose={() => setShow(false)}
            aria-describedBy="alert-dialog-slide-description"
            fullWidth
            
        > 
            <Box textAlign={'right'} sx={{p : 4}}>
              <img src={url} style={{width : '100%', border : '1px solid lightgrey', marginBottom : 10}}/>
              <Button variant="contained" onClick={() => setShow(false)}>Close</Button>
              {/* <Button  style={{marginLeft : '20px', }}variant="contained" onClick={() => download(id)}>Download</Button> */}
            </Box>
            
      </Dialog>
    )
}