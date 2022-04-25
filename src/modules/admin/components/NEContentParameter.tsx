import { Modal, Button, Row, Col, Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { BsXSquare, BsJustifyRight } from "react-icons/bs";

import React from "react";
import { ListParameter } from "../model/ListParameter";
import { InputAdornment, TextField } from "@mui/material";
import { AdminService } from "../../../core/services/AdminService";
import { Toast } from "../../../utils/Toastify";

interface INEContentParameter {
  getShow: Function,
  dataShow: boolean,
  dataObj: ListParameter | undefined,
  dataTitle: string,
  IDTipoLista: string,
  refreshList: Function,
  id: number
}

const _adminService = new AdminService();

const NEContentParameter: React.FC<INEContentParameter> = (props: INEContentParameter) => {

  console.log(props.dataObj);

  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
    clearErrors,
  } = useForm();

  const updateListaParametros = (bean: any) => {
    _adminService
      .updateListaParametros(bean)
      .subscribe(rps => {
        if (rps) {
          props.refreshList(props.id);
          Toast.fire({
            icon: "success",
            title: "Se ha guardado con éxito!"
          })
        }
        else {
          Toast.fire({
            icon: "error",
            title: "No se podido completar la acción"
          })
        }
      })
  };

  const getValue = (dataTitle: string) => {
    console.log(props.dataObj);
    if (dataTitle === "Crear") {
      if (props.dataObj) {
        setValue("entity", {
          CodigoP: "",
          Valor: "",
          IDTipoLista: "",
          IDListaParametros: null,
        });
      }
    }
    if (dataTitle === "Editar") {
      setValue("entity", props.dataObj);
    }
  };

  console.log(props.dataTitle);
  getValue(props.dataTitle);

  const closeModal = () => {
    clearErrors("entity");
    props.getShow(false);
  };

  const onSubmit = (data: any, e: any) => {
    e.preventDefault();
    const aux = data.entity;
    aux.IDTipoLista = parseInt(props.IDTipoLista);
    updateListaParametros(aux);
    /* console.log(aux); */
    closeModal();
  };

  return (
    <Modal show={props.dataShow} backdrop="static" centered keyboard={false}>
      <Modal.Header>
        {props.dataTitle}
        <BsXSquare onClick={closeModal} />
      </Modal.Header>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Modal.Body>
          <Row>
            <Col sm={4} className="mt-3">
              <TextField

                id="outlined-required"
                label="Código"
                fullWidth
                variant="outlined"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <BsJustifyRight />
                    </InputAdornment>
                  )
                }}
                {...register("entity.CodigoP")}
              />
            </Col>
            <Col sm={8} className="mt-3">
              <TextField

                id="outlined-required"
                label="Valor *"
                fullWidth
                variant="outlined"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <BsJustifyRight />
                    </InputAdornment>
                  )
                }}
                {...register("entity.Valor", { required: true })}
              />
              <span className="text-danger">
                {errors.entity
                  ? errors.entity.Valor?.type === "required" &&
                  "El campo Valor es obligatorio."
                  : ""}
              </span>
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
  );
}

export default NEContentParameter;

