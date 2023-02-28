import { toast } from "react-toastify";
// import { postAPI } from "../network";
import NoRecordImg from '../../assets/images/NoRecordFound.png'
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
const permissions = JSON.parse(localStorage.getItem('permissions'));
const userType = localStorage.getItem('userType');
const toastObj = {position: toast.POSITION.TOP_RIGHT};

export const tableHeader =  {
    fontSize : '0.9rem !important',
    fontWeight : 500, 
    color : '#45445F',
    px : 3,
    paddingLeft: '5px',
    paddingRight: '5px',
    padding:'12px'
  }

 export const tableData = {
    fontSize : '0.9rem !important',
    fontWeight : 400, 
    color : '#45445F', 
    px : 3,
    paddingLeft: '5px',
    paddingRight: '5px',
    padding:'12px'
  }
 
   
  
  
  export const tablebtn={

    fontSize:' 1rem !important',
    width: '18px!important',
    height: '18px !important',
    
  }

export const durationCalc = (from = null, to = null) => {
    let newFrom = new Date(from)
    let newTo = new Date(to)
    var seconds = parseInt((newTo - newFrom)/1000);
    let minutes = Math.floor(seconds / 60);
    let extraSeconds = seconds % 60;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    extraSeconds = extraSeconds< 10 ? "0" + extraSeconds : extraSeconds;
    return `${minutes} Minutes, ${extraSeconds} Seconds`;
}

export  const setTitle = (title) => {
    document.title = title ?? '';
}

export const apiErrors = (errors) => {
    if(Array.isArray(errors)){
        for(var i = 0; i < errors.length ; i++){
            toast.error(errors[i].messages[0], toastObj);
        }
    }
    else{
        toast.error(errors, toastObj)
    }
    
}

export  const formatDate = (date) => {
    var d = new Date(date);
    return  (d.getDate().toString().length === 1 ? `0${d.getDate()}` : d.getDate()) + '-' + (d.getMonth().toString().length === 1 ? `0${d.getMonth() + 1}` : d.getMonth() + 1) + '-' + (d.getFullYear().toString().length === 1 ? `0${d.getFullYear()}` : d.getFullYear());
}

export const formatDatePost = (date) => {
    var d = new Date(date);
    return  (d.getFullYear().toString().length === 1 ? `0${d.getFullYear()}` : d.getFullYear()) + '-' + (d.getMonth().toString().length === 1 ? `0${d.getMonth() + 1}` : d.getMonth() + 1) + '-' + (d.getDate().toString().length === 1 ? `0${d.getDate()}` : d.getDate())  ;
}

export const getSetTime = (rowTime) => {
    let date = '2022-01-01';
    let am = rowTime.substring(5, 7).toLowerCase();
    let time = rowTime.substring(0, 5);
    date += ` ${time} ${am}`;
    return new Date(date);
}
export const  getTimeFromDate=(timestamp)=> {
    var date = new Date(timestamp * 1000);
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var seconds = date.getSeconds();
  
    var time = new Date();
    return time.setHours(hours, minutes, seconds);
}

export const onlyUnique = (value, index, self) => {
  return self.indexOf(value) === index;
}

export const uniqueArray = (arr) => {
    return arr.filter(onlyUnique);
}

export const timeFormat = (time) => {
    var date = new Date(time);
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? `0${minutes}`.toString() : minutes;
    hours = hours < 10 ? `0${hours}`.toString() : hours;
    var strTime = hours + ':' + minutes  + ampm;
    return strTime;
  }

export const  fullName = (item) => {
    return item.firstname  + ' ' +item.lastname;
}

export const noRecordFound = (records, colSpan) => {
  if(records.length === 0){
    return (
        <TableRow>
            <TableCell align="center"  sx={tableData} colSpan={colSpan}>
               {/* <img src={NoRecordImg} style={{width : 350}}/> */}
               NO RECORD FOUND
            </TableCell>
        </TableRow>
    )
  }
  else{
    return null;
  }
}

