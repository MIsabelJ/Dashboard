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
      setLoading(false);
    } catch (error) {
      console.error("Error al obtener las categorías:", error);
      setLoading(false);
    }
  };
  const handleSave = async (categoria: ICategoriaPost) => {
    try {
      const response = await categoriaService.post(categoria);
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
          <AddIcon />
        </IconButton>
      </div>
      {!loading && Array.isArray(Categoria) && Categoria.length > 0 ? (
        <List
          sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}
          component="nav"
          aria-labelledby="nested-list-subheader"
        >
          {Categoria.map((category) => (
            <CategoryItem key={category.id} category={category} padding={2} />
          ))}
        </List>
      ) : (
        <Loader />
      )}
      <CategoriaModal
      show={openModal}
      handleClose={() => setOpenModal(false)}
      handleSave={handleSave}
      categorias={Categoria}
      />
      
    </div>
  );
}
