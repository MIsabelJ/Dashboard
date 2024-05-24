import React, { useEffect, useState } from "react";
import { ManufacturadoService } from "../../../../services/ManufacturadoService";
import { useAppDispatch } from "../../../../hooks/redux";
import { setDataTable } from "../../../../redux/slices/TablaReducer";
import Swal from "sweetalert2";
import GenericTable from "../../../ui/Generic/GenericTable/GenericTable";
import { Loader } from "../../../ui/Loader/Loader";
import { ModalArticuloManufacturado } from "../../../ui/modals/ModalManufacturados/ModalManufacturados";

import "./manufacturados.css";
import { IArticuloManufacturado } from "../../../../types/ArticuloManufacturado/IArticuloManufacturado";
import { Carousel } from "react-bootstrap";
import { IArticuloManufacturadoPost } from "../../../../types/ArticuloManufacturado/IArticuloManufacturadoPost";

const API_URL = import.meta.env.VITE_API_URL;

export const SeccionManufacturados = () => {
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const manufacturadoService = new ManufacturadoService(
    API_URL + "/articulo-manufacturado"
  );

  const handleSave = async (manufacturado: IArticuloManufacturadoPost) => {
    try {
      await manufacturadoService.post(manufacturado);
      getManufacturado();
    } catch (error) {
      console.error(error);
    }
  };

  const dispatch = useAppDispatch();

  // Necesario para establecer las columnas de la tabla genérica
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
              {detalle.articuloInsumo.denominacion}: {detalle.cantidad}
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
    // { label: "Unidad de Medida", key: "unidadMedida" }, // Aplicar render para que no de problemas
    // { label: "Categoría", key: "categoria" },
    // {
    //   label: "Acciones",
    //   key: "actions",
    // },
    { label: "Estado", key: "eliminado" },
  ];

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
          // TODO: IMPLEMENTAR ELIMINAR LOGICO
          getManufacturado();
        });
      }
    });
  };

  const getManufacturado = async () => {
    await manufacturadoService.getAll().then((manufacturadoData) => {
      // console.log(manufacturadoData)
      dispatch(setDataTable(manufacturadoData));
      setLoading(false);
    });
  };

  useEffect(() => {
    setLoading(true);
    getManufacturado();
  }, []);

  return (
    <>
      {/* Mostrar indicador de carga mientras se cargan los datos */}
      {loading ? (
        <Loader />
      ) : (
        // Mostrar la tabla de personas una vez que los datos se han cargado
        <div style={{ height: "85vh" }}>
          <GenericTable<IArticuloManufacturado>
            handleDelete={handleDelete}
            columns={ColumnsManufacturado}
            setOpenModal={setOpenModal}
          />
        </div>
      )}

      <ModalArticuloManufacturado
        handleSave={handleSave}
        getManufacturados={getManufacturado}
        openModal={openModal}
        setOpenModal={setOpenModal}
      />
    </>
  );
};
