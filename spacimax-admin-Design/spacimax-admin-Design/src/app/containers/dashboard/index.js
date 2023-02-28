/* eslint-disable react/prop-types */
import { Box, Grid, FormControl,Button} from "@mui/material";
import React ,{useEffect, useState} from "react";
import PageTitle from "../../common/PageTitle";
import ReportCard from "../../components/dashboard/ReportCard";
import Loader from "../../common/Loader";
import { getAPI } from "../../network";
import { checkAuthority} from "../../utils";
import Select  from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import {useNavigate} from "react-router-dom"


 

function DashboardPage() {
  const [dashboards , setDashboards] = useState([])
  const [companies , setCompanies] = useState([])
  const [loader, setLoader] = useState(false)
  const [searchInput, setSearchInput] = useState('');
  const [filteredResults, setFilteredResults] = useState([]);
  const [allsites, setAllsites] = useState("")
  const navigate = useNavigate();
  const [sites, setSites] = useState({
    id :'',
  })
  

  useEffect(() => {
   getDashboards()

   companyLists()
  },[])

  const companyLists = async () => {
    let process = await getAPI('/companies');
    if (process) {
      var companies = [];
      for (var i = 0; i < process.length; i++) {
        companies.push({ label: process[i].name, id: process[i].id })
      }
      setCompanies(companies);
    }
  }





  const getDashboards = async () =>{
    setLoader(true)
    let data = await getAPI('/admin/dashboard');

    if(data){
      var arr = [];
      for(var i =0; i < data.length; i++){
        arr.push({
          id : data[i]._id,
          name : data[i].name,
          address : data[i].address,
          city : data[i].city,
          latitude : data[i].latitude,
          longitude : data[i].longitude,
          country : data[i].country,
          title : data[i].name + ', ' + data[i].address + ', ' + data[i].city?.name ,
          stats : {      
            floors : data[i].totalCheckpoints,
            fireAlarmReported : data[i].fireAlarm,
            incidentReported : data[i].incident,
            hazardReported : data[i].hazard,
            breakInReported : data[i].breakIns,
            guardOnSite : data[i].guards,

          }
        })
      }
      
      setDashboards(arr)
    }
    
    setAllsites(data.name)
    setLoader(false)
  }

 
 

//   const searchItems = (searchValue) => {
    
//     setSearchInput(searchValue)
//     if (searchInput !== ''){
//         const filteredData = dashboards.filter((item) => {
//             return Object.values(item).join('').toLowerCase().includes(searchInput.toLowerCase())
//         })
//         setDashboards(filteredData)
//     }
//     else{
//       setDashboards(dashboards)
//       getDashboards()
//     }
// }

const changePermission = (data) => {
  setAllsites({
      ...allsites,
      allsites : data
  })
}   
var idS=sites.id

const openSite = async(id) => {
  const idS=id
  const data= await getAPI(`/admin/dashboard?companyId=${idS}`);
  console.log(data,"-----data---")
  if(data){
    var arr = [];
    for(var i =0; i < data.length; i++){
      arr.push({
        id : data[i]._id,
        name : data[i].name,
        address : data[i].address,
        city : data[i].city,
        latitude : data[i].latitude,
        longitude : data[i].longitude,
        country : data[i].country,
        title : data[i].name + ', ' + data[i].address + ', ' + data[i].city?.name ,
        stats : {      
          floors : data[i].totalCheckpoints,
          fireAlarmReported : data[i].fireAlarm,
          incidentReported : data[i].incident,
          hazardReported : data[i].hazard,
          breakInReported : data[i].breakIns,
          guardOnSite : data[i].guards,

        }
      })
    } 
    
    setDashboards(arr)
  }
  else{
    getDashboards()
  }
  // navigate('/sites/'+ idS, "_self");
  // window.open(window.location.origin +'/sites/' + idS ,"_self")
}


  return (
    <Box>
      <Loader loader={loader}/>
      <PageTitle title="Dashboard View" />


      {/* <Box>
      <FormControl sx={{  minWidth : '97%', mx : 0, px :0 , mb : 4}}>
         
         <Select
            //  defaultValue={allsites}
             isMulti="false"selectedSite
             name="sites"
             options={allsites}
             classNamePrefix="select"
             onChange={(data) => {changePermission(data)}}
         />
       </FormControl>
      </Box> */}
      <FormControl sx={{ m: 1, width : "30%" }}>
            <Select
                value={sites.id}  
                onChange={(data) => {
                  setSites(prevState => ({
                      ...prevState,
                      id : data.target.value,
                     
                  }))
                  openSite(data.target.value)
                }}
                displayEmpty
                inputProps={{ 'aria-label': 'Select Site' }}
                style={{borderRadius : 10, boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px', borderColor : "#707070"}}
                >
                <MenuItem value="">
                <div className="selectitem">Select Company</div>
                </MenuItem>
                {
                    companies.map((item, index) => (
                        <MenuItem value={item.id} key={index}>{item.label}</MenuItem>
                    ))
                }
            </Select>
        </FormControl>

{/* <FormControl  sx={{  minWidth : '30%', mt : 2 }}>
          <lable>Select Site</lable>
            <Select
              labelId="Site"
              id="site"
              placeholder="Select Sites"
              // value={site.roles}
              // error={person.roleError}
              onChange={(data) => {
                openSite(data.target.value)
              }}
            >
              {
                dashboards.map((item,index) => (
                    <MenuItem value={item.id} key={index}>{item.name}</MenuItem>
                ))
              }
            </Select>
          </FormControl> */}

      

      {/* <input style={{padding:"18px", fontSize:"16px",borderRadius:"10px",margin:"10px",marginTop:"0.5rem"}}
                placeholder='Search...'
                onChange={(e) => searchItems(e.target.value)}
      /> */}

      

      <Grid container rowSpacing={6} columnSpacing={{ xs: 0 }} sx={{mt :1}}>
    
      {
        dashboards.map((report, index) => (
          <ReportCard
            title={report.title}
            stats={report.stats}
            id={report.id}
            key={index}
          />
        ))
      }
        
        
      </Grid>
    </Box>
  );
}
export default DashboardPage
