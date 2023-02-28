/* eslint-disable react/prop-types */
import React from "react";
import { Box, Button, Grid, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { checkAuthority ,tablebtn} from "../../utils";


export default function SiteCard({ title, id, option = false , btnClick = null}) {

  return (
    <Grid item xs={12} sm={6} md={6} lg={4} sx={{justifyContent :'center', alignItems :'center'}}>
      <Box
        component={Link}
        to={`${id}`}
        sx={{
          p : 6,
          pb: 10,
          display: "flex",
          // boxShadow: "0px 2px 4px 3px rgba(0, 0, 0, 0.08)",
          boxShadow: "0 3px 6px rgb(0 0 0 / 0%), 0 3px 6px rgb(0 0 0 / 16%) !important",
          borderRadius: "10px",
          backgroundColor: "#fff",
          alignContent: "center",
          justifyContent: "center",
          color: "#202E43",
          position : 'relative',
          textDecoration: "none",
          "&:hover": {
            backgroundColor: "#2A4556",
            color: "white",
            fontWeight: "medium",
            ".hover-btn" : {
              display : "inline-block",
              backgroundColor : "white"
            }
          },
        }}
      >
        {
          (option && checkAuthority('EDIT_SITES')) &&
            <Button size="small" sx={{ minWidth: "20px !important", position : 'absolute' , left : 0, top :0, display : 'none', fontSize:"-60.1895rem"}} color="secondary" variant="outlined" className="hover-btn " onClick={(e) => {
              e.preventDefault();
              btnClick(id, 'edit')
            }}><EditIcon sx={tablebtn}/></Button>
        }

        {
          (option && checkAuthority('DELETE_SITES')) && 
          <Button size="small" sx={{minWidth: "20px !important",position : 'absolute' , right : 0, top :0, display : 'none'}} color="error" variant="outlined" className="hover-btn " onClick={(e) => {
            e.preventDefault();
            btnClick(id, 'delete')
          }}><DeleteIcon sx={tablebtn}/></Button>
        }
        <Typography
          variant="h2"
          sx={{
            pv : 0,
            ph :0,
            fontSize : '18px !important',
            textTransform: "capitalize",
            fontWeight: 400,
            lineHeight: "25px", 
          }}
        >
          {title}
        </Typography>
      </Box>
    </Grid>
  );
}
