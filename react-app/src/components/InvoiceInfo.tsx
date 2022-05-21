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
import {Progress} from "../models/Progress";


interface InvoiceInfoProps {
    invoices: Invoice[]
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
    const [progress, setProgress] = useState<Progress|null>(null);
    const [enable, setEnable] = useState<boolean>(true);


    return (
        <>
            <div>
            <Typography variant="h6" ml={2}> Invoices</Typography>
            </div>

            {props.invoices.map((invoice:Invoice, index) => {
                return (
                    <div
                        id={`vertical-tabpanel-${index}`}
                        aria-labelledby={`vertical-tab-${index}`}
                    >
                        <Box sx={{ p: 3 }}>
                            <Typography variant="body1">{invoice.customer.name}</Typography>
                            <Typography variant="caption">{invoice.customer.address}</Typography>
                            <div style={{height: "1em"}}/>
                            <div style={{height: 400}}>
                            <DataGrid
                                // You have to either give a height to the container of the DataGrid or set the autoHeight prop of the DataGrid to true. Otherwise, it does not know which size to take.
                                disableSelectionOnClick
                                rows={invoice.items}
                                columns={columns}
                                experimentalFeatures={{ newEditingApi: true }}
                                isCellEditable={(params: GridCellParams) => false}
                            />
                            </div>
                        </Box>

                    </div>
                )
            })}
            <div>
                <Alert severity="warning">
                    For safety, please DON'T close this tab or perform any action on this tab after Start Auto Fill Form
                    <div style={{height: "1em"}}/>
                    <Button variant="contained" size={"small"} color="warning" onClick={e => {
                        setEnable(false);
                        chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
                            // @ts-ignore
                            chrome.tabs.sendMessage(tabs[0].id, {type: "startFillForm", payload: invoices }, function (response:Progress) {
                                console.log("Response " + JSON.stringify(response));
                                setProgress(response)
                            });
                        });
                    }}> Start Auto Fill Form </Button>
                    {progress ? (
                        <Typography variant="body2">{progress.message} - {progress.percent}% </Typography>
                    ) : null}
                </Alert>


            </div>
        </>
    )
};

export default InvoiceInfo;