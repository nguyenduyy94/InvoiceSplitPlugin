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
import {Invoice, InvoiceXLSXFirstRow, InvoiceXLSXRow} from "./models/Invoice";
import {Progress} from "./models/Progress";
import {VNDReader} from "./services/VNDReader";


const splitInvoice = (customers:Customer[], items:Item[]) => {
    const invoices:Invoice[] = customers.map(c => { return  {customer: c, items: [], totalMoney: 0}});
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

    // Calculate Sum
    for (const invoice of invoices) {
        invoice.totalMoney = invoice.items.reduce((partialSum, item) => partialSum + item.quantity * item.price, 0);
    }
    return invoices;
};

const exportToXLSXData = (invoices:Invoice[]) => {
    const vndReader = new VNDReader();
    const rows:InvoiceXLSXRow[] = [];
    for (const invoice of invoices) {
        for (let i = 0; i < invoice.items.length; i++) {
            const item = invoice.items[i];
            const tax = 10;
            const thanhTien =  item.quantity * item.price;
            const timestamp = new Date().getTime();
            const row: InvoiceXLSXRow = {
                id: timestamp + "_" + i,
                contractCode: timestamp + "_" + i,
                itemName: item.name,
                itemOrder: i + 1,
                thanhTien: thanhTien,
                itemType: 1,
                price: item.price,
                quantity: item.quantity,
                tax: tax,
                unitType: item.unit,
                tongTien: tax * thanhTien / 100 + thanhTien,
                tienThue: tax * thanhTien / 100
            };

            if (i === 0) {
                const firstRow:InvoiceXLSXFirstRow = {
                    ...row,
                    currency: "VND",
                    customerAddress: invoice.customer.address,
                    customerBankAcct: "",
                    customerBankName: "",
                    customerCode: "",
                    customerFirm: "",
                    customerMail: "",
                    customerName: invoice.customer.name,
                    customerPhone: invoice.customer.phone || '',
                    paymentType: 3,
                    taxNumber: "",
                    tygia: 1,
                    tongTienTruocThue: invoice.totalMoney,
                    tongTienThue: tax * invoice.totalMoney / 100,
                    tongTienDaCoThue: invoice.totalMoney + invoice.totalMoney * tax / 100,
                    moneyAsText: ""
                };
                firstRow.moneyAsText = vndReader.doc(firstRow.tongTienDaCoThue);
                rows.push(firstRow);
            } else {
                rows.push(row)
            }

        }
    }

    return rows;
};


function App() {
    const [items, setItems] = useState<Item[]>([]);
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [xlsxData, setXLSXData] = useState<InvoiceXLSXRow[]>([]);
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
                        const xlsxData:InvoiceXLSXRow[] = exportToXLSXData(invoices);
                        setInvoices(invoices);
                        setXLSXData(xlsxData);
                    }}> SPLIT </Button>
                </Alert>
                <Paper style={{marginBottom: 10}}>
                    <InvoiceInfo invoices={invoices} xlsxData={xlsxData} />
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
                    {progress ? (
                        <Alert severity={progress && !!progress.error ? "error" : "info"}>
                            {progress.message} - {progress.percent}%
                            {progress.error}
                        </Alert>
                    ) : null}
                </div>
            </div>
        </Provider>
    );
}

export default App;
