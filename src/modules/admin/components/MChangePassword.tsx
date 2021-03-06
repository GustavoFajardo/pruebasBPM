import React, { useEffect, useRef, useState } from 'react'
import { Button, InputAdornment, TextField, ThemeProvider } from '@mui/material';
import { Col, Modal, Row } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { BsCheckCircleFill, BsKeyFill, BsXSquare } from 'react-icons/bs';
import { useDispatch } from 'react-redux';
import { changePassWord } from '../../../actions/Auth';
import { AdminService } from '../../../core/services/AdminService';

import { AuthService } from '../../../core/services/AuthService';
import { GlobalService } from '../../../core/services/GlobalService';
import { SSpinner } from '../../../shared/components/SSpinner';
import { User } from '../../../shared/model/User';
import { inputsTheme } from '../../../utils/Themes';
import { Toast, ToastCenter } from '../../../utils/Toastify';

interface IMChangePassword {
    show: boolean,
    setShow: Function,
    user: User,
    type: number
}

const _authService = new AuthService();
const _globalService = new GlobalService();
const _adminService = new AdminService();

export const MChangePassword: React.FC<IMChangePassword> = (props: IMChangePassword) => {

    const [state, setState] = useState(0);
    const [oldPassword, setOldPassword] = useState('');
    const [passwordOK, setPasswordOk] = useState(false);
    const [spinner, setSpinner] = useState(false);

    let pass = useRef<HTMLInputElement>();
    let word = useRef<HTMLInputElement>();

    useEffect(() => {
        return () => {
            setOldPassword('');
            setPasswordOk(false);
        }
    }, []);

    const dispatch = useDispatch();

    const {
        register,        
        formState: { errors },        
    } = useForm();


    const [passs, setPasss] = useState(true);
    const [wordd, setWordd] = useState(true);
    const [match, setMatch] = useState(false);

    const handlePasswordChange = () => {
        if (pass.current) {
            (pass.current.value.length === 0)
                ? setPasss(true)
                : (pass.current.value.length >= 8) ? setPasss(true) : setPasss(false);
            if (word.current) {
                (word.current.value.length === 0)
                    ? setWordd(true)
                    : (pass.current.value === word.current.value) ? setWordd(true) : setWordd(false);
                (pass.current.value === word.current.value && pass.current.value.length >= 8) ? setMatch(true) : setMatch(false);
            }
        }
    }

    const validateCurrentPassword = async () => {
        setSpinner(true);
        await _authService.login(props.user.eMail, oldPassword)
            .then((resp: any) => {
                setSpinner(false);
                if (resp.data.DataBeanProperties.ObjectValue) {
                    if (resp.data.DataBeanProperties.ObjectValue.DataBeanProperties.State === 6) {
                        Toast.fire({
                            icon: "warning",
                            title: (props.type === 0) ? "TOKEN Incorrecto" : "Contrase??a Incorrecta",
                        });
                    }
                    else if (resp.data.DataBeanProperties.ObjectValue.DataBeanProperties.State === 2) {
                        Toast.fire({
                            icon: "success",
                            title: (props.type === 0) ? "TOKEN Correcto" : "Contrase??a Correcto",
                        });
                        setPasswordOk(true);
                    }
                } else {
                    Toast.fire({
                        icon: "error",
                        title: "No se ha podido completar la acci??n.",
                    });
                }
            })
            .catch((err: any) => {
                console.log(err);
                Toast.fire({
                    icon: "error",
                    title: "ERROR - " + err,
                })
            })
    }

    const validateFingerPrint = async () => {
        setSpinner(true);
        await _globalService.validateFingerPrint((props.user.IDAccount + ""), 6, 1)
            .subscribe((resp) => {
                setSpinner(false);
                let jsonResp = JSON.parse((decodeURIComponent(resp)));
                console.log(jsonResp);
                if (jsonResp.Result !== null) {
                    if (jsonResp.Result.DataBeanProperties.Result === true) {
                        ToastCenter.fire({
                            icon: 'success',
                            title: 'Validaci??n Biom??trica Correcta'
                        });
                        setState(1);
                    } else {
                        ToastCenter.fire({
                            icon: 'error',
                            title: 'Validaci??n Biom??trica Incorrecta'
                        });
                    }
                } else {
                    Toast.fire({
                        icon: 'error',
                        title: 'No se pudo completar la accci??n'
                    });
                }
            });
    }

    const cambiarContrasena = async (idAccount: number, oldPassword: string, newPassword: string) => {
        await _adminService
            .cambiarContrasena(idAccount, oldPassword, newPassword)
            .then((rps: any) => {
                if (rps.data.DataBeanProperties.ObjectValue) {
                    if (rps.data.DataBeanProperties.ObjectValue.response === 'La contrase??a ha sido actualizada satisfactoriamente.') {
                        if (props.type === 0) {
                            ToastCenter.fire({
                                icon: 'warning',
                                title: 'Contrase??a Actualizada, debe iniciar sesi??n.'
                            });
                        } else {
                            Toast.fire({
                                icon: 'success',
                                title: 'Contrase??a Actualizada'
                            });
                        }
                        dispatch(changePassWord(false, props.user))
                        props.setShow(false);
                        window.location.reload();
                    }
                }
                else {
                    Toast.fire({
                        icon: 'error',
                        title: 'No se pudo completar la accci??n'
                    })
                }
            })
            .catch(e => {
                console.error(e)
                Toast.fire({
                    icon: 'error',
                    title: 'No se pudo completar la accci??n'
                })
            });
    }

    const onSubmit = (e: any) => {
        e.preventDefault();
        validateCurrentPassword();
    }

    const onSubmitFinger = (e: any) => {
        e.preventDefault();
        validateFingerPrint();
    }
    const onSubmitSave = (e: any) => {
        e.preventDefault();
        if (word.current) {
            cambiarContrasena(props.user.IDAccount, oldPassword, word.current.value);
        }
    }


    const renderSwitch = () => {
        switch (state) {
            case 0: return (
                <div className="d-flex justify-content-center">
                    <form>
                        {passwordOK
                            ? <div className="m-3 d-flex flex-column" ><b>Para continuar por favor valide su huella del</b> <b>INDICE - MANO DERECHA</b></div>
                            : (props.type === 0) ? <b className="m-3"> Por favor introduzca TOKEN enviado a su correo</b> : <b className="m-3"> Por favor introduzca su contrase??a actual</b>
                        }
                        <TextField
                            disabled={passwordOK}
                            value={oldPassword}
                            className="mt-3"
                            type="password"
                            size="small"
                            color="secondary"
                            id="passWord"
                            key={0}
                            label={(props.type === 0) ? "TOKEN" : "Contrase??a Actual *"}
                            fullWidth
                            variant="outlined"
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        {passwordOK
                                            ? <BsCheckCircleFill />
                                            : <BsKeyFill />
                                        }
                                    </InputAdornment>
                                )
                            }}
                            onChange={(e) => setOldPassword(e.target.value)}
                        />
                        {<span className="text-danger"></span>}
                        {!passwordOK
                            ? <div className="d-flex justify-content-center mt-3 ">
                                <ThemeProvider theme={inputsTheme}>
                                    <Button variant="contained" color="secondary" className="w-100" type="submit" disabled={oldPassword.length < 8 ? true : false}
                                        onClick={(e) => onSubmit(e)}
                                    >
                                        VALIDAR
                                    </Button>
                                </ThemeProvider>
                            </div>
                            : <div className="d-flex justify-content-center mt-3 ">
                                <ThemeProvider theme={inputsTheme}>
                                    <Button variant="contained" color="secondary" className="w-100"
                                        onClick={(e) => onSubmitFinger(e)}
                                    >
                                        VALIDAR HUELLA
                                    </Button>
                                </ThemeProvider>
                            </div>
                        }
                    </form>
                </div>
            )

            case 1: return (
                <div className="d-flex justify-content-center">
                    <div className="">
                        <b className="mt-3"> Por favor introduzca su NUEVA contrase??a</b>
                        <Row>
                            <Col sm={12}>
                                <TextField
                                    className="mt-3"
                                    type="password"
                                    size="small"
                                    color="secondary"
                                    id="pass"
                                    label="Contrase??a Nueva *"
                                    fullWidth
                                    variant="outlined"
                                    inputRef={pass}
                                    key={1}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <BsKeyFill />
                                            </InputAdornment>
                                        )
                                    }}
                                    {...register("entity.Pass", { required: true })}
                                    onChange={handlePasswordChange}
                                />
                                {!passs && <span className="text-danger">La contrase??a debe tener al menos 8 caracteres</span>}
                                <span className="text-danger">{errors.entity ? errors.entity.Pass?.type === 'required' && "El campo Contrase??a Nueva es obligatorio." : ''}</span>
                            </Col>
                            <Col sm={12}>
                                <TextField
                                    className="mt-3"
                                    type="password"
                                    size="small"
                                    color="secondary"
                                    id="word"
                                    label="Confirmar contrase??a *"
                                    fullWidth
                                    variant="outlined"
                                    inputRef={word}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <BsKeyFill />
                                            </InputAdornment>
                                        )
                                    }}
                                    {...register("entity.Word", { required: true })}
                                    onChange={handlePasswordChange}
                                />
                                {(word.current !== undefined && word.current.value.length > 0) ?
                                    (!wordd)
                                        ? <span className="text-danger">Las contrase??as NO coinciden</span>
                                        : <span className="text-success">Las contrase??as coinciden</span>
                                    : ""
                                }
                                <span className="text-danger">{errors.entity ? errors.entity.Word?.type === 'required' && "El campo Confirmar Contrase??a es obligatorio." : ''}</span>
                            </Col>
                            <Col sm={12} className="mt-3">
                                <ThemeProvider theme={inputsTheme}>
                                    <Button variant="contained" color="success" className="w-100" type="submit" disabled={match ? false : true}
                                        onClick={(e) => onSubmitSave(e)}
                                    >
                                        CONFIRMAR
                                    </Button>
                                </ThemeProvider>
                            </Col>
                        </Row>
                    </div>
                </div>
            )
            default:
                break;
        }
    }

    return (
        <>
            <Modal show={props.show} backdrop="static" centered keyboard={false}>
                <Modal.Header>
                    Cambiar contrase??a
                    <BsXSquare onClick={() => {
                        props.setShow(false);
                        setOldPassword('');
                        setPasswordOk(false);
                        setState(0);
                        window.location.reload();
                    }} />
                </Modal.Header>
                <Modal.Body>
                    {renderSwitch()}
                </Modal.Body>
            </Modal>
            <SSpinner show={spinner} />
        </>
    )
}
