import React, { useState } from "react";
import {
  Box,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TablePagination,
  Paper,
  Grid,
  FormControl,
} from "@mui/material";
import { Link } from "react-router-dom";
import MuiPhoneNumber from "material-ui-phone-number";

import BasicSelector from "../../common/Selector";
import PageTitle from "../../common/PageTitle";
import { tableHeader,tableData } from "../../utils";

export default function UserList() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const userTypes = ["User", "Admin"];

  const users = [
    {
      id: 1,
      name: "Name 1",
      email: "email@example.com",
      types: "User",
      phone: "9834933277",
    },

    {
      id: 2,
      name: "Name 2",
      email: "email2@example.com",
      types: "User",
      phone: "9834933277",
    },
    {
      id: 3,
      name: "Name 3",
      email: "email3@example.com",
      types: "User",
      phone: "9834933277",
    },
    {
      id: 4,
      name: "Name 4",
      email: "email4@example.com",
      types: "User",
      phone: "9834933277",
    },
    {
      id: 5,
      name: "Name 4",
      email: "email4@example.com",
      types: "User",
      phone: "9834933277",
    },
  ];

  return (
    <Box>
      <PageTitle title="User List" />
      <Box ml={5}>
        <FormControl
          sx={{
            width: "100%",
          }}
        >
          <Grid sx={{ my: "1rem" }} container spacing={3} width={"100%"}>
            <Grid item xs={6} md={6} lg={2}>
              <BasicSelector
                disableAll={true}
                options={userTypes}
                selectorHight={"53px"}
                name={"Types"}
                selectorWidth={"100%"}
              />
            </Grid>
            <Grid item xs={6} md={6} lg={2}>
              <MuiPhoneNumber defaultCountry={"et"} />
            </Grid>
            <Grid item xs={12} lg={12} style={{ paddingTop: 40 }}>
              <Link
                to="/Users/create"
                underline="none"
                style={{
                  backgroundColor: "black",
                  color: "white",
                  padding: 15,
                  borderRadius: 5,
                  textDecoration: "none",
                }}
              >
                Create User
              </Link>
            </Grid>
          </Grid>
        </FormControl>
        <Box display="flex" sx={{ my: "3rem" }}>
          <TableContainer component={Paper}>
            <div style={{ width: "auto", overflowX: "scroll" }}>
              <Table
                sx={{ minWidth: "auto" }}
                aria-label="custom pagination table"
                className="responsive-table"
              >
                <TableHead>
                  <TableRow className="table-header">
                    <TableCell align="left" component="th" sx={tableHeader}>
                      Name
                    </TableCell>
                    <TableCell align="left" component="th" sx={tableHeader}>
                      Email
                    </TableCell>
                    <TableCell align="left" component="th" sx={tableHeader}>
                      Types
                    </TableCell>
                    <TableCell align="left" component="th" sx={tableHeader}>
                      Phone
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map((user, index) => (
                    <TableRow key={index}>
                      <TableCell align="left" sx={tableData}>
                        {user.name}
                      </TableCell>
                      <TableCell align="left" sx={tableData}>
                        {user.email}
                      </TableCell>
                      <TableCell align="left" sx={tableData}>
                        {user.types}
                      </TableCell>
                      <TableCell align="left" sx={tableData}>
                        {user.phone}
                      </TableCell>   
                    </TableRow>   
                  ))}
                </TableBody>
              </Table>
              <TablePagination
                rowsPerPageOptions={[10, 25, 100]}
                component="div"
                count={users.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </div>
          </TableContainer>
        </Box>
      </Box>
    </Box>
  );
}
