import React, { useState, useEffect } from "react";
import {
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
  FormControlLabel,
  CircularProgress,
  IconButton,
  Box,
  Tab,
  Tabs,
  useTheme,
} from "@mui/material";
import {
  NotificationsActive,
  Lock,
  Security,
  Language,
  Close as CloseIcon,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import { useUser } from "../contexts/UserContext";
/* import { useUser } from '../contexts/UserContext'; */
import axios from "axios";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`settings-tabpanel-${index}`}
      aria-labelledby={`settings-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

const SettingsPage = () => {
  const theme = useTheme();
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    smsNotifications: false,
    rentalReminders: true,
    promotionalEmails: false,
  });
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError("Mật khẩu mới không khớp");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        "http://localhost:5000/api/users/change-password",
        passwordData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSuccess("Đổi mật khẩu thành công");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setError("");
    } catch (error) {
      setError(error.response?.data?.message || "Có lỗi xảy ra");
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
            <Tabs
              orientation="vertical"
              value={activeTab}
              onChange={(e, newValue) => setActiveTab(newValue)}
              aria-label="settings tabs"
              sx={{
                borderRight: 1,
                borderColor: "divider",
                "& .MuiTab-root": {
                  alignItems: "flex-start",
                  textAlign: "left",
                  pl: 0,
                },
              }}
            >
              <Tab
                icon={<Security />}
                label="Bảo mật"
                iconPosition="start"
                sx={{ minHeight: 50 }}
              />
              <Tab
                icon={<NotificationsActive />}
                label="Thông báo"
                iconPosition="start"
                sx={{ minHeight: 50 }}
              />
              <Tab
                icon={<Language />}
                label="Ngôn ngữ"
                iconPosition="start"
                sx={{ minHeight: 50 }}
              />
            </Tabs>
          </Paper>
        </Grid>

        {/* Right Column - Settings Content */}
        <Grid item xs={12} md={9}>
          <TabPanel value={activeTab} index={0}>
            {/* Password Change Section */}
            <Paper sx={{ p: 3 }}>
              <Typography
                variant="h6"
                sx={{ display: "flex", alignItems: "center", mb: 3 }}
              >
                <Lock sx={{ mr: 1 }} /> Đổi mật khẩu
              </Typography>

              {success && (
                <Alert
                  severity="success"
                  sx={{ mb: 2 }}
                  action={
                    <IconButton
                      aria-label="close"
                      color="inherit"
                      size="small"
                      onClick={() => setSuccess("")}
                    >
                      <CloseIcon fontSize="inherit" />
                    </IconButton>
                  }
                >
                  {success}
                </Alert>
              )}
              {error && (
                <Alert
                  severity="error"
                  sx={{ mb: 2 }}
                  action={
                    <IconButton
                      aria-label="close"
                      color="inherit"
                      size="small"
                      onClick={() => setError("")}
                    >
                      <CloseIcon fontSize="inherit" />
                    </IconButton>
                  }
                >
                  {error}
                </Alert>
              )}

              <form onSubmit={handlePasswordChange}>
                <Stack spacing={3}>
                  <TextField
                    label="Mật khẩu hiện tại"
                    type={showCurrentPassword ? "text" : "password"}
                    value={passwordData.currentPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        currentPassword: e.target.value,
                      })
                    }
                    fullWidth
                    required
                    InputProps={{
                      endAdornment: (
                        <IconButton
                          onClick={() =>
                            setShowCurrentPassword(!showCurrentPassword)
                          }
                          edge="end"
                        >
                          {showCurrentPassword ? (
                            <VisibilityOff />
                          ) : (
                            <Visibility />
                          )}
                        </IconButton>
                      ),
                    }}
                  />
                  <TextField
                    label="Mật khẩu mới"
                    type={showNewPassword ? "text" : "password"}
                    value={passwordData.newPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        newPassword: e.target.value,
                      })
                    }
                    fullWidth
                    required
                    InputProps={{
                      endAdornment: (
                        <IconButton
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          edge="end"
                        >
                          {showNewPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      ),
                    }}
                  />
                  <TextField
                    label="Xác nhận mật khẩu mới"
                    type={showConfirmPassword ? "text" : "password"}
                    value={passwordData.confirmPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        confirmPassword: e.target.value,
                      })
                    }
                    fullWidth
                    required
                    InputProps={{
                      endAdornment: (
                        <IconButton
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          edge="end"
                        >
                          {showConfirmPassword ? (
                            <VisibilityOff />
                          ) : (
                            <Visibility />
                          )}
                        </IconButton>
                      ),
                    }}
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={loading}
                    sx={{ mt: 2 }}
                  >
                    {loading ? (
                      <>
                        <CircularProgress size={24} sx={{ mr: 1 }} />
                        Đang cập nhật...
                      </>
                    ) : (
                      "Cập nhật mật khẩu"
                    )}
                  </Button>
                </Stack>
              </form>
            </Paper>
          </TabPanel>

          <TabPanel value={activeTab} index={1}>
            {/* Notifications Section */}
            <Paper sx={{ p: 3 }}>
              <Typography
                variant="h6"
                sx={{ display: "flex", alignItems: "center", mb: 3 }}
              >
                <NotificationsActive sx={{ mr: 1 }} /> Cài đặt thông báo
              </Typography>

              <Stack spacing={2}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={notifications.emailNotifications}
                      onChange={handleNotificationChange}
                      name="emailNotifications"
                      color="primary"
                    />
                  }
                  label={
                    <Box>
                      <Typography>Thông báo qua email</Typography>
                      <Typography variant="caption" color="text.secondary">
                        Nhận thông báo về đơn thuê xe qua email
                      </Typography>
                    </Box>
                  }
                />
                <Divider />
                <FormControlLabel
                  control={
                    <Switch
                      checked={notifications.smsNotifications}
                      onChange={handleNotificationChange}
                      name="smsNotifications"
                      color="primary"
                    />
                  }
                  label={
                    <Box>
                      <Typography>Thông báo qua SMS</Typography>
                      <Typography variant="caption" color="text.secondary">
                        Nhận thông báo khẩn cấp qua SMS
                      </Typography>
                    </Box>
                  }
                />
                <Divider />
                <FormControlLabel
                  control={
                    <Switch
                      checked={notifications.rentalReminders}
                      onChange={handleNotificationChange}
                      name="rentalReminders"
                      color="primary"
                    />
                  }
                  label={
                    <Box>
                      <Typography>Nhắc nhở lịch thuê xe</Typography>
                      <Typography variant="caption" color="text.secondary">
                        Nhận nhắc nhở trước khi bắt đầu và kết thúc thuê xe
                      </Typography>
                    </Box>
                  }
                />
                <Divider />
                <FormControlLabel
                  control={
                    <Switch
                      checked={notifications.promotionalEmails}
                      onChange={handleNotificationChange}
                      name="promotionalEmails"
                      color="primary"
                    />
                  }
                  label={
                    <Box>
                      <Typography>Email khuyến mãi</Typography>
                      <Typography variant="caption" color="text.secondary">
                        Nhận thông tin về ưu đãi và khuyến mãi mới
                      </Typography>
                    </Box>
                  }
                />
              </Stack>

              <Button
                variant="contained"
                color="primary"
                sx={{ mt: 3 }}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <CircularProgress size={24} sx={{ mr: 1 }} />
                    Đang lưu...
                  </>
                ) : (
                  "Lưu cài đặt"
                )}
              </Button>
            </Paper>
          </TabPanel>

          <TabPanel value={activeTab} index={2}>
            {/* Language Section */}
            <Paper sx={{ p: 3 }}>
              <Typography
                variant="h6"
                sx={{ display: "flex", alignItems: "center", mb: 3 }}
              >
                <Language sx={{ mr: 1 }} /> Cài đặt ngôn ngữ
              </Typography>

              <Typography color="text.secondary" sx={{ mb: 2 }}>
                Tính năng đang được phát triển...
              </Typography>
            </Paper>
          </TabPanel>
        </Grid>
      </Grid>
    </Container>
  );
};

export default SettingsPage;
