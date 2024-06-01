import React from "react";
import { Form } from "react-bootstrap";
import { FormikProps } from "formik";
import { IImagen } from "../../../../../types/Imagen/IImagen";
import { ModalImagen } from "../../ModalImagen/ModalImagen";
import { IArticuloManufacturadoPost } from "../../../../../types/ArticuloManufacturado/IArticuloManufacturadoPost";

interface Step4Props {
  formik: FormikProps<IArticuloManufacturadoPost>;
  selectedFiles: File[];
  setSelectedFiles: React.Dispatch<React.SetStateAction<File[]>>;
  previousImages: IImagen[];
  setPreviousImages: React.Dispatch<React.SetStateAction<IImagen[]>>;
}

const Step4: React.FC<Step4Props> = ({
  selectedFiles,
  setSelectedFiles,
  previousImages,
  setPreviousImages,
}) => {
  return (
    <>
      {/* IMAGENES */}
      <Form.Group controlId="idImagenes" className="mb-3">
        <Form.Label>Imágenes</Form.Label>
        <ModalImagen
          previousImages={previousImages}
          setPreviousImages={setPreviousImages}
          selectedFiles={selectedFiles}
          setSelectedFiles={setSelectedFiles}
          baseUrl="imagen-articulo"
        />
      </Form.Group>
    </>
  );
};

export default Step4;
