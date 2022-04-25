import { map, Observable } from "rxjs";
import { IActivityType } from "../../modules/configuration/model/ActivityType";
import { IAgendaSeccional } from "../../modules/agenda/model/AgendaSeccional";
import { IBusinessCharacterization } from "../../modules/configuration/model/BusinessCharacterization";
import { Characterization, CharacterizationK } from "../../modules/configuration/model/Characterization";
import { ICustomerType } from "../../modules/configuration/model/CustomerType";
import { IDocumentCharacterization } from "../../modules/configuration/model/DocumentCharacterization";
import { MemberWorkGroup } from "../../modules/configuration/model/MemberWorkGroup";
import { Office } from "../../modules/configuration/model/Office";
import { OfficeBusinessProcess } from "../../modules/configuration/model/OfficeBusinessProcess";
import { getSesion } from "../../utils/UseProps";
import http from "../http-common";
import http2 from "../http-forms";

import { ServerResponse } from "../model/server-response.interface";
import api from "../settings/api";

export class ConfigService {
  private url = "/jsserver";

  //:::://:::://..:: BUSINESS SERVICES ::..//..//:::://:::://

  updateBusinessProcess(bean: any) {
    const parametros = {
      IDClient: "$#HHJGUY9773H5MNKD65389745KJDFGDGG==",
      ServiceName: "BpmService",
      WSToken: "$#HHJGUYUHSDFGS546546DFH654SGHUJJFF==",
      MethodHash:
        "com.quickbpm.bean.BusinessProcess_updateBusinessProcess_com.quickbpm.bean.BusinessProcess",

      ArgumentList: [
        {
          DataBeanProperties: bean,
          DataBeanName: "com.quickbpm.bean.BusinessProcess",
        },
      ],
    };
    const data = JSON.stringify(parametros);
    return http.post(this.url, data);
  }

  getBusinessProcessCatalog(idBusinessClass: number | null, idCustomerType: number | null, idCharacterization: number | null) {
    const parametros = {
      IDClient: "$#HHJGUY9773H5MNKD65389745KJDFGDGG==",
      ServiceName: "BpmService",
      WSToken: "$#HHJGUYUHSDFGS546546DFH654SGHUJJFF==",
      MethodHash:
        "java.util.List_getBusinessProcessCatalog_Number_Boolean_Boolean_Number_Number_Number",
      ArgumentList:
        [null, null, null, idBusinessClass, idCustomerType, idCharacterization],
    };
    const data = JSON.stringify(parametros);
    return http.post(this.url, data);
  }

  getSateListForBusinessProcess() {
    const parametros = {
      IDClient: "$#HHJGUY9773H5MNKD65389745KJDFGDGG==",
      ServiceName: "BpmService",
      WSToken: "$#HHJGUYUHSDFGS546546DFH654SGHUJJFF==",
      MethodHash: "java.util.List_getSateListForBusinessProcess_String",
      ArgumentList: [null],
    };
    const data = JSON.stringify(parametros);
    return http.post(this.url, data);
  }

  getProcedureImpByAccount(idBusinessProcess: any, idAccount: any, init: any, final: any, state: any) {
    const parametros = {
      IDClient: "$#HHJGUY9773H5MNKD65389745KJDFGDGG==",
      ServiceName: "BpmService",
      WSToken: "$#HHJGUYUHSDFGS546546DFH654SGHUJJFF==",
      MethodHash: "java.util.List_getProcedureImpByAccount_Number_Number_java.util.Date_java.util.Date_Number",
      ArgumentList: [
        idBusinessProcess,
        idAccount,
        init,
        final,
        state
      ],
    };
    const data = JSON.stringify(parametros);
    return http.post(this.url, data);
  }

  deleteBusinessProcess(id: number) {
    const parametros = {
      ServiceName: "BpmService",
      MethodHash: "void_deleteBusinessProcess_Number",
      ArgumentList: [id],
    };
    const data = JSON.stringify(parametros);
    return http.post(this.url, data);
  }

  //..//..//...:: CHARACTERIZATION SERVICES ::..//..//..//..

