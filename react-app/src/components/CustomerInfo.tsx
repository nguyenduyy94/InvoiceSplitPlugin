import React, {useState} from "react"
import {Customer} from "../models/Customer";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import {Typography} from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";


interface CustomerInfoProps {

}

function createData(
    name: string,
    address: string,
) {
    return {name, address};
}

const rows = [
    createData('Name 1', "Address 1"),
    createData('Name 2', "Address 2"),
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

const CustomerInfo = (props: CustomerInfoProps) => {
    const [customers, setCustomers] = useState<Customer[]>([]);

    return (
        <>
            <Typography
                variant="h6"
            >
                Customers
            </Typography>
            <EnhancedTableToolbar/>
            <TableContainer component={Paper}>
                <Table sx={{minWidth: 650}} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell align="right">Address</TableCell>

                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((row) => (
                            <TableRow
                                key={row.name}
                                sx={{'&:last-child td, &:last-child th': {border: 0}}}
                            >
                                <TableCell component="th" scope="row">
                                    {row.name}
                                </TableCell>
                                <TableCell align="right">{row.address}</TableCell>

                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    )
};

export default CustomerInfo;