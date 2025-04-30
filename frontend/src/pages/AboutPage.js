import React from 'react';
import { Box, Typography, Grid, Card, CardContent, CardMedia } from '@mui/material';

const AboutPage = () => {
    return (
        <Box sx={{ padding: '40px 20px', backgroundColor: '#f9f9f9' }}>
            <Typography
                variant="h3"
                sx={{
                    fontWeight: 'bold',
                    marginBottom: '40px',
                    textAlign: 'center',
                    color: '#333',
                }}
            >
                HDOTO - Cùng bạn đến mọi hành trình
            </Typography>
            <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                    <Card sx={{ boxShadow: 3, borderRadius: '10px' }}>
                        <CardContent>
                            <Typography variant="body1" sx={{ marginBottom: '20px', color: '#555' }}>
                                Mỗi chuyến đi là một hành trình khám phá cuộc sống và thế giới xung quanh, là cơ hội học hỏi
                                và chinh phục những điều mới lạ của mỗi cá nhân để trở nên tốt hơn. Do đó, chất lượng trải
                                nghiệm của khách hàng là ưu tiên hàng đầu và là nguồn cảm hứng của đội ngũ HDOTO.
                            </Typography>
                            <Typography variant="body1" sx={{ color: '#555' }}>
                                HDOTO là nền tảng chia sẻ ô tô, sứ mệnh của chúng tôi không chỉ dừng lại ở việc kết nối chủ xe
                                và khách hàng một cách Nhanh chóng - An toàn - Tiện lợi, mà còn hướng đến việc truyền cảm
                                hứng KHÁM PHÁ những điều mới lạ đến cộng đồng qua những chuyến đi trên nền tảng của chúng tôi.
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Card sx={{ boxShadow: 3, borderRadius: '10px' }}>
                        <CardMedia
                            component="img"
                            height="300"
                            image="./images/car1.jpg"
                            alt="About Mioto"
                            sx={{ borderRadius: '10px 10px 0 0' }}
                        />
                    </Card>
                </Grid>
            </Grid>
            <Grid container spacing={4} sx={{ marginTop: '40px' }}>
                <Grid item xs={12} md={6}>
                    <Card sx={{ boxShadow: 3, borderRadius: '10px' }}>
                        <CardMedia
                            component="img"
                            height="300"
                            image="./images/car3.jpg"
                            alt="Drive Explore Inspire"
                            sx={{ borderRadius: '10px 10px 0 0' }}
                        />
                    </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Card sx={{ boxShadow: 3, borderRadius: '10px' }}>
                        <CardContent>
                            <Typography
                                variant="h4"
                                sx={{
                                    fontWeight: 'bold',
                                    marginBottom: '20px',
                                    color: '#333',
                                }}
                            >
                                Drive. Explore. Inspire
                            </Typography>
                            <Typography variant="body1" sx={{ marginBottom: '20px', color: '#555' }}>
                                Cầm lái và Khám phá thế giới đầy Cảm hứng.
                            </Typography>
                            <Typography variant="body1" sx={{ color: '#555' }}>
                                HDOTO đặt mục tiêu trở thành cộng đồng người dùng ô tô Văn minh & Uy tín #1 tại Việt Nam, nhằm
                                mang lại những giá trị thiết thực cho tất cả những thành viên hướng đến một cuộc sống tốt đẹp hơn.
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};

export default AboutPage;