  public getBusinessClassCatalog(): Observable<Characterization[]> {
    const parametros = {
      IDClient: "$#HHJGUY9773H5MNKD65389745KJDFGDGG==",
      ServiceName: "BpmService",
      WSToken: "$#HHJGUYUHSDFGS546546DFH654SGHUJJFF==",
      MethodHash: "java.util.List_getBusinessClassCatalog_Number",
      ArgumentList: [null],
    };
    const data = JSON.stringify(parametros);
    return api.post<ServerResponse<Characterization>>(this.url, data)
      .pipe(
        map((value: any) => {
          if (value.DataBeanProperties.ObjectValue) {
            return value.DataBeanProperties.ObjectValue.map(
              (value1: any) => value1.DataBeanProperties
            );
          }
          return [];
        })
      );
  }

  updateBusinessClass(bean: Characterization): Observable<Characterization> {
    const parametros = {
      IDClient: "$#HHJGUY9773H5MNKD65389745KJDFGDGG==",
      ServiceName: "BpmService",
      WSToken: "$#HHJGUYUHSDFGS546546DFH654SGHUJJFF==",
      MethodHash:
        "com.quickbpm.bean.BusinessClass_updateBusinessClass_com.quickbpm.bean.BusinessClass",

      ArgumentList: [
        {
          DataBeanProperties: bean,
          DataBeanName: "com.quickbpm.bean.BusinessClass",
        },
      ],
    };
    const data = JSON.stringify(parametros);
    return api
      .post<any>(this.url, data)
      .pipe(
        map(
          (value) =>
            value.DataBeanProperties.ObjectValue
              .DataBeanProperties as Characterization
        )
      );
  }

  deleteBusinessClass(id: number): Observable<any> {
    const parametros = {
      IDClient: "$#HHJGUY9773H5MNKD65389745KJDFGDGG==",
      ServiceName: "BpmService",
      WSToken: "$#HHJGUYUHSDFGS546546DFH654SGHUJJFF==",
      MethodHash: "Integer_deleteBusinessClass_Number",

      ArgumentList: [id],
    };
    const data = JSON.stringify(parametros);
    return api.post(this.url, data);
  }

  getBusinessClassByCustomerType(idCustomer: number) {
    const parametros = {
      "IDClient": "$#HHJGUY9773H5MNKD65389745KJDFGDGG==",
      "ServiceName": "BpmService",
      "WSToken": "$#HHJGUYUHSDFGS546546DFH654SGHUJJFF==",
      "MethodHash": "java.util.List_getBusinessClassByCustomerType_Number",
      "ArgumentList": [
        idCustomer
      ]
    };
    const data = JSON.stringify(parametros);
    return api.post(this.url, data);
  }

  getCharacterizationByCustomerType(idCustomer: number) {
    const parametros = {
      "ServiceName": "BpmService",
      "MethodHash": "java.util.List_getCharacterizationCatalogByCustomerType_Number",
      "ArgumentList": [
        idCustomer
      ]
    };
    const data = JSON.stringify(parametros);
    return api.post(this.url, data);
  }




  //:::://:::://..:: PROCEDURE SERVICES ::..//..//:::://:::://

  getProcedureList(id?: number) {
    const parametros = {
      ServiceName: "OrangeBase",
      MethodHash: "java.util.List_getProcedureList_Number_String_Number_Number",
      ArgumentList: [id, null, null, null],
    };
    const data = JSON.stringify(parametros);
    return http.post(this.url, data);
  }

  getProcedureList2(id?: number) {
    const parametros = {
      ServiceName: "BpmService",
      MethodHash: "java.util.List_getProcedureList_Number_String_Number_Number",
      ArgumentList: [id, null, null, null],
    };
    const data = JSON.stringify(parametros);
    return api.post(this.url, data);
  }

  getProcedureDocumentCatalogByType(id: number, type: number) {
    console.log(id, type);
    const parametros = {
      ServiceName: "BpmService",
      MethodHash:
        "java.util.List_getProcedureDocumentCatalogByType_Number_Number_Number",
      ArgumentList: [id, type, null],
    };
    const data = JSON.stringify(parametros);
    return http.post(this.url, data);
  }

  getProcedureDocumentCatalog(id: number) {
    console.log(id);

    const parametros = {
      ServiceName: "BpmService",
      MethodHash: "java.util.List_getProcedureDocumentCatalog_Number",
      ArgumentList: [id],
    };
    const data = JSON.stringify(parametros);

    return http.post(this.url, data);
  }

  updateProcedure(bean: any) {
    const parametros = {
      ServiceName: "BpmService",
      MethodHash:
        "com.quickbpm.bean.Procedure_updateProcedure_com.quickbpm.bean.Procedure",
      ArgumentList: [
        {
          DataBeanProperties: bean,
          DataBeanName: "com.quickbpm.bean.Procedure",
        },
      ],
    };
    const data = JSON.stringify(parametros);
    return http.post(this.url, data);
  }


