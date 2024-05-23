import React, { useEffect, useState } from "react";
import { InsumoService } from "../../../../services/InsumoService";
import { useAppDispatch } from "../../../../hooks/redux";
import { setDataTable } from "../../../../redux/slices/TablaReducer";
import Swal from "sweetalert2";
import GenericTable from "../../../ui/Generic/GenericTable/GenericTable";
import { Loader } from "../../../ui/Loader/Loader";
import Carousel from "react-bootstrap/Carousel";
import { ModalArticuloInsumo } from "../../../ui/modals/ModalInsumos/ModalInsumos";
import { IArticuloInsumo } from "../../../../types/ArticuloInsumo/IArticuloInsumo";
import { IArticuloInsumoPost } from "../../../../types/ArticuloInsumo/IArticuloInsumoPost";

import "./insumos.css";

const API_URL = import.meta.env.VITE_API_URL;

export const SeccionInsumos = () => {
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const insumoService = new InsumoService(API_URL + "/articulo-insumo");
  const dispatch = useAppDispatch();

  // Necesario para establecer las columnas de la tabla genérica
  const ColumnsInsumo = [
    {
      label: "id",
      key: "id",
      render: (insumo: IArticuloInsumo) => (insumo?.id ? insumo.id : 0),
    },
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
                src={imagen.url}
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
      render: (insumo: IArticuloInsumo) => insumo.unidadMedida.denominacion
    },
    {
      label: "Categoría",
      key: "categoria",
      render: (insumo: IArticuloInsumo) => insumo.categoria.denominacion
    },
    {
      label: "Estado",
      key: "eliminado",
      render: (insumo: IArticuloInsumo) => (insumo.eliminado ? "Eliminado" : "Activo")
    }
  ];

  const handleDelete = async (id: number) => {
    Swal.fire({
      title: "¿Estas seguro?",
      text: `¿Seguro que quieres eliminar?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, Eliminar!",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await insumoService.delete(id).then(() => {
          // TODO: IMPLEMENTAR ELIMINAR LOGICO
          getInsumo();
        });
      }
    });
  };

  const getInsumo = async () => {
    await insumoService.getAll().then((insumoData) => {
      dispatch(setDataTable(insumoData));
      setLoading(false);
    });
  };

  useEffect(() => {
    setLoading(true);
    getInsumo();
  }, []);

  const handleSave = async (insumo: IArticuloInsumoPost) => {
    try {
      await insumoService.post(insumo);
      getInsumo();
    } catch (error) {
      console.error(error);
    }
  };

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
