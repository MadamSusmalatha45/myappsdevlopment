import React,{useState, useEffect} from "react";
import List from "@mui/material/List";
import DashboardIcon from "@mui/icons-material/Dashboard";
// import PeopleIcon from "@mui/icons-material/People";
import { Box, ListSubheader, Divider } from "@mui/material";
import AssignmentIcon from "@mui/icons-material/Assignment";
import { ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import { useNavigate } from "react-router-dom";
import {
  Map as MapIcon,
  ListAlt,
  Schedule,
  Report,
  Security,
  Dangerous,
  HealthAndSafety,
  Pages,
  Notifications,
  Quiz,
  SupportAgent,
  Logout,
  House,
  Apartment,
  PeopleAlt,
} from "@mui/icons-material";
import AccessibilityIcon from '@mui/icons-material/Accessibility';
import ListItemLink from "../common/ListItemLink";
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import PeopleIcon from '@mui/icons-material/People';
import Group from '@mui/icons-material/People';
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';
import { useDispatch, useSelector } from "react-redux";
import { logOutUser, selectAuth } from "../../features/auth/authSlices";

// import {adminMenus, companyMenus} from '../utils/data'

function SideMenu() {
  const [dashboardMenus, setDashboardMenus] = useState([])
  const userType = localStorage.getItem('userType');
  const permissions = JSON.parse(localStorage.getItem('permissions'));
  const [slice, setSlice] = useState(4)
  const navigateTo = useNavigate();
  const dispatch = useDispatch();
  const [dynamicCompanyMenu, setDynamicCompanyMenu] = useState([])
  useEffect(() => {
    getCompanyMenu();
    getDashboardMenus();
  },[userType,permissions])

  const logOut = () => {
    return ( userType === 'admin' ? navigateTo('/login') : navigateTo('/company/login'));
  }

  const handleLogout = () => {
    localStorage.clear();
    dispatch(logOutUser());
    navigateTo("/login");
  };

  const adminMenus = [
    {
      primary: "Dashboard",
      to: "/",
      icon: <DashboardIcon />,
    },
    {
      primary: "Companies",
      to: "/companies",
      icon: <Apartment />,
    },
    {
      primary: "Sites",
      to: "/sites",
      icon: <House />,
    },
    {
      primary: "Vendors",
      to: "/vendors",
      icon: <AccessibilityIcon />,
    },
    // {
    //   primary: "Client",
    //   to: "/client",
    //   icon: <PeopleIcon />,
    // },
    
    {
      primary: "Admin Users",
      to: "/company/users",
      icon: <PeopleIcon />,
    },
    {
      primary: "Clients",
      to: "/vendor/:vendorId/clients",
      icon: <PeopleOutlineIcon />,
    },
    {
      primary: "Roles",
      to: "/roles",
      icon: <VerifiedUserIcon />,
    },
    // {
    //   primary: "Guards",
    //   to: "/guards",
    //   icon: <Security />,
    // },
    {
      primary: "Resource",
      to: "/users",
      icon: <PeopleOutlineIcon />,
    },
    {
      primary: "Trackers",
      to: "/trackers",
      icon: <MapIcon />,
    },
    {
      primary: "Timesheets",
      to: "/timesheets",
      icon: <ListAlt />,
    },
    {
      primary: "Scheduler",
      to: "/scheduler",
      icon: <Schedule />,
    },
    {
      primary: "Reports",
      to: "/reports",
      icon: <Report />,
    },
    {
      primary: "Alert Information",
      to: "/alert-information",
      icon: <Dangerous />,
    },
    {
      primary: "Safety Tips",
      to: "/safety-tips",
      icon: <HealthAndSafety />,
    },
    // {
    //   primary: "App Page",
    //   to: "#",
    //   icon: <Pages />,
    // },
    {
      primary: "License Type",
      to: "/licensetype",
      icon: <AssignmentIcon />,
    },
    {
      primary: "Shift Type",
      to: "/shifttype",
      icon: <Pages />,
    },
    {
      primary: "Notification",
      to: "/notifications",
      icon: <Notifications />,
    },
    {
      primary: "FAQ's",
      to: "/faq",
      icon: <Quiz />,
    },
    {
      primary: "Support",
      to: "/supports",
      icon: <SupportAgent />,
    },
    {
      primary: "Task",
      to: "/tasks/list",
      icon: <AssignmentIcon />,
    },
  ];

  const getCompanyMenu = () => {
    var arr = [];
    let find = [
      'VIEW_DASHBOARD',
      'VIEW_SITES',
      'VIEW_GUARDS',
      'VIEW_TRACKER',
      'VIEW_TIMESHEETS',
      'VIEW_SCHEDULER',
      'VIEW_SITE_REPORTS',
      'VIEW_ALERTS',
      'VIEW_TIPS',
      // 'VIEW_APP_PAGE',
      'VIEW_NOTIFICATIONS',
      'VIEW_TASKS',
      'VIEW_USERS'
    ];

    for(var i = 0; i < find.length ; i++){
      for(var j = 0; j < permissions.length; j++){
        if(permissions[j].name === find[i]){
          if(find[i] === 'VIEW_DASHBOARD'){
            arr.push({
              primary: "Dashboard",
              to: "/company",
              icon: <DashboardIcon />,
            })
          }
          else if(find[i] === 'VIEW_SITES'){
            arr.push({
              primary: "Sites",
              to: "/company/sites",
              icon: <House />,
            })
          }
          else if(find[i] === 'VIEW_GUARDS'){
            arr.push({
              primary: "Guards",
              to: "/company/guards",
              icon: <Security />,
            })
          }
          else if(find[i] === 'VIEW_TRACKER'){
            arr.push({
              primary: "Trackers",
              to: "/company/trackers",
              icon: <MapIcon />,
            })
          }
          else if(find[i] === 'VIEW_TIMESHEETS'){
            arr.push({
              primary: "Timesheets",
              to: "/company/timesheets",
              icon: <ListAlt />,
            })
          }
          else if(find[i] === 'VIEW_SCHEDULER'){
            arr.push({
              primary: "Scheduler",
              to: "/company/scheduler",
              icon: <Schedule />,
            })
          }
          else if(find[i] === 'VIEW_SITE_REPORTS'){
            arr.push({
              primary: "Reports",
              to: "/company/reports",
              icon: <Report />,
            })
          }
          else if(find[i] === 'VIEW_ALERTS'){
            arr.push({
              primary: "Alert Information",
              to: "/company/alert-information",
              icon: <Dangerous />,
            })
          }
          else if(find[i] === 'VIEW_TIPS'){
            arr.push({
              primary: "Safety Tips",
              to: "/company/safety-tips",
              icon: <HealthAndSafety />,
            })
          }
          // else if(find[i] === 'VIEW_APP_PAGE'){
          //   arr.push({
          //     primary: "App Page",
          //     to: "#",
          //     icon: <Pages />,
          //   })
          // }
          else if(find[i] === 'VIEW_NOTIFICATIONS'){
            arr.push({
              primary: "Notification",
              to: "/company/notifications",
              icon: <Notifications />,
            })
          }
          else if(find[i] === 'VIEW_TASKS'){
            arr.push({
              primary: "Task",
              to: "/company/tasks/list",
              icon: <AssignmentIcon />,
            })
          }
        }
      }
    }
    setDynamicCompanyMenu(arr)
  }

  const companyMenus = [
    {
      primary: "Dashboard",
      to: "/company",
      icon: <DashboardIcon />,
    },
    {
      primary: "Sites",
      to: "/company/sites",
      icon: <House />,
    },

    {
      primary: "Guards",
      to: "/company/guards",
      icon: <Security />,
    },
    
    {
      primary: "Trackers",
      to: "/company/trackers",
      icon: <MapIcon />,
    },
    {
      primary: "Timesheets",
      to: "/company/timesheets",
      icon: <ListAlt />,
    },
    {
      primary: "Scheduler",
      to: "/company/scheduler",
      icon: <Schedule />,
    },
    {
      primary: "Reports",
      to: "/company/reports",
      icon: <Report />,
    },
    {
      primary: "Alert Information",
      to: "/company/alert-information",
      icon: <Dangerous />,
    },
    {
      primary: "Safety Tips",
      to: "/company/safety-tips",
      icon: <HealthAndSafety />,
    },
    {
      primary: "App Page",
      to: "#",
      icon: <Pages />,
    },
    {
      primary: "Notification",
      to: "/company/notifications",
      icon: <Notifications />,
    },
    // {
    //   primary: "FAQ's",
    //   to: "/company/faq",
    //   icon: <Quiz />,
    // },
    {
      primary: "Task",
      to: "/company/tasks/list",
      icon: <AssignmentIcon />,
    },
  ];


  const getDashboardMenus = () => {
     if(userType === 'admin'){
       setDashboardMenus(adminMenus)
       setSlice(3)
     }
     else{
      setDashboardMenus(dynamicCompanyMenu)
      setSlice(2)
     }
  }

 

  return (
    <Box
      sx={{
        height: "100vh",
        overflowY: "auto",
        pb: 5,
      }}
    >
      <List
        component="nav"
        subheader={
          <ListSubheader
            sx={{
              fontSize: "larger",
              fontWeight: "700",
              lineHeight: "normal",
              height: "40px",
              my: 3,
            }}
            component="p"
            id="nested-list-subheader"
          >
            {userType === 'admin' ? 'Super Admin' : 'Company'}
          </ListSubheader>
        }
      >
   
        {dashboardMenus.slice(0, slice).map(({ primary, to, icon }) => (
          <ListItemLink primary={primary} to={to} icon={icon} key={primary} />
        ))}
      </List>
      <List
        component="nav"
        subheader={
          userType === 'admin' ?
          <ListSubheader
            sx={{
              fontSize: "larger",
              fontWeight: "700",
              my: 1,
              marginBottom: 4,
              height: "60px",
            }}
            component="p"
            id="nested-list-subheader"
          >
            Company
          </ListSubheader>
          : 
          <Divider />
        }
      >
        {dashboardMenus.slice(slice).map(({ primary, to, icon }) => (
          <ListItemLink primary={primary} to={to} icon={icon} key={primary} />
        ))}

        <li>
          <ListItemButton  pt={1} onClick={(e) => {
            e.preventDefault();
            handleLogout()
            // localStorage.clear();
            // logOut()
          }}>
            <ListItemIcon><Logout /></ListItemIcon>
            <ListItemText sx={{ fontWeight: "500" }} primary={'Log Out'} />
          </ListItemButton>
        </li>

        
      </List>
      
    </Box>
  );
}

export default SideMenu;
