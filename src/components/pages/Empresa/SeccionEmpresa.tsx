import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
// ---------- ARCHIVOS----------
import { useAppDispatch, useAppSelector } from "../../../hooks/redux";
import { setDataTable } from "../../../redux/slices/TablaReducer";
import { setCurrentEmpresa } from "../../../redux/slices/EmpresaReducer";
import { EmpresaService } from "../../../services/EmpresaService";
import { IEmpresa } from "../../../types/Empresa/IEmpresa";
import { IEmpresaPost } from "../../../types/Empresa/IEmpresaPost";
import { ModalEmpresa } from "../../ui/modals/ModalEmpresa/ModalEmpresa";
import { Loader } from "../../ui/Loader/Loader";
import { GenericCards } from "../../ui/Generic/GenericCards/GenericCard";
// ---------- ESTILOS ----------
import { AppBar, Toolbar, Typography } from "@mui/material";
import useLocalStorage from "../../../hooks/localstorage";

// ------------------------------ CÓDIGO ------------------------------
const API_URL = import.meta.env.VITE_API_URL;

// ------------------------------ COMPONENTE PRINCIPAL ------------------------------
export const SeccionEmpresa = () => {
  const dataCard = useAppSelector((state) => state.tableReducer.dataTable);
  const navigate = useNavigate();

  //manejo de datos en el localStorage
  const [idEmpresaLocalStorage, setIdEmpresaLocalStorage] = useLocalStorage('empresaId', '');
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [selectedEntity, setSelectedEntity] = useState<IEmpresa | null>(null);
  const [redirectId, setRedirectId] = useState<number | null>(null);

  // -------------------- SERVICES --------------------
  const empresaService = new EmpresaService(API_URL + "/empresa");
  const dispatch = useAppDispatch();

  const empresaActive = useAppSelector((state) => state.empresaReducer.empresaActual);

  useEffect(() => {
    if (redirectId !== null && empresaActive === redirectId) {
      console.log("Redireccionando a la subruta de la empresa " + empresaActive);
      navigate(`/sucursal`);
      setRedirectId(null); // Reset redirect ID after navigation
    }
  }, [empresaActive, redirectId, navigate]);

  const handleClick = (id: number) => {
    dispatch(setCurrentEmpresa(id));
    setIdEmpresaLocalStorage(id)
    setRedirectId(id);
  };

  const handleEdit = async (id: number) => {
    const selectedEntity = await empresaService.getById(id);
    setSelectedEntity(selectedEntity); // Actualiza el estado con los datos de la entidad seleccionada
    setOpenModal(true);
  };

  const handleDelete = async (id: number) => {
    Swal.fire({
      title: "¿Estas seguro?",
      text: `¿Seguro que quieres editar el estado?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, Adelante!",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await empresaService.delete(id).then(() => {
          getEmpresa();
        });
      }
    });
  };

  const handleSave = async (empresa: IEmpresaPost) => {
    try {
      const response = await empresaService.post(empresa);
      getEmpresa();
      console.log(response);
    } catch (error) {
      console.error(error);
    }
  };

  // -------------------- FUNCIONES --------------------

  const getEmpresa = async () => {
    await empresaService.getAll().then((empresaData) => {
      dispatch(setDataTable(empresaData));
      setLoading(false);
    });
  };

  // -------------------- EFFECTS --------------------
  useEffect(() => {
    if (redirectId !== null && empresaActive === redirectId) {
      console.log(
        "Redireccionando a la subruta de la empresa " + empresaActive
      );
      navigate(`/sucursal`);
      setRedirectId(null); // Reset redirect ID after navigation
    }
  }, [empresaActive, redirectId, navigate]);

  useEffect(() => {
    setLoading(true);
    getEmpresa();
  }, []);

  // -------------------- RENDER --------------------
  return (
    <>
      <div>
        <AppBar style={{ zIndex: 1000 }} position="fixed">
          {/* Navbar */}
          <Toolbar>
            <Typography variant="h6" noWrap component="div">
              Empresas
            </Typography>
          </Toolbar>
        </AppBar>
        {/* Mostrar indicador de carga mientras se cargan los datos */}
        <div style={{ marginTop: "100px" }}>
          {loading ? (
            <Loader />
          ) : (
            <GenericCards<IEmpresa>
              items={dataCard}
              handleClick={handleClick}
              handleDelete={handleDelete}
              setOpenModal={setOpenModal}
              denominacion="Empresa"
            />
          )}
        </div>
      </div>
      <ModalEmpresa
        show={openModal}
        handleClose={() => setOpenModal(false)}
        handleSave={handleSave}
      />
    </>
  );
};
