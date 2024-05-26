import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Avatar,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  TextField,
} from "@mui/material";
import Swal from "sweetalert2";
import { IImagenArticulo } from "../../../../types/ImagenArticulo/IImagenArticulo";
import { extractPublicId } from "cloudinary-build-url";
import { South } from "@mui/icons-material";

interface ImagenArticuloModalProps {
  getImages: () => void;
  images: IImagenArticulo[];
  setIdImages: React.Dispatch<React.SetStateAction<string[]>>;
}

const API_URL = import.meta.env.VITE_API_URL;

export const ImagenArticuloModal: React.FC<ImagenArticuloModalProps> = ({
  getImages,
  images,
  setIdImages,
}) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const files = Array.from(event.target.files);
      setSelectedFiles(files);
    }
  };

  // const uploadFiles = async () => {
  //   if (!selectedFiles) {
  //     return Swal.fire(
  //       "No hay imágenes seleccionadas",
  //       "Selecciona al menos una imagen",
  //       "warning"
  //     );
  //   }

  //   const formData = new FormData();
  //   Array.from(selectedFiles).forEach((file) => {
  //     formData.append("uploads", file);
  //   });

  //   Swal.fire({
  //     title: "Subiendo imágenes...",
  //     text: "Espere mientras se suben los archivos.",
  //     allowOutsideClick: false,
  //     didOpen: () => {
  //       Swal.showLoading();
  //     },
  //   });

  //   try {
  //     const response = await fetch(`${API_URL}/imagen-articulo/uploads`, {
  //       method: "POST",
  //       body: formData,
  //     });

  //     if (response.ok) {
  //       swalAlert("Éxito", "Imágenes subidas correctamente", "success");
  //       const data: IImagenArticulo[] = await response.json();
  //       setIdImages((prevImages) => [...prevImages, ...data.map((image) => image.id)]);
  //       await getImages();
  //     } else {
  //       swalAlert(
  //         "Error",
  //         "Algo falló al subir las imágenes, inténtalo de nuevo.",
  //         "error"
  //       );
  //     }
  //   } catch (error) {
  //     swalAlert("Error", "Algo falló, contacta al desarrollador.", "error");
  //     console.error("Error:", error);
  //   }
  //   setSelectedFiles(null);
  // };

  const handleDeleteImg = (index: number) => {
    setSelectedFiles(prevFiles => {
      const newFiles = [...prevFiles];
      newFiles.splice(index, 1);
      return newFiles;
    });
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "2vh",
          padding: ".4rem",
        }}
      >
        <TextField
          id="outlined-basic"
          variant="outlined"
          type="file"
          onChange={handleFileChange}
          inputProps={{
            multiple: true,
          }}
        />
      </div>
      <List dense={true} id="list-item">
        {selectedFiles && Array.from(selectedFiles).map((image, index) => {
          return (
            <ListItem
              key={index}
              secondaryAction={
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={() => handleDeleteImg(index)}
                >
                  <DeleteIcon />
                </IconButton>
              }
            >
              <ListItemAvatar>
                <Avatar alt={image.name} src={URL.createObjectURL(image)} />
              </ListItemAvatar>
              <ListItemText primary={image.name} />
            </ListItem>
          );
        })}
      </List>
    </>
  );
};
