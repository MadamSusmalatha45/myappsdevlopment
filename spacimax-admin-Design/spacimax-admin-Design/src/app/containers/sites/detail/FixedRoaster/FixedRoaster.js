import React,{useEffect, useState} from "react";
import { Box, Grid } from "@mui/material";
import PageTitle from "../../../../common/PageTitle";
import SiteDetailCard from "../../../../components/sites/DetailCard";
// import { useParams } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import { getSites } from "../../../../../features/sites/sSiteFixedRoasterPageitesAPI";
// import { selectSites } from "../../../../../features/sites/sitesSlice";
import { getAPI } from "../../../../network";
import { useParams } from "react-router-dom";
import { checkAuthority } from "../../../../utils";

export default function SiteFixedRoasterPage() {
  const { siteId } = useParams();
  // const { loading, error, data } = useSelector(selectSites);
  const [urlType, setUrlType] = useState('');
  const [loader, setLoader] = useState(false)
  const [sites, setSites] = useState([])
  const userType = localStorage.getItem('userType')
  const segments = window.location.pathname;
  const [siteDetails, setSiteDetails] = useState([])

  useEffect(() => {
    getSites();
    getSiteDetails()
    if(segments.split('/')[1] == 'company'){
      setUrlType('/company')
    }
  },[siteId, segments])


  const getSites = async() => {
    setLoader(true)
    let data = await getAPI(userType === 'admin' ? '/sites' : '/company/sites');

    console.log("DATA-----",data)
    if(data){
      setSites(data)
    }
    setLoader(false)
  }

  const getSiteDetails = () =>{
    var arr = [];
    let url = segments.split('/')[1] == 'company' ? '/company' : ''
    if(checkAuthority('EDIT_FIXED_ROASTER')){
      arr.push({
        id: 1,
        title: "Edit Fixed Roaster",
        url : `${url}/sites/${siteId}/edit-fixed-roaster`
      })
    }
    if(checkAuthority('VIEW_FIXED_ROASTERS')){
      arr.push({
        id: 2,
        title: "View Fixed Roaster",
        url : `${url}/sites/${siteId}/site-view-fixed-roaster`
      })
    }
    if(checkAuthority('ADD_ROASTER')){
      arr.push({
        id: 3,
        title: "Create Roaster",
        url : `${url}/sites/${siteId}/fixed-roaster/create-fixed-roaster`
      })
    }

    setSiteDetails(arr)
  }

  const getSiteName = () => {
    if(sites.length > 0){
      let site =  sites.filter((item) => item._id === siteId)[0];
      return site.name + ', ' + site.address + ', ' + site.city?.name + ' / Fixed Roaster'
    }
    else{
      return '';
    }
  }

  return (
    <Box sx={{ height: "inherit" }}>
      <PageTitle
        title="Sites View"
        subTitle={getSiteName()}
      />
      <Box display="flex">
        <Grid
          container
          rowSpacing={7}
          columnSpacing={{ xs: 1 }}
          alignContent="center"
          justifyContent="center"
          alignItems="center"
          mt="10%"
        >
          {console.log("siteDetails-----",siteDetails)}
          {siteDetails.map((report) => (
            <SiteDetailCard large title={report?.title} key={report?.id} url={report?.url} height={'20px'}/>
          ))}
        </Grid>
      </Box>
    </Box>
  );
}
