import React, { useEffect, useState } from "react";
// ---------- ARCHIVOS----------
import { useAppSelector } from "../../../../hooks/redux";
import { SucursalService } from "../../../../services/SucursalService";
import { PaisService } from "../../../../services/PaisService";
import { ISucursal } from "../../../../types/Sucursal/ISucursal";
import { ISucursalPost } from "../../../../types/Sucursal/ISucursalPost";
import { ISucursalEdit } from "../../../../types/Sucursal/ISucursalEdit";
import { IDomicilioPost } from "../../../../types/Domicilio/IDomicilioPost";
import { IPais } from "../../../../types/Pais/IPais";
import { IProvincia } from "../../../../types/Provincia/IProvincia";
import { ILocalidad } from "../../../../types/Localidad/ILocalidad";
// ---------- ESTILOS ----------
import { Modal, Form } from "react-bootstrap";
import { Box, Button, Grid, Step, StepLabel, Stepper } from "@mui/material";
// ------------------------------ CÓDIGO ------------------------------
const API_URL = import.meta.env.VITE_API_URL;

const steps = ["Información de la Sucursal", "Domicilio de la Sucursal"];

// ---------- INTERFAZ ----------
interface SucursalModalProps {
  show: boolean;
  handleClose: () => void;
  idEmpresa: number; // Recibe el idEmpresa como prop
  handleSave: (sucursal: ISucursalPost) => void;
  getSucursal: () => void;
}

