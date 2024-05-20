import React, { useEffect, useState } from "react";
import { InsumoService } from "../../../../services/InsumoService";
import { useAppDispatch } from "../../../../hooks/redux";
import { setDataTable } from "../../../../redux/slices/TablaReducer";
import Swal from "sweetalert2";
import GenericTable from "../../../ui/Generic/GenericTable/GenericTable";
import { Loader } from "../../../ui/Loader/Loader";

import "./insumos.css";
import { ModalArticuloInsumo } from "../../../ui/modals/ModalInsumos/ModalInsumos";
import { IArticuloInsumo } from "../../../../types/ArticuloInsumo/IArticuloInsumo";

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
    { label: "Nombre", key: "name" },
    { label: "Precio", key: "price" },
    { label: "Descripción", key: "description" },
    { label: "Categoría", key: "category" },
    {
      label: "Es ingrediente",
      key: "isIngredient",
      render: (insumo: IArticuloInsumo) => (insumo.esParaElaborar ? "Sí" : "No"),
    },
    {
      label: "Imagen",
      key: "image",
      render: (insumo: IArticuloInsumo) => (
        <img
          src={insumo.imagenes[0].url}
          alt={insumo.denominacion}
          style={{ maxWidth: "100px", maxHeight: "100px" }}
        />
      ),
    },
    { label: "Stock", key: "stock" },
    { label: "Acciones", key: "actions" },
    { label: "Estado", key: "active" },
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
          getInsumo();
        });
      }
    });
  };

  const getInsumo = async () => {
    await insumoService.getAll().then((insumoData) => {
      // console.log(insumoData)
      dispatch(setDataTable(insumoData));
      setLoading(false);
    });
  };

  useEffect(() => {
    setLoading(true);
    getInsumo();
  }, []);

  return (
    <>
      {/* Mostrar indicador de carga mientras se cargan los datos */}
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
      />
    </>
  );
};
