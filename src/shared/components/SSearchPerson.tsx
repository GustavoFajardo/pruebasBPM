import { Modal, Row, Col, Form, ListGroup } from "react-bootstrap";
import { FaTimes } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { Toast } from "../../utils/Toastify";
import { GlobalService } from "../../core/services/GlobalService";
import { BsFillPersonPlusFill, BsPlus, BsSearch } from "react-icons/bs";
import { User } from "../model/User";
import { IconButton, InputAdornment, MenuItem, Button, TextField, ThemeProvider } from "@mui/material";
import { inputsTheme, useStyles } from "../../utils/Themes";
import { NEUser } from "../../modules/admin/components/NEUser";

const _globalService = new GlobalService();

interface ISSearchPerson {
  getShow: Function,
  getPerson: Function,
  dataShow: boolean
}

const SSearchPerson: React.FC<ISSearchPerson> = (props: ISSearchPerson) => {

  const { handleSubmit, setValue } = useForm();
  const [type, setType] = useState<number>(0);
  const [list, setList] = useState<User[]>([]);
  const [text, setText] = useState("");
  const [show, setShow] = useState(false);


  const onCloseNew = (data: boolean, id: number) => {
    setShow(data);
    if (id !== undefined) { getAccountByNit(id) };
  }

  const closeModal = () => {
    setList([]);
    setValue("entity", {
      Type: "",
      Name: ""
    });
    props.getShow(false);
  };

  const onChangeSelect = (e: any) => {
    setType(e);
  };

  const getAccountByNit = (nit: any) => {
    _globalService.getAccountByNit(nit)
      .subscribe((resp: any) => {
        console.log(nit, resp);
        if (resp.length > 0) {
          setList(resp);
          Toast.fire({
            icon: "success",
            title: "Se ha encontrado coincidencias",
          });
        }
        else {
          Toast.fire({
            icon: "error",
            title: "No se ha encontrado coincidencias",
          });
        }
      });
  }

  const getAccount = (name: any, lastName: any) => {
    _globalService.getAccount(name, lastName)
      .subscribe(resp => {
        if (resp.length > 0) {
          setList(resp);
          Toast.fire({
            icon: "success",
            title: "Se ha encontrado coincidencias",
          });
        }
        else {
          Toast.fire({
            icon: "error",
            title: "No se ha encontrado coincidencias",
          });
        }
      })
  }

  const onSubmit = () => {
    if (type === 1) {
      getAccountByNit(parseInt(text));
    }
    if (type === 2) {
      getAccount(text, null);
    }
    if (type === 3) {
      getAccount(null, text);
    }
  };

  const handleWrite = (e: any) => {
    setText(e);
  }

  const getUser = (data: any) => {
    props.getPerson(data);
    closeModal();
  }

  const classes = useStyles();

  return (
    <>
      <Modal show={props.dataShow} backdrop="static" centered keyboard={false}>
        <Modal.Header>
          Buscar Persona
          <FaTimes onClick={closeModal} />
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Row className="mt-3">
              <Col sm={12} className="mb-3 d-flex justify-content">
                <ThemeProvider theme={inputsTheme}>
                  <Button
                    color="secondary"

                    className="mr-2 w-100"
                    variant="contained"
                    endIcon={<BsFillPersonPlusFill
                    />}
                    onClick={() => {
                      setShow(true);
                    }}
                  >CREAR USUARIO
                  </Button>
                </ThemeProvider>
              </Col>
              <Col sm={6} className="d-flex justify-content-end align-items-center">
                <TextField
                  size="small"
                  select
                  fullWidth
                  label=".: Buscar por: :."
                  id="type"
                  onChange={(e) => onChangeSelect(e.target.value)}
                >
                  <MenuItem key={1} value={1}>
                    Identificación
                  </MenuItem>
                  <MenuItem key={2} value={2}>
                    Nombres
                  </MenuItem>
                  <MenuItem key={3} value={3}>
                    Apellidos
                  </MenuItem>
                </TextField>
              </Col>
              <Col sm={6} className="d-flex justify-content-end align-items-end">
                <TextField
                  size="small"
                  className={classes.field}
                  fullWidth
                  label="Escrbir"
                  id="write"
                  onChange={(e) => handleWrite(e.target.value)}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton type="submit" onClick={onSubmit}>
                          <BsSearch />
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />
              </Col>
            </Row>

          </Form>
          <Row className="mt-3">
            <Col sm={12}>
              <ListGroup>
                {list.map(item =>
                  <ListGroup.Item key={item.IDAccount}>
                    <div>
                      <IconButton
                        onClick={() => getUser(item)}
                      >
                        <BsPlus />
                      </IconButton>
                      {item.IDAccount} - {item.EntityName}
                    </div>
                  </ListGroup.Item>
                )}
              </ListGroup>
            </Col>
          </Row>
        </Modal.Body>
      </Modal>
      {show &&
        <NEUser
          getShow={onCloseNew}
          dataShow={show}
          dataTitle={"Crear"}
          getAccount={getAccountByNit}
        />
      }
    </>
  );
}

export default SSearchPerson;
