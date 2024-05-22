import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { IUnidadMedida } from '../../../../types/UnidadMedida/IUnidadMedida';
import { IUnidadMedidaPost } from '../../../../types/UnidadMedida/IUnidadMedidaPost';
import { UnidadMedidaService } from '../../../../services/UnidadMedidaService';


interface UnidadMedidaModalProps {
    show: boolean;
    addUnidadMedida: (unidadMedida: IUnidadMedida) => void;
    handleClose: () => void;
    handleSave: (unidadMedida: IUnidadMedidaPost) => void;
    sx?: React.CSSProperties;
}
const API_URL = import.meta.env.VITE_API_URL;
export const UnidadMedidaModal: React.FC<UnidadMedidaModalProps> = ({ show, handleClose, addUnidadMedida }) => {
    const [denominacion, setDenominacion] = useState<string>('');

    const unidadMedidaService = new UnidadMedidaService(API_URL + "/unidad-medida");
    const handleSave = async (unidadMedida: IUnidadMedidaPost) => {
        try {
            const response = await unidadMedidaService.post(unidadMedida);
            addUnidadMedida(response)
            console.log(response);
        } catch (error) {
            console.error(error);
        }
    }
    const onSave = () => {
        const unidadMedida: IUnidadMedidaPost = {
            denominacion: denominacion
        }
        handleSave(unidadMedida);
        handleClose();
        setDenominacion(''); // Reset form
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Crear Unidad de Medida</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group controlId="formDenominacion">
                        <Form.Label>Denominación</Form.Label>
                        <Form.Control
                            type="text"
                            value={denominacion}
                            onChange={e => setDenominacion(e.target.value)}
                        />
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
    );
};