import React, {ChangeEvent, ChangeEventHandler, useEffect, useState} from "react"
import {Customer} from "../models/Customer";
import {Typography} from "@mui/material";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import readXlsxFile from 'read-excel-file'

import {
    DataGrid, GridCallbackDetails, GridCellEditCommitParams,
    GridCellParams,
    GridColumns, GridRowId, GridRowModel,
    GridRowsProp, GridSelectionModel,
    GridToolbarContainer, MuiBaseEvent, MuiEvent,
    useGridApiRef
} from "@mui/x-data-grid";
import {Item} from "../models/Item";

interface CustomerInfoProps {
    onChange: (customers:Customer[])=>void
    onSelectedChange: (ids:number[])=>void
    initRows?: Customer[]
    initSelection?: GridRowId[]
}

interface CustomToolbarProps {
    onAdd:()=>void,
    onRemove:()=>void,
    onImport:(file:File)=>void,
}

const CustomToolbar = (cf:CustomToolbarProps) => {
    return () => (
        <>
            {/*<Typography*/}
            {/*    variant="h6" ml={2}*/}
            {/*>*/}
            {/*    Customers*/}
            {/*</Typography>*/}
        <GridToolbarContainer>
            <Button onClick={cf.onAdd}> Add </Button>
            <Button onClick={cf.onRemove}> Remove </Button>
            <input id="file_customer" type="file" hidden onChange={(e) => {
                // @ts-ignore
                cf.onImport(e.target.files[0])
            }}/>
            <Button onClick={() => {
                // @ts-ignore
                document.getElementById("file_customer").click()
            }}> Import </Button>
        </GridToolbarContainer>
        </>
    )
}

const CustomerInfo = (props: CustomerInfoProps) => {
    const [customers, setCustomers] = useState<Customer[]>(props.initRows || []);
    const [selectionModel, setSelectionModel] = React.useState<GridSelectionModel>(props.initSelection || []);


    const columns: GridColumns = [
        { field: 'name', headerName: 'Name', width: 180, editable: true },
        { field: 'address', headerName: 'Address ', width: 360, editable: true },
        { field: 'phone', headerName: 'Phone ', width: 180, editable: true },
    ];

    return (
        <>
            <div style={{height: 300}}>
            <DataGrid
                 // You have to either give a height to the container of the DataGrid or set the autoHeight prop of the DataGrid to true. Otherwise, it does not know which size to take.
                disableSelectionOnClick
                rows={customers}
                columns={columns}
                experimentalFeatures={{ newEditingApi: true }}
                isCellEditable={(params: GridCellParams) => true}
                components={{
                    Toolbar: CustomToolbar({
                        onAdd: () => {
                            const newData = [...customers, {id: new Date().getTime(), name: '', address: ''}];
                            setCustomers(newData)
                            props.onChange(newData);
                        },
                        onRemove: () => {
                            const newData = customers.filter(item => selectionModel.indexOf(item.id) < 0);
                            console.log("Remove " + JSON.stringify(selectionModel));
                            setCustomers([...newData])
                            props.onChange(newData);
                        },
                        onImport: (file:File) => {
                            readXlsxFile(file).then((rows) => {
                                console.log("Read " + rows.length + " customers");
                                const result = [];
                                const selected = []
                                for (const row of rows) {
                                    if (typeof row[0] === 'number') { // row with ID
                                        const customer:Customer = {
                                            id : row[0],
                                            name: row[1].toString(),
                                            address: row[2].toString(),
                                        };
                                        result.push(customer)
                                        selected.push(customer.id)
                                    }
                                }
                                setCustomers(result);
                                setSelectionModel(selected);
                                props.onChange(result);
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
                    props.onSelectedChange(newSelectionModel as number[])
                }}
                density="compact"
            />
            </div>
        </>
    )
};

export default CustomerInfo;