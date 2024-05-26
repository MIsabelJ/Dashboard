import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
// ---------- ARCHIVOS----------
import { useAppDispatch } from "../../../../hooks/redux";
import { setDataTable } from "../../../../redux/slices/TablaReducer";
import { InsumoService } from "../../../../services/InsumoService";
import { ModalArticuloInsumo } from "../../../ui/modals/ModalInsumos/ModalInsumos";
import { IArticuloInsumo } from "../../../../types/ArticuloInsumo/IArticuloInsumo";
import { IArticuloInsumoPost } from "../../../../types/ArticuloInsumo/IArticuloInsumoPost";
import GenericTable from "../../../ui/Generic/GenericTable/GenericTable";
import { Loader } from "../../../ui/Loader/Loader";
// ---------- ESTILOS ----------
import Carousel from "react-bootstrap/Carousel";
import "./insumos.css";

// ------------------------------ CÓDIGO ------------------------------
const API_URL = import.meta.env.VITE_API_URL;

// ------------------------------ COMPONENTE PRINCIPAL ------------------------------
export const SeccionInsumos = () => {
  // -------------------- STATES --------------------
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  // -------------------- SERVICES --------------------
  const insumoService = new InsumoService(API_URL + "/articulo-insumo");

  // -------------------- COLUMNAS --------------------
  // Necesario para establecer las columnas de la tabla genérica
  const ColumnsInsumo = [
    { label: "Denominación", key: "denominacion" },
    { label: "Precio de Venta", key: "precioVenta" },
    { label: "Precio de Compra", key: "precioCompra" },
    {
      label: "Imágenes",
      key: "imagenes",
      render: (insumo: IArticuloInsumo) => (
        <Carousel>
          {insumo.imagenes.map((imagen, index) => (
            <Carousel.Item key={index}>
              <img
                className="d-block w-100"
                src={imagen.url} // Convert File object to string
                alt={`Slide ${index}`}
                style={{ maxWidth: "100px", maxHeight: "100px" }}
              />
            </Carousel.Item>
          ))}
        </Carousel>
      ),
    },
    { label: "Stock Actual", key: "stockActual" },
    { label: "Stock Máximo", key: "stockMaximo" },
    {
      label: "Es ingrediente",
      key: "esParaElaborar",
      render: (insumo: IArticuloInsumo) =>
        insumo.esParaElaborar ? "Sí" : "No",
    },
    {
      label: "Unidad de Medida",
      key: "unidadMedida",
      render: (insumo: IArticuloInsumo) => insumo.unidadMedida.denominacion,
    },
    {
      label: "Categoría",
      key: "categoria",
      render: (insumo: IArticuloInsumo) => insumo.categoria.denominacion,
    },
    {
      label: "Estado",
      key: "eliminado",
      render: (insumo: IArticuloInsumo) =>
        insumo.eliminado ? "Eliminado" : "Activo",
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
        await insumoService.delete(id).then(() => {
          getInsumo();
        });
      }
    });
  };

  const handleSave = async (insumo: IArticuloInsumoPost) => {
    try {
      await insumoService.post(insumo);
      getInsumo();
    } catch (error) {
      console.error(error);
    }
  };

  // -------------------- FUNCIONES --------------------
  const dispatch = useAppDispatch();

  const getInsumo = async () => {
    await insumoService.getAll().then((insumoData) => {
      dispatch(setDataTable(insumoData));
      setLoading(false);
    });
  };

  // -------------------- EFFECTS --------------------
  useEffect(() => {
    setLoading(true);
    getInsumo();
  }, []);

  // -------------------- RENDER --------------------
  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div style={{ height: "85vh" }}>
          <GenericTable<IArticuloInsumo>
            handleDelete={handleDelete}
            columns={ColumnsInsumo}
            setOpenModal={setOpenModal}
          />
        </div>
      )}
      <ModalArticuloInsumo
        getInsumos={getInsumo}
        openModal={openModal}
        setOpenModal={setOpenModal}
        handleSave={handleSave}
      />
    </>
  );
};
