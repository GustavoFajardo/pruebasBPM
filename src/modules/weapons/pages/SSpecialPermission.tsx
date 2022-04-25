import { DatePicker, LocalizationProvider } from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { Button, IconButton, MenuItem, TextField, ThemeProvider, Tooltip } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { Col, Row } from 'react-bootstrap';
import { BsFillArrowLeftSquareFill, BsGearFill, BsUpload } from 'react-icons/bs';
import { WeaponsService } from '../../../core/services/WeaponsService';
import { env } from '../../../env';
import { SLoadDocument } from '../../../shared/components/SLoadDocument';
import { SSpinner } from '../../../shared/components/SSpinner';
import { User } from '../../../shared/model/User';
import { inputsTheme } from '../../../utils/Themes';
import { Toast } from '../../../utils/Toastify';
import { ModalSettings } from '../components/ModalSettings';
import { PDFCode } from '../components/PDFCode';
import { IDataPermission } from '../model/DataPermission';


const _weaponService = new WeaponsService();

export const SSpecialPermission = () => {

    const [photo, setPhoto] = useState('img_avatar.png');
    const [cc, setCc] = useState('');
    const [names, setNames] = useState('');
    const [surNames, setSurNames] = useState('');
    const [brand, setBrand] = useState('');
    const [weaponKind, setWeaponKind] = useState<number | null>(null);
    const [caliber, setCaliber] = useState<number | null>(null);
    const [capacity, setCapacity] = useState<number | null>(null);
    const [serie, setSerie] = useState('');
    const [dateInit, setDateInit] = useState<Date | null>(null);
    const [showLoad, setShowLoad] = useState<boolean>(false);
    const [spinner, setSpinner] = useState<boolean>(false);
    const [media, setMedia] = useState('');
    const [contex, setContex] = useState('');
    const [user, setUser] = useState(0);
    const [type, setType] = useState(0);
    const [render, setRender] = useState(0);
    const [qr, setQr] = useState('');
    const [foto, setFoto] = useState('');
    const [fechaGen, setFechaGen] = useState('');
    const [hashVal, setHasVal] = useState('');
    const [dataPermission, setDataPermission] = useState<IDataPermission>({ Name: '', Vence: '' });
    const [tiposArmas, setTiposArmas] = useState<[]>([]);
    const [calibres, setCalibres] = useState<[]>([]);
    const [capacidades, setCapacidades] = useState<[]>([]);
    const [show, setShow] = useState(false);

    const [codeY, setCodeY] = useState('1'); // TODO: INICIALIZAR EL VALOR CON LA VARIABLE DE SISTEMA
    const [frontY, setFrontPosition] = useState('1'); // TODO: INICIALIZAR EL VALOR CON LA VARIABLE DE SISTEMA
    const [height, setHeight] = useState(1);  // TODO: INICIALIZAR EL VALOR CON LA VARIABLE DE SISTEMA
    const [frontX, setFrontX] = useState('1');  // TODO: INICIALIZAR EL VALOR CON LA VARIABLE DE SISTEMA
    const [codeX, setCodeX] = useState('1');  // TODO: INICIALIZAR EL VALOR CON LA VARIABLE DE SISTEMA


    useEffect(() => {
        getList([6, 4, 5]);
        if (localStorage.getItem('usuario') !== null) {
            let user: User = JSON.parse(localStorage.getItem('usuario') ?? "");
            setUser(user.IDAccount);
        }
    }, []);

    useEffect(() => { }, [photo]);


    const getList = (lista: number[]) => {
        _weaponService.getListasPorCodigo(lista).subscribe((resp: any) => {
            if (resp.DataBeanProperties.ObjectValue) {
                console.log(resp.DataBeanProperties.ObjectValue);
                setCalibres(resp.DataBeanProperties.ObjectValue[0].Lista);
                setCapacidades(resp.DataBeanProperties.ObjectValue[2].Lista);
                setTiposArmas(resp.DataBeanProperties.ObjectValue[1].Lista);
            } else {
                Toast.fire({
                    icon: "error",
                    title: "No se ha cargado la información",
                });
            }
        })
    };

    const getMedia = (doc: any) => {
        setMedia(doc.Media);
        setPhoto(doc.Media);
        setContex(doc.MediaContext);
    }

    const format = (date: Date | null) => {
        let dateFormated: string = "";
        if (date !== null) {
            dateFormated = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
        }
        return dateFormated;
    };

    const iterator = (list: any[], cod: number | null) => {
        let rps = '';
        list.map((item: any) => {
            if (parseInt(item.Codigo) == cod) {
                rps = rps + item.Valor;
            }
        })
        return rps
    };

    const generateCryptoCode = () => {
        console.log(iterator(tiposArmas, weaponKind));
        let data: IDataPermission = {
            Name: (surNames + ' ' + names),
            ClaseArma: iterator(tiposArmas, weaponKind).toUpperCase(),
            Marca: brand,
            Serie: serie,
            Calibre: iterator(calibres, caliber).toUpperCase(),
            Capacidad: iterator(capacidades, capacity).toUpperCase(),
            Vence: format(dateInit)
        }
        setDataPermission(data);
        setSpinner(true);
        _weaponService
            .generateCryptoCode(contex, media, data.Name, parseInt(cc), data, data.Vence, type, user)
            .subscribe(rps => {
                setSpinner(false);
                if (rps) {
                    let datosPermiso = JSON.parse(rps.DataBeanProperties.ObjectValue.datosPermiso);
                    setQr(`data:image/png;base64,${datosPermiso.QrCode64}`);
                    setFoto(`data:image/jpg;base64,${datosPermiso.Photo64}`);
                    setFechaGen(rps.DataBeanProperties.ObjectValue.Permiso.DataBeanProperties.Since);
                    setHasVal(rps.DataBeanProperties.ObjectValue.Permiso.DataBeanProperties.Hashval);
                    setRender(1);
                    Toast.fire({
                        icon: "success",
                        title: "CryptoCode generado con éxito!",
                    });
                } else {
                    Toast.fire({
                        icon: "error",
                        title: "No se ha podido completar la acción",
                    });
                }
            })
    };

    const onNext = () => {
        if (
            cc === '' ||
            surNames === '' ||
            names === '' ||
            weaponKind === 0 ||
            serie === '' ||
            caliber === 0 ||
            brand === '' ||
            capacity === 0 ||
            dateInit === null
        ) {
            Toast.fire({
                icon: 'warning',
                title: 'Debe llenar todos los campos'
            });
        }
        else {
            if (photo !== 'img_avatar.png') {
                if (type !== 0) {
                    generateCryptoCode();
                } else {
                    Toast.fire({
                        icon: 'warning',
                        title: 'Seleccione una clase de código'
                    });
                }
            }
            else {
                Toast.fire({
                    icon: 'warning',
                    title: 'Debe cargar una FOTO'
                });
            }
        }
    };

    const onInit = () => {
        setRender(0);
        //Reiniciar todas los estados        
        setCc('');
        setSurNames('');
        setNames('');
        setWeaponKind(null);
        setBrand('');
        setSerie('');
        setCaliber(null);
        setCapacity(null);
        setDateInit(null);
        setType(0);
        setPhoto('img_avatar.png');
    }

    return (
        <>
            {render === 0 &&
                <div className="d-flex nWhite w-80 p-3 m-3 flex-wrap justify-content-center p-2">
                    <div className="row">
                        <Col sm={12} className="mt-3 d-flex justify-content-center">
                            <div className="pull-title-top">
                                <h1 className="m-5 ">GENERADOR DE PERMISOS ESPECIALES</h1>
                            </div>
                        </Col>
                        <div className="col-md-4 border-right">
                            <div className="d-flex flex-column align-items-center text-center p-3 py-5">
                                <span className="font-weight-bold my-3">FOTO DEL PERMISO</span>
                                <div className="hover-box">
                                    <img className="rounded-circle-bordered hover-image"
                                        src=
                                        {(photo === 'img_avatar.png')
                                            ? process.env.PUBLIC_URL + `/assets/${photo}`
                                            : env.REACT_APP_ENDPOINT + `/filedownload?ContextMedia@=${contex}@@Media@=${photo}`
                                        }
                                        width="120" alt="Profile Img" />
                                    <div className="hover-middle">
                                        <ThemeProvider theme={inputsTheme}>
                                            <Button variant="contained" color="secondary"
                                                onClick={() => setShowLoad(true)}
                                            >
                                                <BsUpload className="ml-2 mr-2" />
                                                SUBIR
                                            </Button>
                                        </ThemeProvider>
                                    </div>
                                </div>
                                <span className="font-weight-bold my-3">{cc}</span>
                                <span className="font-weight-bold">{surNames + ' ' + names}</span>
                            </div>
                        </div>
                        <div className="col-md-8">
                            <div className="p-3 py-5">
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <h4 className="text-right">Información del Permiso</h4>
                                </div>
                                <div className="row mt-3">
                                    <div className="col-md-12">
                                        <TextField
                                            value={cc}
                                            size="small"
                                            color="secondary"
                                            id="Name1"
                                            label="No. Identificación"
                                            fullWidth
                                            variant="outlined"
                                            onChange={(e) => setCc(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="row mt-3">
                                    <div className="col-md-6">
                                        <TextField
                                            value={surNames}
                                            size="small"
                                            color="secondary"
                                            id="Name1"
                                            label="Apellidos *"
                                            fullWidth
                                            variant="outlined"
                                            onChange={(e) => setSurNames(e.target.value.toUpperCase())}
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <TextField
                                            value={names}
                                            size="small"
                                            color="secondary"
                                            id="Name2"
                                            label="Nombres *"
                                            fullWidth
                                            variant="outlined"
                                            onChange={(e) => setNames(e.target.value.toUpperCase())}
                                        />
                                    </div>
                                </div>
                                <div className="row mt-3">
                                    <div className="col-md-6">
                                        <TextField
                                            value={weaponKind}
                                            size="small"
                                            select
                                            fullWidth
                                            color="secondary"
                                            label="Clase de Arma"
                                            id="state"
                                            onChange={(e) => setWeaponKind(parseInt(e.target.value))}
                                        >
                                            {tiposArmas.map((item: any) => (
                                                <MenuItem key={item.Codigo} value={item.Codigo}>{item.Valor}</MenuItem>
                                            ))}
                                        </TextField>
                                    </div>
                                    <div className="col-md-6">
                                        <TextField
                                            value={brand}
                                            size="small"
                                            color="secondary"
                                            id="Name1"
                                            label="Marca *"
                                            fullWidth
                                            variant="outlined"
                                            onChange={(e) => setBrand(e.target.value.toUpperCase())}
                                        />
                                    </div>
                                </div>
                                <div className="row mt-3">
                                    <div className="col-md-6">
                                        <TextField
                                            value={serie}
                                            size="small"
                                            color="secondary"
                                            id="Name1"
                                            label="No. Serie *"
                                            fullWidth
                                            variant="outlined"
                                            onChange={(e) => setSerie(e.target.value.toUpperCase())}
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <TextField
                                            value={caliber}
                                            size="small"
                                            select
                                            fullWidth
                                            color="secondary"
                                            label="Calibre *"
                                            id="state"
                                            onChange={(e) => setCaliber(parseInt(e.target.value))}
                                        >
                                            {calibres.map((item: any) => (
                                                <MenuItem key={item.Codigo} value={item.Codigo}>{item.Valor}</MenuItem>
                                            ))}
                                        </TextField>
                                    </div>
                                </div>
                                <div className="row mt-3">
                                    <div className="col-md-6">
                                        <TextField
                                            value={capacity}
                                            size="small"
                                            select
                                            fullWidth
                                            color="secondary"
                                            label="Capacidad de carga *"
                                            id="state"
                                            onChange={(e) => setCapacity(parseInt(e.target.value))}
                                        >
                                            {capacidades.map((item: any) => (
                                                <MenuItem key={item.Codigo} value={item.Codigo}>{item.Valor}</MenuItem>
                                            ))}
                                        </TextField>
                                    </div>
                                    <div className="col-md-6">
                                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                                            <DatePicker
                                                disablePast
                                                label="Fecha de vencimiento: "
                                                value={dateInit}
                                                onChange={(e) => {
                                                    setDateInit(e)
                                                }}
                                                renderInput={(props) => <TextField size="small" fullWidth color="secondary" {...props} />}
                                            />
                                        </LocalizationProvider>
                                    </div>
                                </div>
                                <div className=" row mt-5 text-right">
                                    <div className="col-md-8">
                                        <TextField
                                            margin="normal"
                                            size="small"
                                            select
                                            fullWidth
                                            color="secondary"
                                            label="Clase de Código"
                                            id="state"
                                            onChange={(e) => setType(parseInt(e.target.value))}
                                        >
                                            <MenuItem value={1}>
                                                CRYPTO-CODE
                                            </MenuItem>
                                            <MenuItem value={2}>
                                                PDF_417
                                            </MenuItem>
                                        </TextField>
                                    </div>
                                    <div className="col-md-4 d-flex justify-content-center">
                                        <ThemeProvider theme={inputsTheme}>
                                            <Button variant="contained" color="secondary"
                                                onClick={() => onNext()}
                                            >
                                                SIGUIENTE
                                            </Button>
                                        </ThemeProvider>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>}
            {render === 1 &&
                <div className="d-flex nWhite w-80 p-3 m-3 flex-wrap justify-content-center p-2">
                    <div className="row">
                        <Col sm={12} className="mt-3 d-flex justify-content-center">
                            <div className="pull-title-top">
                                <h1 className="m-5 ">PERMISO ESPECIAL GENERADO</h1>
                            </div>
                        </Col>
                        <div className="col-md-6 border-right">
                            <div className="d-flex flex-column align-items-center text-center p-3 py-5">
                                <span className="font-weight-bold my-3">DATOS DEL PERMISO</span>
                                <div className="hover-box">
                                    <img className="rounded-circle-bordered"
                                        src={env.REACT_APP_ENDPOINT + `/filedownload?ContextMedia@=${contex}@@Media@=${photo}`}
                                        width="120" alt="Profile Img" />
                                </div>
                                <span className="font-weight-bold my-3"> <b>Identificación: </b> {cc}</span>
                                <span className="font-weight-bold"> <b>Nombre: </b> {surNames + ' ' + names}</span>
                                <span className="font-weight-bold my-3"> <b>DATOS DEL ARMA</b></span>
                                <span className="font-weight-bold"> <b>ARMA: </b> {dataPermission.ClaseArma} - {brand}</span>
                                <span className="font-weight-bold"> <b>NO. SERIE: </b> {serie} </span>
                                <span className="font-weight-bold"> <b>CAPACIDAD: </b> {dataPermission.Capacidad} </span>
                                <span className="font-weight-bold"> <b>CALIBRE: </b> {dataPermission.Calibre} </span>
                                <span className="font-weight-bold"> <b>FECHA / VENCIMIENTO: </b> {format(dateInit)} </span>
                                <span className="font-weight-bold"> <b>FECHA / GENERACIÓN: </b> {fechaGen} </span>
                                <span className="font-weight-bold"> <b>HASH: </b> {hashVal} </span>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="d-flex justify-content-end">
                                <Tooltip title="Ajustar medidas">
                                    <IconButton onClick={() => setShow(true)}>
                                        <BsGearFill />
                                    </IconButton>
                                </Tooltip>
                            </div>
                            <div className="d-flex flex-column align-items-center text-center p-3 py-5">
                                <span className="font-weight-bold my-3">CRYPTO-CODE</span>
                                <div className="hover-box">
                                    <img className=" hover-image"
                                        src={qr}
                                        width="auto"
                                        height="50"
                                        alt="Crypto Code" />
                                    <div className="hover-middle">
                                        <ThemeProvider theme={inputsTheme}>
                                            <Button variant="contained" color="secondary" className="white-link">
                                                <PDFCode
                                                    src={qr}
                                                    title={cc}
                                                    data={dataPermission}
                                                    photo={foto}
                                                    frontY={frontY}
                                                    frontX={frontX}
                                                    codeY={codeY}
                                                    codeX={codeX}
                                                    height={height}
                                                    label="DESCARGAR" />
                                            </Button>
                                        </ThemeProvider>
                                    </div>
                                </div>
                                <span className="font-weight-bold my-3">HAGA CLICK EN EL CODIGO PARA DESCARGARLO</span>
                            </div>
                            <div className="d-flex justify-content-center">
                                <ThemeProvider theme={inputsTheme}>
                                    <Button variant="contained" color="secondary"
                                        onClick={() => { onInit() }}
                                    >
                                        <BsFillArrowLeftSquareFill className="ml-2 mr-2" />
                                        GENERAR OTRO PERMISO
                                    </Button>
                                </ThemeProvider>
                            </div>
                        </div>
                    </div>
                </div>
            }
            <SLoadDocument show={showLoad} setShow={setShowLoad} title={"Cargar Imagen"} type={1} getMedia={getMedia} accept={["image/*"]} />
            <SSpinner show={spinner} />
            <ModalSettings
                show={show}
                setShow={setShow}
                frontY={frontY}
                setFrontY={setFrontPosition}
                frontX={frontX}
                setFrontX={setFrontX}
                codeY={codeY}
                setCodeY={setCodeY}
                codeX={codeX}
                setCodeX={setCodeX}
                height={height}
                setHeight={setHeight}
            />
        </>
    )
}
