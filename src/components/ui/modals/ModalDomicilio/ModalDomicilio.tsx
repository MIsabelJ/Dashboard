// ModalDomicilio.tsx
import React, { useState, useEffect } from "react";
import { Modal, Form } from "react-bootstrap";
import { IDomicilioPost } from "../../../../types/Domicilio/IDomicilioPost";
import { LocalidadService } from "../../../../services/LocalidadService";
import { DomicilioService } from "../../../../services/DomicilioService"; // Importar el servicio de Domicilio
import { ILocalidad } from "../../../../types/Localidad/ILocalidad";
import { Box, Button, Grid } from "@mui/material";

const API_URL = import.meta.env.VITE_API_URL;

interface DomicilioModalProps {
  show: boolean;
  handleClose: () => void;
  handleSave: (domicilio: any) => void; // Cambiado el tipo para manejar la respuesta completa
}

export const ModalDomicilio: React.FC<DomicilioModalProps> = ({
  show,
  handleClose,
  handleSave,
}) => {
  const [calle, setCalle] = useState<string>("");
  const [numero, setNumero] = useState<number>(0);
  const [cp, setCp] = useState<number>(0);
  const [piso, setPiso] = useState<number>(0);
  const [nroDpto, setNroDpto] = useState<number>(0);
  const [idLocalidad, setIdLocalidad] = useState<number>(0);
  const [localidades, setLocalidades] = useState<ILocalidad[]>([]);

  const localidadService = new LocalidadService(API_URL + "/localidad");
  const domicilioService = new DomicilioService(API_URL + "/domicilio"); // Crear una instancia del servicio de Domicilio

  useEffect(() => {
    fetchLocalidades();
  }, []);

  const fetchLocalidades = async () => {
    try {
      const response = await localidadService.getAll();
      setLocalidades(response);
    } catch (error) {
      console.error("Error al obtener la lista de localidades:", error);
    }
  };

  const handleSaveDomicilio = async () => {
    const domicilio: IDomicilioPost = {
      calle,
      numero,
      cp,
      piso,
      nroDpto,
      idLocalidad,
    };

    try {
      const response = await domicilioService.post(domicilio); // Guardar el domicilio y obtener la respuesta
      handleSave(response); // Pasar la respuesta completa al manejador de guardado
      handleClose();
      setCalle("");
      setNumero(0);
      setCp(0);
      setPiso(0);
      setNroDpto(0);
      setIdLocalidad(0);
    } catch (error) {
      console.error("Error al guardar el domicilio:", error);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Agregar Domicilio</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ padding: "20px", backgroundColor: "#f8f9fa" }}>
        <Form>
          <Form.Group controlId="formCalle" className="mb-3">
            <Form.Label>Calle</Form.Label>
            <Form.Control
              type="text"
              value={calle}
              onChange={(e) => setCalle(e.target.value)}
            />
          </Form.Group>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Form.Group controlId="formNumero" className="mb-3">
                <Form.Label>Número</Form.Label>
                <Form.Control
                  type="number"
                  value={numero}
                  onChange={(e) => setNumero(Number(e.target.value))}
                />
              </Form.Group>
            </Grid>
            <Grid item xs={6}>
              <Form.Group controlId="formCp" className="mb-3">
                <Form.Label>CP</Form.Label>
                <Form.Control
                  type="number"
                  value={cp}
                  onChange={(e) => setCp(Number(e.target.value))}
                />
              </Form.Group>
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Form.Group controlId="formPiso" className="mb-3">
                <Form.Label>Piso</Form.Label>
                <Form.Control
                  type="number"
                  value={piso}
                  onChange={(e) => setPiso(Number(e.target.value))}
                />
              </Form.Group>
            </Grid>
            <Grid item xs={6}>
              <Form.Group controlId="formNroDpto" className="mb-3">
                <Form.Label>Departamento</Form.Label>
                <Form.Control
                  type="number"
                  value={nroDpto}
                  onChange={(e) => setNroDpto(Number(e.target.value))}
                />
              </Form.Group>
            </Grid>
          </Grid>
          <Form.Group controlId="formLocalidad" className="mb-3">
            <Form.Label>Localidad</Form.Label>
            <Form.Control
              as="select"
              value={idLocalidad}
              onChange={(e) => setIdLocalidad(Number(e.target.value))}
            >
              <option value={0}>Seleccionar Localidad</option>
              {localidades.map((localidad) => (
                <option key={localidad.id} value={localidad.id}>
                  {localidad.nombre} - {localidad.provincia.nombre} (
                  {localidad.provincia.pais.nombre})
                </option>
              ))}
            </Form.Control>
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
          <Button variant="outlined" color="primary" onClick={handleClose}>
            Cancelar
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSaveDomicilio}
          >
            Guardar
          </Button>
        </Box>
      </Modal.Footer>
    </Modal>
  );
};
