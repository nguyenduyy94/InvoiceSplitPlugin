import React, {ChangeEvent, ChangeEventHandler, useState} from "react"
import {Customer} from "../models/Customer";
import {Typography} from "@mui/material";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import readXlsxFile from 'read-excel-file'

import {
    DataGrid, GridCallbackDetails, GridCellEditCommitParams,
    GridCellParams,
    GridColumns, GridRowModel,
    GridRowsProp, GridSelectionModel,
    GridToolbarContainer, MuiBaseEvent, MuiEvent,
    useGridApiRef
} from "@mui/x-data-grid";
import UploadData = chrome.webRequest.UploadData;

interface CustomerInfoProps {

}

interface CustomToolbarProps {
    onAdd:()=>void,
    onRemove:()=>void,
    onImport:(file:File)=>void,
}

const CustomToolbar = (cf:CustomToolbarProps) => {
    return () => (
        <>
            <Typography
                variant="h6" ml={2}
            >
                Customers
            </Typography>
        <GridToolbarContainer>
            <Button onClick={cf.onAdd}> Add </Button>
            <Button onClick={cf.onRemove}> Remove </Button>
            <input id="file" type="file" hidden onChange={(e) => {
                // @ts-ignore
                cf.onImport(e.target.files[0])
            }}/>
            <Button onClick={() => {
                // @ts-ignore
                document.getElementById("file").click()
            }}> Import </Button>
        </GridToolbarContainer>
        </>
    )
}

const CustomerInfo = (props: CustomerInfoProps) => {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [selectionModel, setSelectionModel] = React.useState<GridSelectionModel>([]);


    const columns: GridColumns = [
        { field: 'name', headerName: 'Name', width: 180, editable: true },
        { field: 'address', headerName: 'Address ', width: 360, editable: true },
        { field: 'phone', headerName: 'Phone ', width: 180, editable: true },
    ];

    return (
        <>

            <DataGrid
                autoHeight // You have to either give a height to the container of the DataGrid or set the autoHeight prop of the DataGrid to true. Otherwise, it does not know which size to take.
                disableSelectionOnClick
                rows={customers}
                columns={columns}
                experimentalFeatures={{ newEditingApi: true }}
                isCellEditable={(params: GridCellParams) => true}
                components={{
                    Toolbar: CustomToolbar({
                        onAdd: () => {
                            setCustomers([...customers, {id: new Date().getTime(), name: '', address: ''}])
                        },
                        onRemove: () => {
                            const newData = customers.filter(item => selectionModel.indexOf(item.id) < 0);
                            console.log("Remove " + JSON.stringify(selectionModel));
                            setCustomers([...newData])
                        },
                        onImport: (file:File) => {
                            readXlsxFile(file).then((rows) => {
                                console.log("Read " + rows.length + " rows")
                            })
                        }

                    } )
                }}
                processRowUpdate={(newRow: GridRowModel) => {
                    const updatedRow = { ...newRow, isNew: false };
                    setCustomers(customers.map((row) => (row.id === newRow.id ? updatedRow : row)));
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

export default CustomerInfo;