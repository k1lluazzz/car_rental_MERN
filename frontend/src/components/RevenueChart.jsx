import React, { useState } from "react";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Bar,
  ComposedChart,
} from "recharts";
import { Box, Typography, Paper, Card, Divider, Button } from "@mui/material";
import { formatNumberToVND } from "../utils/format";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import * as XLSX from "xlsx";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <Paper
        elevation={3}
        sx={{
          p: 2,
          bgcolor: "background.paper",
          border: "1px solid",
          borderColor: "primary.light",
          borderRadius: 1,
        }}
      >
        <Typography
          variant="subtitle1"
          sx={{ fontWeight: "bold", mb: 1, color: "primary.main" }}
        >
          {`Tháng ${label}`}
        </Typography>
        <Divider sx={{ mb: 1 }} />
        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
          <Typography sx={{ color: "primary.main", fontWeight: 500 }}>
            Doanh thu thực: {formatNumberToVND(data.revenue)}
          </Typography>
          <Typography sx={{ color: "success.main" }}>
            Doanh thu gốc: {formatNumberToVND(data.originalRevenue)}
          </Typography>
          <Typography sx={{ color: "error.main" }}>
            Tổng giảm giá: {formatNumberToVND(data.discountTotal)}
          </Typography>
          <Divider sx={{ my: 0.5 }} />
          <Typography>
            <b>Số lượt thuê:</b> {data.totalRentals} lượt
          </Typography>
          <Typography>
            <b>Thời gian thuê TB:</b> {data.averageRentalDuration.toFixed(1)}{" "}
            ngày
          </Typography>
        </Box>
      </Paper>
    );
  }
  return null;
};

