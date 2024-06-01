import Swal from "sweetalert2";
import { ICategoria } from "../../../../../types/Categoria/ICategoria";

export const swalAlert = (
  title: string,
  content: string,
  icon: "error" | "success"
) => {
  Swal.fire(title, content, icon);
};

// -------------------- MANEJO DE CATEGORÍAS --------------------
interface CategoriaData {
  id: number;
  denominacion: string;
  parent: number | null;
}

export const formatCategorias = (categorias: ICategoria[]) => {
  const categoriasData: CategoriaData[] = [];
  const subCategorias: CategoriaData[] = [];

  categorias.forEach((categoria) => {
    if (categoria.subCategorias.length > 0) {
      categoria.subCategorias.forEach((subCategoria) => {
        subCategorias.push({
          id: subCategoria.id,
          denominacion: subCategoria.denominacion,
          parent: null,
        });
      });
    }
  });

  categorias.forEach((categoria) => {
    if (
      !subCategorias.find((subCategoria) => subCategoria.id === categoria.id)
    ) {
      categoriasData.push({
        id: categoria.id,
        denominacion: categoria.denominacion,
        parent: null,
      });
      if (categoria.subCategorias.length > 0) {
        categoria.subCategorias.forEach((subCategoria) => {
          categoriasData.push({
            id: subCategoria.id,
            denominacion: subCategoria.denominacion,
            parent: categoria.id,
          });
        });
      }
    }
  });

  return categoriasData;
};
