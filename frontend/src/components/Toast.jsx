import React from 'react';
import { Snackbar, Alert } from '@mui/material';

const Toast = ({ open, handleClose, severity, message }) => {
    return (
        <Snackbar
            open={open}
            autoHideDuration={3000}
            onClose={handleClose}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
            <Alert 
                onClose={handleClose} 
                severity={severity} 
                elevation={6}
                variant="filled"
            >
                {message}
            </Alert>
        </Snackbar>
    );
};

export default Toast;
