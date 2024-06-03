import { FormikProps } from "formik";
import { IPromocionPost } from "../../../../../types/Promocion/IPromocionPost";
import React from "react";
import { IPromocionDetallePost } from "../../../../../types/PromocionDetalle/IPromocionDetallePost";
import {
  Autocomplete,
  Box,
  Button,
  Grid,
  IconButton,
  TextField,
} from "@mui/material";
import { Form } from "react-bootstrap";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

interface Step3Props {
  formik: FormikProps<IPromocionPost>;
  detallePromocion: IPromocionDetallePost[];
  setDetallePromocion: React.Dispatch<
    React.SetStateAction<IPromocionDetallePost[]>
  >;
  opcionesArticulos: { label: string; id: number, precioVenta: number }[];
  opcionesSucursal: { label: string; id: number }[];
  handleSucursalChange: (value: { label: string; id: number }[]) => void;
}

const Step3: React.FC<Step3Props> = ({
  formik,
  detallePromocion,
  setDetallePromocion,
  opcionesArticulos,
  opcionesSucursal,
  handleSucursalChange,
}) => {
  return (
    <>
      <Button
        variant="contained"
        color="primary"
        startIcon={<AddIcon />}
        onClick={() =>
          setDetallePromocion([
            ...detallePromocion,
            { id: 0, cantidad: 0, idArticulo: 0 },
          ])
        }
        style={{ margin: "1rem" }}
      >
        Añadir artículos a la promoción
      </Button>
      {detallePromocion.map((detalle, index) => (
        <Grid
          container
          spacing={3}
          key={index}
          alignItems="center"
        >
          <Grid item xs={5}>
            <TextField
              fullWidth
              margin="normal"
              label="Cantidad"
              name={`promocionDetalles[${index}].cantidad`}
              type="number"
              value={detalle.cantidad}
              onChange={(e) => {
                const newDetalles = [...detallePromocion];
                newDetalles[index].cantidad = parseInt(e.target.value, 10);
                setDetallePromocion(newDetalles);
                formik.setFieldValue("promocionDetalles", newDetalles);
              }}
            />
          </Grid>
          <Grid item xs={5}>
            <Autocomplete
              disablePortal
              id="combo-box-demo"
              options={opcionesArticulos.filter((opcion) => opcion.precioVenta > 0)}
              sx={{ width: "100%" }}
              onChange={(event, value) => {
                const newDetalles = [...detallePromocion];
                newDetalles[index].idArticulo = value ? value.id : 0;
                setDetallePromocion(newDetalles);
                formik.setFieldValue("promocionDetalles", newDetalles);
              }}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              renderInput={(params) => (
                <TextField {...params} label="Seleccione el artículo" />
              )}
            />
          </Grid>
          <Grid item xs={2}>
            <IconButton
              onClick={() =>
                setDetallePromocion(
                  detallePromocion.filter((_, i) => i !== index)
                )
              }
            >
              <DeleteIcon />
            </IconButton>
          </Grid>
        </Grid>
      ))}
      <Box style={{ marginTop: "2rem" }}>
        <Form.Label component="legend">Sucursales en las que está disponible</Form.Label>
        <Autocomplete
          multiple
          id="tags-outlined"
          options={opcionesSucursal}
          getOptionLabel={(option) => option?.label || ""}
          filterSelectedOptions
          sx={{ width: "100%" }}
          isOptionEqualToValue={(option, value) => option?.id === value?.id}
          onChange={(event, value) => handleSucursalChange(value)}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Sucursales"
              placeholder="Seleccione sucursales"
            />
          )}
        />
      </Box>
    </>
  );
};

export default Step3;
