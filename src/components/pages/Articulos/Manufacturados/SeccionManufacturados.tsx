import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
// ---------- ARCHIVOS----------
import { useAppDispatch } from "../../../../hooks/redux";
import { setDataTable } from "../../../../redux/slices/TablaReducer";
import { ManufacturadoService } from "../../../../services/ManufacturadoService";
import { IArticuloManufacturado } from "../../../../types/ArticuloManufacturado/IArticuloManufacturado";
import { IArticuloManufacturadoPost } from "../../../../types/ArticuloManufacturado/IArticuloManufacturadoPost";
import { ModalArticuloManufacturado } from "../../../ui/modals/ModalManufacturados/ModalManufacturados";
import GenericTable from "../../../ui/Generic/GenericTable/GenericTable";
import { Loader } from "../../../ui/Loader/Loader";
// ---------- ESTILOS ----------
import "./manufacturados.css";
import { Carousel } from "react-bootstrap";

// ------------------------------ CÓDIGO ------------------------------
const API_URL = import.meta.env.VITE_API_URL;

// ------------------------------ COMPONENTE PRINCIPAL ------------------------------
export const SeccionManufacturados = () => {
  // -------------------- STATES --------------------
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  //Maneja el elemento seleccionado en la tabla (para poder editarlo)
  const [selectedId, setSelectedId] = useState<number>();

  // -------------------- SERVICES --------------------
  const manufacturadoService = new ManufacturadoService(
    API_URL + "/articulo-manufacturado"
  );

  // -------------------- COLUMNAS --------------------
  const ColumnsManufacturado = [
    { label: "Denominación", key: "denominacion" },
    { label: "Precio de Venta", key: "precioVenta" },
    { label: "Descripción", key: "descripcion" },
    { label: "Tiempo Estimado (minutos)", key: "tiempoEstimadoMinutos" },
    { label: "Preparación", key: "preparacion" },
    {
      label: "Ingredientes",
      key: "articuloManufacturadoDetalles",
      render: (manufacturado: IArticuloManufacturado) => (
        <ul>
          {manufacturado.articuloManufacturadoDetalles.map((detalle, index) => (
            <li key={index}>
              {detalle.articuloInsumo.denominacion}: {detalle.cantidad}{" "}
              {detalle.articuloInsumo.unidadMedida.denominacion}
            </li>
          ))}
        </ul>
      ),
    },
    {
      label: "Imágenes",
      key: "imagenes",
      render: (manufacturado: IArticuloManufacturado) => (
        <Carousel>
          {manufacturado.imagenes.map((imagen, index) => (
            <Carousel.Item key={index}>
              <img
                className="d-block w-100"
                src={imagen.url}
                alt={`Slide ${index}`}
                style={{ maxWidth: "100px", maxHeight: "100px" }}
              />
            </Carousel.Item>
          ))}
        </Carousel>
      ),
    },
    {
      label: "Unidad de Medida",
      key: "unidadMedida",
      render: (manufacturado: IArticuloManufacturado) =>
        manufacturado.unidadMedida.denominacion,
    },
    {
      label: "Categoría",
      key: "categoria",
      render: (manufacturado: IArticuloManufacturado) =>
        manufacturado.categoria.denominacion,
    },
    {
      label: "Estado",
      key: "eliminado",
      render: (manufacturado: IArticuloManufacturado) =>
        manufacturado.eliminado ? "Eliminado" : "Activo",
    },
  ];

  // -------------------- HANDLERS --------------------

  const handleDelete = async (id: number) => {
    Swal.fire({
      title: "¿Estas seguro?",
      text: `¿Seguro que quieres cambiar el estado?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, Adelante!",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await manufacturadoService.delete(id).then(() => {
          getManufacturado();
        });
      }
    });
  };

  // -------------------- FUNCIONES --------------------
  const dispatch = useAppDispatch();

  const getManufacturado = async () => {
    await manufacturadoService.getAll().then((manufacturadoData) => {
      dispatch(setDataTable(manufacturadoData));
      setLoading(false);
    });
  };

  // -------------------- EFFECTS --------------------
  useEffect(() => {
    setLoading(true);
    getManufacturado();
  }, []);

  // -------------------- RENDER --------------------

  return (
    <>
      {/* Mostrar indicador de carga mientras se cargan los datos */}
      {loading ? (
        <Loader />
      ) : (
        <div style={{ height: "85vh" }}>
          <GenericTable<IArticuloManufacturado>
            setSelectedId={setSelectedId}
            handleDelete={handleDelete}
            columns={ColumnsManufacturado}
            setOpenModal={setOpenModal}
          />
        </div>
      )}
      <ModalArticuloManufacturado
        selectedId={selectedId}
        show={openModal}
        handleClose={() => { setOpenModal(false); setSelectedId(undefined) }}
      />
    </>
  );
};
