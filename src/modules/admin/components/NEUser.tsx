import { useForm } from "react-hook-form";
import { Modal, Button, Row, Col } from "react-bootstrap";
import { BsXSquare, BsJustifyRight } from "react-icons/bs";


import { AdminService } from "../../../core/services/AdminService";
import { Toast } from "../../../utils/Toastify";
import { InputAdornment, MenuItem, TextField } from "@mui/material";
import { User } from "../../../shared/model/User";
import { IApplicationTypeRole } from "../model/Applicationtype";
import { useEffect, useState } from "react";

const _adminService = new AdminService();

interface INEUser {
  getShow: Function;
  dataShow: boolean;
  dataObj?: User | undefined;
  dataTitle: string;
  getAccount?: Function;
}

export const NEUser: React.FC<INEUser> = (props: INEUser) => {

  const { register, setValue, formState: { errors }, handleSubmit } = useForm();

  const [listRole, setListRole] = useState<IApplicationTypeRole[]>([]);

  const getRoleCatalog = () => {
    _adminService
      .getRoleCatalog()
      .subscribe(resp => {
        setListRole(resp);
      });
  };

  useEffect(() => {
    getRoleCatalog();
  }, [])

  const closeModal = () => {
    props.getShow(false);
  };

  const getValue = (dataTitle: string) => {
    if (dataTitle === "Crear") {
      setValue("entity", {
        Nit: "",
        RoleID: "",
        Name1: "",
        Name2: "",
        Surname1: "",
        Surname2: "",
        Tel: "",
        eMail: "",
        IDAccount: ""
      });
    } else if (dataTitle === "Editar") {
      setValue("entity", props.dataObj);
    }
  };

  getValue(props.dataTitle);

  const onSubmit = (data: any, e: any) => {
    e.preventDefault();
    const aux = data.entity;
    aux.RoleID = parseInt(aux.RoleID);
    if (props.dataTitle === 'Crear') {
      createAbstractAccount(aux);
    }
    if (props.dataTitle === 'Editar') {
      putAbstractAccount(aux);
    }
    closeModal();
  };

  const createAbstractAccount = (bean: any) => {
    _adminService.createAbstractAccount(bean)
      .subscribe(resp => {
        if (resp) {
          console.log(resp);
          updateAbstractAccount(resp.IDAccount, bean.RoleID, resp.Nit);
        }
      });
  }

  const updateAbstractAccount = (id: number, role: number, nit: number) => {
    _adminService.updateAbstractAccount(id, role)
      .subscribe(resp => {
        if (resp) {
          Toast.fire({
            icon: "success",
            title: "Se ha guardado con éxito!"
          })
          if (props.getAccount) { props.getAccount(nit) }
        }
        else {
          Toast.fire({
            icon: "error",
            title: "No se ha podido completar la acción"
          })
        }
      });
  }

  const putAbstractAccount = (bean: any) => {
    _adminService.putAbstractAccount(bean)
      .subscribe(resp => {
        if (resp) {
          Toast.fire({
            icon: "success",
            title: "Se ha guardado con éxito!"
          })
        }
        else {
          Toast.fire({
            icon: "error",
            title: "No se ha podido completar la acción"
          })
        }
      });
  }

  return (
    <Modal size="lg" show={props.dataShow} backdrop="static" centered keyboard={false}>
      <Modal.Header>
        <div className="title-modal">
          {props.dataTitle + " Usuario"}
        </div>
        <BsXSquare onClick={closeModal} />
      </Modal.Header>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Modal.Body>
          <Row className="mt-3">
            <Col sm={6}>
              <TextField
                type="number"
                size="small"
                id="nit"
                label="No. Identificación *"
                fullWidth
                variant="outlined"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <BsJustifyRight />
                    </InputAdornment>
                  )
                }}
                {...register("entity.Nit", { required: true })}
              />
              <span className="text-danger">{errors.entity ? errors.entity.Nit?.type === 'required' && "El campo Identificación es obligatorio." : ''}</span>
            </Col>
            <Col sm={6}>
              <TextField
                size="small"
                select
                fullWidth
                label=".:Roles:."
                id="roles"
                {...register("entity.RoleID", { required: true })}
              >
                {listRole.map((item: any) => (
                  <MenuItem value={item.IDRole}>
                    {item.Name}
                  </MenuItem>
                ))}
              </TextField>
              <span className="text-danger">{errors.entity ? errors.entity.RoleID?.type === 'required' && "El campo Rol es obligatorio." : ''}</span>
            </Col>
          </Row>
          <Row className="mt-3">
            <Col sm={6}>
              <TextField
                size="small"
                id="name1"
                label="Primer nombre *"
                fullWidth
                variant="outlined"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <BsJustifyRight />
                    </InputAdornment>
                  )
                }}
                {...register("entity.Name1", { required: true })}
              />
              <span className="text-danger">{errors.entity ? errors.entity.Name1?.type === 'required' && "El campo Primer Nombre es obligatorio." : ''}</span>
            </Col>
            <Col sm={6}>
              <TextField
                size="small"
                id="name1"
                label="Segundo nombre"
                fullWidth
                variant="outlined"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <BsJustifyRight />
                    </InputAdornment>
                  )
                }}
                {...register("entity.Name2")}
              />
            </Col>
          </Row>
          <Row className="mt-3">
            <Col sm={6}>
              <TextField
                size="small"
                id="Surname1"
                label="Primer apellido *"
                fullWidth
                variant="outlined"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <BsJustifyRight />
                    </InputAdornment>
                  )
                }}
                {...register("entity.Surname1", { required: true })}
              />
              <span className="text-danger">{errors.entity ? errors.entity.Surname1?.type === 'required' && "El campo Primer Apellido es obligatorio." : ''}</span>
            </Col>
            <Col sm={6}>
              <TextField
                size="small"
                id="Surname2"
                label="Segundo apellido"
                fullWidth
                variant="outlined"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <BsJustifyRight />
                    </InputAdornment>
                  )
                }}
                {...register("entity.Surname2")}
              />
            </Col>
          </Row>
          <Row className="mt-3">
            <Col sm={6}>
              <TextField
                size="small"
                id="Phone"
                label="Celular *"
                fullWidth
                variant="outlined"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <BsJustifyRight />
                    </InputAdornment>
                  )
                }}
                {...register("entity.Tel", { required: true })}
              />
              <span className="text-danger">{errors.entity ? errors.entity.Tel?.type === 'required' && "El campo Celular es obligatorio." : ''}</span>
            </Col>
            <Col sm={6}>
              <TextField
                size="small"
                id="email"
                label="Correo *"
                fullWidth
                variant="outlined"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <BsJustifyRight />
                    </InputAdornment>
                  )
                }}
                {...register("entity.eMail", { required: true })}
              />
              <span className="text-danger">{errors.entity ? errors.entity.eMail?.type === 'required' && "El campo Correo es obligatorio." : ''}</span>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={closeModal}>
            Cancelar
          </Button>
          <Button type="submit" variant="success">
            Guardar
          </Button>
        </Modal.Footer>
      </form>
    </Modal >
  );
};