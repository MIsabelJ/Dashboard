import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Typography from '@mui/material/Typography';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import { useAppDispatch, useAppSelector } from '../../../../hooks/redux';
import { removeElementActive } from '../../../../redux/slices/TablaReducer';
import { ManufacturadosForm } from './ManufacturadosForm';
import { ManufacturadoService } from '../../../../services/ManufacturadoService';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const steps = ['Información General', 'Detalles', 'Agregar Insumos'];

export const ModalManufacturados = ({ getManufacturados, openModal, setOpenModal }) => {
  const [activeStep, setActiveStep] = React.useState(0);
  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const elementActive = useAppSelector((state) => state.tableReducer.elementActive);
  const dispatch = useAppDispatch();

  const handleClose = () => {
    setOpenModal(false);
    dispatch(removeElementActive());
  };

  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={openModal}
      onClose={handleClose}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          timeout: 500,
        },
      }}
      sx={{ zIndex: 1000 }}
    >
      <Fade in={openModal}>
        <Box sx={style}>
          <Typography id="transition-modal-title" variant="h6" component="h2">
            Producto Manufacturado
          </Typography>
          <Stepper activeStep={activeStep} sx={{ pt: 3, pb: 5 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          <ManufacturadosForm
            activeStep={activeStep}
            handleNext={handleNext}
            handleBack={handleBack}
            elementActive={elementActive}
            itemService={ManufacturadoService}
            getManufacturados={getManufacturados}
            handleClose={handleClose}
          />
        </Box>
      </Fade>
    </Modal>
  );
};