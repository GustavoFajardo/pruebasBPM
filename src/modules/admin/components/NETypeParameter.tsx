import React from "react";
import { Modal, Button, Row, Col } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { BsXSquare, BsJustifyRight } from "react-icons/bs";
import { InputAdornment, TextField } from "@mui/material";

import { ListParameter } from "../model/ListParameter";

import { useEffect } from "react";
import { AdminService } from "../../../core/services/AdminService";
import { Toast } from "../../../utils/Toastify";

interface INETypeParameter {
  getShow: Function;
  dataShow: boolean;
  dataObj: ListParameter | undefined;
  dataTitle: string;
  refreshList: Function;
  codeList: number[];
}

const _adminService = new AdminService();

const NETypeParameter: React.FC<INETypeParameter> = (
  props: INETypeParameter
) => {
  console.log(props.dataObj);

  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
    clearErrors,
  } = useForm();

  useEffect(() => {
  }, [])

  const updateTipoLista = (bean: any) => {
    if (props.codeList.includes(bean.Codigo)) {
      Toast.fire({
        icon: "warning",
        title: "El Código " + bean.Codigo + " ya está en uso",
      })
    }
    else {
      _adminService
        .updateTipoLista(bean)
        .subscribe(rps => {
          if (rps) {
            props.refreshList();
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
      closeModal();
    }
  };

  const getValue = (dataTitle: string) => {
    console.log(props.dataObj);
    if (dataTitle === "Crear") {
      if (props.dataObj) {
        setValue("entity", {
          Codigo: "",
          Descripcion: "",
          Nombre: "",
          IDTipoLista: null,
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
    aux.Codigo = parseInt(aux.Codigo);
    updateTipoLista(aux);
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
            <Col sm={6} className="mt-3">
              <TextField
                type="number"

                id="outlined-required"
                label="Código *"
                fullWidth
                variant="outlined"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <BsJustifyRight />
                    </InputAdornment>
                  )
                }}
                {...register("entity.Codigo", { required: true })}
              />
              <span className="text-danger">
                {errors.entity
                  ? errors.entity.Codigo?.type === "required" &&
                  "El campo Código es obligatorio."
                  : ""}
              </span>
            </Col>
            <Col sm={6} className="mt-3">
              <TextField

                id="outlined-required"
                label="Nombre *"
                fullWidth
                variant="outlined"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <BsJustifyRight />
                    </InputAdornment>
                  ),
                }}
                {...register("entity.Nombre", { required: true })}
              />
              <span className="text-danger">
                {errors.entity
                  ? errors.entity.Nombre?.type === "required" &&
                  "El campo Nombre es obligatorio."
                  : ""}
              </span>
            </Col>
            <Col sm={12} className="mt-3">
              <TextField

                id="outlined-required"
                label="Descripción"
                fullWidth
                variant="outlined"
                multiline
                rows={5}
                {...register("entity.Descripcion")}
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
  );
};

export default NETypeParameter;
