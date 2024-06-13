import * as React from "react";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { Main } from "./StyledComponents";
import {
  getFromLocalStorage,
  useLocalStorage,
} from "../../../hooks/localstorage";
import { EmpresaService } from "../../../services/EmpresaService";
import { ISucursal } from "../../../types/Sucursal/ISucursal";
import { SelectChangeEvent } from "@mui/material";
import { DashboardSection } from "./DashboardSection";
import { IEmpresa } from "../../../types/Empresa/IEmpresa";
import { useServiceHeaders } from "../../../hooks/useServiceHeader";

export default function PersistentDrawerLeft({
  sectionName,
}: {
  sectionName: string;
}) {
  const [open, setOpen] = React.useState(true);
  const [openSubMenu, setOpenSubMenu] = React.useState<{
    [key: string]: boolean;
  }>({});
  const [sucursalSelected, setSucursalSelected] = React.useState<string>("");
  const [sucursales, setSucursales] = React.useState<ISucursal[]>();
  const [idSucursalLocalStorage, setIdSucursalLocalStorage] = useLocalStorage(
    "sucursalId",
    sucursalSelected
  );
  const [empresa, setEmpresa] = React.useState<IEmpresa>();

  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;
  const empresaService = useServiceHeaders(EmpresaService, "empresa");

  const handleSubMenuClick = (text: string) => {
    setOpenSubMenu((prevState) => ({
      ...prevState,
      [text]: !prevState[text],
    }));
  };

  const handleChangeSucursal = (event: SelectChangeEvent<string | null>) => {
    setIdSucursalLocalStorage(event.target.value);
    if (event.target.value !== null) setSucursalSelected(event.target.value);
  };

  React.useEffect(() => {
    if (empresaService != null) {
      if (!getFromLocalStorage("empresaId")) navigate("/empresa");
      if (!getFromLocalStorage("sucursalId")) navigate("/sucursal");
      const sucursalId = getFromLocalStorage("sucursalId");
      if (sucursalId) setSucursalSelected(sucursalId);
      const getSucursales = async () => {
        setSucursales(
          await empresaService.getSucursalesByEmpresaId(
            Number(getFromLocalStorage("empresaId"))
          )
        );
      };
      getSucursales();
      const getEmpresaById = async (idEmpresa: number) => {
        await empresaService.getById(idEmpresa).then((data) => {
          if (data) setEmpresa(data);
        });
      };
      getEmpresaById(Number(getFromLocalStorage("empresaId")));
    }
  }, [empresaService]);

  React.useEffect(() => {
    if (idSucursalLocalStorage) setSucursalSelected(idSucursalLocalStorage);
  }, [idSucursalLocalStorage]);

  return (
    <Box sx={{ display: "flex", width: "100vw", height: "100vh" }}>
      <CssBaseline />
      <Navbar
        open={open}
        handleDrawerOpen={() => setOpen(true)}
        sectionName={sectionName}
      />
      <Sidebar
        open={open}
        handleDrawerClose={() => setOpen(false)}
        handleSubMenuClick={handleSubMenuClick}
        openSubMenu={openSubMenu}
        sucursalSelected={sucursalSelected}
        sucursales={sucursales}
        handleChangeSucursal={handleChangeSucursal}
        empresa={empresa}
        navigate={navigate}
      />
      <Main style={{ marginTop: "36px" }} open={open}>
        <DashboardSection sectionName={sectionName} />
      </Main>
    </Box>
  );
}
