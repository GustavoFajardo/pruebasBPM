import { typesForm } from "../types/Types";
import { DataForm } from "../modules/configuration/model/Form";

const initialState: DataForm[] = [
  {
    IDFormClass: 0,
    IDForm: 0,
    Name: "",
    Description: "",
    IDEmployee: "",
    State: 0,
    UptoDate: new Date(),
    FormEngine: "",
    FormURLComponent: "",
    HtmlStored: false,
    HtmlBodyText: "",
    HtmlExtraText: "",
  },
];

export const Formulario = (
  state = initialState,
  actions: { type: string; payload?: {} }
) => {
  switch (actions.type) {
    case typesForm.selected:
      return [...state, actions.payload];

    case typesForm.restart:
      return [...initialState];

    default:
      return [...state];
  }
};
