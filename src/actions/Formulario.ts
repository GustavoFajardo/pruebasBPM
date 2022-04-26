import { Dispatch } from "redux";

import { AdminService } from "../core/services/AdminService";
import { typesForm } from "../types/Types";

const _adminService = new AdminService();

export const ListDocuments = (id: number) => {
  return async (dispatch: Dispatch) => {
     _adminService.getFormCatalog(id).subscribe((resp)=>{
         console.log(resp)
     })
    
    // dispatch(updateForm(resp));
  };
};

export const updateForm = (docs:any) =>({
    type:typesForm.selected,
    payload:[...docs]
});


export const restartForm=()=>({
type:typesForm.restart
})