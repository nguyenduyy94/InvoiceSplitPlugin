import React, {useEffect, useState} from "react"
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell/TableCell";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import Toolbar from "@mui/material/Toolbar";
import {Typography} from "@mui/material";
import Button from "@mui/material/Button";
import {Item} from "../models/Item";
import {
    DataGrid,
    GridCellParams, GridColumns,
    GridRowModel,
    GridSelectionModel,
    GridToolbarContainer,
    useGridApiRef
} from "@mui/x-data-grid";
import {Customer} from "../models/Customer";
import readXlsxFile, {Row} from 'read-excel-file'
import {MaSanPham} from "../models/MaSanPham";

interface MaSanPhamTableProps {
    onChange: (items:MaSanPham[])=>void;
}


interface CustomToolbarProps {
    onAdd:()=>void,
    onRemove:()=>void,
    onImport:(file:File)=>void,
}

const CustomItemToolbar = (cf:CustomToolbarProps) => {
    return () => (
        <>
            {/*<Typography*/}
            {/*    variant="h6"*/}
            {/*    ml={2}*/}
            {/*>*/}
            {/*    Items*/}
            {/*</Typography>*/}
            <GridToolbarContainer>
                <Button onClick={cf.onAdd}> Add </Button>
                <Button onClick={cf.onRemove}> Remove </Button>
                <input id="file_msp" type="file" hidden onChange={(e) => {
                    // @ts-ignore
                    cf.onImport(e.target.files[0])
                }}/>
                <Button onClick={() => {
                    // @ts-ignore
                    document.getElementById("file_msp").click()
                }}> Import </Button>
            </GridToolbarContainer>
        </>
    )
}

const MaSanPhamTable = (props:MaSanPhamTableProps) => {
    const [items, setItems] = useState<MaSanPham[]>([]);
    const [selectionModel, setSelectionModel] = React.useState<GridSelectionModel>([]);

    const columns: GridColumns = [
        { field: 'maSanPham', headerName: 'MaSanPham', width: 180, editable: true },
        { field: 'name', headerName: 'Name ', width: 250, editable: true },
        { field: 'unit', headerName: 'Unit ', width: 180, editable: true }
    ];
    return (
        <>
            <div style={{height: 300}}>
                <DataGrid
                    // You have to either give a height to the container of the DataGrid or set the autoHeight prop of the DataGrid to true. Otherwise, it does not know which size to take.
                    disableSelectionOnClick
                    rows={items}
                    columns={columns}
                    experimentalFeatures={{ newEditingApi: true }}
                    isCellEditable={(params: GridCellParams) => true}
                    components={{
                        Toolbar: CustomItemToolbar({
                            onAdd: () => {
                                setItems([...items, {id: new Date().getTime(), name: '', maSanPham: '' , unit: ''}])
                                props.onChange(items);
                            },
                            onRemove: () => {
                                const newData = items.filter(item => selectionModel.indexOf(item.id || '') < 0);
                                console.log("Remove " + JSON.stringify(selectionModel));
                                setItems([...newData])
                                props.onChange(items);
                            },
                            onImport: (file:File) => {
                                readXlsxFile(file).then((rows) => {
                                    console.log("Read " + rows.length + " items")
                                    const result = [];
                                    for (let i = 1; i < rows.length; i++) {
                                        const row = rows[i];
                                        const item:MaSanPham = {
                                            maSanPham : row[0].toString(),
                                            name: row[1].toString(),
                                            unit: row[2].toString(),
                                            id: row[0].toString()
                                        };
                                        result.push(item)
                                    }
                                    setItems(result);
                                    props.onChange(result);
                                })
                            }
                        })
                    }}
                    processRowUpdate={(newRow: GridRowModel) => {
                        const updatedRow = { ...newRow, isNew: false };
                        setItems(items.map((row) => (row.id === newRow.id ? updatedRow : row)));
                        return updatedRow;
                    }}
                    checkboxSelection={true}
                    selectionModel={selectionModel}
                    onSelectionModelChange={(newSelectionModel) => {
                        setSelectionModel(newSelectionModel);
                    }}
                    density="compact"
                />
            </div>
        </>
    )
};

export default MaSanPhamTable