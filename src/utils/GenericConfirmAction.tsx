import React from 'react'
import { Modal } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { ConfirmDialog } from 'primereact/confirmdialog';
import { Button } from 'primereact/button';
interface IGenericConfirmAction {
    show: boolean,
    setShow: Function,
    confirmAction: Function,
    title: string,
}

export const GenericConfirmAction: React.FC<IGenericConfirmAction> = (props: IGenericConfirmAction) => {

    const { handleSubmit } = useForm();

    const confirm = () => {
        props.confirmAction(true);
        props.setShow(false);
    };
    const cancel = () => {
        props.setShow(false);

    }

    return (

        <ConfirmDialog visible={props.show} onHide={() => props.setShow(false)} message="Esta seguro de continuar?"
            header="Confirmar" icon="pi pi-exclamation-triangle" accept={confirm} reject={cancel} acceptLabel="Confirmar" rejectClassName='p-button-secondary p-button-sm' acceptClassName="p-button-danger p-button-sm" />


        // <Modal show={props.show} backdrop="static" centered keyboard={false}>
        //     <Modal.Header>
        //         {props.title}
        //         <BsXSquare onClick={() => props.setShow(false)} />
        //     </Modal.Header>
        //     <form onSubmit={handleSubmit(onSubmit)}>
        //         <Modal.Footer>
        //             <Modal.Footer>
        //                 <div className="modal-footer-element">
        //                     <Button variant="contained" color="error" onClick={() => props.setShow(false)}>NO</Button>
        //                 </div>
        //                 <div className="modal-footer-element">
        //                     <Button type="submit" variant="contained" color="success">SI</Button>
        //                 </div>
        //             </Modal.Footer>
        //         </Modal.Footer>
        //     </form>
        // </Modal>
    )
}
