import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
// ---------- ARCHIVOS----------
import { useAppDispatch } from "../../../../hooks/redux";
import { setDataTable } from "../../../../redux/slices/TablaReducer";
import { ManufacturadoService } from "../../../../services/ManufacturadoService";
import { IArticuloManufacturado } from "../../../../types/ArticuloManufacturado/IArticuloManufacturado";
import { ModalArticuloManufacturado } from "../../../ui/modals/ModalManufacturados/ModalManufacturados";
import GenericTable from "../../../ui/Generic/GenericTable/GenericTable";
import { Loader } from "../../../ui/Loader/Loader";
// ---------- ESTILOS ----------
import { Carousel } from "react-bootstrap";
import { Button } from "@mui/material";
import { SucursalService } from "../../../../services/SucursalService";

// ------------------------------ CÓDIGO ------------------------------
const API_URL = import.meta.env.VITE_API_URL;

interface ContentButtonProps {
  label: string;
  content: React.ReactNode;
}

const ContentButton: React.FC<ContentButtonProps> = ({ label, content }) => {
  const [showContent, setShowContent] = useState(false);

  const handleClick = () => setShowContent(!showContent);

  return (
    <div>
      <Button onClick={handleClick}>
        {showContent ? `Ocultar ${label}` : `Mostrar ${label}`}
      </Button>
      {showContent && <div>{content}</div>}
    </div>
  );
};

// ------------------------------ COMPONENTE PRINCIPAL ------------------------------
export const SeccionManufacturados = () => {
  // -------------------- STATES --------------------
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);

  //Maneja el elemento seleccionado en la tabla (para poder editarlo)
  const [selectedId, setSelectedId] = useState<number>();

  // -------------------- SERVICES --------------------
  const manufacturadoService = new ManufacturadoService(
    API_URL + "/articulo-manufacturado"
  );
  const sucursalService = new SucursalService(API_URL + "/sucursal");

  // -------------------- COLUMNAS --------------------
  const ColumnsManufacturado = [
    {
      label: "Categoría",
      key: "categoria",
      render: (manufacturado: IArticuloManufacturado) =>
        `${manufacturado.categoria.denominacion}`,
    },
    { label: "Denominación", key: "denominacion" },
    {
      label: "Precio de Venta",
      key: "precioVenta",
      render: (manufacturado: IArticuloManufacturado) =>
        `$${manufacturado.precioVenta}`,
    },
    {
      label: "Unidad de Medida",
      key: "unidadMedida",
      render: (manufacturado: IArticuloManufacturado) =>
        manufacturado.unidadMedida.denominacion,
    },
    { label: "Tiempo Estimado (minutos)", key: "tiempoEstimadoMinutos" },
    {
      label: "Preparación",
      key: "preparacion",
      render: (manufacturado: IArticuloManufacturado) => (
        <ContentButton
          label="Preparación"
          content={manufacturado.preparacion}
        />
      ),
    },
    {
      label: "Descripción",
      key: "descripcion",
      render: (manufacturado: IArticuloManufacturado) => (
        <ContentButton
          label="Descripción"
          content={manufacturado.descripcion}
        />
      ),
    },
    {
      label: "Ingredientes",
      key: "articuloManufacturadoDetalles",
      render: (manufacturado: IArticuloManufacturado) => {
        const ingredientes = manufacturado.articuloManufacturadoDetalles
          .map(
            (detalle) =>
              `\u2022 ${detalle.articuloInsumo.denominacion}: ${detalle.cantidad} ${detalle.articuloInsumo.unidadMedida.denominacion}`
          )
          .join("\n");
        return <ContentButton label="Ingredientes" content={ingredientes} />;
      },
    },
    {
      label: "Imágenes",
      key: "imagenes",
      render: (manufacturado: IArticuloManufacturado) => (
        <Carousel interval={null} controls={true}>
          {manufacturado.imagenes.map((imagen, index) => (
            <Carousel.Item key={index}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100px",
                  width: "100px",
                }}>
                <img
                  className="d-block"
                  src={imagen.url}
                  alt={`Slide ${index}`}
                  style={{
                    maxWidth: "100%",
                    maxHeight: "100%",
                    objectFit: "contain",
                  }}
                />
              </div>
            </Carousel.Item>
          ))}
        </Carousel>
      ),
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
    await sucursalService
      .getManufacturadosBySucursalId(Number(localStorage.getItem("sucursalId")))
      .then((manufacturadoData) => {
        console.log(manufacturadoData);
        dispatch(setDataTable(manufacturadoData));
        setLoading(false);
      });
  };

  // -------------------- EFFECTS --------------------
  useEffect(() => {
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
        handleClose={() => {
          setOpenModal(false);
          setSelectedId(undefined);
        }}
      />
    </>
  );
};
