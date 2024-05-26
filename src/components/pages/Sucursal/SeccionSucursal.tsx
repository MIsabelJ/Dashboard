import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { SucursalService } from "../../../services/SucursalService";
import { useAppDispatch, useAppSelector } from "../../../hooks/redux";
import { setDataTable } from "../../../redux/slices/TablaReducer";
import { Loader } from "../../ui/Loader/Loader";
import { GenericCards } from "../../ui/Generic/GenericCards/GenericCard";
import { ISucursal } from "../../../types/Sucursal/ISucursal";
import { useNavigate, useParams } from "react-router-dom";
// import { EmpresaService } from "../../../services/EmpresaService";
import { ModalSucursal } from "../../ui/modals/ModalSucursal/ModalSucursal";
import { AppBar, Toolbar, Typography } from "@mui/material";
import { ISucursalPost } from "../../../types/Sucursal/ISucursalPost";
import { setCurrentSucursal } from "../../../redux/slices/SucursalReducer";
import useLocalStorage from "../../../hooks/localstorage";

const API_URL = import.meta.env.VITE_API_URL;
const SeccionSucursal = () => {
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [redirectId, setRedirectId] = useState<number | null>(null);
  //manejo de datos en el localStorage
  const [idSucursalLocalStorage, setIdSucursalLocalStorage] = useLocalStorage('sucursalId', '');


  // Recibo el ID del endpoint proveniente de la empresa
  const navigate = useNavigate();
  const empresaActual = useAppSelector(
    (state) => state.empresaReducer.empresaActual
  );

  const sucursalService = new SucursalService(API_URL + "/sucursal");

  const dataCard = useAppSelector((state) => state.tableReducer.dataTable);
  const dataFilter: ISucursal[] = dataCard.filter(
    (item: ISucursal) => item.empresa && item.empresa.id === empresaActual
  );

  // Obtener el nombre de la empresa
  const nombreEmpresa =
    dataFilter.length > 0 ? dataFilter[0].empresa.nombre : "";

  const dispatch = useAppDispatch();
  const sucursalActive = useAppSelector(
    (state) => state.sucursalReducer.sucursalActual
  );

  useEffect(() => {
    if (redirectId !== null && sucursalActive === redirectId) {
      console.log(
        "Redireccionando a la subruta de la sucursal " + sucursalActive
      );
      navigate(`/inicio`);
      setRedirectId(null); // Reset redirect ID after navigation
    }
  }, [sucursalActive, redirectId, navigate]);

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

  const getSucursal = async () => {
    await sucursalService.getAll().then((sucursalData) => {
      console.log(sucursalData);
      dispatch(setDataTable(sucursalData));
      setLoading(false);
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

  useEffect(() => {
    setLoading(true);
    getSucursal();
  }, []);

  return (
    <>
      <div>
        <AppBar style={{ zIndex: 10 }} position="fixed">
          {/* Navbar */}
          <Toolbar>
            <Typography variant="h6" noWrap component="div">
              {`Sucursales de ${nombreEmpresa}`}
            </Typography>
          </Toolbar>
        </AppBar>
        {/* Mostrar indicador de carga mientras se cargan los datos */}
        <div style={{ marginTop: "100px" }}>
          {loading ? (
            <Loader />
          ) : (
            // Mostrar la tabla de personas una vez que los datos se han cargado
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
