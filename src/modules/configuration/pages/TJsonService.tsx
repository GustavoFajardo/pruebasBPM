import React, { useEffect, useState } from "react";
import { BsFillBookmarkFill, BsFillFileEarmarkRichtextFill, BsPencilSquare, BsPlus, BsTrash } from "react-icons/bs";
import { Button, ButtonGroup, IconButton, MenuItem, SpeedDial, SpeedDialAction, ThemeProvider, Tooltip } from "@mui/material";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
} from "@mui/material";
import { SpinnerDotted } from "spinners-react";


import { inputsTheme, useStyles } from "../../../utils/Themes";
import { AdminService } from "../../../core/services/AdminService";
import { Toast } from "../../../utils/Toastify";
import { FiMoreVertical } from "react-icons/fi";
import { GenericConfirmAction } from "../../../utils/GenericConfirmAction";
import { TextField } from "@mui/material";
import { JsonService } from "../model/JsonService";
import { JsonServiceClass } from "../model/JsonServiceClass";
import NEJsonService from "../components/NEJsonService";
import { NoInfo } from "../../../utils/NoInfo";
import TResponseValueJson from "./TResponseValueJson";
import { JsonPrototypeDialog } from "../components/JsonPrototypeDialog";
import { SSpinner } from "../../../shared/components/SSpinner";
import { useSelector } from "react-redux";
import { RootState } from "../../../store/Store";

const _adminService = new AdminService();

interface ITJsonService { }

