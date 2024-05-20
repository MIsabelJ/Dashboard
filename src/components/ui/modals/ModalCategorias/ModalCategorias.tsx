import React, { useState } from "react";
import { Modal, Button, Form, ListGroup } from "react-bootstrap";
import { ICategoriaPost } from "../../../../types/Categoria/ICategoriaPost";
import { CategoriaService } from "../../../../services/CategoriaService";

interface CategoriaModalProps {
  show: boolean;
  handleClose: () => void;
  handleSave: (categoria: ICategoriaPost) => void;
}

const API_URL = import.meta.env.VITE_API_URL;

const existingSucursales = [
  { id: 1, name: "Sucursal 1" },
  { id: 2, name: "Sucursal 2" },
];

const existingSubcategorias = [
  { id: 1, name: "Subcategoría 1" },
  { id: 2, name: "Subcategoría 2" },
];

export const CategoriaModal: React.FC<CategoriaModalProps> = ({
  show,
  handleClose,
  handleSave,
}) => {
  const [denominacion, setDenominacion] = useState<string>("");
  const [idSucursales, setIdSucursales] = useState<number[]>([]);
  const [idSubcategorias, setIdSubcategorias] = useState<number[]>([]);

  const categoriaService = new CategoriaService(API_URL + "/categoria");

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

  const handleAddNew = (type: "sucursal" | "subcategoria") => {
    alert(`Agregar nueva ${type}`);
  };

  const handleAddSucursal = (id: number) => {
    if (!idSucursales.includes(id)) {
      setIdSucursales([...idSucursales, id]);
    }
  };

  const handleAddSubcategoria = (id: number) => {
    if (!idSubcategorias.includes(id)) {
      setIdSubcategorias([...idSubcategorias, id]);
    }
  };

  const handleRemoveSucursal = (id: number) => {
    setIdSucursales(idSucursales.filter(sucursalId => sucursalId !== id));
  };

  const handleRemoveSubcategoria = (id: number) => {
    setIdSubcategorias(idSubcategorias.filter(subcategoriaId => subcategoriaId !== id));
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
            <div className="d-flex mb-2">
              {/* <Button variant="primary" onClick={() => handleAddNew("sucursal")} className="ml-2">
                Agregar nuevo
              </Button> */}
            </div>
            <ListGroup>
              {existingSucursales.map(sucursal => (
                <ListGroup.Item key={sucursal.id}>
                  {sucursal.name}
                  <Button
                    variant="success"
                    size="sm"
                    onClick={() => handleAddSucursal(sucursal.id)}
                    disabled={idSucursales.includes(sucursal.id)}
                    className="ml-2"
                  >
                    Agregar
                  </Button>
                </ListGroup.Item>
              ))}
            </ListGroup>
            <ListGroup className="mt-3">
              {idSucursales.map(id => (
                <ListGroup.Item key={id}>
                  {existingSucursales.find(sucursal => sucursal.id === id)?.name}
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleRemoveSucursal(id)}
                    className="ml-2"
                  >
                    Eliminar
                  </Button>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Form.Group>
          <Form.Group controlId="formIdSubcategorias">
            <Form.Label>Subcategorías</Form.Label>
            <div className="d-flex mb-2">
              <Button variant="primary" onClick={() => handleAddNew("subcategoria")} className="ml-2">
                Agregar nuevo
              </Button>
            </div>
            <ListGroup>
              {existingSubcategorias.map(subcategoria => (
                <ListGroup.Item key={subcategoria.id}>
                  {subcategoria.name}
                  <Button
                    variant="success"
                    size="sm"
                    onClick={() => handleAddSubcategoria(subcategoria.id)}
                    disabled={idSubcategorias.includes(subcategoria.id)}
                    className="ml-2"
                  >
                    Agregar
                  </Button>
                </ListGroup.Item>
              ))}
            </ListGroup>
            <ListGroup className="mt-3">
              {idSubcategorias.map(id => (
                <ListGroup.Item key={id}>
                  {existingSubcategorias.find(subcategoria => subcategoria.id === id)?.name}
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleRemoveSubcategoria(id)}
                    className="ml-2"
                  >
                    Eliminar
                  </Button>
                </ListGroup.Item>
              ))}
            </ListGroup>
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
