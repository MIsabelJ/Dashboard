import * as React from "react";
import { CategoryItem } from "./CategoryItem";
import { useEffect, useState } from "react";
import { ICategoria } from "../../../types/Categoria/ICategoria";
import List from "@mui/material/List";
import { IconButton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { Loader } from "../../ui/Loader/Loader";
import { CategoriaService } from "../../../services/CategoriaService";
import { CategoriaModal } from "../../ui/modals/ModalCategorias/ModalCategorias";
import { ICategoriaPost } from "../../../types/Categoria/ICategoriaPost";
import Swal from "sweetalert2";

const API_URL = import.meta.env.VITE_API_URL;

export function SeccionCategorias() {
  const [Categoria, setCategoria] = useState<ICategoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const categoriaService = new CategoriaService(API_URL + "/categoria");

  const getCategoria = async () => {
    try {
      const categoriaData = await categoriaService.getAll();
      setCategoria(categoriaData);
    } catch (error) {
      console.error("Error al obtener las categorías:", error);
    } finally {
      setLoading(false);
    }
  };

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
      const response = await categoriaService.post(categoria);
      console.log("Respuesta de handleSave");
      console.log(response);
      getCategoria();
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdate = async (id: number, categoria: ICategoria) => {
    try {
      const response = await categoriaService.put(id, categoria);
      console.log("Respuesta de handleUpdate");
      console.log(response);
      getCategoria();
    } catch (error) {
      console.error(error);
    }
  };

  const addSubCategoria = async (idCategoria: number, subCategoria: ICategoriaPost) => {
    try {
      const response = await categoriaService.addSubCategoria(idCategoria, subCategoria);
      console.log("Respuesta de addSubCategoria");
      console.log(response);
      getCategoria();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getCategoria();
  }, []);

  return (
    <div style={{ paddingTop: "30px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "right",
          paddingRight: "20px",
        }}
      >
        <IconButton
          color="primary"
          aria-label="add"
          onClick={() => {
            setOpenModal(true);
          }}
        >
          <AddIcon  />
        </IconButton>
      </div>
      {!loading && (
        <List
          sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}
          component="nav"
          aria-labelledby="nested-list-subheader"
        >
          {Categoria.length > 0 ? (
            Categoria.map((category) => (
              <CategoryItem key={category.id} category={category} padding={2} handleUpdate={handleUpdate} handleSave={handleSave} addSubCategoria={addSubCategoria} handleDelete={handleDelete}/>
            ))
          ) : (
            <div>No hay categorías creadas.</div>
          )}
        </List>
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
