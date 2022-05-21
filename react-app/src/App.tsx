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
    return (
        <Provider store={store}>
            <div className="App">
                <Paper style={{marginBottom: 10}}>
                    <CustomerInfo onChange={data => setCustomers(data)} />
                </Paper>
                <Paper style={{marginBottom: 10}}>
                    <ItemInfo onChange={data => setItems(data)}/>
                </Paper>
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
            </div>
        </Provider>
    );
}

export default App;
