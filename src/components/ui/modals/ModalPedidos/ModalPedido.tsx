import React, { useEffect, useState } from "react";
import { IPedidoPost } from "../../../../types/Pedido/IPedidoPost";
import { Modal, Button, Form } from "react-bootstrap";
import { IPedido } from "../../../../types/Pedido/IPedido";
import { PedidoService } from "../../../../services/PedidoService";
import { useAppDispatch } from "../../../../hooks/redux";
import { setDataTable } from "../../../../redux/slices/TablaReducer";
import { Autocomplete, TextField } from "@mui/material";
import { IDetallePedido } from "../../../../types/DetallePedido/IDetallePedido";

// ---------- INTERFAZ ----------
interface PedidoModalProps {
  show: boolean;
  handleClose: () => void;
  selectedId?: number;
}

// ------------------------------ COMPONENTE PRINCIPAL ------------------------------
export const PedidoModal: React.FC<PedidoModalProps> = ({
  show,
  handleClose,
  selectedId,
}) => {
  const [values, setValues] = useState<IPedido>();
  const [valuesPost, setValuesPost] = useState<IPedidoPost>({} as IPedidoPost);
  const [valorSeleccionado, setValorSeleccionado] = useState<string>("");

  const API_URL = import.meta.env.VITE_API_URL;
  const pedidoService = new PedidoService(API_URL + "/pedido");
  const dispatch = useAppDispatch();

  const handleSave = async () => {
    if (selectedId) {
      try {
        console.log(selectedId);
        console.log(valuesPost);
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
          setValues(pedido);
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
                idArticulo: detalle.articulo.id,
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

  const handleOnChange = (event, newValue) => {
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

  const opciones = [
    { label: "pendientes", value: "PENDIENTE" },
    { label: "rechazados", value: "RECHAZADO" },
    { label: "cancelados", value: "CANCELADO" },
    { label: "aprobados", value: "APROBADO" },
    { label: "en proceso", value: "PREPARACION" },
    { label: "terminados", value: "TERMINADO" },
    { label: "en delivery", value: "DELIVERY" },
    { label: "facturados", value: "FACTURADO" },
  ];

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
          freeSolo
          id="autocomplete-opciones"
          options={opciones}
          getOptionLabel={(option) =>
            typeof option === "string" ? option : option.label
          }
          getOptionSelected={(option, value) => option.value === value.value}
          onChange={handleOnChange}
          renderInput={(params) => <TextField {...params} label="Estado" />}
        />
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
