// import React, { useState, useEffect } from "react";
// // ---------- ARCHIVOS----------
// // import { LocalidadService } from "../../../../services/LocalidadService";
// import { DomicilioService } from "../../../../services/DomicilioService";
// import { IDomicilioPost } from "../../../../types/Domicilio/IDomicilioPost";
// import { ILocalidad } from "../../../../types/Localidad/ILocalidad";
// import { IProvincia } from "../../../../types/Provincia/IProvincia";
// import { IPais } from "../../../../types/Pais/IPais";
// import { PaisService } from "../../../../services/PaisService";
// // import { ProvinciaService } from "../../../../services/ProvinciaService";
// // ---------- ESTILOS ----------
// import { Box, Button, Grid } from "@mui/material";
// import { Modal, Form } from "react-bootstrap";

// // ------------------------------ CÓDIGO ------------------------------
// const API_URL = import.meta.env.VITE_API_URL;

// // ---------- INTERFAZ ----------
// interface DomicilioModalProps {
//   show: boolean;
//   handleClose: () => void;
//   handleSave: (domicilio: any) => void; // Cambiado el tipo para manejar la respuesta completa
// }

// // ------------------------------ COMPONENTE PRINCIPAL ------------------------------
// export const ModalDomicilio: React.FC<DomicilioModalProps> = ({
//   show,
//   handleClose,
//   handleSave,
// }) => {
//   // -------------------- STATES --------------------
//   const [calle, setCalle] = useState<string>("");
//   const [numero, setNumero] = useState<number>(0);
//   const [cp, setCp] = useState<number>(0);
//   const [piso, setPiso] = useState<number>(0);
//   const [nroDpto, setNroDpto] = useState<number>(0);
//   // DROPDOWN PAÍS, PROVINCIA, LOCALIDAD
//   const [idPais, setIdPais] = useState<number>(0);
//   const [paises, setPaises] = useState<IPais[]>([]);
//   const [idProvincia, setIdProvincia] = useState<number>(0);
//   const [provincias, setProvincias] = useState<IProvincia[]>([]);
//   const [idLocalidad, setIdLocalidad] = useState<number>(0);
//   const [localidades, setLocalidades] = useState<ILocalidad[]>([]);

//   // -------------------- SERVICES --------------------
//   const paisService = new PaisService(API_URL + "/pais");
//   // const provinciaService = new ProvinciaService(API_URL + "/provincia");
//   // const localidadService = new LocalidadService(API_URL + "/localidad");
//   const domicilioService = new DomicilioService(API_URL + "/domicilio");

//   // -------------------- HANDLERS --------------------
//   const handlePaisChange = async (e: any) => {
//     const selectedPaisId = Number(e.target.value);
//     setIdPais(selectedPaisId);

//     if (selectedPaisId !== 0) {
//       try {
//         const provincias = await fetchProvinciasByPais(selectedPaisId);
//         setProvincias(provincias);
//       } catch (error) {
//         console.error("Error al obtener las provincias:", error);
//       }
//     } else {
//       setProvincias([]);
//       setLocalidades([]);
//     }
//   };

//   const handleProvinciaChange = async (e: any) => {
//     const selectedProvinciaId = Number(e.target.value);
//     setIdProvincia(selectedProvinciaId);

//     if (selectedProvinciaId !== 0) {
//       try {
//         const localidades = await fetchLocalidadesByProvincia(
//           selectedProvinciaId
//         );
//         setLocalidades(localidades);
//       } catch (error) {
//         console.error("Error al obtener las localidades:", error);
//       }
//     } else {
//       setLocalidades([]);
//     }
//   };

//   const handleSaveDomicilio = async () => {
//     const domicilio: IDomicilioPost = {
//       calle,
//       numero,
//       cp,
//       piso,
//       nroDpto,
//       idLocalidad,
//     };

//     try {
//       const response = await domicilioService.post(domicilio); // Guardar el domicilio y obtener la respuesta
//       handleSave(response); // Pasar la respuesta completa al manejador de guardado
//       handleClose();
//       setCalle("");
//       setNumero(0);
//       setCp(0);
//       setPiso(0);
//       setNroDpto(0);
//       setIdLocalidad(0);
//     } catch (error) {
//       console.error("Error al guardar el domicilio:", error);
//     }
//   };

//   // -------------------- FUNCIONES --------------------
//   const fetchPaises = async () => {
//     try {
//       const response = await paisService.getAll();
//       setPaises(response);
//     } catch (error) {
//       console.error("Error al obtener la lista de países:", error);
//     }
//   };

//   const fetchProvinciasByPais = async (paisId: number) => {
//     try {
//       const response = await fetch(`${API_URL}/provincia/findByPais/${paisId}`);
//       return response.json();
//     } catch (error) {
//       throw new Error("Error al obtener las provincias por país");
//     }
//   };

//   const fetchLocalidadesByProvincia = async (provinciaId: number) => {
//     try {
//       const response = await fetch(
//         `${API_URL}/localidad/findByProvincia/${provinciaId}`
//       );
//       return response.json();
//     } catch (error) {
//       throw new Error("Error al obtener las localidades por provincia");
//     }
//   };

