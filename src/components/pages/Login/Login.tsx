import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './login.css';
import { Button, Form } from 'react-bootstrap';
import './login.css';
import { useLocalStorage } from '../../../hooks/localstorage';
import { useAppDispatch } from '../../../hooks/redux';
import { setCurrentEmpresa } from '../../../redux/slices/EmpresaReducer';
import { setCurrentSucursal } from '../../../redux/slices/SucursalReducer';
import { EmpresaService } from '../../../services/EmpresaService';
import { SucursalService } from '../../../services/SucursalService';

const Login = () => {
  const [showPass, setShowPass] = useState(false);
  //manejo de datos en el localStorage
  const [idSucursalLocalStorage, setIdSucursalLocalStorage] = useLocalStorage('sucursalId', '');
  const [idEmpresaLocalStorage, setIdEmpresaLocalStorage] = useLocalStorage('empresaId', '');
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const API_URL = import.meta.env.VITE_API_URL;

  const empresaService = new EmpresaService(API_URL + '/empresa');
  const sucursalService = new SucursalService(API_URL + '/sucursal');

  const handleLogin = async () => {
    if (idEmpresaLocalStorage) {
      try {
        const response = await empresaService.getById(idEmpresaLocalStorage)
        if (response == null) throw new DOMException()
        dispatch(setCurrentEmpresa(idEmpresaLocalStorage));
      } catch (err) {
        return navigate('/empresa')
      }
      if (idSucursalLocalStorage) {
        try {
          const response = await sucursalService.getById(idSucursalLocalStorage)
          if (response == null) throw new DOMException()
          dispatch(setCurrentSucursal(idSucursalLocalStorage))
        } catch (err) {
          return navigate('/sucursal')
        }
        return navigate('/inicio')
      }
      return navigate('/sucursal');
    }
    return navigate('/empresa');
  };


  return (
    <div className="containerLogin">
      <div className="containerForm">
        <span style={{ fontSize: '9vh' }}>
          Bienvenido
        </span>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Usuario</Form.Label>
            <Form.Control type="text" placeholder="Usuario" />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Contraseña</Form.Label>
            <Form.Control
              type={showPass ? 'text' : 'password'}
              placeholder="Contraseña"
            />
          </Form.Group>
          <Form.Check
            type="switch"
            onChange={() => setShowPass(!showPass)}
            id="custom-switch"
            label="Mostrar contraseña"
          />
          <div className="d-flex justify-content-center align-items-center mt-2">
            <Button variant="primary" onClick={handleLogin}>
              Ingresar
            </Button>{' '}
          </div>
        </Form>
      </div>
    </div>
  );
};

export default Login;