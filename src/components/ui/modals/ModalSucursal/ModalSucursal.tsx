import React, { useEffect, useState } from "react";
import { Modal, Form } from "react-bootstrap";
import { ISucursalPost } from "../../../../types/Sucursal/ISucursalPost";
import { SucursalService } from "../../../../services/SucursalService";
import { ModalDomicilio } from "../ModalDomicilio/ModalDomicilio"; // Asegúrate de importar el modal de Domicilio
import { DomicilioService } from "../../../../services/DomicilioService";
import { Box, Button, Grid, Step, StepLabel, Stepper } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { ISucursal } from "../../../../types/Sucursal/ISucursal";
import { useAppSelector } from "../../../../hooks/redux";
import { ISucursalEdit } from "../../../../types/Sucursal/ISucursalEdit";

const API_URL = import.meta.env.VITE_API_URL;

const steps = ["Información de la Sucursal", "Domicilio de la Sucursal"];

interface SucursalModalProps {
  show: boolean;
  handleClose: () => void;
  idEmpresa: number; // Recibe el idEmpresa como prop
  handleSave: (sucursal: ISucursalPost) => void;
  getSucursal: () => void;
}

export const ModalSucursal: React.FC<SucursalModalProps> = ({
  show,
  handleClose,
  idEmpresa,
  handleSave,
  getSucursal,
}) => {
  const [error, setError] = useState<string>("");
  const [activeStep, setActiveStep] = useState(0);
  const [nombre, setNombre] = useState<string>("");
  const [horarioApertura, setHorarioApertura] = useState<string>("00:00");
  const [horarioCierre, setHorarioCierre] = useState<string>("00:00");
  const [esCasaMatriz, setEsCasaMatriz] = useState<boolean>(false);
  const [idDomicilio, setIdDomicilio] = useState<number>(0);
  const [showDomicilioModal, setShowDomicilioModal] = useState<boolean>(false);

  const empresaActual = useAppSelector(
    (state) => state.empresaReducer.empresaActual
  );
  const dataCard = useAppSelector((state) => state.tableReducer.dataTable);
  const dataFilter: ISucursal[] = dataCard.filter(
    (item: ISucursal) => item.empresa && item.empresa.id === empresaActual
  );

  const sucursalService = new SucursalService(API_URL + "/sucursal");
  const domicilioService = new DomicilioService(API_URL + "/domicilio");

  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      try {
        onSave();
      } catch (err) {
        console.log(err);
      }
    } else {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleUpdate = (id: number, sucursal: ISucursalEdit) => {
    console.log(id, sucursal);
    sucursalService.put(id, sucursal);
    handleClose();
  };

  const elementActive = useAppSelector(
    (state) => state.tableReducer.elementActive
  );

  useEffect(() => {
    if (elementActive && elementActive.element) {
      const sucursal = elementActive.element as ISucursal;
      setNombre(sucursal.nombre);
      setHorarioApertura(sucursal.horarioApertura);
      setHorarioCierre(sucursal.horarioCierre);
      setEsCasaMatriz(sucursal.esCasaMatriz);
      setIdDomicilio(sucursal.domicilio.id);
    }

    getSucursal();
  }, [elementActive]);

  const onSave = () => {
    if (esCasaMatriz && dataFilter.some((sucursal) => sucursal.esCasaMatriz)) {
      setError(
        "Ya existe una sucursal casa matriz. Debe modificarla antes de crear una nueva."
      );
      return;
    }

    if (horarioCierre <= horarioApertura) {
      setError(
        "El horario de cierre debe ser mayor que el horario de apertura."
      );
      return;
    }
    // Convertir el horario a formato HH:mm:ss antes de guardar
    const horarioAperturaFormatted = `${horarioApertura}:00`;
    const horarioCierreFormatted = `${horarioCierre}:00`;

    const sucursal: ISucursalPost = {
      nombre,
      horarioApertura: horarioAperturaFormatted,
      horarioCierre: horarioCierreFormatted,
      esCasaMatriz,
      idDomicilio,
      idEmpresa,
    };

    handleSave(sucursal);
    getSucursal();
    handleClose();
    // Resetear los valores del formulario
    setNombre("");
    setHorarioApertura("00:00");
    setHorarioCierre("00:00");
    setEsCasaMatriz(false);
    setIdDomicilio(0);
    setError("");
  };

  const onUpdate = () => {
    if (horarioCierre <= horarioApertura) {
      setError(
        "El horario de cierre debe ser mayor que el horario de apertura."
      );
      return;
    }
    const horarioAperturaFormatted = `${horarioApertura}:00`;
    const horarioCierreFormatted = `${horarioCierre}:00`;

    const sucursal: ISucursalEdit = {
      horarioApertura: horarioAperturaFormatted,
      horarioCierre: horarioCierreFormatted,
      esCasaMatriz,
    };
    handleUpdate(elementActive.element.id, sucursal);
    getSucursal();
    handleClose();
  };

  const handleCloseModal = () => {
    setNombre("");
    setHorarioApertura("00:00");
    setHorarioCierre("00:00");
    setEsCasaMatriz(false);
    setIdDomicilio(0);
    setError("");
    handleClose();
  };

  const handleSaveDomicilio = (domicilio: any) => {
    setIdDomicilio(domicilio.id); // Asigna el ID del domicilio guardado
    setShowDomicilioModal(false);
  };

  // BOTONES
  // Determinar el texto del botón basado en las condiciones
  const getButtonText = () => {
    if (activeStep === steps.length - 1) {
      return elementActive ? "Actualizar" : "Guardar";
    } else {
      return "Siguiente";
    }
  };

  // Determinar la acción del botón basado en las condiciones
  const handleButtonClick = () => {
    if (activeStep === steps.length - 1) {
      if (elementActive) {
        onUpdate();
      } else {
        onSave();
      }
    } else {
      handleNext();
    }
  };

  return (
    <>
      <Modal show={show} onHide={handleClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Agregar Sucursal</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ padding: "20px", backgroundColor: "#f8f9fa" }}>
          <Stepper
            activeStep={activeStep}
            alternativeLabel
            sx={{ padding: "20px 0" }}
          >
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          {activeStep === steps.length ? (
            <React.Fragment>
              <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
                <Box sx={{ flex: "1 1 auto" }} />
                <Button onClick={handleCloseModal}>Finalizar</Button>
              </Box>
            </React.Fragment>
          ) : (
            <React.Fragment>
              {error && (
                <div style={{ color: "red", marginBottom: "10px" }}>
                  {error}
                </div>
              )}
              <Form>
                {activeStep === 0 && (
                  <>
                    <Form.Group controlId="formNombre" className="mb-3">
                      <Form.Label>Nombre</Form.Label>
                      <Form.Control
                        type="text"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        readOnly={!!elementActive}
                      />
                    </Form.Group>
                    <Grid container spacing={2}>
                      <Grid item xs={4}>
                        <Form.Group
                          controlId="formHorarioApertura"
                          className="mb-3"
                        >
                          <Form.Label>Horario de Apertura</Form.Label>
                          <Form.Control
                            type="time"
                            value={horarioApertura}
                            onChange={(e) => setHorarioApertura(e.target.value)}
                          />
                        </Form.Group>
                      </Grid>
                      <Grid item xs={4}>
                        <Form.Group
                          controlId="formHorarioCierre"
                          className="mb-3"
                        >
                          <Form.Label>Horario de Cierre</Form.Label>
                          <Form.Control
                            type="time"
                            value={horarioCierre}
                            onChange={(e) => setHorarioCierre(e.target.value)}
                          />
                        </Form.Group>
                      </Grid>
                      <Grid item xs={4} alignContent="flex-end">
                        <Form.Group
                          controlId="formEsCasaMatriz"
                          className="mb-3"
                        >
                          <Form.Check
                            type="checkbox"
                            label="Es Casa Matriz"
                            checked={esCasaMatriz}
                            onChange={(e) => setEsCasaMatriz(e.target.checked)}
                          />
                        </Form.Group>
                      </Grid>
                    </Grid>
                  </>
                )}
                {activeStep === 1 && (
                  <Form.Group controlId="formDomicilio" className="mb-3">
                    <Form.Label>Domicilio</Form.Label>
                    <div className="d-flex">
                      <Form.Control
                        type="text"
                        value={
                          idDomicilio
                            ? `ID: ${idDomicilio}`
                            : "Ningún domicilio seleccionado"
                        }
                        readOnly
                      />
                      {!elementActive ? (
                        <Button
                          variant="contained"
                          color="inherit"
                          startIcon={<AddIcon />}
                          onClick={() => setShowDomicilioModal(true)}
                        >
                          Añadir
                        </Button>
                      ) : null}
                    </div>
                  </Form.Group>
                )}
              </Form>
            </React.Fragment>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              pt: 2,
              alignItems: "center",
            }}
          >
            <Button
              color="inherit"
              disabled={activeStep === 0}
              onClick={handleBack}
            >
              Atrás
            </Button>
            <Box sx={{ flex: "1 1 auto" }} />
            <Button
              variant="contained"
              color={activeStep === steps.length - 1 ? "success" : "primary"}
              onClick={handleButtonClick}
            >
              {getButtonText()}
            </Button>
          </Box>
        </Modal.Footer>
      </Modal>
      <ModalDomicilio
        show={showDomicilioModal}
        handleClose={() => setShowDomicilioModal(false)}
        handleSave={handleSaveDomicilio} // Pasar el manejador de guardar domicilio
      />
    </>
  );
};
