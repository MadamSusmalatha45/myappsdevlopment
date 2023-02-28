import { Box } from "@mui/material";
import CircularProgress from '@mui/material/CircularProgress';
import NoRecordImg from '../../assets/images/NoRecordFound.gif'

const Loader =  (props) => {
 return(
    props.loader ?
    <Box sx={{  position: "fixed", top: "80%", left: "59%", transform: "translate(-30%, -50%)", zIndex : 0}}>
        <img src={NoRecordImg} style={{width : 100}}/>
    </Box>
    :
    <>
    </>   
 )
}

export default Loader;