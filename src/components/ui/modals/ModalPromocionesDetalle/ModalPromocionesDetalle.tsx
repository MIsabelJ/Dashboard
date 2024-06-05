// import React from "react";
// import { useEffect, useState } from "react";
// import { useFormik } from "formik";
// import * as Yup from "yup";
// // ---------- ARCHIVOS----------
// import { IPromocionDetallePost } from "../../../../types/PromocionDetalle/IPromocionDetallePost";
// import { IArticulo } from "../../../../types/Articulo/IArticulo";
// import { IArticuloPost } from "../../../../types/Articulo/IArticuloPost";
// import { ArticuloService } from "../../../../services/ArticuloService";
// // import { ModalArticulo } from "../ModalArticulos/ModalArticulos";
// // ---------- ESTILOS ----------
// import { Form, Modal } from "react-bootstrap";
// import { Autocomplete, Box, Button, Grid, TextField } from "@mui/material";
// import AddIcon from "@mui/icons-material/Add";

// // ------------------------------ CÓDIGO ------------------------------
// const API_URL = import.meta.env.VITE_API_URL;

// // ---------- FORMIK ----------
// const initialValues: IPromocionDetallePost = {
//   cantidad: 0,
//   idArticulo: 0,
// };

// const validationSchema = Yup.object({
//   cantidad: Yup.number().required("Campo requerido"),
//   idArticulo: Yup.number().required("Campo requerido"),
// });

// // ---------- INTERFAZ ----------
// interface PromocionesDetalleModalProps {
//   handleSave: (detalle: IPromocionDetallePost) => void;
//   openModal: boolean;
//   setOpenModal: (open: boolean) => void;
// }

// // ------------------------------ COMPONENTE PRINCIPAL ------------------------------

// export const PromocionesDetalleModal = ({
//   handleSave,
//   openModal,
//   setOpenModal,
// }: PromocionesDetalleModalProps) => {
//   // -------------------- STATES --------------------
// //   // Abre el modal de Artículo
// //   const [showModalArticulo, setShowModalArticulo] =
// //     useState<boolean>(false);
//   // Guarda los valores de todos los artículos que existen y que vayan a añadirse con el useEffect
//   const [articulos, setArticulos] = useState<IArticulo[]>([]);
// //   // Utilizado para dar formato a los elementos del dropdown de artículos
// //   const [opcionesArticulos, setOpcionesArticulos] = useState<
// //     { label: string; id: number }[]
// //   >([]);

//   // -------------------- FORMIK --------------------
//   const formik = useFormik({
//     initialValues: initialValues,
//     validationSchema: validationSchema,
//     onSubmit: (values) => {
//       console.log(values);
//       handleSave(values);
//       handleCloseModal();
//     },
//   });

//   // -------------------- SERVICES --------------------
// //   const articuloService = new ArticuloService(API_URL + "/articulo");

//   // -------------------- HANDLES --------------------
//   const handleSubmit = () => {
//     formik.handleSubmit();
//   };

//   const handleCloseModal = () => {
//     formik.resetForm();
//     setOpenModal(false);
//   };

// //   const handleSaveArticulo = async (articulo: IArticuloPost) => {
// //     try {
// //       await articuloService.post(articulo);
// //     } catch (error) {
// //       console.error(error);
// //     }
// //   };

//   // -------------------- FUNCIONES --------------------

// //   const addArticulo = (articulo: IArticulo) => {
// //     setArticulos([...articulos, articulo]);
// //     setShowModalArticulo(false);
// //   };

// //   const getArticulo = async () => {
// //     await articuloService.getAll().then((articuloData) => {
// //     });
// //   };

//   // -------------------- EFFECTS --------------------
// //   useEffect(() => {
// //     const getArticulos = async () => {
// //       const response = await articuloService.getAll();
// //       setArticulos(response);
// //     };
// //     getArticulos();
// //   }, []);

// //   useEffect(() => {
// //     const opciones = articulos.map((articulo) => ({
// //       label: articulo.denominacion,
// //       id: articulo.id,
// //     }));
// //     setOpcionesArticulos(opciones);
// //   }, [articulos]);

