import { Button, ButtonGroup, Paper, SpeedDial, SpeedDialAction, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, ThemeProvider, Tooltip } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { BsPencilSquare, BsPlus, BsTrash } from 'react-icons/bs';
import { FiMoreVertical } from 'react-icons/fi';
import { useSelector } from 'react-redux';
import { WeaponsService } from '../../../core/services/WeaponsService';
import { SSpinner } from '../../../shared/components/SSpinner';
import { RootState } from '../../../store/Store';
import { GenericConfirmAction } from '../../../utils/GenericConfirmAction';
import { NoInfo } from '../../../utils/NoInfo';
import { inputsTheme, useStyles } from '../../../utils/Themes';
import { Toast } from '../../../utils/Toastify';
import { NEWeapons } from '../components/NEWeapons';
import { Iweapon } from '../model/modelWeapon';

interface ITWeapon {

}

const _weaponService = new WeaponsService();

export const TWeapon: React.FC<ITWeapon> = (props: ITWeapon) => {

  const [showSpinner, setShowSpinner] = useState(false);
  const [statusModalForm, setStatusModalForm] = useState(false);
  const [titleNE, setTitleNE] = useState("")
  const [listWeapons, setListWeapons] = useState<Iweapon[]>([]);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const { items } = useSelector((state: RootState) => state.itemsperpage);
  const [showNE, setShowNE] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [idDelete, setIdDelete] = useState(0);
  const [itemSelected, setItemSelected] = useState<Iweapon | null>(null);


  useEffect(() => {
    setRowsPerPage(parseInt(items));;
    getAllWeapons();
  }, [items])

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };


  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const getAllWeapons = () => {
    setShowSpinner(true);
    _weaponService.getTraumaticaCatalogPorPropiedad().subscribe((resp) => {
      if (resp) {
        console.log(resp);
        setShowSpinner(false);
        setListWeapons(resp);
      } else {
        Toast.fire({
          icon: "error",
          title: "No se ha cargado la información",
        });
      }
    });
  }

  const deleteTraumatica = () => {
    _weaponService
      .deleteTraumatica(idDelete)
      .subscribe(rps => {
        console.log(rps);
        if (rps) {
          setShowSpinner(false);
          getAllWeapons();
          Toast.fire({
            icon: "success",
            title: "Se ha eliminado con éxito!",
          });
        } else {
          Toast.fire({
            icon: "error",
            title: "No se ha cargado la información",
          });
        }
      })
  };

  const formComponent = (title: string, data?: Iweapon) => {
    setTitleNE(title);
    if (title === "Editar") {
      setItemSelected(data
        ? data
        : null)
    }
    setShowNE(true);
  };

  const deleteElement = (data: boolean) => {
    if (data) {
      deleteTraumatica();
    }
  };


  const classes = useStyles();

  return (
    <div className="nWhite w-80 p-3 m-3">
      <main>
        <header className="page-header page-header-light bg-light mb-0">
          <div className="container-fluid">
            <div className="page-header-content pt-4 pb-10">
              <div className="row align-items-center justify-content-between">
                <div className="col-auto mt-4">
                  <h1 >
                    Registro de Armas
                  </h1>
                </div>
              </div>
            </div>
          </div>
        </header>
        <div className="row">
          <div className="col-xxl-4 col-12 col-xxl-12">
            <div className="row justify-content-end">
              <div className="col-md-6 d-flex justify-content-end mr-5">
                <div className="form-group">
                  <button
                    className="btn btn-sm btn-outline-secondary btn-custom"
                    type="button"
                    onClick={() => {
                      formComponent("Crear");
                    }}
                  >
                    <BsPlus />
                  </button>
                </div>
              </div>
            </div>
          </div>
          {showSpinner ? <SSpinner show={showSpinner} /> : listWeapons.length > 0 ?
            (
              <Paper sx={{ width: "100%", overflow: "hidden" }}>
                <TableContainer sx={{ height: "70vh" }}>
                  <Table stickyHeader aria-label="sticky table" className={classes.root}>
                    <TableHead>
                      <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell>Marca</TableCell>
                        <TableCell>Fecha de Compra</TableCell>
                        <TableCell>Manifiesto DIAN</TableCell>
                        <TableCell>Acciones</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {listWeapons
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((item: Iweapon, index: number) => (
                          <TableRow hover role="checkbox" tabIndex={-1}>
                            <TableCell>{item.IDTraumatica}</TableCell>
                            <TableCell>{item.Marca}</TableCell>
                            <TableCell>{item.FechaFacCompra}</TableCell>
                            <TableCell>{item.ManifiestoDian}</TableCell>
                            <TableCell>
                              <div className="d-lg-flex d-none">
                                <ButtonGroup      >
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
                                          setIdDelete(item.IDTraumatica ? item.IDTraumatica : -1);
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
                                    icon={<BsPencilSquare />}
                                    tooltipTitle="Editar grupo"
                                    onClick={() => {
                                      formComponent("Editar", item);
                                    }}
                                  />
                                  <SpeedDialAction
                                    key={index + 1}
                                    icon={<BsTrash />}
                                    tooltipTitle="Eliminar"
                                    onClick={() => {
                                      setShowDelete(true);
                                      setIdDelete(item.IDTraumatica ? item.IDTraumatica : -1);
                                    }}
                                  />
                                </SpeedDial>
                              </div>
                            </TableCell>
                          </TableRow>))}
                    </TableBody>
                  </Table>
                </TableContainer>
                <TablePagination
                  className={classes.root}
                  rowsPerPageOptions={[items, 10, 25, 100]}
                  labelRowsPerPage="Columnas por Página"
                  component="div"
                  count={listWeapons.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </Paper>
            )
            : (listWeapons.length === 0 ? <NoInfo></NoInfo> : "")}
          <div>
            {showNE &&
              <NEWeapons dataObj={itemSelected} refresh={getAllWeapons} show={showNE} title={titleNE} setShow={setShowNE} />
            }
            {showDelete && <GenericConfirmAction
              show={showDelete}
              setShow={setShowDelete}
              confirmAction={deleteElement}
              title={"¿Está seguro de eliminar el elemento?"}
            />}
          </div>
        </div>
      </main >
    </div >
  )
}

