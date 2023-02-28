import React from "react";

import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DesktopDatePicker } from "@mui/x-date-pickers";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import "./style.css";
import { Box, Input, InputBase, Paper, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles(() => ({
  inputRoot: {
    "&:before": {
      border: "0 !important",
    },
    "&:after": {
      border: "0 !important",
    },
  },
}));

function LocalDateSelector(props) {
  const classes = useStyles();

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DesktopDatePicker
        label={props.label && props.label === "none" ? "" : "select date"}
        inputFormat="MM/dd/yyyy"
        InputAdornmentProps={{ position: "start" }}
        value={props.value}
        onChange={props.onChange || function () {}}
        style={{
          borderRadius: "10px !important",
          boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px !important",
          borderColor: "#707070 !important",
        }}
        // eslint-disable-next-line react/jsx-props-no-spreading
        renderInput={(dateParams) => (
          <Paper
            component="form"
            sx={{
              p: "13px 4px",
              display: "flex",
              alignItems: "center",
              borderRadius: "10px",
              boxShadow: "rgb(0 0 0 / 24%) 0px 3px 8px",
              borderColor: "rgb(112, 112, 112)",
            }}
          >
            <InputBase
              sx={{ ml: 1, flex: 1 }}
              placeholder="Search Google Maps"
              inputProps={{ ...dateParams.inputProps }}
              inputRef={dateParams.inputRef}
              startAdornment={dateParams.InputProps.startAdornment}
              inputComponent={(inputProps) => (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "100%",
                  }}
                >
                  <Typography sx={{ height: "inherit" }}>
                    {props.title}
                  </Typography>
                  <ArrowBackIosNewIcon style={{ flex: 1 }} />
                  <Input
                    {...inputProps}
                    style={{ flex: 2 }}
                    className={classes.inputRoot}
                  />
                  <ArrowForwardIosIcon style={{ flex: 1 }} />
                </Box>
              )}
              {...dateParams}
            />
          </Paper>
        )}
      />
    </LocalizationProvider>
  );
}

export default LocalDateSelector;