  deleteProcedure(id: number) {
    const parametros = {
      ServiceName: "BpmService",
      MethodHash: "Integer_deleteProcedure_Number_Number",
      ArgumentList: [id, parseInt(getSesion().IDAccount)],
    };
    const data = JSON.stringify(parametros);
    return http.post(this.url, data);
  }

  // MÉTODOS DE LISTAR ESTADOS (PROCEDURE)

  getBusinessStateCatalog(id: number) {
    const parametros = {
      ServiceName: "BpmService",
      MethodHash: "java.util.List_getBusinessStateCatalog_Number",
      ArgumentList: [id],
    };
    const data = JSON.stringify(parametros);
    return http.post(this.url, data);
  }

  getProcedureStateCatalog(id: number) {
    const parametros = {
      ServiceName: "BpmService",
      MethodHash: "java.util.List_getProcedureStateCatalog_Number",
      ArgumentList: [id],
    };
    const data = JSON.stringify(parametros);
    return http.post(this.url, data);
  }

  // Procedure Documento
  updateProcedureDocument(bean: any) {
    const parametros = {
      ServiceName: "BpmService",
      MethodHash:
        "com.quickbpm.bean.ProcedureDocument_updateProcedureDocument_com.quickbpm.bean.ProcedureDocument",
      ArgumentList: [
        {
          DataBeanProperties: bean,
          DataBeanName: "com.quickbpm.bean.ProcedureDocument",
        },
      ],
    };
    const data = JSON.stringify(parametros);
    return http.post(this.url, data);
  }

  deleteProcedureDocument(id: number) {
    const parametros = {
      ServiceName: "BpmService",
      MethodHash: "Integer_deleteProcedureDocument_Number_Number",
      ArgumentList: [id, parseInt(getSesion().IDAccount)],
    };
    const data = JSON.stringify(parametros);
    return http.post(this.url, data);
  }

  /* getWorkGroupMemberCatalog(idLn: number) {
    const parametros = {
      "IDClient": "$#HHJGUY9773H5MNKD65389745KJDFGDGG==",
      "ServiceName": "BpmService",
      "WSToken": "$#HHJGUYUHSDFGS546546DFH654SGHUJJFF==",
      "MethodHash": "java.util.List_getWorkGroupMemberCatalog_Number_Number",
      "ArgumentList": [
        idLn,
        0
      ]
    }
    const data = JSON.stringify(parametros);
    return http.post(this.url, data);
  } */

  public getWorkGroupMemberCatalog(idLn: number, idOffice: number): Observable<MemberWorkGroup[]> {
    const parametros = {
      "ServiceName": "BpmService",
      "MethodHash": "java.util.List_getWorkGroupMemberCatalog_Number_Number_Number",
      "ArgumentList": [
        idLn,
        idOffice,
        0
      ]
    }
    const data = JSON.stringify(parametros);
    /* return http.post(this.url, data); */
    return api.post<ServerResponse<MemberWorkGroup>>(this.url, data)
      .pipe(
        map((value: any) => {
          if (value.DataBeanProperties.ObjectValue) {
            return value.DataBeanProperties.ObjectValue.map(
              (value1: any) => value1.DataBeanProperties
            );
          }
          return [];
        })
      );
  }

  public addWorkGroupMember(idLnFunctionalID: number, idAccount: number, idOffice: number): Observable<MemberWorkGroup> {
    const parametros = {
      ServiceName: "BpmService",
      MethodHash: "com.quickbpm.bean.WorkGroupMember_addWorkGroupMember_Number_Number_Number",
      ArgumentList: [
        idLnFunctionalID,
        idAccount,
        idOffice
      ]
    }
    const data = JSON.stringify(parametros);
    return api
      .post<any>(this.url, data)
      .pipe(
        map(
          (value) =>
            value.DataBeanProperties.ObjectValue
              .DataBeanProperties as MemberWorkGroup
        )
      );
  }

  /* addWorkGroupMember(idLnFunctionalID: number, idAccount: number) {
    const parametros = {
      "IDClient": "$#HHJGUY9773H5MNKD65389745KJDFGDGG==",
      "ServiceName": "BpmService",
      "WSToken": "$#HHJGUYUHSDFGS546546DFH654SGHUJJFF==",
      "MethodHash": "com.quickbpm.bean.WorkGroupMember_addWorkGroupMember_Number_Number",
      "ArgumentList": [
        idLnFunctionalID,
        idAccount
      ]
    }
    const data = JSON.stringify(parametros);
    return http.post(this.url, data);
  } */

