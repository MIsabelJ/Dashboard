import { Form } from "react-bootstrap";
import { Button, Divider, Grid, IconButton, TextField } from "@mui/material";
import SearchBar from "../../../SearchBar/SearchBar";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditRounded from "@mui/icons-material/EditRounded";
import React from "react";
import { IArticuloInsumo } from "../../../../../types/ArticuloInsumo/IArticuloInsumo";

interface Step3Props {
  articuloSeleccionado: { articuloInsumo: IArticuloInsumo; cantidad: string }[];
  searchTerm: string;
  handleSearch: (event: React.ChangeEvent<HTMLInputElement>) => void;
  setShowDetallesModal: React.Dispatch<React.SetStateAction<boolean>>;
  handleDeleteDetalle: (index: number) => void;
}

const Step3: React.FC<Step3Props> = ({
  articuloSeleccionado,
  searchTerm,
  handleSearch,
  setShowDetallesModal,
  handleDeleteDetalle,
}) => {
  return (
    <>
      {/* DETALLES MANUFACTURADO */}
      <Form.Group
        controlId="idArticuloManufacturadoDetalles"
        className="mb-3"
        style={{ marginBottom: "2rem" }}
      >
        <Form.Label style={{ marginBottom: "1rem" }}>Insumos</Form.Label>
        <Grid container spacing={2} alignItems="center">
          <Grid item display="flex" justifyContent="flex-start">
            <Button
              onClick={() => {
                setShowDetallesModal(true);
              }}
              variant="contained"
              startIcon={<AddIcon />}
            >
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
            }}
          >
            {articuloSeleccionado.length > 0 && (
              <ul style={{ paddingLeft: 0, listStyleType: "none" }}>
                {articuloSeleccionado
                  .filter((detalle) =>
                    detalle.articuloInsumo.denominacion
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase())
                  )
                  .map((detalle, index) => (
                    <div key={index} style={{ marginBottom: "1rem" }}>
                      <Grid
                        container
                        spacing={1}
                        alignItems="center"
                        style={{ marginBottom: "1rem" }}
                      >
                        <Grid item xs={3}>
                          <TextField
                            id="outlined-basic"
                            label="Insumo"
                            variant="outlined"
                            value={detalle.articuloInsumo.denominacion}
                            disabled
                            fullWidth
                          />
                        </Grid>
                        <Grid item xs={3}>
                          <TextField
                            id="outlined-basic"
                            label="Cantidad"
                            variant="outlined"
                            value={detalle.cantidad}
                            disabled
                            fullWidth
                          />
                        </Grid>
                        <Grid item xs={3}>
                          <TextField
                            id="outlined-basic"
                            label="Unidad de Medida"
                            variant="outlined"
                            value={
                              detalle.articuloInsumo.unidadMedida.denominacion
                            }
                            disabled
                            fullWidth
                          />
                        </Grid>
                        <Grid item xs={3}>
                          <IconButton
                            aria-label="delete"
                            onClick={() => handleDeleteDetalle(index)}
                          >
                            <DeleteIcon />
                          </IconButton>
                          <IconButton aria-label="edit">
                            <EditRounded color="primary" />
                          </IconButton>
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
