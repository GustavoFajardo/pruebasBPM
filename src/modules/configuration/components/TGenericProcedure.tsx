import React from "react";
import { ConfigService } from "../../../core/services/ConfigService";
import { useState, useEffect } from "react";
import { Modal, Row, Col } from "react-bootstrap";
import { BsXSquare, BsPlus, BsPencilSquare, BsTrash, BsFillFileEarmarkPersonFill, BsFillXCircleFill, BsFillCheckCircleFill } from "react-icons/bs";
import NEGenericProcedure from "./NEGenericProcedure";
import { FiMoreVertical } from "react-icons/fi";
import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import { Toast } from "../../../utils/Toastify";
import { GenericConfirmAction } from "../../../utils/GenericConfirmAction";
import { Paper, Table, TableBody, Button, TableCell, TableContainer, TableHead, TablePagination, TableRow, Tooltip, ThemeProvider, IconButton, CircularProgress } from "@mui/material";
import { inputsTheme, useStyles } from "../../../utils/Themes";
import { TDocumentCharacterization } from "./TDocumentCharacterization";
import { IBusinessCharacterization } from "../model/BusinessCharacterization";
import { SpinnerDotted } from "spinners-react";
import { useSelector } from "react-redux";
import { RootState } from "../../../store/Store";

const _configService = new ConfigService();

interface IGenericProcedure {
  getShowGeneric: Function;
  dataShowGeneric: boolean;
  dataIdGeneric: any;
  // dataInterface: any;
  dataId: number
}

