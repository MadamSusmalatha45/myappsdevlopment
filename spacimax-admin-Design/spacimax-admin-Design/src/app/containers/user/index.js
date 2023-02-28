import React from "react";
import { Box, Link  } from "@mui/material";
import PageTitle from "../../common/PageTitle";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableFooter from '@mui/material/TableFooter';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TableHead from '@mui/material/TableHead';
// import { blue } from '@mui/material/colors';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { tableHeader,tablebody ,tableHeader,tableData } from "../../utils";
import {  getAPI } from "../../network";

import "./style.css";

export default function UserPage() {
    const [gaurds, setGaurds]=useState([])

useEffect(()=>{
    setGaurd()
},[])


const setGaurd = async() => {
        setLoader(true)
        let data = await getAPI('/admin/guards');
        if(data){
            setGaurds(data);
        }
        setLoader(false)
      }
    



return (
    <Box sx={{ height: "inherit" }}>
      <PageTitle title="Security Guards"  />
      <Box display="flex" sx={{ my: "3rem" }}>
        <TableContainer component={Paper} sx={{ mx: "0.8rem" }} >
          <div style={{width: 'auto', overflowX: 'scroll'}}>
            <Table sx={{ minWidth: 'auto' }} aria-label="custom pagination table" className="responsive-table">
                <TableHead >
                    <TableRow className="table-header">
                        <TableCell align="left" component="th" sx={tableHeader}>Email</TableCell>
                        <TableCell align="left" component="th" sx={tableHeader}>Name</TableCell>
                        <TableCell align="left" component="th" sx={tableHeader}>Contact</TableCell>
                        <TableCell align="left" component="th" sx={tableHeader}>Security License Number</TableCell>
                        <TableCell align="left" component="th" sx={tableHeader}>Expiry</TableCell>
                        <TableCell align="left" component="th" sx={tableHeader}>Postcode</TableCell>
                        <TableCell align="left" component="th" sx={tableHeader} style={{width : '15%'}}>View License</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {
                        gaurds.map((item, index) => (
                            <TableRow key={index}>
                                <TableCell  align="left" sx={tableData}>
                                    {item.email}
                                </TableCell>
                                <TableCell align="left" sx={tableData}>
                                    {item.name}
                                </TableCell>
                                <TableCell align="left" sx={tableData}>
                                    {item.contact}
                                </TableCell>
                                <TableCell align="left" sx={tableData}>
                                    {item.licenseNumber}
                                </TableCell>
                                <TableCell  align="left" sx={tableData}>
                                    {item.expiryDate}
                                </TableCell>
                                <TableCell align="left" sx={tableData}>
                                    {item.postcode}
                                </TableCell>
                                <TableCell  align="center" sx={tableData}>
                                <Link href="#" underline="always" className="file-class">
                                    {'Open File'}
                                </Link>
                                </TableCell>
                            </TableRow>
                        ))
                    }
                </TableBody>
                <TableFooter>
                <TableRow>
                    <TableCell sx={tableData} direction="column" justifyContent="center">
                      <Link href="#" underline="none" >
                         {/* Add Guard <AddCircleOutlineIcon  className="add-icon"/> */}
                         <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            flexWrap: 'wrap',
                            justifyContent: 'space-between'

                        }}>
                            
                            <span className="add-title">Add Guard</span>
                            <AddCircleIcon className="add-icon" fontSize="large"/>
                        </div>  
                      </Link>
                    </TableCell>
                    <TablePagination
                    align="right"
                    rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                    colSpan={6}
                    count={users.length}
                    rowsPerPage={10}
                    page={1}
                    SelectProps={{
                        inputProps: {
                        'aria-label': 'rows per page',
                        },
                        native: true,
                    }}
                    // onPageChange={handleChangePage}
                    // onRowsPerPageChange={handleChangeRowsPerPage}
                    // ActionsComponent={TablePaginationActions}
                    />
                </TableRow>
                </TableFooter>
            </Table>
            </div>
        </TableContainer>

      </Box>
    </Box>
  );
}


