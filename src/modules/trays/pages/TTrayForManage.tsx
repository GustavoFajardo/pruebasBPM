import Step from '@mui/material/Step';
import StepButton from '@mui/material/StepButton';
import Button from '@mui/material/Button';
import { IconButton, Paper, SpeedDial, SpeedDialAction, Stepper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, ThemeProvider, Tooltip } from "@mui/material";
import { SuscriptionService } from '../../../core/services/SuscriptionService'
import React, { useEffect, useState } from 'react';
import { Box } from '@mui/system';
import { SLoadDocument } from '../../../shared/components/SLoadDocument';
import { MdKeyboardArrowLeft } from 'react-icons/md';
import { Toast } from '../../../utils/Toastify';
import { inputsTheme, useStyles } from '../../../utils/Themes';
import { FiMoreVertical } from 'react-icons/fi';
import { BsBoundingBox, BsCheckSquare } from 'react-icons/bs';
import { FaFileUpload, FaWpforms } from 'react-icons/fa';
import SLoadForm from '../../../shared/components/SLoadForm';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/Store';
import { SButtonHistory } from '../../../shared/components/SButtonHistory';
import { SSpinner } from '../../../shared/components/SSpinner';


const _suscripcionService = new SuscriptionService();


interface ITrayForManage { }

