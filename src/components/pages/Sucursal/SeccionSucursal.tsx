import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { SucursalService } from "../../../services/SucursalService";
import { useAppDispatch, useAppSelector } from "../../../hooks/redux";
import { setDataTable } from "../../../redux/slices/TablaReducer";
import { Loader } from "../../ui/Loader/Loader";
import { GenericCards } from "../../ui/Generic/GenericCards/GenericCard";
import { ISucursal } from "../../../types/Sucursal/ISucursal";
import { useNavigate, useParams } from "react-router-dom";
import { EmpresaService } from "../../../services/EmpresaService";
import { ModalSucursal } from "../../ui/modals/ModalSucursal/ModalSucursal";
import { AppBar, Toolbar, Typography } from "@mui/material";
import { ISucursalPost } from "../../../types/Sucursal/ISucursalPost";

const API_URL = import.meta.env.VITE_API_URL;
const SeccionSucursal = () => {
  // Recibo el ID del endpoint proveniente de la empresa
  const id = useParams().id;
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const sucursalService = new SucursalService(API_URL +"/sucursal");


  const dataCard = useAppSelector((state) => state.tableReducer.dataTable);
  const dataFilter: ISucursal[] = dataCard.filter(
    (item: ISucursal) => item.empresa && item.empresa.id === Number(id)
  );
  console.log(dataFilter);

  const dispatch = useAppDispatch();
  const sucursalActive = useAppSelector(
    (state) => state.sucursalReducer.sucursalActual
  );

  const handleClick = () => {
    navigate("/inicio");
  };
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
  }, [sucursalActive]);

  return (
    <>
      <div>
        <AppBar style={{ zIndex: 10 }} position="fixed">
          {/* Navbar */}
          <Toolbar>
            <Typography variant="h6" noWrap component="div">
              Sucursales de Empresa
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
            />
          )}
        </div>
      </div>
      <ModalSucursal
        show={openModal}
        handleClose={() => setOpenModal(false)}
        idEmpresa={Number(id)}
        handleSave={handleSave}
      />
    </>
  );
};

export default SeccionSucursal;
