import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import DeleteIcon from '@mui/icons-material/Delete';
import { Avatar, IconButton, List, ListItem, ListItemAvatar, ListItemText, TextField } from '@mui/material';

interface IImageList {
    file: File;
    url: string;
    name: string;
}

interface ImagenArticuloModalProps {
    images: IImageList[];
    setImages: (images: IImageList[]) => void;
}

export const ImagenArticuloModal: React.FC<ImagenArticuloModalProps> = ({ images, setImages }) => {

    // Estado para almacenar archivos seleccionados para subir - CLOUDINARY
    // const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);

    // const handleAddImage = (image: string) => {

    //   if (image.length === 0) return;
    //   setImages([...images, image]);
    //   formik.setFieldValue("idImagenes", "");
    // };



    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        console.log(files)
        if (files) {
            const newImages = Array.from(files).map(file => ({
                file: file,
                url: URL.createObjectURL(file),
                name: file.name
            }));
            setImages([...images, ...newImages]);
        }
    };

    const handleRemoveImage = (indexToRemove: number) => {
        setImages(images.filter((_, index) => index !== indexToRemove));
        // console.log(`images después del borrado de ${indexToRemove}`, images)
    };

    // Función para obtener las imágenes desde la API - CLOUDINARY
    // const getImages = () => {
    //   fetch(`${API_URL}/images/getImages`)
    //     .then((res) => res.json())
    //     .then((data) => setImages(data));
    // };

    // Función para mostrar alertas utilizando SweetAlert - CLOUDINARY
    // const swalAlert = (
    //   title: string,
    //   content: string,
    //   icon: "error" | "success"
    // ) => {
    //   Swal.fire(title, content, icon);
    // };

    // Manejador de cambio de archivos seleccionados - CLOUDINARY
    // const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    //   setSelectedFiles(event.target.files);
    // };

    // const uploadFiles = async () => { // CLOUDINARY
    //   if (!selectedFiles) {
    //     // Mostrar mensaje de advertencia si no se seleccionaron archivos
    //     return Swal.fire(
    //       "No hay imágenes seleccionadas",
    //       "Selecciona al menos una imagen",
    //       "warning"
    //     );
    //   }

    //   // Crear un objeto FormData y agregar los archivos seleccionados 
    //   const formData = new FormData();
    //   Array.from(selectedFiles).forEach((file) => {
    //     formData.append("uploads", file);
    //   });

    //   // Mostrar un mensaje de carga mientras se suben los archivos
    //   Swal.fire({
    //     title: "Subiendo imágenes...",
    //     text: "Espere mientras se suben los archivos.",
    //     allowOutsideClick: false,
    //     didOpen: () => {
    //       Swal.showLoading();
    //     },
    //   });

    //   try {
    //     // Realizar la petición POST para subir los archivos
    //     const response = await fetch(`${API_URL}/images/uploads`, {
    //       method: "POST",
    //       body: formData,
    //     });

    //     if (response.ok) {
    //       // Mostrar mensaje de éxito si la subida fue exitosa
    //       swalAlert("Éxito", "Imágenes subidas correctamente", "success");
    //       getImages(); // Actualizar la lista de imágenes después de subirlas
    //     } else {
    //       // Mostrar mensaje de error si la subida falló
    //       swalAlert(
    //         "Error",
    //         "Algo falló al subir las imágenes, inténtalo de nuevo.",
    //         "error"
    //       );
    //     }
    //   } catch (error) {
    //     // Mostrar mensaje de error si ocurre una excepción
    //     swalAlert("Error", "Algo falló, contacta al desarrollador.", "error");
    //     console.error("Error:", error);
    //   }
    //   setSelectedFiles(null); // Limpiar el estado de archivos seleccionados después de la subida
    // };

    return (
        <>
            <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "2vh",
                padding: ".4rem",
            }}>
                <TextField
                    id="outlined-basic"
                    name="idImagenes"
                    variant="outlined"
                    type="file"
                    onChange={handleFileChange}
                    inputProps={{
                        multiple: true,
                    }}
                />
                <Button onClick={() => alert('subido')} color="inherit" style={{ alignSelf: "center", marginRight: 0 }} >
                    Subir
                </Button>
            </div>
            <List dense={true}>
                {images.map((image, index) => {
                    return (
                        <ListItem
                            key={index}
                            secondaryAction={
                                <IconButton edge="end" aria-label="delete" onClick={() => handleRemoveImage(index)} >
                                    <DeleteIcon />
                                </IconButton>
                            }
                        >
                            <ListItemAvatar>
                                <Avatar alt={image.name} src={image.url} />
                            </ListItemAvatar>
                            <ListItemText
                                primary={image.name}
                            />
                        </ListItem>
                    )
                })}
            </List>
        </>
    );
};