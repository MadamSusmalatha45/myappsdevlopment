import React, { useEffect, useState } from "react";
import { Box, Grid } from "@mui/material";


export default function Permission() {
  useEffect(() => {
    
  },[])

  return (
    <Grid
        container
        spacing={0}
        align="center"
        justify="center"
        direction="column"
        style={{  marginTop : '18%'}}
    >
        <Grid item style={{  }}>
        <img src={require('../../../assets/images/restriction.png')} /> <br></br>
        <h1 style={{textAlign :'center'}}>Not having permission to access this page</h1>
        </Grid>
    </Grid>
  );
}
