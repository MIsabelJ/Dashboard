import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './login.css';
import { Button, Form } from 'react-bootstrap';

const Login = () => {
  const [showPass, setShowPass] = useState(false);
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/empresa');
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