import React, { useState } from 'react';
import { IUnidadMedidaPost } from '../../../../types/UnidadMedida/IUnidadMedidaPost';
import { Modal, Button, Form } from 'react-bootstrap';

// ---------- INTERFAZ ----------
interface UnidadMedidaModalProps {
    show: boolean;
    addUnidadMedida: (unidadMedida: IUnidadMedidaPost) => void;
    handleClose: () => void;
}

// ------------------------------ COMPONENTE PRINCIPAL ------------------------------
export const UnidadMedidaModal: React.FC<UnidadMedidaModalProps> = ({ show, handleClose, addUnidadMedida }) => {
    const [denominacion, setDenominacion] = useState<string>('');

    const handleSave = async () => {
        const unidadMedida: IUnidadMedidaPost = { denominacion };
        try {
            addUnidadMedida(unidadMedida);
            handleClose();
            setDenominacion(''); // Reset form
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Modal show={show} onHide={handleClose} size="lg">
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
                <Button variant="primary" onClick={handleSave}>
                    Guardar
                </Button>
            </Modal.Footer>
        </Modal>
    );
};
