import React, { useEffect, useRef, useState } from 'react'
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/Store';

interface ISTable {
    lista: any,
    columnasHeader: string[],
    columnasData: string[],
    TableTitle: string,
    ObjCheck: Function,
    filter: string
}


export const STable: React.FC<ISTable> = (props: ISTable) => {
    const [globalFilter, setGlobalFilter] = useState(props.filter);
    const [selectedItems, setSelectedItems] = useState(null);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const { items } = useSelector((state: RootState) => state.itemsperpage);

    const dt = useRef(null);
    useEffect(() => {
        setGlobalFilter(props.filter);
        setRowsPerPage(parseInt(items));;

    }, [props.filter, items])

    const seleccionar = (data: any) => {
        setSelectedItems(data);
        props.ObjCheck(data);
    }


    return (
        <div className="">

            <DataTable ref={dt} value={props.lista} resizableColumns selection={selectedItems} onSelectionChange={(e) => seleccionar(e.value)}
                dataKey={props.columnasData[0]} paginator rows={rowsPerPage} rowsPerPageOptions={[5, 10, 25, rowsPerPage]}
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} items"
                globalFilter={globalFilter} responsiveLayout="scroll">
                <Column selectionMode="single" headerStyle={{ width: '3rem' }} exportable={false}></Column>

                {props.columnasData.map((item: any, index: number) => (
                    <Column field={item} header={props.columnasHeader[index]} sortable style={{ minWidth: '12rem' }}></Column>
                ))}


            </DataTable>
        </div>
    )
}
