import React from "react";
import { TypeForm } from "../model/TypeForm";
import { Modal, Row, Col } from "react-bootstrap";
import { BsJustifyRight, BsXSquare } from "react-icons/bs";
import { useForm } from "react-hook-form";
import { AdminService } from "../../../core/services/AdminService";
import { Toast } from "../../../utils/Toastify";
import { ThemeProvider } from "@material-ui/core";
import { inputsTheme, useStyles } from "../../../utils/Themes";
import { InputAdornment, TextField, Button } from "@mui/material";
import { DataForm } from "../model/Form";
import { JsonService } from "../model/JsonService";

const _adminService = new AdminService();

interface INEJsonService {
  getShow: Function;
  dataShow: boolean;
  dataObj: JsonService | undefined;
  dataTitle: string;
  dataType: number;
}

const NEJsonService: React.FC<INEJsonService> = (props: INEJsonService) => {
  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
    clearErrors,
  } = useForm();

  const updateJsonService = (bean: JsonService) => {
    _adminService.updateJsonService(bean).subscribe((resp) => {
      console.log(resp);
      if (resp) {
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
        Description: "",
        URLService: "",
        IDJsonService: null,
      });
    } else if (dataTitle === "Editar") {
      setValue("entity", props.dataObj);
    }
  };

  getValue(props.dataTitle);

  const getSesion = () => {
    return JSON.parse(localStorage.getItem("usuario") ?? "");
  };

  const onSubmit = (data: any, e: any) => {
    e.preventDefault();
    const aux = data.entity;
    aux.State = 0;
    aux.IDJsonServiceClass = props.dataType;
    aux.IDEmployee = parseInt(getSesion().IDAccount);
    console.log(aux);
    updateJsonService(aux);
    closeModal();
  };

  const closeModal = () => {
    clearErrors("entity");
    props.getShow(false);
  };

  const classes = useStyles();

  return (
    <Modal show={props.dataShow} backdrop="static" centered keyboard={false}>
      <Modal.Header>
        {props.dataTitle} Servicio
        <BsXSquare onClick={closeModal} />
      </Modal.Header>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Modal.Body>
          <b>Campo obligatorio *</b>
          <Row>
            <Col sm={12} className="mt-3">
              <ThemeProvider theme={inputsTheme}>
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
                  {...register("entity.Name", { required: true })}
                />
              </ThemeProvider>
              <span className="text-danger">
                {errors.entity
                  ? errors.entity.Name?.type === "required" &&
                  "El campo Nombre es obligatorio."
                  : ""}
              </span>
            </Col>
            <Col sm={12} className="mt-3">
              <ThemeProvider theme={inputsTheme}>
                <TextField
                  id="formurl"
                  label="Url del Servicio *"
                  fullWidth
                  variant="outlined"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <BsJustifyRight />
                      </InputAdornment>
                    ),
                  }}
                  {...register("entity.URLService", { required: true })}
                />
              </ThemeProvider>
              <span className="text-danger">
                {errors.entity
                  ? errors.entity.URLService?.type === "required" &&
                  "El campo Url del Servicio es obligatorio."
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
                {...register("entity.Description")}
              />
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <div className="modal-element">
            <Button
              className={classes.button}
              variant="contained"
              color="error"
              onClick={closeModal}
            >
              CANCELAR
            </Button>
          </div>
          <div className="modal-element">
            <Button
              className={classes.button}
              type="submit"
              variant="contained"
              color="success"
            >
              GUARDAR
            </Button>
          </div>
        </Modal.Footer>
      </form>
    </Modal>
  );
};

export default NEJsonService;