//   // -------------------- EFFECTS --------------------
//   useEffect(() => {
//     fetchPaises();
//   }, []);

//   useEffect(() => {
//     if (idProvincia !== 0) {
//       fetchLocalidadesByProvincia(idProvincia);
//     } else {
//       setLocalidades([]);
//     }
//   }, [idProvincia]);

//   // -------------------- RENDER --------------------
//   return (
//     <Modal show={show} onHide={handleClose} size="lg">
//       <Modal.Header closeButton>
//         <Modal.Title>Agregar Domicilio</Modal.Title>
//       </Modal.Header>
//       <Modal.Body style={{ padding: "20px", backgroundColor: "#f8f9fa" }}>
//         <Form>
//           {/* CALLE */}
//           <Form.Group controlId="formCalle" className="mb-3">
//             <Form.Label>Calle</Form.Label>
//             <Form.Control
//               type="text"
//               value={calle}
//               onChange={(e) => setCalle(e.target.value)}
//             />
//           </Form.Group>
//           <Grid container spacing={2}>
//             <Grid item xs={6}>
//               {/* NUMERO */}
//               <Form.Group controlId="formNumero" className="mb-3">
//                 <Form.Label>Número</Form.Label>
//                 <Form.Control
//                   type="number"
//                   value={numero}
//                   onChange={(e) => setNumero(Number(e.target.value))}
//                 />
//               </Form.Group>
//             </Grid>
//             <Grid item xs={6}>
//               {/* CP */}
//               <Form.Group controlId="formCp" className="mb-3">
//                 <Form.Label>CP</Form.Label>
//                 <Form.Control
//                   type="number"
//                   value={cp}
//                   onChange={(e) => setCp(Number(e.target.value))}
//                 />
//               </Form.Group>
//             </Grid>
//           </Grid>
//           <Grid container spacing={2}>
//             <Grid item xs={6}>
//               {/* PISO */}
//               <Form.Group controlId="formPiso" className="mb-3">
//                 <Form.Label>Piso</Form.Label>
//                 <Form.Control
//                   type="number"
//                   value={piso}
//                   onChange={(e) => setPiso(Number(e.target.value))}
//                 />
//               </Form.Group>
//             </Grid>
//             <Grid item xs={6}>
//               {/* N° DEPARTAMENTO */}
//               <Form.Group controlId="formNroDpto" className="mb-3">
//                 <Form.Label>Departamento</Form.Label>
//                 <Form.Control
//                   type="number"
//                   value={nroDpto}
//                   onChange={(e) => setNroDpto(Number(e.target.value))}
//                 />
//               </Form.Group>
//             </Grid>
//           </Grid>
//           {/* PAIS */}
//           <Grid container spacing={2}>
//             <Grid item xs={4}>
//               <Form.Group controlId="formPais" className="mb-3">
//                 <Form.Label>País</Form.Label>
//                 <Form.Control
//                   as="select"
//                   value={idPais}
//                   onChange={handlePaisChange}
//                 >
//                   <option value={0}>Seleccionar País</option>
//                   {paises.map((pais) => (
//                     <option key={pais.id} value={pais.id}>
//                       {pais.nombre}
//                     </option>
//                   ))}
//                 </Form.Control>
//               </Form.Group>
//             </Grid>
//             <Grid item xs={4}>
//               {/* PROVINCIA */}
//               <Form.Group controlId="formProvincia" className="mb-3">
//                 <Form.Label>Provincia</Form.Label>
//                 <Form.Control
//                   as="select"
//                   value={idProvincia}
//                   onChange={handleProvinciaChange}
//                 >
//                   <option value={0}>Seleccionar Provincia</option>
//                   {provincias.map((provincia) => (
//                     <option key={provincia.id} value={provincia.id}>
//                       {provincia.nombre}
//                     </option>
//                   ))}
//                 </Form.Control>
//               </Form.Group>
//             </Grid>
//             {/* LOCALIDAD */}
//             <Grid item xs={4}>
//               <Form.Group controlId="formLocalidad" className="mb-3">
//                 <Form.Label>Localidad</Form.Label>
//                 <Form.Control
//                   as="select"
//                   value={idLocalidad}
//                   onChange={(e) => setIdLocalidad(Number(e.target.value))}
//                 >
//                   <option value={0}>Seleccionar Localidad</option>
//                   {localidades.map((localidad) => (
//                     <option key={localidad.id} value={localidad.id}>
//                       {localidad.nombre}
//                     </option>
//                   ))}
//                 </Form.Control>
//               </Form.Group>
//             </Grid>
//           </Grid>
//         </Form>
//       </Modal.Body>
//       <Modal.Footer>
//         <Box
//           sx={{
//             display: "flex",
//             justifyContent: "space-between",
//             width: "100%",
//           }}
//         >
//           <Button variant="outlined" color="primary" onClick={handleClose}>
//             Cancelar
//           </Button>
//           <Button
//             variant="contained"
//             color="primary"
//             onClick={handleSaveDomicilio}
//           >
//             Guardar
//           </Button>
//         </Box>
//       </Modal.Footer>
//     </Modal>
//   );
// };
