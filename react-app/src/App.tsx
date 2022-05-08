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


function App() {
    const [items, setItems] = useState<Item[]>([]);
    return (
        <Provider store={store}>
            <div className="App">
                <Paper style={{marginBottom: 10}}>
                    <CustomerInfo/>
                </Paper>
                <Paper style={{marginBottom: 10}}>
                    <ItemInfo/>
                </Paper>
                <Paper style={{marginBottom: 10}}>
                    <InvoiceInfo/>
                </Paper>
            </div>
        </Provider>
    );
}

export default App;
