import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import Dropdown from 'react-bootstrap/Dropdown';
import { useHistory } from "react-router-dom";
import { BsBoxArrowRight, BsFillFilePersonFill, BsGearFill, BsList } from "react-icons/bs";
import { startLogout } from '../../actions/Auth';
import { RootState } from '../../store/Store';
import { ReaderTypeDialog } from '../../modules/citizenData/components/ReaderTypeDialog';

interface INavBar { }

export const Navbar: React.FC<INavBar> = () => {
    var timer: any;
    let history = useHistory();
    const dispatch = useDispatch();
    const [abierto, setAbierto] = useState(false);
    const [nombreApp, setNombreApp] = useState("");
    const [Contador, setContador] = useState(0);

    const [show, setShow] = useState(false);

    const logout = () => {
        console.log('salio');
        dispatch(startLogout());
        history.push('/login');
        localStorage.setItem('c', 'f');
        localStorage.removeItem('usuario');
        window.removeEventListener('load', (e) => e);
        window.removeEventListener('mousemove', (e) => e);
        window.removeEventListener('mousedown', (e) => e);
        window.removeEventListener('touchstart', (e) => e);
        window.removeEventListener('click', (e) => e);
        window.removeEventListener('keydown', (e) => e);
        window.removeEventListener('load', (e) => e);
    }
    const { name } = useSelector((state: RootState) => state.appname);
    useEffect(() => {
        setNombreApp(name);
        window.addEventListener('load', (e) => { resetTimer() });
        window.addEventListener('mousemove', (e) => { resetTimer() });
        window.addEventListener('mousedown', (e) => { resetTimer() });
        window.addEventListener('touchstart', (e) => { resetTimer() });
        window.addEventListener('click', (e) => { resetTimer() });
        window.addEventListener('keydown', (e) => { resetTimer() });
        window.addEventListener('load', (e) => { resetTimer() });

    }, [name]);



    const resetTimer = () => {
        // timer = setTimeout(() => { logout(); }, 5000);
        clearTimeout(timer);
        timer = setTimeout(() => {
            setContador(Contador + 1)
            console.log(Contador);
            logout();
        }, 500000)

    }


    const getSesion = () => {
        if (localStorage.getItem('usuario')) {
            return JSON.parse(localStorage.getItem('usuario') ?? "")
        }
    }

    const mostrarLateral = () => {

        if (abierto === true) {
            document.getElementById('layoutSidenav_nav')!.style.transform = "translateX(-15rem)";
            setAbierto(false);
        } else {
            document.getElementById('layoutSidenav_nav')!.style.transform = "translateX(0)";
            setAbierto(true);
        }

    }

    return (
        <div>
            <nav className="topnav navbar navbar-expand shadow navbar-light " id="sidenavAccordion">
                <a className="navbar-brand" href="index.html">{nombreApp}</a>
                <button className="btn btn-icon btn-transparent-dark order-1 order-lg-0 mr-lg-2 ml-10" onClick={() => mostrarLateral()} id="sidebarToggle"><BsList></BsList></button>
                <ul className="navbar-nav align-items-center ml-auto">
                    <Dropdown className="nav-item dropdown no-caret mr-2 dropdown-user">
                        <Dropdown.Toggle className="btn btn-icon btn-transparent-dark dropdown-toggle" id="navbarDropdownUserImage" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><img className="img-fluid" src={process.env.PUBLIC_URL + "/assets/logo_advantage.png"} alt="Profile Mini" /></Dropdown.Toggle>
                        <Dropdown.Menu className="dropdown-menu dropdown-menu-right border-0 shadow animated--fade-in-up" aria-labelledby="navbarDropdownUserImage">
                            <h6 className="dropdown-header d-flex align-items-center">
                                <img className="dropdown-user-img" src="https://i.imgur.com/0eg0aG0.jpg" alt="Profile Mini" />
                                <div className="dropdown-user-details">
                                    {getSesion() ?
                                        <div>
                                            <div className="dropdown-user-details-name">{`${getSesion().Name1} ${getSesion().Surname1}`}</div>
                                            <div className="dropdown-user-details-email">{`${getSesion().eMail}`}</div>
                                        </div>
                                        :
                                        <div>
                                            <div className="dropdown-user-details-name">Valerie Luna</div>
                                            <div className="dropdown-user-details-email">vluna@aol.com</div>
                                        </div>}
                                </div>
                            </h6>
                            <div className="dropdown-divider"></div>
                            <Dropdown.Item className="dropdown-item" onClick={() => history.push('/userConfig')} >
                                <div className="dropdown-item-icon">
                                    <BsFillFilePersonFill />
                                </div>
                                Usuario
                            </Dropdown.Item>

                            <hr className="mb-0 mt-1" />
                            <Dropdown.Item className="dropdown-item-icon mt-2" onClick={logout}>
                                <div className="dropdown-item-icon">
                                    <BsBoxArrowRight />
                                </div>
                                Cerrar sesión
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </ul>
            </nav>
            <ReaderTypeDialog show={show} setShow={setShow} />
        </div>
    )
}