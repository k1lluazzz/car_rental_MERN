import React, { useState } from "react";
import {
  Box,
  Typography,
  Rating,
  Avatar,
  Stack,
  Paper,
  Divider,
  CircularProgress,
  Pagination,
} from "@mui/material";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";

const CarReviews = ({ reviews = [], loading = false }) => {
  const [page, setPage] = useState(1);
  const reviewsPerPage = 5;

  // Tính toán số trang
  const totalPages = Math.ceil(reviews.length / reviewsPerPage);

  // Lấy reviews cho trang hiện tại
  const currentReviews = reviews.slice(
    (page - 1) * reviewsPerPage,
    page * reviewsPerPage
  );

  const handlePageChange = (event, value) => {
    setPage(value);
    // Scroll lên đầu phần reviews
    document
      .getElementById("reviews-section")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!reviews.length) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Typography color="text.secondary">
          Chưa có đánh giá nào cho xe này
        </Typography>
      </Box>
    );
  }

  return (
    <Stack spacing={2} id="reviews-section">
      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle2" color="text.secondary">
          Hiển thị {Math.min(page * reviewsPerPage, reviews.length)} /{" "}
          {reviews.length} đánh giá
        </Typography>
      </Box>

      {currentReviews.map((review, index) => (
        <Paper
          key={index}
          elevation={0}
          sx={{
            p: 2,
            bgcolor: "background.default",
            "&:hover": {
              bgcolor: "background.paper",
              transition: "background-color 0.3s",
            },
          }}
        >
          <Stack direction="row" spacing={2} alignItems="flex-start">
            <Avatar
              src={review.user?.avatar}
              alt={review.user?.name}
              sx={{ width: 40, height: 40 }}
            >
              {review.user?.name?.charAt(0)}
            </Avatar>
            <Box sx={{ flexGrow: 1 }}>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography variant="subtitle1" fontWeight="medium">
                  {review.user?.name || "Khách hàng"}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {formatDistanceToNow(new Date(review.date), {
                    addSuffix: true,
                    locale: vi,
                  })}
                </Typography>
              </Stack>
              <Rating
                value={review.rating}
                readOnly
                size="small"
                sx={{ my: 1 }}
              />
              {review.comment && (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 1 }}
                >
                  {review.comment}
                </Typography>
              )}
            </Box>
          </Stack>
        </Paper>
      ))}

      {/* Phân trang */}
      {totalPages > 1 && (
        <Box
          sx={{
            mt: 3,
            display: "flex",
            justifyContent: "center",
            "& .MuiPagination-ul": {
              justifyContent: "center",
            },
          }}
        >
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            color="primary"
            size="large"
            showFirstButton
            showLastButton
            sx={{
              "& .MuiPaginationItem-root": {
                fontSize: "1rem",
              },
            }}
          />
        </Box>
      )}
    </Stack>
  );
};

export default CarReviews;
