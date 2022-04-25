import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepButton from "@mui/material/StepButton";
import Button from "@mui/material/Button";
import {
  MenuItem,
  TextField,
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  SpeedDial,
  SpeedDialAction,
  TablePagination,
  Autocomplete,
  Tooltip,
  ButtonGroup,
  ThemeProvider,
} from "@mui/material";
import { FiMoreVertical } from "react-icons/fi";
import { Col, Form, Modal, Row } from "react-bootstrap";
import {
  BsFileEarmarkMedical,
  BsFillPersonPlusFill,
  BsHandIndexThumb,
  BsSearch,
  BsXSquare,
} from "react-icons/bs";
import { SuscriptionService } from "../../../core/services/SuscriptionService";
import { useForm } from "react-hook-form";
import { ConfigService } from "../../../core/services/ConfigService";
import { SSearchTree } from "../../../shared/components/SSearchTree";
import { MdKeyboardArrowLeft } from "react-icons/md";
import { Toast } from "../../../utils/Toastify";
import { Characterization } from "../../configuration/model/Characterization";
import { Office } from "../../configuration/model/Office";
import { inputsTheme, useStyles } from "../../../utils/Themes";
import { useSelector } from "react-redux";
import { RootState } from "../../../store/Store";
import { pipeSort } from "../../../utils/pipeSort";
import { SButtonHistory } from "../../../shared/components/SButtonHistory";
import { SSpinner } from "../../../shared/components/SSpinner";


const _suscripcionService = new SuscriptionService();
const _configService = new ConfigService();

interface ITrayToBeAssign { }

