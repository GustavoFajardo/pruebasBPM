import React from "react";
import { Col, Row } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { BsBoundingBox, BsBoxArrowRight, BsDiagram3, BsMenuAppFill, BsSearch, BsTrash } from "react-icons/bs";
import { useSelector } from "react-redux";
import { IconButton, Button, InputAdornment, MenuItem, Paper, SpeedDial, SpeedDialAction, Stepper, TableContainer, TableHead, TextField, Table, TableRow, TableCell, TableBody, TablePagination, ThemeProvider, Autocomplete, ButtonGroup, Tooltip } from "@mui/material";
import Step from "@mui/material/Step";
import StepButton from "@mui/material/StepButton";
import { FiMoreVertical } from "react-icons/fi";
import { Box } from "@mui/system";


import SSearchPerson from "../../../shared/components/SSearchPerson";
import { RootState } from "../../../store/Store";
import { ConfigService } from "../../../core/services/ConfigService";
import TProcessStageRecord from "../components/TProcessStageRecord";
import TProcessManagement from "../components/TProcessManagement";
import TPendingActivities from "../components/TPendingActivities";
import { SpinnerDotted } from "spinners-react";
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { LocalizationProvider, DatePicker } from "@mui/lab";
import { inputsTheme, useStyles } from "../../../utils/Themes";
import { pipeSort } from "../../../utils/pipeSort";


const _configService = new ConfigService();

interface IHistoryProcess { }

