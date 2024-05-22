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

interface ImagenArticuloModalProps {
  setIdImages: React.Dispatch<React.SetStateAction<number>>;
}

const API_URL = import.meta.env.VITE_API_URL;

const ImagenArticuloModal: React.FC<ImagenArticuloModalProps> = ({ setIdImages }) => {
  const [images, setImages] = useState<IImagenArticulo[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);

  useEffect(() => {
    getImages();
  }, []);

  const getImages = () => {
    fetch(`${API_URL}/imagen-articulo/getImages`)
      .then((res) => res.json())
      .then((data) => setImages(data));
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedFiles(event.target.files);
  };

  const uploadFiles = async () => {
    if (!selectedFiles) {
      return Swal.fire(
        "No hay imágenes seleccionadas",
        "Selecciona al menos una imagen",
        "warning"
      );
    }

    const formData = new FormData();
    Array.from(selectedFiles).forEach((file) => {
      formData.append("uploads", file);
    });

    Swal.fire({
      title: "Subiendo imágenes...",
      text: "Espere mientras se suben los archivos.",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      const response = await fetch(`${API_URL}/imagen-articulo/uploads`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        swalAlert("Éxito", "Imágenes subidas correctamente", "success");

        const ids = await response.json();
        setIdImages(ids);
        getImages();
      } else {
        swalAlert(
          "Error",
          "Algo falló al subir las imágenes, inténtalo de nuevo.",
          "error"
        );
      }
    } catch (error) {
      swalAlert("Error", "Algo falló, contacta al desarrollador.", "error");
      console.error("Error:", error);
    }
    setSelectedFiles(null);
  };

  const handleDeleteImg = async (uuid: string, url: string) => {
    const publicId = extractPublicId(url);

    if (publicId) {
      const formdata = new FormData();
      formdata.append("publicId", publicId);
      formdata.append("uuid", uuid);

      Swal.fire({
        title: "Eliminando imagen...",
        text: "Espere mientras se elimina la imagen.",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      try {
        const response = await fetch(`${API_URL}/imagen-articulo/deleteImg`, {
          method: "POST",
          body: formdata,
        });

        Swal.close();

        if (response.ok) {
          swalAlert("Éxito", "Imagen eliminada correctamente", "success");
          getImages();
        } else {
          swalAlert(
            "Error",
            "Algo falló al eliminar la imagen, inténtalo de nuevo.",
            "error"
          );
        }
      } catch (error) {
        Swal.close();
        swalAlert("Error", "Algo falló, contacta al desarrollador.", "error");
        console.error("Error:", error);
      }
    }
  };

  const swalAlert = (
    title: string,
    content: string,
    icon: "error" | "success"
  ) => {
    Swal.fire(title, content, icon);
  };

  const handleRemoveImage = (indexToRemove: number) => {
    const newImages = images.filter((_, index) => index !== indexToRemove);
    setImages(newImages);
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
        <Button
          onClick={uploadFiles}
          color="inherit"
          style={{ alignSelf: "center", marginRight: 0 }}
        >
          Subir
        </Button>
      </div>
      <List dense={true}>
        {images.map((image, index) => {
          return (
            <ListItem
              key={index}
              secondaryAction={
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={() => handleDeleteImg(image.id, image.url)}
                >
                  <DeleteIcon />
                </IconButton>
              }
            >
              <ListItemAvatar>
                <Avatar alt={image.name} src={image.url} />
              </ListItemAvatar>
              <ListItemText primary={image.name} />
            </ListItem>
          );
        })}
      </List>
    </>
  );
};

export default ImagenArticuloModal;
