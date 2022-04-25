import { Box, TextField, InputAdornment, IconButton, Button, ThemeProvider, Tooltip } from '@mui/material';
import LinearProgress from '@mui/material/LinearProgress';
import React, { useEffect, useState } from 'react'
import { Card, Col, Row } from 'react-bootstrap';
import { BsArrowLeftCircle, BsSearch } from 'react-icons/bs'
import { GlobalService } from '../../../core/services/GlobalService';

import { SSpinner } from '../../../shared/components/SSpinner';
import { User } from '../../../shared/model/User';
import { inputsTheme } from '../../../utils/Themes';
import { Toast } from '../../../utils/Toastify';
import { IFingerPrintData } from '../model/FingerPrintData';
import { IPersonPhotoData } from '../model/PersonPhotoData';

interface ISRegisterBioData { idAccount: number }

const _globalService = new GlobalService();

const LEFT_HAND: number = 5;
const RIGHT_HAND: number = 6;
const FRONT_FACE: number = 0;
const RIGHT_FACE: number = 3;
const LEFT_FACE: number = 4;
const FACE: number = 6;

export const SRegisterBioData: React.FC<ISRegisterBioData> = (props: ISRegisterBioData) => {

    const fingerNames: string[] = ['PULGAR', 'INDICE', 'MEDIO', 'ANULAR', 'MEÑIQUE'];

    const [counterFinger, setCounterFinger] = useState<number>(0);
    const [counterPhotos, setCounterPhotos] = useState<number>(0);
    const [view, setView] = useState<number>(0);
    const [identification, setIdentification] = useState<number>(0);
    const [name, setName] = useState<string>('');
    const [state, setState] = useState<number>(0);
    const [finger, setFinger] = useState<string>('');
    const [hand, setHand] = useState<number>(0);
    const [progressFingerR, setProgressFingerR] = useState<number>(0);
    const [progressFingerL, setProgressFingerL] = useState<number>(0);
    const [progressPersonP, setProgressPersonP] = useState<number>(0);
    const [showSpinnerScan, setShowSpinnerScan] = useState(false);
    const [showSpinner, setShowSpinner] = useState(false);
    const [user, setUser] = useState<User[]>([]);
    const [fingerRightPhotos, setFingerRightPhotos] = useState<string[]>([]);
    const [fingerLeftPhotos, setFingerLeftPhotos] = useState<string[]>([]);
    const [personPhotos, setPersonPhotos] = useState<string[]>([]);
    const [alreadyBioData, setAlreadyBioData] = useState<boolean>(false);

    useEffect(() => {
        /* if (props.idAccount) {
            getAccountByNit(props.idAccount);
            setState(1);
        } */
        setFinger(fingerNames[counterFinger]);
    }, [])

    useEffect(() => {
        setFinger(fingerNames[(counterFinger <= 4) ? counterFinger : counterFinger - 5]);
    }, [counterFinger])

    const getFingerPrintDataByAccount = (idAccount: number) => {
        let auxR: string[] = [...fingerRightPhotos];
        let auxL: string[] = [...fingerLeftPhotos];
        _globalService
            .getFingerPrintDataCatalog(idAccount)
            .subscribe(resp => {
                console.log(resp);
                if (resp.length > 0) {
                    setAlreadyBioData(true);
                    resp.map((data: IFingerPrintData) => {
                        if (data.HandType === RIGHT_HAND) {
                            auxR[data.FingerType] = data.URL;
                            setProgressFingerR(calcNumRecords(auxR) * 20)
                        }
                        else if (data.HandType === LEFT_HAND) {
                            auxL[data.FingerType + 5] = data.URL;
                            setProgressFingerL(calcNumRecords(auxL) * 20)
                        }
                    })
                    console.log(auxR);
                    console.log(auxL);
                    setFingerRightPhotos(auxR);
                    setFingerLeftPhotos(auxL);
                }
                else {
                    setState(1);
                }
            })
    };

    const getPersonPhotoDataByAccount = (idAccount: number) => {
        let aux: string[] = [...fingerRightPhotos];
        _globalService
            .getPersonPhotoDataCatalog(idAccount)
            .subscribe(resp => {
                if (resp.length > 0) {
                    setAlreadyBioData(true);
                    resp.map((data: IPersonPhotoData) => {
                        if (data.SideType === FACE) {
                            aux[data.ViewType] = data.URL;
                        }
                    })
                    console.log(aux);
                    setProgressPersonP(calcNumRecords(aux) === 3 ? 100 : (calcNumRecords(aux) * 33.3))
                    setPersonPhotos(aux);
                }
            })
    };

    const getAccountByNit = (nit: number) => {
        setShowSpinner(true);
        _globalService
            .getAccountByNit(nit)
            .subscribe(resp => {
                setShowSpinner(false);
                if (resp.length > 0) {
                    console.log(resp);
                    getFingerPrintDataByAccount(resp[0].IDAccount);
                    getPersonPhotoDataByAccount(resp[0].IDAccount);
                    setUser(resp);
                    setName(
                        (resp[0].Surname1 !== undefined ? resp[0].Surname1 : '') + ' ' +
                        (resp[0].Surname2 !== undefined ? resp[0].Surname2 : '') + ' ' +
                        (resp[0].Name1 !== undefined ? resp[0].Name1 : '') + ' ' +
                        (resp[0].Name2 !== undefined ? resp[0].Name2 : '')
                    )
                    Toast.fire({
                        icon: "success",
                        title: "Se han encontrado coincidencias"
                    })
                    setState(1);
                }
                else {
                    Toast.fire({
                        icon: "error",
                        title: "No se han encontrado coincidencias"
                    })
                }
            })
    };

    const handleNext = (type: number) => {
        if (type === 0) {
            setCounterFinger(counterFinger + 1);
        }
        else {
            setCounterFinger(counterFinger - 1);
        }
    }

    const handleChangeView = (type: number) => {
        if (type === 0) {
            setCounterPhotos(counterPhotos + 1)
            if (view === FRONT_FACE) {
                setView(RIGHT_FACE);
            }
            else if (view === RIGHT_FACE) {
                setView(LEFT_FACE);
            }
        }
        else {
            if (view === RIGHT_FACE) {
                setCounterPhotos(counterPhotos - 1);
                setView(FRONT_FACE);
            }
            else if (view === LEFT_FACE) {
                setCounterPhotos(counterPhotos - 1);
                setView(RIGHT_FACE);
            }
        }
    }

    const handleScan = async () => {
        setShowSpinnerScan(true);
        let aux: string[] = (hand === RIGHT_HAND) ? [...fingerRightPhotos] : [...fingerLeftPhotos];
        await _globalService.registerFingerPrint((user[0].IDAccount + ""), hand, hand === RIGHT_HAND ? counterFinger : (counterFinger - 5))
            .subscribe((resp) => {
                setShowSpinnerScan(false);
                debugger
                let jsonResp = JSON.parse((decodeURIComponent(resp)));
                console.log(jsonResp);
                if (jsonResp.Result !== null && jsonResp.Result.DataBeanProperties.Result !== false) {
                    aux[counterFinger] = jsonResp.Result.DataBeanProperties.URL;
                    if (hand === RIGHT_HAND) {
                        setFingerRightPhotos(aux);
                        setProgressFingerR(calcNumRecords(aux) * 20)
                    } else {
                        setFingerLeftPhotos(aux);
                        setProgressFingerL(calcNumRecords(aux) * 20)
                    }
                    calcTotalPercentFinger();
                    Toast.fire({
                        icon: 'success',
                        title: 'Huella Escaneada Correctamente'
                    });
                } else {
                    Toast.fire({
                        icon: 'error',
                        title: 'No se pudo completar la accción'
                    });
                }
            })
    }

    const handleShoot = async () => {
        setShowSpinnerScan(true);
        let aux: string[] = [...personPhotos];
        await _globalService.registerPersonPhoto((user[0].IDAccount + ""), view, FACE)
            .subscribe((resp) => {
                setShowSpinnerScan(false);
                let jsonResp = JSON.parse((decodeURIComponent(resp)));
                if (jsonResp.Result !== null) {
                    aux[view] = jsonResp.Result.DataBeanProperties.URL;
                    setPersonPhotos(aux);
                    setProgressPersonP(calcNumRecords(aux) === 3 ? 100 : calcNumRecords(aux) * 33.3)
                    handleChangeView(0);
                    Toast.fire({
                        icon: 'success',
                        title: 'Foto Capturada Correctamente'
                    });
                } else {
                    Toast.fire({
                        icon: 'error',
                        title: 'No se pudo completar la accción'
                    });
                }
            })
    }

    const calcNumRecords = (arr: string[]) => {
        let counter = 0;
        arr.map((item: string) => {
            if (item !== '' && item !== undefined) {
                counter++;
            }
        })
        return counter;
    }

    const calcTotalPercent = () => {
        let x = (calcTotalPercentFinger());
        let y = (progressPersonP);
        return ((x / 2) + (y / 2));
    }

    const calcTotalPercentFinger = () => {
        let x = (progressFingerR);
        let y = (progressFingerL);
        return ((x / 2) + (y / 2));
    }

    const onSubmit = (e: any) => {
        e.preventDefault();
        if (identification === 0) {
            Toast.fire({
                icon: 'warning',
                title: 'Introduzca una Identificación'
            });
        } else {
            getAccountByNit(identification);
        }
    }

    const renderSwitch = (state: number) => {
        switch (state) {
            case 0: return (
                <div className="container d-flex justify-content-center">
                    <form>
                        <Row className="card box-s m-3 d-block">
                            <Col sm={12} className="mt-5 mb-3 mr-5 ml-5">
                                <h1>..::ENROLAMIENTO BIOMÉTRICO::..</h1>
                            </Col>
                            <Col sm={11} className="mt-5 mb-3">
                                <TextField
                                    className="m-3"
                                    type="number"
                                    size="small"
                                    fullWidth
                                    color="secondary"
                                    margin="normal"
                                    label="No. Identificación"
                                    id="write"
                                    onChange={(e) => setIdentification(e.target.value ? parseInt(e.target.value) : 0)}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton type="submit" onClick={(e) => onSubmit(e)}>
                                                    <BsSearch />
                                                </IconButton>
                                            </InputAdornment>
                                        )
                                    }}
                                />
                            </Col>
                            <Col sm={6} className="mb-3 ml-12 d-flex justify-content-center">
                                <ThemeProvider theme={inputsTheme}>
                                    <Button className="w-100" variant="contained" color="secondary" onClick={(e) => onSubmit(e)}>
                                        BUSCAR
                                    </Button>
                                </ThemeProvider>
                            </Col>
                        </Row>
                    </form>
                </div>
            )
            case 1: return (
                <div>
                    <Row className="d-flex justify-content-between m-10">
                        <Col sm={12} className="d-flex justify-content-start">
                            <ThemeProvider theme={inputsTheme}>
                                <Button
                                    className="ml-3"
                                    variant="contained"
                                    color="secondary"
                                    onClick={() => { window.location.reload(); setState(0); }}
                                ><BsArrowLeftCircle className="mr-2" />ATRAS</Button>
                            </ThemeProvider>
                        </Col>
                        <Col sm={12} className="d-flex justify-content-center">
                            {!alreadyBioData ?
                                <h1>Toma de Datos Biométricos para <b>{name}</b> - <b>{identification}</b></h1>
                                : <h1>Datos Biométricos registrados para <b>{name}</b> - <b>{identification}</b></h1>
                            }
                        </Col>
                        {
                            <div className="d-block w-100 justify-content-center">
                                <Col sm={12} className="mt-5 d-flex justify-content-center">
                                    <h1>{calcTotalPercent()}% Completado</h1>
                                </Col>
                                <Col sm={12} className="mt-3 card box-s">
                                    <Box sx={{ width: '100%' }}>
                                        <LinearProgress className="mt-3 mb-3 mr-2 ml-2" variant="determinate" value={calcTotalPercent()} />
                                    </Box>
                                </Col>
                            </div>
                        }
                        <Col className="d-flex justify-content-center">
                            <Card className="card-zoom m-10" onClick={() => setState(2)}>
                                <Card.Title className="mt-3 ml-5">
                                    {!alreadyBioData
                                        ? <h1 className="">TOMA DE HUELLAS</h1>
                                        : <h1 className="">VER HUELLAS REGISTRADAS</h1>
                                    }
                                </Card.Title>
                                <div className="d-flex flex-column">
                                    <img className="mw-250 ml-5" src={process.env.PUBLIC_URL + "/assets/fingerprints/fg.svg"} alt="fingerprint-sgv" />
                                    <h1 className="h0 ml-5">{`${calcTotalPercentFinger()}%`}</h1>
                                    <h2 className="ml-5">Completado</h2>
                                </div>
                            </Card>
                        </Col>
                        <Col className="mt-3">
                            <Card className="card-zoom m-10" onClick={() => setState(4)}>
                                <Card.Title className="mt-3 ml-5">
                                    {!alreadyBioData
                                        ? <h1 className="">TOMA DE FOTOS</h1>
                                        : <h1 className="">VER FOTOS REGISTRADAS</h1>
                                    }
                                </Card.Title>
                                <div className="d-flex flex-column">
                                    <img className="mw-250 ml-5" src={process.env.PUBLIC_URL + "/assets/fingerprints/profile.png"} alt="userCam-sgv" />
                                    <h1 className="h0 ml-5">{progressPersonP}%</h1>
                                    <h2 className="ml-5">Completado</h2>
                                </div>
                            </Card>
                        </Col>
                    </Row>
                </div>
            )
            case 2: return (
                <div>
                    <Row className="d-flex justify-content-between m-10">
                        <Col sm={12} className="d-flex justify-content-start">
                            <ThemeProvider theme={inputsTheme}>
                                <Button
                                    className="ml-3"
                                    variant="contained"
                                    color="secondary"
                                    onClick={() => { setState(1); }}
                                ><BsArrowLeftCircle className="mr-2" />ATRAS</Button>
                            </ThemeProvider>
                        </Col>
                        <Col sm={12} className="mt-4 d-flex justify-content-center">
                            {!alreadyBioData
                                ? <h1>Toma de Huellas para <b>{name}</b> - <b>{identification}</b></h1>
                                : <h1>Huellas resgistradas para <b>{name}</b> - <b>{identification}</b></h1>
                            }
                        </Col>
                        <div className="d-block w-100 justify-content-center">
                            <Col sm={12} className="mt-5 d-flex justify-content-center">
                                <h1>{calcTotalPercentFinger()}% Completado</h1>
                            </Col>
                            <Col sm={12} className="mt-3 card box-s">
                                <Box sx={{ width: '100%' }}>
                                    <LinearProgress className="mt-3 mb-3 mr-2 ml-2" variant="determinate" value={calcTotalPercentFinger()} />
                                </Box>
                            </Col>
                        </div>
                        <Col className="mt-3">
                            <div className="card-zoom m-10 d-flex justify-content-between"
                                onClick={(e) => { setState(5); setHand(RIGHT_HAND); }}
                            >
                                <img className="mw-250" src={process.env.PUBLIC_URL + "/assets/fingerprints/fg.svg"} alt="right hand fg" />
                                <Row className="d-flex justify-content-center">
                                    <Col sm={12} className="mt-3 d-flex justify-content-end">
                                        <h1 className="">Mano Derecha</h1>
                                    </Col>
                                    <Col sm={12} className="mt-2 d-flex justify-content-end">
                                        <h1 className="h0">{`${progressFingerR}%`}</h1>
                                    </Col>
                                </Row>
                            </div>
                        </Col>
                        <Col className="mt-3">
                            <div className="card-zoom m-10 d-flex justify-content-between "
                                onClick={(e) => { setState(6); setHand(LEFT_HAND); setCounterFinger(5); }}
                            >
                                <img className="mw-250" src={process.env.PUBLIC_URL + "/assets/fingerprints/fg.svg"} alt="left hand fg" />
                                <Row className="d-flex justify-content-center">
                                    <Col sm={12} className="mt-3 d-flex justify-content-end">
                                        <h1 className="">Mano Izquierda</h1>
                                    </Col>
                                    <Col sm={12} className="mt-2 d-flex justify-content-end">
                                        <h1 className="h0">{`${progressFingerL}%`}</h1>
                                    </Col>
                                </Row>
                            </div>
                        </Col>
                    </Row>
                </div>
            )
            case 3: return (
                <div>

                </div>
            )
            //Modulo de toma de FOTOS
            case 4: return (
                <>
                    <Row className="d-flex justify-content-center mt-3">
                        <Col sm={6} className="d-flex justify-content-start">
                            <ThemeProvider theme={inputsTheme}>
                                <Button
                                    className="ml-3"
                                    variant="contained"
                                    color="secondary"
                                    onClick={() => setState(1)}
                                ><BsArrowLeftCircle className="mr-2" />ATRAS</Button>
                            </ThemeProvider>
                        </Col>
                        <Col sm={6} className="d-flex justify-content-end">
                            <ThemeProvider theme={inputsTheme}>
                                <Button className="color-white mr-3" variant="contained" color="success"
                                    onClick={() => {
                                        setState(1);
                                        Toast.fire({
                                            icon: 'success',
                                            title: 'Se guardó correctamente!'
                                        })
                                    }}
                                >
                                    GUARDAR
                                </Button>
                            </ThemeProvider>
                        </Col>
                        <Col sm={12} className="mt-4 d-flex justify-content-center">
                            {!alreadyBioData ?
                                <h1>Toma de Fotos para <b>{name}</b> - <b>{identification}</b></h1>
                                : <h1>Fotos registradas para <b>{name}</b> - <b>{identification}</b></h1>
                            }
                        </Col>
                        {(counterPhotos <= 2 && !alreadyBioData) &&
                            <Col sm={12} className="mt-3 d-flex justify-content-center">
                                <h2>
                                    {'Por favor ingrese la foto del '}
                                    {(view === FRONT_FACE) && <b>PERFIL FRONTAL</b>}
                                    {(view === RIGHT_FACE) && <b>PERFIL DERECHO</b>}
                                    {(view === LEFT_FACE) && <b>PERFIL IZQUIERDO</b>}
                                </h2>
                            </Col>
                        }
                        <Col sm={9} className="mt-3 card box-s">
                            <Box sx={{ width: '100%' }}>
                                <LinearProgress className="mt-3 mb-3 mr-2 ml-2" variant="determinate" value={progressPersonP} />
                            </Box>
                        </Col>
                    </Row>
                    {
                        counterPhotos <= 2 &&
                        <Row className="mt-3 d-flex justify-content-center">
                            <Col sm={6} className=" mt-5 d-flex justify-content-end">
                                <h1 className="h0">
                                    {(view === FRONT_FACE) && <b>PERFIL FRONTAL</b>}
                                    {(view === RIGHT_FACE) && <b>PERFIL DERECHO</b>}
                                    {(view === LEFT_FACE) && <b>PERFIL IZQUIERDO</b>}
                                </h1>
                            </Col>
                            <Col sm={6} className="mt-3 d-flex justify-content-start">
                                {(counterPhotos > 0) &&
                                    <ThemeProvider theme={inputsTheme}>
                                        <Button variant="contained" color="secondary"
                                            onClick={() => handleChangeView(1)}
                                        >
                                            ANTERIOR
                                        </Button>
                                    </ThemeProvider>
                                }
                                <ThemeProvider theme={inputsTheme}>
                                    <Button className="color-white ml-3" variant="contained" color="primary"
                                        onClick={() => handleShoot()}
                                    >
                                        {alreadyBioData ? 'ACTUALIZAR FOTO' : 'TOMAR FOTO'}
                                    </Button>
                                </ThemeProvider>
                            </Col>
                        </Row>
                    }
                    {
                        counterPhotos <= 2
                            ? <div className='container d-flex justify-content-center m-5'>
                                <Row className="d-flex justify-content-center">
                                    <Col sm={6}>
                                        <img className="mw-500 ml-10" src={process.env.PUBLIC_URL + `/assets/personProfiles/${view}.png`} alt="Toma de fotos" />
                                    </Col>
                                    <Col sm={6}>
                                        {(personPhotos[view] !== undefined) ?
                                            <img className="mw-500 ml-10" src={personPhotos[view]} alt="Toma de fotos" />
                                            : <img src={process.env.PUBLIC_URL + `/assets/personProfiles/noFront.png`} alt="" />
                                        }
                                    </Col>
                                    <Col sm={12} className="mt-3">
                                        <Row>
                                            <Col sm={2}>
                                                <div className={"card-zoom m-2" + (personPhotos[0] !== undefined ? ' data-done' : ' data-none')}
                                                    onClick={() => setView(0)}
                                                >
                                                    <img className="mw-100" src={process.env.PUBLIC_URL + `/assets/personProfiles/0.png`} alt="Toma de huellas" />
                                                </div>
                                            </Col>
                                            <Col sm={2}>
                                                <div className={"card-zoom m-2" + (personPhotos[3] !== undefined ? ' data-done' : ' data-none')}
                                                    onClick={() => setView(3)}
                                                >
                                                    <img className="mw-100" src={process.env.PUBLIC_URL + `/assets/personProfiles/3.png`} alt="Toma de huellas" />
                                                </div>
                                            </Col>
                                            <Col sm={2}>
                                                <div className={"card-zoom m-2" + (personPhotos[4] !== undefined ? ' data-done' : ' data-none')}
                                                    onClick={() => setView(4)}
                                                >
                                                    <img className="mw-100" src={process.env.PUBLIC_URL + `/assets/personProfiles/4.png`} alt="Toma de huellas" />
                                                </div>
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                            </div >
                            : <div>
                                <svg className="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                                    <circle className="checkmark__circle" cx="26" cy="26" r="25" fill="none" />
                                    <path className="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
                                </svg>
                                <h5 className="w-100 text-center">Proceso de escaneo Biométrico de FOTOS terminado con éxito! {/* Para seguir con otro proceso click */} {/* <b onClick={() => { handleReset(); getProcedureImpForVerify() }}> <u> AQUI</u></b>*/}</h5>
                            </div>
                    }
                </>
            )
            //Módulo de toma de HUELLAS MANO DERECHA
            case 5: return (
                <>
                    <Row className="d-flex justify-content-center mt-3">
                        <Col sm={6} className="d-flex justify-content-start">
                            <ThemeProvider theme={inputsTheme}>
                                <Tooltip title="Ir Atrás">
                                    <Button
                                        className="ml-3"
                                        variant="contained"
                                        color="secondary"
                                        onClick={() => { setState(2); setCounterFinger(0); }}
                                    ><BsArrowLeftCircle className="mr-1" />ATRAS</Button>
                                </Tooltip>
                            </ThemeProvider>
                        </Col>
                        <Col sm={6} className="d-flex justify-content-end">
                            <ThemeProvider theme={inputsTheme}>
                                <Button className="mr-5" variant="contained" color="success"
                                    onClick={() => {
                                        setState(2);
                                        Toast.fire({
                                            icon: 'success',
                                            title: 'Se guardó correctamente!',
                                        });
                                    }}
                                >
                                    GUARDAR
                                </Button>
                            </ThemeProvider>
                        </Col>
                        <Col sm={12} className="mt-4 d-flex justify-content-center">
                            {!alreadyBioData
                                ? <h1>Toma de Huellas para <b>{name}</b> - <b>{identification}</b></h1>
                                : <h1>Huellas resgistradas para <b>{name}</b> - <b>{identification}</b></h1>
                            }
                        </Col>
                        {(!alreadyBioData) &&
                            <Col sm={12} className="mt-3 d-flex justify-content-center">
                                <h2>
                                    {'Por favor ingrese la huella del '}
                                    <b>{finger}</b>
                                    {' de la mano '}
                                    <b>DERECHA</b>
                                </h2>
                            </Col>
                        }
                        <Col sm={9} className="mt-3 card box-s">
                            <Box sx={{ width: '100%' }}>
                                <LinearProgress className="mt-3 mb-3 mr-2 ml-2" variant="determinate" value={progressFingerR} />
                            </Box>
                        </Col>
                    </Row>
                    <Row className="mt-3 d-flex justify-content-between">
                        <Col sm={6} className=" mt-5 d-flex justify-content-end">
                            <h1 className="h0"><b>{finger} - MANO DERECHA</b></h1>
                        </Col>
                        <Col sm={6} className="mt-5 d-flex justify-content-center">
                            {(counterFinger > 0) &&
                                <ThemeProvider theme={inputsTheme}>
                                    <Button variant="contained" color="secondary"
                                        onClick={() => handleNext(1)}
                                    >
                                        ANTERIOR
                                    </Button>
                                </ThemeProvider>}
                            <ThemeProvider theme={inputsTheme}>
                                <Button className="color-white mr-3 ml-3" variant="contained" color="primary"
                                    onClick={() => handleScan()}
                                >
                                    {alreadyBioData ? 'ACTUALIZAR HUELLA' : 'ESCANEAR HUELLA'}
                                </Button>
                            </ThemeProvider>
                            {(counterFinger < 4) &&
                                <ThemeProvider theme={inputsTheme}>
                                    <Button variant="contained" color="secondary"
                                        onClick={() => handleNext(0)}
                                    >
                                        SIGUIENTE
                                    </Button>
                                </ThemeProvider>
                            }
                        </Col>
                    </Row>
                    {
                        counterFinger <= 9
                            ? <div className='container d-flex justify-content-center m-5'>
                                <Row className="d-flex justify-content-center">
                                    <Col sm={6} className="mt-5">
                                        <img className="mw-500 ml-10" src={process.env.PUBLIC_URL + `/assets/fingerprints/right/${counterFinger}.png`} alt="Toma de huellas" />
                                    </Col>
                                    <Col sm={6} className="mt-5">
                                        {(fingerRightPhotos[counterFinger] !== undefined) ?
                                            <img className="mw-500 ml-10" src={fingerRightPhotos[counterFinger]} alt="Huella" />
                                            : <img className="mw-500 ml-5" src={process.env.PUBLIC_URL + `/assets/fingerprints/noFingerPrint.png`} alt="" />
                                        }
                                    </Col>
                                    <Col sm={12} className="mt-5 d-flex">
                                        <Row>
                                            {
                                                fingerNames.map((item: any, index) => (
                                                    <Col sm={2}>
                                                        <div className={"card-zoom m-2"}
                                                            onClick={() => setCounterFinger(index)}
                                                        >
                                                            <img className="mw-100" src={process.env.PUBLIC_URL + `/assets/fingerprints/right/${index}.png`} alt="Toma de huellas" />
                                                        </div>
                                                    </Col>
                                                ))}
                                        </Row>
                                    </Col>
                                </Row>
                            </div >
                            :
                            !alreadyBioData &&
                            <div>
                                <svg className="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                                    <circle className="checkmark__circle" cx="26" cy="26" r="25" fill="none" />
                                    <path className="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
                                </svg>
                                <h5 className="w-100 text-center">Proceso de escaneo Biométrico de HUELLAS terminado con éxito! {/* Para seguir con otro proceso click */} {/* <b onClick={() => { handleReset(); getProcedureImpForVerify() }}> <u> AQUI</u></b>*/}</h5>
                            </div>
                    }
                </>
            )
            //Módulo de toma de HUELLAS MANO IZQUIERDA
            case 6: return (
                <>
                    <Row className="d-flex justify-content-center mt-3">
                        <Col sm={6} className="d-flex justify-content-start">
                            <ThemeProvider theme={inputsTheme}>
                                <Tooltip title="Ir Atrás">
                                    <Button
                                        className="ml-3"
                                        variant="contained"
                                        color="secondary"
                                        onClick={() => { setState(2); setCounterFinger(0); }}
                                    ><BsArrowLeftCircle className="mr-1" />ATRAS</Button>
                                </Tooltip>
                            </ThemeProvider>
                        </Col>
                        <Col sm={6} className="d-flex justify-content-end">
                            <ThemeProvider theme={inputsTheme}>
                                <Button className="mr-5" variant="contained" color="success"
                                    onClick={() => {
                                        setState(2);
                                        Toast.fire({
                                            icon: 'success',
                                            title: 'Se guardó correctamente!',
                                        });
                                    }}
                                >
                                    GUARDAR
                                </Button>
                            </ThemeProvider>
                        </Col>
                        <Col sm={12} className="mt-4 d-flex justify-content-center">
                            {!alreadyBioData
                                ? <h1>Toma de Huellas para <b>{name}</b> - <b>{identification}</b></h1>
                                : <h1>Huellas resgistradas para <b>{name}</b> - <b>{identification}</b></h1>
                            }
                        </Col>
                        {(counterFinger <= 9 && !alreadyBioData) &&
                            <Col sm={12} className="mt-3 d-flex justify-content-center">
                                <h2>
                                    {'Por favor ingrese la huella del '}
                                    <b>{finger}</b>
                                    {' de la mano '}
                                    <b>IZQUIERDA</b>
                                </h2>
                            </Col>
                        }
                        <Col sm={9} className="mt-3 card box-s">
                            <Box sx={{ width: '100%' }}>
                                <LinearProgress className="mt-3 mb-3 mr-2 ml-2" variant="determinate" value={progressFingerL} />
                            </Box>
                        </Col>
                    </Row>
                    {
                        counterFinger <= 9 &&
                        <Row className="mt-3 d-flex justify-content-between">
                            <Col sm={6} className=" mt-5 d-flex justify-content-end">
                                <h1 className="h0"><b>{finger} - MANO IZQUIERDA</b></h1>
                            </Col>
                            <Col sm={6} className="mt-5 d-flex justify-content-center">
                                {(counterFinger > 5) &&
                                    <ThemeProvider theme={inputsTheme}>
                                        <Button variant="contained" color="secondary"
                                            onClick={() => handleNext(1)}
                                        >
                                            ANTERIOR
                                        </Button>
                                    </ThemeProvider>}
                                <ThemeProvider theme={inputsTheme}>
                                    <Button className="color-white mr-3 ml-3" variant="contained" color="primary"
                                        onClick={() => handleScan()}
                                    >
                                        {alreadyBioData ? 'ACTUALIZAR HUELLA' : 'ESCANEAR HUELLA'}
                                    </Button>
                                </ThemeProvider>
                                {(counterFinger < 9) &&
                                    <ThemeProvider theme={inputsTheme}>
                                        <Button variant="contained" color="secondary"
                                            onClick={() => handleNext(0)}
                                        >
                                            SIGUIENTE
                                        </Button>
                                    </ThemeProvider>
                                }
                            </Col>
                        </Row>
                    }
                    {
                        counterFinger <= 9
                            ? <div className='container d-flex justify-content-center m-5'>
                                <Row className="d-flex justify-content-center">
                                    <Col sm={6} className="mt-5">
                                        <img className="mw-500 ml-10" src={process.env.PUBLIC_URL + `/assets/fingerprints/left/${counterFinger}.png`} alt="Toma de huellas" />
                                    </Col>
                                    <Col sm={6} className="mt-5">
                                        {(fingerLeftPhotos[counterFinger] !== undefined) ?
                                            <img className="mw-500 ml-10" src={fingerLeftPhotos[counterFinger]} alt="Huella" />
                                            : <img className="mw-500 ml-5" src={process.env.PUBLIC_URL + `/assets/fingerprints/noFingerPrint.png`} alt="" />
                                        }
                                    </Col>
                                    <Col sm={12} className="mt-5 d-flex">
                                        <Row>
                                            {
                                                fingerNames.map((item: any, index) => (
                                                    <Col sm={2}>
                                                        <div className="card-zoom m-2"
                                                            onClick={() => { setCounterFinger(index + 5) }}
                                                        >
                                                            <img className="mw-100" src={process.env.PUBLIC_URL + `/assets/fingerprints/left/${index + 5}.png`} alt="Toma de huellas" />
                                                        </div>
                                                    </Col>
                                                ))}
                                        </Row>
                                    </Col>
                                </Row>
                            </div >
                            :
                            !alreadyBioData &&
                            <div>
                                <svg className="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                                    <circle className="checkmark__circle" cx="26" cy="26" r="25" fill="none" />
                                    <path className="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
                                </svg>
                                <h5 className="w-100 text-center">Proceso de escaneo Biométrico de HUELLAS terminado con éxito! {/* Para seguir con otro proceso click */} {/* <b onClick={() => { handleReset(); getProcedureImpForVerify() }}> <u> AQUI</u></b>*/}</h5>
                            </div>
                    }
                </>
            )
        }
    }

    return (
        <>
            <div className="nWhite w-80 p-3 m-3">
                <div className="mt-15">
                    {renderSwitch(state)}
                </div>
                <SSpinner show={showSpinnerScan} message="ESCANEANDO DATOS BIOMÉTRICOS" />
                <SSpinner show={showSpinner} message="DCCAE" />
            </div>
        </>
    )
}