const THistoryProcess: React.FC<IHistoryProcess> = () => {
  const {
    register,
    setValue,
    handleSubmit,
    clearErrors,
    formState: { errors },
  } = useForm();

  const [show, setShow] = useState(false);
  const [businesses, setBusinesses] = useState([]);
  const [listState, setListState] = useState([]);
  const [list, setList] = useState([]);
  const [showPSR, setShowPSR] = useState(false);
  const [showPMR, setShowPMR] = useState(false);
  const [showPA, setShowPA] = useState(false);
  const [showSpinner, setShowSpinner] = useState(false);
  const [id, setId] = useState(0);
  const [user, setUser] = useState("");
  const [dateInit, setDateInit] = useState<Date | null>(null);
  const [dateEnd, setDateEnd] = useState<Date | null>(null);
  const [dateInitError, setDateInitError] = useState<boolean>(false);
  const [dateEndError, setDateEndError] = useState<boolean>(false);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const [proSelected, setProSelected] = useState(-1);
  const { items } = useSelector((state: RootState) => state.itemsperpage);


  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };


  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  useEffect(() => {
    getSateListForBusinessProcess();
    setRowsPerPage(parseInt(items));;
    clearForm();
  }, [items]);

  const clearForm = () => {
    setValue("entity", {
      IDBusinessClass: "",
      IDBusinessProcess: "",
      IDAccount: "",
      EntityName: "",
      Init: "",
      Final: "",
      Property: "",
    });
  };

  const getSateListForBusinessProcess = async () => {
    await _configService
      .getSateListForBusinessProcess()
      .then((resp: any) => {
        setListState(resp.data.DataBeanProperties.ObjectValue);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const getProcedureImpByAccount = async (
    idBusiness: any,
    idAccount: any,
    init: any,
    final: any,
    state: any
  ) => {
    setShowSpinner(true);
    await _configService
      .getProcedureImpByAccount(idBusiness, idAccount, init, final, state)
      .then((resp: any) => {
        setShowSpinner(false);
        setList(resp.data.DataBeanProperties.ObjectValue);
      })
      .catch((e) => {
        console.log(e);
        setShowSpinner(false);
      });
  };

  const characterizations = useSelector(
    (state: RootState) => state.characterization.characterizations
  );

  const getBusinessProcessCatalog = async (id: number | null) => {
    let aux: any = [];
    let auxSorted: any = [];
    await _configService
      .getBusinessProcessCatalog(id, null, null)
      .then((resp: any) => {
        if (resp.data.DataBeanProperties.ObjectValue) {
          resp.data.DataBeanProperties.ObjectValue.map((item: any) => (
            aux.push({
              label: item.DataBeanProperties.Name,
              id: item.DataBeanProperties.IDBusinessProcess
            })
          ))
          auxSorted = pipeSort([...aux], 'label');
          setBusinesses(auxSorted);
          console.log(auxSorted);
        }
      })
      .catch((e) => {
        console.error(e);
      });
  };

  const changeCharac = (e: any) => {
    clearErrors('entity.IDBusinessClass');
    getBusinessProcessCatalog(e);
  };

  const openUser = () => {
    setShow(true);
  };

  const getItem = (data: any) => {
    console.log(data);
    clearErrors('entity.EntityName');
    setValue("entity.IDAccount", data.IDAccount);
    setValue("entity.EntityName", data.EntityName);
    setUser(data.EntityName);
  };

  const closeSearch = (data: any) => {
    setShow(data);
  };

  const format = (date: Date | null) => {
    let dateFormated: string = "";
    if (date !== null) {
      dateFormated = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
    }
    return dateFormated;
  }

  const onSubmit = (data: any, e: any) => {
    e.preventDefault();
    const aux = data.entity;
    aux.Init = format(dateInit) + " 00:00:00";
    aux.Final = format(dateEnd) + " 00:00:00";
    aux.IDBusinessProcess = parseInt(aux.IDBusinessProcess);
    aux.Property = parseInt(aux.Property);
    getProcedureImpByAccount(
      proSelected,
      aux.IDAccount,
      aux.Init,
      aux.Final,
      aux.Property
    );
    handleComplete();
  };

  const [activeStep, setActiveStep] = React.useState(0);
  const steps = ["Buscar", "Tabla"];
  const [completed, setCompleted] = React.useState<{
    [k: number]: boolean;
  }>({});

  const handleStep = (step: number) => () => {
    setActiveStep(step);
  };

  const completedSteps = () => {
    return Object.keys(completed).length;
  };

  const totalSteps = () => {
    return steps.length;
  };

  const allStepsCompleted = () => {
    return completedSteps() === totalSteps();
  };

  const handleComplete = () => {
    const newCompleted = completed;
    newCompleted[activeStep] = true;
    setCompleted(newCompleted);
    handleNext();
  };

  const handleNext = () => {
    const newActiveStep =
      isLastStep() && !allStepsCompleted()
        ?
        steps.findIndex((step, i) => !(i in completed))
        : activeStep + 1;
    setActiveStep(newActiveStep);
  };

  const isLastStep = () => {
    return activeStep === totalSteps() - 1;
  };
  const onChangeSelect_Process = (e: any) => {
    return e == null ? null : (setProSelected(e.id), setValue("entity.IDBusinessProcess", proSelected), clearErrors('entity.IDBusinessProcess'));
  };


  const handleBack = () => {
    setUser("")
    setDateInit(null);
    setDateEnd(null);
    setDateInitError(false);
    setDateEndError(false);
    clearForm();
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const classes = useStyles();

  const renderSwitch = (param: number) => {
    switch (param) {
      case 0:
        return (
          <div className="px-5 mt-5 card box-s">
            <form onSubmit={handleSubmit(onSubmit)}>
              <Row className="mt-5">
                <Col sm={12} className="mb-5 d-flex justify-content-center">
                  <h1>.:: HISTORIAL DE TR??MITES ::.</h1>
                </Col>
                <Col sm={4}>
                  <TextField
                    size="small"
                    select
                    fullWidth
                    color="secondary"
                    label=".:Seleccione una Caracterizaci??n:."
                    id="characterization"
                    {...register("entity.IDBusinessClass", {
                      required: true
                    })}
                    onChange={(e) => changeCharac(e.target.value)}
                  >
                    {characterizations.map((item: any) => (
                      <MenuItem value={item.IDBusinessClass}>
                        {item.Name}
                      </MenuItem>
                    ))}
                  </TextField>
                  <span className="text-danger">
                    {errors.entity
                      ? errors.entity.IDBusinessClass?.type === "required" &&
                      "El campo Caraterizaci??n es obligatorio."
                      : ""}
                  </span>
                </Col>
                <Col sm={4}>
                  <Autocomplete
                    fullWidth
                    size="small"
                    disablePortal
                    id="combo-box-demo"
                    options={businesses}
                    {...register("entity.IDBusinessProcess", {
                      required: true,
                    })}
                    onChange={(e, value) => onChangeSelect_Process(value)}
                    renderInput={(params) => <TextField {...params} label=".:Tr??mite:." fullWidth color="secondary" />}
                  />
                  <span className="text-danger">
                    {errors.entity
                      ? errors.entity.IDBusinessProcess?.type === "required" &&
                      "El campo Tr??mite es obligatorio."
                      : ""}
                  </span>
                </Col>
                <Col sm={4}>
                  <TextField
                    size="small"
                    value={user}
                    label=".:Usuario:. *"
                    fullWidth
                    color="secondary"
                    id="distributionChanel"
                    {...register("entity.EntityName", { required: true })}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={() => openUser()}>
                            <BsSearch />
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                    onClick={() => openUser()}
                  />
                  <span className="text-danger">
                    {errors.entity
                      ? errors.entity.EntityName?.type === "required" &&
                      "El campo Usuario es obligatorio."
                      : ""}
                  </span>
                </Col>
              </Row>
              <Row className="mt-3">
                <Col sm={4}>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      disableFuture
                      label="Fecha Inicial: "
                      value={dateInit}
                      onChange={(e) => {
                        setDateInit(e)
                        e !== null ? setDateInitError(false) : setDateInitError(true);
                      }}
                      renderInput={(props) => <TextField size="small" fullWidth color="secondary" {...props} />}
                    />
                  </LocalizationProvider>
                  <span className="mt-2 text-danger">
                    {(dateInitError)
                      ? "El campo Fecha Inicial es obligatorio"
                      : ""}
                  </span>
                </Col>
                <Col sm={4}>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      disableFuture
                      label="Fecha Final: "
                      value={dateEnd}
                      onChange={(e) => {
                        setDateEnd(e);
                        e !== null ? setDateEndError(false) : setDateEndError(true);
                      }}
                      renderInput={(props) => <TextField size="small" fullWidth color="secondary" {...props} />}
                    />
                  </LocalizationProvider>
                  <span className="mt-2 text-danger">
                    {(dateEndError)
                      ? "El campo Fecha Final es obligatorio"
                      : ""}
                  </span>
                </Col>
                <Col sm={4}>
                  <TextField
                    size="small"
                    select
                    fullWidth
                    color="secondary"
                    label=".:Estado:."
                    id="state"
                    {...register("entity.Property", {
                      required: true,
                    })}
                  >
                    {listState.map((item: any) => (
                      <MenuItem value={item.DataBeanProperties.Property}>
                        {item.DataBeanProperties.Value}
                      </MenuItem>
                    ))}
                  </TextField>
                  <span className="text-danger">
                    {errors.entity
                      ? errors.entity.Property?.type === "required" &&
                      "El campo Estado es obligatorio."
                      : ""}
                  </span>
                </Col>
              </Row>
              <Row className="mt-5 mb-5 d-felx justify-content-center">
                <Col sm={9}>
                  <ThemeProvider theme={inputsTheme}>
                    <Button type="submit" variant="contained" className="w-100" color="secondary"
                      onClick={
                        () => {
                          dateInitError ? setDateInitError(false) : setDateInitError(true);
                          dateEndError ? setDateEndError(false) : setDateEndError(true);
                        }
                      }
                    >
                      BUSCAR
                    </Button>
                  </ThemeProvider>
                </Col>
              </Row>
            </form>
            <SSearchPerson
              getShow={closeSearch}
              getPerson={getItem}
              dataShow={show}
            />
          </div>
        );
      case 1: return <div>
        <Button
          className="btn btn-secondary"
          disabled={activeStep === 0}
          onClick={() => handleBack()}
        >
          Atr??s
        </Button>
        <div className="px-5 mt-2">
          <Row className="mt-3">
            <Col sm={12} className="mt-3">
              <Paper sx={{ width: "100%", overflow: "hidden" }}>
                <TableContainer sx={{ height: "70vh" }}>
                  <Table stickyHeader aria-label="sticky table" className={classes.root}>
                    <TableHead>
                      <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell>Solicitante</TableCell>
                        <TableCell>Descripci??n del tramite</TableCell>
                        <TableCell>Procedimiento</TableCell>
                        <TableCell>Redicado</TableCell>
                        <TableCell>Fecha</TableCell>
                        <TableCell>Estado</TableCell>
                        <TableCell>Acciones</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {list
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((item: any, index: number) => (
                          <TableRow hover role="checkbox" tabIndex={-1}>
                            <TableCell>{item.DataBeanProperties.IDProcedureImp}</TableCell>
                            <TableCell>{item.DataBeanProperties.AccountName}</TableCell>
                            <TableCell>{item.DataBeanProperties.Description}</TableCell>
                            <TableCell>{item.DataBeanProperties.ProcedureName}</TableCell>
                            <TableCell>{item.DataBeanProperties.TicketCode}</TableCell>
                            <TableCell>{item.DataBeanProperties.Since}</TableCell>
                            <TableCell>{item.DataBeanProperties.StateName}</TableCell>
                            <TableCell>
                              <div className="d-lg-flex d-none">
                                <ButtonGroup>
                                  <ThemeProvider theme={inputsTheme}>
                                    <Tooltip title="Generar siguiente etapa">
                                      <Button
                                        variant="contained"
                                        className="box-s mr-1 mt-2 mb-2"
                                        color="secondary"
                                        onClick={() => {
                                          //Aqui va un metodo aun no realizado
                                        }}
                                      >
                                        <BsBoxArrowRight />
                                      </Button>
                                    </Tooltip>
                                  </ThemeProvider>
                                  <ThemeProvider theme={inputsTheme}>
                                    <Tooltip title="Consultar actividades pendientes">
                                      <Button
                                        variant="contained"
                                        className="box-s mr-1 mt-2 mb-2"
                                        color="secondary"
                                        onClick={() => {
                                          setShowPA(true);
                                          setId(item.DataBeanProperties.IDProcedureImp);
                                        }}>
                                        <BsMenuAppFill />
                                      </Button>
                                    </Tooltip>
                                  </ThemeProvider>
                                  <ThemeProvider theme={inputsTheme}>
                                    <Tooltip title="Historial gesti??n del proceso">
                                      <Button
                                        variant="contained"
                                        className="box-s mr-1 mt-2 mb-2"
                                        color="secondary"
                                        onClick={() => {
                                          setShowPMR(true);
                                          setId(item.DataBeanProperties.IDProcedureImp);
                                          setId(item.DataBeanProperties.IDProcedureImp)
                                        }}>
                                        <BsDiagram3 />
                                      </Button>
                                    </Tooltip>
                                  </ThemeProvider>
                                  <ThemeProvider theme={inputsTheme}>
                                    <Tooltip title="Historial etapas del proceso">
                                      <Button
                                        variant="contained"
                                        className="box-s mr-1 mt-2 mb-2"
                                        color="secondary"
                                        onClick={() => {
                                          setShowPSR(true);
                                          setId(item.DataBeanProperties.IDProcedureImp);
                                        }}>
                                        <BsBoundingBox />
                                      </Button>
                                    </Tooltip>
                                  </ThemeProvider>
                                  <ThemeProvider theme={inputsTheme}>
                                    <Tooltip title="Eliminar elemento">
                                      <Button
                                        variant="contained"
                                        className="box-s mr-1 mt-2 mb-2"
                                        color="error"
                                        onClick={() => {
                                          //Aqui va el metodo de eliminar pero no se ha hecho
                                        }}>
                                        <BsTrash />
                                      </Button>
                                    </Tooltip>
                                  </ThemeProvider>
                                </ButtonGroup>
                              </div>
                              <div className="d-block d-lg-none">
                                <SpeedDial
                                  ariaLabel="SpeedDial basic example"
                                  direction="left"
                                  FabProps={{ size: "small", style: { backgroundColor: "#0d6efd" } }}
                                  icon={<FiMoreVertical />}
                                >
                                  <SpeedDialAction
                                    key={index + 1}
                                    icon={<BsTrash />}
                                    tooltipTitle="Eliminar"
                                  /* onClick={() => {
                                  setShowDelete(true);
                                  setIdDelete(
                                    item.DataBeanProperties.IDBusinessClass
                                  );
                                }} */
                                  />
                                  < SpeedDialAction
                                    key={index + 2}
                                    icon={<BsBoundingBox />}
                                    tooltipTitle="Historial etapas del proceso"
                                    onClick={() => {
                                      setShowPSR(true);
                                      setId(item.DataBeanProperties.IDProcedureImp);
                                    }}
                                  />
                                  <SpeedDialAction
                                    key={index + 3}
                                    icon={<BsDiagram3 />}
                                    tooltipTitle="Historial gesti??n del proceso"
                                    onClick={() => {
                                      setShowPMR(true);
                                      setId(item.DataBeanProperties.IDProcedureImp);
                                      setId(item.DataBeanProperties.IDProcedureImp)
                                    }}
                                  />
                                  <SpeedDialAction
                                    key={index + 4}
                                    icon={<BsMenuAppFill />}
                                    tooltipTitle="Consultar actividades pendientes"
                                    onClick={() => {
                                      setShowPA(true);
                                      setId(item.DataBeanProperties.IDProcedureImp);
                                    }}
                                  />
                                  <SpeedDialAction
                                    key={index + 5}
                                    icon={<BsBoxArrowRight />}
                                    tooltipTitle="Generar siguiente etapa"
                                  /* onClick={() => {
                                    setShowPA(true);
                                  }} */
                                  />
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
                  labelRowsPerPage="Columnas por P??gina"
                  component="div"
                  count={list.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </Paper>
            </Col >
          </Row >
        </div >
      </div >
    }
  };

  return (
    <div className="nWhite p-3 m-3 w-80">
      <Box sx={{ width: "100%" }}>
        <Stepper activeStep={activeStep} className={classes.root}>
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
      {showSpinner &&
        <div className="spinner d-flex justify-content-center">
          <SpinnerDotted size={70} thickness={139} speed={100} color="#0d6efd" />
        </div>
      }
      {showPSR && <TProcessStageRecord
        dataShow={showPSR}
        setShow={setShowPSR}
        id={id}
      />}
      {showPMR && <TProcessManagement
        dataShow={showPMR}
        setShow={setShowPMR}
        id={id}
        type={1}
      />}
      {showPA && <TPendingActivities
        dataShow={showPA}
        setShow={setShowPA}
        id={id}
      />}
    </div>
  );
};

export default THistoryProcess;
