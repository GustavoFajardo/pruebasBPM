import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { ConfigService } from "../../../core/services/ConfigService";
import { Toast } from "../../../utils/Toastify";
import { GenericConfirmAction } from "../../../utils/GenericConfirmAction";
import { ICustomerType } from "../model/CustomerType";
import { NECustomerType } from "../components/NECustomerType";
import { RootState } from "../../../store/Store";
import { SSpinner } from "../../../shared/components/SSpinner";
import { Card } from 'primereact/card';
import { STable } from "../../../shared/components/STable";
import { Toolbar } from 'primereact/toolbar';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';

const _configService = new ConfigService();


export const T_CustomerType: React.FC<ICustomerType> = () => {

    const [listCustomerType, setListCustomerType] = useState<ICustomerType[]>([])
    const [page, setPage] = useState(0);
    const [showSpinner, setShowSpinner] = useState(true);
    const [show, setShow] = useState(false);
    const [formdata, setformdata] = useState<ICustomerType>();
    const [title, setTitle] = useState("");
    const [showDelete, setShowDelete] = useState(false);
    const [globalFilter, setGlobalFilter] = useState('');

    const { items } = useSelector((state: RootState) => state.itemsperpage);

    useEffect(() => {
        getCustomerTypeCatalog();
    }, [items]);

    const getCustomerTypeCatalog = () => {
        setShowSpinner(true);
        _configService.getCustomerTypeCatalog().subscribe(res => {
            setShowSpinner(false);
            if (res) {
                console.log(res);
                setListCustomerType(res);
            } else {
                Toast.fire({
                    icon: "error",
                    title: "No se ha cargado la información",
                });
            }
        })
    }
    const closeModal = (data: boolean) => {
        setShow(data);
        getCustomerTypeCatalog();
    };

    const formComponent = (title: string) => {
        setTitle(title);

        setShow(true);
    };

    const deleteElement = (data: boolean) => {
        if (data) {
            deleteCustomer();
        }
    }

    const deleteCustomer = () => {
        if (formdata) {
            _configService.deleteCustomerType(formdata.IDCustomerType).subscribe((resp: any) => {
                if (resp) {
                    getCustomerTypeCatalog();
                    Toast.fire({
                        icon: "success",
                        title: "Se ha eliminado con éxito!",
                    });
                } else {
                    Toast.fire({
                        icon: "error",
                        title: "No se ha podido completar la acción",
                    });
                }
            });
        }
    }
    const getItem = (data: any) => {
        setformdata(data);
        console.log(data);

    }

    const changeFilter = (e: any) => {
        setGlobalFilter(e.value);
    }
     const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <Button
                    icon="pi pi-plus"
                    tooltip="Añadir"
                    tooltipOptions={{ position: 'bottom', mouseTrack: true, mouseTrackTop: 15 }}
                    className="p-button-success p-button-sm mr-2"
                    onClick={() => {
                        formComponent("Crear")
                    }}
                />
                <Button
                    icon="pi pi-trash "
                    className="p-button-danger p-button-sm mr-2"
                    tooltip="Eliminar"
                    tooltipOptions={{ position: 'bottom', mouseTrack: true, mouseTrackTop: 15 }}
                    disabled={!formdata}
                    onClick={() => {
                        setShowDelete(true);
                    }}

                />
                <Button
                    icon="pi pi-pencil"
                    className="p-button-warning p-button-sm mr-2"
                    tooltip="Editar"
                    tooltipOptions={{ position: 'bottom', mouseTrack: true, mouseTrackTop: 15 }}
                    disabled={!formdata}
                    onClick={() => {
                        formComponent("Editar")
                    }}
                />


            </React.Fragment>
        );
    };
    const rightToolbarTemplate = () => {
        return (
            <React.Fragment>
                <span className="mr-2 p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText type="search" onInput={(e) => changeFilter(e.target)} placeholder="Buscar..." />
                </span>
            </React.Fragment>
        )
    }

    return (
        <div className="d-flex w-100 p-3 m-3 flex-wrap justify-content-center p-2">
            <div className="row w-100">
                <div className="col-xxl-4 container mt-2 col-12 col-xxl-12 mb-4">
                    <h1>Tipo de Cliente</h1>
                    <Card>
                        <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate} ></Toolbar>
                        <STable TableTitle="Tipo de cliente" lista={listCustomerType} ObjCheck={getItem} columnasData={['IDCustomerType', 'Name', 'Description']} columnasHeader={['ID', 'Nombre', 'Descripción']} filter={globalFilter} />
                    </Card>
                </div>
            </div>
            {showSpinner &&
                <SSpinner show={showSpinner} />
            }
            {show && (
                <NECustomerType
                    getShow={closeModal}
                    dataShow={show}
                    dataObj={formdata}
                    dataTitle={title}
                />
            )}
            {showDelete && (
                <GenericConfirmAction
                    show={showDelete}
                    setShow={setShowDelete}
                    confirmAction={deleteElement}
                    title={"¿Está seguro de eliminar el elemento?"}
                />
            )}
        </div>
    )
}
export default T_CustomerType;
