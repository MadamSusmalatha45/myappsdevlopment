/* eslint-disable react/prop-types */
import { Box, Grid , Pagination} from "@mui/material";
import React from "react";
import PageTitle from "../../../common/PageTitle";
import Avatar from "../../../../assets/images/license..jpg"
import './style.css'

function UserLicensePage() {
  
  return (
    <Box>
      <PageTitle title="User Licenses" />
      <Grid container  columnSpacing={{ xs: 0 }}>
        <Grid  xs={6} sx={{p: "1rem"}}>
            <div class="id-card">
                <div class="profile-row">
                    <div class="dp">
                        <div class="dp-arc-outer"></div>
                        <div class="dp-arc-inner"></div>
                        <img src={Avatar} />
                    </div>
                    <div class="desc">
                        <h2>Virendra Arekar</h2>
                            <p><span className="title">License Name:</span> Driving License</p>
                            <p><span className="title">License Number:</span> HAF7829NVS</p>
                            <p><span className="title">Issuing Authority:</span> Driving Department</p>
                            <p><span className="title">Issuing Country:</span> India</p>
                            <p><span className="title">Issuing State:</span> Maharashtra</p>
                            <p><span className="title">Expiry Date:</span> 22 Jan 2027</p>
                    </div>
                </div>
            </div>
        </Grid>
        <Grid  xs={6} sx={{p: "1rem"}}>
            <div class="id-card">
                <div class="profile-row">
                <div class="dp">
                    <div class="dp-arc-outer"></div>
                    <div class="dp-arc-inner"></div>
                    <img src={Avatar} />
                </div>
                <div class="desc">
                    <h2>Tony Stark</h2>
                    <p><span className="title">License Name:</span> Driving License</p>
                    <p><span className="title">License Number:</span> HAF7829NVS</p>
                    <p><span className="title">Issuing Authority:</span> Driving Department</p>
                    <p><span className="title">Issuing Country:</span> India</p>
                    <p><span className="title">Issuing State:</span> Maharashtra</p>
                    <p><span className="title">Expiry Date:</span> 22 Jan 2027</p>
                </div>
                </div>
            </div>
        </Grid>

        <Grid  xs={6} sx={{p: "1rem"}}>
            <div class="id-card">
                <div class="profile-row">
                <div class="dp">
                    <div class="dp-arc-outer"></div>
                    <div class="dp-arc-inner"></div>
                    <img src={Avatar} />
                </div>
                <div class="desc">
                    <h2>Tony Stark</h2>
                    <p><span className="title">License Name:</span> Driving License</p>
                    <p><span className="title">License Number:</span> HAF7829NVS</p>
                    <p><span className="title">Issuing Authority:</span> Driving Department</p>
                    <p><span className="title">Issuing Country:</span> India</p>
                    <p><span className="title">Issuing State:</span> Maharashtra</p>
                    <p><span className="title">Expiry Date:</span> 22 Jan 2027</p>
                </div>
                </div>
            </div>
        </Grid>

        <Grid  xs={6} sx={{p: "1rem"}}>
            <div class="id-card">
                <div class="profile-row">
                <div class="dp">
                    <div class="dp-arc-outer"></div>
                    <div class="dp-arc-inner"></div>
                    <img src={Avatar} />
                </div>
                <div class="desc">
                    <h2>Tony Stark</h2>
                    <p><span className="title">License Name:</span> Driving License</p>
                    <p><span className="title">License Number:</span> HAF7829NVS</p>
                    <p><span className="title">Issuing Authority:</span> Driving Department</p>
                    <p><span className="title">Issuing Country:</span> India</p>
                    <p><span className="title">Issuing State:</span> Maharashtra</p>
                    <p><span className="title">Expiry Date:</span> 22 Jan 2027</p>
                </div>
                </div>
            </div>
        </Grid>
        <Grid  xs={6} sx={{p: "1rem"}}>
            <div class="id-card">
                <div class="profile-row">
                <div class="dp">
                    <div class="dp-arc-outer"></div>
                    <div class="dp-arc-inner"></div>
                    <img src={Avatar} />
                </div>
                <div class="desc">
                    <h2>Tony Stark</h2>
                    <p><span className="title">License Name:</span> Driving License</p>
                    <p><span className="title">License Number:</span> HAF7829NVS</p>
                    <p><span className="title">Issuing Authority:</span> Driving Department</p>
                    <p><span className="title">Issuing Country:</span> India</p>
                    <p><span className="title">Issuing State:</span> Maharashtra</p>
                    <p><span className="title">Expiry Date:</span> 22 Jan 2027</p>
                </div>
                </div>
            </div>
        </Grid>
        <Grid  xs={6} sx={{p: "1rem"}}>
            <div class="id-card">
                <div class="profile-row">
                <div class="dp">
                    <div class="dp-arc-outer"></div>
                    <div class="dp-arc-inner"></div>
                    <img src={Avatar} />
                </div>
                <div class="desc">
                    <h2>Tony Stark</h2>
                    <p><span className="title">License Name:</span> Driving License</p>
                    <p><span className="title">License Number:</span> HAF7829NVS</p>
                    <p><span className="title">Issuing Authority:</span> Driving Department</p>
                    <p><span className="title">Issuing Country:</span> India</p>
                    <p><span className="title">Issuing State:</span> Maharashtra</p>
                    <p><span className="title">Expiry Date:</span> 22 Jan 2027</p>
                </div>
                </div>
            </div>
        </Grid>
      </Grid>
      <div className="center"><Pagination count={10} shape="rounded" /></div>
    </Box>
  );
}
export default UserLicensePage;