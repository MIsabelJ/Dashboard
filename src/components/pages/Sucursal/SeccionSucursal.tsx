import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
// ---------- ARCHIVOS----------
import { useAppDispatch, useAppSelector } from "../../../hooks/redux";
import { useLocalStorage } from "../../../hooks/localstorage";
import { setDataTable } from "../../../redux/slices/TablaReducer";
import { setCurrentSucursal } from "../../../redux/slices/SucursalReducer";
import { ISucursal } from "../../../types/Sucursal/ISucursal";
import { ISucursalPost } from "../../../types/Sucursal/ISucursalPost";
import { SucursalService } from "../../../services/SucursalService";
import { EmpresaService } from "../../../services/EmpresaService";
import { ModalSucursal } from "../../ui/modals/ModalSucursal/ModalSucursal";
import { GenericCards } from "../../ui/Generic/GenericCards/GenericCard";
import { Loader } from "../../ui/Loader/Loader";
// ---------- ESTILOS ----------
import { AppBar, Toolbar, Typography } from "@mui/material";

// ------------------------------ CÓDIGO ------------------------------
const API_URL = import.meta.env.VITE_API_URL;

// ------------------------------ COMPONENTE PRINCIPAL ------------------------------
const SeccionSucursal = () => {
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [redirectId, setRedirectId] = useState<number | null>(null);
  //manejo de datos en el localStorage
  const [idSucursalLocalStorage, setIdSucursalLocalStorage] = useLocalStorage('sucursalId', '');
  const [empresaNombre, setEmpresaNombre] = useState('');
  //Maneja el elemento seleccionado en la tabla (para poder editarlo)
  const [selectedId, setSelectedId] = useState<number>();


  // -------------------- SERVICES --------------------
  const sucursalService = new SucursalService(API_URL + "/sucursal");
  const empresaService = new EmpresaService(API_URL + "/empresa");

  // -------------------- HANDLERS --------------------
  const handleClick = (id: number) => {
    dispatch(setCurrentSucursal(id));
    setIdSucursalLocalStorage(id);
    setRedirectId(id);
  };
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
        await sucursalService.delete(id).then(() => {
          getSucursales();
        });
      }
    });
  };

  // const handleSubmit = async (sucursal: any) => {
  //   await sucursalService.put(sucursal.id, sucursal).then(() => {
  //     getSucursales();
  //   });
  // };

  const handleSave = async (sucursal: ISucursalPost) => {
    try {
      await sucursalService.post(sucursal);
      getSucursales();
    } catch (error) {
      console.error(error);
    }
  };

  // -------------------- FUNCIONES --------------------
  // Recibo el ID del endpoint proveniente de la empresa
  const navigate = useNavigate();

  const dataCard: ISucursal[] = useAppSelector((state) => state.tableReducer.dataTable);
  const dispatch = useAppDispatch();

  const sucursalActive = useAppSelector(
    (state) => state.sucursalReducer.sucursalActual
  );

  const idEmpresa = localStorage.getItem('empresaId');
  const empresaActive = useAppSelector(
    (state) => state.empresaReducer.empresaActual
  )

  const getSucursales = async () => {
    const id = empresaActive == 0 ? Number(idEmpresa) : empresaActive;
    await empresaService.getSucursalesByEmpresaId(id).then((sucursalData) => {
      dispatch(setDataTable(sucursalData));
      setLoading(false);
    });
  };

  // -------------------- EFFECTS --------------------
  useEffect(() => {
    if (redirectId !== null && sucursalActive === redirectId) {
      navigate(`/inicio`);
      setRedirectId(null); // Reset redirect ID after navigation
      getSucursales();
    }
  }, [sucursalActive, redirectId, navigate]);


  // Obtener el nombre de la empresa
  useEffect(() => {
    setIdSucursalLocalStorage('');
    const id = empresaActive == 0 ? Number(idEmpresa) : empresaActive;
    if (id == null || id == 0) navigate('/empresa');
    const getNombreEmpresa = async () => {
      const empresa = await empresaService.getById(id)
      if (empresa) setEmpresaNombre(empresa.nombre)
    }
    getNombreEmpresa();
    setLoading(true);
    getSucursales();
  }, []);

  // -------------------- RENDER --------------------
  return (
    <>
      <div>
        <AppBar style={{ zIndex: 10 }} position="fixed">
          {/* Navbar */}
          <Toolbar>
            <Typography variant="h6" noWrap component="div">
              {`Sucursales de ${empresaNombre}`}
            </Typography>
          </Toolbar>
        </AppBar>
        {/* Mostrar indicador de carga mientras se cargan los datos */}
        <div style={{ marginTop: "100px" }}>
          {loading ? (
            <Loader />
          ) : (
            <GenericCards<ISucursal>
              items={dataCard}
              handleClick={handleClick}
              handleDelete={handleDelete}
              setOpenModal={setOpenModal}
              denominacion="Sucursal"
              setSelectedId={setSelectedId}
            />
          )}
        </div>
      </div>
      <ModalSucursal
        show={openModal}
        handleClose={() => setOpenModal(false)}
        handleSave={handleSave}
        getSucursal={getSucursales}
      />
    </>
  );
};

export default SeccionSucursal;
