import React from "react";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import CategoryIcon from "@mui/icons-material/Category";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import StoreIcon from "@mui/icons-material/Store";
import GroupIcon from "@mui/icons-material/Group";
import ScaleIcon from "@mui/icons-material/Scale";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";

interface IDashboardItem {
  text: string;
  icon: JSX.Element;
  route?: string;
  subItems?: IDashboardItem[];
}

interface IDashboard {
  list: IDashboardItem[];
}

export const dashboardItems: IDashboard = {
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
      text: "Pedidos",
      icon: <ReceiptLongIcon />,
      route: "pedido",
    },
    {
      text: "Usuarios",
      icon: <GroupIcon />,
      route: "usuario",
    },
  ],
};
