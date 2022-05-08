import React from "react"
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell/TableCell";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import Toolbar from "@mui/material/Toolbar";
import {Typography} from "@mui/material";
import Button from "@mui/material/Button";
import {Item} from "../models/Item";

interface ItemInfoProps {

}


const rows:Item[] = [
    {name: "Item 1", quantity: 10, code: "QWERTY1"},
    {name: "Item 2", quantity: 8, code: "QWERTY2"},
    {name: "Item 3", quantity: 7, code: "QWERTY3"},

];


interface EnhancedTableToolbarProps {
}

const EnhancedTableToolbar = (props: EnhancedTableToolbarProps) => {
    return (
        <Toolbar>

            <Button>Import</Button>
            <Button>Add</Button>
        </Toolbar>
    );
};

const ItemInfo = (props:ItemInfoProps) => {
  return (
      <>
          <Typography
              variant="h6"
          >
              Items
          </Typography>
          <EnhancedTableToolbar/>
          <TableContainer component={Paper}>
              <Table sx={{minWidth: 650}} aria-label="simple table">
                  <TableHead>
                      <TableRow>
                          <TableCell>Code</TableCell>
                          <TableCell align="right">Name</TableCell>
                          <TableCell align="right">Quantity</TableCell>
                      </TableRow>
                  </TableHead>
                  <TableBody>
                      {rows.map((row) => (
                          <TableRow
                              key={row.code}
                              sx={{'&:last-child td, &:last-child th': {border: 0}}}
                          >
                              <TableCell component="th" scope="row">
                                  {row.code}
                              </TableCell>
                              <TableCell align="right">{row.name}</TableCell>
                              <TableCell align="right">{row.quantity}</TableCell>
                          </TableRow>
                      ))}
                  </TableBody>
              </Table>
          </TableContainer>
      </>
  )
};

export default ItemInfo