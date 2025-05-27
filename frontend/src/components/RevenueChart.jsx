import React, { useState } from 'react';
import {
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
    Bar,
    ComposedChart
} from 'recharts';
import { Box, Typography, Paper, ToggleButton, ToggleButtonGroup, Card, Divider } from '@mui/material';
import { formatNumberToVND } from '../utils/format';

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        return (
            <Paper 
                elevation={3} 
                sx={{ 
                    p: 2, 
                    bgcolor: 'background.paper',
                    border: '1px solid',
                    borderColor: 'primary.light',
                    borderRadius: 1
                }}
            >
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1, color: 'primary.main' }}>
                    {`Tháng ${label}`}
                </Typography>
                <Divider sx={{ mb: 1 }} />
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ color: 'primary.main', fontWeight: 500 }}>
                        Doanh thu: {formatNumberToVND(data.revenue)}
                    </Typography>
                    <Typography sx={{ color: 'success.main' }}>
                        Doanh thu gốc: {formatNumberToVND(data.originalRevenue)}
                    </Typography>
                    <Typography sx={{ color: 'error.main' }}>
                        Giảm giá: {formatNumberToVND(data.discountTotal)}
                    </Typography>
                    <Divider sx={{ my: 0.5 }} />
                    <Typography>
                        <b>Số lượt thuê:</b> {data.totalRentals} lượt
                    </Typography>
                    <Typography>
                        <b>Thời gian thuê TB:</b> {data.averageRentalDuration.toFixed(1)} ngày
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 0.5, color: 'text.secondary' }}>
                        <b>Các loại xe:</b><br />
                        {data.carTypes.map(car => car.carName).join(', ')}
                    </Typography>
                </Box>
            </Paper>
        );
    }
    return null;
};

const RevenueChart = ({ data }) => {
    const [chartType, setChartType] = useState('revenue');

    const handleChartTypeChange = (event, newType) => {
        if (newType !== null) {
            setChartType(newType);
        }
    };

    // Calculate totals
    const totals = data.reduce((acc, curr) => ({
        revenue: (acc.revenue || 0) + curr.revenue,
        totalRentals: (acc.totalRentals || 0) + curr.totalRentals,
        avgDuration: (acc.avgDuration || 0) + curr.averageRentalDuration
    }), {});
    totals.avgDuration = totals.avgDuration / data.length;

    return (
        <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
            <Box sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom align="center" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                    {chartType === 'revenue' ? 'Biểu Đồ Doanh Thu' : 
                     chartType === 'rentals' ? 'Thống Kê Lượt Thuê Xe' : 
                     'Thời Gian Thuê Trung Bình'}
                </Typography>
                <Divider sx={{ mb: 2 }} />
                
                {/* Summary Cards */}
                <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
                    <Card sx={{ flex: 1, p: 2, minWidth: 200, bgcolor: 'primary.light', color: 'white' }}>
                        <Typography variant="subtitle2">Tổng doanh thu</Typography>
                        <Typography variant="h6">{formatNumberToVND(totals.revenue)}</Typography>
                    </Card>
                    <Card sx={{ flex: 1, p: 2, minWidth: 200, bgcolor: 'success.light', color: 'white' }}>
                        <Typography variant="subtitle2">Tổng lượt thuê</Typography>
                        <Typography variant="h6">{totals.totalRentals} lượt</Typography>
                    </Card>
                    <Card sx={{ flex: 1, p: 2, minWidth: 200, bgcolor: 'info.light', color: 'white' }}>
                        <Typography variant="subtitle2">Thời gian thuê TB</Typography>
                        <Typography variant="h6">{totals.avgDuration.toFixed(1)} ngày</Typography>
                    </Card>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <ToggleButtonGroup
                        value={chartType}
                        exclusive
                        onChange={handleChartTypeChange}
                        color="primary"
                        size="small"
                        sx={{
                            '& .MuiToggleButton-root': {
                                px: 3,
                                py: 1,
                                borderRadius: '4px !important',
                                mx: 0.5,
                                '&.Mui-selected': {
                                    bgcolor: 'primary.main',
                                    color: 'white',
                                    '&:hover': {
                                        bgcolor: 'primary.dark',
                                    },
                                },
                            },
                        }}
                    >
                        <ToggleButton value="revenue">Doanh thu</ToggleButton>
                        <ToggleButton value="rentals">Số lượt thuê</ToggleButton>
                        <ToggleButton value="duration">Thời gian thuê</ToggleButton>
                    </ToggleButtonGroup>
                </Box>
            </Box>

            <ResponsiveContainer width="100%" height={500}>                <ComposedChart
                    data={data}
                    margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 20,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                    <XAxis 
                        dataKey="month" 
                        tick={{ fill: '#666' }}
                        axisLine={{ stroke: '#ccc' }}
                    />
                    <YAxis 
                        yAxisId="left"
                        tick={{ fill: '#666' }}
                        axisLine={{ stroke: '#ccc' }}
                        tickFormatter={value => 
                            chartType === 'revenue' 
                                ? `${(value / 1000000).toFixed(0)}M` 
                                : value
                        }
                    />
                    <YAxis 
                        yAxisId="right" 
                        orientation="right"
                        tick={{ fill: '#666' }}
                        axisLine={{ stroke: '#ccc' }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend 
                        wrapperStyle={{
                            paddingTop: '20px'
                        }}
                    />

                    {chartType === 'revenue' && (
                        <>
                            <Area
                                yAxisId="left"
                                type="monotone"
                                dataKey="originalRevenue"
                                name="Doanh thu gốc"
                                stroke="#4caf50"
                                fill="#4caf50"
                                fillOpacity={0.2}
                                strokeWidth={2}
                            />
                            <Area
                                yAxisId="left"
                                type="monotone"
                                dataKey="revenue"
                                name="Doanh thu thực"
                                stroke="#2196f3"
                                fill="#2196f3"
                                fillOpacity={0.2}
                                strokeWidth={2}
                            />
                            <Bar
                                yAxisId="right"
                                dataKey="discountTotal"
                                name="Giảm giá"
                                fill="#f44336"
                                fillOpacity={0.8}
                            />
                        </>
                    )}

                    {chartType === 'rentals' && (
                        <Bar
                            yAxisId="left"
                            dataKey="totalRentals"
                            name="Số lượt thuê"
                            fill="#2196f3"
                            radius={[4, 4, 0, 0]}
                        />
                    )}

                    {chartType === 'duration' && (
                        <Area
                            yAxisId="left"
                            type="monotone"
                            dataKey="averageRentalDuration"
                            name="Thời gian thuê TB (ngày)"
                            stroke="#9c27b0"
                            fill="#9c27b0"
                            fillOpacity={0.2}
                            strokeWidth={2}
                        />                    )}
                </ComposedChart>
            </ResponsiveContainer>

            {/* Legend explanation */}
            <Box sx={{ mt: 3, px: 2 }}>
                <Typography variant="body2" color="text.secondary" align="center">
                    * Hover chuột lên biểu đồ để xem chi tiết. Số liệu doanh thu được hiển thị theo đơn vị triệu đồng (M).
                </Typography>
            </Box>
        </Paper>
    );
};

export default RevenueChart;
