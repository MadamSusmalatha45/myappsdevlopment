import React,{useEffect, useState} from "react";
import { Box, Grid } from "@mui/material";
import PageTitle from "../../../common/PageTitle";
import SiteDetailCard from "../../../components/sites/DetailCard";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getSites } from "../../../../features/sites/sitesAPI";
import { selectSites } from "../../../../features/sites/sitesSlice";
import { checkAuthority } from "../../../utils";



export default function SiteDetailPage() {
  const { siteId } = useParams();
  const dispatch = useDispatch();
  const { loading, error, data } = useSelector(selectSites);
  const [ urlType, setUrlType] = useState('');
  const segments = window.location.pathname;
  const [siteDetails, setSiteDetails] = useState([])

  useEffect(() => {
    getSiteDetails()
  },[segments])

  const getSiteDetails = () => {
    var arr = []
    let url = segments.split('/')[1] == 'company' ? '/company' : ''
    if(checkAuthority('VIEW_SITE_LIVE_VIEWS'))
    {
       arr.push({
        id: 1,
        title: "Live View",
        url: `${url}/sites/${siteId}/site-data`,
      })
    }
    if(checkAuthority('VIEW_SITE_TEAMS'))
    {
       arr.push({
        id: 2,
        title: "Site Team",
        url: `${url}/sites/${siteId}/team`,
      })
    }
    if(checkAuthority('VIEW_SITE_SETTINGS'))
    {
       arr.push({
        id: 3,
        title: "Site Settings",
        url: `${url}/sites/${siteId}/setting`,
      })
    }
    if(checkAuthority('VIEW_FIXED_ROASTERS'))
    {
       arr.push({
        id: 4,
        title: "Fixed Roster",
        url: `${url}/sites/${siteId}/fixed-roaster`,
      })
    }
    if(checkAuthority('VIEW_SITE_DOCUMENTS'))
    {
       arr.push({
        id: 5,
        title: "Site Documents",
        url: `${url}/sites/${siteId}/documents`,
      })
    }
    if(checkAuthority('VIEW_SITE_OVERVIEWS'))
    {
       arr.push({
        id: 6,
        title: "Site Overview",
        url: `${url}/sites/${siteId}/overview`,
      })
    }
    if(checkAuthority('VIEW_SITE_INSPECTIONS'))
    {
       arr.push({
        id: 7,
        title: "Site Inspection & Reports",
        url: `${url}/sites/${siteId}/inspection`,
      })
    }
    
    setSiteDetails(arr)
  }

  // const siteDetails = [
  //   {
  //     id: 1,
  //     title: "Live View",
  //     url: `${urlType}/sites/${siteId}/site-data`,
  //   },

  //   // {
  //   //   id: 2,
  //   //   title: "Site View",
  //   //   url: `/sites/${siteId}/site-data`,
  //   // },
  //   {
  //     id: 2,
  //     title: "Site Team",
  //     url: `${urlType}/sites/${siteId}/team`,
  //   },
  //   {
  //     id: 3,
  //     title: "Site Settings",
  //     url: `${urlType}/sites/${siteId}/setting`,
  //   },
  //   {
  //     id: 4,
  //     title: "Fixed Roster",
  //     url: `${urlType}/sites/${siteId}/fixed-roaster`,
  //   },
  //   {
  //     id: 5,
  //     title: "Site Documents",
  //     url: `${urlType}/sites/${siteId}/documents`,
  //   },
  //   {
  //     id: 6,
  //     title: "Site Overview",
  //     url: `${urlType}/sites/${siteId}/overview`,
  //   },
  //   {
  //     id: 7,
  //     title: "Site Inspection",
  //     url: `${urlType}/sites/${siteId}/inspection`,
  //   },
  //   // {
  //   //   id: 8,
  //   //   title: "Site Inspection Forms",
  //   //   url: `/sites/${siteId}/inspection/form`,
  //   // },
  //   {
  //     id: 8,
  //     title: "Site Reports",
  //     url: "#",
  //   },
  // ];

  useEffect(() => {
    if(segments.split('/')[1] == 'company'){
      setUrlType('/company');
    }
    dispatch(getSites());
  },[siteId, segments])

  const getSiteName = () => {
    if(data.length > 0){
      let site =  data.filter((item) => item._id === siteId)[0];
      return site.name + ', ' + site.address + ', ' + site.city?.name;
    }
    else{
      return '';
    }
  }



  return (
    <Box>
      <PageTitle title="Sites View" subTitle={getSiteName()} />
      <Grid container rowSpacing={8} >
        {siteDetails.map((report) => (
          <SiteDetailCard
            title={report.title}
            key={report.id}
            url={report.url}
          />
        ))}
      </Grid>
    </Box>
  );
}
