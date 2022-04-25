import React, { useEffect } from "react";
import {
    Modal,
    Button,

} from "react-bootstrap";
import { useState } from "react";
import { BsXSquare } from "react-icons/bs";
import { Toast } from "../../utils/Toastify";
import { SuscriptionService } from "../../core/services/SuscriptionService";
import { AdminService } from "../../core/services/AdminService";
import { TableBody, TableCell, TableContainer, TableRow, Table } from "@mui/material";
import { NEMeet } from "../../modules/agenda/components/NEMeet";

interface ISLoadForm {
    beanAction: any;
    getShowForm: Function;
    status: boolean;
    title: string;
    type: number;
    IDProcedureIMP: number | undefined
}
const _suscriptionService = new SuscriptionService();
const _adminService = new AdminService();
export const SLoadForm: React.FC<ISLoadForm> = (props: ISLoadForm) => {

    const [htmlForm, setHtmlForm] = useState("");
    const [form, setForm] = useState<any>()
    const [keys, setKeyObject] = useState<string[]>();
    const [values, setValuesObject] = useState<string[]>();

    const closeModal = () => {
        props.getShowForm(false);
    };
    console.log(props.beanAction);
    useEffect(() => {
        getForm();

    }, []);
    const getForm = () => {
        console.log(props.beanAction.IDForm);
        if (props.type === 1) {
            _adminService.getForm(props.beanAction.IDForm).subscribe((res: any) => {
                if (res.DataBeanProperties.ObjectValue) {
                    console.log(res.DataBeanProperties.ObjectValue);
                    let beanForm = res.DataBeanProperties.ObjectValue
                    setHtmlForm(_adminService.getUrl(beanForm.DataBeanProperties.IDForm, props.beanAction.IDAction));
                } else {
                    Toast.fire({
                        icon: "error",
                        title: "No se ha podido cargar el formulario",
                    });
                }
            });
        } else if (props.type == 2) {
            setKeyObject(Object.keys(JSON.parse(props.beanAction.ResponseJsonValue)));
            setValuesObject(Object.values(JSON.parse(props.beanAction.ResponseJsonValue)));
        }
        else {
            Toast.fire({
                icon: "error",
                title: "No se ha podido cargar el formulario",
            });
        }
    }

    const switchRender = (idForm: number) => {
        switch (idForm) {
            case 9:
                return (
                    <div>
                        <NEMeet IDProcedureIMP={props.IDProcedureIMP} IDAgenda={undefined} type={0} />
                    </div>
                )
            default:
                return (<div className="modal-custom-iframe">
                    {htmlForm !== '' && (<iframe src={htmlForm} frameBorder={0} ></iframe>)}
                </div>)
        }
    }

    return (
        <Modal
            show={props.status}
            backdrop="static"
            centered

            keyboard={false}
            dialogClassName="modal-custom d-flex justify-content-center"
        >
            <Modal.Header>
                {props.title}
                <BsXSquare onClick={closeModal} />
            </Modal.Header>
            <Modal.Body className="modal-body-custom">
                {props.type === 1 ? (<>
                    <b>Nombre: </b> <p>{props.beanAction.Name}</p>
                    {/* <div className="modal-custom-iframe">
                        {htmlForm !== '' && (<iframe src={htmlForm} frameBorder={0} ></iframe>)}
                    </div> */}
                    {switchRender(props.beanAction.IDForm)}

                </>) : (<>
                    <TableContainer>
                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                            <TableRow>
                                <TableCell>Campos</TableCell>
                                <TableCell>Valores</TableCell>
                            </TableRow>
                            <TableBody>
                                <TableRow>
                                    <TableCell>
                                        {keys?.map((item) => (
                                            <TableRow>{item}</TableRow>
                                        ))}
                                    </TableCell>
                                    <TableCell>
                                        {values?.map((item) => (
                                            <TableRow>{item}</TableRow>
                                        ))}
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                </>)}
            </Modal.Body>
            {/* {
                props.type === 1 &&
                <Button onClick={(e) => aprobar()}>Enviar</Button>
            } */}
        </Modal >
    )
}
export default SLoadForm;
