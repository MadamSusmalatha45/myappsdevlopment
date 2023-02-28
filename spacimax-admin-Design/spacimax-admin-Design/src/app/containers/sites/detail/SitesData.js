import React from "react";
import {useEffect, useState} from "react";
import { Box, Grid } from "@mui/material";
import PageTitle from "../../../common/PageTitle";
import LocalDateSelector from "../../../common/LocalDateSelector";
import SiteOverviewCard from "../../../components/sites/Overview";
// import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useParams } from "react-router-dom";
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import TextField from '@mui/material/TextField';
import { getAPI, postAPI } from "../../../network";
import {formatDatePost} from '../../../utils'
import Loader from "../../../common/Loader";


export default function SiteDataPage() {
  const [datevalue, setValue] = React.useState(new Date());
  const [loader, setLoader] = useState(false)
  const[sitesData,setSitesData]=useState([])
  const { siteId } = useParams();
  const userType = localStorage.getItem('userType')
  const [sites, setSites] = useState([])
  const [filter, setFilter] = useState({
    date : new Date()
  })

  useEffect(() => {
    getSupports()
    // getSitesData();
    getSite();
  },[])

  const getSupports = async(  date = null) => {
    var url = ''
    let newDate = date != null ? date : filter.date  
    newDate = newDate !== null ? newDate : formatDatePost(new Date());
    var first  = true
    if(newDate !== '' || newDate !== ''){
      url += first ? `?date=${formatDatePost(newDate)}` : `&date=${formatDatePost(newDate)}`;
      first = true;

    }
    setLoader(true) 
    const supports = await getAPI(`/sites/live-view/${siteId}${url}`);

    console.log("---supports Result---", supports)
    console.log('@@@URL@@@' , `/sites/live-view/${siteId}${url}`)
    setSitesData(supports)
    setLoader(false);
   
  }


  // const getSitesData = async() => {
  //   setLoader(true)
  //   let data = await getAPI(`/sites/live-view/${siteId}`);
  //   if(data){
  //     setSitesData(data)
  //   }
  //   setLoader(false)
  // }
  const getSite = async() => {
    let url = userType === 'admin' ? '/sites' : '/company/sites';
    let data = await getAPI(url);
    if(data){
     setSites(data) 
    }
 }
 
  const renderSiteView = (items) => {
    return Object.keys(items).map(key => 
      <>
        <SiteOverviewCard
          title={key} 
          subTitle={items[key]}  
          key={items[key]}
        />
      </>
    )
  }
  const getSiteName = () => {
    if(sites.length > 0){
      let site =  sites.filter((item) => item._id === siteId)[0];
      return site.name + ', ' + site.address + ', ' + site.city?.name ;
      
    }
    else{
      return '';
    }
  }

  return (
    <Box sx={{ height: "inherit" }}>
      <Loader loader={loader} />
      <PageTitle
        title="Sites View"
       subTitle={getSiteName()}
      />
      <Box display="flex" flexDirection="column" rowGap={4}>
        <Box mx={2}>
          <LocalizationProvider dateAdapter={AdapterMoment}>
            <DatePicker
              label="Select Date"
              value={datevalue}
              onChange={(newValue) => {
                setValue(newValue);
                setFilter({
                  ...filter,
                  datevalue : newValue
                })
                getSupports(newValue)
              }}
              
              sx={{backgroundColor : 'white'}}
              renderInput={(params) => <TextField 
                sx={{backgroundColor : 'white'}}
                 {...params} />}
            />
          </LocalizationProvider>
        </Box>
        <Grid
          container
          rowSpacing={9}
          columnSpacing={{ xs: 1 }}
          alignContent="center"
          justifyContent="center"
          alignItems="center"
          mb="18%"
          sx={{px : 2 }}
        >
         
         
          {
            (sitesData 
            && Object.keys(sitesData).length === 0
            && Object.getPrototypeOf(sitesData) === Object.prototype ) ?
            renderSiteView({})
            :
            renderSiteView(sitesData)
          }
          {/* {renderSiteView(sitesData)} */}
          
        </Grid>
      </Box>
    </Box>
  );
}
