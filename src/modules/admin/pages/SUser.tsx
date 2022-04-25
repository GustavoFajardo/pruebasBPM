import { Button, ThemeProvider } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { Accordion, Card, Col, Row, useAccordionToggle } from 'react-bootstrap'
import { MenuItem, TextField } from "@mui/material";

import { User } from '../../../shared/model/User';
import { inputsTheme } from '../../../utils/Themes';
import { BsLockFill, BsShieldLockFill, BsUnlockFill } from 'react-icons/bs';
import { AuthService } from '../../../core/services/AuthService';
import { MChangePassword } from '../components/MChangePassword';

interface ISUser { }

const _authService = new AuthService();

export const SUser: React.FC<ISUser> = (props: ISUser) => {

    const [user, setUser] = useState<User>({
        IDAccount: 0,
        Name1: '',
        Name2: '',
        Surname1: '',
        Surname2: '',
        EntityName: '',
        RoleID: 0,
        Nit: 0,
        eMail: '',
        Active: true,
        IDLn: 0,
        State: 0,
    });

    const [permission, setPermission] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        let u: any = getSesion();
        setUser(u);
    }, [])

    const getSesion = () => {
        if (localStorage.getItem('usuario')) {
            return JSON.parse(localStorage.getItem('usuario') ?? "")
        }
    }

    function CustomToggle({ children, eventKey }: any) {
        const decoratedOnClick = useAccordionToggle(eventKey, () =>
            console.log('totally custom!'),
        );

        return (
            <ThemeProvider theme={inputsTheme}>
                <Button variant="contained" color="secondary"
                    onClick={decoratedOnClick}
                >
                    {children}
                    {<BsShieldLockFill className="ml-3" />}
                </Button>
            </ThemeProvider>
        );
    }

    return (
        <>
            <div className="card w-80 p-3 m-5">
                <Row>
                    <Col sm={12} className="mt-15 container">
                        <div className="container rounded bg-white mt-5">
                            <div className="row">
                                <div className="col-md-4 border-right">
                                    <div className="d-flex flex-column align-items-center text-center p-3 py-5">
                                        <img className="rounded-circle mt-5" src="https://i.imgur.com/0eg0aG0.jpg" width="90" alt="Profile Img" />
                                        <span className="font-weight-bold mt-2">{user.EntityName}</span>
                                        <span className="text-black-50">{user.Nit}</span>
                                        <span className="text-black-50">{user.eMail}</span>
                                    </div>
                                </div>
                                <div className="col-md-8">
                                    <div className="p-3 py-5">
                                        <div className="d-flex justify-content-between align-items-center mb-3">
                                            <h4 className="text-right">Información del Usuario</h4>
                                        </div>
                                        <div className="row mt-2">
                                            <div className="col-md-6">
                                                <TextField
                                                    value={user.Name1}
                                                    size="small"
                                                    color="secondary"
                                                    id="Name1"
                                                    label="Primer Nombre"
                                                    fullWidth
                                                    variant="outlined"
                                                />
                                            </div>
                                            <div className="col-md-6">
                                                <TextField
                                                    value={user.Name2}
                                                    size="small"
                                                    color="secondary"
                                                    id="Name1"
                                                    label="Segundo Nombre"
                                                    fullWidth
                                                    variant="outlined"
                                                />
                                            </div>
                                        </div>
                                        <div className="row mt-3">
                                            <div className="col-md-6">
                                                <TextField
                                                    value={user.Surname1}
                                                    size="small"
                                                    color="secondary"
                                                    id="Name1"
                                                    label="Primer Apellido"
                                                    fullWidth
                                                    variant="outlined"
                                                />
                                            </div>
                                            <div className="col-md-6">
                                                <TextField
                                                    value={user.Surname2}
                                                    size="small"
                                                    color="secondary"
                                                    id="Name1"
                                                    label="Segundo Apellido"
                                                    fullWidth
                                                    variant="outlined"
                                                />
                                            </div>
                                        </div>
                                        <div className="row mt-3">
                                            <div className="col-md-6">
                                                <TextField
                                                    value={user.Nit}
                                                    size="small"
                                                    color="secondary"
                                                    id="Name1"
                                                    label="No. Identificación"
                                                    fullWidth
                                                    variant="outlined"
                                                />
                                            </div>
                                            <div className="col-md-6">
                                                <TextField
                                                    value={user.eMail}
                                                    size="small"
                                                    color="secondary"
                                                    id="Name1"
                                                    label="E-mail"
                                                    fullWidth
                                                    variant="outlined"
                                                />
                                            </div>
                                        </div>
                                        <div className="row mt-3">
                                            <Col sm={12}>
                                                <Accordion>
                                                    <div className="ml-n3">
                                                        <Card.Header className="b-white">
                                                            <CustomToggle eventKey="permission">SEGURIDAD</CustomToggle>
                                                        </Card.Header>
                                                    </div>
                                                    <Accordion.Collapse eventKey="permission">
                                                        <Card.Body>
                                                            <Row>
                                                                <Col sm={6}>
                                                                    <TextField
                                                                        type="password"
                                                                        value={'64#$%$#568$#%#$%54500'}
                                                                        size="small"
                                                                        color="secondary"
                                                                        id="Name1"
                                                                        label="Contraseña"
                                                                        fullWidth
                                                                        variant="outlined"
                                                                    />
                                                                </Col>
                                                                <Col sm={6}>
                                                                    <ThemeProvider theme={inputsTheme}>
                                                                        <Button variant="contained" color="secondary" className=""
                                                                            onClick={() => setShowPassword(true)}
                                                                        >
                                                                            CAMBIAR CONTRASEÑA
                                                                            {permission ? <BsUnlockFill className="ml-3" /> : <BsLockFill className="ml-3" />}
                                                                        </Button>
                                                                    </ThemeProvider>
                                                                </Col>
                                                            </Row>
                                                        </Card.Body>
                                                    </Accordion.Collapse>
                                                </Accordion>
                                            </Col>
                                        </div>
                                        <div className="mt-5 text-right">
                                            <ThemeProvider theme={inputsTheme}>
                                                <Button variant="contained" color="secondary">
                                                    GUARDAR
                                                </Button>
                                            </ThemeProvider>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Col>
                </Row>
            </div>
            <MChangePassword show={showPassword} setShow={setShowPassword} user={user} type={1} />
        </>
    )
}