const TJsonService: React.FC<ITJsonService> = () => {

  const [title, setTitle] = useState("");
  const [show, setShow] = useState(false);
  const [formdata, setformdata] = useState<JsonService>();
  const [showSpinner, setShowSpinner] = useState(true);
  const [list, setList] = useState<JsonService[]>([]);
  const [listJsSerCla, setListJsSerCla] = useState<JsonServiceClass[]>([]);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const [showDelete, setShowDelete] = useState(false);
  const [idServiceJson, setIdServiceJson] = useState<number>(0);
  const [selector, setSelector] = useState(-1);
  const [showResponseValue, setShowResponseValue] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [responseJsonSelected, setResponseJsonSelected] = useState("");
  const { items } = useSelector((state: RootState) => state.itemsperpage);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const formComponent = (title: string, data?: any) => {
    setTitle(title);
    if (title === "Editar") {
      setformdata(data);
    }
    viewModal();
  };

  useEffect(() => {
    setRowsPerPage(parseInt(items));;
    getJsonServiceClassCatalog();
  }, [items]);

  const getJsonServiceCatalog = (id: number) => {
    setShowSpinner(true);
    _adminService.getJsonServiceCatalog(id).subscribe((resp) => {
      console.log(resp);
      if (resp) {
        setList(resp);
        setShowSpinner(false);
      } else {
        Toast.fire({
          icon: "error",
          title: "No se ha cargado la informaci??n",
        });
      }
    });
  };

  const getJsonServiceClassCatalog = () => {
    setShowSpinner(true);
    _adminService.getJsonServiceClassCatalog().subscribe(resp => {
      console.log(resp);
      if (resp) {
        setListJsSerCla(resp);
        setShowSpinner(false);
      } else {
        Toast.fire({
          icon: "error",
          title: "No se ha cargado la informaci??n",
        });
      }
    });
  };

  const deleteJsonService = () => {
    _adminService
      .deleteJsonService(idServiceJson)
      .subscribe(rps => {
        console.log(rps);
        if (rps) {
          setShowSpinner(false);
          getJsonServiceCatalog(selector);
          Toast.fire({
            icon: "success",
            title: "Se ha eliminado con ??xito!",
          });
        } else {
          Toast.fire({
            icon: "error",
            title: "No se ha cargado la informaci??n",
          });
        }
      })
  };

  const viewModal = () => {
    setShow(true);
  };

  const closeModal = (data: boolean) => {
    setShow(data);
    getJsonServiceCatalog(selector);
  };

  const deleteElement = (data: boolean) => {
    if (data) {
      deleteJsonService();
    }
  };

  const handleShowJson = (json: string) => {
    setResponseJsonSelected(json);
    setShowDialog(true);
  }

  const classes = useStyles();

  const onChangeComponent = (e: any) => {
    console.log(e);
    setSelector(e);
    getJsonServiceCatalog(e);
  };
  const openResponseValue = (data: any) => {
    setIdServiceJson(data);
    statusModal(true);
  }
  const statusModal = (data: boolean) => {
    setShowResponseValue(data);
  }

  return (
    <>
      <div className="nWhite w-80 p-3 m-3">
        <main>
          <header className="page-header page-header-light bg-light mb-0">
            <div className="container-fluid">
              <div className="page-header-content pt-4 pb-10">
                <div className="row align-items-center justify-content-between">
                  <div className="col-auto mt-4">
                    <h1 >
                      Servicios
                    </h1>
                  </div>
                </div>
              </div>
            </div>
          </header>
          <div className="px-5 mt-2">
            <div className="card box-s">
              <div className="col-md-6 mb-2">
                <TextField
                  margin="normal"
                  size="small"
                  select
                  fullWidth
                  label=".:Seleccione un tipo de servicio:."
                  id="state"
                  onChange={(e) =>
                    onChangeComponent(e.target.value)
                  }
                >
                  {listJsSerCla.map(item => (
                    <MenuItem value={item.IDJsonServiceClass}>
                      {item.Name}
                    </MenuItem>
                  ))}
                </TextField>
              </div>
            </div>
            <div className="row d-flex justify-content-center">
              <div className="col-xxl-4 col-12 col-xxl-12">
                <div className="row justify-content-end">
                  <div className="col-md-6 d-flex justify-content-end mr-5">
                    <div className="form-group">
                      {(selector !== -1) && <button
                        className="btn btn-sm btn-outline-secondary btn-custom"
                        type="button"
                        onClick={() => {
                          formComponent("Crear");
                        }}
                      >
                        <BsPlus />
                      </button>}
                    </div>
                  </div>
                </div>
              </div>
              {showSpinner ?
                <SSpinner show={showSpinner} />
                : (list.length > 0) ?
                  (<Paper sx={{ width: "100%", overflow: "hidden" }}>
                    <TableContainer sx={{ height: "70vh" }}>
                      <Table
                        stickyHeader
                        aria-label="sticky table"
                        className={classes.root}
                      >
                        <TableHead>
                          <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Nombre</TableCell>
                            <TableCell>Descripci??n</TableCell>
                            <TableCell>Url del Servicio </TableCell>
                            <TableCell>Prototipo Json</TableCell>
                            <TableCell>Acciones</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {list
                            .slice(
                              page * rowsPerPage,
                              page * rowsPerPage + rowsPerPage
                            )
                            .map((item: JsonService, index: number) => (
                              <TableRow hover role="checkbox" tabIndex={-1}>
                                <TableCell>{item.IDJsonService}</TableCell>
                                <TableCell>{item.Name}</TableCell>
                                <TableCell>{item.Description}</TableCell>
                                <TableCell>{item.URLService}</TableCell>
                                <TableCell>
                                  <IconButton
                                    onClick={() => (handleShowJson(item.ResponseJsonValue), setIdServiceJson(item.IDJsonService))}
                                  ><BsFillFileEarmarkRichtextFill />
                                  </IconButton>
                                </TableCell>
                                <TableCell>
                                  <div className="d-lg-flex d-none">
                                    <ButtonGroup>
                                      <ThemeProvider theme={inputsTheme}>
                                        <Tooltip title="Variables de respuesta">
                                          <Button
                                            variant="contained"
                                            className="box-s mr-1 mt-2 mb-2"
                                            color="secondary"
                                            onClick={() => {
                                              openResponseValue(item.IDJsonService);
                                            }}>
                                            <BsFillBookmarkFill />
                                          </Button>
                                        </Tooltip>
                                      </ThemeProvider>
                                      <ThemeProvider theme={inputsTheme}>
                                        <Tooltip title="Editar elemento">
                                          <Button
                                            variant="contained"
                                            className="box-s mr-1 mt-2 mb-2"
                                            color="secondary"
                                            onClick={() => {
                                              formComponent("Editar", item);
                                            }}>
                                            <BsPencilSquare />
                                          </Button>
                                        </Tooltip>
                                      </ThemeProvider>
                                      <ThemeProvider theme={inputsTheme}>
                                        <Tooltip title="Eliminar elemento">
                                          <Button
                                            variant="contained"
                                            className="box-s mr-3 mt-2 mb-2"
                                            color="error"
                                            onClick={() => {
                                              setShowDelete(true);
                                              setIdServiceJson(item.IDJsonService);
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
                                      FabProps={{
                                        size: "small",
                                        style: { backgroundColor: "#0d6efd" },
                                      }}
                                      icon={<FiMoreVertical />}
                                    >
                                      <SpeedDialAction
                                        key={index}
                                        sx={{ color: "secondary" }}
                                        icon={<BsFillBookmarkFill />}
                                        tooltipTitle="Variables de respuesta"
                                        onClick={() => {
                                          openResponseValue(item.IDJsonService);
                                        }}
                                      />
                                      <SpeedDialAction
                                        key={index}
                                        sx={{ color: "secondary" }}
                                        icon={<BsPencilSquare />}
                                        tooltipTitle="Editar elemento"
                                        onClick={() => {
                                          formComponent("Editar", item);
                                        }}
                                      />
                                      <SpeedDialAction
                                        key={index + 1}
                                        icon={<BsTrash />}
                                        tooltipTitle="Eliminar elemento"
                                        onClick={() => {
                                          setShowDelete(true);
                                          setIdServiceJson(item.IDJsonService);
                                        }}
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
                  </Paper>) : (list.length === 0 && selector !== -1)
                    ? <NoInfo />
                    : ""
              }
              {showResponseValue && (
                <TResponseValueJson
                  getShow={statusModal}
                  dataShow={showResponseValue}
                  IDJsonService={idServiceJson}
                  titulo={title}
                  selector={selector}
                  refresh={getJsonServiceCatalog}
                />
              )}
              {show && (
                <NEJsonService
                  getShow={closeModal}
                  dataShow={show}
                  dataObj={formdata}
                  dataTitle={title}
                  dataType={selector}
                />
              )}
              {showDelete && (
                <GenericConfirmAction
                  show={showDelete}
                  setShow={setShowDelete}
                  confirmAction={deleteElement}
                  title={"??Est?? seguro de eliminar el elemento?"}
                />
              )}
              {showDialog &&
                <JsonPrototypeDialog
                  showDialog={showDialog}
                  setShowDialog={setShowDialog}
                  responseJsonSelected={responseJsonSelected}
                  setResponseJsonSelected={setResponseJsonSelected}
                  IDJsonService={idServiceJson}
                  IDForm={null}
                />}
              {showSpinner && (
                <div className="spinner d-flex justify-content-center">
                  <SpinnerDotted
                    size={70}
                    thickness={139}
                    speed={100}
                    color="#0d6efd"
                  />
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default TJsonService;

