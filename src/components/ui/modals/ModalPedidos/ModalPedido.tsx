import React, { useEffect, useState } from "react";
import { IPedidoPost } from "../../../../types/Pedido/IPedidoPost";
import { Modal, Button, Form } from "react-bootstrap";
import { IPedido } from "../../../../types/Pedido/IPedido";
import { PedidoService } from "../../../../services/PedidoService";
import { useAppDispatch } from "../../../../hooks/redux";
import { setDataTable } from "../../../../redux/slices/TablaReducer";
import { Autocomplete, Checkbox, TextField } from "@mui/material";
import { IDetallePedido } from "../../../../types/DetallePedido/IDetallePedido";
import styled from "styled-components";
import { roles } from "../../../pages/Pedidos/constantes";

// Define ColorDot outside of the component
const ColorDot = styled("span")<{ color?: string }>(({ color }) => ({
  height: 10,
  width: 10,
  backgroundColor: color || "transparent",
  borderRadius: "50%",
  display: "inline-block",
  marginRight: 8,
}));

// ---------- INTERFAZ ----------
interface PedidoModalProps {
  show: boolean;
  handleClose: () => void;
  selectedId?: number;
  role: string;
}

// ------------------------------ COMPONENTE PRINCIPAL ------------------------------
export const PedidoModal: React.FC<PedidoModalProps> = ({
  show,
  handleClose,
  selectedId,
  role,
}) => {
  const [values, setValues] = useState<IPedido>();
  const [valuesPost, setValuesPost] = useState<IPedidoPost>({} as IPedidoPost);
  const [valorSeleccionado, setValorSeleccionado] = useState<string>("");
  const [reponerStock, setReponerStock] = React.useState(true);

  const API_URL = import.meta.env.VITE_API_URL;
  const pedidoService = new PedidoService(API_URL + "/pedido");
  const dispatch = useAppDispatch();

  const handleSave = async () => {
    if (selectedId) {
      try {
        if (valuesPost.estado === "CANCELADO") {
          return await pedidoService.cancelarPedido(selectedId, reponerStock);
        }
        await pedidoService.put(selectedId, valuesPost);
      } catch (error) {
        console.error(error);
      }
    }
    getAll();
    handleClose();
    setValues(undefined);
  };

  const getAll = async () => {
    await pedidoService.getAll().then((pedidoData) => {
      dispatch(setDataTable(pedidoData));
    });
  };

  const getOne = async () => {
    try {
      if (selectedId) {
        const pedido = await pedidoService.getById(selectedId);
        if (pedido) {
          console.log(pedido.estado);
          setValues(pedido);
          setValorSeleccionado(pedido.estado);
          setValuesPost({
            horaEstimadaFinalizacion: pedido.horaEstimadaFinalizacion,
            total: pedido.total,
            totalCosto: pedido.totalCosto,
            estado: pedido.estado,
            tipoEnvio: pedido.tipoEnvio,
            formaPago: pedido.formaPago,
            fechaPedido: pedido.fechaPedido,
            idDomicilio: pedido.domicilio.id,
            idSucursal: pedido.sucursal.id,
            factura: {
              fechaFacturacion: pedido.factura.fechaFacturacion,
              mpPaymentId: pedido.factura.mpPaymentId,
              mpMerchantOrderId: pedido.factura.mpMerchantOrderId,
              mpPreferenceId: pedido.factura.mpPreferenceId,
              mpPaymentType: pedido.factura.mpPaymentType,
              formaPago: pedido.factura.formaPago,
              totalVenta: pedido.factura.totalVenta,
            },
            idCliente: pedido.cliente.id,
            detallePedidos: pedido.detallePedidos.map(
              (detalle: IDetallePedido) => ({
                cantidad: detalle.cantidad,
                subTotal: detalle.subTotal,
                idArticulo: detalle.articulo?.id || 0,
                idPromocion: detalle.promocion?.id || 0,
              })
            ),
            idEmpleado: pedido.empleado.id,
          } as IPedidoPost);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleReponerStock = (event: React.ChangeEvent<HTMLInputElement>) => {
    const target = event.target as HTMLInputElement;
    setReponerStock(target.checked);
  };

  const handleOnChange = (
    event: React.SyntheticEvent,
    newValue: { label: string; value: string; color: string } | null
  ) => {
    if (newValue) {
      setValorSeleccionado(newValue.value);
      setValuesPost((prevValues) => ({
        ...prevValues,
        estado: newValue.value,
      }));
    } else {
      setValorSeleccionado("");
    }
  };

  const options = [
    { key: 1, label: "Pendiente", value: "PENDIENTE", color: "#FFEB3B" },
    { key: 2, label: "Cancelado", value: "CANCELADO", color: "#F44336" },
    { key: 3, label: "Aprobado", value: "APROBADO", color: "#8BC34A" },
    { key: 4, label: "En preparación", value: "PREPARACION", color: "#03A9F4" },
    { key: 5, label: "Terminado", value: "TERMINADO", color: "#4CAF50" },
    { key: 6, label: "En delivery", value: "DELIVERY", color: "#2196F3" },
    { key: 7, label: "Facturado", value: "FACTURADO", color: "#9C27B0" },
  ];

  const filteredOptions: {
    key: number;
    label: string;
    value: string;
    color: string;
  }[] = options.filter(
    (option) => roles[role].includes(option.value)
    // && option.value !== values?.estado
  );

  useEffect(() => {
    if (selectedId) {
      getOne();
    }
  }, [selectedId]);

  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Editar estado</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Autocomplete
          id="autocomplete-opciones"
          options={filteredOptions}
          getOptionLabel={(option) => option.label}
          onChange={handleOnChange}
          isOptionEqualToValue={(option, value) => option.value === value.value}
          renderInput={(params) => <TextField {...params} label="Estado" />}
          renderOption={(props, option) => {
            const { ...rest } = props;
            return (
              <li key={option.key} {...rest}>
                <ColorDot color={option.color} />
                {option.label}
              </li>
            );
          }}
          value={
            filteredOptions.find(
              (option) => option.value === valorSeleccionado
            ) || null
          }
        />
        {valorSeleccionado == "CANCELADO" && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginTop: "25px",
              gap: "10px",
            }}>
            <Checkbox
              style={{ padding: 0 }}
              checked={reponerStock}
              onChange={handleReponerStock}
              inputProps={{ "aria-label": "controlled" }}
              id="reponerStock"
            />
            <label style={{ margin: 0 }} htmlFor="reponerStock">
              Reponer Stock
            </label>
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={handleSave}>
          Guardar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