  public removeWorkGroupMember(idLnFunctionalID: number, idAccount: number, idOffice: number): Observable<MemberWorkGroup> {
    const parametros = {
      "ServiceName": "BpmService",
      "MethodHash": "com.quickbpm.bean.WorkGroupMember_removeWorkGroupMember_Number_Number_Number",
      "ArgumentList": [
        idLnFunctionalID,
        idAccount,
        idOffice
      ]
    }
    const data = JSON.stringify(parametros);
    return api
      .post<any>(this.url, data)
      .pipe(
        map(
          (value) =>
            value.DataBeanProperties.ObjectValue
              .DataBeanProperties as MemberWorkGroup
        )
      );
  }
  /* removeWorkGroupMember(idLnFunctionalID: number, idAccount: number) {
    const parametros = {
      "ServiceName": "BpmService",
      "MethodHash": "com.quickbpm.bean.WorkGroupMember_removeWorkGroupMember_Number_Number",
      "ArgumentList": [
        idLnFunctionalID,
        idAccount
      ]
    }
    const data = JSON.stringify(parametros);
    return http.post(this.url, data);
  } */

  //:::://:::://..:: PROCESS HISTORY SERVICES ::..//..//:::://:::://

  getStageCatalog(idProcedureImp: number) {
    const parametros = {
      ServiceName: "BpmService",
      MethodHash: "java.util.List_getStageCatalog_Number",
      ArgumentList: [idProcedureImp]
    }
    const data = JSON.stringify(parametros);
    return http.post(this.url, data);
  }

  getProcedureActionByProcedureImp(idProcedureImp: number) {
    const parametros = {
      ServiceName: "BpmService",
      MethodHash: "java.util.List_getProcedureActionByProcedureImp_Number",
      ArgumentList: [idProcedureImp]
    }
    const data = JSON.stringify(parametros);
    return http.post(this.url, data);
  }

  getPendingProcedureActionForProcedureImp(idProcedureImp: number) {
    const parametros = {
      ServiceName: "BpmService",
      MethodHash: "java.util.List_getPendingProcedureActionForProcedureImp_Number",
      ArgumentList: [idProcedureImp]
    }
    const data = JSON.stringify(parametros);
    return http.post(this.url, data);
  }


  setInPendingForInputState(idAction: number) {
    const parametros = {
      ServiceName: "BpmService",
      MethodHash: "com.quickbpm.bean.ProcedureAction_setInPendingForInputState_Number",
      ArgumentList: [idAction]
    }
    const data = JSON.stringify(parametros);
    return http.post(this.url, data);
  }




  //:::://:::://..:: OFFICE SERVICES ::..//..//:::://:::://



  public getOfficeCatalog(id?: number | null): Observable<Office[]> {
    const parametros = {
      "IDClient": "$#HHJGUY9773H5MNKD65389745KJDFGDGG==",
      "ServiceName": "BpmService",
      "WSToken": "$#HHJGUYUHSDFGS546546DFH654SGHUJJFF==",
      "MethodHash": "java.util.List_getOfficeCatalog_Number",
      "ArgumentList": [
        id
      ]
    };
    const data = JSON.stringify(parametros);
    return api.post<ServerResponse<Office>>(this.url, data)
      .pipe(
        map((value: any) => {
          if (value.DataBeanProperties.ObjectValue) {
            return value.DataBeanProperties.ObjectValue.map(
              (value1: any) => value1.DataBeanProperties
            );
          }
          return [];
        })
      );
  }
  public updateOffice(bean: Office): Observable<Office> {
    const parametros = {
      "IDClient": "$#HHJGUY9773H5MNKD65389745KJDFGDGG==",
      "ServiceName": "BpmService",
      "WSToken": "$#HHJGUYUHSDFGS546546DFH654SGHUJJFF==",
      "MethodHash": "com.quickbpm.bean.Office_updateOffice_com.quickbpm.bean.Office",
      "ArgumentList": [
        {
          "DataBeanProperties": bean,
          "DataBeanName": "com.quickbpm.bean.Office"
        }
      ]
    };
    const data = JSON.stringify(parametros);
    return api
      .post<any>(this.url, data)
      .pipe(
        map(
          (value) =>
            value.DataBeanProperties.ObjectValue
              .DataBeanProperties as Office
        )
      );
  };