export const TTrayForManage: React.FC<ITrayForManage> = () => {

    const [listProcedureImp, setListProcedureImp] = useState([]);
    const [beanProcedureImp, setBeanProcedure] = useState<any>();
    const [listDocuments, setDocuments] = useState([]);
    const [titleDoc, setTitleDoc] = useState('');
    const [beanAction, setBeanAct] = useState<any>();
    const steps = ['Seleccione trámite', 'Verificar Documentacion'];
    const estadoDoc = ["Pendiente por subir", "En verificacion", "Devuelto", "verificado"];
    const [activeStep, setActiveStep] = React.useState(0);
    const [completed, setCompleted] = React.useState<{
        [k: number]: boolean;
    }>({});
    const [showModalForm, setShowModalForm] = useState(false);
    const [showSpinner, setShowSpinner] = useState(false);
    const [rowsPerPage, setRowsPerPage] = useState<any>(10);
    const [page, setPage] = useState(0);

    const [showM, setShowM] = useState(false);

    const { items } = useSelector((state: RootState) => state.itemsperpage);

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };
    const totalSteps = () => {
        return steps.length;
    };
    const completedSteps = () => {
        return Object.keys(completed).length;
    };
    const isLastStep = () => {
        return activeStep === totalSteps() - 1;
    };
    const allStepsCompleted = () => {
        return completedSteps() === totalSteps();
    };
    const handleNext = () => {
        const newActiveStep =
            isLastStep() && !allStepsCompleted()
                ?
                steps.findIndex((step, i) => !(i in completed))
                : activeStep + 1;
        setActiveStep(newActiveStep);
    };
    const handleStep = (step: number) => () => {
        setActiveStep(step);
    };
    const handleComplete = () => {
        const newCompleted = completed;
        newCompleted[activeStep] = true;
        setCompleted(newCompleted);
        handleNext();
    };
    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };
    const handleReset = () => {
        setActiveStep(0);
        setCompleted({});
    }
    const getSesion = () => {
        return JSON.parse(localStorage.getItem('usuario') ?? "")
    }
    const listarDocumentosPorResponder = async () => {
        setShowSpinner(true);
        await _suscripcionService.getProcedureImpForResponse(parseInt(getSesion().IDAccount)).then((resp: any) => {
            setShowSpinner(false);
            if (resp.data.DataBeanProperties.ObjectValue) {
                setListProcedureImp(resp.data.DataBeanProperties.ObjectValue);
            } else {
                Toast.fire({
                    icon: 'error',
                    title: 'No se ha podido completar la accion'
                })
            }
        }).catch(e => console.error(e)
        )
    }
    useEffect(() => {
        setRowsPerPage(parseInt(items));;
        listarDocumentosPorResponder();
    }, [items]);

    const seleccionar = (bean: any) => {
        setBeanProcedure(bean);
        getProcedureActionForResponse(bean.IDProcedureImp);
        handleComplete();
    }
    const classes = useStyles();


    const getProcedureActionForResponse = async (idImp: number) => {
        await _suscripcionService.getProcedureActionForResponse(parseInt(getSesion().IDAccount), idImp).then((resp: any) => {
            if (resp.data.DataBeanProperties.ObjectValue) {
                setDocuments(resp.data.DataBeanProperties.ObjectValue);
                if (resp.data.DataBeanProperties.ObjectValue.length === 0) {
                    handleComplete();
                }
            } else {
                Toast.fire({
                    icon: 'error',
                    title: 'No se ha podido completar la accion'
                })
            }
        });
    }
    const openForm = (statusForm: boolean) => {
        setShowModalForm(statusForm);
        if (statusForm === false) {
            getProcedureActionForResponse(beanProcedureImp.IDProcedureImp);
        }
    }
    const closeSearchM = (data: any) => {
        setShowM(data);
        getProcedureActionForResponse(beanProcedureImp.IDProcedureImp);
    };
    const getItemM = async (data: any) => {
        console.log(data);
        await _suscripcionService.responseProcedureAction2
            (
                beanAction.IDAction,
                null,
                null,
                {
                    "Media": data.Media,
                    "MediaContext": data.MediaContext
                },
                false
            )
            .then((resp: any) => {
                if (resp.data.DataBeanProperties.ObjectValue) {
                    getProcedureActionForResponse(beanProcedureImp.IDProcedureImp);
                } else {
                    Toast.fire({
                        icon: 'error',
                        title: 'No se ha podido completar la accion'
                    })
                }

            });
    }
    const openMedia = (titulo: string) => {
        setShowM(true);
        setTitleDoc(titulo);
    }
    const renderSwitch = (param: number) => {
        switch (param) {
            case 0: return <div className="w-100 d-flex h-100 flex-wrap justify-content-xl-start justify-content-sm-center">
                {listProcedureImp.length > 0 ? (
                    // listProcedureImp.map((item: any, index: number) => (
                    // <div className="cgt card m-2 p-4" onClick={() => seleccionar(item.DataBeanProperties)}>
                    //     <div>
                    //         <h5>{item.DataBeanProperties.IDProcedureImp} - {item.DataBeanProperties.AccountName}</h5>
                    //         <hr />
                    //         <div>
                    //             <b>Procedimiento:</b>
                    //             <br />
                    //             {item.DataBeanProperties.Name}
                    //         </div>
                    //         <div>
                    //             <b>Descripción:</b>
                    //             <br />
                    //             {item.DataBeanProperties.Description}
                    //         </div>
                    //         <div>
                    //             <b>Etapa actual:</b>
                    //             <br />
                    //             {item.DataBeanProperties.ProcedureName}
                    //         </div>
                    //         <div>
                    //             <b>Fecha de inicio:</b>
                    //             <br />
                    //             {item.DataBeanProperties.Since}
                    //         </div>
                    //         <div>
                    //             <b>Documento del solicitante:</b>
                    //             <br />
                    //             {item.DataBeanProperties.AccountID}
                    //         </div>
                    //     </div>
                    // </div>
                    <Paper sx={{ width: "100%", overflow: "sroll" }}>
                        <TableContainer sx={{ height: "70vh" }}>
                            <Table stickyHeader aria-label="sticky table" className={classes.root}>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>ID</TableCell>
                                        <TableCell>Solicitante</TableCell>
                                        <TableCell>Procedimiento</TableCell>
                                        <TableCell>Etapa actual</TableCell>
                                        <TableCell>Descripción</TableCell>
                                        <TableCell>Fecha de inicio</TableCell>
                                        <TableCell>Documento del solicitante</TableCell>
                                        <TableCell>Acciones</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {listProcedureImp.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item: any, index: number) => (
                                        <TableRow hover role="checkbox" tabIndex={-1}>
                                            <TableCell>{item.DataBeanProperties.IDProcedureImp}</TableCell>
                                            <TableCell>{item.DataBeanProperties.AccountName}</TableCell>
                                            <TableCell>{item.DataBeanProperties.Name}</TableCell>
                                            <TableCell>{item.DataBeanProperties.ProcedureName}</TableCell>
                                            <TableCell>{item.DataBeanProperties.Description}</TableCell>
                                            <TableCell>{item.DataBeanProperties.Since}</TableCell>
                                            <TableCell>{item.DataBeanProperties.AccountID}</TableCell>
                                            <TableCell>
                                                <div className="d-lg-flex d-none">
                                                    <SButtonHistory idProcedure={item.DataBeanProperties.IDProcedureImp} type={2} />

                                                    <ThemeProvider theme={inputsTheme}>
                                                        <Tooltip title="Ver documentos">
                                                            <Button
                                                                variant="contained"
                                                                className="box-s mr-1 mt-2 mb-2"
                                                                color="secondary"
                                                                onClick={() => {
                                                                    seleccionar(item.DataBeanProperties)
                                                                }}>
                                                                <BsCheckSquare />
                                                            </Button>
                                                        </Tooltip>
                                                    </ThemeProvider>
                                                </div>
                                                <div className="d-flex d-lg-none">
                                                    <SpeedDial
                                                        ariaLabel="SpeedDial basic example"
                                                        direction="left"
                                                        FabProps={{
                                                            size: "small",
                                                            style: { backgroundColor: "#0d6efd" },
                                                        }}
                                                        icon={<FiMoreVertical />}
                                                    >
                                                        <SpeedDialAction
                                                            icon={<BsCheckSquare />}
                                                            tooltipTitle="Ver documentos"
                                                            onClick={() => {
                                                                seleccionar(item.DataBeanProperties)
                                                            }}
                                                        />
                                                    </SpeedDial>
                                                    <SButtonHistory idProcedure={item.DataBeanProperties.IDProcedureImp} type={2} />

                                                </div>
                                            </TableCell>
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
                            count={listProcedureImp.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                    </Paper>
                )



                    : (
                        <div className="w-100 d-flex justify-content-center">
                            <h1 className="text-muted h-100">No hay procesos por Gestionar :(</h1>
                        </div>
                    )

                }
            </div>
            case 1: return <div>

                <div className="w-100 d-flex flex-wrap justify-content-lg-start justify-content-sm-center">
                    {/* {
                        listDocuments.map((item: any, index: number) => (
                            <div onClick={() => { openMedia(item.DataBeanProperties.Name); setBeanAct(item.DataBeanProperties) }}>
                                <div className="cgt card m-2 p-4" >
                                    <div>
                                        <h5>{item.DataBeanProperties.IDAction} - {item.DataBeanProperties.ProcedureActionName}</h5>
                                        <hr />
                                        <div>
                                            <b>Descripción:</b>
                                            <br />
                                            {item.DataBeanProperties.Description}
                                        </div>
                                        <div>
                                            <b>Fecha de carga:</b>
                                            <br />
                                            {item.DataBeanProperties.UptoDate}
                                        </div>
                                        <div>
                                            <b>Documento del solicitante:</b>
                                            <br />
                                            {item.DataBeanProperties.AccountID}
                                        </div>
                                        <div>
                                            <b>Nombre del solicitante:</b>
                                            <br />
                                            {item.DataBeanProperties.AccountName}
                                        </div>
                                        <div>
                                            <b>Estado:</b>
                                            <br />
                                            {estadoDoc[item.DataBeanProperties.State]}

                                        </div>
                                        <div>
                                            <b>Acción:</b>
                                            <br />
                                            {item.DataBeanProperties.DocumentTypeName}
                                        </div>

                                    </div>
                                </div>

                            </div>
                        ))
                    } */}
                    <Paper sx={{ width: "100%", overflow: "hidden" }}>
                        <TableContainer sx={{ height: "70vh" }}>
                            <Table stickyHeader aria-label="sticky table" className={classes.root}>

                                <TableHead>
                                    <TableRow>
                                        <TableCell>Documento</TableCell>
                                        <TableCell>Descripción del requisito</TableCell>
                                        <TableCell>Fecha</TableCell>
                                        <TableCell>Tipo de documento</TableCell>
                                        <TableCell>Estado</TableCell>
                                        <TableCell>Acciones</TableCell>
                                    </TableRow>
                                </TableHead>

                                <TableBody>
                                    {listDocuments.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item: any, index: number) => (
                                        <TableRow hover role="checkbox" tabIndex={-1}>
                                            <TableCell>{item.DataBeanProperties.ProcedureActionName}</TableCell>
                                            <TableCell>{item.DataBeanProperties.Description}</TableCell>
                                            <TableCell>{item.DataBeanProperties.UptoDate}</TableCell>
                                            <TableCell>{item.DataBeanProperties.DocumentTypeName}</TableCell>
                                            <TableCell>{estadoDoc[item.DataBeanProperties.State]}</TableCell>
                                            <TableCell className='d-flex p-1'>
                                                <div className="d-lg-flex d-none">
                                                    {item.DataBeanProperties.DocumentType == 2 &&
                                                        <ThemeProvider theme={inputsTheme}>
                                                            <Tooltip title={item.DataBeanProperties.DocumentTypeName}>
                                                                <Button
                                                                    variant="contained"
                                                                    className="box-s mr-3 mt-2 mb-2"
                                                                    color="secondary"
                                                                    onClick={() => (openMedia(item.DataBeanProperties.Name), setBeanAct(item.DataBeanProperties))}>
                                                                    <FaFileUpload />
                                                                </Button>
                                                            </Tooltip>
                                                        </ThemeProvider>
                                                    }
                                                    {item.DataBeanProperties.DocumentType == 6 &&
                                                        <ThemeProvider theme={inputsTheme}>
                                                            <Tooltip title={item.DataBeanProperties.DocumentTypeName}>
                                                                <Button
                                                                    variant="contained"
                                                                    className="box-s mr-3 mt-2 mb-2"
                                                                    color="secondary"
                                                                    onClick={() => (openForm(true),
                                                                        setTitleDoc(item.DataBeanProperties.Name),
                                                                        setBeanAct(item.DataBeanProperties))}>
                                                                    <FaWpforms />
                                                                </Button>
                                                            </Tooltip>
                                                        </ThemeProvider>
                                                    }

                                                </div>

                                                <div className="d-block d-lg-none">
                                                    <SpeedDial
                                                        ariaLabel="SpeedDial basic example"
                                                        direction="left"
                                                        FabProps={{ size: "small", style: { backgroundColor: "#0d6efd" } }}
                                                        icon={<FiMoreVertical />}
                                                    >
                                                        {item.DataBeanProperties.DocumentType == 2 &&
                                                            <SpeedDialAction
                                                                icon={<FaFileUpload />}
                                                                tooltipTitle={item.DataBeanProperties.DocumentTypeName}
                                                                onClick={() => (openMedia(item.DataBeanProperties.Name), setBeanAct(item.DataBeanProperties))}
                                                            />
                                                        }
                                                        {item.DataBeanProperties.DocumentType == 6 &&
                                                            <SpeedDialAction
                                                                icon={<FaWpforms />}
                                                                tooltipTitle={item.DataBeanProperties.DocumentTypeName}
                                                                onClick={() => (openForm(true),
                                                                    setTitleDoc(item.DataBeanProperties.Name),
                                                                    setBeanAct(item.DataBeanProperties))}
                                                            />
                                                        }
                                                        <SButtonHistory idProcedure={parseInt(beanProcedureImp.IDProcedureImp)} type={2} />
                                                    </SpeedDial>
                                                </div>
                                            </TableCell>
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
                            count={listDocuments.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                    </Paper>
                    {showM ? (<SLoadDocument setShow={closeSearchM} type={1} title={titleDoc} getMedia={getItemM} show={showM} beanAction={beanAction} />) : ('')}
                    {showModalForm && (<SLoadForm type={1} beanAction={beanAction} getShowForm={openForm} status={showModalForm} title={titleDoc} IDProcedureIMP={beanProcedureImp.IDProcedureImp} />)}
                </div>
            </div>
            default: return <div>
                <svg className="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                    <circle className="checkmark__circle" cx="26" cy="26" r="25" fill="none" />
                    <path className="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
                </svg>
                <h5 className="w-100 text-center">Muchas Gracias!, Ya quedo gestionado el proceso. Para seguir con otro proceso click <b onClick={() => { handleReset(); listarDocumentosPorResponder(); }}> <u> AQUI</u></b></h5>
            </div>;
        }
    }
    // const useStyles = makeStyles(() => ({
    //     root: {
    //         "& .Mui-disabled .MuiStepIcon-root": { color: "#F2C438" },
    //         "& .MuiSvgIcon-root,  .Mui-active": { color: "#0d6efd" }
    //     }
    // }));
    // const steperTheme = useStyles();


    return (
        <>
            <div className="nWhite p-3 m-3 w-100">
                <Box sx={{ width: '100%' }}>
                    <h2>Trámites por Gestionar</h2>
                    <Stepper activeStep={activeStep} className={classes.root}>
                        {steps.map((label, index) => (
                            <Step key={label} completed={completed[index]} disabled={completed[index]}>
                                <StepButton className="line-out" color="primary" onClick={handleStep(index)}>
                                    {label}
                                </StepButton>
                            </Step>
                        ))}
                    </Stepper>
                    <div className="mt-3 d-flex justify-content-end">
                        {activeStep > 0 &&

                            <Button
                                startIcon={<MdKeyboardArrowLeft />}
                                disabled={activeStep === 0}
                                style={{ backgroundColor: '#553F73', color: '#FFFFFF' }}
                                onClick={() => handleBack()}
                                sx={{ mr: 1 }}
                            >

                                Atrás
                            </Button>
                        }

                    </div>
                </Box>
                <div>
                    {allStepsCompleted() ? (
                        <React.Fragment>
                        </React.Fragment>
                    ) : (
                        <React.Fragment >
                            <div className="mt-4 pt-4 "> <b> Paso actual</b>: {steps[activeStep]}</div>
                            <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                                <Box sx={{ flex: '1 1 auto' }} />
                            </Box>
                        </React.Fragment>
                    )}
                </div>
                <Box sx={{ width: '100%' }}>
                    <div>
                        {renderSwitch(activeStep)}
                    </div>
                </Box>
            </div>
            {showSpinner &&
                <SSpinner show={showSpinner} />
            }
        </>
    )
}
