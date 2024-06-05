import * as React from "react";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
// ---------- ARCHIVOS----------
import { useAppSelector } from "../../../hooks/redux";
import { CategoriaService } from "../../../services/CategoriaService";
import { ICategoria } from "../../../types/Categoria/ICategoria";
import { ICategoriaPost } from "../../../types/Categoria/ICategoriaPost.ts";
import { CategoriaModal } from "../../ui/modals/ModalCategorias/ModalCategorias";
import { CategoryItem } from "./CategoryItem";
import { Loader } from "../../ui/Loader/Loader";
import SearchBar from "../../ui/SearchBar/SearchBar.tsx";
// ---------- ESTILOS ----------
import { Button, ButtonGroup, IconButton, List } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import "./SeccionCategorias.css";

// ------------------------------ CÓDIGO ------------------------------
const API_URL = import.meta.env.VITE_API_URL;

// ------------------------------ COMPONENTE PRINCIPAL ------------------------------
export function SeccionCategorias() {
  // -------------------- STATES --------------------
  // Barra de búsqueda para categorías
  const [searchTerm, setSearchTerm] = useState("");
  const [rows, setRows] = useState<any[]>([]);
  const [categoria, setCategoria] = useState<ICategoria[]>([]);
  // const categoriasFiltradas: ICategoria[] = [];
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [filtro, setFiltro] = useState("todas");

  // -------------------- SERVICES --------------------
  const categoriaService = new CategoriaService(API_URL + "/categoria");

  // -------------------- HANDLERS --------------------
  const handleDelete = async (id: number) => {
    Swal.fire({
      title: "¿Estas seguro?",
      text: `¿Seguro que quieres editar el estado?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, Adelante!",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await categoriaService.delete(id).then(() => {
          getCategoria();
        });
      }
    });
  };

  const handleSave = async (categoria: ICategoriaPost) => {
    try {
      await categoriaService.post(categoria);
      getCategoria();
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdate = async (id: number, categoria: ICategoriaPost) => {
    try {
      await categoriaService.put(id, categoria);
      getCategoria();
    } catch (error) {
      console.error(error);
    }
  };

  // Barra de búsqueda para categorías
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleFiltro = (filtro: React.SetStateAction<string>) => {
    setFiltro(filtro);
  };

  // -------------------- FUNCIONES --------------------
  // BARRA DE BÚSQUEDA
  // Obtener los datos de la tabla en su estado inicial (sin datos)
  const dataTable = useAppSelector((state) => state.tableReducer.dataTable);

  const getCategoria = async () => {
    try {
      const categoriaData = await categoriaService.getAll();
      setCategoria(formatCategorias(categoriaData));
    } catch (error) {
      console.error("Error al obtener las categorías:", error);
    } finally {
      setLoading(false);
    }
  };

  const addSubCategoria = async (
    idCategoria: number,
    subCategoria: ICategoriaPost
  ) => {
    try {
      await categoriaService.addSubCategoria(idCategoria, subCategoria);
      getCategoria();
    } catch (error) {
      console.error(error);
    }
  };

  const formatCategorias = (categoria: ICategoria[]) => {
    const categoriasData: ICategoria[] = [];
    const subCategorias: ICategoria[] = [];

    categoria.forEach((categoria) => {
      if (categoria.subCategorias.length > 0) {
        categoria.subCategorias.forEach((subCategoria) => {
          subCategorias.push(subCategoria);
        });
      }
    });

    categoria.forEach((categoria) => {
      const categoriaFiltrada =
        filtro === "todas" ||
        (filtro === "paraElaborar" && categoria.esParaElaborar) ||
        (filtro === "paraVender" && !categoria.esParaElaborar);

      if (categoriaFiltrada) {
        categoriasData.push(categoria);
      }

      if (categoria.subCategorias.length > 0) {
        categoria.subCategorias.forEach((subCategoria) => {
          const subCategoriaFiltrada =
            filtro === "todas" ||
            (filtro === "paraElaborar" && subCategoria.esParaElaborar) ||
            (filtro === "paraVender" && !subCategoria.esParaElaborar);

          if (
            subCategoriaFiltrada &&
            !categoriasData.find((cat) => cat.id === subCategoria.id)
          ) {
            categoriasData.push(subCategoria);
          }
        });
      }
    });

    return categoriasData;
  };

  // -------------------- EFFECTS --------------------
  useEffect(() => {
    getCategoria();
  }, [filtro]);

  // BARRA DE BÚSQUEDA
  // useEffect va a estar escuchando el estado 'dataTable' para actualizar los datos de las filas con los datos de la tabla
  useEffect(() => {
    const filteredRows = dataTable.filter((row) =>
      Object.values(row).some((value: any) =>
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
    setRows(filteredRows);
  }, [dataTable, searchTerm]);

  // -------------------- RENDER --------------------
  return (
    <div className="seccion-container">
      {!loading && (
        <>
          <div className="seccion-filtros">
            <ButtonGroup variant="outlined" aria-label="filtros button group">
              <Button
                variant={filtro === "todas" ? "contained" : "outlined"}
                onClick={() => handleFiltro("todas")}
                className={filtro === "todas" ? "filtro-activo" : ""}
              >
                Todas
              </Button>
              <Button
                variant={filtro === "paraElaborar" ? "contained" : "outlined"}
                onClick={() => handleFiltro("paraElaborar")}
                className={filtro === "paraElaborar" ? "filtro-activo" : ""}
              >
                Para Elaborar
              </Button>
              <Button
                variant={filtro === "paraVender" ? "contained" : "outlined"}
                onClick={() => handleFiltro("paraVender")}
                className={filtro === "paraVender" ? "filtro-activo" : ""}
              >
                Para Vender
              </Button>
            </ButtonGroup>
          </div>
          <div className="seccion-busqueda">
            <SearchBar
              value={searchTerm}
              onChange={handleSearch}
              placeholder="Buscar Categoría..."
            />
            <IconButton
              color="primary"
              aria-label="add"
              onClick={() => {
                setOpenModal(true);
              }}
            >
              <AddIcon />
            </IconButton>
          </div>
          <List
            sx={{ width: "100%", bgcolor: "background.paper" }}
            component="nav"
            aria-labelledby="nested-list-subheader"
          >
            {categoria.length > 0 ? (
              categoria
                .filter((category) =>
                  category.denominacion
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase())
                )
                .map((category) => (
                  <CategoryItem
                    key={category.id}
                    category={category}
                    padding={2}
                    handleUpdate={handleUpdate}
                    handleSave={handleSave}
                    addSubCategoria={addSubCategoria}
                    handleDelete={handleDelete}
                  />
                ))
            ) : (
              <div>No hay categorías creadas.</div>
            )}
          </List>
        </>
      )}
      {loading && <Loader />}
      <CategoriaModal
        show={openModal}
        handleClose={() => setOpenModal(false)}
        handleSave={handleSave}
      />
    </div>
  );
}
