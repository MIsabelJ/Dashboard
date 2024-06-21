import { SeccionInicio } from "../../pages/Inicio/SeccionInicio";
import { SeccionInsumos } from "../../pages/Articulos/Insumos/SeccionInsumos";
import { SeccionManufacturados } from "../../pages/Articulos/Manufacturados/SeccionManufacturados";
import { SeccionCategorias } from "../../pages/Categorias/SeccionCategorias";
import { SeccionPromociones } from "../../pages/Promociones/SeccionPromociones";
import { SeccionUnidadesMedida } from "../../pages/Unidades de Medida/SeccionUnidadesMedida";
import { SeccionPedidos } from "../../pages/Pedidos/SeccionPedidos";
import { SeccionUsuarios } from "../../pages/Usuarios/SeccionUsuarios";
import Profile from "../../pages/Profile/Profile";

export const DashboardSection = ({ sectionName }: { sectionName: string }) => {
  switch (sectionName) {
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
      return <SeccionPromociones />;
    case "Pedidos":
      return <SeccionPedidos />;
    case "Usuarios":
      return <SeccionUsuarios />;
    case "Mi cuenta":
      return <Profile />
    default:
      return null;
  }
};
