import React, { useState } from 'react';
import {
    Box,
    Container,
    Grid,
    Paper,
    Typography,
    TextField,
    Button,
    Avatar,
    Stack,
    Divider,
    Alert,
    IconButton,
    useTheme,
} from '@mui/material';
import {
    Edit,
    PhotoCamera,
    LocationOn,
    Phone,
    Email,
    Settings,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import axios from 'axios';

const ProfilePage = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const { user, updateUser } = useUser();
    const [editing, setEditing] = useState(false);
    const [profileData, setProfileData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        address: user?.address || '',
    });
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    const handleEditToggle = () => {
        if (editing) {
            setProfileData({
                name: user?.name || '',
                email: user?.email || '',
                phone: user?.phone || '',
                address: user?.address || '',
            });
        }
        setEditing(!editing);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const response = await axios.put(
                'http://localhost:5000/api/users/profile',
                profileData,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            updateUser(response.data);
            setSuccess('Cập nhật thông tin thành công');
            setEditing(false);
            setError('');
        } catch (error) {
            setError(error.response?.data?.message || 'Có lỗi xảy ra');
        }
    };

    const handleImageUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('avatar', file);

        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(
                'http://localhost:5000/api/users/upload-avatar',
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );
            updateUser({ ...user, avatar: response.data.avatar });
            setSuccess('Cập nhật ảnh đại diện thành công');
        } catch (error) {
            setError('Không thể tải lên ảnh. Vui lòng thử lại');
        }
    };

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Grid container spacing={3}>
                {/* Left Column - Profile Overview */}
                <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 3, textAlign: 'center' }}>
                        <Box sx={{ position: 'relative', display: 'inline-block' }}>
                            <Avatar
                                src={user?.avatar}
                                alt={user?.name}
                                sx={{
                                    width: 120,
                                    height: 120,
                                    mx: 'auto',
                                    mb: 2,
                                    border: `4px solid ${theme.palette.primary.main}`,
                                }}
                            />
                            <input
                                accept="image/*"
                                style={{ display: 'none' }}
                                id="icon-button-file"
                                type="file"
                                onChange={handleImageUpload}
                            />
                            <label htmlFor="icon-button-file">
                                <IconButton
                                    component="span"
                                    sx={{
                                        position: 'absolute',
                                        right: 0,
                                        bottom: 0,
                                        backgroundColor: 'primary.main',
                                        color: 'white',
                                        '&:hover': {
                                            backgroundColor: 'primary.dark',
                                        },
                                    }}
                                >
                                    <PhotoCamera />
                                </IconButton>
                            </label>
                        </Box>

                        <Typography variant="h5" gutterBottom>
                            {user?.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                            {user?.email}
                        </Typography>

                        <Stack spacing={2} sx={{ mt: 3 }}>
                            <Button
                                variant="outlined"
                                fullWidth
                                startIcon={<Settings />}
                                onClick={() => navigate('/settings')}
                            >
                                Cài đặt tài khoản
                            </Button>
                        </Stack>

                        <Box sx={{ mt: 3 }}>
                            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                Tham gia từ
                            </Typography>
                            <Typography variant="body2">
                                {new Date(user?.createdAt).toLocaleDateString('vi-VN')}
                            </Typography>
                        </Box>
                    </Paper>
                </Grid>

                {/* Right Column - Profile Details */}
                <Grid item xs={12} md={8}>
                    <Paper sx={{ p: 3 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                            <Typography variant="h6">
                                Thông tin cá nhân
                            </Typography>
                            <Button
                                startIcon={editing ? null : <Edit />}
                                onClick={handleEditToggle}
                            >
                                {editing ? 'Hủy' : 'Chỉnh sửa'}
                            </Button>
                        </Box>

                        {success && (
                            <Alert severity="success" sx={{ mb: 2 }}>
                                {success}
                            </Alert>
                        )}
                        {error && (
                            <Alert severity="error" sx={{ mb: 2 }}>
                                {error}
                            </Alert>
                        )}

                        <form onSubmit={handleSubmit}>
                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Họ tên"
                                        value={profileData.name}
                                        onChange={(e) => setProfileData({
                                            ...profileData,
                                            name: e.target.value
                                        })}
                                        disabled={!editing}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Email"
                                        value={profileData.email}
                                        onChange={(e) => setProfileData({
                                            ...profileData,
                                            email: e.target.value
                                        })}
                                        disabled={!editing}
                                        type="email"
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Số điện thoại"
                                        value={profileData.phone}
                                        onChange={(e) => setProfileData({
                                            ...profileData,
                                            phone: e.target.value
                                        })}
                                        disabled={!editing}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Địa chỉ"
                                        value={profileData.address}
                                        onChange={(e) => setProfileData({
                                            ...profileData,
                                            address: e.target.value
                                        })}
                                        disabled={!editing}
                                        multiline
                                        rows={2}
                                    />
                                </Grid>
                            </Grid>

                            {editing && (
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    sx={{ mt: 3 }}
                                >
                                    Lưu thay đổi
                                </Button>
                            )}
                        </form>

                        <Divider sx={{ my: 4 }} />

                        {/* Contact Information */}
                        <Typography variant="h6" gutterBottom>
                            Thông tin liên hệ
                        </Typography>
                        <Stack spacing={2}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Phone sx={{ mr: 2, color: 'text.secondary' }} />
                                <Typography>
                                    {user?.phone || 'Chưa cập nhật số điện thoại'}
                                </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Email sx={{ mr: 2, color: 'text.secondary' }} />
                                <Typography>
                                    {user?.email}
                                </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <LocationOn sx={{ mr: 2, color: 'text.secondary' }} />
                                <Typography>
                                    {user?.address || 'Chưa cập nhật địa chỉ'}
                                </Typography>
                            </Box>
                        </Stack>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
};

export default ProfilePage;