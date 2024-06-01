import React from "react";
import { Form } from "react-bootstrap";
import { FormikProps } from "formik";
import { IArticuloInsumoPost } from "../../../../../types/ArticuloInsumo/IArticuloInsumoPost";
import { IImagen } from "../../../../../types/Imagen/IImagen";
import { ModalImagen } from "../../ModalImagen/ModalImagen";

interface Step3Props {
  formik: FormikProps<IArticuloInsumoPost>;
  selectedFiles: File[];
  setSelectedFiles: React.Dispatch<React.SetStateAction<File[]>>;
  previousImages: IImagen[];
  setPreviousImages: React.Dispatch<React.SetStateAction<IImagen[]>>;
}

const Step3: React.FC<Step3Props> = ({
  selectedFiles,
  setSelectedFiles,
  previousImages,
  setPreviousImages,
}) => {
  return (
    <>
      {/* IMAGENES */}
      <Form.Group className="mb-3"></Form.Group>
      <Form.Label>Imágenes</Form.Label>
      <ModalImagen
        previousImages={previousImages}
        setSelectedFiles={setSelectedFiles}
        selectedFiles={selectedFiles}
        baseUrl="imagen-articulo"
        setPreviousImages={setPreviousImages}
      />
    </>
  );
};

export default Step3;
