import { Box } from "@mui/material";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../components/pages/Login/Login.tsx";
import { SeccionEmpresa } from "../components/pages/Empresa/SeccionEmpresa.tsx";
import SeccionSucursal from "../components/pages/Sucursal/SeccionSucursal.tsx";
import PersistentDrawerLeft from "../components/ui/Sidebar/PersistentDrawerLeft.tsx";
import Profile from "../components/auth/Profile.tsx";
import { AuthenticationGuard } from "../components/auth/AuthenticationGuard.tsx";

const AppRouter = () => {
  return (
    <Routes>
      <Route index path="/login" element={<Login />} />
      <Route
        path="/empresa"
        element={<AuthenticationGuard component={SeccionEmpresa} />}
      />
      <Route
        path="/sucursal"
        element={<AuthenticationGuard component={SeccionSucursal} />}
      />
      <Route
        path="/inicio"
        element={
          <AuthenticationGuard
            component={PersistentDrawerLeft}
            sectionName={"Inicio"}
          />
        }
      />
      <Route path="/profile" element={<Profile />} />
      <Route
        path="/articulo-manufacturado"
        element={
          <AuthenticationGuard
            component={PersistentDrawerLeft}
            sectionName={"Artículos manufacturados"}
          />
        }
      />
      <Route
        path="/articulo-insumo"
        element={
          <AuthenticationGuard
            component={PersistentDrawerLeft}
            sectionName={"Insumos"}
          />
        }
      />
      <Route
        path="/categoria"
        element={
          <AuthenticationGuard
            component={PersistentDrawerLeft}
            sectionName={"Categorías"}
          />
        }
      />
      <Route
        path="/promocion"
        element={
          <AuthenticationGuard
            component={PersistentDrawerLeft}
            sectionName={"Promociones"}
          />
        }
      />
      <Route
        path="/usuario"
        element={
          <AuthenticationGuard
            component={PersistentDrawerLeft}
            sectionName={"Usuarios"}
          />
        }
      />
      <Route
        path="/unidad-medida"
        element={
          <AuthenticationGuard
            component={PersistentDrawerLeft}
            sectionName={"Unidades de Medida"}
          />
        }
      />
      <Route
        path="/pedido"
        element={
          <AuthenticationGuard
            component={PersistentDrawerLeft}
            sectionName={"Pedidos"}
          />
        }
      />
      {/* <Route path="*" element={<Navigate to="/login" replace />} /> */}
    </Routes>
  );
};

export default AppRouter;