const RevenueChart = ({ data }) => {
  // Calculate totals
  const totals = data.reduce(
    (acc, curr) => ({
      revenue: (acc.revenue || 0) + curr.revenue,
      originalRevenue: (acc.originalRevenue || 0) + curr.originalRevenue,
      discountTotal: (acc.discountTotal || 0) + curr.discountTotal,
      totalRentals: (acc.totalRentals || 0) + curr.totalRentals,
      avgDuration: (acc.avgDuration || 0) + curr.averageRentalDuration,
    }),
    {}
  );
  totals.avgDuration = totals.avgDuration / data.length;

  const handleExportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(
      data.map((item) => ({
        Tháng: item.month,
        "Doanh thu thực": item.revenue,
        "Doanh thu gốc": item.originalRevenue,
        "Tổng giảm giá": item.discountTotal,
        "Số lượt thuê": item.totalRentals,
        "Thời gian thuê TB (ngày)": item.averageRentalDuration.toFixed(1),
        "Các loại xe": item.carTypes
          .map((car) => `${car.carName} (${car.brand})`)
          .join(", "),
      }))
    );

    // Add totals row
    XLSX.utils.sheet_add_json(
      ws,
      [
        {
          Tháng: "TỔNG CỘNG",
          "Doanh thu thực": totals.revenue,
          "Doanh thu gốc": totals.originalRevenue,
          "Tổng giảm giá": totals.discountTotal,
          "Số lượt thuê": totals.totalRentals,
          "Thời gian thuê TB (ngày)": totals.avgDuration.toFixed(1),
        },
      ],
      { skipHeader: true, origin: -1 }
    );

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Báo cáo doanh thu");
    XLSX.writeFile(
      wb,
      `Bao_cao_doanh_thu_${new Date().toISOString().split("T")[0]}.xlsx`
    );
  };

  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography
          variant="h6"
          sx={{ fontWeight: "bold", color: "primary.main" }}
        >
          Thống kê doanh thu
        </Typography>
        <Button
          variant="outlined"
          startIcon={<FileDownloadIcon />}
          onClick={handleExportExcel}
        >
          Xuất Excel
        </Button>
      </Box>

      {/* Summary Cards */}
      <Box
        sx={{
          display: "grid",
          gap: 2,
          mb: 4,
          gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "1fr 1fr 1fr" },
        }}
      >
        <Card
          sx={{
            p: 2.5,
            bgcolor: "#e3f2fd",
            boxShadow: 3,
            borderLeft: 6,
            borderColor: "primary.main",
          }}
        >
          <Typography variant="subtitle2" color="primary" gutterBottom>
            DOANH THU THỰC
          </Typography>
          <Typography
            variant="h5"
            color="primary.dark"
            sx={{ fontWeight: "bold" }}
          >
            {formatNumberToVND(totals.revenue)}
          </Typography>
          <Typography
            variant="caption"
            color="text.secondary"
            display="block"
            sx={{ mt: 1 }}
          >
            Sau khi trừ giảm giá
          </Typography>
        </Card>
        <Card
          sx={{
            p: 2.5,
            bgcolor: "#e8f5e9",
            boxShadow: 3,
            borderLeft: 6,
            borderColor: "success.main",
          }}
        >
          <Typography variant="subtitle2" color="success.main" gutterBottom>
            DOANH THU GỐC
          </Typography>
          <Typography
            variant="h5"
            color="success.dark"
            sx={{ fontWeight: "bold" }}
          >
            {formatNumberToVND(totals.originalRevenue)}
          </Typography>
          <Typography
            variant="caption"
            color="text.secondary"
            display="block"
            sx={{ mt: 1 }}
          >
            Trước khi áp dụng giảm giá
          </Typography>
        </Card>
        <Card
          sx={{
            p: 2.5,
            bgcolor: "#ffebee",
            boxShadow: 3,
            borderLeft: 6,
            borderColor: "error.main",
          }}
        >
          <Typography variant="subtitle2" color="error.main" gutterBottom>
            TỔNG GIẢM GIÁ
          </Typography>
          <Typography
            variant="h5"
            color="error.dark"
            sx={{ fontWeight: "bold" }}
          >
            {formatNumberToVND(totals.discountTotal)}
          </Typography>
          <Typography
            variant="caption"
            color="text.secondary"
            display="block"
            sx={{ mt: 1 }}
          >
            {((totals.discountTotal / totals.originalRevenue) * 100).toFixed(1)}
            % doanh thu gốc
          </Typography>
        </Card>
      </Box>

      {/* Biểu đồ Doanh thu gốc và thực */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Typography
          variant="subtitle1"
          sx={{ mb: 2, fontWeight: "bold", color: "primary.main" }}
        >
          Biểu đồ doanh thu gốc và thực tế
        </Typography>
        <ResponsiveContainer width="100%" height={300}>
          <ComposedChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#eee"
              vertical={false}
            />
            <XAxis dataKey="month" tick={{ fill: "#666", fontSize: 12 }} />
            <YAxis
              tick={{ fill: "#666", fontSize: 12 }}
              tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
              label={{
                value: "Doanh thu (VNĐ)",
                angle: -90,
                position: "insideLeft",
                style: { textAnchor: "middle", fill: "#666" },
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar
              dataKey="originalRevenue"
              name="Doanh thu gốc"
              fill="#81c784"
              strokeWidth={0}
              barSize={30}
              radius={[3, 3, 0, 0]}
            />
            <Bar
              dataKey="revenue"
              name="Doanh thu thực"
              fill="#64b5f6"
              strokeWidth={0}
              barSize={30}
              radius={[3, 3, 0, 0]}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </Paper>

      {/* Biểu đồ Giảm giá */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Typography
          variant="subtitle1"
          sx={{ mb: 2, fontWeight: "bold", color: "error.main" }}
        >
          Biểu đồ giảm giá theo tháng
        </Typography>
        <ResponsiveContainer width="100%" height={300}>
          <ComposedChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#eee"
              vertical={false}
            />
            <XAxis dataKey="month" tick={{ fill: "#666", fontSize: 12 }} />
            <YAxis
              tick={{ fill: "#666", fontSize: 12 }}
              tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
              label={{
                value: "Giảm giá (VNĐ)",
                angle: -90,
                position: "insideLeft",
                style: { textAnchor: "middle", fill: "#666" },
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar
              dataKey="discountTotal"
              name="Tổng giảm giá"
              fill="#d32f2f"
              fillOpacity={0.6}
              radius={[3, 3, 0, 0]}
              barSize={30}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </Paper>

      {/* Biểu đồ Số lượt thuê */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Typography
          variant="subtitle1"
          sx={{ mb: 2, fontWeight: "bold", color: "info.main" }}
        >
          Biểu đồ số lượt thuê xe theo tháng
        </Typography>
        <ResponsiveContainer width="100%" height={300}>
          <ComposedChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#eee"
              vertical={false}
            />
            <XAxis dataKey="month" tick={{ fill: "#666", fontSize: 12 }} />
            <YAxis
              tick={{ fill: "#666", fontSize: 12 }}
              label={{
                value: "Số lượt thuê",
                angle: -90,
                position: "insideLeft",
                style: { textAnchor: "middle", fill: "#666" },
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar
              dataKey="totalRentals"
              name="Số lượt thuê"
              fill="#2196f3"
              radius={[3, 3, 0, 0]}
              barSize={30}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </Paper>

      {/* Footer Notes */}
      <Box sx={{ bgcolor: "#f5f5f5", p: 2, borderRadius: 1 }}>
        <Typography
          variant="body2"
          color="text.secondary"
          align="center"
          sx={{ fontStyle: "italic" }}
        >
          * Hover chuột lên biểu đồ để xem chi tiết từng tháng
        </Typography>
        <Typography variant="body2" color="text.secondary" align="center">
          * Doanh thu được hiển thị theo đơn vị triệu đồng (M)
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          align="center"
          sx={{ mt: 1, color: "primary.main" }}
        >
          Bấm nút "Xuất Excel" để tải về báo cáo chi tiết đầy đủ
        </Typography>
      </Box>
    </Paper>
  );
};

export default RevenueChart;
