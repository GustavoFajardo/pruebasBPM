import React from "react";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { BsTextRight, BsXSquare } from "react-icons/bs";
import { Toast } from "../../../utils/Toastify";
import { InputAdornment } from "@mui/material";
import { TextField } from "@material-ui/core";
import { Office } from "../model/Office";
import { ConfigService } from "../../../core/services/ConfigService";

interface INEOficce {
    getShow: Function;
    dataShow: boolean;
    dataObj: Office | undefined;
    dataTitle: string;
}

const _configService = new ConfigService();

export const NEOffice: React.FC<INEOficce> = (props: INEOficce) => {
    const {
        register,
        setValue,
        handleSubmit,
        formState: { errors },
        clearErrors,
    } = useForm();

    const updateOffice = (bean: Office) => {
        _configService.updateOffice(bean).subscribe((res) => {
            if (res) {
                props.getShow(false);
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

    const getSesion = () => {
        return JSON.parse(localStorage.getItem('usuario') ?? "")
    }

    const getValue = (dataTitle: string) => {
        if (dataTitle === "Crear") {
            setValue("entity", {
                Name: "",
                Description: "",
                State: 0,
                IDEmployee: parseInt(getSesion().IDAccount),
                IDOffice: null,
            });
        } else if (dataTitle === "Editar") {
            setValue("entity", props.dataObj);
        }
    };

    getValue(props.dataTitle);
    const setShow = () => {
        clearErrors("entity");
        props.getShow(false);
    };
    const onSubmit = (data: any, e: any) => {
        e.preventDefault();
        data.entity.State = 0;
        updateOffice(data.entity);
    };

    return (
        <>
            <Modal show={props.dataShow} backdrop="static" centered keyboard={false}>
                <Modal.Header>
                    {props.dataTitle} Seccional
                    <BsXSquare onClick={setShow} />
                </Modal.Header>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Modal.Body>
                        <Row>
                            <b className="ml-3">Campo obligatorio *</b>                            
                            <Col sm={12} className="mt-3">
                                <TextField
                                    size="small"
                                    id="Code"
                                    label="Código *"
                                    fullWidth
                                    variant="outlined"
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <BsTextRight />
                                            </InputAdornment>
                                        ),
                                    }}
                                    {...register("entity.Code", { required: true })}
                                />
                                <span className="text-danger">
                                    {errors.entity
                                        ? errors.entity.Code?.type === "required" &&
                                        "El campo Código es obligatorio."
                                        : ""}
                                </span>
                            </Col>
                            <Col sm={12} className="mt-3">
                                <TextField
                                    size="small"
                                    id="Name"
                                    label="Nombre *"
                                    fullWidth
                                    variant="outlined"
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <BsTextRight />
                                            </InputAdornment>
                                        ),
                                    }}
                                    {...register("entity.Name", { required: true })}
                                />
                                <span className="text-danger">
                                    {errors.entity
                                        ? errors.entity.Name?.type === "required" &&
                                        "El campo Nombre es obligatorio."
                                        : ""}
                                </span>
                            </Col>
                            <Col sm={12} className="mt-3">
                                <TextField                                    
                                    id="Description"
                                    label="Descripción"
                                    fullWidth
                                    variant="outlined"
                                    multiline
                                    rows={5}
                                    {...register("entity.Description")}
                                />
                            </Col>
                        </Row>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="danger" onClick={setShow}>
                            CANCELAR
                        </Button>
                        <Button type="submit" variant="success">
                            GUARDAR
                        </Button>
                    </Modal.Footer>
                </form>
            </Modal>
        </>
    )
}
