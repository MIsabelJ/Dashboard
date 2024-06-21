import React, { useEffect } from "react";
import Drawer from "@mui/material/Drawer";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import IconButton from "@mui/material/IconButton";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import {
  Collapse,
  FormControl,
  InputLabel,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Select,
} from "@mui/material";
import { dashboardItems } from "./DashboardItems";
import { AccountCircle } from "@mui/icons-material";
import { ISucursal } from "../../../types/Sucursal/ISucursal";
import { EmpleadoService } from "../../../services/EmpleadoService";
import { IEmpleado } from "../../../types/Empleado/IEmpleado";
const API_URL = import.meta.env.VITE_API_URL;
const drawerWidth = 240;

const roles: Record<string, string[]> = {
  ADMIN: [
    "Inicio",
    "Artículos",
    "Manufacturados",
    "Insumos",
    "Categorías",
    "Unidades de Medida",
    "Promocion",
    "Sucursales",
    "Pedidos",
    "Usuarios",
  ],
  ADMIN_NEGOCIO: [
    "Inicio",
    "Artículos",
    "Manufacturados",
    "Insumos",
    "Categorías",
    "Unidades de Medida",
    "Promocion",
    "Pedidos",
    "Usuarios",
  ],
  CAJERO: ["Pedidos"],
  COCINERO: ["Artículos", "Manufacturados", "Insumos", "Pedidos"],
  REPOSITOR: ["Artículos", "Insumos"],
  DELIVERY: ["Pedidos"],
};

const Sidebar = ({
  open,
  handleSubMenuClick,
  openSubMenu,
  sucursalSelected,
  sucursales,
  handleChangeSucursal,
  empresa,
  navigate,
}: any) => {
  const empleadoService = new EmpleadoService(`${API_URL}/empleado`);
  const [empleado, setEmpleado] = React.useState<IEmpleado | null>(null);
  const idEmpleado = localStorage.getItem("user");
  const getEmpleado = async () => {
    const response = await empleadoService.getById(Number(idEmpleado));
    if (response) {
      setEmpleado(response);
    } else {
      console.error("No se pudo obtener el empleado con el id proporcionado");
    }
  };

  useEffect(() => {
    getEmpleado();
  }, []);

  return (
    <Drawer
      style={{ zIndex: 100 }}
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
        },
      }}
      variant="persistent"
      anchor="left"
      open={open}
    >
      <h5 style={{ padding: "15px", marginBottom: "0" }}>
        {empresa ? empresa.nombre : ""}
      </h5>
      <Divider />
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginTop: "0px",
        }}
      >
        <IconButton
          aria-label="user"
          color="primary"
          onClick={() => navigate("/profile")}
        >
          <AccountCircle fontSize="large" />
        </IconButton>
        <FormControl
          sx={{ m: 1, minWidth: 120 }}
          size="small"
          disabled={!(empleado && empleado.tipoEmpleado === "ADMIN")}
        >
          <InputLabel id="demo-select-small-label">Sucursal</InputLabel>
          <Select
            labelId="demo-select-small-label"
            id="demo-select-small"
            value={sucursales ? Number(sucursalSelected) : ""}
            label="Branch"
            onChange={(event) => handleChangeSucursal(event)}
          >
            {sucursales &&
              sucursales?.map((sucursal: ISucursal, index: number) => (
                <MenuItem key={index} value={sucursal.id}>
                  {sucursal.nombre}
                </MenuItem>
              ))}
          </Select>
        </FormControl>
      </div>
      <Divider />
      <List>
        {dashboardItems.list.map(({ text, icon, subItems, route }, index) => (
          <React.Fragment key={index}>
            {empleado &&
              roles[empleado.tipoEmpleado.toString()].includes(text) && (
                <div>
                  <ListItem
                    onClick={() => {
                      if (subItems) {
                        handleSubMenuClick(text);
                      } else {
                        navigate(`/${route}`);
                      }
                    }}
                    disablePadding
                  >
                    <ListItemButton>
                      <ListItemIcon>{icon}</ListItemIcon>
                      <ListItemText primary={text} />
                      {subItems &&
                        (openSubMenu[text] ? <ExpandLess /> : <ExpandMore />)}
                    </ListItemButton>
                  </ListItem>
                  {subItems && (
                    <Collapse
                      in={openSubMenu[text]}
                      timeout="auto"
                      unmountOnExit
                    >
                      <List component="div" disablePadding>
                        {subItems.map(
                          (subItem, subIndex) =>
                            roles[empleado.tipoEmpleado.toString()].includes(
                              subItem.text
                            ) && (
                              <ListItem
                                key={`${index}-${subIndex}`}
                                onClick={() => navigate(`/${subItem.route}`)}
                                disablePadding
                                sx={{ pl: 4 }}
                              >
                                <ListItemButton>
                                  <ListItemIcon>{subItem.icon}</ListItemIcon>
                                  <ListItemText primary={subItem.text} />
                                </ListItemButton>
                              </ListItem>
                            )
                        )}
                      </List>
                    </Collapse>
                  )}
                </div>
              )}
          </React.Fragment>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;
