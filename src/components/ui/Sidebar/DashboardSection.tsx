import { SeccionInicio } from "../../pages/Inicio/SeccionInicio";
import { SeccionInsumos } from "../../pages/Articulos/Insumos/SeccionInsumos";
import { SeccionManufacturados } from "../../pages/Articulos/Manufacturados/SeccionManufacturados";
import { SeccionCategorias } from "../../pages/Categorias/SeccionCategorias";
import { SeccionPromociones } from "../../pages/Promociones/SeccionPromociones";
// import SeccionSucursal from "../../pages/Sucursal/SeccionSucursal";
import { SeccionUnidadesMedida } from "../../pages/Unidades de Medida/SeccionUnidadesMedida";

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
    // case "Sucursales":
    //   return <SeccionSucursal />;
    case "Usuarios":
      // return <SeccionUsuarios />;
      return <h1>Usuarios</h1>;
    default:
      return null;
  }
};
