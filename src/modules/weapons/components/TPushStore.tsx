import { DatePicker, LocalizationProvider } from '@mui/lab'
import AdapterDateFns from '@mui/lab/AdapterDateFns'
import { Button, Checkbox, FormControlLabel, FormGroup, IconButton, InputAdornment, MenuItem, TextField, ThemeProvider, Tooltip } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { Col, Modal, Row } from 'react-bootstrap'
import { BsCheckCircleFill, BsFillDashCircleFill, BsPlus, BsSearch, BsX, BsXCircleFill, BsXSquare } from 'react-icons/bs'
import { FiMoreVertical } from 'react-icons/fi'
import { useSelector } from 'react-redux'
import { WeaponsService } from '../../../core/services/WeaponsService'
import SSearchPerson from '../../../shared/components/SSearchPerson'
import { SSpinner } from '../../../shared/components/SSpinner'
import { RootState } from '../../../store/Store'
import { pipeSort } from '../../../utils/pipeSort'
import { inputsTheme, useStyles } from '../../../utils/Themes'
import { Toast } from '../../../utils/Toastify'
import { IProduct } from '../model/product'

interface ITPushSotre {
    show: boolean,
    setShow: Function
    setList: Function
}

const _weaponService = new WeaponsService();

export const TPushStore: React.FC<ITPushSotre> = (props: ITPushSotre) => {


    const [spinner, setSpinner] = useState(false);
    const [showUser, setShowUser] = useState(false);
    const [serialRequired, setSerialRequiered] = useState(false);
    const [item, setItem] = useState<IProduct | null>(null);
    const [showValidation, setShowValidation] = useState(false);
    const [render, setRender] = useState(0);
    const [cases, setCases] = useState(0);
    const [serial, setSerial] = useState<string | null>(null);
    const [codeSAP, setCodeSAP] = useState<number | null>(null);
    const [codeDCCAE, setCodeDCCAE] = useState<number | null>(null);
    const [name, setName] = useState('');
    const [listProducts, setListProducts] = useState<IProduct[]>([]);
    const [siHay, setSiHay] = useState(false);
    const [productosDisponibles, setProductosDisponibles] = useState<any[]>([]);
    const [listProducts2, setListProducts2] = useState<IProduct[]>([]);
    const [dateRecord, setDateRecord] = useState<Date | null>(null);
    const [dates, setDates] = useState(false);
    const [dateFrom, setDateFrom] = useState<Date | null>(null);
    const [dateUpto, setDateUpto] = useState<Date | null>(null);
    const [idCitizen, setIdCitizen] = useState(0);
    const [idFuncionario, setIdFuncionario] = useState(0);
    const [nameCitizen, setNameCitizen] = useState('');

    /* const [rowsPerPage, setRowsPerPage] = useState(10);
    const [page, setPage] = useState(0);
    const { items } = useSelector((state: RootState) => state.itemsperpage); */

    /* const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };
    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    }; */

    useEffect(() => {
        setIdFuncionario(getSesion().IDAccount)
    }, [])

    useEffect(() => {

    }, [listProducts2])

    const getProductoCatalogPorCod = (cod: number | null, type: number) => {
        setSpinner(true);
        _weaponService.getProductoCatalogPorCod(cod, type).subscribe((resp) => {
            setSpinner(false);
            if (resp) {
                if (resp.length > 0) {
                    setSiHay(false);
                    Toast.fire({
                        icon: "success",
                        title: "Se encontraron coincidencias",
                    });
                    let aux = pipeSort([...resp], "Nombre");
                    setListProducts(aux);
                } else {
                    Toast.fire({
                        icon: "error",
                        title: "No se han encontrado coincidencias",
                    });
                }
            } else {
                Toast.fire({
                    icon: "error",
                    title: "No se ha podido completar la acción",
                });
            }
        })
    };

    const getProductoCatalogPorNombre = (nombre: string) => {
        setSpinner(true);
        _weaponService.getProductoCatalogPorNombre(nombre).subscribe((resp) => {
            setSpinner(false);
            console.log(resp);
            if (resp) {
                if (resp.length > 0) {
                    Toast.fire({
                        icon: "success",
                        title: "Se encontraron coincidencias",
                    });
                    let aux = pipeSort([...resp], "Nombre");
                    setListProducts(aux);
                } else {
                    Toast.fire({
                        icon: "error",
                        title: "No se han encontrado coincidencias",
                    });
                }
            } else {
                Toast.fire({
                    icon: "error",
                    title: "No se ha podido completar la acción",
                });
            }
        })
    };

    const validate = () => {
        setSpinner(true);
        _weaponService.getAvailableItems((item ? item.IDProducto : 0), dateFrom !== null ? (format(dateFrom) + " 00:00:00") : null, dateUpto !== null ? (format(dateUpto) + " 00:00:00") : null, serial)
            .subscribe((resp) => {
                setSpinner(false);
                if (resp.DataBeanProperties.ObjectValue.length > 0) {
                    /* if (resp.length > 0) { */

                    /* let auxProduct: any = item;
                    auxProduct.IDItem = resp.DataBeanProperties.ObjectValue[0].DataBeanProperties.IDItem;
                    auxProduct.FechaDocumento = resp.DataBeanProperties.ObjectValue[0].DataBeanProperties.FechaDocumento
                    onAdd2(auxProduct); */
                    console.log(resp.DataBeanProperties.ObjectValue);
                    setSiHay(true);
                    setProductosDisponibles(resp.DataBeanProperties.ObjectValue);
                    setSerial(null);
                    setDateFrom(null);
                    setDateUpto(null);
                    setShowValidation(false);
                    /* } else {
                        Toast.fire({
                            icon: "error",
                            title: "No existe inventario",
                        });
                    } */
                } else {
                    Toast.fire({
                        icon: "warning",
                        title: "No existen productos disponibles en el inventario",
                    });
                }
            })
    };

    const getSesion = () => {
        if (localStorage.getItem('usuario')) {
            return JSON.parse(localStorage.getItem('usuario') ?? "")
        }
    }

    const crearSalidaAlmacen = () => {
        setSpinner(true);
        _weaponService.crearSalidaAlmacen(format(dateRecord) + " 00:00:00", idCitizen, idFuncionario, listProducts2).subscribe((resp) => {
            setSpinner(false);            
            if (resp) {
                if (resp.DataBeanProperties.ObjectValue) {
                    setCases(2);
                    /* let auxProduct: any = item;
                    auxProduct.IDItem = resp.IDItem;
                    auxProduct.FechaDocumento = resp.FechaDocumento
                    onAdd2(auxProduct); */
                } else {
                    Toast.fire({
                        icon: "error",
                        title: "No existe inventario",
                    });
                }
            } else {
                Toast.fire({
                    icon: "error",
                    title: "No se ha podido completar la acción",
                });
            }
        })
    };

    const onSearch = () => {
        if (render === 0) {
            getProductoCatalogPorCod(codeSAP, 1);
        } else if (render === 1) {
            getProductoCatalogPorCod(codeDCCAE, 2);
        } else {
            getProductoCatalogPorNombre(name);
        }
    };

    const onSelect = (item: IProduct | null) => {
        setItem(item);
        setShowValidation(true);
    };

    const onAdd = (item: IProduct | null, elemento: any) => {
        let aux: IProduct[] = [...listProducts2];
        if (item) {
            let auxProduct: any = item;
            auxProduct.IDItem = elemento.IDItem;
            auxProduct.FechaDocumento = elemento.FechaDocumento
            auxProduct.FechaDocumentoSalida = elemento.FechaDocumentoSalida
            auxProduct.Serial = elemento.Serial

            aux.push(auxProduct);
            setListProducts2(aux);
            onMinus(elemento, 1);
            Toast.fire({
                icon: "success",
                title: "Producto añadido",
            });
        }
    };

    const onMinus = (item: any, type: number) => {
        if (type === 2) {
            let aux: IProduct[] = listProducts2;
            aux.splice(aux.indexOf(item), 1);
            setListProducts2([...aux]);
            console.log(aux);
        } else if (type === 1) {
            let aux: any[] = productosDisponibles;
            aux.splice(aux.indexOf(item), 1);
            setProductosDisponibles([...aux]);
        }

    };

    const onNext = () => {
        setCases(1);
    };

    const onBack = () => {
        setSiHay(false);
        setCases(0);
        setDateRecord(null);
        setNameCitizen('');
        setIdCitizen(0);
        setName('');
        setListProducts([]);
        setListProducts2([]);
    };

    const format = (date: Date | null) => {
        let dateFormated: string = "";
        if (date !== null) {
            if ((date.getMonth() + 1) < 10) {
                dateFormated = date.getFullYear() + "-0" + (date.getMonth() + 1) + "-" + date.getDate();
            } else {
                dateFormated = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
            }
        }
        return dateFormated;
    };

    const onValidate = () => {
        /* if (serialRequired && (serial === '' || serial === null)) {
            Toast.fire({
                icon: "warning",
                title: "Ingrese serial",
            });
        } else */ if (dates && (dateFrom === null || dateUpto === null)) {
            Toast.fire({
                icon: "warning",
                title: "Ingrese fechas",
            });
        } else {
            validate();
        }
    }

    const renderSwitch = () => {
        switch (cases) {
            case 0:
                return (
                    <div className="container d-flex justify-content-center">
                        <form>
                            <Row className="card box-s m-3 d-block">
                                <Col sm={12} className="mt-5 mb-5 mr-5 ml-5">
                                    <h1>..::REGISTRAR SALIDA ALMACÉN::..</h1>
                                </Col>
                                <Col sm={12}>
                                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                                        <DatePicker
                                            label="Fecha de registro: "
                                            value={dateRecord}
                                            onChange={(e) => {
                                                setDateRecord(e);
                                            }}
                                            renderInput={(props) => <TextField size="small" fullWidth color="secondary" {...props} />}
                                        />
                                    </LocalizationProvider>
                                </Col>
                                <Col sm={12} className="mt-5 mb-3">
                                    <TextField
                                        size="small"
                                        value={nameCitizen}
                                        label=".:Usuario:. *"
                                        fullWidth
                                        color="secondary"
                                        id="distributionChanel"
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton onClick={() => setShowUser(true)}>
                                                        <BsSearch />
                                                    </IconButton>
                                                </InputAdornment>
                                            )
                                        }}
                                        onClick={() => setShowUser(true)}
                                    />
                                </Col>
                                <Col sm={6} className="mb-3 ml-12 d-flex justify-content-center">
                                    <ThemeProvider theme={inputsTheme}>
                                        <Button className=" mt-3 w-100" variant="contained" color="secondary" onClick={(e) => { onNext() }}>
                                            SIGUIENTE
                                        </Button>
                                    </ThemeProvider>
                                </Col>
                            </Row>
                        </form>
                    </div>
                );

            case 1:
                return (
                    <Modal show={cases === 1} /* backdrop="static" */ size="xl" centered keyboard={false}>
                        <Modal.Header>
                            Registrar salida de almacén para:  <b>{nameCitizen}</b>
                            <BsXSquare onClick={() => onBack()} />
                        </Modal.Header>
                        <Modal.Body>
                            <div className="row w-100">
                                <div className="col-xxl-4 col-12 col-xxl-12 mb-4">
                                    <div className="pull-title-top">
                                        <h1 className="m-3 mt-3">Por favor busque y seleccione los productos que desea descargar</h1>
                                    </div>
                                    <div className="row card box-s ml-3">
                                        <div className="col-md-12">
                                            <div className="form-group">
                                                <div className="form-group">
                                                    <div className="row">
                                                        <Col sm={6} className="d-flex justify-content-start align-items-center">
                                                            <h4>Buscar producto por:</h4>
                                                        </Col>
                                                        <Col sm={6} className="d-flex justify-content-end">
                                                            <ThemeProvider theme={inputsTheme}>
                                                                <Button
                                                                    variant="contained"
                                                                    color="secondary"
                                                                    className="mt-3 mb-3"
                                                                    onClick={() => { onSearch() }}
                                                                >
                                                                    BUSCAR
                                                                </Button>
                                                            </ThemeProvider>
                                                        </Col>
                                                        <Col sm={4}>
                                                            <TextField
                                                                className="mt-1"
                                                                value={render}
                                                                size="small"
                                                                fullWidth
                                                                select
                                                                color="secondary"
                                                                label="Clase Producto *"
                                                                id="state"
                                                                onChange={(e) => { setRender(parseInt(e.target.value)); setListProducts([]); }}
                                                            >
                                                                <MenuItem key={render} value={0}>
                                                                    CÓDIGO SAP
                                                                </MenuItem>
                                                                <MenuItem key={render} value={1}>
                                                                    CÓDIGO DCCAE
                                                                </MenuItem>
                                                                <MenuItem key={render} value={2}>
                                                                    NOMBRE
                                                                </MenuItem>
                                                            </TextField>
                                                        </Col>
                                                        {render === 0 &&
                                                            <Col sm={4}>
                                                                <TextField
                                                                    className="mt-1"
                                                                    value={codeSAP}
                                                                    size="small"
                                                                    fullWidth
                                                                    color="secondary"
                                                                    label="Código SAP"
                                                                    id="state"
                                                                    onChange={(e) => {
                                                                        setCodeSAP(parseInt(e.target.value));
                                                                    }}
                                                                >
                                                                </TextField>
                                                            </Col>
                                                        }
                                                        {render === 1 &&
                                                            <Col sm={4}>
                                                                <form >
                                                                    <TextField
                                                                        className="mt-1"
                                                                        value={codeDCCAE}
                                                                        size="small"
                                                                        fullWidth
                                                                        color="secondary"
                                                                        margin="normal"
                                                                        label="Código DCCAE"
                                                                        id="write"
                                                                        onChange={(e) => {
                                                                            setCodeDCCAE(parseInt(e.target.value));
                                                                        }}
                                                                    />
                                                                </form>
                                                            </Col>
                                                        }
                                                        {render === 2 &&
                                                            <Col sm={4}>
                                                                <TextField
                                                                    className="mt-1"
                                                                    value={name}
                                                                    size="small"
                                                                    fullWidth
                                                                    color="secondary"
                                                                    margin="normal"
                                                                    label="Nombre"
                                                                    id="write"
                                                                    onChange={(e) => {
                                                                        setName(e.target.value);
                                                                    }}
                                                                />
                                                            </Col>
                                                        }
                                                        {listProducts2.length > 0 &&
                                                            <Col sm={4} className="d-flex justify-content-end">
                                                                <ThemeProvider theme={inputsTheme}>
                                                                    <Button
                                                                        variant="contained"
                                                                        color="secondary"
                                                                        className="mt-3 mb-3"
                                                                        onClick={() => { crearSalidaAlmacen() }}
                                                                    >
                                                                        GENERAR SALIDA ALMACÉN
                                                                    </Button>
                                                                </ThemeProvider>
                                                            </Col>}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row m-3 mt-5">
                                        <div className="col-md-6 border-right">
                                            {
                                                siHay === true &&
                                                <div className="d-flex flex-column align-items-center">
                                                    {listProducts.length === 0 ?
                                                        <div className="mt-5 d-flex flex-column align-items-center">
                                                            <img src={process.env.PUBLIC_URL + '/assets/search.png'} alt="Productos buscados" />
                                                            <h1>Productos buscados</h1>
                                                        </div>
                                                        :
                                                        <div className="mt-3">
                                                            <div className="m-3">
                                                                <h1> <b>{item?.Nombre}</b> </h1>
                                                            </div>
                                                            <div className="m-3">
                                                                <h1>Productos disponibles</h1>
                                                            </div>

                                                            <div className='d-flex flex-row justify-content-start flex-wrap'>
                                                                {
                                                                    productosDisponibles.map((elemento: any) => (
                                                                        <Row className='w-100 card p-2 m-1 flex-wrap flex-row p-3 cgt-list'>
                                                                            <Col sm={10} className='p-0'>
                                                                                <b>{elemento.DataBeanProperties.Serial}</b>
                                                                                <div className='d-flex flex-wrap flex-column'>
                                                                                    <div className='m-1'>
                                                                                        <ThemeProvider theme={inputsTheme}>
                                                                                            <Button
                                                                                                variant="contained"
                                                                                                color="secondary"
                                                                                            /* className="mt-3 mb-3" */
                                                                                            /* onClick={() => {
                                                                                                setShowSerial(false);
                                                                                                onAdd2(item);
                                                                                            }} */
                                                                                            >
                                                                                                VER DETALLES
                                                                                            </Button>
                                                                                        </ThemeProvider>
                                                                                    </div>
                                                                                </div>
                                                                            </Col>
                                                                            <Col sm={2} className='d-flex flex-wrap flex-row align-items-center'>
                                                                                <Tooltip title="Seleccionar producto">
                                                                                    <IconButton className="box-s" aria-label="ver" color="secondary" onClick={() => onAdd(item, elemento.DataBeanProperties)}>
                                                                                        <BsPlus />
                                                                                    </IconButton>
                                                                                </Tooltip>
                                                                            </Col>
                                                                        </Row>
                                                                    ))
                                                                }
                                                            </div>
                                                        </div>
                                                    }
                                                </div>
                                            }
                                            {siHay === false &&
                                                <div className="d-flex flex-column align-items-center">
                                                    {listProducts.length === 0 ?
                                                        <div className="mt-5 d-flex flex-column align-items-center">
                                                            <img src={process.env.PUBLIC_URL + '/assets/search.png'} alt="Productos buscados" />
                                                            <h1>Productos buscados</h1>
                                                        </div>
                                                        :
                                                        <div className="mt-3">
                                                            <div className="m-3">
                                                                <h1>Productos buscados</h1>
                                                            </div>

                                                            <div className='d-flex flex-row justify-content-start flex-wrap'>
                                                                {
                                                                    listProducts.map((item: IProduct) => (
                                                                        <Row className='w-100 card p-2 m-1 flex-wrap flex-row p-3 cgt-list'>
                                                                            <Col sm={10} className='p-0'>
                                                                                <b>{item.Nombre}</b>
                                                                                <div className='d-flex flex-wrap flex-column'>
                                                                                    <div className='m-1'>
                                                                                        <small>Cod.SAP : </small>
                                                                                        {item.CodSAP}
                                                                                    </div>
                                                                                    <div className='m-1'>
                                                                                        <small>Cod.DCCAE: </small>
                                                                                        {item.CodDCCAE}
                                                                                    </div>
                                                                                    <div className='m-1 d-flex flex-wrap flex-row'>
                                                                                        <small>Req. Serial: </small>
                                                                                        {item.RequiereSerial
                                                                                            ? <p className=' ml-1 text-success'>SI</p>
                                                                                            : <p className=' ml-1 text-danger'>NO</p>
                                                                                        }
                                                                                    </div>
                                                                                    <div className='m-1'>
                                                                                        <ThemeProvider theme={inputsTheme}>
                                                                                            <Button
                                                                                                variant="contained"
                                                                                                color="secondary"
                                                                                            /* className="mt-3 mb-3" */
                                                                                            /* onClick={() => {
                                                                                                setShowSerial(false);
                                                                                                onAdd2(item);
                                                                                            }} */
                                                                                            >
                                                                                                VER DETALLES
                                                                                            </Button>
                                                                                        </ThemeProvider>
                                                                                    </div>
                                                                                </div>
                                                                            </Col>
                                                                            <Col sm={2} className='d-flex flex-wrap flex-row align-items-center'>
                                                                                <Tooltip title="Seleccionar producto">
                                                                                    <IconButton className="box-s" aria-label="ver" color="secondary" onClick={() => { onSelect(item); }}>
                                                                                        <BsPlus />
                                                                                    </IconButton>
                                                                                </Tooltip>
                                                                            </Col>
                                                                        </Row>
                                                                    ))
                                                                }
                                                            </div>
                                                        </div>
                                                    }
                                                </div>
                                            }
                                        </div>
                                        <div className="col-md-6">
                                            <div className="d-flex flex-column align-items-center">
                                                {listProducts2.length === 0 ?
                                                    <div className="mt-5 d-flex flex-column align-items-center">
                                                        <img src={process.env.PUBLIC_URL + '/assets/box.png'} alt="Productos a descargar" />
                                                        <h1>Productos a descargar</h1>
                                                    </div>
                                                    :
                                                    <div className="mt-3">
                                                        <div className="m-3">
                                                            <h1>Productos a descargar</h1>
                                                        </div>
                                                        <div className='d-flex flex-row justify-content-start flex-wrap'>
                                                            {
                                                                listProducts2.map((item: any) => (
                                                                    <Row className='w-100 card p-2 m-1 flex-wrap flex-row p-3 cgt-list'>
                                                                        <Col sm={10} className='p-0'>
                                                                            <b>{item.Nombre}</b>
                                                                            <div className='d-flex flex-wrap flex-column'>
                                                                                <div className='m-1'>
                                                                                    <small>Cod.SAP : </small>
                                                                                    {item.CodSAP}
                                                                                </div>
                                                                                <div className='m-1'>
                                                                                    <small>Cod.DCCAE: </small>
                                                                                    {item.CodDCCAE}
                                                                                </div>
                                                                                <div className='m-1'>
                                                                                    <small>Serial: </small>
                                                                                    {item.Serial}
                                                                                </div>
                                                                                <div className='m-1'>
                                                                                    <ThemeProvider theme={inputsTheme}>
                                                                                        <Button
                                                                                            variant="contained"
                                                                                            color="secondary"
                                                                                        /* className="mt-3 mb-3" */
                                                                                        /* onClick={() => {
                                                                                            setShowSerial(false);
                                                                                            onAdd2(item);
                                                                                        }} */
                                                                                        >
                                                                                            VER DETALLES
                                                                                        </Button>
                                                                                    </ThemeProvider>
                                                                                </div>
                                                                            </div>
                                                                        </Col>
                                                                        <Col sm={2} className='d-flex flex-wrap flex-row align-items-center'>
                                                                            <Tooltip title="Quitar producto de la lista">
                                                                                <IconButton className="box-s" aria-label="ver" color="error" onClick={() => { onMinus(item, 2); }}>
                                                                                    <BsFillDashCircleFill />
                                                                                </IconButton>
                                                                            </Tooltip>
                                                                        </Col>
                                                                    </Row>
                                                                ))
                                                            }
                                                        </div>
                                                    </div>
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Modal.Body>
                    </Modal>


                );

            case 2:
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
                            Registro de descargo terminado con éxito. Para crear
                            un nuevo registro click{" "}
                            <b onClick={() => onBack()}>
                                {" "}
                                <u> AQUI</u>
                            </b>
                        </h5>
                    </div>
                );

            default:
                break;
        }
    }

    const closeSearch = (data: any) => {
        setShowUser(data);
    };

    const getItem = (data: any) => {
        console.log(data);

        setIdCitizen(data.IDAccount);
        setNameCitizen(data.EntityName);
    };

    const onSumbit = () => {

    }

    const classes = useStyles();

    return (
        <>
            <div className="d-flex nWhite w-80 p-3 m-3 flex-wrap justify-content-center p-2">
                <div className="mt-15">
                    {renderSwitch()}
                </div>
            </div>
            <SSpinner show={spinner} />
            {showValidation &&
                <Modal show={showValidation} backdrop="static" size="lg" centered keyboard={false}>
                    <Modal.Header>
                        Validar Disponibilidad para:
                        <BsXSquare onClick={() => setShowValidation(false)} />
                    </Modal.Header>
                    <Modal.Body>
                        <Row className="p-4">
                            <Col sm={12}>
                                <h4>{item?.Nombre}</h4>
                            </Col>
                            <Col sm={12}>
                                <FormGroup>
                                    <FormControlLabel control={
                                        <ThemeProvider theme={inputsTheme}>
                                            <Checkbox color="secondary" defaultChecked={serialRequired} onChange={() => { setSerialRequiered(!serialRequired); setSerial(null); }} />
                                        </ThemeProvider>
                                    } label="¿Buscar por serial?" />
                                </FormGroup>
                            </Col>
                            {serialRequired &&
                                <Col sm={12}>
                                    <TextField
                                        value={serial}
                                        size="small"
                                        fullWidth
                                        color="secondary"
                                        margin="normal"
                                        label="Serial"
                                        id="serial"
                                        onChange={(e) => {
                                            setSerial(e.target.value);
                                        }}
                                    />
                                </Col>
                            }
                            <Col sm={12}>
                                <FormGroup>
                                    <FormControlLabel control={
                                        <ThemeProvider theme={inputsTheme}>
                                            <Checkbox color="secondary" defaultChecked={dates} onChange={() => { setDates(!dates); setDateFrom(null); setDateUpto(null); }} />
                                        </ThemeProvider>
                                    } label="¿Limitar fechas?" />
                                </FormGroup>
                            </Col>
                            {dates &&
                                <Col sm={12} className="mt-3">
                                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                                        <DatePicker
                                            label="Desde: "
                                            value={dateFrom}
                                            onChange={(e) => {
                                                setDateFrom(e);
                                            }}
                                            renderInput={(props) => <TextField size="small" fullWidth color="secondary" {...props} />}
                                        />
                                    </LocalizationProvider>
                                </Col>
                            }
                            {dates &&
                                <Col sm={12} className="mt-3">
                                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                                        <DatePicker
                                            label="Hasta "
                                            value={dateUpto}
                                            onChange={(e) => {
                                                setDateUpto(e);
                                            }}
                                            renderInput={(props) => <TextField size="small" fullWidth color="secondary" {...props} />}
                                        />
                                    </LocalizationProvider>
                                </Col>}
                            <Col sm={12}>
                                <ThemeProvider theme={inputsTheme}>
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        className="mt-3 mb-3"
                                        onClick={() => {
                                            onValidate();
                                            /* setShowSerial(false);
                                            onAdd2(item); */
                                        }}
                                    >
                                        VALIDAR DISPONIBILIDAD
                                    </Button>
                                </ThemeProvider>
                            </Col>
                        </Row>
                    </Modal.Body>
                </Modal>
            }
            {
                showUser &&
                <SSearchPerson
                    getShow={closeSearch}
                    getPerson={getItem}
                    dataShow={showUser}
                />
            }
        </>
    )
}
