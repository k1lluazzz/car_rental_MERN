import React from 'react';
import { Container, Box, Typography, Grid, Paper, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import { DirectionsCar, Security, Speed, Star } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const FeatureCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: theme.shadows[8],
  },
}));

const HomePage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <DirectionsCar sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Đa dạng xe',
      description: 'Từ xe phổ thông đến xe sang, đáp ứng mọi nhu cầu của bạn'
    },
    {
      icon: <Security sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'An toàn & Tin cậy',
      description: 'Xe được bảo dưỡng định kỳ, đảm bảo an toàn tối đa'
    },
    {
      icon: <Speed sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Đặt xe nhanh chóng',
      description: 'Quy trình đặt xe đơn giản, xác nhận tức thì'
    },
    {
      icon: <Star sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Dịch vụ 5 sao',
      description: 'Đội ngũ hỗ trợ 24/7, sẵn sàng phục vụ bạn'
    }
  ];

  return (
    <Box sx={{ bgcolor: 'background.default' }}>
      {/* Hero Section is rendered from App.js */}
      
      {/* Features Section */}
      <Container sx={{ py: 8 }}>
        <Typography
          variant="h3"
          align="center"
          gutterBottom
          sx={{
            fontWeight: 700,
            mb: 6,
            background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
            backgroundClip: 'text',
            textFillColor: 'transparent',
          }}
        >
          Tại sao chọn chúng tôi?
        </Typography>

        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <FeatureCard>
                {feature.icon}
                <Typography variant="h6" sx={{ mt: 2, mb: 1, fontWeight: 600 }}>
                  {feature.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {feature.description}
                </Typography>
              </FeatureCard>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Call to Action Section */}
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          py: 8,
          mt: 6,
          backgroundImage: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
        }}
      >
        <Container>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={8}>
              <Typography variant="h4" sx={{ fontWeight: 600 }}>
                Sẵn sàng trải nghiệm chuyến đi của bạn?
              </Typography>
              <Typography variant="h6" sx={{ mt: 2, opacity: 0.9 }}>
                Đặt xe ngay hôm nay và nhận ưu đãi đặc biệt
              </Typography>
            </Grid>
            <Grid item xs={12} md={4} sx={{ textAlign: 'center' }}>
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate('/rentals')}
                sx={{
                  bgcolor: 'white',
                  color: 'primary.main',
                  px: 4,
                  py: 2,
                  '&:hover': {
                    bgcolor: 'grey.100',
                  },
                }}
              >
                Thuê xe ngay
              </Button>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage;
