import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './login.css';
import { Button, Form } from 'react-bootstrap';
import './login.css';
import useLocalStorage from '../../../hooks/localstorage';
import { useAppDispatch } from '../../../hooks/redux';
import { setCurrentEmpresa } from '../../../redux/slices/EmpresaReducer';
import { setCurrentSucursal } from '../../../redux/slices/SucursalReducer';

const Login = () => {
  const [showPass, setShowPass] = useState(false);
  //manejo de datos en el localStorage
  const [idSucursalLocalStorage, setIdSucursalLocalStorage] = useLocalStorage('sucursalId', '');
  const [idEmpresaLocalStorage, setIdEmpresaLocalStorage] = useLocalStorage('empresaId', '');
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleLogin = () => {
    if (idEmpresaLocalStorage) {
      dispatch(setCurrentEmpresa(idEmpresaLocalStorage));
      if (idSucursalLocalStorage) {
        dispatch(setCurrentSucursal(idSucursalLocalStorage))
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