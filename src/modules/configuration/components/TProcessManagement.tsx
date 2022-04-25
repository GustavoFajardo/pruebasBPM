import { Paper, TableCell, TableContainer, Table, TableHead, TableRow, TableBody, TablePagination } from '@mui/material';
import { title } from 'process';
import React, { useEffect, useState } from 'react'
import { Button, Card, Modal, OverlayTrigger, Tooltip } from 'react-bootstrap'
import { BsCurrencyBitcoin } from 'react-icons/bs'
import { FaTimes } from 'react-icons/fa'
import { useSelector } from 'react-redux';
import { SpinnerDotted } from 'spinners-react';
import { ConfigService } from '../../../core/services/ConfigService';
import SLoadForm from '../../../shared/components/SLoadForm';
import { SSpinner } from '../../../shared/components/SSpinner';
import { RootState } from '../../../store/Store';
import { GenericConfirmAction } from '../../../utils/GenericConfirmAction';
import { useStyles } from '../../../utils/Themes';
import { Toast } from '../../../utils/Toastify';

interface ITProcessManagement {
    dataShow: boolean,
    setShow: Function,
    id: number,
    type: number | null
}

const _configService = new ConfigService();

const TProcessManagement: React.FC<ITProcessManagement> = (props: ITProcessManagement) => {

    const [listRequested, setListRequested] = useState([]);
    const [showSpinner, setShowSpinner] = useState(false);
    const [show, setShow] = useState(false);
    const [id, setId] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [page, setPage] = useState(0);
    const { items } = useSelector((state: RootState) => state.itemsperpage);
    const [showModalForm, setShowModalForm] = useState(false);
    const [beanAction, setBeanAction] = useState<any>();
    const [titleDoc, setTitleDoc] = useState('');



    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };


    useEffect(() => {
        getProcedureActionByProcedureImp()
        setRowsPerPage(parseInt(items));;

    }, [items])


    const getProcedureActionByProcedureImp = async () => {
        setShowSpinner(true);
        await _configService
            .getProcedureActionByProcedureImp(props.id)
            .then((rps: any) => {
                setShowSpinner(false);
                if (rps.data.DataBeanProperties.ObjectValue) {
                    setListRequested(rps.data.DataBeanProperties.ObjectValue);
                }
                else {
                    Toast.fire({
                        icon: "error",
                        title: "No se ha podido completar la acción"
                    })
                }
            })
            .catch((e) => {
                console.log(e);
                setShowSpinner(false);
            })
    }

    const closeModal = () => {
        props.setShow(false);
    }

    const setInPendingForInputState = async () => {
        await _configService
            .setInPendingForInputState(id)
            .then((rps: any) => {
                if (rps.data.DataBeanProperties.ObjectValue) {
                    Toast.fire({
                        icon: "success",
                        title: "Se ha guardado con éxito!"
                    });
                    getProcedureActionByProcedureImp();
                }
                else {
                    Toast.fire({
                        icon: "success",
                        title: "No se ha podido completar la acción"
                    });
                }
            })
            .catch((err) => {
                console.log(err);
            })
    }
    const statusModalForm = (status: boolean) => {
        setShowModalForm(status);
    }
    const setPending = (data: boolean) => {
        if (data) {
            setInPendingForInputState();
        }
    }

    const classes = useStyles();

    return (
        <>
            <Modal size="xl" show={props.dataShow} modalbackdrop="static" centered keyboard={false}>
                <Modal.Header>
                    Historial de gestión del proceso
                    <FaTimes onClick={closeModal} />
                </Modal.Header>
                <Modal.Body>
                    <Paper sx={{ width: "100%", overflow: "hidden" }}>
                        <TableContainer sx={{ height: "70vh" }}>
                            <Table stickyHeader aria-label="sticky table" className={classes.root}>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>ID</TableCell>
                                        <TableCell>Responsable</TableCell>
                                        <TableCell>Documento</TableCell>
                                        <TableCell>Etapa</TableCell>
                                        <TableCell>Verificador</TableCell>
                                        <TableCell>Documento</TableCell>
                                        <TableCell>Fecha de carga</TableCell>
                                        <TableCell>Fecha de verificación</TableCell>
                                        <TableCell>Área</TableCell>
                                        <TableCell>Estado de respuesta</TableCell>
                                        <TableCell>Estado</TableCell>
                                        {props.type === 1 && <TableCell >Acciones</TableCell>}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {listRequested
                                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        .map((item: any) => (
                                            <TableRow hover role="checkbox" tabIndex={-1}>
                                                <TableCell>{item.DataBeanProperties.IDAction}</TableCell>
                                                <TableCell>{item.DataBeanProperties.AccountName}</TableCell>
                                                <TableCell>{item.DataBeanProperties.ProcedureActionName}</TableCell>
                                                <TableCell>{item.DataBeanProperties.ProcedureName}</TableCell>
                                                <TableCell>
                                                    {(item.DataBeanProperties.IDVerifiedAccount !== null)
                                                        ? item.DataBeanProperties.IDVerifiedAccount
                                                        : "No hay vericador"
                                                    }
                                                </TableCell>
                                                {item.DataBeanProperties.Url &&
                                                    <TableCell> <a href={item.DataBeanProperties.Url}> {item.DataBeanProperties.Media}</a></TableCell>
                                                }
                                                {(item.DataBeanProperties.ResponseJsonValue) &&
                                                    <TableCell className="textDecoration" onClick={() => (statusModalForm(true), setBeanAction(item.DataBeanProperties), setTitleDoc(item.DataBeanProperties.Name))}>
                                                        Formulario {item.DataBeanProperties.ProcedureName}
                                                    </TableCell>}
                                                {item.DataBeanProperties.Media == null && item.DataBeanProperties.ResponseJsonValue == null &&
                                                    <TableCell>No hay documento</TableCell>
                                                }
                                                <TableCell>{item.DataBeanProperties.UptoDate}</TableCell>
                                                <TableCell>{item.DataBeanProperties.VerifiedDate}</TableCell>
                                                <TableCell>{item.DataBeanProperties.FunctionalIDName}</TableCell>
                                                <TableCell>{item.DataBeanProperties.ReponseValue}</TableCell>
                                                <TableCell>{item.DataBeanProperties.StateName}</TableCell>
                                                {props.type === 1 && <TableCell>
                                                    <OverlayTrigger
                                                        placement="right"
                                                        delay={{ show: 250, hide: 400 }}
                                                        overlay={
                                                            <Tooltip id={item.DataBeanProperties.IDAction}>
                                                                Asignar como 'Pendiente por respuesta'
                                                            </Tooltip>
                                                        }
                                                    >
                                                        <Button className="btn btn-secondary">
                                                            <BsCurrencyBitcoin
                                                                onClick={() => {
                                                                    setId(item.DataBeanProperties.IDAction)
                                                                    setShow(true);
                                                                }}
                                                            />
                                                        </Button>
                                                    </OverlayTrigger>
                                                </TableCell>}
                                            </TableRow>
                                        ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <TablePagination
                            className={classes.root}
                            rowsPerPageOptions={[items, 10, 25, 100]}
                            labelRowsPerPage="Columnas por Página"
                            component="div"
                            count={listRequested.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                        {showModalForm && <SLoadForm beanAction={beanAction} status={showModalForm} title={titleDoc} type={2} getShowForm={statusModalForm} IDProcedureIMP={undefined} />}
                    </Paper>
                </Modal.Body>
            </Modal>
            {showSpinner &&
                <SSpinner show={showSpinner} />
            }
            {show && <GenericConfirmAction
                show={show}
                setShow={setShow}
                confirmAction={setPending}
                title="Está seguro de completar la acción"
            />}
        </>
    )
}

export default TProcessManagement
