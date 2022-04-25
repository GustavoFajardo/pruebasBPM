import { Button, InputAdornment, MenuItem, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { Col, Modal, Row } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { BsTextRight, BsXSquare } from 'react-icons/bs';
import { WeaponsService } from '../../../core/services/WeaponsService';
import { useStyles } from '../../../utils/Themes';
import { Toast } from '../../../utils/Toastify';
import { Iweapon } from '../model/modelWeapon';

interface INEWeapons {
    dataObj: Iweapon | null,
    show: boolean,
    refresh: Function,
    title: string,
    setShow: Function
}

const _weaponsService = new WeaponsService();

export const NEWeapons: React.FC<INEWeapons> = (props: INEWeapons) => {
    const {
        register,
        setValue,
        handleSubmit,
        formState: { errors },
        clearErrors,
    } = useForm();

    const getSesion = () => {
        return JSON.parse(localStorage.getItem('usuario') ?? "")
    }
    const [IDTipoArma, setIDTipoArma] = useState(props.title === "Editar" ? props.dataObj?.IDTipoArma : null);
    const [IDCapCarga, setIDCapCarga] = useState(props.title === "Editar" ? props.dataObj?.IDCapCarga : null);
    const [IDCalibre, setIDCalibre] = useState(props.title === "Editar" ? props.dataObj?.IDCalibre : null);
    const [FechaFacCompra, setFechaFacCompra] = useState(props.title === "Editar" ? props.dataObj?.FechaFacCompra : "01/01/2000");
    const [respuestaLista, setRespuestaLista] = useState<any>();
    const [lista0, setLista0] = useState<any>();
    const [lista1, setLista1] = useState<any>();
    const [lista2, setLista2] = useState<any>();

    const _weaponService = new WeaponsService();

    const closeModal = () => {
        props.setShow();
    }
    const classes = useStyles();

    useEffect(() => {
        getValue(props.title);
        getList([6, 4, 5]);
    }, []);

    const getValue = (dataTitle: string) => {

        if (dataTitle === "Editar") {
            setValue("entity", props.dataObj);
        }
    };

    const getList = (lista: number[]) => {
        _weaponService.getListasPorCodigo(lista).subscribe((resp: any) => {
            if (resp.DataBeanProperties.ObjectValue) {
                console.log(resp.DataBeanProperties.ObjectValue);

                setLista0(resp.DataBeanProperties.ObjectValue[0]);
                setLista1(resp.DataBeanProperties.ObjectValue[1]);
                setLista2(resp.DataBeanProperties.ObjectValue[2]);

            } else {
                Toast.fire({
                    icon: "error",
                    title: "No se ha cargado la información",
                });
            }
        })
    };

    const updateTraumatica = (bean: Iweapon) => {
        _weaponsService
            .updateTraumatica(bean)
            .subscribe(resp => {
                console.log(resp);
                props.refresh();
                if (resp) {
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
            });
    };

    const onSubmit = (data: any, e: any) => {
        e.preventDefault();
        const aux = data.entity;
        console.log(data);
        aux.IDFuncionario = parseInt(getSesion().IDAccount);
        aux.IDSolicitante = null;
        aux.FechaFacCompra = aux.FechaFacCompra + " 00:00:00";
        console.log(aux);
        props.setShow(false);
        updateTraumatica(aux);
    }

    return (
        <Modal
            show={props.show}
            backdrop="static"
            size="xl"
            centered
            keyboard={false}>
            <Modal.Header>{props.title} arma
                <BsXSquare onClick={closeModal} />
            </Modal.Header>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Modal.Body>
                    <b>Campo obligatorio *</b>
                    <fieldset>
                        <legend>Información del arma</legend>
                        <Row>
                            <Col sm={6} className="mt-3">
                                <TextField
                                    value={IDTipoArma}
                                    size="small"
                                    select
                                    fullWidth
                                    color="secondary"
                                    label="Clase de Arma"
                                    id="state"
                                    {...register("entity.IDTipoArma", { required: true })}
                                    onChange={(e) => {
                                        setIDTipoArma(parseInt(e.target.value));
                                    }}
                                >
                                    {lista1?.Lista.map((item: any) => (
                                        <MenuItem key={item.Codigo} value={item.Codigo}>{item.Valor}</MenuItem>
                                    ))}
                                </TextField>
                                <span className="text-danger">
                                    {errors.entity
                                        ? errors.entity.HtmlStored?.type === "required" &&
                                        "El campo Html Almacenado es requerido."
                                        : ""}
                                </span>
                            </Col>
                            <Col sm={6} className="mt-3">
                                <TextField
                                    value={IDCapCarga}
                                    size="small"
                                    select
                                    fullWidth
                                    color="secondary"
                                    label="Capacidad de carga"
                                    id="state"
                                    {...register("entity.IDCapCarga", { required: true })}
                                    onChange={(e) => {
                                        setIDCapCarga(parseInt(e.target.value));
                                    }}
                                >
                                    {lista2?.Lista.map((item: any) => (
                                        <MenuItem key={item.Codigo} value={item.Codigo}>{item.Valor}</MenuItem>
                                    ))}
                                </TextField>
                                <span className="text-danger">
                                    {errors.entity
                                        ? errors.entity.IDCapCarga?.type === "required" &&
                                        "El campo Capacidad de carga es requerido."
                                        : ""}
                                </span>
                            </Col>
                            <Col sm={6} className="mt-3">
                                <TextField
                                    value={IDCalibre}
                                    size="small"
                                    select
                                    fullWidth
                                    color="secondary"
                                    label="Calibre"
                                    id="state"
                                    {...register("entity.IDCalibre", { required: true })}
                                    onChange={(e) => {
                                        setIDCalibre(parseInt(e.target.value));
                                    }}
                                >
                                    {lista0?.Lista.map((item: any) => (
                                        <MenuItem key={item.Codigo} value={item.Codigo}>{item.Valor}</MenuItem>
                                    ))}
                                </TextField>
                                <span className="text-danger">
                                    {errors.entity
                                        ? errors.entity.IDCalibre?.type === "required" &&
                                        "El campo Calibre es requerido."
                                        : ""}
                                </span>
                            </Col>
                            <Col sm={6} className="mt-3">
                                <TextField
                                    id="outlined-required"
                                    label="Marca *"
                                    fullWidth
                                    size="small"
                                    color='secondary'
                                    variant="outlined"
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <BsTextRight />
                                            </InputAdornment>
                                        ),
                                    }}
                                    {...register("entity.Marca", { required: true })}
                                />
                                <span className="text-danger">
                                    {errors.entity
                                        ? errors.entity.Marca?.type === "required" &&
                                        "El campo Marca es obligatorio."
                                        : ""}
                                </span>
                            </Col>
                            <Col sm={6} className="mt-3 mb-3">
                                <TextField
                                    id="outlined-required"
                                    label="Serie del fabricante *"
                                    fullWidth
                                    size="small"
                                    color='secondary'
                                    variant="outlined"
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <BsTextRight />
                                            </InputAdornment>
                                        ),
                                    }}
                                    {...register("entity.SerieFabricante", { required: true })}
                                />
                                <span className="text-danger">
                                    {errors.entity
                                        ? errors.entity.SerieFabricante?.type === "required" &&
                                        "El campo Serie del fabricante es obligatorio."
                                        : ""}
                                </span>
                            </Col>
                        </Row>
                    </fieldset>
                    <fieldset className="mt-3">
                        <legend>Información de la compra</legend>
                        <Row>
                            <Col sm={6} className="mt-3">
                                <TextField
                                    id="outlined-required"
                                    label="Fecha de factura de compra *"
                                    fullWidth
                                    size="small"
                                    color='secondary'
                                    variant="outlined"
                                    type="Date"
                                    value={FechaFacCompra}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    {...register("entity.FechaFacCompra", { required: true })}
                                    onChange={(e) => { setFechaFacCompra(e.target.value) }}
                                />
                                <span className="text-danger">
                                    {errors.entity
                                        ? errors.entity.FechaFacCompra?.type === "required" &&
                                        "El campo Fecha de factura de compra es obligatorio."
                                        : ""}
                                </span>
                            </Col>
                            <Col sm={6} className="mt-3">
                                <TextField
                                    id="outlined-required"
                                    label="No Factura de Compra *"
                                    fullWidth
                                    size="small"
                                    color='secondary'
                                    variant="outlined"
                                    type="number"
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <BsTextRight />
                                            </InputAdornment>
                                        ),
                                    }}
                                    {...register("entity.NoFacturaCompra", { required: true })}
                                />
                                <span className="text-danger">
                                    {errors.entity
                                        ? errors.entity.NoFacturaCompra?.type === "required" &&
                                        "El campo No Factura de Compra es obligatorio."
                                        : ""}
                                </span>
                            </Col>
                            <Col sm={6} className="mt-3 mb-3">
                                <TextField
                                    id="outlined-required"
                                    label="Manifiesto de la Dian *"
                                    fullWidth
                                    size="small"
                                    color='secondary'
                                    variant="outlined"
                                    type="number"
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <BsTextRight />
                                            </InputAdornment>
                                        ),
                                    }}
                                    {...register("entity.ManifiestoDian", { required: true })}
                                />
                                <span className="text-danger">
                                    {errors.entity
                                        ? errors.entity.ManifiestoDian?.type === "required" &&
                                        "El campo Manifiesto de la Dian es obligatorio."
                                        : ""}
                                </span>
                            </Col>
                        </Row>

                    </fieldset>

                </Modal.Body>
                <Modal.Footer>
                    <div className="modal-element">
                        <Button
                            className={classes.button}
                            variant="contained"
                            color="error"
                            onClick={closeModal}
                        >
                            CANCELAR
                        </Button>
                    </div>
                    <div className="modal-element">
                        <Button
                            className={classes.button}
                            type="submit"
                            variant="contained"
                            color="success"
                        >
                            GUARDAR
                        </Button>
                    </div>
                </Modal.Footer>
            </form>
        </Modal>
    )
}
