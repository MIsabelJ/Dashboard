import React, { useRef, useState } from "react";
import Swal from "sweetalert2";
// import { extractPublicId } from "cloudinary-build-url";
// ---------- ARCHIVOS----------
import { IImagen } from "../../../../types/Imagen/IImagen";
// ---------- ESTILOS ----------
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
  radioClasses,
} from "@mui/material";

// ---------- INTERFAZ ----------
interface ImagenArticuloModalProps {
  selectedFiles: File[];
  setSelectedFiles: React.Dispatch<React.SetStateAction<File[]>>;
}

// ------------------------------ COMPONENTE PRINCIPAL ------------------------------
export const ModalImagen: React.FC<ImagenArticuloModalProps> = ({
  selectedFiles, setSelectedFiles
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);
  // --------------------SWAL --------------------
  // const swalAlert = (
  //   title: string,
  //   content: string,
  //   icon: "error" | "success"
  // ) => {
  //   Swal.fire(title, content, icon);
  // };

  // -------------------- HANDLERS --------------------
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const files = Array.from(event.target.files);
      setSelectedFiles(files);
    }
  };

  const handleDeleteImg = (index: number) => {
    setSelectedFiles(prevFiles => {
      const newFiles = prevFiles ? [...prevFiles] : [];
      newFiles.splice(index, 1); // Elimina el archivo en el índice dado
      return newFiles;
    });
    // const publicId = extractPublicId(url);

    // if (publicId) {
    //   const formdata = new FormData();
    //   formdata.append("publicId", publicId);
    //   formdata.append("uuid", uuid);

    //   Swal.fire({
    //     title: "Eliminando imagen...",
    //     text: "Espere mientras se elimina la imagen.",
    //     allowOutsideClick: false,
    //     didOpen: () => {
    //       Swal.showLoading();
    //     },
    //   });

    //   try {
    //     const response = await fetch(`${API_URL}/imagen-articulo/deleteImg`, {
    //       method: "POST",
    //       body: formdata,
    //     });

    //     Swal.close();

    //     if (response.ok) {
    //       swalAlert("Éxito", "Imagen eliminada correctamente", "success");
    //       setIdImages((prevImages) =>
    //         prevImages.filter((image) => image !== uuid)
    //       );
    //       await getImages();
    //     } else {
    //       swalAlert(
    //         "Error",
    //         "Algo falló al eliminar la imagen, inténtalo de nuevo.",
    //         "error"
    //       );
    //     }
    //   } catch (error) {
    //     Swal.close();
    //     swalAlert("Error", "Algo falló, contacta al desarrollador.", "error");
    //     console.error("Error:", error);
    //   }
    // }
  };

  // -------------------- RENDER --------------------
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
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "2vh",
          width: "380px",
          padding: ".6rem",
          border: isHovered ? "1px solid rgba(0, 0, 0, 0.60)" : "1px solid rgba(0, 0, 0, 0.23) ",
          borderRadius: "4px",
          userSelect: "none",
          cursor: "pointer",
        }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={() => {
            if (fileInput.current) {
              fileInput.current.click();
            }
          }}
        >
          <Button
            variant="light"
            style={{ border: "1px solid rgba(0, 0, 0, 0.60)", padding: ".2rem .4rem ", borderRadius: "4px", margin: "0" }}
          >
            Elegir archivos
          </Button>
          <p style={{ margin: 0 }}>{selectedFiles?.length ?? 0 > 0 ? `${selectedFiles?.length} archivos seleccionados` : "Sin archivos seleccionados"}</p>
        </div>
        <TextField
          id="outlined-basic"
          variant="outlined"
          type="file"
          onChange={handleFileChange}
          style={{ display: "none" }}
          inputProps={{
            multiple: true,
            ref: fileInput,
          }}
        />
      </div >
      <List dense={true} id="list-item">
        {selectedFiles?.map((file, index) => (
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
              <Avatar alt={file.name} src={URL.createObjectURL(file)} />
            </ListItemAvatar>
            <ListItemText primary={file.name} />
          </ListItem>
        ))}
      </List>
    </>
  );
};
