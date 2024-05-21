import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { ISucursalPost } from '../../../../types/Sucursal/ISucursalPost';
import { SucursalService } from '../../../../services/SucursalService';
import { ModalDomicilio } from '../ModalDomicilio/ModalDomicilio';  // Asegúrate de importar el modal de Domicilio
import { DomicilioService } from '../../../../services/DomicilioService';

const API_URL = import.meta.env.VITE_API_URL;

interface SucursalModalProps {
    show: boolean;
    handleClose: () => void;
    idEmpresa: number; // Recibe el idEmpresa como prop
    handleSave: (sucursal: ISucursalPost) => void;
}

export const ModalSucursal: React.FC<SucursalModalProps> = ({ show, handleClose, idEmpresa, handleSave }) => {
    const [nombre, setNombre] = useState<string>('');
    const [horarioApertura, setHorarioApertura] = useState<string>('00:00');
    const [horarioCierre, setHorarioCierre] = useState<string>('00:00');
    const [esCasaMatriz, setEsCasaMatriz] = useState<boolean>(false);
    const [idDomicilio, setIdDomicilio] = useState<number>(0);
    const [showDomicilioModal, setShowDomicilioModal] = useState<boolean>(false);

    const sucursalService = new SucursalService(API_URL + "/sucursal");
    const domicilioService = new DomicilioService(API_URL + "/domicilio");

    const onSave = () => {
        // Convertir el horario a formato HH:mm:ss antes de guardar
        const horarioAperturaFormatted = `${horarioApertura}:00`;
        const horarioCierreFormatted = `${horarioCierre}:00`;

        const sucursal: ISucursalPost = {
            nombre,
            horarioApertura: horarioAperturaFormatted,
            horarioCierre: horarioCierreFormatted,
            esCasaMatriz,
            idDomicilio,
            idEmpresa
        };
        handleSave(sucursal);
        handleClose();
        // Resetear los valores del formulario
        setNombre('');
        setHorarioApertura('00:00');
        setHorarioCierre('00:00');
        setEsCasaMatriz(false);
        setIdDomicilio(0);
    };

    const handleSaveDomicilio = (domicilio: any) => {
        setIdDomicilio(domicilio.id); // Asigna el ID del domicilio guardado
        setShowDomicilioModal(false);
    };

    return (
        <>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Agregar Sucursal</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formNombre">
                            <Form.Label>Nombre</Form.Label>
                            <Form.Control
                                type="text"
                                value={nombre}
                                onChange={e => setNombre(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group controlId="formHorarioApertura">
                            <Form.Label>Horario de Apertura</Form.Label>
                            <Form.Control
                                type="time"
                                value={horarioApertura}
                                onChange={e => setHorarioApertura(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group controlId="formHorarioCierre">
                            <Form.Label>Horario de Cierre</Form.Label>
                            <Form.Control
                                type="time"
                                value={horarioCierre}
                                onChange={e => setHorarioCierre(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group controlId="formEsCasaMatriz">
                            <Form.Check
                                type="checkbox"
                                label="Es Casa Matriz"
                                checked={esCasaMatriz}
                                onChange={e => setEsCasaMatriz(e.target.checked)}
                            />
                        </Form.Group>
                        <Form.Group controlId="formDomicilio">
                            <Form.Label>Domicilio</Form.Label>
                            <div className="d-flex">
                                <Form.Control
                                    type="text"
                                    value={idDomicilio ? `ID: ${idDomicilio}` : 'Ningún domicilio seleccionado'}
                                    readOnly
                                />
                                <Button variant="secondary" onClick={() => setShowDomicilioModal(true)}>
                                    Agregar Domicilio
                                </Button>
                            </div>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Cancelar
                    </Button>
                    <Button variant="primary" onClick={onSave}>
                        Guardar
                    </Button>
                </Modal.Footer>
            </Modal>
            <ModalDomicilio
                show={showDomicilioModal}
                handleClose={() => setShowDomicilioModal(false)}
                handleSave={handleSaveDomicilio} // Pasar el manejador de guardar domicilio
            />
        </>
    );
};
