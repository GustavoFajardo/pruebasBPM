import http from "../http-common";

export class TreeService {
  private url = "/jsserver";

  getTreeForFunctionalID() {
    const parametros = {
      ServiceName: "BpmService",
      MethodHash: "com.advantage.shared.Tree_getTreeForFunctionalID_Number",
      ArgumentList: [0],
    };
    const data = JSON.stringify(parametros);
    return http.post(this.url, data);
  }

  getFunctionalIDChilds(id: number) {
    const parametros = {
      ServiceName: "BpmService",
      MethodHash: "java.util.List_getFunctionalIDChilds_Number_Number",
      ArgumentList: [id, null],
    };
    const data = JSON.stringify(parametros);
    return http.post(this.url, data);
  }

  createFunctionalID(id: number, bean: any) {
    const parametros = {
      ServiceName: "BpmService",
      MethodHash:
        "com.orange.bean.functional.FunctionalID_createFunctionalID_com.orange.bean.functional.FunctionalID_com.orange.bean.functional.FunctionalID",
      ArgumentList: [
        {
          DataBeanProperties: bean,
          DataBeanName: "com.orange.bean.functional.FunctionalID",
        },
        {
          DataBeanProperties: {
            IDLn: id,
          },
          DataBeanName: "com.orange.bean.functional.FunctionalID",
        },
      ],
    };
    const data = JSON.stringify(parametros);
    return http.post(this.url, data);
  }

  deleteFunctionalID(id: number) {
    const parametros = {
      ServiceName: "BpmService",
      MethodHash:
        "com.orange.bean.functional.FunctionalID_deleteFunctionalID_com.orange.bean.functional.FunctionalID",
      ArgumentList: [
        {
          DataBeanProperties: {
            IDLn: id,
          },
          DataBeanName: "com.orange.bean.functional.FunctionalID",
        },
      ],
    };
    const data = JSON.stringify(parametros);
    return http.post(this.url, data);
  }

  addWorkGroupMember(idFn: number, idAccount: number) {
    const parameters = {
      IDClient: "$#HHJGUY9773H5MNKD65389745KJDFGDGG==",
      ServiceName: "BpmService",
      WSToken: "$#HHJGUYUHSDFGS546546DFH654SGHUJJFF==",
      MethodHash:
        "com.quickbpm.bean.WorkGroupMember_addWorkGroupMember_Number_Number",
      ArgumentList: [idFn, idAccount],
    };
    const data = JSON.stringify(parameters);
    return http.post(this.url, data);
  }

  removeWorkGroupMember(idFn: number, idAccount: number) {
    const parameters = {
      IDClient: "$#HHJGUY9773H5MNKD65389745KJDFGDGG==",
      ServiceName: "BpmService",
      WSToken: "$#HHJGUYUHSDFGS546546DFH654SGHUJJFF==",
      MethodHash:
        "com.quickbpm.bean.WorkGroupMember_removeWorkGroupMember_Number_Number",
      ArgumentList: [idFn, idAccount],
    };
    const data = JSON.stringify(parameters);
    return http.post(this.url, data);
  }
}
