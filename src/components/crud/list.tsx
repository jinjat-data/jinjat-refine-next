import React from "react";
import { List, useDataGrid, EditButton, ShowButton, DeleteButton } from "@refinedev/mui";
import { DataGrid, GridColumns, GridValueFormatterParams } from "@mui/x-data-grid";
import {HttpError, IResourceComponentsProps, Option, useResource} from "@refinedev/core";
import {Type, useSchema} from "@components/hooks/useSchema";
import {JsonSchema} from "@jsonforms/core";
import {GridNativeColTypes} from "@mui/x-data-grid/models/colDef/gridColType";
import {GridEnrichedColDef} from "@mui/x-data-grid/models/colDef/gridColDef";

export const JinjatList: React.FC<IResourceComponentsProps> = () => {
    const { resource } = useResource();
    let analysis = resource?.meta?.jinjat.resources.list;
    return <JinjatTable analysis={analysis} />
}
export interface JinjatComponentProps {
    analysis : string;
}

export const JinjatTable: React.FC<JinjatComponentProps> = ({analysis}) => {
    const {data : schema, isLoading, isError} = useSchema<JsonSchema, HttpError>({
        resource: analysis,
        config: {type: Type.RESPONSE}
    })

    if (schema == null) {
        return <div>Schema is not found!</div>;
    }

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (isError) {
        return <div>Something went wrong!</div>;
    }

    debugger

    const {dataGridProps} = useDataGrid({
        syncWithLocation: true,
        pagination: {
            mode: 'server'
        }
    });

    const getDataGridType = (jinjatType : string) : GridNativeColTypes => {
        return 'string'
    }



    schema.items = schema.items || {}
    // @ts-ignore
    let rowIdColumn = schema.items['x-pk'];
    // @ts-ignore
    let properties = schema.items?.properties;

    if(properties == null) {
        return <div>Unable to infer schema!</div>;
    }



    const fieldColumns = Object.entries(properties).map(([key, value]) => (
            {
                field: key,
                // @ts-ignore
                headerName: value.label || key,
                // @ts-ignore
                type: getDataGridType(value.type),
                headerAlign: rowIdColumn == key ? "left" : undefined,
                align: rowIdColumn == key ? "left" : undefined,
                flex: 1,
                valueFormatter: (params: GridValueFormatterParams<Option>) => {
                    return params.value;
                },
                renderCell: function render({row}) {
                    if (isLoading) {
                        return "Loading...";
                    }

                    return row[key]
                },
            }
        )
    ) as GridColumns

    const allColumns = [
        ...fieldColumns,
        {
            field: "actions",
            headerName: "Actions",
            renderCell: function render({ row }) {
                return (
                    <>
                        <EditButton hideText recordItemId={row[rowIdColumn]} />
                        <ShowButton hideText recordItemId={row[rowIdColumn]} />
                        <DeleteButton hideText recordItemId={row[rowIdColumn]} />
                    </>
                );
            },
            align: "center",
            flex: 1,
            headerAlign: "center",
            minWidth: 80,
        } as GridEnrichedColDef,
    ]

    return (
        <List>
            <DataGrid {...dataGridProps} columns={allColumns} autoHeight getRowId={(row) => {
                let rowElement = row[rowIdColumn];
                if(rowElement == null) {
                    rowElement = 0
                }
                return rowElement;
            }}/>
        </List>
    );
};