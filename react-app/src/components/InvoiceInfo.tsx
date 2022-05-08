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
import {Invoice} from "../models/Invoice";
import {Item} from "../models/Item";
import WorkspaceInfo from "./WorkspaceInfo";


interface InvoiceInfoProps {

}


const rows: Invoice[] = [
    {
        customer: {name: "Customer A", address: "Address abc dex"},
        items: [
            {code: "C1", name: "Item 1", quantity: 5}
        ]
    }
];

const InvoiceInfo = (props: InvoiceInfoProps) => {
    const [customers, setCustomers] = useState<Customer[]>([]);

    return (
        <>
            <Typography
                sx={{flex: '1 1 100%'}}
                variant="h6"
                id="tableTitle"
                component="div"
            >
                To Be Generated Invoices
            </Typography>

            {rows.map((invoice: Invoice) => {
                return (
                    <>
                        <Typography
                            variant="button" display="block"
                        >
                            {'>>> ' + invoice.customer.name + " - " + invoice.customer.address }
                        </Typography>
                        <TableContainer style={{marginBottom: 10, paddingBottom: 10}}>
                            <Table sx={{minWidth: 650}} aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Code</TableCell>
                                        <TableCell align="right">Name</TableCell>
                                        <TableCell align="right">Quantity</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {invoice.items.map((item: Item) => (
                                        <TableRow
                                            key={item.code + '_' + invoice.customer.name}
                                            sx={{'&:last-child td, &:last-child th': {border: 0}}}
                                        >
                                            <TableCell component="th" scope="row">
                                                {item.code}
                                            </TableCell>
                                            <TableCell align="right">{item.name}</TableCell>
                                            <TableCell align="right">{item.quantity}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                            <WorkspaceInfo/>
                            <Button variant="contained" onClick={e => {
                                console.log("Click");
                                chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
                                    // @ts-ignore
                                    chrome.tabs.sendMessage(tabs[0].id, {type: "login"}, function (response) {
                                        console.log(response.farewell);
                                    });
                                });
                            }}> Generate </Button>

                        </TableContainer>
                    </>
                )
            })}
        </>
    )
};

export default InvoiceInfo;