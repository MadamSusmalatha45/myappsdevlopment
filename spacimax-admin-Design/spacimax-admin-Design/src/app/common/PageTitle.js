import { Box, Typography, Button } from "@mui/material";
import { grey } from "@mui/material/colors";
import React from "react";
import "./style.css"

// eslint-disable-next-line react/prop-types
function PageTitle({ title, subTitle, navTxt = false }) {
  return (
    <Box display="flex" justifyContent="start" flexDirection="column" mb={4}>
      <Typography  className="title-font" component="h5" variant="h5" ml={2} >
        {title}
      </Typography>
      {subTitle && (
        <Typography className="subtitle-font"  component="h6" variant="h6"  ml={2} mb={4}>
          {subTitle}
        </Typography>
      )}
      {
        navTxt &&
        <Box  mb={5} ml={2}>
          <Button
            variant="outlined"
            justifyContent="flex-start"
            sx={{  pl: 2, fontWeight: "med",  backgroundColor : 'white', color :'black', py : 1,pl : 6, pr : 6, borderColor :'gray', borderRadius : 2, textAlign : 'left'}}
          
          >
            Decommission Site
          </Button>
        </Box>
      }
    </Box>
  );
}

export default PageTitle;
