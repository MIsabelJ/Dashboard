
import { PromocionService } from "../../../services/PromocionService";
import Swal from "sweetalert2";
import { setDataTable } from "../../../redux/slices/TablaReducer";
import { useAppDispatch } from "../../../hooks/redux";
import { useEffect, useState } from "react";
import { Loader } from "../../ui/Loader/Loader";
import GenericTable from "../../ui/Generic/GenericTable/GenericTable";
import { IPromocion } from "../../../types/Promocion/IPromocion";
import ModalPromocion from "../../ui/modals/ModalPromociones/ModalPromocion";
import { Carousel } from "react-bootstrap";

const API_URL = import.meta.env.VITE_API_URL;

export const SeccionPromociones = () => {
  // -------------------- STATES --------------------
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  //Maneja el elemento seleccionado en la tabla (para poder editarlo)
  const [selectedId, setSelectedId] = useState<number>();

  // -------------------- SERVICES --------------------
  const promocionService = new PromocionService(API_URL + "/promocion");
  const dispatch = useAppDispatch();

  // -------------------- COLUMNAS --------------------
  const ColumnsPromocion = [
    { label: "Denominación", key: "denominacion" },
    { label: "Descripción", key: "descripcionDescuento" },
    {
      label: "Imágenes", key: "imagenes", render: (promocion: IPromocion) => (
        <Carousel>
          {promocion.imagenes.map((imagen, index) => (
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
    { label: "Fecha de Inicio", key: "fechaDesde" },
    { label: "Fecha de Fin", key: "fechaHasta" },
    { label: "Hora de Inicio", key: "horaDesde" },
    { label: "Hora de Fin", key: "horaHasta" },
    { label: "Precio", key: "precioPromocional" },
    {
      label: "Estado",
      key: "eliminado",
      render: (manufacturado: IPromocion) =>
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
        await promocionService.delete(id).then(() => {
          getPromocion();
        });
      }
    });
  };

  // -------------------- FUNCIONES --------------------

  const getPromocion = async () => {
    await promocionService.getAll().then((promocionData) => {
      dispatch(setDataTable(promocionData));
      setLoading(false);
    });
  };

  // -------------------- EFFECTS --------------------
  useEffect(() => {
    setLoading(true);
    getPromocion();
  }, []);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div style={{ height: "85vh" }}>
          <GenericTable<IPromocion>
            setSelectedId={setSelectedId}
            handleDelete={handleDelete}
            columns={ColumnsPromocion}
            setOpenModal={setOpenModal}
          />
        </div>
      )}
      <ModalPromocion
        selectedId={selectedId}
        show={openModal}
        handleClose={() => { setOpenModal(false); setSelectedId(undefined) }}
      />
    </>
  );
};
