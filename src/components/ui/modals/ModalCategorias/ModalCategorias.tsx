import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { ICategoriaPost } from "../../../../types/Categoria/ICategoriaPost";
import { CategoriaService } from "../../../../services/CategoriaService";

interface CategoriaModalProps {
  show: boolean;
  handleClose: () => void;
}

const API_URL = import.meta.env.VITE_API_URL;

export const CategoriaModal: React.FC<CategoriaModalProps> = ({
  show,
  handleClose,
}) => {
  const [denominacion, setDenominacion] = useState<string>("");
  const [idSucursales, setIdSucursales] = useState<number[]>([]);
  const [idSubcategorias, setIdSubcategorias] = useState<number[]>([]);

  const categoriaService = new CategoriaService(API_URL + "/categoria");

  const handleSave = async (categoria: ICategoriaPost) => {
    try {
      const response = await categoriaService.post(categoria);
      console.log(response);
    } catch (error) {
      console.error(error);
    }
  };

  const onSave = () => {
    const categoria: ICategoriaPost = {
      denominacion: denominacion,
      idSucursales: idSucursales,
      idSubcategorias: idSubcategorias,
    };
    handleSave(categoria);
    handleClose();
    setDenominacion(""); // Reset form
    setIdSucursales([]);
    setIdSubcategorias([]);
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Crear Categoría</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="formDenominacion">
            <Form.Label>Denominación</Form.Label>
            <Form.Control
              type="text"
              value={denominacion}
              onChange={(e) => setDenominacion(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="formIdSucursales">
            <Form.Label>Sucursales</Form.Label>
            <Form.Control
              type="text"
              value={idSucursales.join(",")}
              onChange={(e) =>
                setIdSucursales(e.target.value.split(",").map(Number))
              }
              placeholder="Ingrese los IDs de las sucursales, separados por comas"
            />
          </Form.Group>
          <Form.Group controlId="formIdSubcategorias">
            <Form.Label>Subcategorías</Form.Label>
            <Form.Control
              type="text"
              value={idSubcategorias.join(",")}
              onChange={(e) =>
                setIdSubcategorias(e.target.value.split(",").map(Number))
              }
              placeholder="Ingrese los IDs de las subcategorías, separados por comas"
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={onSave}>
          Guardar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
