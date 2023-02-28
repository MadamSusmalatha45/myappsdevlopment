import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import { tableData } from "../utils";
import norecordFound from "../../assets/images/NoRecordFound.gif"
import "./style.css"

export default function EmptyTable(props){
    const {colSpan} = props
    return(
        <TableRow>
            <TableCell align="center"  sx={tableData} colSpan={colSpan}>
            <h3>NO RECORD FOUND</h3>
            </TableCell>
        </TableRow>  
    )
}