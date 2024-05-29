import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
// ---------- ARCHIVOS----------
import { useAppDispatch, useAppSelector } from "../../../hooks/redux";
import { setDataTable } from "../../../redux/slices/TablaReducer";
import { setCurrentSucursal } from "../../../redux/slices/SucursalReducer";
import { SucursalService } from "../../../services/SucursalService";
import { ISucursal } from "../../../types/Sucursal/ISucursal";
import { ISucursalPost } from "../../../types/Sucursal/ISucursalPost";
import { ModalSucursal } from "../../ui/modals/ModalSucursal/ModalSucursal";
import { GenericCards } from "../../ui/Generic/GenericCards/GenericCard";
import { Loader } from "../../ui/Loader/Loader";
// ---------- ESTILOS ----------
import { AppBar, Toolbar, Typography } from "@mui/material";
import { useLocalStorage } from "../../../hooks/localstorage";
import { EmpresaService } from "../../../services/EmpresaService";

// ------------------------------ CÓDIGO ------------------------------
const API_URL = import.meta.env.VITE_API_URL;

// ------------------------------ COMPONENTE PRINCIPAL ------------------------------
const SeccionSucursal = ({ setSucursalSelected: setSucursalSelected }: { setSucursalSelected: React.Dispatch<React.SetStateAction<string>> }) => {
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [redirectId, setRedirectId] = useState<number | null>(null);
  //manejo de datos en el localStorage
  const [idSucursalLocalStorage, setIdSucursalLocalStorage] = useLocalStorage('sucursalId', '');
  const [empresaNombre, setEmpresaNombre] = useState('');


  // -------------------- SERVICES --------------------
  const sucursalService = new SucursalService(API_URL + "/sucursal");
  const empresaService = new EmpresaService(API_URL + "/empresa");

  // -------------------- HANDLERS --------------------
  const handleClick = (id: number) => {
    dispatch(setCurrentSucursal(id));
    setIdSucursalLocalStorage(id);
    setSucursalSelected(id.toString())
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
          getSucursal();
        });
      }
    });
  };

  const handleSubmit = async (sucursal: any) => {
    await sucursalService.put(sucursal.id, sucursal).then(() => {
      getSucursal();
    });
  };

  const handleSave = async (sucursal: ISucursalPost) => {
    try {
      const response = await sucursalService.post(sucursal);
      console.log(response);
      getSucursal();
    } catch (error) {
      console.error(error);
    }
  };

  // -------------------- FUNCIONES --------------------
  // Recibo el ID del endpoint proveniente de la empresa
  const navigate = useNavigate();

  const empresaActual = useAppSelector(
    (state) => state.empresaReducer.empresaActual
  );

  const dataCard = useAppSelector((state) => state.tableReducer.dataTable);
  const dataFilter: ISucursal[] = dataCard.filter(
    (item: ISucursal) => item.empresa && item.empresa.id === empresaActual
  );

  const dispatch = useAppDispatch();

  const sucursalActive = useAppSelector(
    (state) => state.sucursalReducer.sucursalActual
  );

  const empresaActive = useAppSelector(
    (state) => state.empresaReducer.empresaActual
  )

  const getSucursal = async () => {
    await sucursalService.getAll().then((sucursalData) => {
      dispatch(setDataTable(sucursalData));
      setLoading(false);
    });
  };

  // -------------------- EFFECTS --------------------
  useEffect(() => {
    if (redirectId !== null && sucursalActive === redirectId) {
      navigate(`/inicio`);
      setRedirectId(null); // Reset redirect ID after navigation
      getSucursal();
    }
  }, [sucursalActive, redirectId, navigate]);


  // Obtener el nombre de la empresa
  useEffect(() => {
    const getNombreEmpresa = async () => {
      const empresa = await empresaService.getById(empresaActive)
      if (empresa) setEmpresaNombre(empresa.nombre)
    }
    getNombreEmpresa();
    setLoading(true);
    getSucursal();
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
              items={dataFilter}
              handleClick={handleClick}
              handleDelete={handleDelete}
              setOpenModal={setOpenModal}
              denominacion="Sucursal"
            />
          )}
        </div>
      </div>
      <ModalSucursal
        show={openModal}
        handleClose={() => setOpenModal(false)}
        idEmpresa={Number(empresaActual)}
        handleSave={handleSave}
        getSucursal={getSucursal}
      />
    </>
  );
};

export default SeccionSucursal;
