import React from "react";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { AdminService } from "../../../core/services/AdminService";
import { Toast } from "../../../utils/Toastify";
import { IApplicationTypeModule } from "../model/Applicationtype";
import { TextField } from "@material-ui/core";
import { InputAdornment } from "@mui/material";
import { BsTextRight, BsXSquare } from "react-icons/bs";

interface INEModules {
  getShow: Function;
  dataShow: boolean;
  dataObj: IApplicationTypeModule | undefined;
  dataTitle: string;
}

const _adminService = new AdminService();

export const NEModules: React.FC<INEModules> = (props: INEModules) => {
  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
    clearErrors,
  } = useForm();

  console.log(props.dataObj);

  const updateApplicationType = (bean: IApplicationTypeModule) => {
    _adminService.updateApplicationType(bean).subscribe(res => {
      if (res) {
        Toast.fire({
          icon: "success",
          title: "Se ha guardado con éxito!",
        });
      } else {
        Toast.fire({
          icon: "error",
          title: "No se ha podido completar la acción",
        });
      }
    });
  };

  const getValue = (dataTitle: string) => {
    if (dataTitle === "Crear") {
      setValue("entity", {
        Name: "",
        Purpose: "",
        IDApplicationType: null,
      });
    } else if (dataTitle === "Editar") {
      setValue("entity", props.dataObj);
    }
  };

  getValue(props.dataTitle);

  const closeModal = () => {
    clearErrors("entity");
    props.getShow(false);
  };

  const onSubmit = (data: any, e: any) => {
    e.preventDefault();
    updateApplicationType(data.entity);
    closeModal();
  };

  return (
    <>
      <Modal
        size="sm"
        show={props.dataShow}
        backdrop="static"
        centered
        keyboard={false}
      >
        <Modal.Header>
          {props.dataTitle + " Módulo"}
          <BsXSquare onClick={closeModal} />
        </Modal.Header>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Modal.Body>
            <Row>
              <Col sm={12} className="mt-3">
                <TextField
                  id="outlined-required"
                  label="Nombre *"
                  fullWidth
                  color='secondary'
                  variant="outlined"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <BsTextRight />
                      </InputAdornment>
                    ),
                  }}
                  {...register("entity.Name", { required: true })}
                />
              </Col>
              <Col sm={12} className="mt-3">
                <TextField
                  id="outlined-required"
                  label="Icono *"
                  color='secondary'
                  fullWidth
                  variant="outlined"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <BsTextRight />
                      </InputAdornment>
                    ),
                  }}
                  {...register("entity.Purpose", { required: true })}
                />
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="danger" onClick={closeModal}>
              CANCELAR
            </Button>
            <Button type="submit" variant="success">
              GUARDAR
            </Button>
          </Modal.Footer>
        </form>
      </Modal>
    </>
  );
};
