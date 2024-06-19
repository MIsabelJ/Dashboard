import { Form } from "react-bootstrap";
import {
  Autocomplete,
  Button,
  Divider,
  Grid,
  IconButton,
  TextField,
} from "@mui/material";
import SearchBar from "../../../SearchBar/SearchBar";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import DoneIcon from "@mui/icons-material/Done";
import EditRounded from "@mui/icons-material/EditRounded";
import React, { useEffect, useState } from "react";
import { IArticuloInsumo } from "../../../../../types/ArticuloInsumo/IArticuloInsumo";
import { InsumoService } from "../../../../../services/InsumoService";
import { IArticuloManufacturadoPost } from "../../../../../types/ArticuloManufacturado/IArticuloManufacturadoPost";
import { FormikProps } from "formik";

const API_URL = import.meta.env.VITE_API_URL;

interface Step3Props {
  formik: FormikProps<IArticuloManufacturadoPost>;
  searchTerm: string;
  handleSearch: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const Step3: React.FC<Step3Props> = ({ formik, searchTerm, handleSearch }) => {
  // -------------------- STATES --------------------
  const [insumos, setInsumos] = useState<IArticuloInsumo[]>([]);
  const [opcionesInsumos, setOpcionesInsumos] = useState<
    {
      esParaElaborar: boolean;
      label: string;
      id: number;
    }[]
  >([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [creating, setCreating] = useState<boolean>(false);
  const [articuloSeleccionado, setArticuloSeleccionado] = useState<
    {
      articuloInsumo: {
        id: number;
        denominacion: string;
        esParaElaborar: boolean;
      };
      cantidad: number;
    }[]
  >([]);

  // -------------------- SERVICES --------------------
  const insumoService = new InsumoService(API_URL + "/articulo-insumo");

  // -------------------- EFFECTS --------------------
  useEffect(() => {
    const getInsumos = async () => {
      const response = await insumoService.getAll();
      setInsumos(response);
    };
    getInsumos();
  }, []);

  useEffect(() => {
    const opciones = insumos.map((insumo) => ({
      label: insumo.denominacion,
      id: insumo.id,
      esParaElaborar: insumo.esParaElaborar,
    }));
    setOpcionesInsumos(opciones);
  }, [insumos]);

  useEffect(() => {
    // Sync articuloSeleccionado with formik values
    const selected = formik.values.articuloManufacturadoDetalles.map(
      (detalle) => ({
        articuloInsumo: insumos.find(
          (insumo) => insumo.id === detalle.idArticuloInsumo
        ) || { id: 0, denominacion: "", esParaElaborar: true },
        cantidad: detalle.cantidad,
      })
    );
    setArticuloSeleccionado(selected);
  }, [formik.values.articuloManufacturadoDetalles, insumos]);

  // -------------------- HANDLERS --------------------
  const handleAddDetalle = () => {
    const newDetalle = {
      articuloInsumo: { id: 0, denominacion: "", esParaElaborar: true }, // nuevo detalle con valores por defecto
      cantidad: 0,
    };
    setCreating(true);
    setArticuloSeleccionado((prev) => [...prev, newDetalle]);
    formik.setFieldValue("articuloManufacturadoDetalles", [
      { idArticuloInsumo: 0, cantidad: 0 },
      ...formik.values.articuloManufacturadoDetalles,
    ]);
    setEditingIndex(0);
  };

  return (
    <>
      {/* DETALLES MANUFACTURADO */}
      <Form.Group
        controlId="idArticuloManufacturadoDetalles"
        className="mb-3"
        style={{ marginBottom: "2rem" }}>
        <Form.Label style={{ marginBottom: "1rem" }}>Insumos</Form.Label>
        <Grid container spacing={2} alignItems="center">
          <Grid item display="flex" justifyContent="flex-start">
            <Button
              onClick={handleAddDetalle}
              variant="contained"
              startIcon={<AddIcon />}>
              Añadir insumo
            </Button>
          </Grid>
          <Divider style={{ width: "100%", margin: "1rem 0" }} />
          <SearchBar
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Buscar insumo..."
          />
          <div
            style={{
              maxHeight: "150px",
              overflowY: "auto",
              marginLeft: "1rem",
            }}>
            {articuloSeleccionado.length > 0 && (
              <ul style={{ paddingLeft: 0, listStyleType: "none" }}>
                {articuloSeleccionado
                  .filter((detalle) =>
                    detalle.articuloInsumo?.denominacion
                      ?.toLowerCase()
                      .includes(searchTerm.toLowerCase())
                  )
                  .map((detalle, index) => (
                    <div key={index} style={{ marginBottom: "1rem" }}>
                      <Grid
                        container
                        spacing={1}
                        alignItems="center"
                        style={{ marginBottom: "1rem" }}>
                        <Grid item xs={4}>
                          <Autocomplete
                            id="combo-box-demo"
                            options={opcionesInsumos.filter(
                              (opcion) => opcion.esParaElaborar === true
                            )}
                            getOptionKey={(option) => option.id}
                            sx={{ width: "100%" }}
                            value={
                              opcionesInsumos.find(
                                (option) =>
                                  option.id ===
                                  formik.values.articuloManufacturadoDetalles[
                                    index
                                  ]?.idArticuloInsumo
                              ) || null
                            }
                            onChange={(event, value) =>
                              formik.setFieldValue(
                                `articuloManufacturadoDetalles.${index}.idArticuloInsumo`,
                                value?.id || 0
                              )
                            }
                            isOptionEqualToValue={(option, value) =>
                              option.id === value.id
                            }
                            disabled={editingIndex !== index}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                label="Seleccione el insumo"
                              />
                            )}
                          />
                        </Grid>
                        <Grid item xs={3}>
                          <TextField
                            id="outlined-basic"
                            label="Cantidad"
                            variant="outlined"
                            onChange={(e) => {
                              formik.setFieldValue(
                                `articuloManufacturadoDetalles.${index}.cantidad`,
                                Number(e.target.value)
                              );
                            }}
                            value={
                              Number(
                                formik.values.articuloManufacturadoDetalles[
                                  index
                                ]?.cantidad
                              ) || 0
                            }
                            fullWidth
                            disabled={editingIndex !== index}
                          />
                        </Grid>
                        <Grid item xs={3}>
                          <TextField
                            id="component-disabled"
                            label="Unidad de Medida"
                            variant="outlined"
                            value={
                              formik.values.articuloManufacturadoDetalles[index]
                                ?.idArticuloInsumo
                                ? insumos.find(
                                    (insumo) =>
                                      insumo.id ===
                                      formik.values
                                        .articuloManufacturadoDetalles[index]
                                        ?.idArticuloInsumo
                                  )?.unidadMedida?.denominacion || ""
                                : ""
                            }
                            InputProps={{
                              readOnly: true,
                            }}
                            disabled
                            fullWidth
                          />
                        </Grid>
                        <Grid item xs={2}>
                          {editingIndex === index ? (
                            <IconButton
                              aria-label="done"
                              onClick={() => {
                                if (creating) {
                                  setCreating(false);
                                  setEditingIndex(null);
                                } else {
                                  setEditingIndex(null);
                                }
                              }}>
                              <DoneIcon color="success" />
                            </IconButton>
                          ) : (
                            <>
                              <IconButton
                                aria-label="delete"
                                onClick={() => {
                                  formik.setFieldValue(
                                    "articuloManufacturadoDetalles",
                                    formik.values.articuloManufacturadoDetalles.filter(
                                      (detalle, i) => i !== index
                                    )
                                  );
                                }}>
                                <DeleteIcon />
                              </IconButton>
                              <IconButton
                                aria-label="edit"
                                onClick={() => {
                                  setEditingIndex(index);
                                }}>
                                <EditRounded color="primary" />
                              </IconButton>
                            </>
                          )}
                        </Grid>
                      </Grid>
                    </div>
                  ))}
              </ul>
            )}
          </div>
        </Grid>
        <Form.Control.Feedback type="invalid">
          {/* {formik.errors.articuloManufacturadoDetalles} */}
        </Form.Control.Feedback>
      </Form.Group>
    </>
  );
};

export default Step3;
