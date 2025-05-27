import React, { useState } from 'react';
import {
/*     Box, */
    Container,
    Paper,
    Typography,
    TextField,
    Button,
    Stack,
    Divider,
    Alert,
    Grid,
    Switch,
    FormControlLabel
   /*  useTheme, */
} from '@mui/material';
import {
    NotificationsActive,
    Lock,
    Security,
    Language,
} from '@mui/icons-material';
/* import { useUser } from '../contexts/UserContext'; */
import axios from 'axios';

const SettingsPage = () => {
   /*  const theme = useTheme();
    const { user, updateUser } = useUser(); */
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [notifications, setNotifications] = useState({
        emailNotifications: true,
        smsNotifications: false,
        rentalReminders: true,
        promotionalEmails: false,
    });
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setError('Mật khẩu mới không khớp');
            return;
        }
        try {
            const token = localStorage.getItem('token');
            await axios.put(
                'http://localhost:5000/api/users/change-password',
                passwordData,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            setSuccess('Đổi mật khẩu thành công');
            setPasswordData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: '',
            });
            setError('');
        } catch (error) {
            setError(error.response?.data?.message || 'Có lỗi xảy ra');
        }
    };

    const handleNotificationChange = (event) => {
        setNotifications({
            ...notifications,
            [event.target.name]: event.target.checked,
        });
    };

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
                Cài đặt tài khoản
            </Typography>

            <Grid container spacing={3}>
                {/* Left Column - Categories */}
                <Grid item xs={12} md={3}>
                    <Paper sx={{ p: 2 }}>
                        <Stack spacing={2}>
                            <Button
                                startIcon={<Security />}
                                fullWidth
                                variant="text"
                                sx={{ justifyContent: 'flex-start' }}
                            >
                                Bảo mật
                            </Button>
                            <Button
                                startIcon={<NotificationsActive />}
                                fullWidth
                                variant="text"
                                sx={{ justifyContent: 'flex-start' }}
                            >
                                Thông báo
                            </Button>
                            <Button
                                startIcon={<Language />}
                                fullWidth
                                variant="text"
                                sx={{ justifyContent: 'flex-start' }}
                            >
                                Ngôn ngữ
                            </Button>
                        </Stack>
                    </Paper>
                </Grid>

                {/* Right Column - Settings Content */}
                <Grid item xs={12} md={9}>
                    {/* Password Change Section */}
                    <Paper sx={{ p: 3, mb: 3 }}>
                        <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                            <Lock sx={{ mr: 1 }} /> Đổi mật khẩu
                        </Typography>

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

                        <form onSubmit={handlePasswordChange}>
                            <Stack spacing={3}>
                                <TextField
                                    label="Mật khẩu hiện tại"
                                    type="password"
                                    value={passwordData.currentPassword}
                                    onChange={(e) => setPasswordData({
                                        ...passwordData,
                                        currentPassword: e.target.value
                                    })}
                                    fullWidth
                                    required
                                />
                                <TextField
                                    label="Mật khẩu mới"
                                    type="password"
                                    value={passwordData.newPassword}
                                    onChange={(e) => setPasswordData({
                                        ...passwordData,
                                        newPassword: e.target.value
                                    })}
                                    fullWidth
                                    required
                                />
                                <TextField
                                    label="Xác nhận mật khẩu mới"
                                    type="password"
                                    value={passwordData.confirmPassword}
                                    onChange={(e) => setPasswordData({
                                        ...passwordData,
                                        confirmPassword: e.target.value
                                    })}
                                    fullWidth
                                    required
                                />
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    sx={{ mt: 2 }}
                                >
                                    Cập nhật mật khẩu
                                </Button>
                            </Stack>
                        </form>
                    </Paper>

                    {/* Notifications Section */}
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                            <NotificationsActive sx={{ mr: 1 }} /> Cài đặt thông báo
                        </Typography>

                        <Stack spacing={2}>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={notifications.emailNotifications}
                                        onChange={handleNotificationChange}
                                        name="emailNotifications"
                                    />
                                }
                                label="Thông báo qua email"
                            />
                            <Divider />
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={notifications.smsNotifications}
                                        onChange={handleNotificationChange}
                                        name="smsNotifications"
                                    />
                                }
                                label="Thông báo qua SMS"
                            />
                            <Divider />
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={notifications.rentalReminders}
                                        onChange={handleNotificationChange}
                                        name="rentalReminders"
                                    />
                                }
                                label="Nhắc nhở lịch thuê xe"
                            />
                            <Divider />
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={notifications.promotionalEmails}
                                        onChange={handleNotificationChange}
                                        name="promotionalEmails"
                                    />
                                }
                                label="Email khuyến mãi"
                            />
                        </Stack>

                        <Button
                            variant="contained"
                            color="primary"
                            sx={{ mt: 3 }}
                        >
                            Lưu cài đặt
                        </Button>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
};

export default SettingsPage;
