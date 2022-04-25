import { useState, useEffect } from "react";

import { BsArrowRight, BsCloudDownloadFill, BsFillCloudUploadFill, BsPlus, BsSearch, BsXSquare } from 'react-icons/bs';
import { ButtonGroup, MenuItem, Paper, SpeedDial, SpeedDialAction, TableCell, TableContainer, Table, TableHead, TextField, TableRow, TableBody, TablePagination, ThemeProvider, IconButton, Tooltip, SelectChangeEvent, Select, Button, InputAdornment, Autocomplete } from "@mui/material";
import { inputsTheme, useStyles } from "../../../utils/Themes";
import { WeaponsService } from "../../../core/services/WeaponsService";
import { SLoadDocument } from "../../../shared/components/SLoadDocument";
import { Col, Modal, Row } from "react-bootstrap";
import SSearchPerson from "../../../shared/components/SSearchPerson";
import { Toast } from '../../../utils/Toastify';
import { FiSend } from "react-icons/fi";
import { pipeSort } from "../../../utils/pipeSort";
import { ConfigService } from "../../../core/services/ConfigService";

const _weaponService = new WeaponsService();
const _configService = new ConfigService();

export const TloadStore = () => {

    const [Url, setUrl] = useState("");
    const [show, setShow] = useState(false);
    const [showLoad, setShowLoad] = useState(false);

    const [media, setMedia] = useState("");
    const [context, setContex] = useState("");
    const [beanDoc, setBeanDoc] = useState<any>();
    const [IDEmpleado, setIDEmpleado] = useState<number>(0);
    const [IDProvedor, setIDProvedor] = useState<number>(0);
    const [NameProvedor, setNameProvedor] = useState<string>("");
    const [listOffice, setListOffice] = useState([]);
    const [office, setOffice] = useState(0);

    const [numeroEntrada, setnumeroEntrada] = useState<string>("");
    const [conError, setConError] = useState<boolean>(false);
    const [respDoc, setRespDoc] = useState<any>();



    const [show2, setShow2] = useState(false);

    const setShowF = (show: boolean) => {
        setShow(show);
    }
    const getMedia = (doc: any) => {
        if (doc) {
            setMedia(doc.Media);
            setContex(doc.MediaContext);
            setBeanDoc(doc)
            console.log(doc);



            Toast.fire({
                icon: "success",
                title: "Docuemento seleccionado",
            });
        }
    };

    const openUser = (state: boolean) => {
        setShow2(state);
    };

    const getItem = (data: any) => {
        setIDProvedor(data.IDAccount);
        setNameProvedor(data.EntityName);
    };
    useEffect(() => {
        descargarFormatoEntradaAlmacen();
        getOfficeCatalog();
    }, []);

    const descargarFormatoEntradaAlmacen = () => {
        _weaponService.descargarFormatoEntradaAlmacen().subscribe((resp: any) => {

            if (resp.DataBeanProperties.ObjectValue) {
                setUrl(resp.DataBeanProperties.ObjectValue[0].DataBeanProperties.URLLink);
            }
        })
    }
    const getOfficeCatalog = () => {
        let aux: any = [];
        let auxSorted: any = [];
        _weaponService.getIndumilOffices()
            .subscribe((res: any) => {
                if (res) {
                    console.log(res);
                    res.map((item: any) =>
                        aux.push({
                            label: item.Nombre,
                            id: item.IDAlmaIndumil
                        }))
                    auxSorted = pipeSort([...aux], 'label');
                    setListOffice(auxSorted);
                } else {
                    Toast.fire({
                        icon: "error",
                        title: "No se ha podido listar información de sucursales",
                    });
                }
            });
    };

    const format = (date: Date | null) => {
        let dateFormated: string = "";
        if (date !== null) {
            dateFormated = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
        }
        return dateFormated;
    }
    const getSesion = () => {
        return JSON.parse(localStorage.getItem("usuario") ?? "");
    };

    const validarInicio = () => {
        if (IDProvedor === 0 || IDProvedor === undefined || IDProvedor === null) {
            Toast.fire({
                icon: "error",
                title: "No tiene proveedor seleccionado",
            });
        } else if (numeroEntrada === "" || numeroEntrada === undefined || numeroEntrada === null) {
            Toast.fire({
                icon: "error",
                title: "No tiene Número de entrada",
            });
        }
        else if (office === 0 || office === undefined || office === null) {
            Toast.fire({
                icon: "error",
                title: "No selecciono la sucursal",
            });
        }
        else {
            setShowLoad(true);
            setRespDoc(null);
            setBeanDoc(null);

            setConError(false);
        }
    }

    const crearEntradaAlmacen = () => {
        if (IDProvedor === 0 || IDProvedor === undefined || IDProvedor === null) {
            Toast.fire({
                icon: "error",
                title: "No tiene proveedor seleccionado",
            });
        } else if (numeroEntrada === "" || numeroEntrada === undefined || numeroEntrada === null) {
            Toast.fire({
                icon: "error",
                title: "No tiene Número de entrada",
            });
        } else if (media === "" || media === undefined || media === null) {
            Toast.fire({
                icon: "error",
                title: "No tiene Docuemento cargado",
            });
        } else if (office === 0 || office === undefined || office === null) {
            Toast.fire({
                icon: "error",
                title: "No selecciono la sucursal",
            });
        } else {


            let fecha = new Date();
            setConError(false);

            _weaponService.crearEntradaAlmacen(format(fecha) + ' 00:00:00', IDProvedor, parseInt(getSesion().IDAccount), numeroEntrada, media, context, "", office).subscribe((resp: any) => {
                if (resp.DataBeanProperties.ObjectValue) {
                    setConError(true);
                    setRespDoc(resp.DataBeanProperties.ObjectValue);
                    Toast.fire({
                        icon: "info",
                        title: resp.DataBeanProperties.ObjectValue.DataBeanProperties.Message,
                    });



                } else {
                    Toast.fire({
                        icon: "error",
                        title: "No se ha podido completar la acción",
                    });
                }
            })
        }
    }

    return (
        <div className="nWhite w-80 p-3 m-3">
            <main>

                <div className="px-5 mt-2">
                    <div className="row justify-content-center">
                        <div className="">
                            <div className="card p-4 h-100">
                                <div className="container h-100 mt-2">
                                    {/* <h3 className="mt-2">Descargue el archivo y luego carguelo con la información</h3>
                                    <div>

                                      
                                    </div> */}


                                    <h3>Entrada de Almacén.</h3>
                                    <Row>

                                        <Col sm={6} className="mt-3">
                                            <TextField
                                                value={NameProvedor}
                                                size="small"
                                                label="Proveedor *"
                                                fullWidth
                                                color="secondary"
                                                id="user"
                                                InputProps={{
                                                    endAdornment: (
                                                        <InputAdornment position="end">
                                                            <IconButton onClick={() => openUser(true)}>
                                                                <BsSearch />
                                                            </IconButton>
                                                        </InputAdornment>
                                                    ),
                                                }}
                                                onClick={() => openUser(true)}
                                            />

                                        </Col>

                                        <Col sm={6} className="mt-3">
                                            <TextField
                                                value={numeroEntrada}
                                                size="small"
                                                label="Numero de Entrada *"
                                                fullWidth
                                                color="secondary"
                                                id="user"
                                                onChange={(e) => setnumeroEntrada(e.target.value)}
                                            />
                                        </Col>

                                        <Col sm={12} className="mt-3">
                                            <Autocomplete
                                                fullWidth
                                                size="small"
                                                disablePortal
                                                id="forms"
                                                options={listOffice}
                                                onChange={(e, value: any) => { setOffice(value ? value.id : 0); }}
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        size="small"
                                                        fullWidth
                                                        color="secondary"
                                                        label=".:Seleccione una Seccional:."
                                                        id="state"
                                                    />)}
                                            />
                                        </Col>
                                    </Row>
                                    <ThemeProvider theme={inputsTheme}>
                                        <div className="row justify-content-between">

                                            <Button type="submit" variant="contained" endIcon={<BsArrowRight />} className=" my-3 " color="secondary" onClick={() => { validarInicio() }}>
                                                Siguiente
                                            </Button>

                                            <a href={Url} target="_blank" >
                                                <Button type="submit" variant="contained" endIcon={<BsCloudDownloadFill />} className="my-3" color="secondary">
                                                    Descargar formato
                                                </Button>
                                            </a>

                                        </div>
                                    </ThemeProvider>


                                </div>
                                {setShowF && <SLoadDocument setShow={setShowF} type={1} show={show} title={'Cargar formato'} getMedia={getMedia} beanAction={null} accept={[".xlsx"]} />}

                                {show2 &&
                                    <SSearchPerson
                                        getShow={openUser}
                                        getPerson={getItem}
                                        dataShow={show2}
                                    />
                                }

                                <Modal show={showLoad} backdrop="static" centered keyboard={false} size="lg">
                                    <Modal.Header>
                                        Entrada de Almacén
                                        <BsXSquare onClick={() => setShowLoad(false)} />
                                    </Modal.Header>
                                    <Modal.Body>
                                        <ThemeProvider theme={inputsTheme}>
                                            <Button type="submit" variant="contained" endIcon={<BsFillCloudUploadFill />} className=" mt-3" color="secondary" onClick={() => setShowF(true)}>
                                                Cargar formato
                                            </Button>
                                            {beanDoc &&
                                                <div>
                                                    <p className="my-2"> <a className="text-secondary " href={beanDoc?.URL} target="_blank">{beanDoc?.Name}</a> </p>
                                                    <Button type="submit" variant="contained" endIcon={<FiSend />} className=" my-3 " color="secondary" onClick={() => crearEntradaAlmacen()}>
                                                        Enviar
                                                    </Button>
                                                </div>

                                            }
                                        </ThemeProvider>


                                        {conError && <div className="mt-3"><h3>Documento con Observaciones</h3>  <div className="mb-2"><p className="text-muted m-0"> *Haga clic en el enlace para ver el documento</p> <a className="text-secondary" href={respDoc?.DataBeanProperties.URLLink}>{respDoc?.DataBeanProperties.Media}</a> </div></div>}

                                    </Modal.Body>
                                </Modal>
                            </div>
                        </div>
                    </div>
                </div>

            </main>
        </div>
    )
}