export const setParams = (obj) => {
    var keys = Object.keys(obj);
    if(keys > 0){
       
    }
    else{
        return '';
    }
}

export const  uniqueNumberId = () => {
    let n = 9999999999;
    return Math.floor(Math.random() * n) + 1;
}

export const checkImage = (url) => {
    var request = new XMLHttpRequest();
    request.open("GET", url, true);
    request.send();
    request.onload = function() {
      var status = request.status;
      if (request.status === 200) //if(statusText == OK)
      {
        return true;
      } else {
        return false
      }
    }
}
export function correctStrToTime(timeStr){
    // console.log("strrrrrrrrtime",timeStr)
    return `${timeStr.slice(0,5)} ${timeStr.slice(-2)}`
}



export const validation = (type = null, key,value) => {
    var reg =  /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    var phoneno = /^\d{10}$/;
    if(type === null){
       if(value === '' || value.length < 3 ){
        warningMsg(`${key} is required! at least 3 character long.`);
        return true;
       }
       else{
        return false;
       }
    }
    else if(type === 'long'){
        if(value === '' || value.length < 10 ){
         warningMsg(`${key} is required! at least 10 character long.`);
         return true;
        }
        else{
         return false;
        }
     }
    else if(type === 'empty'){
        if(value === ''){
         warningMsg(`${key} is required!`);
         return true;
        }
        else{
         return false;
        }
     }
     else if(type === 'boolean'){
        if(value === '' || (value !== true && value !== false)){
         warningMsg(`${key} is required!`);
         return true;
        }
        else{
         return false;
        }
     }
    else if(type === 'date'){
       if(value === null || value === ''){
        warningMsg(`${key} is required!`);
        return true;
       }
       else{
        return false;
       }
    }
    else if(type === 'time'){
        if(value === null || value === ''){
         warningMsg(`${key} is required!`);
         return true;
        }
        else{
         return false;
        }
    }
    else if(type === 'email'){
        if(value === ''){
         warningMsg(`${key} is required!`);
         return true;
        }
        else if(!value.match(reg)){
            warningMsg(`${key} is invalid!`);
            return true;
        }
        else{
            return false;
        }
    }
    else if(type === 'phone'){
        if(value === ''){
         warningMsg(`${key} is required!`);
         return true;
        }
        else if(! value.match(phoneno)){
            warningMsg(`${key} is invalid!`);
            return true;
        }
        else{
            return false;
        }
    }
    
    else if(type === 'password'){
        if(value === ''){
         warningMsg(`${key} is required!`);
         return true;
        }
        else if(value.length < 6){
            warningMsg(`${key} must be minimum 6 character long!`);
            return true;
        }
        else{
            return false;
        }
    }
    else if(type === 'postcode'){
        if(value === ''){
         warningMsg(`${key} is required!`);
         return true;
        }
        else if(value.length < 4){
            warningMsg(`${key} must be minimum 4 character long!`);
            return true;
        }
        else{
            return false;
        }
    }
    else if(type === 'array'){
        if(value.length === 0){
            warningMsg(`At least one ${key} is required!`);
            return true;
        }
        else{
            return false
        }
    }
}

export const warningMsg = (msg) => {
   toast.warning(msg, toastObj);
}

export const checkPermission = (text) => {
    let permission = permissions.filter((item) => item === text);
    if(permission === 0){
        // location.href = window.location.hostname + 'permission'
    }
}

export const checkAuthority =  (text) => {
    // console.log('ALL PERMISSIONS @@@@@@@@@@@@@@@@@', permissions)
    // if(text === 'ADD_SITES'){
    //     // console.log('ADD_SITES     call ------------')
    //     return false;
    // }
    if(userType === 'company'){
        // console.log('ENTERED ---------------------')
        // console.log('PERMISSION -------',text)
        let permission =  permissions.filter((item) => item.name === text);
        // console.log('COUNT -----------------', permission.length)
        if(permission == 0){
            // console.log('FALSE')
            return false;
        }
        else{
            // console.log('TRUE')
            return true;
        }
    }
    else{
        return true;
    } 
    
}