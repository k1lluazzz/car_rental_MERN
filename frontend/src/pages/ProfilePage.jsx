import React, { useState } from "react";
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
  Skeleton,
  CircularProgress,
  Badge,
  Tooltip,
} from "@mui/material";
import {
  Edit,
  PhotoCamera,
  LocationOn,
  Phone,
  Email,
  Settings,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
import axios from "axios";

const ProfilePage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { user, updateUser } = useUser();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: user?.address || "",
  });
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleEditToggle = () => {
    if (editing) {
      setProfileData({
        name: user?.name || "",
        email: user?.email || "",
        phone: user?.phone || "",
        address: user?.address || "",
      });
    }
    setEditing(!editing);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        "http://localhost:5000/api/users/profile",
        profileData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      updateUser(response.data);
      setSuccess("Cập nhật thông tin thành công");
      setEditing(false);
    } catch (error) {
      setError(
        error.response?.data?.message || "Có lỗi xảy ra khi cập nhật thông tin"
      );
      console.error("Error updating profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    const validTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (!validTypes.includes(file.type)) {
      setError("Chỉ chấp nhận file ảnh .jpg, .jpeg hoặc .png");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("Kích thước ảnh tối đa là 5MB");
      return;
    }

    setUploadingAvatar(true);
    setError("");
    setSuccess("");

    const formData = new FormData();
    formData.append("avatar", file);

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:5000/api/users/upload-avatar",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      updateUser({ ...user, avatar: response.data.avatar });
      setSuccess("Cập nhật ảnh đại diện thành công");
    } catch (error) {
      console.error("Error uploading avatar:", error);
      setError(
        "Không thể tải lên ảnh. " +
          (error.response?.data?.message || "Vui lòng thử lại")
      );
    } finally {
      setUploadingAvatar(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={3}>
        {/* Left Column - Profile Overview */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, textAlign: "center" }}>
            <Box sx={{ position: "relative", display: "inline-block" }}>
              {" "}
              <Badge
                overlap="circular"
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                badgeContent={
                  uploadingAvatar ? (
                    <CircularProgress size={22} />
                  ) : (
                    <Tooltip title="Cập nhật ảnh đại diện">
                      <label htmlFor="icon-button-file">
                        <IconButton
                          component="span"
                          sx={{
                            width: 32,
                            height: 32,
                            backgroundColor: "primary.main",
                            color: "white",
                            "&:hover": {
                              backgroundColor: "primary.dark",
                            },
                          }}
                        >
                          <PhotoCamera sx={{ fontSize: 20 }} />
                        </IconButton>
                      </label>
                    </Tooltip>
                  )
                }
              >
                <Avatar
                  src={user?.avatar}
                  alt={user?.name}
                  sx={{
                    width: 120,
                    height: 120,
                    border: `4px solid ${theme.palette.primary.main}`,
                  }}
                >
                  {user?.name?.charAt(0).toUpperCase()}
                </Avatar>
              </Badge>
              <input
                accept="image/jpeg,image/png,image/jpg"
                style={{ display: "none" }}
                id="icon-button-file"
                type="file"
                onChange={handleImageUpload}
              />
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
                onClick={() => navigate("/settings")}
              >
                Cài đặt tài khoản
              </Button>
            </Stack>

            <Box sx={{ mt: 3 }}>
              {" "}
              <Typography
                variant="subtitle2"
                color="text.secondary"
                gutterBottom
              >
                Tham gia từ
              </Typography>
              <Typography variant="body2">
                {user?.createdAt
                  ? new Date(user.createdAt).toLocaleDateString("vi-VN", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : "Không có thông tin"}
              </Typography>
            </Box>
          </Paper>
        </Grid>

        {/* Right Column - Profile Details */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}
            >
              <Typography variant="h6">Thông tin cá nhân</Typography>
              <Button
                startIcon={editing ? null : <Edit />}
                onClick={handleEditToggle}
              >
                {editing ? "Hủy" : "Chỉnh sửa"}
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
                    label="Họ và tên"
                    value={profileData.name}
                    onChange={(e) =>
                      setProfileData({ ...profileData, name: e.target.value })
                    }
                    disabled={!editing || loading}
                    required
                    error={editing && !profileData.name}
                    helperText={
                      editing && !profileData.name ? "Vui lòng nhập họ tên" : ""
                    }
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Email"
                    value={profileData.email}
                    disabled
                    helperText="Email không thể thay đổi"
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Số điện thoại"
                    value={profileData.phone}
                    onChange={(e) =>
                      setProfileData({ ...profileData, phone: e.target.value })
                    }
                    disabled={!editing || loading}
                    placeholder="Nhập số điện thoại"
                    helperText={
                      editing
                        ? "Số điện thoại dùng để liên hệ khi cần thiết"
                        : ""
                    }
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Địa chỉ"
                    value={profileData.address}
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        address: e.target.value,
                      })
                    }
                    disabled={!editing || loading}
                    multiline
                    rows={2}
                    placeholder="Nhập địa chỉ của bạn"
                  />
                </Grid>

                {editing && (
                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      fullWidth
                      disabled={loading || !profileData.name}
                      sx={{
                        py: 1.5,
                        position: "relative",
                      }}
                    >
                      {loading ? (
                        <>
                          <CircularProgress
                            size={24}
                            sx={{
                              position: "absolute",
                              left: "50%",
                              marginLeft: "-12px",
                            }}
                          />
                          Đang lưu...
                        </>
                      ) : (
                        "Lưu thay đổi"
                      )}
                    </Button>
                  </Grid>
                )}
              </Grid>
            </form>

            <Divider sx={{ my: 4 }} />

            {/* Contact Information */}
            <Typography variant="h6" gutterBottom>
              Thông tin liên hệ
            </Typography>
            <Stack spacing={2}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Phone sx={{ mr: 2, color: "text.secondary" }} />
                <Typography>
                  {user?.phone || "Chưa cập nhật số điện thoại"}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Email sx={{ mr: 2, color: "text.secondary" }} />
                <Typography>{user?.email}</Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <LocationOn sx={{ mr: 2, color: "text.secondary" }} />
                <Typography>
                  {user?.address || "Chưa cập nhật địa chỉ"}
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
