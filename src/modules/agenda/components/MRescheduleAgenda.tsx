import React, { useState } from 'react'
import { Modal } from 'react-bootstrap';
import { BsXSquare } from 'react-icons/bs';
import { SSpinner } from '../../../shared/components/SSpinner';
import { NEMeet } from './NEMeet';

interface IMRescheduleAgenda {
    show: boolean,
    setShow: Function,
    idAgenda: number,
}

export const MRescheduleAgenda: React.FC<IMRescheduleAgenda> = (props: IMRescheduleAgenda) => {

    const [spinner, setSpinner] = useState(false);

    return (
        <>
            <Modal show={props.show} backdrop="static" centered keyboard={false}>
                <Modal.Header>
                    Re-programar cita
                    <BsXSquare onClick={() => props.setShow(false) } />
                </Modal.Header>
                <Modal.Body>
                    <NEMeet IDProcedureIMP={undefined} IDAgenda={props.idAgenda} type={1} />
                </Modal.Body>
            </Modal>
            <SSpinner show={spinner} />
        </>
    )
}
