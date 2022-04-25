import { ServerResponse } from "../model/server-response.interface";
import { map, Observable } from "rxjs";
import { IndumilOffice } from "../../modules/weapons/model/AlmacenIndumil";
import api from "../settings/api";
import { Iweapon } from "../../modules/weapons/model/modelWeapon";
import { IPermission } from "../../modules/weapons/model/permission.interface";
import { ITypeProduct } from "../../modules/weapons/model/typeProduct";
import { IProduct } from "../../modules/weapons/model/product";
import { IProductKind } from "../../modules/weapons/model/ProductKind";
import { Ilote } from "../../modules/weapons/model/lote";
import { ICapCarga } from "../../modules/weapons/model/capCarga";

export class WeaponsService {

    private url = "/jsserver";

    // ..:::::::::: ALMACENES INDUMIL SERVICES ::::::::::.. //

    public getIndumilOffices(): Observable<IndumilOffice[]> {
        const parametros = {
            ServiceName: "ArmasService",
            MethodHash: "java.util.List_getAlmaIndumilCatalogPorPropiedad_String_Object_Number",
            ArgumentList: [null, null, null],
        };
        const data = JSON.stringify(parametros);
        return api.post<ServerResponse<IndumilOffice>>(this.url, data)
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

    updateAlmacenIndumil(bean: IndumilOffice): Observable<IndumilOffice> {
        const parametros = {
            ServiceName: "ArmasService",
            MethodHash: "co.mil.dccae.armas.bean.AlmaIndumil_updateAlmaIndumil_co.mil.dccae.armas.bean.AlmaIndumil",
            ArgumentList: [
                {
                    DataBeanProperties: bean,
                    DataBeanName: "co.mil.dccae.armas.bean.AlmaIndumil",
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
                            .DataBeanProperties as IndumilOffice
                )
            );
    }

    deleteIndumilOffice(id: number): Observable<any> {
        const parametros = {
            ServiceName: "ArmasService",
            MethodHash: "boolean_deleteAlmaIndumil_Number",
            ArgumentList: [id],
        };

        const data = JSON.stringify(parametros);
        return api.post(this.url, data);
    }

    // ..:::::::::: TRAUMATICA SERVICES ::::::::::.. //

    getTraumaticaCatalogPorPropiedad(): Observable<Iweapon[]> {

        const parametros = {
            IDClient: "$#HHJGUY9773H5MNKD65389745KJDFGDGG==",
            ServiceName: "ArmasService",
            WSToken: "$#HHJGUYUHSDFGS546546DFH654SGHUJJFF==",
            MethodHash: "java.util.List_getTraumaticaCatalogPorPropiedad_String_Object_Number",
            ArgumentList: [
                null,
                null,
                null
            ]
        }
        const data = JSON.stringify(parametros);

        return api.post<ServerResponse<IndumilOffice>>(this.url, data)
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

    getListasPorCodigo(lista: any): Observable<any> {
        const parametros = {
            "IDClient": "$#HHJGUY9773H5MNKD65389745KJDFGDGG==",
            "ServiceName": "ArmasService",
            "WSToken": "$#HHJGUYUHSDFGS546546DFH654SGHUJJFF==",
            "MethodHash": "java.util.List_getListasPorCodigo_Number_java.util.List",
            "ArgumentList": [
                0,
                lista
            ]
        }
        const data = JSON.stringify(parametros);
        return api.post(this.url, data);
    }


    updateTraumatica(bean: Iweapon): Observable<Iweapon> {
        const parametros = {
            ServiceName: "ArmasService",
            MethodHash: "co.mil.dccae.armas.bean.Traumatica_updateTraumatica_co.mil.dccae.armas.bean.Traumatica",
            ArgumentList: [
                {
                    DataBeanProperties: bean,
                    DataBeanName: "co.mil.dccae.armas.bean.Traumatica",
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
                            .DataBeanProperties as Iweapon
                )
            );
    }

    deleteTraumatica(id: number): Observable<any> {
        const parametros = {
            ServiceName: "ArmasService",
            MethodHash: "boolean_deleteTraumatica_Number",
            ArgumentList: [id],
        };

        const data = JSON.stringify(parametros);
        return api.post(this.url, data);
    }


    // ..:::::::::: PERMISSIONS SERVICES ::::::::::.. //

    generateCryptoCode(context: string, media: string, name: string, cc: number, weapon: any, date: string, type: number, idFuncionario: number): Observable<any> {
        const parametros = {
            ServiceName: "ArmasService",
            MethodHash: "java.util.Map_genQRCode_Number_java.util.Map",
            ArgumentList: [type,
                (weapon.IDPermiso) ?
                    {
                        "IDPermiso": weapon.IDPermiso,
                        "IDFuncionario": idFuncionario,
                        "Contex": context,
                        "Media": media,
                        "Identificacion": cc,
                        "Nombre": name,
                        "ClaseArma": weapon.ClaseArma,
                        "Marca": weapon.Marca,
                        "Serie": weapon.Serie,
                        "Calibre": weapon.Calibre,
                        "Capacidad": weapon.Capacidad,
                        "FechaVencimiento": date /* "2022-12-31" */,
                    }
                    :
                    {
                        "IDFuncionario": idFuncionario,
                        "Contex": context,
                        "Media": media,
                        "Identificacion": cc,
                        "Nombre": name,
                        "ClaseArma": weapon.ClaseArma,
                        "Marca": weapon.Marca,
                        "Serie": weapon.Serie,
                        "Calibre": weapon.Calibre,
                        "Capacidad": weapon.Capacidad,
                        "FechaVencimiento": date /* "2022-12-31" */,
                    }
            ],
        };

        const data = JSON.stringify(parametros);
        return api.post(this.url, data);
    }

    getPermisoCatalogPorPropiedad(): Observable<IPermission[]> {
        const parametros = {
            IDClient: "$#HHJGUY9773H5MNKD65389745KJDFGDGG==",
            ServiceName: "ArmasService",
            WSToken: "$#HHJGUYUHSDFGS546546DFH654SGHUJJFF==",
            MethodHash: "java.util.List_getPermisoCatalogPorPropiedad_String_Object_Number",
            ArgumentList: [
                null,
                null,
                null
            ]
        }
        const data = JSON.stringify(parametros);

        return api.post<ServerResponse<IPermission>>(this.url, data)
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
    };

    getPermissionByIdentification(id: number | null): Observable<IPermission[]> {
        const parametros = {
            ServiceName: "ArmasService",
            MethodHash: "java.util.List_getPermisoCatalogPorPropiedades_java.util.Map_Number",
            ArgumentList: [
                { Identificacion: id },
                null
            ]
        }
        const data = JSON.stringify(parametros);

        return api.post<ServerResponse<IPermission>>(this.url, data)
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

    public updatePermission(bean: IPermission): Observable<IPermission> {
        const parametros = {
            "ServiceName": "ArmasService",
            "MethodHash": "co.mil.dccae.armas.bean.Permiso_updatePermiso_co.mil.dccae.armas.bean.Permiso",
            "ArgumentList": [
                {
                    "DataBeanProperties": bean,
                    "DataBeanName": "co.mil.dccae.armas.bean.Permiso"
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
                            .DataBeanProperties as IPermission
                )
            );
    };

    public deletePermission(id: number): Observable<any> {
        const parametros = {
            "ServiceName": "ArmasService",
            "MethodHash": "boolean_deletePermiso_Number",
            "ArgumentList": [
                id
            ]
        }
        const data = JSON.stringify(parametros);
        return api.post(this.url, data);
    }

    getTipoProducto(): Observable<ITypeProduct[]> {
        const parametros = {
            IDClient: "$#HHJGUY9773H5MNKD65389745KJDFGDGG==",
            ServiceName: "InventariosService",
            WSToken: "$#HHJGUYUHSDFGS546546DFH654SGHUJJFF==",
            MethodHash: "java.util.List_getTipoProductoCatalogPorPropiedad_String_Object_Number",
            ArgumentList: [
                null,
                null,
                null
            ]
        }
        const data = JSON.stringify(parametros);
        return api.post<ServerResponse<ITypeProduct>>(this.url, data).pipe(
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


    // ..:::::::::: PRODUCT KIND SERVICES ::::::::::.. //

    getClaseProductoCatalogLike(): Observable<IProductKind[]> {
        const parametros = {
            ServiceName: "InventariosService",
            MethodHash: "java.util.List_getClaseProductoCatalogLike_String_String_Number",
            ArgumentList: [
                null,
                null,
                null
            ]
        }
        const data = JSON.stringify(parametros);

        return api.post<ServerResponse<IProductKind>>(this.url, data)
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
    deleteTipoProducto(id: number): Observable<any> {
        const parametros = {
            IDClient: "$#HHJGUY9773H5MNKD65389745KJDFGDGG==",
            ServiceName: "InventariosService",
            WSToken: "$#HHJGUYUHSDFGS546546DFH654SGHUJJFF==",
            MethodHash: "boolean_deleteTipoProducto_Number",
            ArgumentList: [
                id
            ]
        };

        const data = JSON.stringify(parametros);
        return api.post(this.url, data);
    }

    updateTipoProducto(bean: ITypeProduct): Observable<ITypeProduct> {
        const parametros = {
            IDClient: "$#HHJGUY9773H5MNKD65389745KJDFGDGG==",
            ServiceName: "InventariosService",
            WSToken: "$#HHJGUYUHSDFGS546546DFH654SGHUJJFF==",
            MethodHash: "co.mil.dccae.inventarios.bean.TipoProducto_updateTipoProducto_co.mil.dccae.inventarios.bean.TipoProducto",
            ArgumentList: [
                {
                    DataBeanProperties: bean,
                    DataBeanName: "co.mil.dccae.inventarios.bean.TipoProducto"
                }
            ]
        }
        const data = JSON.stringify(parametros);
        return api
            .post<any>(this.url, data)
            .pipe(
                map(
                    (value) =>
                        value.DataBeanProperties.ObjectValue
                            .DataBeanProperties as ITypeProduct
                )
            );
    };

    public updateClaseProducto(bean: IProductKind): Observable<IProductKind> {
        const parametros = {
            "ServiceName": "InventariosService",
            "MethodHash": "co.mil.dccae.inventarios.bean.ClaseProducto_updateClaseProducto_co.mil.dccae.inventarios.bean.ClaseProducto",
            "ArgumentList": [
                {
                    "DataBeanProperties": bean,
                    "DataBeanName": "co.mil.dccae.inventarios.bean.ClaseProducto"
                }
            ]
        };
        const data = JSON.stringify(parametros);
        return api
            .post<any>(this.url, data)
            .pipe(
                map((value) =>
                    value.DataBeanProperties.ObjectValue
                        .DataBeanProperties as IProductKind
                )
            );
    };

    public deleteClaseProducto(id: number): Observable<any> {
        const parametros = {
            "ServiceName": "InventariosService",
            "MethodHash": "boolean_deleteClaseProducto_Number",
            "ArgumentList": [
                id
            ]
        }
        const data = JSON.stringify(parametros);
        return api.post(this.url, data);
    };

    getProductoCatalog(): Observable<IProduct[]> {
        const parametros = {
            IDClient: "$#HHJGUY9773H5MNKD65389745KJDFGDGG==",
            ServiceName: "InventariosService",
            WSToken: "$#HHJGUYUHSDFGS546546DFH654SGHUJJFF==",
            MethodHash: "java.util.List_getProductoCatalogPorPropiedad_String_Object_Number",
            ArgumentList: [
                null,
                null,
                null
            ]
        }
        const data = JSON.stringify(parametros);

        return api.post<ServerResponse<IProduct>>(this.url, data)
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
    };

    ////////// PRODUCTO SERVICES ////////////////////////

    getProductoCatalogPorPropiedades(idClaseProducto: number | null, idTipoProducto: number | null, nombre: string, type: number): Observable<IProduct[]> {
        const parametros = {
            IDClient: "$#HHJGUY9773H5MNKD65389745KJDFGDGG==",
            ServiceName: "InventariosService",
            WSToken: "$#HHJGUYUHSDFGS546546DFH654SGHUJJFF==",
            MethodHash: "java.util.List_getProductoCatalogPorPropiedades_java.util.Map_Number",
            ArgumentList: [
                type === 1 ?
                    {
                        "IDClaseProducto": idClaseProducto,
                        "IDTipoProducto": idTipoProducto
                    }
                    :
                    {
                        "Nombre": nombre
                    }
                ,
                null
            ]
        }
        const data = JSON.stringify(parametros);

        return api.post<ServerResponse<IProduct>>(this.url, data)
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
    };

    getProductoCatalogPorCod(cod: number | null, type: number): Observable<IProduct[]> {
        const parametros = {
            ServiceName: "InventariosService",
            MethodHash: "java.util.List_getProductoCatalogPorPropiedad_String_Object_Number",
            ArgumentList: [
                type === 1 ? "CodSAP" : "CodDCCAE",
                cod,
                null
            ]
        }
        const data = JSON.stringify(parametros);

        return api.post<ServerResponse<IProduct>>(this.url, data)
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
    };

    getProductoCatalogPorNombre(nombre: string): Observable<IProduct[]> {
        const parametros = {
            ServiceName: "InventariosService",
            MethodHash: "java.util.List_getProductoCatalogLike_String_String_Number",
            ArgumentList: [
                "Nombre",
                nombre,
                null
            ]
        }
        const data = JSON.stringify(parametros);

        return api.post<ServerResponse<IProduct>>(this.url, data)
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
    };



    public updateProducto(bean: IProduct): Observable<IProduct> {
        const parametros = {
            "ServiceName": "InventariosService",
            "MethodHash": "co.mil.dccae.inventarios.bean.Producto_updateProducto_co.mil.dccae.inventarios.bean.Producto",
            "ArgumentList": [
                {
                    "DataBeanProperties": bean,
                    "DataBeanName": "co.mil.dccae.inventarios.bean.Producto"
                }
            ]
        };
        const data = JSON.stringify(parametros);
        return api
            .post<any>(this.url, data)
            .pipe(
                map((value) =>
                    value.DataBeanProperties.ObjectValue
                        .DataBeanProperties as IProduct
                )
            );
    };

    public deleteProducto(id: number): Observable<any> {
        const parametros = {
            "ServiceName": "InventariosService",
            "MethodHash": "boolean_deleteProducto_Number",
            "ArgumentList": [
                id
            ]
        }
        const data = JSON.stringify(parametros);
        return api.post(this.url, data);
    };

    getgetCapCargaCatalogPorIDProducto(idProducto: number): Observable<ICapCarga[]> {
        const parametros = {
            ServiceName: "InventariosService",
            MethodHash: "java.util.List_getCapCargaCatalogPorIDProducto_Number_Number",
            ArgumentList: [
                idProducto,
                null
            ]
        }
        const data = JSON.stringify(parametros);

        return api.post<ServerResponse<ICapCarga>>(this.url, data)
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
    };

    public updateCapCarga(bean: ICapCarga): Observable<ICapCarga> {
        const parametros = {
            "ServiceName": "InventariosService",
            "MethodHash": "co.mil.dccae.inventarios.bean.CapCarga_updateCapCarga_co.mil.dccae.inventarios.bean.CapCarga",
            "ArgumentList": [
                {
                    "DataBeanProperties": bean,
                    "DataBeanName": "co.mil.dccae.inventarios.bean.CapCarga"
                }
            ]
        };
        const data = JSON.stringify(parametros);
        return api
            .post<any>(this.url, data)
            .pipe(
                map((value) =>
                    value.DataBeanProperties.ObjectValue
                        .DataBeanProperties as ICapCarga
                )
            );
    };

    public deleteCapCarga(id: number): Observable<any> {
        const parametros = {
            ServiceName: "InventariosService",
            MethodHash: "boolean_deleteCapCarga_Number",
            ArgumentList: [
                id
            ]
        }
        const data = JSON.stringify(parametros);
        return api.post(this.url, data);
    };


    getItemCatalog(dateFrom: string, dateUpto: string, idProducto: number, state: number): Observable<any[]> {
        const parametros = {
            ServiceName: "DocumentosService",
            MethodHash: "java.util.List_getItemCatalog_java.util.Date_java.util.Date_Number_Number",
            ArgumentList: [
                idProducto,
                state
            ]
        }
        const data = JSON.stringify(parametros);

        return api.post<ServerResponse<any>>(this.url, data)
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
    };

    public crearSalidaAlmacen(fecha: string | null, idCiudadano: number, idFuncionario: number, listProducts: IProduct[]): Observable<any> {
        const parametros = {
            "ServiceName": "DocumentosService",
            "MethodHash": "com.advantage.shared.Report_crearSalidaAlmacen_java.util.Date_Number_Number_java.util.List",
            "ArgumentList": [
                fecha,
                idCiudadano,
                idFuncionario,
                listProducts.map((item: IProduct) => ({

                    DataBeanProperties: item,
                    DataBeanName: "co.mil.dccae.inventarios.bean.Producto"

                }))

            ]
        }
        const data = JSON.stringify(parametros);
        return api.post(this.url, data);
    };

    public getAvailableItems(idProducto: number, fechaFrom: string | null, fechaUpto: string | null, serial: string | null): Observable<any> {
        const parametros = {
            "ServiceName": "DocumentosService",
            "MethodHash": "java.util.List_getAvailableItems_Number_java.util.Date_java.util.Date_String",
            "ArgumentList": [
                idProducto,
                fechaFrom,
                fechaUpto,
                serial
            ]
        }
        const data = JSON.stringify(parametros);
        return api.post(this.url, data);
    };


    ////////// LOTE SERVICES ////////////////////////

    getLoteCatalogPorPropiedad(id: number | null): Observable<Ilote[]> {
        const parametros = {
            "IDClient": "$#HHJGUY9773H5MNKD65389745KJDFGDGG==",
            "ServiceName": "InventariosService",
            "WSToken": "$#HHJGUYUHSDFGS546546DFH654SGHUJJFF==",
            "MethodHash": "java.util.List_getLoteCatalogPorPropiedad_String_Object_Number",
            "ArgumentList": [
                "IDProducto",
                id,
                null
            ]
        }
        const data = JSON.stringify(parametros);

        return api.post<ServerResponse<Ilote>>(this.url, data)
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
    };

    public updateLote(bean: Ilote): Observable<Ilote> {
        const parametros = {
            "ServiceName": "InventariosService",
            "MethodHash": "co.mil.dccae.inventarios.bean.Lote_updateLote_co.mil.dccae.inventarios.bean.Lote",
            "ArgumentList": [
                {
                    "DataBeanProperties": bean,
                    "DataBeanName": "co.mil.dccae.inventarios.bean.Lote"
                }
            ]
        };
        const data = JSON.stringify(parametros);
        return api
            .post<any>(this.url, data)
            .pipe(
                map((value) =>
                    value.DataBeanProperties.ObjectValue
                        .DataBeanProperties as Ilote
                )
            );
    };

    public deleteLote(id: number): Observable<any> {
        const parametros = {
            "ServiceName": "InventariosService",
            "MethodHash": "boolean_deleteLote_Number",
            "ArgumentList": [
                id
            ]
        }
        const data = JSON.stringify(parametros);
        return api.post(this.url, data);
    };

    ////////// ENTRADA ALMACEN SERVICES ////////////////////////

    descargarFormatoEntradaAlmacen() {
        const parametros = {
            ServiceName: "DocumentosService",
            MethodHash: "java.util.List_descargarFormatoEntradaAlmacen_String",
            ArgumentList: [
                null
            ]
        }
        const data = JSON.stringify(parametros);
        return api.post(this.url, data);
    };

    crearEntradaAlmacen(fecha: string, idProveedor: number,
        idEmpleado: number,
        numeroEntrada: string,
        media: string,
        mediaContext: string,
        dataStore: string,
        idOffice: number) {
        const parametros = {
            IDClient: "$#HHJGUY9773H5MNKD65389745KJDFGDGG==",
            ServiceName: "DocumentosService",
            WSToken: "$#HHJGUYUHSDFGS546546DFH654SGHUJJFF==",
            MethodHash: "com.advantage.shared.Report_crearEntradaAlmacen_java.util.Date_Number_Number_String_String_String_String_Number",
            ArgumentList: [
                fecha,
                idProveedor,
                idEmpleado,
                numeroEntrada,
                media,
                mediaContext,
                dataStore,
                idOffice
            ]
        }

        const data = JSON.stringify(parametros);
        return api.post(this.url, data);
    }



}