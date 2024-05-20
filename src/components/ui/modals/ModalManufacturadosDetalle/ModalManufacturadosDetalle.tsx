import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { IArticuloManufacturadoDetallePost } from "../../../../types/ArticuloManufacturadoDetalle/IArticuloManufacturadoDetallePost";

interface ArticuloManufacturadoDetalleModalProps {
  show: boolean;
  handleClose: () => void;
  handleSave: (detalle: IArticuloManufacturadoDetallePost) => void;
  listaArticulosInsumo: any[];
}

const ArticuloManufacturadoDetalleModal = ({
  show,
  handleClose,
  handleSave,
  listaArticulosInsumo,
}: ArticuloManufacturadoDetalleModalProps) => {
  const [detalle, setDetalle] = useState<IArticuloManufacturadoDetallePost>({
    cantidad: 0,
    idArticuloInsumo: 0,
  });

  const handleChange = (
    e: React.ChangeEvent<{ name?: string; value: unknown }>
  ) => {
    const { name, value } = e.target;
    setDetalle((prevDetalle) => ({
      ...prevDetalle,
      [name as string]: value,
    }));
  };

  const handleSaveClick = () => {
    handleSave(detalle);
    handleClose();
  };

  return (
    <Dialog open={show} onClose={handleClose}>
      <DialogTitle>Agregar Detalle de Artículo Manufacturado</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          id="cantidad"
          label="Cantidad"
          type="number"
          fullWidth
          value={detalle.cantidad}
          onChange={handleChange}
        />
        <FormControl fullWidth sx={{ mt: 2 }}>
          <InputLabel>Artículo Insumo</InputLabel>
          <Select
            name="idArticuloInsumo"
            value={detalle.idArticuloInsumo}
            onChange={handleChange}
          >
            <MenuItem value={0}>Añadir Insumo</MenuItem>
            {listaArticulosInsumo.map((articuloInsumo) => (
              <MenuItem key={articuloInsumo.id} value={articuloInsumo.id}>
                {articuloInsumo.nombre}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancelar</Button>
        <Button onClick={handleSaveClick}>Guardar</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ArticuloManufacturadoDetalleModal;
