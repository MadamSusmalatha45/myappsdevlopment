import React from "react";
import { Box, TextField } from "@mui/material";

export default function BasicTextArea({ placeholder, background }) {
  return (
    <Box>
      <TextField
        multiline
        rows={6}
        variant="outlined"
        placeholder={placeholder}
        sx={{
          width: "100%",
          background,
        }}
      />
    </Box>
  );
}
