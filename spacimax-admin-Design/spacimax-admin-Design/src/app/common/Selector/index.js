import React from "react";
import { Select, FormControl, MenuItem, Box, InputLabel } from "@mui/material";
import { ExpandMore, ExpandLessRounded } from "@mui/icons-material";
import { BasicTimePicker } from "../TimePicker";

export default function BasicSelector(props) {
  return (
    <Box {...props} >
      <FormControl
        fullWidth
        sx={{
          "& .MuiOutlinedInput-root": {
            borderRadius: "8px",
            height: props.selectorHight || "100%",
            width: props.selectorWidth || "100%",
            backgroundColor: "#fff",
            boxShadow: "0px 2px 4px 3px rgba(0, 0, 0, 0.08)",
          },
          "& .MuiSelect-icon": {
            right: "14px",
            top: "calc(100% - 1.8em)",
            color: "#43515D",
            height: '44px',
            
          },
        }}
        variant={props.variant}
      >
        <InputLabel id={props.name || "Select-id"}>
          {props.name || "Select"}
        </InputLabel>
        <Select
          MenuProps={{
            PaperProps: {
              sx: {
                marginTop: "10px ",
              },
            },
          }}
          IconComponent={
            props.variant === "standard" ? ExpandLessRounded : ExpandMore
          }
          displayEmpty
          id={props.name || "Select-id"}
          label={props.name}
          name={props.name || "Selector Name"}
          onChange={props.onChange || function () {}}
          value={props?.shortValue != undefined ? props?.shortValue.toString() :  props.value}
          error={props.error}
        >
          {props.disableAll ? null : (
            <MenuItem value={props.variant === "standard" ? "" : "All"}>
              {props.variant === "standard" ? "None" : "All"}
            </MenuItem>
          )}
          {/* {
            props.isTimeSelector &&
            <MenuItem value={props.value}>
              {props.value}
            </MenuItem>
          } */}

          {/* {props.disableAll && (
            <MenuItem value={props.variant === "standard" ? "" : "All"}>
              {props.options[0]}
            </MenuItem>
          )} */}
          {props.isTimeSelector ? (
              <Box height={"120px"}>
                <BasicTimePicker {...props} changeTime={props.changeTime} changeFullTime={props.changeFullTime} value={props.value} shortValue={props.shortValue} setTimeOption={props.setTimeOption}/>
              </Box>
          ) : (
            props.options?.map((option) => (
              <MenuItem
                key={option.value || option}
                value={option.value || option}
                sx={{
                  borderBottom: "0.5px solid #B8C3D5",
                  fontSize: "15px",
                  fontWeight: 500,
                  py: "10px",
                  ":last-child": {
                    borderBottom: "none",
                  },
                }}
              >
                {option.label || option}
              </MenuItem>
            ))
          )}
        </Select>
      </FormControl>
    </Box>
  );
}
