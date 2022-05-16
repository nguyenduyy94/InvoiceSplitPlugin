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
import {DataGrid, GridCellParams, GridColumns, GridRowModel, GridSelectionModel} from "@mui/x-data-grid";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";


interface InvoiceInfoProps {

}

interface CustomToolbarProps {
    onAdd:()=>void,
    onRemove:()=>void
}

function a11yProps(index: number) {
    return {
        id: `vertical-tab-${index}`,
        'aria-controls': `vertical-tabpanel-${index}`,
    };
}

const InvoiceInfo = (props: InvoiceInfoProps) => {
    const [invoices, setInvoices] = useState<Invoice[]>([
        {
            customer: {id : 1, name: "Customer A", address: "Address abc dex"},
            items: [
                {id: 0, code: "C1", name: "Item 1", quantity: 5}
            ]
        },
        {
            customer: {id : 2, name: "Customer B", address: "Address abc dex"},
            items: [
                {id: 0, code: "C1", name: "Item 1", quantity: 5}
            ]
        }
    ]);

    const [selectionModel, setSelectionModel] = React.useState<GridSelectionModel>([]);

    const columns: GridColumns = [
        { field: 'name', headerName: 'Name', width: 180, editable: true },
        { field: 'code', headerName: 'Code ', width: 180, editable: true },
        { field: 'quantity', headerName: 'Quantity ', width: 180, editable: true },
    ];

    const [value, setValue] = React.useState(0);
    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    return (
        <>
            <div>
            <Typography variant="h6" ml={2}> Invoices</Typography>
                <Alert severity="info">
                    Press GENERATE to produce Invoices from Customer & Items table. Generated data will be used to fill forms automatically!
                    <div style={{height: '1em'}}/>
                    <Button variant="contained" color={"info"} onClick={e => {

                    }}> Generate </Button>
                </Alert>
            </div>

            {invoices.map((invoice:Invoice, index) => {
                return (
                    <div
                        id={`vertical-tabpanel-${index}`}
                        aria-labelledby={`vertical-tab-${index}`}
                    >
                        <Box sx={{ p: 3 }}>
                            <Typography variant="body1">{invoice.customer.name}</Typography>
                            <Typography variant="caption">{invoice.customer.address}</Typography>
                            <div style={{height: "1em"}}/>
                            <DataGrid
                                autoHeight // You have to either give a height to the container of the DataGrid or set the autoHeight prop of the DataGrid to true. Otherwise, it does not know which size to take.
                                disableSelectionOnClick
                                rows={invoice.items}
                                columns={columns}
                                experimentalFeatures={{ newEditingApi: true }}
                                isCellEditable={(params: GridCellParams) => false}
                            />
                        </Box>

                    </div>
                )
            })}
            <div>
                <Alert severity="warning">
                    For safety, please DON'T close this tab or perform any action on this tab after Start Auto Fill Form
                    <div style={{height: "1em"}}/>
                    <Button variant="contained" size={"small"} color="warning" onClick={e => {

                    }}> Start Auto Fill Form </Button>
                </Alert>


            </div>
        </>
    )

    // // return (
    // //     <>
    // //         <Typography
    // //             sx={{flex: '1 1 100%'}}
    // //             variant="h6"
    // //             id="tableTitle"
    // //             component="div"
    // //         >
    // //             To Be Generated Invoices
    // //         </Typography>
    // //
    // //         {rows.map((invoice: Invoice) => {
    // //             return (
    // //                 <>
    // //                     <Typography
    // //                         variant="button" display="block"
    // //                     >
    // //                         {'>>> ' + invoice.customer.name + " - " + invoice.customer.address }
    // //                     </Typography>
    // //                     <TableContainer style={{marginBottom: 10, paddingBottom: 10}}>
    // //                         <Table sx={{minWidth: 650}} aria-label="simple table">
    // //                             <TableHead>
    // //                                 <TableRow>
    // //                                     <TableCell>Code</TableCell>
    // //                                     <TableCell align="right">Name</TableCell>
    // //                                     <TableCell align="right">Quantity</TableCell>
    // //                                 </TableRow>
    // //                             </TableHead>
    // //                             <TableBody>
    // //                                 {invoice.items.map((item: Item) => (
    // //                                     <TableRow
    // //                                         key={item.code + '_' + invoice.customer.name}
    // //                                         sx={{'&:last-child td, &:last-child th': {border: 0}}}
    // //                                     >
    // //                                         <TableCell component="th" scope="row">
    // //                                             {item.code}
    // //                                         </TableCell>
    // //                                         <TableCell align="right">{item.name}</TableCell>
    // //                                         <TableCell align="right">{item.quantity}</TableCell>
    // //                                     </TableRow>
    // //                                 ))}
    // //                             </TableBody>
    // //                         </Table>
    // //                         <WorkspaceInfo/>
    // //                         <Button variant="contained" onClick={e => {
    // //                             console.log("Click");
    // //                             chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
    // //                                 // @ts-ignore
    // //                                 chrome.tabs.sendMessage(tabs[0].id, {type: "login"}, function (response) {
    // //                                     console.log(response.farewell);
    // //                                 });
    // //                             });
    // //                         }}> Generate </Button>
    // //
    // //                     </TableContainer>
    // //                 </>
    // //             )
    // //         })}
    // //     </>
    // )
};

export default InvoiceInfo;