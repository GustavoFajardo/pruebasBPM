import { useEffect, useRef, useState } from "react";
import { ConfigService } from "../../../core/services/ConfigService";
import Swal from "sweetalert2";
import { DataTable } from "primereact/datatable";
import { useSelector } from "react-redux";
import { CharacterizationK } from "../model/Characterization";
import { RootState } from "../../../store/Store";
import { Column } from "primereact/column";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Toolbar } from "primereact/toolbar";
import { InputText } from "primereact/inputtext";
import withReactContent from "sweetalert2-react-content";
import { Saludo } from "./Saludo";

const MySwal = withReactContent(Swal);
const _configService = new ConfigService();

interface ICharacterization {}

export const T_CharacterizationPrueba = () => {
  const [idDelete, setIdDelete] = useState(0);
  const [listCharacterization, setListCharacterization] = useState<
    CharacterizationK[]
  >([]);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const [showSpinner, setShowSpinner] = useState(true);
  const [show, setShow] = useState(false);
  const [formdata, setformdata] = useState<CharacterizationK>();
  const [title, setTitle] = useState("");
  const [showDelete, setShowDelete] = useState(false);
  const toast = useRef(null);
  const [selection, setSelection] = useState<CharacterizationK[]>([]);

  const { items } = useSelector((state: RootState) => state.itemsperpage);

  const getListCharacterization = () => {
    setShowSpinner(true);
    _configService.getCharacterizationCatalog().subscribe((res) => {
      setShowSpinner(false);
      if (res) {
        setListCharacterization(res);
      } else {
        Swal.fire({
          icon: "error",
          title: "No se ha cargado la información",
        });
      }
    });
  };

  useEffect(() => {
    getListCharacterization();
  }, []);

  const leftToolbarTemplate = () => {
    return (
      <>
        <Button
          icon="pi pi-plus"
          tooltip="Añadir"
          tooltipOptions={{
            position: "bottom",
            mouseTrack: true,
            mouseTrackTop: 15,
          }}
          className="p-button-success p-button-sm mr-2"
          onClick={() => {
            Swal.fire({
              title: <h4> Crear </h4>
            })
          }}
        />
        <Button
          icon="pi pi-trash "
          className="p-button-danger p-button-sm mr-2"
          tooltip="Eliminar"
          tooltipOptions={{
            position: "bottom",
            mouseTrack: true,
            mouseTrackTop: 15,
          }}
          disabled={selection.length === 0}
          onClick={() => {
            
          }}
        />
        <Button
          icon="pi pi-pencil"
          className="p-button-warning p-button-sm mr-2"
          tooltip="Editar"
          tooltipOptions={{
            position: "bottom",
            mouseTrack: true,
            mouseTrackTop: 15,
          }}
          disabled={selection.length === 0}
          onClick={() => {
            // eslint-disable-next-line array-callback-return
            selection.map((item) => {

            });
          }}
        />
      </>
    );
  };
  const rightToolbarTemplate = () => {
    return (
      <>
        <span className="mr-2 p-input-icon-left">
          <i className="pi pi-search" />
          <InputText type="search" />
        </span>
      </>
    );
  };

  return (
    <>
      <Card
        title="Caracterizacion"
        style={{
          width: "100%",
        }}
      >
        <Toolbar
          left={leftToolbarTemplate}
          right={rightToolbarTemplate}
        ></Toolbar>
        <DataTable
          value={listCharacterization}
          responsiveLayout="scroll"
          resizableColumns
          size="large"
          selection={selection}
          onSelectionChange={(e) => {
            setSelection(e.value);
          }}
          dataKey="id"
        >
          <Column
            selectionMode="multiple"
            headerStyle={{ width: "3em" }}
          ></Column>
          <Column field="IDCharacterization" header="id" sortable></Column>
          <Column field="Name" header="Nombre" sortable></Column>
          <Column field="Description" header="Descripcion" sortable></Column>
          <Column
            field="CustomerTypeName"
            header="Tipo Cliente"
            sortable
          ></Column>
        </DataTable>
      </Card>
    </>
  );
};
