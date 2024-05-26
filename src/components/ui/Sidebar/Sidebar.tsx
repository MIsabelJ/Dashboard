import * as React from "react";
import { useNavigate } from "react-router-dom";
import { SeccionInicio } from "../../pages/Inicio/SeccionInicio";
import { SeccionInsumos } from "../../pages/Articulos/Insumos/SeccionInsumos";
import { SeccionManufacturados } from "../../pages/Articulos/Manufacturados/SeccionManufacturados";
import { SeccionCategorias } from "../../pages/Categorias/SeccionCategorias";
// import { SeccionPromocion } from "../../pages/Promociones/SeccionPromociones";
// import { SeccionUsuarios } from "../../pages/Usuarios/SeccionUsuarios";
import SeccionSucursal from "../../pages/Sucursal/SeccionSucursal";
import { SeccionUnidadesMedida } from "../../pages/Unidades de Medida/SeccionUnidadesMedida";

import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import CssBaseline from "@mui/material/CssBaseline";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import CategoryIcon from "@mui/icons-material/Category";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
// import DomainIcon from "@mui/icons-material/Domain";
import StoreIcon from "@mui/icons-material/Store";
import GroupIcon from "@mui/icons-material/Group";
import ScaleIcon from "@mui/icons-material/Scale";
import { AccountCircle, ExpandLess, ExpandMore } from "@mui/icons-material";
import {
  Collapse,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { useAppSelector } from "../../../hooks/redux";

const drawerWidth = 240;

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })<{
  open?: boolean;
}>(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create("margin", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: `-${drawerWidth}px`,
  ...(open && {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  }),
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open }) => ({
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));

// ----------------------------------------------CODIGO POR NOSOTROS------------------------------------------------

// Definición de interfaces para los elementos del menú lateral
interface IDashboardItem {
  text: string;
  icon: JSX.Element;
  route?: string;
  subItems?: IDashboardItem[];
}

interface IDashboard {
  list: IDashboardItem[];
}

// Definición de los elementos del menú principal y sus submenús
const dashboardItems: IDashboard = {
  list: [
    {
      text: "Inicio",
      icon: <DashboardIcon />,
      route: "inicio",
    },
    {
      text: "Artículos",
      icon: <ShoppingBagIcon />,
      subItems: [
        {
          text: "Manufacturados",
          icon: <ShoppingBagIcon />,
          route: "articulo-manufacturado",
        },
        {
          text: "Insumos",
          icon: <ShoppingBagIcon />,
          route: "articulo-insumo",
        },
      ],
    },
    {
      text: "Categorías",
      icon: <CategoryIcon />,
      route: "categoria",
    },
    {
      text: "Unidades de Medida",
      icon: <ScaleIcon />,
      route: "unidad-medida",
    },
    {
      text: "Promocion",
      icon: <LocalOfferIcon />,
      route: "promocion",
    },
    {
      text: "Sucursales",
      icon: <StoreIcon />,
      route: "sucursal",
    },
    {
      text: "Usuarios",
      icon: <GroupIcon />,
      route: "usuario",
    },
  ],
};

//-------------------------------------------------------------------------------------------------------------

// COMPONENTE PRINCIPAL
export default function PersistentDrawerLeft({
  sectionName,
}: {
  sectionName: string;
}) {
  const theme = useTheme();
  const [open, setOpen] = React.useState(true);
  const [openSubMenu, setOpenSubMenu] = React.useState<{
    [key: string]: boolean;
  }>({});

  const handleSubMenuClick = (text: string) => {
    setOpenSubMenu((prevState) => ({
      ...prevState,
      [text]: !prevState[text],
    }));
  };

  const navigate = useNavigate();

  // Función para renderizar la sección correspondiente en función del estado actual
  const dashboardSection = (seccionActual: string) => {
    console.log(seccionActual);
    switch (seccionActual) {
      case "Inicio":
        return <SeccionInicio />;
      case "Artículos manufacturados":
        return <SeccionManufacturados />;
      case "Insumos":
        return <SeccionInsumos />;
      case "Categorías":
        return <SeccionCategorias />;
      case "Unidades de Medida":
        return <SeccionUnidadesMedida />;
      case "Promociones":
        // return <SeccionPromocion />;
        return <h1>Promociones</h1>;
      case "Sucursales":
        return <SeccionSucursal />;
      case "Usuarios":
        // return <SeccionUsuarios />;
        return <h1>Usuarios</h1>;
    }
  };

  // Estado y manejo de la selección de sucursal (menú desplegable)
  const sucursalActive = useAppSelector(
    (state) => state.sucursalReducer.sucursalActual
  );
  const [branch, setBranch] = React.useState(sucursalActive);

  const handleChange = (event: SelectChangeEvent) => {
    setBranch(parseInt(event.target.value as string, 10));
  };
  // -----------------------------------------------------

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <Box sx={{ display: "flex", width: "100vw", height: "100vh" }}>
      <CssBaseline />
      <AppBar style={{ zIndex: 1000 }} position="fixed" open={open}>
        {/* Navbar */}
        <Toolbar>
          <IconButton
            style={{ alignSelf: "center" }}
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{ mr: 2, ...(open && { display: "none" }) }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            {sectionName}
          </Typography>
        </Toolbar>
      </AppBar>
      {/* Sidebar */}
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
        <DrawerHeader>
          <IconButton
            onClick={handleDrawerClose}
            style={{ alignSelf: "center" }}
          >
            {theme.direction === "ltr" ? (
              <ChevronLeftIcon />
            ) : (
              <ChevronRightIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <Divider />
        {/* Usuario y selección de sucursal */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            justifyContent: "center",
          }}
        >
          <IconButton
            aria-label="user"
            color="primary"
            onClick={() => {
              handleChange;
            }}
          >
            <AccountCircle fontSize="large" />
          </IconButton>
          {/* <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
            <InputLabel id="demo-select-small-label">Sucursal</InputLabel>
            <Select
              labelId="demo-select-small-label"
              id="demo-select-small"
              value={branch}
              label="Branch"
            >
              <MenuItem value={"sucursal1"}>Sucursal 1</MenuItem> 
              <MenuItem value={"sucursal2"}>Sucursal 2</MenuItem>
            </Select>
          </FormControl> */}
        </div>
        <Divider />
        <List>
          {/* recorre y renderiza la lista de secciones */}
          {dashboardItems.list.map(({ text, icon, subItems, route }, index) => (
            <div key={index}>
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
                <Collapse in={openSubMenu[text]} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {subItems.map((subItem, subIndex) => (
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
                    ))}
                  </List>
                </Collapse>
              )}
            </div>
          ))}
        </List>
      </Drawer>
      <Main style={{ marginTop: "36px" }} open={open}>
        {dashboardSection(sectionName)}
      </Main>
    </Box>
  );
}
