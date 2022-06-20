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

interface ItemInfoProps {
    onChange: (items:Item[])=>void;
    initRows?: Item[];
    onSelectionChange: (ids:number[])=>void;
    initSelection: number[]
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
                <input id="file_item" type="file" hidden onChange={(e) => {
                    // @ts-ignore
                    cf.onImport(e.target.files[0])
                }}/>
                <Button onClick={() => {
                    // @ts-ignore
                    document.getElementById("file_item").click()
                }}> Import </Button>
            </GridToolbarContainer>
        </>
    )
}

const ItemInfo = (props:ItemInfoProps) => {
    const [items, setItems] = useState<Item[]>(props.initRows || []);
    const [selectionModel, setSelectionModel] = React.useState<GridSelectionModel>(props.initSelection || []);

    const columns: GridColumns = [
        { field: 'name', headerName: 'Name', width: 180, editable: true },
        { field: 'code', headerName: 'Code ', width: 180, editable: true },
        { field: 'quantity', headerName: 'Quantity ', width: 180, editable: true },
        { field: 'price', headerName: 'Price ', width: 180, editable: true },
        { field: 'unit', headerName: 'Unit ', width: 180, editable: true },
    ];
    return (
        <>
            <div style={{height: 500}}>
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
                            const newData = [...items, {id: new Date().getTime(), name: '', code: '' , quantity: 0, price: 0, unit: ''}];
                            setItems(newData)
                            props.onChange(newData);
                        },
                        onRemove: () => {
                            const newData = items.filter(item => selectionModel.indexOf(item.id) < 0);
                            console.log("Remove " + JSON.stringify(selectionModel));
                            setItems([...newData])
                            props.onChange(newData);
                        },
                        onImport: (file:File) => {
                            readXlsxFile(file).then((rows) => {
                                console.log("Read " + rows.length + " items")
                                const result = [];
                                const selectedIds:number[] = [];
                                for (const row of rows) {
                                    if (typeof row[0] === 'number') { // row with ID
                                        const item:Item = {
                                            id : row[0],
                                            code: row[1].toString(),
                                            name: row[2].toString(),
                                            unit: row[3].toString(),
                                            price: Number.parseFloat(row[4].toString()),
                                            quantity: Number.parseInt(row[5].toString())
                                        };
                                        result.push(item);
                                        selectedIds.push(item.id)
                                    }
                                }
                                setItems(result);
                                setSelectionModel(selectedIds);
                                props.onChange(result);
                                props.onSelectionChange(selectedIds);
                            })
                        }
                    })
                }}
                processRowUpdate={(newRow: GridRowModel) => {
                    const updatedRow = { ...newRow, isNew: false };
                    const newData = items.map((row) => (row.id === newRow.id ? updatedRow : row));
                    setItems(newData);
                    props.onChange(newData);
                    return updatedRow;
                }}
                checkboxSelection={true}
                selectionModel={selectionModel}
                onSelectionModelChange={(newSelectionModel) => {
                    setSelectionModel(newSelectionModel);
                    props.onSelectionChange(newSelectionModel as number[])
                }}
                density="compact"
            />
            </div>
        </>
    )
};

export default ItemInfo