import React, { useState } from "react";
import { Modal, Button, Form, ListGroup } from "react-bootstrap";
import { ICategoriaPost } from "../../../../types/Categoria/ICategoriaPost";
import { ISucursal } from "../../../../types/Sucursal/ISucursal";
import { useAppSelector } from "../../../../hooks/redux";

interface CategoriaModalProps {
  show: boolean;
  handleClose: () => void;
  handleSave: (categoria: ICategoriaPost) => void;
}

export const CategoriaModal: React.FC<CategoriaModalProps> = ({
  show,
  handleClose,
  handleSave,
}) => {
  const [denominacion, setDenominacion] = useState<string>("");
  const [idSucursales, setIdSucursales] = useState<number[]>([]);
  const [idSubcategorias, setIdSubcategorias] = useState<number[]>([]);
  const empresaActual = useAppSelector(
    (state) => state.empresaReducer.empresaActual
  );

  const dataCard = useAppSelector((state) => state.tableReducer.dataTable);
  const dataFilter: ISucursal[] = dataCard.filter(
    (item: ISucursal) => item.empresa && item.empresa.id === empresaActual
  );
  const existingSucursales: ISucursal[] = dataFilter;

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
    setIdSucursales(idSucursales.filter((sucursalId) => sucursalId !== id));
  };

  const handleRemoveSubcategoria = (id: number) => {
    setIdSubcategorias(
      idSubcategorias.filter((subcategoriaId) => subcategoriaId !== id)
    );
  };

  return (
    <>
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
              <Form.Label className="mr-2">Sucursales</Form.Label>
              <div className="d-flex flex-wrap mb-2 justify-content-between">
                <div
                  style={{ flex: "1 1 45%", minWidth: "200px" }}
                  className="mr-3"
                >
                  <ListGroup>
                    {existingSucursales.map((sucursal) => (
                      <ListGroup.Item
                        key={sucursal.id}
                        className="d-flex justify-content-between align-items-center"
                      >
                        <span>{sucursal.nombre}</span>
                        <Button
                          variant={
                            idSucursales.includes(sucursal.id)
                              ? "danger"
                              : "success"
                          }
                          size="sm"
                          onClick={() => {
                            if (idSucursales.includes(sucursal.id)) {
                              handleRemoveSucursal(sucursal.id);
                            } else {
                              handleAddSucursal(sucursal.id);
                            }
                          }}
                          className="ml-2"
                        >
                          {idSucursales.includes(sucursal.id)
                            ? "Eliminar"
                            : "Agregar"}
                        </Button>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                </div>
                <div style={{ flex: "1 1 45%", minWidth: "200px" }}>
                  <ListGroup>
                    {idSucursales.map((id) => (
                      <ListGroup.Item
                        key={id}
                        className="d-flex justify-content-between align-items-center"
                      >
                        <span>
                          {
                            existingSucursales.find(
                              (sucursal) => sucursal.id === id
                            )?.nombre
                          }
                        </span>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                </div>
              </div>
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
    </>
  );
};