  public deleteOffice(id: number): Observable<any> {
    const parametros = {
      "ServiceName": "BpmService",
      "MethodHash": "Integer_deleteOffice_Number",
      "ArgumentList": [
        id
      ]
    }
    const data = JSON.stringify(parametros);
    return api.post(this.url, data);
  }

  getOfficeBusinessProcessCatalog(id: number): Observable<OfficeBusinessProcess[]> {
    const parametros = {
      "IDClient": "$#HHJGUY9773H5MNKD65389745KJDFGDGG==",
      "ServiceName": "BpmService",
      "WSToken": "$#HHJGUYUHSDFGS546546DFH654SGHUJJFF==",
      "MethodHash": "java.util.List_getOfficeBusinessProcessCatalog_Number",
      "ArgumentList": [
        id
      ]
    };
    const data = JSON.stringify(parametros);
    return api.post<ServerResponse<OfficeBusinessProcess>>(this.url, data)
      .pipe(
        map((value: any) => {
          if (value.DataBeanProperties.ObjectValue) {
            return value.DataBeanProperties.ObjectValue.map(
              (value1: any) => value1.DataBeanProperties
            );
          }
          return [];
        })
      );
  }

  public addOfficeToBusinessProcess(idBusiness: number, idOffice: number): Observable<Office> {
    const parametros = {
      "ServiceName": "BpmService",
      "MethodHash": "com.quickbpm.bean.OfficeBusinessProcess_addOfficeToBusinessProcess_Number_Number",
      "ArgumentList": [
        idBusiness,
        idOffice
      ]
    };
    const data = JSON.stringify(parametros);
    return api
      .post<any>(this.url, data)
      .pipe(
        map(
          (value) =>
            value.DataBeanProperties.ObjectValue
              .DataBeanProperties as Office
        )
      );
  }

  getOfficeCatalogForAccount(idAccount: number): Observable<Office[]> {
    const parametros = {
      "ServiceName": "BpmService",
      "MethodHash": "java.util.List_getOfficeCatalogForAccount_Number",
      "ArgumentList": [
        idAccount
      ]
    };
    const data = JSON.stringify(parametros);
    return api.post<ServerResponse<Office>>(this.url, data)
      .pipe(
        map((value: any) => {
          if (value.DataBeanProperties.ObjectValue) {
            return value.DataBeanProperties.ObjectValue.map(
              (value1: any) => value1.DataBeanProperties
            );
          }
          return [];
        })
      );
  }

  removeOfficeToBusinessOffice(idBusinessProcess: number, IDOffice: number): Observable<any> {
    const parametros = {
      "IDClient": "$#HHJGUY9773H5MNKD65389745KJDFGDGG==",
      "ServiceName": "BpmService",
      "WSToken": "$#HHJGUYUHSDFGS546546DFH654SGHUJJFF==",
      "MethodHash": "com.quickbpm.bean.OfficeBusinessProcess_removeOfficeToBusinessOffice_Number_Number",
      "ArgumentList": [
        idBusinessProcess,
        IDOffice
      ]
    }
    const data = JSON.stringify(parametros);
    return api.post(this.url, data);
  }


  public getCharacterizationCatalog(id?: number | null): Observable<CharacterizationK[]> {
    const parametros = {
      "IDClient": "$#HHJGUY9773H5MNKD65389745KJDFGDGG==",
      "ServiceName": "BpmService",
      "WSToken": "$#HHJGUYUHSDFGS546546DFH654SGHUJJFF==",
      "MethodHash": "java.util.List_getCharacterizationCatalog_Number",
      "ArgumentList": [
        id
      ]
    };
    const data = JSON.stringify(parametros);
    return api.post<ServerResponse<CharacterizationK>>(this.url, data)
      .pipe(
        map((value: any) => {
          if (value.DataBeanProperties.ObjectValue) {
            return value.DataBeanProperties.ObjectValue.map(
              (value1: any) => value1.DataBeanProperties
            );
          }
          return [];
        })
      );
  }

  public updateCharacterization(bean: CharacterizationK): Observable<CharacterizationK> {
    const parametros = {
      "IDClient": "$#HHJGUY9773H5MNKD65389745KJDFGDGG==",
      "ServiceName": "BpmService",
      "WSToken": "$#HHJGUYUHSDFGS546546DFH654SGHUJJFF==",
      "MethodHash": "com.quickbpm.bean.Characterization_updateCharacterization_com.quickbpm.bean.Characterization",
      "ArgumentList": [
        {
          "DataBeanProperties": bean,
          "DataBeanName": "com.quickbpm.bean.Characterization"
        }
      ]
    };
    const data = JSON.stringify(parametros);
    return api
      .post<any>(this.url, data)
      .pipe(
        map(
          (value) =>
            value.DataBeanProperties.ObjectValue
              .DataBeanProperties as CharacterizationK
        )
      );
  }

