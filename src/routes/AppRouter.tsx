import { Box } from "@mui/material";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../components/pages/Login/Login.tsx";
import { SeccionEmpresa } from "../components/pages/Empresa/SeccionEmpresa.tsx";
import SeccionSucursal from "../components/pages/Sucursal/SeccionSucursal.tsx";
import PersistentDrawerLeft from "../components/ui/Sidebar/PersistentDrawerLeft.tsx";
// import Profile from "../components/auth/Profile.tsx";
import PrivateRoute from "./RoutesProp.tsx";

const AppRouter = () => {
  return (
    <Routes>
      <Route index path="/login" element={<Login />} />
      <Route
        path="/empresa"
        element={<PrivateRoute component={SeccionEmpresa} />}
      />
      <Route
        path="/sucursal"
        element={<PrivateRoute component={SeccionSucursal} />}
      />
      <Route
        path="/inicio"
        element={
          <PrivateRoute
            component={PersistentDrawerLeft}
            sectionName={"Inicio"}
          />
        }
      />
      {/* <Route path="/profile" element={<Profile />} /> */}
      <Route
        path="/articulo-manufacturado"
        element={
          <PrivateRoute
            component={PersistentDrawerLeft}
            sectionName={"Artículos manufacturados"}
          />
        }
      />
      <Route
        path="/articulo-insumo"
        element={
          <PrivateRoute
            component={PersistentDrawerLeft}
            sectionName={"Insumos"}
          />
        }
      />
      <Route
        path="/categoria"
        element={
          <PrivateRoute
            component={PersistentDrawerLeft}
            sectionName={"Categorías"}
          />
        }
      />
      <Route
        path="/promocion"
        element={
          <PrivateRoute
            component={PersistentDrawerLeft}
            sectionName={"Promociones"}
          />
        }
      />
      <Route
        path="/usuario"
        element={
          <PrivateRoute
            component={PersistentDrawerLeft}
            sectionName={"Usuarios"}
          />
        }
      />
      <Route
        path="/unidad-medida"
        element={
          <PrivateRoute
            component={PersistentDrawerLeft}
            sectionName={"Unidades de Medida"}
          />
        }
      />
      <Route
        path="/pedido"
        element={
          <PrivateRoute
            component={PersistentDrawerLeft}
            sectionName={"Pedidos"}
          />
        }
      />
      {/* <Route path="*" element={<Navigate to="/inicio" replace />} /> */}
    </Routes>
  );
};

export default AppRouter;
