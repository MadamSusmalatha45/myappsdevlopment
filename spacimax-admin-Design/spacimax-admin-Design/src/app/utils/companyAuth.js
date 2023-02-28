import { axiosInstance } from "../../utils/axiosSetup";
import { toast } from "react-toastify";
import { apiErrors } from "../utils";
const toastObj = {position: toast.POSITION.TOP_RIGHT};


const responseCheck = (res) => {
   
    if(res.status === 200 || res.status === 201 || res.status === 204){
        return true;
    }
    else{
        return false;
    }
}    

export const companyLogin = async(url,data) =>{
    try {
        const response = await axiosInstance.post(url, data);
        if(responseCheck(response)){
            toast.success(response.data.message,toastObj);
            // localStorage.setItem('token',response.data.data.accessToken);
            // localStorage.setItem('user', JSON.stringify(response.data.data));
            // localStorage.setItem('userType','company');
            // localStorage.setItem('permissions',JSON.stringify(response.data.data.permissions));
            console.log('TOKEN',response.data.data.accessToken)
            console.log('RESPONSE',response.data.data.permissions)
            return response.data;
        }
        else{
            toast.error(response.data.message,toastObj);
            return false;
        }
    } catch (err) {
        
        if(err.response.data.code === 500){
            toast.error(err.response.data.message, toastObj)
         }
         else if(err.response.data.code === 404){
             toast.error(err.response.data.message);
         }
         else{
             let errs = err.response.data.errors;
             apiErrors(errs)
         }
         
         return false;
    }
}