import React, { useEffect, useState } from 'react'
import { Button, ButtonGroup, IconButton, InputAdornment, MenuItem, Paper, SpeedDial, SpeedDialAction, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField, ThemeProvider, Tooltip } from '@mui/material';
import { GiMachineGunMagazine } from "react-icons/gi";
import { Col } from 'react-bootstrap';
import { BsCheckCircleFill, BsFillCaretLeftFill, BsPencilSquare, BsPlus, BsSearch, BsTrash, BsXCircleFill } from 'react-icons/bs';
import { FiMoreVertical } from 'react-icons/fi';
import { useSelector } from 'react-redux';
import { WeaponsService } from '../../../core/services/WeaponsService';
import { SSpinner } from '../../../shared/components/SSpinner';
import { RootState } from '../../../store/Store';
import { GenericConfirmAction } from '../../../utils/GenericConfirmAction';
import { NoInfo } from '../../../utils/NoInfo';
import { pipeSort } from '../../../utils/pipeSort';
import { inputsTheme, useStyles } from '../../../utils/Themes';
import { Toast } from '../../../utils/Toastify';
import { NEProduct } from '../components/NEProduct';
import { IProduct } from '../model/product';
import { IProductKind } from '../model/ProductKind';
import { ITypeProduct } from '../model/typeProduct';
import { TProductCapacities } from '../components/TProductCapacities';


interface ITProduct { }

const _weaponService = new WeaponsService();

