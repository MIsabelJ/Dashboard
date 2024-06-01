import React from "react";
import { Form } from "react-bootstrap";
import { FormikProps } from "formik";
import { IPromocionPost } from "../../../../../types/Promocion/IPromocionPost";
import { IImagen } from "../../../../../types/Imagen/IImagen";
import { ModalImagen } from "../../ModalImagen/ModalImagen";

interface Step4Props {
  formik: FormikProps<IPromocionPost>;
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
      <Form.Group className="mb-3"></Form.Group>
      <Form.Label>Imágenes</Form.Label>
      <ModalImagen
        previousImages={previousImages}
        setSelectedFiles={setSelectedFiles}
        selectedFiles={selectedFiles}
        baseUrl="imagen-promocion"
        setPreviousImages={setPreviousImages}
      />
    </>
  );
};

export default Step4;
