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
import {Invoice, InvoiceXLSXRow} from "../models/Invoice";
import {Item} from "../models/Item";
import WorkspaceInfo from "./WorkspaceInfo";
import {
    DataGrid,
    GridCellParams,
    GridColumns, GridRenderCellParams,
    GridRowModel,
    GridSelectionModel,
    GridToolbarContainer, GridToolbarExport, GridValueFormatterParams, GridValueGetterParams
} from "@mui/x-data-grid";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import {Progress} from "../models/Progress";
import {stream} from "exceljs";
const XLSX = require("xlsx");


interface InvoiceInfoProps {
    invoices: Invoice[],
    xlsxData: InvoiceXLSXRow[],
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

    var moneyFormater = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'VND',

        // These options are needed to round to whole numbers if that's what you want.
        //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
        //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
    });

    var numberFormatter = new Intl.NumberFormat();

    const columns: GridColumns = [
        { field: 'name', headerName: 'Name', width: 180, editable: true },
        { field: 'code', headerName: 'Code ', width: 180, editable: true },
        { field: 'quantity', headerName: 'Quantity ', width: 180, editable: true },
    ];

    const exportColums: GridColumns = [
        { field: 'contractCode', headerName: 'MaHD(*)', width: 100, editable: true },
        { field: 'customerName', headerName: 'TenNguoiMua', width: 180, editable: true },
        { field: 'customerAddress', headerName: 'DiaChiKhachHang', width: 180, editable: true },

        { field: 'itemOrder', headerName: 'STT(*)', width: 100, editable: true },
        { field: 'itemName', headerName: 'TenHangHoa', width: 180, editable: true },
        { field: 'unitType', headerName: 'DonViTinh', width: 100, editable: true },
        { field: 'quantity', headerName: 'SoLuong', width: 100, editable: true,
            valueGetter: (params:GridValueGetterParams<number>) => params.value ? numberFormatter.format(params.value) : undefined
        },
        { field: 'price', headerName: 'DonGia', width: 100, editable: true,
            valueGetter: (params:GridValueGetterParams<number>) => params.value ? numberFormatter.format(params.value) : undefined
        },
        { field: 'tax', headerName: 'ThueSuat(%)(*)', width: 100, editable: true },
        { field: 'thanhTien', headerName: 'ThanhTien(*)', width: 180, editable: true,
            valueGetter: (params:GridValueGetterParams<number>) => params.value ? numberFormatter.format(params.value) : undefined
        },
        { field: 'tongTien', headerName: 'TongTien(*)', width: 180, editable: true,
            valueGetter: (params:GridValueGetterParams<number>) => params.value ? numberFormatter.format(params.value) : undefined
        },
        { field: 'tienThue', headerName: 'TienThue(*)', width: 180, editable: true,
            valueGetter: (params:GridValueGetterParams<number>) => params.value ? numberFormatter.format(params.value) : undefined
        },
        { field: 'itemType', headerName: 'TinhChat(*)', width: 180, editable: true },

        { field: 'tongTienTruocThue', headerName: 'TongTienTruocThue(*)', width: 180, editable: true,
            valueGetter: (params:GridValueGetterParams<number>) => params.value ? numberFormatter.format(params.value) : undefined
        },
        { field: 'tygia', headerName: 'TyGia(*)', width: 180, editable: true },
        { field: 'tongTienThue', headerName: 'Tong tien thue(*)', width: 180, editable: true,
            valueGetter: (params:GridValueGetterParams<number>) => params.value ? numberFormatter.format(params.value) : undefined
        },
        { field: 'tongTienDaCoThue', headerName: 'Tong tien da co thue(*)', width: 180, editable: true,
            valueGetter: (params:GridValueGetterParams<number>) => params.value ? numberFormatter.format(params.value) : undefined
        },
        { field: 'moneyAsText', headerName: 'TTBangChu(*)', width: 250, editable: true},

        { field: 'taxNumber', headerName: 'MaSoThue', width: 180, editable: true },
        { field: 'customerFirm', headerName: 'TenDonVi', width: 180, editable: true },
        { field: 'customerMail', headerName: 'MailKhachHang', width: 180, editable: true },
        { field: 'customerPhone', headerName: 'SDTKhachHang', width: 180, editable: true },
        { field: 'customerBankAcct', headerName: 'SoTaiKhoan', width: 180, editable: true },
        { field: 'customerBankName', headerName: 'TenNganHang', width: 180, editable: true },
        { field: 'customerCode', headerName: 'Quantity ', width: 180, editable: true },
        { field: 'paymentType', headerName: 'HinhThucThanhToan(*)', width: 180, editable: true },
        { field: 'currency', headerName: 'LoaiTien(*)', width: 180, editable: true },

    ];

    const [value, setValue] = React.useState(0);
    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    return (
        <>
            <div>
            <Typography variant="h6" ml={2}> Review Splitted Invoices</Typography>
            </div>

            {/*<div style={{height: 300}}>*/}
            {/*    <DataGrid*/}
            {/*        // You have to either give a height to the container of the DataGrid or set the autoHeight prop of the DataGrid to true. Otherwise, it does not know which size to take.*/}
            {/*        disableSelectionOnClick*/}
            {/*        rows={props.xlsxData}*/}
            {/*        columns={exportColums}*/}
            {/*        experimentalFeatures={{ newEditingApi: true }}*/}
            {/*        isCellEditable={(params: GridCellParams) => false}*/}
            {/*        density="compact"*/}
            {/*        components={{*/}
            {/*            Toolbar: () => (*/}
            {/*                <GridToolbarContainer>*/}


            {/*                </GridToolbarContainer>*/}
            {/*            ),*/}
            {/*        }}*/}
            {/*    />*/}
            {/*</div>*/}

            {props.invoices.map((invoice:Invoice, index) => {
                return (
                    <div
                        id={`vertical-tabpanel-${index}`}
                        aria-labelledby={`vertical-tab-${index}`}
                    >
                        <Box sx={{ p: 3 }}>
                            <Typography variant="body1">{invoice.customer.name} - {moneyFormater.format(invoice.totalMoney)}</Typography>
                            <Typography variant="caption">{invoice.customer.address}</Typography>
                            <div style={{height: "1em"}}/>
                            <div style={{height: 200}}>
                            <DataGrid
                                // You have to either give a height to the container of the DataGrid or set the autoHeight prop of the DataGrid to true. Otherwise, it does not know which size to take.
                                disableSelectionOnClick
                                rows={invoice.items}
                                columns={columns}
                                experimentalFeatures={{ newEditingApi: true }}
                                isCellEditable={(params: GridCellParams) => false}
                                density="compact"
                            />
                            </div>
                        </Box>

                    </div>
                )
            })}
        </>
    )
};

export default InvoiceInfo;