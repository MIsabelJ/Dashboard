import { Box } from "@mui/material";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../components/pages/Login/Login.tsx";
import { SeccionEmpresa } from "../components/pages/Empresa/SeccionEmpresa.tsx";
import SeccionSucursal from "../components/pages/Sucursal/SeccionSucursal.tsx";
import PersistentDrawerLeft from "../components/ui/Sidebar/PersistentDrawerLeft.tsx";
import Profile from "../components/auth/Profile.tsx";
import { AuthenticationGuard } from "../components/auth/AuthenticationGuard.tsx";
import CallbackPage from "../components/auth/CallbackPage.tsx";
import { RutaPrivada } from "./RutaPrivada.tsx";

const AppRouter = () => {
  return (
    <Routes>
      <Route index path="/login" element={<Login />} />
      <Route
        path="/empresa"
        element={
          <RutaPrivada rolesPermitidos={["admin", "admin del negocio"]}>
            <AuthenticationGuard component={SeccionEmpresa} />
          </RutaPrivada>
        }
      />
      <Route path="/sucursal" element={<SeccionSucursal />} />
      <Route
        path="/inicio"
        element={
          <RutaPrivada
            rolesPermitidos={[
              "admin",
              "admin del negocio",
              "cajero",
              "cocinero",
              "repositor",
              "delivery",
            ]}>
            <Box sx={{ display: "flex" }}>
              <PersistentDrawerLeft sectionName="Inicio" />
            </Box>
          </RutaPrivada>
        }
      />
      <Route
        path="/profile"
        element={
          <RutaPrivada
            rolesPermitidos={[
              "admin",
              "admin del negocio",
              "cajero",
              "cocinero",
              "repositor",
              "delivery",
            ]}>
            <Profile />
          </RutaPrivada>
        }
      />
      <Route
        path="/articulo-manufacturado"
        element={
          <RutaPrivada
            rolesPermitidos={[
              "admin",
              "admin del negocio",
              "cajero",
              "cocinero",
              "repositor",
              "delivery",
            ]}>
            <Box sx={{ display: "flex" }}>
              <PersistentDrawerLeft sectionName="Artículos manufacturados" />
            </Box>
          </RutaPrivada>
        }
      />
      <Route
        path="/articulo-insumo"
        element={
          <RutaPrivada
            rolesPermitidos={[
              "admin",
              "admin del negocio",
              "cajero",
              "cocinero",
              "repositor",
              "delivery",
            ]}>
            <Box sx={{ display: "flex" }}>
              <PersistentDrawerLeft sectionName="Insumos" />
            </Box>
          </RutaPrivada>
        }
      />
      <Route
        path="/categoria"
        element={
          <RutaPrivada
            rolesPermitidos={[
              "admin",
              "admin del negocio",
              "cajero",
              "cocinero",
              "repositor",
              "delivery",
            ]}>
            <Box sx={{ display: "flex" }}>
              <PersistentDrawerLeft sectionName="Categorías" />
            </Box>
          </RutaPrivada>
        }
      />
      <Route
        path="/promocion"
        element={
          <RutaPrivada
            rolesPermitidos={[
              "admin",
              "admin del negocio",
              "cajero",
              "cocinero",
              "repositor",
              "delivery",
            ]}>
            <Box sx={{ display: "flex" }}>
              <PersistentDrawerLeft sectionName="Promociones" />
            </Box>
          </RutaPrivada>
        }
      />
      <Route
        path="/usuario"
        element={
          <RutaPrivada
            rolesPermitidos={[
              "admin",
              "admin del negocio",
              "cajero",
              "cocinero",
              "repositor",
              "delivery",
            ]}>
            <Box sx={{ display: "flex" }}>
              <PersistentDrawerLeft sectionName="Usuarios" />
            </Box>
          </RutaPrivada>
        }
      />
      <Route
        path="/unidad-medida"
        element={
          <RutaPrivada
            rolesPermitidos={[
              "admin",
              "admin del negocio",
              "cajero",
              "cocinero",
              "repositor",
              "delivery",
            ]}>
            <Box sx={{ display: "flex" }}>
              <PersistentDrawerLeft sectionName="Unidades de Medida" />
            </Box>
          </RutaPrivada>
        }
      />
      <Route
        path="/pedido"
        element={
          <RutaPrivada
            rolesPermitidos={[
              "admin",
              "admin del negocio",
              "cajero",
              "cocinero",
              "repositor",
              "delivery",
            ]}>
            <Box sx={{ display: "flex" }}>
              <PersistentDrawerLeft sectionName="Pedidos" />
            </Box>
          </RutaPrivada>
        }
      />
      <Route path="*" element={<Navigate to="/login" replace />} />
      <Route path="/callback" element={<CallbackPage />} />
    </Routes>
  );
};

export default AppRouter;
