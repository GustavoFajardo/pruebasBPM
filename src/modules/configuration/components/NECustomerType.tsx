import { BsTextRight, BsXSquare } from "react-icons/bs";
import { Col, Form, Modal, Row } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { ConfigService } from "../../../core/services/ConfigService";
import { Toast } from "../../../utils/Toastify";
import { InputAdornment, TextField, ThemeProvider } from "@mui/material";
import { ICustomerType } from "../model/CustomerType";
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
const _configService = new ConfigService();


interface INECustomerType {
    getShow: Function,
    dataShow: boolean,
    dataObj: any,
    dataTitle: string,
}

export const NECustomerType: React.FC<INECustomerType> = (props: INECustomerType) => {


    const {
        register,
        formState: { errors },
        clearErrors,
        setValue,
        handleSubmit
    } = useForm();
    const updateCustomerType = (bean: ICustomerType) => {
        _configService.updateCustomerType(bean).subscribe((res) => {
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
    }
    const getValue = (dataTitle: string) => {
        if (dataTitle === "Crear") {
            setValue("entity", {
                Name: "",
                Description: "",
                IDCustomerType: null,
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
        updateCustomerType(data.entity);
    };





    return (
        <>
            <Dialog header={props.dataTitle + " Tipo de Cliente"} visible={props.dataShow} maximizable modal style={{ width: '50vw' }} onHide={() => setShow()}  >
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Row>
                        <Col sm={12} className="mt-3">
                            <TextField
                                id="outlined-required"
                                label="Nombre *"
                                fullWidth
                                size="small"
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
                                id="outlined-required"
                                label="Descripción"
                                size="small"
                                fullWidth
                                variant="outlined"
                                multiline
                                rows={5}
                                {...register("entity.Description")}
                            />
                        </Col>
                    </Row>
                    <Button label="Cancelar" icon="pi pi-times" onClick={() => setShow()} className="p-button-text" />
                    <Button label="Guardar" icon="pi pi-check" type="submit" className="p-button-text" />

                </form>
            </Dialog>
        </>
    )
}