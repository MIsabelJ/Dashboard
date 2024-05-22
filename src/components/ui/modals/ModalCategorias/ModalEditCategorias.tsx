import { useEffect, useState } from "react";
import { ICategoria } from "../../../../types/Categoria/ICategoria";
import { ICategoriaPost } from "../../../../types/Categoria/ICategoriaPost";
import { Modal, Button, Form, ListGroup } from "react-bootstrap";
import { CategoriaModal } from "./ModalCategorias";
interface ICategoriaModalProps {
  show: boolean;
  handleClose: () => void;
  handleUpdate: (id: number, categoria: ICategoria) => void;
  categoria: ICategoria;
  addSubCategoria: (id: number, subCategoria: ICategoriaPost) => void;
}

export const ModalEditCategorias = ({
  show,
  handleClose,
  handleUpdate,
  categoria,
  addSubCategoria,
}: ICategoriaModalProps) => {
  const [denominacion, setDenominacion] = useState(categoria.denominacion);
  const [idSucursales, setIdSucursales] = useState(categoria.sucursales);
  const [idSubcategorias, setIdSubcategorias] = useState(categoria.subcategorias);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    setDenominacion(categoria.denominacion);
    setIdSucursales(categoria.sucursales);
    setIdSubcategorias(categoria.subcategorias);
  }, [categoria ]);
  

  const onSave = () => {
    const categoriaUpdate: ICategoria = {
      id: categoria.id,
      eliminado: categoria.eliminado,
      denominacion: denominacion,
      sucursales: idSucursales,
      subcategorias: idSubcategorias,
    };
    handleUpdate(categoria.id, categoriaUpdate);
    handleClose();
    setDenominacion(""); // Reset form
    setIdSucursales([]);
    setIdSubcategorias([]);
  };
  const handleSaveSubcategoria = async (subcategoria: ICategoriaPost) => {
    await addSubCategoria(categoria.id, subcategoria);
    setOpenModal(false);
};
  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Editar Categoría</Modal.Title>
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
            <Form.Group controlId="formIdSubcategorias">
              <div className="d-flex mb-2">
                <Form.Label className="mr-2">Subcategorías</Form.Label>
                <Button
                  variant="primary"
                  onClick={() => setOpenModal(true)}
                  className="ml-2"
                >
                  Agregar nuevo
                </Button>
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
      <CategoriaModal
        show={openModal}
        handleClose={() => setOpenModal(false)}
        handleSave={handleSaveSubcategoria}
      />
    </>
  );
};
