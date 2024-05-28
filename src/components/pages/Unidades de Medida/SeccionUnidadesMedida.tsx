import { useEffect, useState } from "react";
import { UnidadMedidaService } from "../../../services/UnidadMedidaService";
import Swal from "sweetalert2";
import { IUnidadMedidaPost } from "../../../types/UnidadMedida/IUnidadMedidaPost";
import { useAppDispatch } from "../../../hooks/redux";
import { setDataTable } from "../../../redux/slices/TablaReducer";
import { Loader } from "../../ui/Loader/Loader";
import GenericTable from "../../ui/Generic/GenericTable/GenericTable";
import { IUnidadMedida } from "../../../types/UnidadMedida/IUnidadMedida";
import { UnidadMedidaModal } from "../../ui/modals/ModalUnidadMedida/ModalUnidadMedida";

// ------------------------------ CÓDIGO ------------------------------
const API_URL = import.meta.env.VITE_API_URL;

// ------------------------------ COMPONENTE PRINCIPAL ------------------------------
export const SeccionUnidadesMedida = () => {
  // -------------------- STATES --------------------
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);


  //Maneja el elemento seleccionado en la tabla (para poder editarlo)
  const [selectedId, setSelectedId] = useState<number>();

  // -------------------- SERVICES --------------------
  const unidadMedidaService = new UnidadMedidaService(
    API_URL + "/unidad-medida"
  );

  // -------------------- COLUMNAS --------------------
  // Necesario para establecer las columnas de la tabla genérica
  const ColumnsUnidadMedida = [{ label: "Denominación", key: "denominacion" }];

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
        await unidadMedidaService.delete(id).then(() => {
          getUnidadMedida();
        });
      }
    });
  };



  // -------------------- FUNCIONES --------------------
  const dispatch = useAppDispatch();

  const getUnidadMedida = async () => {
    await unidadMedidaService.getAll().then((unidadMedidaData) => {
      dispatch(setDataTable(unidadMedidaData));
      setLoading(false);
    });
  };

  // -------------------- EFFECTS --------------------
  useEffect(() => {
    setLoading(true);
    getUnidadMedida();
  }, []);

  // -------------------- RENDER --------------------
  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div style={{ height: "85vh" }}>
          <GenericTable<IUnidadMedida>
            setSelectedId={setSelectedId}
            handleDelete={handleDelete}
            columns={ColumnsUnidadMedida}
            setOpenModal={setOpenModal}
          />
        </div>
      )}
      <UnidadMedidaModal
        selectedId={selectedId}
        show={openModal}
        handleClose={() => { setOpenModal(false); setSelectedId(undefined) }}
      />
    </>
  );
};
