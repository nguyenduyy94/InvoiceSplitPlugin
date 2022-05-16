import React, {useState} from "react"
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

interface ItemInfoProps {

}


interface CustomToolbarProps {
    onAdd:()=>void,
    onRemove:()=>void
}

const CustomToolbar = (cf:CustomToolbarProps) => {
    return () => (
        <>
            <Typography
                variant="h6"
                ml={2}
            >
                Items
            </Typography>
            <GridToolbarContainer>
                <Button onClick={cf.onAdd}> Add </Button>
                <Button onClick={cf.onRemove}> Remove </Button>
            </GridToolbarContainer>
        </>
    )
}

const ItemInfo = (props:ItemInfoProps) => {
    const [items, setItems] = useState<Item[]>([]);
    const [selectionModel, setSelectionModel] = React.useState<GridSelectionModel>([]);

    const columns: GridColumns = [
        { field: 'name', headerName: 'Name', width: 180, editable: true },
        { field: 'code', headerName: 'Code ', width: 180, editable: true },
        { field: 'quantity', headerName: 'Quantity ', width: 180, editable: true },
    ];
    return (
        <>

            <DataGrid
                autoHeight // You have to either give a height to the container of the DataGrid or set the autoHeight prop of the DataGrid to true. Otherwise, it does not know which size to take.
                disableSelectionOnClick
                rows={items}
                columns={columns}
                experimentalFeatures={{ newEditingApi: true }}
                isCellEditable={(params: GridCellParams) => true}
                components={{
                    Toolbar: CustomToolbar({
                        onAdd: () => {
                            setItems([...items, {id: new Date().getTime(), name: '', code: '' , quantity: 0}])
                        },
                        onRemove: () => {
                            const newData = items.filter(item => selectionModel.indexOf(item.id) < 0);
                            console.log("Remove " + JSON.stringify(selectionModel));
                            setItems([...newData])
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
            />
        </>
    )
};

export default ItemInfo