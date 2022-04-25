import React, { useEffect, useState } from 'react'
import { Button, Checkbox, FormControlLabel, FormGroup, TextField, ThemeProvider, MenuItem } from '@mui/material';
import { Col, Modal, Row } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { BsXSquare } from 'react-icons/bs';
import { WeaponsService } from '../../../core/services/WeaponsService';
import { inputsTheme } from '../../../utils/Themes';
import { Toast } from '../../../utils/Toastify';
import { IProduct } from '../model/product';
import { ITypeProduct } from '../model/typeProduct';
import { IProductKind } from '../model/ProductKind';
import { SSpinner } from '../../../shared/components/SSpinner';

interface INEProduct {
    show: boolean,
    setShow: Function,
    data: IProduct|null,
    title: string,
    productKind: number | null,
    productType: number | null,
    refresh: Function
}

const _weaponService = new WeaponsService();

export const NEProduct: React.FC<INEProduct> = (props: INEProduct) => {

    const {
        register,
        setValue,
        handleSubmit,
        formState: { errors },
        clearErrors,
    } = useForm();
    
    
    
    const [productKind, setProductKind] = useState(props.title === 'Editar' ? (props.data ? props.data.IDClaseProducto : null) : props.productKind);
    const [productType, setProductType] = useState(props.title === 'Editar' ? (props.data ? props.data.IDTipoProducto : null) : props.productType);
    
    const [caliber, setCaliber] = useState(props.title === 'Editar' ? (props.data ? props.data.Calibre : null) : null);
    const [use, setUse] = useState(props.title === 'Editar' ? (props.data ? props.data.Uso : null) : null);
    const [calibres, setCalibres] = useState<[]>([]);
    const [tiposUso, setTiposUso] = useState<[]>([]);

    const [loteR, setLoteR] = useState(props.data !== null ? props.data.RequiereLote : false);
    const [serialR, setSerialR] = useState(props.data !== null ? props.data.RequiereSerial : false);
    const [spinner, setSpinner] = useState(false);
    const [listTypeProducts, setListTypeProducts] = useState<ITypeProduct[]>([]);
    const [listProductKind, setListProductKind] = useState<IProductKind[]>([]);


    useEffect(() => {
        getList([6, 3]);
        getAllTypes();
        getProductKindCatalog();
        console.log(props.data);
        if (props.title === 'Editar' && props.data) {            
            setValue('entity', props.data);            
        }
    }, [])

    const getList = (lista: number[]) => {
        _weaponService.getListasPorCodigo(lista).subscribe((resp: any) => {
            if (resp.DataBeanProperties.ObjectValue) {
                setCalibres(resp.DataBeanProperties.ObjectValue[0].Lista);
                setTiposUso(resp.DataBeanProperties.ObjectValue[1].Lista);
            } else {
                Toast.fire({
                    icon: "error",
                    title: "No se ha cargado la información",
                });
            }
        })
    };

    const getAllTypes = () => {
        setSpinner(true);
        _weaponService.getTipoProducto().subscribe((resp) => {
            if (resp) {
                console.log(resp);
                setSpinner(false);
                setListTypeProducts(resp);
            } else {
                Toast.fire({
                    icon: "error",
                    title: "No se ha cargado la información",
                });
            }
        });
    };

    const getProductKindCatalog = () => {
        setSpinner(true);
        _weaponService.getClaseProductoCatalogLike().subscribe((resp) => {
            if (resp) {
                console.log(resp);
                setSpinner(false);
                setListProductKind(resp);
            } else {
                Toast.fire({
                    icon: "error",
                    title: "No se ha cargado la información",
                });
            }
        });
    };

    const updateProducto = (bean: IProduct) => {
        _weaponService.updateProducto(bean).subscribe((res) => {
            console.log(res);
            if (res) {
                props.setShow(false);
                if (props.title === 'Editar') {
                    props.refresh(props.productKind, props.productType, '', 1);
                } else {
                    props.refresh(productKind, productType, '', 1);
                }
                clearErrors("entity");
                Toast.fire({
                    icon: "success",
                    title: "Se ha guardado con éxito!",
                });
            } else {
                Toast.fire({
                    icon: "error",
                    title: "No se ha podido completar la acción",
                });
            }
        })
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>, type: number) => {
        if (type === 1) {
            setSerialR(e.target.checked);
        }
        else if (type === 2) {
            setLoteR(e.target.checked);
        }
    };

    const onSubmit = (data: any, e: any) => {
        e.preventDefault();
        let aux: IProduct = data.entity;
        aux.RequiereSerial = serialR;
        aux.RequiereLote = loteR;
        updateProducto(aux);
    };

    return (
        <>
            <Modal show={props.show} backdrop="static" centered keyboard={false} size="lg">
                <Modal.Header>
                    {props.title} Producto
                    <BsXSquare onClick={() => props.setShow(false)} />
                </Modal.Header>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Modal.Body>
                        <Row>
                            <Col sm={12}>
                                <b className="ml-3">Campo obligatorio *</b>
                            </Col>
                            <Col sm={6} className="mt-3">
                                <TextField
                                    size="small"
                                    type="number"
                                    id="SAP"
                                    label="Cod.SAP *"
                                    fullWidth
                                    variant="outlined"
                                    color="secondary"
                                    {...register("entity.CodSAP", { required: true })}
                                />
                                <span className="text-danger">
                                    {errors.entity
                                        ? errors.entity.CodSAP?.type === "required" &&
                                        "El campo Cod.SAP es obligatorio."
                                        : ""}
                                </span>
                            </Col>
                            <Col sm={6} className="mt-3">
                                <TextField
                                    size="small"
                                    type="number"
                                    id="DDCAE"
                                    label="Cod.DDCAE *"
                                    fullWidth
                                    variant="outlined"
                                    color="secondary"
                                    {...register("entity.CodDCCAE", { required: true })}
                                />
                                <span className="text-danger">
                                    {errors.entity
                                        ? errors.entity.CodDCCAE?.type === "required" &&
                                        "El campo Cod.DDCAE es obligatorio."
                                        : ""}
                                </span>
                            </Col>
                            <Col sm={12} className="mt-3">
                                <TextField
                                    value={productKind}
                                    size="small"
                                    fullWidth
                                    select
                                    color="secondary"
                                    label="Clase Producto *"
                                    id="state"
                                    {...register("entity.IDClaseProducto", { required: true })}
                                    onChange={(e) => { setProductKind(parseInt(e.target.value)) }}
                                >
                                    {listProductKind.map((item: IProductKind) => (
                                        <MenuItem key={item.IDClaseProducto} value={item.IDClaseProducto}>
                                            {item.Nombre}
                                        </MenuItem>
                                    ))}
                                </TextField>
                                <span className="text-danger">
                                    {errors.entity
                                        ? errors.entity.IDClaseProducto?.type === "required" &&
                                        "El campo Clase Producto es obligatorio."
                                        : ""}
                                </span>
                            </Col>
                            <Col sm={12} className="mt-3">
                                <TextField
                                    value={productType}
                                    size="small"
                                    fullWidth
                                    select
                                    color="secondary"
                                    label="Tipo Producto *"
                                    id="state"
                                    {...register("entity.IDTipoProducto", { required: true })}
                                    onChange={(e) => { setProductType(parseInt(e.target.value)) }}
                                >
                                    {listTypeProducts.map((item: ITypeProduct) => (
                                        <MenuItem key={item.IDTipoProducto} value={item.IDTipoProducto}>
                                            {item.Nombre}
                                        </MenuItem>
                                    ))}
                                </TextField>
                                <span className="text-danger">
                                    {errors.entity
                                        ? errors.entity.IDTipoProducto?.type === "required" &&
                                        "El campo Tipo Producto es obligatorio."
                                        : ""}
                                </span>
                            </Col>
                            <Col sm={12} className="mt-3">
                                <TextField
                                    size="small"
                                    id="Name"
                                    label="Marca *"
                                    fullWidth
                                    variant="outlined"
                                    color="secondary"
                                    {...register("entity.Nombre", { required: true })}
                                />
                                <span className="text-danger">
                                    {errors.entity
                                        ? errors.entity.Nombre?.type === "required" &&
                                        "El campo Marca es obligatorio."
                                        : ""}
                                </span>
                            </Col>
                            <Col sm={6} className="mt-3">
                                <TextField
                                    value={caliber}
                                    size="small"
                                    select
                                    fullWidth
                                    color="secondary"
                                    label="Calibre *"
                                    id="state"
                                    {...register("entity.Calibre", { required: true })}
                                    onChange={(e) => setCaliber(parseInt(e.target.value))}
                                >
                                    {calibres.map((item: any) => (
                                        <MenuItem key={item.Codigo} value={item.Codigo}>{item.Valor}</MenuItem>
                                    ))}
                                </TextField>
                                <span className="text-danger">
                                    {errors.entity
                                        ? errors.entity.Calibre?.type === "required" &&
                                        "El campo Calibre es obligatorio."
                                        : ""}
                                </span>
                            </Col>
                            <Col sm={6} className="mt-3">
                                <ThemeProvider theme={inputsTheme}>
                                    <Button
                                        className="w-100"
                                        variant="contained"
                                        color="secondary"
                                        onClick={() => { }}
                                    >
                                        VER/ASIGNAR CAPACIDADES
                                    </Button>
                                </ThemeProvider>
                            </Col>
                            <Col sm={12} className="mt-3">
                                <TextField
                                    value={use}
                                    size="small"
                                    select
                                    fullWidth
                                    color="secondary"
                                    label="Tipo de uso *"
                                    id="state"
                                    {...register("entity.Uso", { required: true })}
                                    onChange={(e) => setUse(parseInt(e.target.value))}
                                >
                                    {tiposUso.map((item: any) => (
                                        <MenuItem key={item.Codigo} value={item.Codigo}>{item.Valor}</MenuItem>
                                    ))}
                                </TextField>
                                <span className="text-danger">
                                    {errors.entity
                                        ? errors.entity.Uso?.type === "required" &&
                                        "El campo Tipo de uso es obligatorio."
                                        : ""}
                                </span>
                            </Col>
                            <Col sm={12} className="mt-3">
                                <TextField
                                    size="small"
                                    color="secondary"
                                    id="Descripcion"
                                    label="Descripción *"
                                    fullWidth
                                    variant="outlined"
                                    multiline
                                    rows={3}
                                    {...register("entity.Descripcion", { required: true })}
                                />
                                <span className="text-danger">
                                    {errors.entity
                                        ? errors.entity.Descripcion?.type === "required" &&
                                        "El campo Descripcion es obligatorio."
                                        : ""}
                                </span>
                            </Col>
                            <Col sm={6} className="d-flex justify-content-center mt-3">
                                <FormGroup>
                                    <FormControlLabel control={
                                        <ThemeProvider theme={inputsTheme}>
                                            <Checkbox color="secondary" defaultChecked={serialR} onChange={(e) => handleChange(e, 1)} />
                                        </ThemeProvider>
                                    } label="¿Requiere Serial?" />
                                </FormGroup>
                            </Col>
                            <Col sm={6} className="d-flex justify-content-center mt-3">
                                <FormGroup>
                                    <FormControlLabel control={
                                        <ThemeProvider theme={inputsTheme}>
                                            <Checkbox color="secondary" defaultChecked={loteR} onChange={(e) => handleChange(e, 2)} />
                                        </ThemeProvider>
                                    } label="¿Requiere Lote?" />
                                </FormGroup>
                            </Col>
                        </Row>
                    </Modal.Body>
                    <Modal.Footer>
                        <ThemeProvider theme={inputsTheme}>
                            <Button variant="contained" color="error" onClick={() => props.setShow(false)}>
                                CANCELAR
                            </Button>
                            <Button type="submit" variant="contained" color="success" className="ml-3">
                                GUARDAR
                            </Button>
                        </ThemeProvider>
                    </Modal.Footer>
                </form>
            </Modal>
            <SSpinner show={spinner} />
        </>
    )
}
