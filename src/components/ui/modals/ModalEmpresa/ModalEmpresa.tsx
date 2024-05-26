import React, { useState } from "react";
import { IEmpresaPost } from "../../../../types/Empresa/IEmpresaPost";
import { Modal, Form } from "react-bootstrap";
import { Box, Button } from "@mui/material";

// ---------- INTERFAZ ----------
interface EmpresaModalProps {
  show: boolean;
  handleClose: () => void;
  handleSave: (empresa: IEmpresaPost) => void;
}

// ------------------------------ COMPONENTE PRINCIPAL ------------------------------
export const ModalEmpresa: React.FC<EmpresaModalProps> = ({
  show,
  handleClose,
  handleSave,
}) => {
  // -------------------- STATES --------------------
  const [nombre, setNombre] = useState<string>("");
  const [razonSocial, setRazonSocial] = useState<string>("");
  const [cuil, setCuil] = useState<string>("");
  const [error, setError] = useState<string>("");

  const onSave = () => {
    if (cuil.length !== 11) {
      setError("El CUIL debe tener exactamente 11 dígitos");
      return;
    }
    const empresa: IEmpresaPost = {
      nombre: nombre,
      razonSocial: razonSocial,
      cuil: Number(cuil),
    };
    handleSave(empresa);
    handleClose();
    setNombre("");
    setRazonSocial("");
    setCuil("");
    setError("");
  };

  const handleCloseModal = () => {
    setNombre("");
    setRazonSocial("");
    setCuil("");
    setError("");
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Agregar Empresa</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ padding: "20px", backgroundColor: "#f8f9fa" }}>
        <Form>
          <Form.Group controlId="formNombre" className="mb-3">
            <Form.Label>Nombre de la Empresa</Form.Label>
            <Form.Control
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="formRazonSocial" className="mb-3">
            <Form.Label>Razón Social</Form.Label>
            <Form.Control
              type="text"
              value={razonSocial}
              onChange={(e) => setRazonSocial(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="formCuil" className="mb-3">
            <Form.Label>CUIL</Form.Label>
            <Form.Control
              type="text"
              value={cuil}
              onChange={(e) => {
                const value = e.target.value;
                if (value.length <= 11 && /^\d*$/.test(value)) {
                  setCuil(value);
                }
              }}
              isInvalid={!!error}
            />
            <Form.Control.Feedback type="invalid">
              {error}
            </Form.Control.Feedback>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <Button variant="outlined" color="primary" onClick={handleCloseModal}>
            Cancelar
          </Button>
          <Button variant="contained" color="primary" onClick={onSave}>
            Guardar
          </Button>
        </Box>
      </Modal.Footer>
    </Modal>
  );
};
