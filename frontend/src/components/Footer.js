import React from 'react';
import { Box, Grid, Typography } from '@mui/material';

const Footer = () => {
    return (
        <Box sx={{ backgroundColor: '#ffffff', padding: '40px 0' }}>
            {/* Top horizontal line */}
            <Box
                sx={{
                    borderTop: '1px solid #e0e0e0',
                    width: '100%', // Full width
                }}
            />
            <Box
                sx={{
                    padding: '40px 20px',
                    maxWidth: '1200px',
                    margin: '0 auto', // Center the content
                }}
            >
                <Grid container spacing={3}>
                    {/* Logo and Contact Section */}
                    <Grid item xs={12} sm={6} md={3}>
                        <img src="./images/logo.jpg" alt="Logo" style={{ height: '40px', marginBottom: '20px' }} />
                        <Typography variant="body1" sx={{ fontWeight: 'bold', marginBottom: '5px' }}>
                            1900 9217
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ marginBottom: '10px' }}>
                            Tổng đài hỗ trợ: 7AM - 10PM
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            contact@mioto.vn
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Gửi mail cho Mioto
                        </Typography>
                    </Grid>

                    {/* Policies Section */}
                    <Grid item xs={12} sm={6} md={3}>
                        <Typography variant="body1" sx={{ fontWeight: 'bold', marginBottom: '10px' }}>
                            Chính Sách
                        </Typography>
                        <Typography variant="body2" color="text.secondary">Chính sách và quy định</Typography>
                        <Typography variant="body2" color="text.secondary">Quy chế hoạt động</Typography>
                        <Typography variant="body2" color="text.secondary">Bảo mật thông tin</Typography>
                        <Typography variant="body2" color="text.secondary">Giải quyết tranh chấp</Typography>
                    </Grid>

                    {/* Learn More Section */}
                    <Grid item xs={12} sm={6} md={3}>
                        <Typography variant="body1" sx={{ fontWeight: 'bold', marginBottom: '10px' }}>
                            Tìm Hiểu Thêm
                        </Typography>
                        <Typography variant="body2" color="text.secondary">Hướng dẫn chung</Typography>
                        <Typography variant="body2" color="text.secondary">Hướng dẫn đặt xe</Typography>
                        <Typography variant="body2" color="text.secondary">Hướng dẫn thanh toán</Typography>
                        <Typography variant="body2" color="text.secondary">Hỏi và trả lời</Typography>
                    </Grid>

                    {/* Partners Section */}
                    <Grid item xs={12} sm={6} md={3}>
                        <Typography variant="body1" sx={{ fontWeight: 'bold', marginBottom: '10px' }}>
                            Đối Tác
                        </Typography>
                        <Typography variant="body2" color="text.secondary">Đăng ký chủ xe Mioto</Typography>
                        <Typography variant="body2" color="text.secondary">Đăng ký GPS MITRACK 4G</Typography>
                        <Typography variant="body2" color="text.secondary">Đăng ký cho thuê xe dài hạn MICAR</Typography>
                    </Grid>
                </Grid>
            </Box>
            {/* Bottom horizontal line */}
            <Box
                sx={{
                    
                    width: '100%', // Full width
                }}
            />
        </Box>
    );
};

export default Footer;