  public deleteCharacterization(id: number): Observable<any> {
    const parametros = {
      "IDClient": "$#HHJGUY9773H5MNKD65389745KJDFGDGG==",
      "ServiceName": "BpmService",
      "WSToken": "$#HHJGUYUHSDFGS546546DFH654SGHUJJFF==",
      "MethodHash": "Integer_deleteCharacterization_Number",
      "ArgumentList": [
        id
      ]
    }
    const data = JSON.stringify(parametros);
    return api.post(this.url, data);
  }

  //:::://:::://..:: CUSTOMER TYPE SERVICES ::..//..//:::://:::://

  public getCustomerTypeCatalog(): Observable<ICustomerType[]> {
    const parametros = {
      "ServiceName": "BpmService",
      "MethodHash": "java.util.List_getCustomerTypeCatalog_Number",
      "ArgumentList": [
        null
      ]
    };
    const data = JSON.stringify(parametros);
    return api.post<ServerResponse<ICustomerType>>(this.url, data)
      .pipe(
        map((value: any) => {
          if (value.DataBeanProperties.ObjectValue) {
            return value.DataBeanProperties.ObjectValue.map(
              (value1: any) => value1.DataBeanProperties
            );
          }
          return [];
        })
      );
  }

  updateCustomerType(bean: ICustomerType): Observable<ICustomerType> {
    const parametros = {
      "ServiceName": "BpmService",
      "MethodHash": "com.quickbpm.bean.CustomerType_updateCustomerType_com.quickbpm.bean.CustomerType",
      "ArgumentList": [
        {
          "DataBeanProperties": bean,
          "DataBeanName": "com.quickbpm.bean.CustomerType"
        }
      ]
    };
    const data = JSON.stringify(parametros);
    return api
      .post<any>(this.url, data)
      .pipe(
        map(
          (value) =>
            value.DataBeanProperties.ObjectValue
              .DataBeanProperties as ICustomerType
        )
      );
  }

  public deleteCustomerType(id: number): Observable<any> {
    const parametros = {
      "ServiceName": "BpmService",
      "MethodHash": "void_deleteCustomerType_Number",
      "ArgumentList": [
        id
      ]
    }
    const data = JSON.stringify(parametros);
    return api.post(this.url, data);
  }


  //:::://:::://..:: BUSINESS CHARACTERIZATION SERVICES ::..//..//:::://:::://

  addBusinessCharacterization(idBusinessProcess: number, idCharacterization: number): Observable<IBusinessCharacterization> {
    const parametros = {
      "ServiceName": "BpmService",
      "MethodHash": "com.quickbpm.bean.BusinessCharacterization_addBusinessCharacterization_Number_Number",
      "ArgumentList": [
        idBusinessProcess,
        idCharacterization
      ]
    };
    const data = JSON.stringify(parametros);
    return api
      .post<any>(this.url, data)
      .pipe(
        map(
          (value) =>
            value.DataBeanProperties.ObjectValue
              .DataBeanProperties as IBusinessCharacterization
        )
      );
  }


  public getBusinessCharacterizationCatalog(idBusinessProcess: number): Observable<IBusinessCharacterization[]> {
    const parametros = {
      "ServiceName": "BpmService",
      "MethodHash": "java.util.List_getBusinessCharacterizationCatalog_Number",
      "ArgumentList": [
        idBusinessProcess
      ]
    };
    const data = JSON.stringify(parametros);
    return api.post<ServerResponse<IBusinessCharacterization>>(this.url, data)
      .pipe(
        map((value: any) => {
          if (value.DataBeanProperties.ObjectValue) {
            return value.DataBeanProperties.ObjectValue.map(
              (value1: any) => value1.DataBeanProperties
            );
          }
          return [];
        })
      );
  }

  public deleteBusinessCharacterization(id: number): Observable<any> {
    const parametros = {
      "ServiceName": "BpmService",
      "MethodHash": "Integer_deleteBusinessCharacterization_Number",
      "ArgumentList": [
        id
      ]
    }
    const data = JSON.stringify(parametros);
    return api.post(this.url, data);
  }

