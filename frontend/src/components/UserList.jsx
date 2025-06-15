import React, { useEffect, useState } from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Pagination,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Alert,
} from "@mui/material";
import axios from "axios";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(9);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5000/api/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
        setError("Không thể tải danh sách người dùng");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(users.filter((user) => user._id !== id));
      alert("Xóa người dùng thành công!");
    } catch (error) {
      console.error(error);
      alert("Không thể xóa người dùng.");
    }
  };
  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleItemsPerPageChange = (event) => {
    setItemsPerPage(event.target.value);
    setPage(1);
  };

  // Calculate pagination
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedUsers = users.slice(startIndex, endIndex);
  const totalPages = Math.ceil(users.length / itemsPerPage);

  if (loading) {
    return <Typography>Đang tải...</Typography>;
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        {users.length === 0 ? (
          <Grid item xs={12}>
            <Typography align="center">Không có người dùng nào</Typography>
          </Grid>
        ) : (
          paginatedUsers.map((user) => (
            <Grid item xs={12} sm={6} md={4} key={user._id}>
              <Card>
                <CardContent>
                  <Typography variant="h6" component="div">
                    Tên: {user.name}
                  </Typography>
                  <Typography color="text.secondary">
                    Email: {user.email || "N/A"}
                  </Typography>
                  <Typography color="text.secondary">
                    Số điện thoại: {user.phone || "N/A"}
                  </Typography>
                  <Typography color="text.secondary">
                    Vai trò:{" "}
                    {user.role === "admin" ? "Quản trị viên" : "Người dùng"}
                  </Typography>
                </CardContent>
                {user.role !== "admin" && (
                  <Box sx={{ p: 1 }}>
                    <Button
                      size="small"
                      variant="contained"
                      color="error"
                      onClick={() => handleDelete(user._id)}
                      fullWidth
                    >
                      Xóa
                    </Button>
                  </Box>
                )}
              </Card>
            </Grid>
          ))
        )}
      </Grid>

      {users.length > 0 && (
        <Box
          sx={{
            mt: 4,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 3,
          }}
        >
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Số mục/trang</InputLabel>
            <Select
              value={itemsPerPage}
              label="Số mục/trang"
              onChange={handleItemsPerPageChange}
            >
              <MenuItem value={9}>9</MenuItem>
              <MenuItem value={18}>18</MenuItem>
              <MenuItem value={27}>27</MenuItem>
            </Select>
          </FormControl>
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            color="primary"
            showFirstButton
            showLastButton
          />
        </Box>
      )}
    </Box>
  );
};

export default UserList;
