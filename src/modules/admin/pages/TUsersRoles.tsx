import React, { useEffect, useState } from 'react'
import { Col, Nav, Row, Tab } from 'react-bootstrap';


import { AdminService } from '../../../core/services/AdminService';
import { TRole } from '../components/TRole';
import { TUser } from '../components/TUser';
import { IApplicationTypeRole } from '../model/Applicationtype';

interface IUsersRoles { }

const _adminService = new AdminService();

export const TUsersRoles: React.FC<IUsersRoles> = () => {

    /* const [listRole, setListRole] = useState<IApplicationTypeRole[]>([]); */

    /* const getRoleCatalog = () => {
        _adminService
            .getRoleCatalog()
            .subscribe(resp => {                
                setListRole(resp);
            });
    }; */

    return (

        <div className="nWhite p-3 m-3 w-100">
            <Tab.Container id="left-tabs-example" defaultActiveKey="users">
                <Row>
                    <Col sm={12}>
                        <Nav variant="pills">
                            <Nav.Item>
                                <Nav.Link eventKey="users">Usuarios</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="roles">Roles</Nav.Link>
                            </Nav.Item>
                        </Nav>
                    </Col>
                    <Col sm={12}>
                        <Tab.Content>
                            <Tab.Pane eventKey="users">
                                <TUser />
                            </Tab.Pane>
                            <Tab.Pane eventKey="roles">
                                <TRole />
                            </Tab.Pane>
                        </Tab.Content>
                    </Col>
                </Row>
            </Tab.Container>
        </div>
    )
}