  //:::://:::://..:: DOCUMENT CHARACTERIZATION SERVICES ::..//..//:::://:::://

  addDocumentCharacterization(idDocument: number, idCharacterization: number): Observable<IDocumentCharacterization> {
    const parametros = {
      "ServiceName": "BpmService",
      "MethodHash": "com.quickbpm.bean.DocumentCharacterization_addDocumentCharacterization_Number_Number",
      "ArgumentList": [
        idDocument,
        idCharacterization
      ]
    };
    const data = JSON.stringify(parametros);
    return api
      .post<any>(this.url, data)
      .pipe(
        map(
          (value) =>
            value.DataBeanProperties.ObjectValue
              .DataBeanProperties as IDocumentCharacterization
        )
      );
  }

  public getDocumentCharacterizationCatalog(idDocument: number): Observable<IDocumentCharacterization[]> {
    const parametros = {
      "ServiceName": "BpmService",
      "MethodHash": "java.util.List_getDocumentCharacterizationCatalog_Number",
      "ArgumentList": [
        idDocument
      ]
    };
    const data = JSON.stringify(parametros);
    return api.post<ServerResponse<IDocumentCharacterization>>(this.url, data)
      .pipe(
        map((value: any) => {
          if (value.DataBeanProperties.ObjectValue) {
            return value.DataBeanProperties.ObjectValue.map(
              (value1: any) => value1.DataBeanProperties
            );
          }
          return [];
        })
      );
  }

  public deleteDocumentCharacterization(id: number): Observable<any> {
    const parametros = {
      "ServiceName": "BpmService",
      "MethodHash": "Integer_deleteDocumentCharacterization_Number",
      "ArgumentList": [
        id
      ]
    }
    const data = JSON.stringify(parametros);
    return api.post(this.url, data);
  }

  //:::://:::://..:: DOCUMENT CHARACTERIZATION SERVICES ::..//..//:::://:::://

  public getProcedureTypeList(): Observable<IActivityType[]> {
    const parametros = {
      "ServiceName": "BpmService",
      "MethodHash": "java.util.List_getProcedureTypeList_Number",
      "ArgumentList": [
        null
      ]
    };
    const data = JSON.stringify(parametros);
    return api.post<ServerResponse<IActivityType>>(this.url, data)
      .pipe(
        map((value: any) => {
          if (value.DataBeanProperties.ObjectValue) {
            return value.DataBeanProperties.ObjectValue.map(
              (value1: any) => value1.DataBeanProperties
            );
          }
          return [];
        })
      );
  }


  public getOfficeCatalogForBusinessProcess(idBusinessProcess: number) {
    const parametros = {
      "ServiceName": "BpmService",
      "MethodHash": "java.util.List_getOfficeCatalogForBusinessProcess_Number",
      "ArgumentList": [
        idBusinessProcess
      ]
    };
    const data = JSON.stringify(parametros);
    return api.post(this.url, data);
  }


  public responseProcedureAction(idProcedureAction: number, description: string) {
    const dataObj = {
      "IDClient": "$#HHJGUY9773H5MNKD65389745KJDFGDGG==",
      "ServiceName": "BpmService",
      "WSToken": "$#HHJGUYUHSDFGS546546DFH654SGHUJJFF==",
      "MethodHash": "boolean_responseProcedureAction_Number_String_Boolean",
      "ArgumentList":
        [
          idProcedureAction,
          description,
          true
        ]
    };
    const data = JSON.stringify(dataObj);
    return api.post(this.url, data);
  }

  getProcedureDocumentList() {
    const dataObj = {
      IDClient: "$#HHJGUY9773H5MNKD65389745KJDFGDGG==",
      ServiceName: "BpmService",
      WSToken: "$#HHJGUYUHSDFGS546546DFH654SGHUJJFF==",
      MethodHash: "java.util.List_getProcedureDocumentList_Number",
      ArgumentList: [
        0
      ]
    }
    const data = JSON.stringify(dataObj);
    return api.post(this.url, data);
  }

