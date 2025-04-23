import React from 'react';
import { Box, Typography, Grid } from '@mui/material';

const AboutPage = () => {
    return (
        <Box sx={{ padding: '40px 20px' }}>
            <Typography variant="h3" sx={{ fontWeight: 'bold', marginBottom: '20px', textAlign: 'center' }}>
                HDOTO - Cùng bạn đến mọi hành trình
            </Typography>
            <Grid container spacing={4} sx={{ marginBottom: '40px' }}>
                <Grid item xs={12} md={6}>
                    <Typography variant="body1" sx={{ marginBottom: '20px' }}>
                        Mỗi chuyến đi là một hành trình khám phá cuộc sống và thế giới xung quanh, là cơ hội học hỏi
                        và chinh phục những điều mới lạ của mỗi cá nhân để trở nên tốt hơn. Do đó, chất lượng trải
                        nghiệm của khách hàng là ưu tiên hàng đầu và là nguồn cảm hứng của đội ngũ MIOTO.
                    </Typography>
                    <Typography variant="body1">
                        MIOTO là nền tảng chia sẻ ô tô, sứ mệnh của chúng tôi không chỉ dừng lại ở việc kết nối chủ xe
                        và khách hàng một cách Nhanh chóng - An toàn - Tiện lợi, mà còn hướng đến việc truyền cảm
                        hứng KHÁM PHÁ những điều mới lạ đến cộng đồng qua những chuyến đi trên nền tảng của chúng tôi.
                    </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                    <img
                        src="./images/car1.jpg"
                        alt="About Mioto"
                        style={{ width: '100%', borderRadius: '10px' }}
                    />
                </Grid>
            </Grid>
            <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                    <img
                        src="./images/car2.jpg"
                        alt="Drive Explore Inspire"
                        style={{ width: '100%', borderRadius: '10px' }}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', marginBottom: '20px' }}>
                        Drive. Explore. Inspire
                    </Typography>
                    <Typography variant="body1" sx={{ marginBottom: '20px' }}>
                        Cầm lái và Khám phá thế giới đầy Cảm hứng.
                    </Typography>
                    <Typography variant="body1">
                        HDOTO đặt mục tiêu trở thành cộng đồng người dùng ô tô Văn minh & Uy tín #1 tại Việt Nam, nhằm
                        mang lại những giá trị thiết thực cho tất cả những thành viên hướng đến một cuộc sống tốt đẹp hơn.
                    </Typography>
                </Grid>
            </Grid>
        </Box>
    );
};

export default AboutPage;
