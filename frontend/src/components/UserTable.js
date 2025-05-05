import React, { useEffect, useState, useCallback } from 'react';
import { 
    Table, 
    TableBody, 
    TableCell, 
    TableContainer, 
    TableHead, 
    TableRow, 
    Paper, 
    Button, 
    Typography,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    IconButton
} from '@mui/material';
import { 
    Block, 
    CheckCircle, 
    Delete 
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const UserTable = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const navigate = useNavigate();

    const handleAuthError = useCallback((error) => {
        if (error.response?.status === 401 || error.response?.status === 403) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            navigate('/login');
        }
    }, [navigate]);

    const fetchUsers = useCallback(async () => {
        try {
            setError(null);
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }
            const response = await axios.get('http://localhost:5000/api/users', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
            handleAuthError(error);
            setError('Không thể tải danh sách người dùng');
        } finally {
            setLoading(false);
        }
    }, [navigate, handleAuthError]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const handleBlockUser = async (userId, currentStatus) => {
        try {
            const token = localStorage.getItem('token');
            await axios.patch(
                `http://localhost:5000/api/users/${userId}/status`,
                { status: currentStatus === 'blocked' ? 'active' : 'blocked' },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            fetchUsers();
        } catch (error) {
            console.error('Error updating user status:', error);
            handleAuthError(error);
        }
    };

    const handleDeleteUser = async (userId) => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:5000/api/users/${userId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setDeleteConfirmOpen(false);
            fetchUsers();
        } catch (error) {
            console.error('Error deleting user:', error);
            handleAuthError(error);
        }
    };

    const confirmDelete = (user) => {
        setSelectedUser(user);
        setDeleteConfirmOpen(true);
    };

    if (loading) {
        return <Typography>Loading...</Typography>;
    }

    if (error) {
        return <Typography color="error">{error}</Typography>;
    }

    return (
        <>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Tên</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Số điện thoại</TableCell>
                            <TableCell>Vai trò</TableCell>
                            <TableCell>Trạng thái</TableCell>
                            <TableCell>Thao tác</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map(user => (
                            <TableRow key={user._id}>
                                <TableCell>{user.name}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>{user.phone || 'N/A'}</TableCell>
                                <TableCell>
                                    <Chip 
                                        label={user.role || 'user'} 
                                        color={user.role === 'admin' ? 'primary' : 'default'}
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell>
                                    <Chip 
                                        label={user.status || 'active'} 
                                        color={user.status === 'blocked' ? 'error' : 'success'}
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell>
                                    <IconButton
                                        color={user.status === 'blocked' ? 'success' : 'warning'}
                                        onClick={() => handleBlockUser(user._id, user.status)}
                                        disabled={user.role === 'admin'}
                                        size="small"
                                    >
                                        {user.status === 'blocked' ? <CheckCircle /> : <Block />}
                                    </IconButton>
                                    <IconButton
                                        color="error"
                                        onClick={() => confirmDelete(user)}
                                        disabled={user.role === 'admin'}
                                        size="small"
                                    >
                                        <Delete />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog
                open={deleteConfirmOpen}
                onClose={() => setDeleteConfirmOpen(false)}
            >
                <DialogTitle>Xác nhận xóa người dùng</DialogTitle>
                <DialogContent>
                    Bạn có chắc chắn muốn xóa người dùng {selectedUser?.name}?
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteConfirmOpen(false)}>Hủy</Button>
                    <Button 
                        onClick={() => handleDeleteUser(selectedUser?._id)} 
                        color="error" 
                        variant="contained"
                    >
                        Xóa
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default UserTable;
