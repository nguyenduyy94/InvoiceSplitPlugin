import React, {useState} from 'react';
import logo from './logo.svg';
import './App.css';

import store from './redux/store'
import {Provider} from 'react-redux'
import WorkspaceInfo from "./components/WorkspaceInfo";
import Button from '@mui/material/Button';

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import {Customer} from "./models/Customer";
import {Item} from "./models/Item";
import CustomerInfo from "./components/CustomerInfo";
import ItemInfo from "./components/ItemInfo";
import InvoiceInfo from "./components/InvoiceInfo";
import {Paper} from "@mui/material";
import {DataGrid, GridCellParams, GridColumns, GridRowsProp} from "@mui/x-data-grid";
import Alert from "@mui/material/Alert/Alert";
import {Invoice} from "./models/Invoice";
import {Progress} from "./models/Progress";


const splitInvoice = (customers:Customer[], items:Item[]) => {
    const invoices:Invoice[] = customers.map(c => { return  {customer: c, items: []}});
    const customerCount = customers.length;
    for (const item of items) {
        if (item.quantity > 0) {
            const avg = Math.floor(item.quantity / customerCount);
            const last = item.quantity - ((customerCount - 1) * avg);
            for (let i = 0; i < invoices.length; i++) {
                if (i === invoices.length - 1) {
                    invoices[i].items.push({...item, quantity: last})
                } else {
                    invoices[i].items.push({...item, quantity: avg})
                }
            }
        }
    }
    return invoices;
};

function App() {
    const [items, setItems] = useState<Item[]>([]);
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [progress, setProgress] = useState<Progress|null>(null);
    const [enable, setEnable] = useState<boolean>(true);

    return (
        <Provider store={store}>
            <div className="App">
                <Typography variant="h5">Step 1. Input Customer data</Typography>
                <Paper style={{marginBottom: 10}}>
                    <CustomerInfo onChange={data => setCustomers(data)} />
                </Paper>
                <Typography variant="h5">Step 2. Input Items data</Typography>
                <Paper style={{marginBottom: 10}}>
                    <ItemInfo onChange={data => setItems(data)}/>
                </Paper>
                <Typography variant="h5">Step 3. Split Invoices </Typography>
                <Alert severity="info">
                    Press GENERATE to produce Invoices from Customer & Items table. Generated data will be used to fill forms automatically!
                    <div style={{height: '1em'}}/>
                    <Button variant="contained" color={"info"} onClick={e => {
                        const invoices:Invoice[] = splitInvoice(customers, items);
                        setInvoices(invoices)
                    }}> Generate </Button>
                </Alert>
                <Paper style={{marginBottom: 10}}>
                    <InvoiceInfo invoices={invoices} />
                </Paper>
                <Typography variant="h5">Step 4. Start Auto Fill Form</Typography>
                <div>
                    <Alert severity="warning">
                        For safety, please DON'T close this tab or perform any action on this tab after Start Auto Fill Form
                        <div style={{height: "1em"}}/>
                        <Button variant="contained" size={"small"} color="warning" disabled={invoices.length == 0 || !enable} onClick={e => {
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
                        <Button size={"small"} onClick={e => {
                            chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
                                // @ts-ignore
                                chrome.tabs.sendMessage(tabs[0].id, {type: "stopFillForm", payload: invoices }, function (response:Progress) {
                                    console.log("Response " + JSON.stringify(response));
                                    setEnable(true);
                                });
                            });

                        }}>Cancel</Button>
                    </Alert>


                </div>
            </div>
        </Provider>
    );
}

export default App;