export const TTrayToBeAssing: React.FC<ITrayToBeAssign> = () => {
  const { register, setValue, handleSubmit } = useForm();
  const [activeStep, setActiveStep] = React.useState(0);
  const [completed, setCompleted] = React.useState<{
    [k: number]: boolean;
  }>({});
  const [show, setShow] = useState(false);
  const [listCharacterization, setCharacterization] = useState<
    Characterization[]
  >([]);
  const [listProcedureImp, setListProcedureImp] = useState([]);
  const [listBusiness, setListBusiness] = useState<any[]>([]);
  const [listOffice, setListOffice] = useState<Office[]>([]);
  const [listDocuments, setListDocuments] = useState([]);
  const [listUsers, setListUsers] = useState([]);
  const [beanProcedureIMP, setBeanPIMP] = useState<any>();
  const [beanAction, setBeanAction] = useState<any>();

  const [showSTree, setSTree] = useState(false);
  const [mensajeTareas, setMensaje] = useState("");
  const [typeModal, setTypeModal] = useState(0);
  const steps = ["Filtrar", "Seleccionar Tramite", "Verificar Documentacion"];
  const [office, setOffice] = useState(0);
  const { items } = useSelector((state: RootState) => state.itemsperpage);
  const [rowsPerPage, setRowsPerPage] = useState<any>(10);
  const [page, setPage] = useState(0);
  const [showSpinner, setShowSpinner] = useState(false);

  useEffect(() => {
    getOfficeCatalogForAccount(parseInt(getSesion().IDAccount));
    getBusinessClassCatalog();
    setRowsPerPage(parseInt(items));;

  }, [items]);

  //Servicios
  const getBusinessClassCatalog = () => {
    _configService.getBusinessClassCatalog().subscribe((resp) => {
      if (resp) {
        setCharacterization(resp);
      }
    });
  };
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const getProcess = async (id: number) => {
    let aux: any[] = [];
    let auxSorted: any[] = [];
    await _configService
      .getBusinessProcessCatalog(id, null, null)
      .then((resp: any) => {
        if (resp.data.DataBeanProperties.ObjectValue) {
          resp.data.DataBeanProperties.ObjectValue.map((item: any) =>
            aux.push({
              label: item.DataBeanProperties.Name,
              id: item.DataBeanProperties.IDBusinessProcess,
            }));
          auxSorted = pipeSort([...aux], "label");
          setListBusiness(auxSorted);
          /* setListBusiness(resp.data.DataBeanProperties.ObjectValue); */
        } else {
          Toast.fire({
            icon: "error",
            title: "No se ha podido completar la accion",
          });
        }
      })
      .catch((e) => {
        console.error(e);
      });
  };

  const viewModal = (vista: boolean, type: number) => {
    setShow(vista);
    setTypeModal(type);
    setListUsers([]);
  };
  const closeSearchTree = (data: any) => {
    setSTree(data);
  };
  const getData = (data: any) => {
    console.log(data);
    setValue("entity.IDLnFunctionalID", data.IDLn);
    setValue("entity.AreaName", data.name);
    // getWorkGroupMemberCatalog2(data.IDLn);
  };
  const getWorkGroupMemberCatalog2 = async (IDLnFunctionalID: number, IDOffice: number) => {
    // console.log(beanProcedureIMP);
    setListUsers([]);
    await _configService
      .getWorkGroupMemberCatalog(IDLnFunctionalID, IDOffice)
      .subscribe((resp: any) => {
        if (resp) {
          setListUsers(resp);
        }
      })
  };
  const getWorkGroupMember = async (data: any) => {
    await _suscripcionService
      .getWorkGroupMember(
        beanAction.IDLnFunctionalID,
        data.entity.Nit,
        data.entity.Nombre,
        data.entity.Apellido
      )
      .then((resp: any) => {
        if (resp.data.DataBeanProperties.ObjectValue) {
          setListUsers(resp.data.DataBeanProperties.ObjectValue1);
        } else {
          Toast.fire({
            icon: "error",
            title: "No se ha podido completar la accion",
          });
        }
      })
      .catch((e) => console.error(e));
  };

  // Office
  const getOfficeCatalogForAccount = (idAccount: number) => {
    console.log(idAccount);
    _configService.getOfficeCatalogForAccount(idAccount).subscribe((resp) => {
      console.log(resp);
      if (resp) {
        setListOffice(resp);
      } else {
        Toast.fire({
          icon: "error",
          title: "No se ha podido completar la accion",
        });
      }
    });
  };

  const allStepsCompleted = () => {
    return completedSteps() === totalSteps();
  };
  const completedSteps = () => {
    return Object.keys(completed).length;
  };
  const totalSteps = () => {
    return steps.length;
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
  const isLastStep = () => {
    return activeStep === totalSteps() - 1;
  };
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };
  const handleNext = () => {
    const newActiveStep =
      isLastStep() && !allStepsCompleted()
        ? steps.findIndex((step, i) => !(i in completed))
        : activeStep + 1;
    setActiveStep(newActiveStep);
  };
  const handleReset = () => {
    setActiveStep(0);
    setCompleted({});
  };
  const getSesion = () => {
    return JSON.parse(localStorage.getItem("usuario") ?? "");
  };

  const getAccount = (data: number) => {
    console.log(data);
    setOffice(data);
  }

  const buscarPorAsignar = async (id: any) => {
    setShowSpinner(true);
    console.log(id, office, parseInt(getSesion().IDAccount));
    await _suscripcionService
      .getProcedureImpForAssign(parseInt(getSesion().IDAccount), id, office)
      .then((resp: any) => {
        setShowSpinner(false);
        if (resp.data.DataBeanProperties.ObjectValue) {
          handleComplete();
          setListProcedureImp(resp.data.DataBeanProperties.ObjectValue);
        } else {
          Toast.fire({
            icon: "error",
            title: "No se ha podido completar la accion",
          });
        }
      })
      .catch((e) => {
        console.error(e);
      });
  };
  const asignarUsuarioProcedure = (bean: any) => {
    setBeanPIMP(bean);
    viewModal(true, 1);
    getWorkGroupMemberCatalog2(bean.IDLnFunctionalID, bean.IDOffice);

  };
  const seleccionarUsuario = async (data: any) => {
    console.log(data);
    console.log(beanProcedureIMP);
    viewModal(false, 0);
    await _suscripcionService
      .assignProcedureImpToGroupMember(
        beanProcedureIMP.IDProcedureImp,
        data.IDAccount,
        parseInt(getSesion().IDAccount)
      )
      .then((resp: any) => {
        console.log(resp);
        if (resp.data.DataBeanProperties.ObjectValue) {
          handleComplete();
          setActiveStep(3);
          setMensaje(
            `Muchas Gracias!, Se asignarón ${resp.data.DataBeanProperties.ObjectValue} tareas al usuario: ${data.AccountName}`
          );
        } else {
          Toast.fire({
            icon: "error",
            title: "No se ha podido completar la accion",
          });
        }
      })
      .catch((e) => {
        console.error(e);
      });
  };
  const seleccionarUsuarioAction = async (data: any) => {
    await _suscripcionService
      .assignActionResponseToGroupMember(
        beanAction.IDAction,
        parseInt(getSesion().IDAccount),
        data.IDAccount
      )
      .then((resp: any) => {
        if (resp.data.DataBeanProperties.ObjectValue) {
          setShow(false);
          verDocumentos(beanProcedureIMP.IDProcedureImp);
        } else {
          Toast.fire({
            icon: "error",
            title: "No se ha podido completar la accion",
          });
        }
      })
      .catch((e) => console.error(e));
  };
  const autoAsignarAction = async (id: number) => {
    await _suscripcionService
      .assignActionResponseToGroupMember(
        id,
        parseInt(getSesion().IDAccount),
        parseInt(getSesion().IDAccount)
      )
      .then((resp: any) => {
        if (resp.data.DataBeanProperties.ObjectValue) {
          setShow(false);
          verDocumentos(beanProcedureIMP.IDProcedureImp);
        } else {
          Toast.fire({
            icon: "error",
            title: "No se ha podido completar la accion",
          });
        }
      })
      .catch((e) => console.error(e));
  };

  const autoAsignarProcedure = async (IDProcedureImp: number) => {
    await _suscripcionService
      .assignProcedureImpToGroupMember(
        IDProcedureImp,
        parseInt(getSesion().IDAccount),
        parseInt(getSesion().IDAccount)
      )
      .then((resp: any) => {
        console.log(resp);
        if (resp.data.DataBeanProperties.ObjectValue) {
          handleComplete();
          setActiveStep(3);
          setMensaje(
            `Muchas Gracias!, Se asignarón ${resp.data.DataBeanProperties.ObjectValue
            } tareas al usuario: ${getSesion().EntityName}`
          );
        } else {
          Toast.fire({
            icon: "error",
            title: "No se ha podido completar la accion",
          });
        }
      })
      .catch((e) => {
        console.error(e);
      });
  };

  const verDocumentos = async (id: number) => {
    await _suscripcionService
      .getProcedureActionForAssign(id)
      .then((resp: any) => {
        if (resp.data.DataBeanProperties.ObjectValue) {
          setListDocuments(resp.data.DataBeanProperties.ObjectValue);
          if (resp.data.DataBeanProperties.ObjectValue.length === 0) {
            handleComplete();
            setMensaje(
              "Muchas Gracias!, Este proceso ya no tiene mas documentos por asignar"
            );
          }
        } else {
          Toast.fire({
            icon: "error",
            title: "No se ha podido completar la accion",
          });
        }
      })
      .catch((e) => {
        console.error(e);
      });
  };
  const classes = useStyles();

  const renderSwitch = (param: number) => {
    switch (param) {
      case 0:
        return (
          <div>
            <div className="row m-5 card flex-row">
              <Col sm={4}>
                <TextField
                  className="mt-3 mb-3"
                  margin="normal"
                  size="small"
                  select
                  fullWidth
                  color="secondary"
                  label="Seleccione una seccional"
                  id="state"
                  onChange={(e) => getAccount(parseInt(e.target.value))}
                >
                  {listOffice.map((item: Office) => (
                    <MenuItem value={item.IDOffice}>{item.Name}</MenuItem>
                  ))}
                </TextField>
              </Col>
              <Col sm={4}>
                <TextField
                  className="mt-3 mb-3"
                  margin="normal"
                  size="small"
                  select
                  fullWidth
                  color="secondary"
                  label="Seleccione una clase trámite"
                  id="state"
                  onChange={(e) => getProcess(parseInt(e.target.value))}
                >
                  {listCharacterization.map((item) => (
                    <MenuItem value={item.IDBusinessClass}>
                      {item.Name}
                    </MenuItem>
                  ))}
                </TextField>
              </Col>
              <Col sm={4}>
                <Autocomplete
                  onChange={(e, value) => buscarPorAsignar(value.id)}
                  fullWidth
                  size="small"
                  disablePortal
                  id="seccionales"
                  options={listBusiness}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      className="mt-3 mb-3"
                      label="Seleccione un trámite"
                      fullWidth
                      color="secondary"
                    />
                  )}
                />
              </Col>
            </div>
          </div>
        );
      case 1:
        return (
          <div className="w-100 d-flex flex-wrap justify-content-xl-start justify-content-sm-center">
            {listProcedureImp.length > 0 ? (
              <Paper sx={{ width: "100%", overflow: "hidden" }}>
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
                      {listProcedureImp.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item: any) => (
                        <TableRow hover role="checkbox" tabIndex={-1}>
                          <TableCell>{item.DataBeanProperties.IDProcedureImp}</TableCell>
                          <TableCell>{item.DataBeanProperties.AccountName}</TableCell>
                          <TableCell>{item.DataBeanProperties.Name}</TableCell>
                          <TableCell>{item.DataBeanProperties.ProcedureName}</TableCell>
                          <TableCell>{item.DataBeanProperties.Description}</TableCell>
                          <TableCell>{item.DataBeanProperties.Since}</TableCell>
                          <TableCell>{item.DataBeanProperties.AccountID}</TableCell>
                          <TableCell>
                            <div className="d-lg-flex d-none" >
                              <SButtonHistory idProcedure={item.DataBeanProperties.IDProcedureImp} type={2} />
                              <ButtonGroup>

                                <ThemeProvider theme={inputsTheme}>
                                  <Tooltip title="Auto asignar procedimiento">
                                    <Button
                                      variant="contained"
                                      className="box-s mr-1 mt-2 mb-2"
                                      color="secondary"
                                      onClick={() =>
                                        autoAsignarProcedure(
                                          item.DataBeanProperties.IDProcedureImp
                                        )}>
                                      <BsHandIndexThumb />
                                    </Button>
                                  </Tooltip>
                                </ThemeProvider>
                                <ThemeProvider theme={inputsTheme}>
                                  <Tooltip title="Asignar usuario responsable">
                                    <Button
                                      variant="contained"
                                      className="box-s mr-1 mt-2 mb-2"
                                      color="secondary"
                                      onClick={() =>
                                        asignarUsuarioProcedure(item.DataBeanProperties)
                                      }>
                                      <BsFillPersonPlusFill />
                                    </Button>
                                  </Tooltip>
                                </ThemeProvider>
                              </ButtonGroup>
                            </div>
                            <div className="d-flex d-lg-none" >
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
                                  key={item.DataBeanProperties.IDProcedureImp}
                                  icon={<BsHandIndexThumb />}
                                  tooltipTitle="Auto asignar procedimiento"
                                  onClick={() =>
                                    autoAsignarProcedure(
                                      item.DataBeanProperties.IDProcedureImp
                                    )
                                  }
                                />
                                <SpeedDialAction
                                  key={item.DataBeanProperties.IDProcedureImp + 1}
                                  onClick={() => {
                                    asignarUsuarioProcedure(item.DataBeanProperties);
                                  }}
                                  icon={<BsFillPersonPlusFill />}
                                  tooltipTitle="Asignar usuario responsable"
                                />
                                )
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
            ) : (
              <div className="w-100 d-flex justify-content-center">
                <h1 className="text-muted h-100">
                  No hay procesos por Asignar :(
                </h1>
              </div>
            )
            }
          </div >
        );
      case 2:
        return (
          <div>
            <div className="w-100 d-flex flex-wrap justify-content-lg-start justify-content-sm-center">
              <Paper sx={{ width: "100%", overflow: "hidden" }}>
                <TableContainer sx={{ height: "70vh" }}>
                  <Table stickyHeader aria-label="sticky table" className={classes.root}>
                    <TableHead>
                      <TableRow>
                        <TableCell>Nombre del documento</TableCell>
                        <TableCell>Fecha de carga</TableCell>
                        <TableCell>Documento del solicitante</TableCell>
                        <TableCell>Nombre del solicitante</TableCell>
                        <TableCell>Documento</TableCell>
                        <TableCell>Acciones</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {listDocuments.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item: any) => (
                        <TableRow hover role="checkbox" tabIndex={-1}>
                          <TableCell>{item.DataBeanProperties.ProcedureActionName}</TableCell>
                          <TableCell>{item.DataBeanProperties.UptoDate}</TableCell>
                          <TableCell>{item.DataBeanProperties.AccountID}</TableCell>
                          <TableCell>{item.DataBeanProperties.AccountName}</TableCell>
                          <TableCell> <a href={item.DataBeanProperties.Url}>
                            {item.DataBeanProperties.Media}
                          </a></TableCell>
                          <TableCell>
                            <div className="d-lg-flex d-none" >
                              <ButtonGroup>
                                <ThemeProvider theme={inputsTheme}>
                                  <Tooltip title="Auto asignar procedimiento">
                                    <Button
                                      variant="contained"
                                      className="box-s mr-1 mt-2 mb-2"
                                      color="secondary"
                                      onClick={() =>
                                        autoAsignarAction(item.DataBeanProperties.IDAction)
                                      }>
                                      <BsHandIndexThumb />
                                    </Button>
                                  </Tooltip>
                                </ThemeProvider>
                                <ThemeProvider theme={inputsTheme}>
                                  <Tooltip title="Asignar usuario responsable">
                                    <Button
                                      variant="contained"
                                      className="box-s mr-1 mt-2 mb-2"
                                      color="secondary"
                                      onClick={() => {
                                        setBeanAction(item.DataBeanProperties);
                                        viewModal(true, 2);
                                      }}>
                                      <BsFillPersonPlusFill />
                                    </Button>
                                  </Tooltip>
                                </ThemeProvider>
                              </ButtonGroup>
                            </div>
                            <div className="d-block d-lg-none">
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
                                  key={item.DataBeanProperties.IDAction}
                                  icon={<BsHandIndexThumb />}
                                  tooltipTitle="Auto asignar procedimiento"
                                  onClick={() =>
                                    autoAsignarAction(item.DataBeanProperties.IDAction)
                                  }
                                />
                                <SpeedDialAction
                                  key={item.DataBeanProperties.IDAction + 1}
                                  onClick={() => {
                                    setBeanAction(item.DataBeanProperties);
                                    viewModal(true, 2);
                                  }}
                                  icon={<BsFillPersonPlusFill />}
                                  tooltipTitle="Asignar usuario responsable"
                                />
                                )
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
            </div>
          </div>
        );
      default:
        return (
          <div>
            <svg
              className="checkmark"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 52 52"
            >
              <circle
                className="checkmark__circle"
                cx="26"
                cy="26"
                r="25"
                fill="none"
              />
              <path
                className="checkmark__check"
                fill="none"
                d="M14.1 27.2l7.1 7.2 16.7-16.8"
              />
            </svg>
            <h5 className="w-100 text-center">
              {mensajeTareas}. Para seguir con otro proceso click{" "}
              <b
                onClick={() => {
                  handleReset();
                }}
              >
                {" "}
                <u> AQUI</u>
              </b>
            </h5>
          </div>
        );
    }
  };

  const steperTheme = useStyles();

  return (
    <div className="nWhite p-3 m-3 w-100">
      <Box sx={{ width: "100%" }}>
        <h2>Trámites por Asignar</h2>
        <Stepper activeStep={activeStep} className={steperTheme.root}>
          {steps.map((label, index) => (
            <Step
              key={label}
              completed={completed[index]}
              disabled={completed[index]}
            >
              <StepButton
                className="line-out"
                color="inherit"
                onClick={handleStep(index)}
              >
                {label}
              </StepButton>
            </Step>
          ))}
        </Stepper>
        <div className="mt-3 d-flex justify-content-end">
          {activeStep > 0 && (
            <Button
              startIcon={<MdKeyboardArrowLeft />}
              disabled={activeStep === 0}
              style={{ backgroundColor: "#553F73", color: "#FFFFFF" }}
              onClick={() => handleBack()}
              sx={{ mr: 1 }}
            >
              Atrás
            </Button>
          )}
        </div>
      </Box>
      <div>
        {allStepsCompleted() ? (
          <React.Fragment></React.Fragment>
        ) : (
          <React.Fragment>
            <div className="mt-4 pt-4 ">
              {" "}
              <b> Paso actual</b>: {steps[activeStep]}
            </div>
            <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
              <Box sx={{ flex: "1 1 auto" }} />
            </Box>
          </React.Fragment>
        )}
      </div>
      <Box sx={{ width: "100%" }}>
        <div>{renderSwitch(activeStep)}</div>
      </Box>
      <Modal show={show} backdrop="static" size="xl" centered keyboard={false}>
        <Modal.Header>
          Asignar usuario
          <BsXSquare onClick={() => viewModal(false, 0)} />
        </Modal.Header>
        <Modal.Body>
          <Row>
            {/* {" "}
            {typeModal === 1 ? (
              <Col sm={12} className="">
                <Form.Label>Grupo de trabajo</Form.Label>
                <div className="input-group">
                  <Form.Control
                    key="txtNameAccount"
                    id="inlineFormInputGroup"
                    onClick={() => setSTree(true)}
                    {...register("entity.AreaName")}
                  />
                  <div className="input-group-prepend">
                    <button
                      type="button"
                      className="btn btn-outline-success rounded-right"
                      onClick={() => setSTree(true)}
                    >
                      <BsSearch />
                    </button>
                  </div>
                </div>
              </Col>
            ) : (
              <form
                className="w-100"
                onSubmit={handleSubmit(getWorkGroupMember)}
              >
                <Row className="m-0 justify-content-end">
                  <Col sm={12} md={4}>
                    <Form.Label>Nit</Form.Label>
                    <Form.Control
                      className="form-control"
                      {...register("entity.Nit")}
                    />
                  </Col>
                  <Col sm={12} md={4}>
                    <Form.Label>Nombre</Form.Label>
                    <Form.Control
                      className="form-control"
                      {...register("entity.Nombre")}
                    />
                  </Col>
                  <Col sm={12} md={4}>
                    <Form.Label>Apellido</Form.Label>
                    <Form.Control
                      className="form-control"
                      {...register("entity.Apellido")}
                    />
                  </Col>
                  <button className="mt-3 mr-3 btn btn-outline-secondary">
                    Buscar
                  </button>
                </Row>
              </form>
            )} */}
            <Col sm={12} className="mt-5">
              <div className="datatable">
                <table
                  className="table table-bordered table-hover"
                  id="dataTable"
                  width="100%"
                >
                  <thead>
                    <tr>
                      <th scope="col">ID</th>
                      <th scope="col">Cédula/Nit</th>
                      <th scope="col">Nombre</th>
                      <th scope="col">Grupo de trabajo</th>
                      <th scope="col">Desde</th>
                      <th scope="col">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {listUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item: any) => (
                      <tr key={item.IDWorkGroupMember}>
                        <th>{item.IDWorkGroupMember}</th>

                        <th>{item.AccountID}</th>
                        <td>{item.AccountName}</td>
                        <td>{item.FunctionalIDName}</td>
                        <td>{item.Since}</td>
                        <td>
                          <button
                            className="btn btn-success"
                            onClick={() =>
                              seleccionarUsuario(item)
                            }
                          >
                            <BsFillPersonPlusFill></BsFillPersonPlusFill>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <TablePagination
                  className={classes.root}
                  rowsPerPageOptions={[items, 10, 25, 100]}
                  labelRowsPerPage="Columnas por Página"
                  component="div"
                  count={listUsers.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </div>
            </Col>
            <SSearchTree
              getShowSTree={closeSearchTree}
              getDataTree={getData}
              dataShowTree={showSTree}
            />
          </Row>
        </Modal.Body>
      </Modal>
      {showSpinner &&
        <SSpinner show={showSpinner} />
      }
    </div>
  );
};
