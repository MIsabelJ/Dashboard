import { useEffect, useState } from "react";
import { EmpresaService } from "../../../services/EmpresaService";
import { useAppDispatch, useAppSelector } from "../../../hooks/redux";
import { setDataTable } from "../../../redux/slices/TablaReducer";
import { IEmpresa } from "../../../types/Empresa/IEmpresa";
import Swal from "sweetalert2";
import { Loader } from "../../ui/Loader/Loader";
import { GenericCards } from "../../ui/Generic/GenericCards/GenericCard";
import { useNavigate } from "react-router-dom";
import { ModalEmpresa } from "../../ui/modals/ModalEmpresa/ModalEmpresa";


const API_URL = import.meta.env.VITE_API_URL;

export const SeccionEmpresa = () => {
  const dataCard = useAppSelector((state) => state.tableReducer.dataTable);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const empresaService = new EmpresaService(API_URL + "/empresa");
  const dispatch = useAppDispatch();

  const handleClick = (id: number) => {
    console.log("Aca esta el id ",id)
    navigate(`/empresa/${id}/sucursal`);
  }

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
        await empresaService.delete(id).then(() => {
          getEmpresa();
        });
      }
    });
  };

  const getEmpresa = async () => {
    await empresaService.getAll().then((empresaData) => {
      dispatch(setDataTable(empresaData));
      setLoading(false);
    });
  };

  useEffect(() => {
    setLoading(true);
    getEmpresa();
  }, []);

  

  return (
    
    <>
      <div>
        <div
          style={{
            padding: ".4rem",
            display: "flex",
            justifyContent: "flex-end",
            width: "90%",
          }}
        >

        </div>
        {/* Mostrar indicador de carga mientras se cargan los datos */}
        {loading ? (
          <Loader />
        ) : (
          // Mostrar la tabla de personas una vez que los datos se han cargado
          <GenericCards<IEmpresa>
            items={dataCard}
            handleClick={handleClick}
            handleDelete={handleDelete}
            setOpenModal={setOpenModal}
          />
        )}
      </div>
      <ModalEmpresa
        getEmpresa={getEmpresa}
        openModal={openModal}
        setOpenModal={setOpenModal}
      />
    </>
  );
}