  testJsonForm(idForm: number) {
    const dataObj = {
      IDClient: "$#HHJGUY9773H5MNKD65389745KJDFGDGG==",
      ServiceName: "BpmService",
      WSToken: "$#HHJGUYUHSDFGS546546DFH654SGHUJJFF==",
      MethodHash: "com.quickbpm.bean.ResponseValue_testJsonForm_Number",
      ArgumentList: [
        idForm
      ]
    }
    const data = JSON.stringify(dataObj);
    return api.post(this.url, data);
  }
  getForm(url: string) {
    return http2.post(url, '');
  }
  getSystemProperty(name: string) {
    const dataObj = {
      IDClient: "$#HHJGUY9773H5MNKD65389745KJDFGDGG==",
      ServiceName: "OrangeBase",
      WSToken: "$#HHJGUYUHSDFGS546546DFH654SGHUJJFF==",
      MethodHash: "com.advantage.bean.account.SystemProperty_getSystemProperty_String",
      ArgumentList: [
        name
      ]
    }
    const data = JSON.stringify(dataObj);
    return api.post(this.url, data);
  }


  //:::://:::://..:: AGENDA SERVICES ::..//..//:::://:::://

  public getAgendaSeccional(idOffice: number, fecha: string): Observable<IAgendaSeccional[]> {
    const parametros = {
      "ServiceName": "ArmasService",
      "MethodHash": "java.util.List_getAgendaSeccional_Number_String",
      "ArgumentList": [
        idOffice,
        fecha
      ]
    };
    const data = JSON.stringify(parametros);
    return api.post<ServerResponse<IAgendaSeccional>>(this.url, data)
      .pipe(
        map((value: any) => {
          if (value.DataBeanProperties.ObjectValue) {
            return value.DataBeanProperties.ObjectValue.map(
              (value1: any) => value1.DataBeanProperties
            );
          }
          return [];
        })
      );
  }

  updateAgendaSeccional(bean: IAgendaSeccional): Observable<IAgendaSeccional> {
    const parametros = {
      "ServiceName": "ArmasService",
      "MethodHash": "co.mil.dccae.armas.bean.AgendaSeccional_updateAgendaSeccional_co.mil.dccae.armas.bean.AgendaSeccional",
      "ArgumentList": [
        {
          "DataBeanProperties": bean,
          "DataBeanName": "co.mil.dccae.armas.bean.AgendaSeccional"
        }
      ]
    };
    const data = JSON.stringify(parametros);
    return api
      .post<any>(this.url, data)
      .pipe(
        map(
          (value) =>
            value.DataBeanProperties.ObjectValue
              .DataBeanProperties as IAgendaSeccional
        )
      );
  }

  public deleteAgenda(id: number): Observable<any> {
    const parametros = {
      "ServiceName": "ArmasService",
      "MethodHash": "boolean_deleteAgendaSeccional_Number",
      "ArgumentList": [
        id
      ]
    }
    const data = JSON.stringify(parametros);
    return api.post(this.url, data);
  }

  public asignarCita(IDAgendaSeccional: number, bean: any): Observable<any> {
    console.log(bean);

    const parametros = {
      IDClient: "$#HHJGUY9773H5MNKD65389745KJDFGDGG==",
      ServiceName: "ArmasService",
      WSToken: "$#HHJGUYUHSDFGS546546DFH654SGHUJJFF==",
      MethodHash: "java.util.Map_asignarCita_Number_java.util.Map",
      ArgumentList: [
        IDAgendaSeccional,
        bean
      ]
    }
    const data = JSON.stringify(parametros);
    return api.post(this.url, data);
  }

  public bandejaCitas(idSeccional: number, fecha: string): Observable<any> {
    const parametros = {
      IDClient: "$#HHJGUY9773H5MNKD65389745KJDFGDGG==",
      ServiceName: "ArmasService",
      WSToken: "$#HHJGUYUHSDFGS546546DFH654SGHUJJFF==",
      MethodHash: "java.util.List_bandejaCitas_Number_String",
      ArgumentList: [
        idSeccional,
        fecha
      ]
    }
    const data = JSON.stringify(parametros);
    return api.post(this.url, data);
  }

  public reprogramarCita(idAgenda: number, idAgendaSeccional: number): Observable<any> {
    const parametros = {
      ServiceName: "ArmasService",
      MethodHash: "java.util.Map_reagendarCita_Number_Number",
      ArgumentList: [
        idAgenda,
        idAgendaSeccional
      ]
    }
    const data = JSON.stringify(parametros);
    return api.post(this.url, data);
  }

  public cancelarCita(idAgenda: number): Observable<any> {
    const parametros = {
      ServiceName: "ArmasService",
      MethodHash: "java.util.Map_cancelarCita_Number",
      ArgumentList: [
        idAgenda
      ]
    }
    const data = JSON.stringify(parametros);
    return api.post(this.url, data);
  }





}