import { map, Observable } from "rxjs";
import { Dane } from "../../modules/admin/model/Dane";
import { User } from "../../shared/model/User";
import { ServerResponse } from "../model/server-response.interface";
import api from "../settings/api";
import { IFingerPrintData } from "../../modules/citizenData/model/FingerPrintData";
import { IPersonPhotoData } from "../../modules/citizenData/model/PersonPhotoData";
export class GlobalService {
  private url = "/jsserver";

  public getAccountByNit(nit: number): Observable<User[]> {
    const parametros = {
      ServiceName: "OrangeBase",
      MethodHash: "java.util.List_getAccountByNit_Number",
      ArgumentList: [nit],
    };
    const data = JSON.stringify(parametros);
    return api.post<ServerResponse<User>>(this.url, data).pipe(
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

  public getAccount(names: string, lastNames: string): Observable<User[]> {
    const parametros = {
      ServiceName: "OrangeBase",
      MethodHash: "java.util.List_getAccount_String_String",
      ArgumentList: [names, lastNames],
    };
    const data = JSON.stringify(parametros);
    return api.post<ServerResponse<User>>(this.url, data).pipe(
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

  public getDaneCatalogLikeCity(item: string): Observable<Dane[]> {
    const parametros = {
      ServiceName: "ArmasService",
      MethodHash: "java.util.List_getDaneCatalogLike_String_String_Number",
      ArgumentList: ["Municipio", item, null],
    };
    const data = JSON.stringify(parametros);
    return api.post<ServerResponse<Dane>>(this.url, data).pipe(
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

  public getDaneCatalogLikeDep(item: string): Observable<Dane[]> {
    const parametros = {
      ServiceName: "ArmasService",
      MethodHash: "java.util.List_getDaneCatalogLike_String_String_Number",
      ArgumentList: ["Departamento", item, null],
    };
    const data = JSON.stringify(parametros);
    return api.post<ServerResponse<Dane>>('', data).pipe(
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

  // BIODATA SERVICES
  
  public registerFingerPrint(idAccount: string, handType: number, fingerType: number): Observable<any> {
    const parametros = {
      URL: "http://192.168.1.111:8080/dcca",
      ReaderType: localStorage.getItem("readerType"),
      BioType: "Fingerprint",
      IDAccount: idAccount,
      HandType: handType,
      FingerType: fingerType,
      Function: "RegisterFingerprint"
    };
    const data = JSON.stringify(parametros);
    console.log(data);
    return api.bioPost('', data)
  }

  public validateFingerPrint(idAccount: string, handType: number, fingerType: number): Observable<any> {
    const parametros = {
      URL: "http://192.168.1.111:8080/dcca",
      ReaderType: localStorage.getItem("readerType"),
      BioType: "Fingerprint",
      IDAccount: idAccount,
      HandType: handType,
      FingerType: fingerType,
      Function: "VerifyFingerprint"
    };
    const data = JSON.stringify(parametros);
    console.log(data);
    return api.bioPost('', data)
  }

  public registerPersonPhoto(idAccount: string, viewType: number, sideType: number): Observable<any> {
    const parametros = {
      URL: "http://192.168.1.111:8080/dcca",
      ReaderType: "zkteco",
      BioType: "PersonPhoto",
      IDAccount: idAccount,
      ViewType: viewType,
      SideType: sideType,
      Function: "RegisterPersonPhoto"
    };
    const data = JSON.stringify(parametros);
    console.log(data);
    return api.bioPost('', data)
  }

  public getFingerPrintDataCatalog(idAccount: number): Observable<IFingerPrintData[]> {
    const parametros = {
      ServiceName: "OrangeBase",
      MethodHash: "java.util.List_getFingerprint_Number",
      ArgumentList: [idAccount],
    };
    const data = JSON.stringify(parametros);
    return api.post<ServerResponse<IFingerPrintData>>(this.url, data).pipe(
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

  public getPersonPhotoDataCatalog(idAccount: number): Observable<IPersonPhotoData[]> {
    const parametros = {
      ServiceName: "OrangeBase",
      MethodHash: "java.util.List_getPersonPhoto_Number",
      ArgumentList: [idAccount],
    };
    const data = JSON.stringify(parametros);
    return api.post<ServerResponse<IPersonPhotoData>>(this.url, data).pipe(
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
}