export const TProduct: React.FC<ITProduct> = (props: ITProduct) => {

    const [spinner, setSpinner] = useState(false);

    const [marca, setMarca] = useState('');

    const [listProducts, setListProducts] = useState<IProduct[]>([]);
    const [title, setTitle] = useState('');
    const [data, setData] = useState<IProduct | null>(null);
    const [show, setShow] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const [showCapacity, setShowCapacity] = useState(false);
    const [idDelete, setIdDelete] = useState(-1);
    const [productKind, setProductKind] = useState<number | null>(null);
    const [productType, setProductType] = useState<number | null>(null);
    const [listTypeProducts, setListTypeProducts] = useState<ITypeProduct[]>([]);
    const [listProductKind, setListProductKind] = useState<IProductKind[]>([]);

    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [page, setPage] = useState(0);
    const { items } = useSelector((state: RootState) => state.itemsperpage);

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };
    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    useEffect(() => {
        setRowsPerPage(parseInt(items));
        getAllTypes();
        getProductKindCatalog();
    }, [items])

    useEffect(() => {
        if (productKind === null && productType === null) { setListProducts([]) }
        else { handleFilter(); }

    }, [productKind, productType])

    const formComponent = (title: string, data: IProduct | null) => {
        setTitle(title);
        if (title === "Editar") {
            setData(data);
        } else {
            setData(null);
        }
        setShow(true);
    };

    const getAllTypes = () => {
        setSpinner(true);
        _weaponService.getTipoProducto().subscribe((resp) => {
            if (resp) {
                console.log(resp);
                setSpinner(false);
                setListTypeProducts(resp);
            } else {
                Toast.fire({
                    icon: "error",
                    title: "No se ha cargado la informaci??n",
                });
            }
        });
    };

    const getProductKindCatalog = () => {
        setSpinner(true);
        _weaponService.getClaseProductoCatalogLike().subscribe((resp) => {
            if (resp) {
                console.log(resp);
                setSpinner(false);
                setListProductKind(resp);
            } else {
                Toast.fire({
                    icon: "error",
                    title: "No se ha cargado la informaci??n",
                });
            }
        });
    };

    const getProductoCatalog = () => {
        setSpinner(true);
        _weaponService.getProductoCatalog().subscribe((resp) => {
            setSpinner(false);
            console.log(resp);
            if (resp) {
                let aux = pipeSort([...resp], "Nombre");
                setListProducts(aux);
            } else {
                Toast.fire({
                    icon: "error",
                    title: "No se ha podido completar la acci??n",
                });
            }
        })
    };

    const getProductoCatalogPorPropiedades = (idClaseProducto: number | null, idTipoProducto: number | null, nombre: string, type: number) => {
        setSpinner(true);
        _weaponService.getProductoCatalogPorPropiedades(idClaseProducto, idTipoProducto, nombre, type).subscribe((resp) => {
            setSpinner(false);
            if (resp) {
                if (resp.length > 0) {
                    Toast.fire({
                        icon: "success",
                        title: "Se han encontrado coincidencias",
                    });
                    let aux = pipeSort([...resp], "Nombre");
                    setListProducts(aux);
                } else {
                    setListProducts([]);
                    Toast.fire({
                        icon: "error",
                        title: "No se han encontrado coincidencias",
                    });
                }
            } else {
                Toast.fire({
                    icon: "error",
                    title: "No se ha podido completar la acci??n",
                });
            }
        })
    };

    const handleFilter = () => {
        getProductoCatalogPorPropiedades(productKind, productType, marca, 1);
    };

    const onSearch = (e: any) => {
        e.preventDefault();
        getProductoCatalogPorPropiedades(productKind, productType, marca, 2);
    };

    const deleteProduct = () => {
        _weaponService.deleteProducto(idDelete).subscribe((resp) => {
            if (resp) {
                getProductoCatalogPorPropiedades(productKind, productType, marca, 1);
                Toast.fire({
                    icon: "success",
                    title: "Se ha eliminado con ??xito",
                });
            } else {
                Toast.fire({
                    icon: "error",
                    title: "No se ha podido completar la acci??n",
                });
            }
        })
    };

    const deleteElement = (data: boolean) => {
        if (data) {
            deleteProduct();
        }
    };

    const classes = useStyles();

    return (
        <>
            <div className="d-flex nWhite w-80 p-3 m-3 flex-wrap justify-content-center p-2">
                <div className="row w-100">
                    <div className="col-xxl-4 col-12 col-xxl-12 mb-4">
                        <div className="pull-title-top">
                            <h1 className="m-3 mt-3">Productos</h1>
                        </div>
                        <div className="row card box-s">
                            <div className="col-md-12">
                                <div className="form-group">
                                    <div className="form-group">
                                        <div className="row">
                                            <Col sm={12}>
                                                <h6 className="m-3">FILTRAR POR:</h6>
                                            </Col>
                                            {/* <Col sm={2}>
                                                <ThemeProvider theme={inputsTheme}>
                                                    <Button
                                                        variant="contained"
                                                        color="secondary"
                                                        className="mt-3 mb-3 w-100"
                                                        onClick={() => { setProductKind(null); setProductType(null); getProductoCatalog(); }}
                                                    >
                                                        MOSTRAR TODOS
                                                    </Button>
                                                </ThemeProvider>
                                            </Col> */}
                                            <Col sm={4}>
                                                <TextField
                                                    className="mt-3"
                                                    value={productKind}
                                                    size="small"
                                                    fullWidth
                                                    select
                                                    color="secondary"
                                                    label="Clase Producto *"
                                                    id="state"
                                                    onChange={(e) => { setProductKind(parseInt(e.target.value)) }}
                                                >
                                                    {listProductKind.map((item: IProductKind) => (
                                                        <MenuItem key={item.IDClaseProducto} value={item.IDClaseProducto}>
                                                            {item.Nombre}
                                                        </MenuItem>
                                                    ))}
                                                </TextField>
                                            </Col>
                                            <Col sm={1}>
                                                <ThemeProvider theme={inputsTheme}>
                                                    <Tooltip title="Limpiar campo">
                                                        <IconButton
                                                            className="mt-3"
                                                            color="secondary"
                                                            onClick={() => setProductKind(null)}
                                                        >
                                                            <BsFillCaretLeftFill />
                                                        </IconButton>
                                                    </Tooltip>
                                                </ThemeProvider>
                                            </Col>
                                            <Col sm={4}>
                                                <TextField
                                                    className="mt-3"
                                                    value={productType}
                                                    size="small"
                                                    fullWidth
                                                    select
                                                    color="secondary"
                                                    label="Tipo Producto *"
                                                    id="state"
                                                    onChange={(e) => { setProductType(parseInt(e.target.value)) }}
                                                >
                                                    {listTypeProducts.map((item: ITypeProduct) => (
                                                        <MenuItem key={item.IDTipoProducto} value={item.IDTipoProducto}>
                                                            {item.Nombre}
                                                        </MenuItem>
                                                    ))}
                                                </TextField>
                                            </Col>
                                            <Col sm={1}>
                                                <ThemeProvider theme={inputsTheme}>
                                                    <Tooltip title="Limpiar campo">
                                                        <IconButton
                                                            className="mt-3"
                                                            color="secondary"
                                                            onClick={() => setProductType(null)}
                                                        >
                                                            <BsFillCaretLeftFill />
                                                        </IconButton>
                                                    </Tooltip>
                                                </ThemeProvider>
                                            </Col>
                                            <Col sm={2}>
                                                <form >
                                                    <TextField
                                                        value={marca}
                                                        size="small"
                                                        fullWidth
                                                        color="secondary"
                                                        margin="normal"
                                                        label="Buscar por Nombre"
                                                        id="write"
                                                        onChange={(e) => { setMarca(e.target.value) }}
                                                        InputProps={{
                                                            endAdornment: (
                                                                <InputAdornment position="end">
                                                                    <IconButton type="submit" onClick={(e) => onSearch(e)}>
                                                                        <BsSearch />
                                                                    </IconButton>
                                                                </InputAdornment>
                                                            )
                                                        }}
                                                    />
                                                </form>
                                            </Col>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {(productKind !== null && productType !== null) &&
                            <div className="row justify-content-end">
                                <div className="col-md-6 d-flex justify-content-end mr-5">
                                    <div className="form-group">
                                        <button
                                            className="btn btn-sm btn-outline-secondary btn-custom"
                                            type="button"
                                            onClick={() => {
                                                formComponent("Crear", null);
                                            }}
                                        >
                                            <BsPlus />
                                        </button>
                                    </div>
                                </div>
                            </div>}
                        {listProducts.length > 0 ?
                            <div className="mt-3">
                                <Paper sx={{ width: "100%", overflow: "hidden" }}>
                                    <TableContainer sx={{ height: "70vh" }}>
                                        <Table stickyHeader aria-label="sticky table" className={classes.root}>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>ID</TableCell>
                                                    <TableCell>Cod. SAP</TableCell>
                                                    <TableCell>Cod. DCCAE</TableCell>
                                                    <TableCell>Marca</TableCell>
                                                    <TableCell>Calibre</TableCell>
                                                    <TableCell>Capacidades</TableCell>
                                                    <TableCell>Tipo de uso</TableCell>
                                                    <TableCell>Descripci??n</TableCell>
                                                    <TableCell>??Requiere Serial?</TableCell>
                                                    <TableCell>??Requiere Lote?</TableCell>
                                                    <TableCell>Acciones</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {listProducts
                                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                                    .map((item: IProduct, index: number) => (
                                                        <TableRow hover role="checkbox" tabIndex={-1}>
                                                            <TableCell>{item.IDProducto}</TableCell>
                                                            <TableCell>{item.CodSAP}</TableCell>
                                                            <TableCell>{item.CodDCCAE}</TableCell>
                                                            <TableCell>{item.Nombre}</TableCell>
                                                            <TableCell>{item.Calibre}</TableCell>
                                                            <TableCell>
                                                                <ThemeProvider theme={inputsTheme}>
                                                                    <Tooltip title="Ver/asignar capacidades" placement="right">
                                                                        <IconButton color="secondary" onClick={() => {
                                                                            setData(item);
                                                                            setShowCapacity(true);
                                                                        }}>
                                                                            <GiMachineGunMagazine />
                                                                        </IconButton>
                                                                    </Tooltip>
                                                                </ThemeProvider>
                                                            </TableCell>
                                                            <TableCell>{item.Uso}</TableCell>
                                                            <TableCell>{item.Descripcion}</TableCell>
                                                            <TableCell>
                                                                {
                                                                    item.RequiereSerial
                                                                        ?
                                                                        <ThemeProvider theme={inputsTheme}>
                                                                            <IconButton color="success">
                                                                                <BsCheckCircleFill />
                                                                                <b className="ml-2">SI</b>
                                                                            </IconButton>
                                                                        </ThemeProvider>
                                                                        :
                                                                        <ThemeProvider theme={inputsTheme}>
                                                                            <IconButton color="error">
                                                                                <BsXCircleFill />
                                                                                <b className="ml-2">NO</b>
                                                                            </IconButton>
                                                                        </ThemeProvider>
                                                                }
                                                            </TableCell>
                                                            <TableCell>
                                                                {
                                                                    item.RequiereLote
                                                                        ?
                                                                        <ThemeProvider theme={inputsTheme}>
                                                                            <IconButton color="success">
                                                                                <BsCheckCircleFill />
                                                                                <b className="ml-2">SI</b>
                                                                            </IconButton>
                                                                        </ThemeProvider>
                                                                        :
                                                                        <ThemeProvider theme={inputsTheme}>
                                                                            <IconButton color="error">
                                                                                <BsXCircleFill />
                                                                                <b className="ml-2">NO</b>
                                                                            </IconButton>
                                                                        </ThemeProvider>
                                                                }
                                                            </TableCell>
                                                            <TableCell>
                                                                <div className="d-lg-flex d-none">
                                                                    <ButtonGroup>
                                                                        <ThemeProvider theme={inputsTheme}>
                                                                            <Tooltip title="Editar elemento">
                                                                                <Button
                                                                                    variant='contained'
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
                                                                                    className="box-s mr-1 mt-2 mb-2"
                                                                                    color="error"
                                                                                    onClick={() => {
                                                                                        setShowDelete(true);
                                                                                        setIdDelete(item.IDProducto)
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
                                                                            key={item.IDClaseProducto + 6}
                                                                            sx={{ color: "secondary" }}
                                                                            icon={<BsPencilSquare />}
                                                                            tooltipTitle="Editar"
                                                                            onClick={() => {
                                                                                formComponent("Editar", item);
                                                                            }}
                                                                        />
                                                                        <SpeedDialAction
                                                                            key={item.IDClaseProducto + 7}
                                                                            icon={<BsTrash />}
                                                                            tooltipTitle="Eliminar seccional"
                                                                            onClick={() => {
                                                                                setShowDelete(true);
                                                                                setIdDelete(item.IDProducto)
                                                                            }}
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
                                        labelRowsPerPage="Columnas por P??gina"
                                        component="div"
                                        count={listProducts.length}
                                        rowsPerPage={rowsPerPage}
                                        page={page}
                                        onPageChange={handleChangePage}
                                        onRowsPerPageChange={handleChangeRowsPerPage}
                                    />
                                </Paper>
                            </div>
                            : (listProducts.length === 0 && productKind !== null && productType !== null) &&
                            <div className="mt-15">
                                <NoInfo />
                            </div>
                        }
                    </div>
                </div>
            </div>
            <SSpinner show={spinner} />
            {show &&
                <NEProduct
                    show={show}
                    setShow={setShow}
                    data={data}
                    title={title}
                    productKind={productKind}
                    productType={productType}
                    refresh={getProductoCatalogPorPropiedades}
                />}
            {showDelete &&
                <GenericConfirmAction
                    show={showDelete}
                    setShow={setShowDelete}
                    confirmAction={deleteElement}
                    title={"??Est?? seguro de eliminar el elemento?"}
                />
            }
            {
                showCapacity &&
                <TProductCapacities show={showCapacity} setShow={setShowCapacity} data={data} />
            }
        </>
    )
}
