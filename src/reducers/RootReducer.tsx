import { combineReducers } from "redux";
import { AuthReducer } from "./AuthReducer";
import { AppNameReducer, BusinessReducer, CharacterizationsReducer, ItemsPerPageReducer, PermisoReducer, ProcedureReducer } from "./ConfigReducer";
import {Formulario} from './FormsReducer'

export const RootReducer = combineReducers({
    auth: AuthReducer,
    business: BusinessReducer,
    characterization: CharacterizationsReducer,
    procedure: ProcedureReducer,
    itemsperpage: ItemsPerPageReducer,
    appname: AppNameReducer,
    permiso: PermisoReducer,
    formularios:Formulario
})