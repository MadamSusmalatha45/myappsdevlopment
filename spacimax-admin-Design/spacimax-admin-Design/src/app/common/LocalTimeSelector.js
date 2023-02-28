import React, { useEffect } from "react";

import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DesktopTimePicker } from "@mui/x-date-pickers";
import { TextField } from "@mui/material";
import "./style.css";

function LocalTimeSelector(props) {
  useEffect(() => {

  }, [props]);

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DesktopTimePicker
        value={props.value}
        onChange={props.onChange || function () {}}
        style={{
          borderRadius: "20px !important",
          boxShadow: " 0px 2px 4px 3px rgb(0 0 0 / 8%) !important",
          borderColor: "#707070 !important",
          
        }}
        // eslint-disable-next-line react/jsx-props-no-spreading
        renderInput={(params) => (
          <TextField sx={{ background: "white !important" }} {...params} />
        )}
      />
    </LocalizationProvider>
  );
}

export default LocalTimeSelector;