// ------------------------------ COMPONENTE PRINCIPAL ------------------------------
export const ModalSucursal: React.FC<SucursalModalProps> = ({
  show,
  handleClose,
  idEmpresa,
  handleSave,
  getSucursal,
}) => {
  // -------------------- STATES --------------------
  const [error, setError] = useState<string>("");
  const [activeStep, setActiveStep] = useState(0);
  const [nombre, setNombre] = useState<string>("");
  const [horarioApertura, setHorarioApertura] = useState<string>("00:00");
  const [horarioCierre, setHorarioCierre] = useState<string>("00:00");
  const [esCasaMatriz, setEsCasaMatriz] = useState<boolean>(false);
  const [domicilio, setDomicilio] = useState<IDomicilioPost>({
    calle: "",
    numero: 0,
    cp: 0,
    piso: 0,
    nroDpto: 0,
    idLocalidad: 0,
  });
  const [paises, setPaises] = useState<IPais[]>([]);
  const [provincias, setProvincias] = useState<IProvincia[]>([]);
  const [idProvincia, setIdProvincia] = useState<number>(0);
  const [localidades, setLocalidades] = useState<ILocalidad[]>([]);
  const [idPais, setIdPais] = useState<number>(0);

  // -------------------- SERVICES --------------------
  const sucursalService = new SucursalService(API_URL + "/sucursal");
  const paisService = new PaisService(API_URL + "/pais");

  // -------------------- HANDLERS --------------------
  const handlePaisChange = async (e: any) => {
    const selectedPaisId = Number(e.target.value);
    setDomicilio((prevState) => ({
      ...prevState,
      idPais: selectedPaisId,
      idProvincia: 0,
      idLocalidad: 0,
    }));

    if (selectedPaisId !== 0) {
      try {
        const provincias = await fetchProvinciasByPais(selectedPaisId);
        setProvincias(provincias);
        setLocalidades([]);
      } catch (error) {
        console.error("Error al obtener las provincias:", error);
      }
    } else {
      setProvincias([]);
      setLocalidades([]);
    }
  };

  const handleProvinciaChange = async (e: any) => {
    const selectedProvinciaId = Number(e.target.value);
    setDomicilio((prevState) => ({
      ...prevState,
      idProvincia: selectedProvinciaId,
      idLocalidad: 0,
    }));

    if (selectedProvinciaId !== 0) {
      try {
        const localidades = await fetchLocalidadesByProvincia(
          selectedProvinciaId
        );
        setLocalidades(localidades);
      } catch (error) {
        console.error("Error al obtener las localidades:", error);
      }
    } else {
      setLocalidades([]);
    }
  };

  const handleLocalidadChange = (e: any) => {
    const selectedLocalidadId = Number(e.target.value);
    setDomicilio((prevState) => ({
      ...prevState,
      idLocalidad: selectedLocalidadId,
    }));
  };

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

  const handleCloseModal = () => {
    setNombre("");
    setHorarioApertura("00:00");
    setHorarioCierre("00:00");
    setEsCasaMatriz(false);
    setDomicilio({
      calle: "",
      numero: 0,
      cp: 0,
      piso: 0,
      nroDpto: 0,
      idLocalidad: 0,
    });
    setError("");
    handleClose();
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

  // -------------------- FUNCIONES --------------------
  const fetchPaises = async () => {
    try {
      const response = await paisService.getAll();
      setPaises(response);
    } catch (error) {
      console.error("Error al obtener la lista de países:", error);
    }
  };

  const fetchProvinciasByPais = async (paisId: number) => {
    try {
      const response = await fetch(`${API_URL}/provincia/findByPais/${paisId}`);
      return response.json();
    } catch (error) {
      throw new Error("Error al obtener las provincias por país");
    }
  };

  const fetchLocalidadesByProvincia = async (provinciaId: number) => {
    try {
      const response = await fetch(
        `${API_URL}/localidad/findByProvincia/${provinciaId}`
      );
      return response.json();
    } catch (error) {
      throw new Error("Error al obtener las localidades por provincia");
    }
  };

  const empresaActual = useAppSelector(
    (state) => state.empresaReducer.empresaActual
  );

  const dataCard = useAppSelector((state) => state.tableReducer.dataTable);
  const dataFilter: ISucursal[] = dataCard.filter(
    (item: ISucursal) => item.empresa && item.empresa.id === empresaActual
  );

  const elementActive = useAppSelector(
    (state) => state.tableReducer.elementActive
  );

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
      domicilio,
      idEmpresa,
    };

    console.log(sucursal)
    handleSave(sucursal);
    getSucursal();
    handleClose();
    // Resetear los valores del formulario
    setNombre("");
    setHorarioApertura("00:00");
    setHorarioCierre("00:00");
    setEsCasaMatriz(false);
    setDomicilio({
      calle: "",
      numero: 0,
      cp: 0,
      piso: 0,
      nroDpto: 0,
      idLocalidad: 0,
    });
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

  // BOTONES
  // Determinar el texto del botón basado en las condiciones
  const getButtonText = () => {
    if (activeStep === steps.length - 1) {
      return elementActive ? "Actualizar" : "Guardar";
    } else {
      return "Siguiente";
    }
  };

  // -------------------- EFFECTS --------------------
  useEffect(() => {
    if (elementActive && elementActive.element) {
      const sucursal = elementActive.element as ISucursalPost;
      setNombre(sucursal.nombre);
      setHorarioApertura(sucursal.horarioApertura);
      setHorarioCierre(sucursal.horarioCierre);
      setEsCasaMatriz(sucursal.esCasaMatriz);
      setDomicilio(sucursal.domicilio);
    }

    getSucursal();
    fetchPaises();
  }, [elementActive]);

  // -------------------- RENDER --------------------
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
                    {/* NOMBRE */}
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
                        {/* HORARIO DE APERTURA */}
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
                        {/* HORARIO DE CIERRE */}
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
                        {/* ES CASA MATRIZ */}
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
                  <>
                    {/* CAMPOS DE DOMICILIO */}
                    <Form.Group controlId="formDomicilioCalle" className="mb-3">
                      <Form.Label>Calle</Form.Label>
                      <Form.Control
                        type="text"
                        value={domicilio.calle}
                        onChange={(e) =>
                          setDomicilio({ ...domicilio, calle: e.target.value })
                        }
                      />
                    </Form.Group>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Form.Group
                          controlId="formDomicilioNumero"
                          className="mb-3"
                        >
                          <Form.Label>Número</Form.Label>
                          <Form.Control
                            type="number"
                            value={domicilio.numero}
                            onChange={(e) =>
                              setDomicilio({
                                ...domicilio,
                                numero: Number(e.target.value),
                              })
                            }
                          />
                        </Form.Group>
                      </Grid>
                      <Grid item xs={6}>
                        <Form.Group
                          controlId="formDomicilioCp"
                          className="mb-3"
                        >
                          <Form.Label>Código Postal</Form.Label>
                          <Form.Control
                            type="number"
                            value={domicilio.cp}
                            onChange={(e) =>
                              setDomicilio({
                                ...domicilio,
                                cp: Number(e.target.value),
                              })
                            }
                          />
                        </Form.Group>
                      </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Form.Group
                          controlId="formDomicilioPiso"
                          className="mb-3"
                        >
                          <Form.Label>Piso</Form.Label>
                          <Form.Control
                            type="number"
                            value={domicilio.piso}
                            onChange={(e) =>
                              setDomicilio({
                                ...domicilio,
                                piso: Number(e.target.value),
                              })
                            }
                          />
                        </Form.Group>
                      </Grid>
                      <Grid item xs={6}>
                        <Form.Group
                          controlId="formDomicilioNroDpto"
                          className="mb-3"
                        >
                          <Form.Label>Número Depto.</Form.Label>
                          <Form.Control
                            type="number"
                            value={domicilio.nroDpto}
                            onChange={(e) =>
                              setDomicilio({
                                ...domicilio,
                                nroDpto: Number(e.target.value),
                              })
                            }
                          />
                        </Form.Group>
                      </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                      <Grid item xs={4}>
                        {/* PAIS */}
                        <Form.Group controlId="formPais" className="mb-3">
                          <Form.Label>País</Form.Label>
                          <Form.Control
                            as="select"
                            value={domicilio.idPais}
                            onChange={handlePaisChange}
                          >
                            <option value={0}>Seleccionar País</option>
                            {paises.map((pais) => (
                              <option key={pais.id} value={pais.id}>
                                {pais.nombre}
                              </option>
                            ))}
                          </Form.Control>
                        </Form.Group>
                      </Grid>
                      <Grid item xs={4}>
                        {/* PROVINCIA */}
                        <Form.Group controlId="formProvincia" className="mb-3">
                          <Form.Label>Provincia</Form.Label>
                          <Form.Control
                            as="select"
                            value={domicilio.idProvincia}
                            onChange={handleProvinciaChange}
                          >
                            <option value={0}>Seleccionar Provincia</option>
                            {provincias.map((provincia) => (
                              <option key={provincia.id} value={provincia.id}>
                                {provincia.nombre}
                              </option>
                            ))}
                          </Form.Control>
                        </Form.Group>
                      </Grid>
                      <Grid item xs={4}>
                        {/* LOCALIDAD */}
                        <Form.Group controlId="formLocalidad" className="mb-3">
                          <Form.Label>Localidad</Form.Label>
                          <Form.Control
                            as="select"
                            value={domicilio.idLocalidad}
                            onChange={handleLocalidadChange}

                          >
                            <option value={0}>Seleccionar Localidad</option>
                            {localidades.map((localidad) => (
                              <option key={localidad.id} value={localidad.id}>
                                {localidad.nombre}
                              </option>
                            ))}
                          </Form.Control>
                        </Form.Group>
                      </Grid>
                    </Grid>
                  </>
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
    </>
  );
};