const TGenericProcedure: React.FC<IGenericProcedure> = (
  props: IGenericProcedure
) => {
  const [listGeneric, setListGeneric] = useState([]);
  const [listCharacterization, setListCharacterization] = useState<IBusinessCharacterization[]>([]);
  const [showNE, setShowNE] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [title, setTitle] = useState("");
  const [titleNE, setTitleNE] = useState("");
  const [formNE, setformNE] = useState({});
  const [idDelete, setIdDelete] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const [idDocument, setIdDocument] = useState(-1);
  const [openDiag, setOpenDiag] = useState(false);
  const [showSpinner, setShowSpinner] = useState(false);
  const [typeDocument, setTypeDocument] = useState([]);
  const { items } = useSelector((state: RootState) => state.itemsperpage);
  const { permiso } = useSelector((state: RootState) => state.permiso);

  // const typeDocument = ["", "", "Documento / Anexo", "Formulario ", "Servicio"];

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  useEffect(() => {
    getProcedureDocumentList();
    setTitle("Documentos requeridos")

    getProcedureDocumentCatalog(
      props.dataIdGeneric
    );
    getBusinessCharacterizationCatalog(props.dataId);
    setRowsPerPage(parseInt(items));;

  }, [props.dataIdGeneric, items]);

  const getProcedureDocumentList = () => {
    _configService.getProcedureDocumentList().subscribe((res: any) => {
      if (res.DataBeanProperties.ObjectValue) {
        setTypeDocument(res.DataBeanProperties.ObjectValue)
      }
    })
  }

  const getProcedureDocumentCatalog = async (
    id: number
  ) => {
    setShowSpinner(true);
    await _configService
      .getProcedureDocumentCatalog(id)
      .then((resp: any) => {
        setShowSpinner(false);
        if (resp.data.DataBeanProperties.ObjectValue) {
          setListGeneric(resp.data.DataBeanProperties.ObjectValue);
        }
        else {
          Toast.fire({
            icon: "error",
            title: "No se ha podido cargar la informaci??n",
          });
        }

      })
      .catch((e) => {
        console.log(e);
      });
  };



  const deleteProcedureDocument = async (id: number) => {
    await _configService
      .deleteProcedureDocument(id)
      .then((resp: any) => {
        Toast.fire({
          icon: "success",
          title: "Se ha eliminado con ??xito!",
        });
        getProcedureDocumentCatalog(
          props.dataIdGeneric
        );
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const deleteElement = (data: boolean) => {
    if (data) {
      deleteProcedureDocument(idDelete);
    }
  };

  const getBusinessCharacterizationCatalog = (id: number) => {
    _configService
      .getBusinessCharacterizationCatalog(id)
      .subscribe(res => {
        if (res) {
          console.log(res);
          setListCharacterization(res);
        } else {
          Toast.fire({
            icon: "error",
            title: "No se ha cargado la informaci??n",
          });
        }
      })
  }

  // Modal T
  const closeModalGeneric = () => {
    props.getShowGeneric(false);
  };

  // Modal Ne
  const closeNE = () => {
    getProcedureDocumentCatalog(props.dataIdGeneric);
    setShowNE(false);
  };

  const formComponent = (title: string, item?: any) => {
    setTitleNE(title);
    if (title === "Editar") {
      setformNE(item.DataBeanProperties);
      setIdDocument(item.DataBeanProperties.IDDocument);
    }
    viewModalNE();
  };

  const getProcedureDocumentCatalogRefresh = () => {
    getProcedureDocumentCatalog(props.dataIdGeneric);

  }

  const viewModalNE = () => {
    setShowNE(true);
  };

  const classes = useStyles();

  return (
    <>
      <Modal
        show={props.dataShowGeneric}
        backdrop="static"
        size="xl"
        centered
        keyboard={false}
      >
        <Modal.Header>
          {title}
          <BsXSquare onClick={closeModalGeneric} />
        </Modal.Header>
        <Modal.Body>
          <Row className="p-4">
            <Col sm={12}>
              {!showSpinner &&
                <div className="d-flex">
                  <div className="ml-auto mb-2">
                    <ThemeProvider theme={inputsTheme}>
                      <Button
                        variant="contained"
                        color="secondary"
                        endIcon={<BsPlus />}
                        onClick={() => {
                          formComponent("Crear");
                        }}
                      >
                        CREAR
                      </Button>
                    </ThemeProvider>
                  </div>
                </div>}
              {
                showSpinner
                  ? <div className="mb-10">
                    <CircularProgress
                      size={50}
                      sx={{
                        color: '#0d6efd',
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        marginTop: '-12px',
                        marginLeft: '-12px',
                      }}
                    />
                  </div>
                  : listGeneric.length > 0
                    ? <Paper sx={{ width: "100%", overflow: "hidden" }}>
                      <TableContainer sx={{ height: "70vh" }}>
                        <Table stickyHeader aria-label="sticky table" className={classes.root}>
                          <TableHead>
                            <TableRow>
                              <TableCell>ID</TableCell>
                              <TableCell>Nombre</TableCell>
                              <TableCell>Descripci??n</TableCell>
                              <TableCell>Tipo de Acci??n</TableCell>
                              <TableCell>Tiempo de validez</TableCell>
                              <TableCell>Tiempo por defecto</TableCell>
                              <TableCell>Formulario</TableCell>
                              <TableCell>Caracterizaciones</TableCell>
                              <TableCell>??Aplicar todas las caracterizaciones?</TableCell>
                              <TableCell>Acciones</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {listGeneric
                              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                              .map((item: any, i: number) => (
                                <TableRow hover role="checkbox" tabIndex={-1}>
                                  <TableCell>{item.DataBeanProperties.IDDocument}</TableCell>
                                  <TableCell>{item.DataBeanProperties.Name}</TableCell>
                                  <TableCell>{item.DataBeanProperties.Description}</TableCell>
                                  <TableCell>{item.DataBeanProperties.DocumentTypeName}</TableCell>
                                  <TableCell>{item.DataBeanProperties.ValidityType}</TableCell>
                                  <TableCell>{item.DataBeanProperties.DefeatTime}</TableCell>
                                  <TableCell>{item.DataBeanProperties.FormName}</TableCell>
                                  <TableCell>
                                    {item.DataBeanProperties.CharacterizationListNames}
                                  </TableCell>
                                  <TableCell>
                                    {item.DataBeanProperties.ApplyForAllChar ===
                                      true ? (
                                      <ThemeProvider theme={inputsTheme}>
                                        <IconButton color="success">
                                          <BsFillCheckCircleFill />
                                        </IconButton>
                                      </ThemeProvider>
                                    ) : (
                                      <ThemeProvider theme={inputsTheme}>
                                        <IconButton color="error">
                                          <BsFillXCircleFill />
                                        </IconButton>
                                      </ThemeProvider>
                                    )}
                                  </TableCell>
                                  <TableCell>
                                    <SpeedDial
                                      ariaLabel="SpeedDial basic example"
                                      direction="left"
                                      FabProps={{ size: "small", style: { backgroundColor: "#0d6efd" } }}
                                      icon={<FiMoreVertical />}
                                    >
                                      <SpeedDialAction
                                        icon={<BsPencilSquare />}
                                        tooltipTitle="Editar grupo"
                                        onClick={() => {
                                          formComponent("Editar", item);
                                        }}
                                      />
                                      {permiso === 'true' &&

                                        <SpeedDialAction
                                          icon={<BsTrash />}
                                          tooltipTitle="Eliminar"
                                          onClick={() => {
                                            setIdDelete(
                                              item.DataBeanProperties.IDDocument
                                            );
                                            setShowDelete(true);
                                          }}
                                        />
                                      }<SpeedDialAction
                                        icon={<BsFillFileEarmarkPersonFill />}
                                        tooltipTitle="Ver/Asignar caracterizaciones"
                                        onClick={() => {
                                          setOpenDiag(true);
                                          setIdDocument(item.DataBeanProperties.IDDocument)
                                        }}
                                      />
                                      )
                                    </SpeedDial>
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
                        count={listGeneric.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                      />
                    </Paper>
                    : <h1>A??n no hay documentos o formularios asociados</h1>
              }
            </Col>
          </Row>
        </Modal.Body>
        {showNE && (
          <NEGenericProcedure
            getShowNE={closeNE}
            dataShowNE={showNE}
            dataObjNe={formNE}
            dataTitleNE={titleNE}
            dataTitlenNEGeneric={title}
            dataIDProcedure={props.dataIdGeneric}
            businessId={props.dataId}
            idDocument={idDocument}
            listTypesDocument={typeDocument}
          />
        )}
        {showDelete && <GenericConfirmAction
          show={showDelete}
          setShow={setShowDelete}
          confirmAction={deleteElement}
          title="??Est?? seguro de eliminar el elemento?"
        />}
        {openDiag &&
          <TDocumentCharacterization
            name={""}
            show={openDiag}
            setShow={setOpenDiag}
            dataTitle={titleNE}
            idProcedure={props.dataIdGeneric}
            idDocument={idDocument}

            listCharacterization={listCharacterization}
            refresh={getProcedureDocumentCatalogRefresh}

          />
        }
      </Modal>
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
    </>
  );
};

export default TGenericProcedure;