//   // -------------------- RENDER --------------------
//   return (
//     <>
//       <Modal show={openModal} onHide={handleCloseModal} size="lg">
//         <Modal.Header closeButton>
//           <Modal.Title>Detalle de Promoción</Modal.Title>
//         </Modal.Header>
//         <Modal.Body style={{ padding: "20px", backgroundColor: "#f8f9fa" }}>
//           <Box sx={{ width: "100%" }}>
//             <React.Fragment>
//               <Form onSubmit={formik.handleSubmit}>
//                 <>
//                   {/* ARTICULO */}
//                   <Form.Group controlId="idArticulo" className="mb-3">
//                     <Form.Label>Artículo</Form.Label>
//                     <Grid container spacing={2} alignItems="center">
//                       <Grid item xs={7}>
//                         <Autocomplete
//                           id="combo-box-demo"
//                         //   options={opcionesArticulos}
//                         //   getOptionKey={(option) => option.id}
//                           sx={{ width: "100%" }}
//                         //   value={
//                         //     opcionesArticulos.find(
//                         //       (option) =>
//                         //         option.id === formik.values.idArticulo
//                         //     ) || null
//                         //   }
//                         //   onChange={(event, value) =>
//                         //     formik.setFieldValue(
//                         //       "idArticulo",
//                         //       value?.id || ""
//                         //     )
//                         //   }
//                         //   isOptionEqualToValue={(option, value) =>
//                         //     option.id === value.id
//                         //   }
//                           renderInput={(params) => (
//                             <TextField
//                               {...params}
//                               label="Seleccione el artículo"
//                             />
//                           )}
//                         />
//                       </Grid>
//                       <Grid
//                         item
//                         xs={5}
//                         display="flex"
//                         justifyContent="flex-end"
//                       >
//                         <Button
//                           onClick={() => {
//                             // setShowModalArticulo(true);
//                           }}
//                           variant="contained"
//                           startIcon={<AddIcon />}
//                         >
//                           Crear Artículo
//                         </Button>
//                       </Grid>
//                     </Grid>
//                     <Form.Control.Feedback type="invalid">
//                       {/* {formik.errors.idArticulo} */}
//                     </Form.Control.Feedback>
//                   </Form.Group>
//                   <Grid
//                     container
//                     spacing={2}
//                     alignItems="center"
//                     justifyContent="center"
//                   >
//                     <Grid item xs={6} alignSelf={"flex-start"}>
//                       {/* CANTIDAD */}
//                       <Form.Group controlId="cantidad" className="mb-3">
//                         <Form.Label>Cantidad</Form.Label>
//                         <Form.Control
//                           type="number"
//                           placeholder="Ingrese la cantidad"
//                           name="cantidad"
//                           value={formik.values.cantidad}
//                           onChange={formik.handleChange}
//                           // isInvalid={
//                           //   formik.touched.cantidad && formik.errors.cantidad
//                           // }
//                         />
//                         <Form.Control.Feedback type="invalid">
//                           {formik.errors.cantidad}
//                         </Form.Control.Feedback>
//                       </Form.Group>
//                     </Grid>
//                     <Grid item xs={6}>
//                       {/* UNIDAD DE MEDIDA */}
//                       <Form.Group controlId="idUnidadMedida" className="mb-3">
//                         <Form.Label>Unidad de Medida</Form.Label>
//                         <div>
//                           <TextField
//                             id="component-disabled"
//                             label="Unidad de Medida"
//                             // value={
//                             //   formik.values.idArticulo
//                             //     ? articulos.find(
//                             //         (articulo) =>
//                             //           articulo.id ===
//                             //           formik.values.idArticulo
//                             //       )?.unidadMedida.denominacion
//                             //     : ""
//                             // }
//                             InputProps={{
//                               readOnly: true,
//                             }}
//                             fullWidth
//                           />
//                         </div>
//                       </Form.Group>
//                     </Grid>
//                   </Grid>
//                 </>
//               </Form>
//             </React.Fragment>
//             <React.Fragment>
//               <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
//                 <Box sx={{ flex: "1 1 auto" }} />
//                 <Button
//                   onClick={handleSubmit}
//                   variant="contained"
//                   color="success"
//                 >
//                   Guardar
//                 </Button>
//               </Box>
//             </React.Fragment>
//           </Box>
//         </Modal.Body>
//       </Modal>
//       {/* <ModalArticulo
//         handleSave={handleSaveArticulo}
//         getInsumos={getArticulo}
//         openModal={showModalArticulo}
//         setOpenModal={setShowModalArticulo}
//       /> */}
//     </>
//   );
// };
