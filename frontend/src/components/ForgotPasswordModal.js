import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Modal, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const ForgotPasswordModal = ({ open, onClose }) => {
    const [emailOrPhone, setEmailOrPhone] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        // Add forgot password logic here
        console.log(emailOrPhone);
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 400,
                    bgcolor: 'white',
                    borderRadius: '10px',
                    boxShadow: 24,
                    p: 4,
                }}
            >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6">Quên mật khẩu</Typography>
                    <IconButton onClick={onClose}>
                        <CloseIcon />
                    </IconButton>
                </Box>
                <form onSubmit={handleSubmit}>
                    <TextField
                        label="Điện thoại hoặc email"
                        variant="outlined"
                        fullWidth
                        sx={{ mb: 2 }}
                        value={emailOrPhone}
                        onChange={(e) => setEmailOrPhone(e.target.value)}
                        required
                    />
                    <Button type="submit" variant="contained" color="success" fullWidth>
                        Tiếp tục
                    </Button>
                </form>
            </Box>
        </Modal>
    );
};

export default ForgotPasswordModal;
