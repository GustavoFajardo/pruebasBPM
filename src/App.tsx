import { HashRouter, Redirect, Route, Switch } from "react-router-dom";
import { P_Login } from './auth/P_Login';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from "./store/Store";
import T_Characterization from "./modules/configuration/pages/T_Chararacterization";
import { Navbar } from "./core/components/Navbar";
import { Sidenav } from "./core/components/Sidenav";
import { TUsersRoles } from "./modules/admin/pages/TUsersRoles";
import TTreeGroup from "./modules/configuration/pages/TTreeGroup";
import TKindProcedure from "./modules/configuration/pages/TKindProcedure";
import { T_Procedure } from "./modules/configuration/pages/T_Procedure";
import { T_BusinesProcess } from "./modules/configuration/pages/T_BusinessProcess";
import { TSuscription } from "./modules/suscription/pages/TSuscription";
import { TTrayForVerify } from "./modules/trays/pages/TTrayForVerify";
import { TAdminMMR } from "./modules/admin/pages/TAdminMMR";
import TListParameter from "./modules/admin/pages/TListParameter";
import { TTrayToBeAssing } from "./modules/trays/pages/TTrayToBeAssign";
import { TTrayForManage } from "./modules/trays/pages/TTrayForManage";
import { TTrayForRejected } from "./modules/trays/pages/TTrayForRejected";
import { TTrayMyProcedures } from "./modules/trays/pages/TTrayMyProcedures";
import { TSystemProperties } from "./modules/admin/pages/TSystemProperties";
import THistoryProcess from "./modules/configuration/pages/THistoryProcess";
import TOficce from "./modules/configuration/pages/TOffice";
import TTypeForms from "./modules/configuration/pages/TTypeForms";
import TForms from "./modules/configuration/pages/TForms";
import TJsonServiceClass from "./modules/configuration/pages/TJsonServiceClass";
import TJsonService from "./modules/configuration/pages/TJsonService";
import T_CustomerType from "./modules/configuration/pages/T_CustomerType";
import { useEffect } from "react";
import { getBusinessClassCatalog } from "./actions/AConfig";
import TCategoryResource from "./modules/multimedia/pages/TCategoryResource";
import TResource from "./modules/multimedia/pages/TResource";
import TNew from "./modules/multimedia/pages/TNew";
import { formP } from "./auth/formp";
import { TOpenAgenda } from "./modules/agenda/pages/TOpenAgenda";
import { TAgenda } from "./modules/agenda/pages/TAgenda2";

import { TIndumilOffices } from "./modules/weapons/pages/TIndumilOffices";
import { TWeapon } from "./modules/weapons/pages/TWeapon";
import { NEMeet } from "./modules/agenda/components/NEMeet";
import { SRegisterBioData } from "./modules/citizenData/pages/SRegisterBioData";
import { SValidationBioData } from "./modules/citizenData/pages/SValidationBioData";
import { SUser } from "./modules/admin/pages/SUser";
import { SSpecialPermission } from "./modules/weapons/pages/SSpecialPermission";
import { TPermission } from "./modules/weapons/pages/TPermission";
import { DataBase } from "./auth/DataBase";
import { TTypeProduct } from "./modules/weapons/pages/TTypeProduct";
import { TLote } from "./modules/weapons/pages/TLote";
import { TProductKind } from "./modules/weapons/pages/TProductKind";
import { TProduct } from "./modules/weapons/pages/TProduct";
import { TloadStore } from "./modules/weapons/pages/TloadStore";
import { TPushStore } from "./modules/weapons/components/TPushStore";

interface IApp { }

export const App: React.FC<IApp> = () => {

  const { checking } = useSelector((state: RootState) => state.auth);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getBusinessClassCatalog());
  }, [dispatch]);

  if (!checking) {
    return (
      <HashRouter>
        <Switch>
          <Route exact path="/login" component={P_Login} />
          <Route exact path="/data-base" component={DataBase} />

          {(!checking) ?
            <Redirect to="/login" />
            : <Redirect to="/dashboard" />
          }
        </Switch>
      </HashRouter>
    );
  }
  else {
    return (
      <div>
        <HashRouter>
          <Route exact path="/formPrueba" component={formP} />
          <Navbar />
          <div id="layoutSidenav">
            <Sidenav />
            {/* <div className="container d-flex justify-content-center mt-15">
              <img
                className="main-logo"
                src={process.env.PUBLIC_URL + '/assets/SIAEM.png'}
                alt="siam logo" />
            </div> */}
            <Switch>
              <Route exact path="/user" component={TUsersRoles} />
              <Route exact path="/grupo" component={TTreeGroup} />
              <Route exact path="/kindProcedure" component={TKindProcedure} />
              <Route exact path="/procedure" component={T_Procedure} />
              <Route exact path="/process" component={T_BusinesProcess} />
              <Route exact path="/login" component={P_Login} />
              <Route exact path="/suscription" component={TSuscription} />
              <Route exact path="/trayDocumentsForVerify" component={TTrayForVerify} />
              <Route exact path="/adminMenu" component={TAdminMMR} />
              <Route exact path="/parameter" component={TListParameter} />
              <Route exact path="/trayProcessToBeAssign" component={TTrayToBeAssing} />
              <Route exact path="/trayDocumentsForManage" component={TTrayForManage} />
              <Route exact path="/trayDocumentsReject" component={TTrayForRejected} />
              <Route exact path="/trayMyProcess" component={TTrayMyProcedures} />
              <Route exact path="/systemProperties" component={TSystemProperties} />
              <Route exact path="/history-process" component={THistoryProcess} />
              <Route exact path="/Office" component={TOficce} />
              <Route exact path="/type-forms" component={TTypeForms} />
              <Route exact path="/forms" component={TForms} />
              <Route exact path="/json-service-class" component={TJsonServiceClass} />
              <Route exact path="/json-service" component={TJsonService} />
              <Route exact path="/customer-type" component={T_CustomerType} />
              <Route exact path="/characterization" component={T_Characterization} />
              <Route exact path="/category-resource" component={TCategoryResource} />
              <Route exact path="/resource" component={TResource} />
              <Route exact path="/news" component={TNew} />
              <Route exact path="/agenda" component={TOpenAgenda} />
              <Route exact path="/indumil-offices" component={TIndumilOffices} />
              <Route exact path="/weapons" component={TWeapon} />
              <Route exact path="/new-meet" component={NEMeet} />
              <Route exact path="/view-agenda" component={TAgenda} />
              <Route exact path="/userConfig" component={SUser} />
              <Route exact path="/product-kind" component={TProductKind} />
              <Route exact path="/special-permission" component={SSpecialPermission} />
              <Route exact path="/permissions" component={TPermission} />
              <Route exact path="/bio-data" component={SRegisterBioData} />
              <Route exact path="/bio-data-validation" component={SValidationBioData} />
              <Route exact path="/permissions" component={TPermission} />
              <Route exact path="/product-type" component={TTypeProduct} />
              <Route exact path="/lots" component={TLote} />
              <Route exact path="/products" component={TProduct} />
              <Route exact path="/load-store" component={TloadStore} />
              <Route exact path="/push-store" component={TPushStore} />


              {(!checking) ?
                <Redirect to="/login" />
                : <Redirect to="/dashboard" />
              }
            </Switch >
          </div >
        </HashRouter >
      </div >
    );
  }
}
