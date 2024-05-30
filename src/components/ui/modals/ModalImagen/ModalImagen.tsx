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
import { ImagenService } from "../../../../services/ImagenService";

// ---------- INTERFAZ ----------
interface ImagenArticuloModalProps {
  selectedFiles: File[];
  setSelectedFiles: React.Dispatch<React.SetStateAction<File[]>>;
  previousImages: IImagen[];
  baseUrl: string;
  setPreviousImages: React.Dispatch<React.SetStateAction<IImagen[]>>
}
const API_URL = import.meta.env.VITE_API_URL;

// ------------------------------ COMPONENTE PRINCIPAL ------------------------------
export const ModalImagen: React.FC<ImagenArticuloModalProps> = ({
  selectedFiles, setSelectedFiles, previousImages, baseUrl, setPreviousImages
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);
  const imagenService = new ImagenService(API_URL +"/"+ baseUrl);

  // -------------------- HANDLERS --------------------
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const files = Array.from(event.target.files);
      setSelectedFiles(selectedFiles ? [...selectedFiles, ...files] : files);
    }
  };

  const handleDeleteLocalImg = (index: number) => {
    setSelectedFiles(prevFiles => {
      const newFiles = prevFiles ? [...prevFiles] : [];
      newFiles.splice(index, 1); // Elimina el archivo en el índice dado
      return newFiles;
    });
  };

  const handleDeleteImg = async (imagen : IImagen, index: number) => {
    if(imagen.id){
      Swal.fire({
        title: "Eliminando imagen...",
        text: "Espere mientras se elimina la imagen.",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      try {
        const url = imagen.url;
        const uuid = imagen.id;
        await imagenService.deleteImg(uuid,url );
        setPreviousImages(prevFiles => {
          const newFiles = prevFiles ? [...prevFiles] : [];
          newFiles.splice(index, 1);
          Swal.close();
          return newFiles;
        });
      } catch (error) {
        Swal.close();
        console.error("Error:", error);
      }
    }
    
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
          {previousImages && previousImages.length > 0
            ? <p style={{ margin: 0 }}>{selectedFiles?.length ?? 0 > 0 ? `${selectedFiles?.length} archivos seleccionados` : "Sin archivos seleccionados"}</p>
            : <p style={{ margin: 0 }}>{previousImages?.length ?? 0 > 0 ? `${previousImages?.length} archivos seleccionados` : "Sin archivos seleccionados"}</p>
          }
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
        {previousImages && previousImages.length > 0 && (
          previousImages.map((image, index) => (
            <ListItem
              key={index}
              secondaryAction={
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={() => handleDeleteImg(image, index)}
                >
                  <DeleteIcon />
                </IconButton>
              }
            >
              <ListItemAvatar>
                <Avatar src={image.url} />
              </ListItemAvatar>
              <ListItemText primary={image.name} />
            </ListItem>
          ))
        )}
        {selectedFiles?.map((file, index) => (
            <ListItem
              style={{ color: "#2e7d32", borderRadius: "50px" }}
              key={index}
              secondaryAction={
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={() => handleDeleteLocalImg(index)}
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
