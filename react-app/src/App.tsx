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
import {write, readFile, writeFileXLSX, writeFile, read} from "xlsx";
import MaSanPhamTable from "./components/MaSanPhamTable";
import {MaSanPham} from "./models/MaSanPham";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepButton from "@mui/material/StepButton";
const XLSX = require("xlsx");

const ensureMaSanPham = (items:Item[], maSanPham:MaSanPham[]) => {
    const sortedMaSanPham = maSanPham.map(item => {
        return {...item, name: item.name.toLowerCase().replaceAll(" ", "") }
    }).sort((a,b) => a.name > b.name ? 1 :-1);

    for (let item of items) {
        if (!item.code || item.code === '') {
            const itemName = item.name.toLowerCase().replaceAll(" ", "");
            for (const msp of sortedMaSanPham) {
                if (msp.name === itemName) {
                    item.code = msp.maSanPham;
                    break
                }
            }
        }
    }
};

const splitInvoice = (customers:Customer[], items:Item[], maSanPham:MaSanPham[] ) => {
    ensureMaSanPham(items, maSanPham);
    const invoices:Invoice[] = customers.map(c => { return  {customer: c, items: [], totalMoney: 0}});
    const customerCount = customers.length;
    // for (const item of items) {
    //     if (item.quantity > 0) {
    //         const avg = Math.floor(item.quantity / customerCount);
    //         const last = item.quantity - ((customerCount - 1) * avg);
    //         for (let i = 0; i < invoices.length; i++) {
    //             if (i === invoices.length - 1) {
    //                 invoices[i].items.push({...item, quantity: last})
    //             } else {
    //                 invoices[i].items.push({...item, quantity: avg})
    //             }
    //         }
    //     }
    // }

    let customerIndex = 0;
    for (let item of items) {
        if (item.quantity > 0) {
            invoices[customerIndex].items.push(item);
            customerIndex++;
            if (customerIndex >= invoices.length) {
                customerIndex = 0;
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
    for (let stt = 0; stt < invoices.length; stt++) {
        const invoice = invoices[stt];
        const timestamp = new Date().getTime();
        for (let i = 0; i < invoice.items.length; i++) {
            const item = invoice.items[i];
            const tax = 10;
            const thanhTien =  item.quantity * item.price;
            const row: InvoiceXLSXRow = {
                id: timestamp + "_" + i,
                contractCode: stt + 1,
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

const downloadSheet = (data:InvoiceXLSXRow[]) => {
    const worksheet = XLSX.utils.json_to_sheet(data, {
        header: ["contractCode","taxNumber",'customerName','customerFirm','customerAddress','customerMail','customerPhone',
            'customerBankAcct','customerBankName','paymentType','currency','itemOrder','itemName','unitType','quantity','price',
            'thanhTien','tax','tienThue','tongTien','itemType','tongTienTruocThue','tygia','tongTienThue','tongTienDaCoThue','moneyAsText','customerCode'],
    });
    const workbook = XLSX.utils.book_new();

    const header = ["MaHD(*)",'MaSoThue',
        'TenNguoiMua','TenDonVi','DiaChiKhachHang','MailKhachHang','SDTKhachHang','SoTaiKhoan',
        'TenNganHang',
        'HinhThucThanhToan(*)',
        'LoaiTien(*)',
        'STT(*)',
        'TenHangHoa',
        'DonViTinh',
        'SoLuong',
        'DonGia',
        'ThanhTien(*)',
        'ThueSuat(%)(*)',
        'TienThue(*)',
        'TongTien(*)',
        'TinhChat(*)',
        'TongTienTruocThue(*)',
        'TyGia(*)',
        'Tong tien thue(*)',
        'Tong tien da co thue(*)',
        'TTBangChu(*)',
        'Ma KH'];


    XLSX.utils.book_append_sheet(workbook, worksheet, "List_HD");
    XLSX.utils.book_append_sheet(workbook, null, "GhiChu");
    workbook.Sheets['List_HD']['A1'].v = "MaHD(*)";
    workbook.Sheets['List_HD']['B1'].v = "MaSoThue";
    workbook.Sheets['List_HD']['C1'].v = "TenNguoiMua";
    workbook.Sheets['List_HD']['D1'].v = "TenDonVi";
    workbook.Sheets['List_HD']['E1'].v = "DiaChiKhachHang";
    workbook.Sheets['List_HD']['F1'].v = "MailKhachHang";
    workbook.Sheets['List_HD']['G1'].v = "SDTKhachHang";
    workbook.Sheets['List_HD']['H1'].v = "SoTaiKhoan";
    workbook.Sheets['List_HD']['I1'].v = "TenNganHang";
    workbook.Sheets['List_HD']['J1'].v = "HinhThucThanhToan(*)";
    workbook.Sheets['List_HD']['K1'].v = "LoaiTien(*)";
    workbook.Sheets['List_HD']['L1'].v = "STT(*)";
    workbook.Sheets['List_HD']['M1'].v = "TenHangHoa";
    workbook.Sheets['List_HD']['N1'].v = "DonViTinh";
    workbook.Sheets['List_HD']['O1'].v = "SoLuong";
    workbook.Sheets['List_HD']['P1'].v = "DonGia";
    workbook.Sheets['List_HD']['Q1'].v = "ThanhTien(*)";
    workbook.Sheets['List_HD']['R1'].v = "ThueSuat(%)(*)";
    workbook.Sheets['List_HD']['S1'].v = "TienThue(*)";
    workbook.Sheets['List_HD']['T1'].v = "TongTien(*)";
    workbook.Sheets['List_HD']['U1'].v = "TinhChat(*)";
    workbook.Sheets['List_HD']['V1'].v = "TongTienTruocThue(*)";
    workbook.Sheets['List_HD']['W1'].v = "TyGia(*)";
    workbook.Sheets['List_HD']['X1'].v = "Tong tien thue(*)";
    workbook.Sheets['List_HD']['Y1'].v = "TTong tien da co thue(*)";
    workbook.Sheets['List_HD']['Z1'].v = "TTBangChu(*)";
    workbook.Sheets['List_HD']['AA1'].v = "Ma KH";

    XLSX.writeFile(workbook, "HD-TT78.xlsx");

};


const steps = ['Danh sach khach hang', 'Ma San Pham', 'Danh sach hang hoa', 'Split & Auto Fill'];

const totalSteps = () => {
    return steps.length;
};


function App() {
    const [items, setItems] = useState<Item[]>([]);
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [maSanPham, setMaSanPham] = useState<MaSanPham[]>([]);
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [xlsxData, setXLSXData] = useState<InvoiceXLSXRow[]>([]);
    const [progress, setProgress] = useState<Progress|null>(null);
    const [enable, setEnable] = useState<boolean>(true);
    const [hideInput, setHideInput] = useState<boolean>(false);
    const [activeStep, setActiveStep] = useState<number>(0);
    const [completed, setCompleted] = React.useState<{
        [k: number]: boolean;
    }>({});

    const completedSteps = () => {
        return Object.keys(completed).length;
    };

    const isLastStep = () => {
        return activeStep === totalSteps() - 1;
    };

    const allStepsCompleted = () => {
        return completedSteps() === totalSteps();
    };

    const handleNext = () => {
        const newActiveStep =
            isLastStep() && !allStepsCompleted()
                ? // It's the last step, but not all steps have been completed,
                  // find the first step that has been completed
                steps.findIndex((step, i) => !(i in completed))
                : activeStep + 1;
        setActiveStep(newActiveStep);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleStep = (step: number) => () => {
        setActiveStep(step);
    };

    const handleComplete = () => {
        const newCompleted = completed;
        newCompleted[activeStep] = true;
        setCompleted(newCompleted);
        handleNext();
    };

    const handleReset = () => {
        setActiveStep(0);
        setCompleted({});
    };

    return (
        <Provider store={store}>
            <div className="App">
                    <>
                        <Stepper nonLinear activeStep={activeStep}>
                            {steps.map((label, index) => (
                                <Step key={label} completed={completed[index]}>
                                    <StepButton color="inherit" onClick={handleStep(index)}>
                                        {label}
                                    </StepButton>
                                </Step>
                            ))}
                        </Stepper>
                        <div>
                            <Button
                                color="inherit"
                                disabled={activeStep === 0}
                                onClick={handleBack}
                                sx={{ mr: 1 }}
                            >
                                Back
                            </Button>
                            <Button onClick={handleNext} sx={{ mr: 1 }}>
                                Next
                            </Button>
                        </div>
                        {activeStep === 0 ? (
                            <>
                                <Typography variant="body1">Step 1. Input Customer data</Typography>
                                <Paper style={{marginBottom: 10}}>
                                    <CustomerInfo onChange={data => setCustomers(data)} />
                                </Paper>
                            </>
                        ) : null }
                        {activeStep === 1 ? (
                            <>
                                <Typography variant="body1">Step 2. Input MaSanPham</Typography>
                                <Paper style={{marginBottom: 10}}>
                                    <MaSanPhamTable onChange={data => setMaSanPham(data)} />
                                </Paper>
                            </>
                        ) : null}
                        {activeStep === 2 ? (
                            <>
                                <Typography variant="body1">Step 3. Input Items data</Typography>
                                <Paper style={{marginBottom: 10}}>
                                <ItemInfo onChange={data => setItems(data)}/>
                                </Paper>
                            </>
                        ) : null }
                        {activeStep === 3 ? (
                            <>
                                <Typography variant="body1">Step 4. Split Invoices & Auto Fill </Typography>
                                <Button variant="contained" color={"info"} onClick={e => {
                                    const invoices:Invoice[] = splitInvoice(customers, items, maSanPham);
                                    setInvoices(invoices);
                                    setHideInput(true);
                                }}> Generate Invoices Data </Button>
                                <div style={{position: "fixed", bottom: 0, zIndex: 10}}>
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
                                        {/*<Button size={"small"} onClick={e => {*/}
                                        {/*    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {*/}
                                        {/*        // @ts-ignore*/}
                                        {/*        chrome.tabs.sendMessage(tabs[0].id, {type: "stopFillForm", payload: invoices }, function (response:Progress) {*/}
                                        {/*            console.log("Response " + JSON.stringify(response));*/}
                                        {/*            setEnable(true);*/}
                                        {/*        });*/}
                                        {/*    });*/}

                                        {/*}}>Cancel</Button>*/}
                                    </Alert>
                                    <Alert severity="info">
                                        To Stop Automation, please close current tab.
                                    </Alert>
                                    {progress ? (
                                        <Alert severity={progress && !!progress.error ? "error" : "info"}>
                                            {progress.message} - {progress.percent}%
                                            {progress.error}
                                        </Alert>
                                    ) : null}
                                </div>
                                <Paper style={{marginBottom: 10}}>
                                    <InvoiceInfo invoices={invoices} xlsxData={xlsxData} />
                                </Paper>
                            </>
                        ) : null}

                    </>
            </div>
        </Provider>
    );
}

export default App;
