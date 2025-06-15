import React from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Container,
  Paper,
} from "@mui/material";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import GroupsIcon from "@mui/icons-material/Groups";
import StarIcon from "@mui/icons-material/Star";
import LocalAtmIcon from "@mui/icons-material/LocalAtm";

const AboutPage = () => {
  const features = [
    {
      icon: <DirectionsCarIcon sx={{ fontSize: 40 }} />,
      title: "Đa dạng xe",
      description:
        "Nhiều loại xe đa dạng từ 4 đến 16 chỗ, đáp ứng mọi nhu cầu của khách hàng",
    },
    {
      icon: <GroupsIcon sx={{ fontSize: 40 }} />,
      title: "Cộng đồng tin cậy",
      description:
        "Xây dựng cộng đồng người dùng ô tô văn minh và uy tín #1 Việt Nam",
    },
    {
      icon: <StarIcon sx={{ fontSize: 40 }} />,
      title: "Chất lượng hàng đầu",
      description:
        "Xe được kiểm định chất lượng nghiêm ngặt, đảm bảo an toàn cho mọi chuyến đi",
    },
    {
      icon: <LocalAtmIcon sx={{ fontSize: 40 }} />,
      title: "Giá cả hợp lý",
      description: "Chi phí thuê xe cạnh tranh, minh bạch, không phát sinh",
    },
  ];

  return (
    <Container maxWidth="lg">
      {/* Hero Section */}
      <Box sx={{ textAlign: "center", py: 8 }}>
        <Typography
          variant="h2"
          sx={{
            fontWeight: "bold",
            mb: 3,
            background: "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          HDOTO
        </Typography>
        <Typography variant="h5" color="text.secondary" sx={{ mb: 5 }}>
          Cùng bạn đến mọi hành trình
        </Typography>
      </Box>

      {/* Main Content */}
      <Grid container spacing={6} sx={{ mb: 8 }}>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 4, height: "100%", borderRadius: 2 }}>
            <Typography
              variant="h4"
              gutterBottom
              sx={{ fontWeight: "bold", color: "#1976d2" }}
            >
              Về chúng tôi
            </Typography>
            <Typography paragraph>
              HDOTO là nền tảng chia sẻ xe hiện đại, kết nối chủ xe và khách
              hàng qua công nghệ số. Chúng tôi cam kết mang đến trải nghiệm thuê
              xe an toàn, tiện lợi với chi phí tối ưu.
            </Typography>
            <Typography paragraph>
              Được thành lập với sứ mệnh hiện đại hóa thị trường cho thuê xe tự
              lái tại Việt Nam, HDOTO không ngừng đổi mới để mang đến dịch vụ
              tốt nhất cho khách hàng.
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card
            sx={{ height: "100%", display: "flex", flexDirection: "column" }}
          >
            <CardMedia
              component="img"
              height="300"
              image="https://res.cloudinary.com/dfo1vdnhk/image/upload/v1747731683/car_images/car-1747731681699-260316467.jpg"
              alt="HDOTO Office"
              sx={{ objectFit: "cover" }}
            />
          </Card>
        </Grid>
      </Grid>

      {/* Features Section */}
      <Box sx={{ mb: 8 }}>
        <Typography
          variant="h4"
          textAlign="center"
          gutterBottom
          sx={{ mb: 6, fontWeight: "bold" }}
        >
          Tại sao chọn HDOTO?
        </Typography>
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  transition: "0.3s",
                  "&:hover": {
                    transform: "translateY(-5px)",
                    boxShadow: 6,
                  },
                }}
              >
                <CardContent sx={{ flexGrow: 1, textAlign: "center" }}>
                  <Box sx={{ color: "#1976d2", mb: 2 }}>{feature.icon}</Box>
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ fontWeight: "bold" }}
                  >
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Mission Section */}
      <Box sx={{ mb: 8 }}>
        <Paper
          elevation={3}
          sx={{
            p: 6,
            borderRadius: 2,
            background: "linear-gradient(45deg, #1976d2 30%, #21CBF3 90%)",
            color: "white",
          }}
        >
          <Typography
            variant="h4"
            gutterBottom
            sx={{ textAlign: "center", fontWeight: "bold" }}
          >
            Sứ mệnh của chúng tôi
          </Typography>
          <Typography
            variant="h6"
            sx={{ textAlign: "center", fontWeight: "normal" }}
          >
            Xây dựng nền tảng công nghệ hiện đại kết nối cộng đồng tin cậy, mang
            đến những chuyến đi an toàn và trọn vẹn cho mọi người.
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
};

export default AboutPage;
