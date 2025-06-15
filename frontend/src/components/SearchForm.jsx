import React from "react";
import { Box, TextField, Button, MenuItem } from "@mui/material";

const SearchForm = () => {
  return (
    <Box
      sx={{
        backgroundColor: "white",
        borderRadius: "10px",
        padding: "20px",
        display: "flex",
        gap: "10px",
        alignItems: "center",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
      }}
    >
      <TextField
        label="Địa điểm"
        select
        variant="outlined"
        fullWidth
        sx={{ minWidth: "200px" }}
      >
        <MenuItem value="TP. Hồ Chí Minh">TP. Hồ Chí Minh</MenuItem>
        <MenuItem value="Hà Nội">Hà Nội</MenuItem>
        <MenuItem value="Đà Nẵng">Đà Nẵng</MenuItem>
      </TextField>
      <TextField
        label="Thời gian thuê"
        type="datetime-local"
        variant="outlined"
        fullWidth
        InputLabelProps={{ shrink: true }}
      />
      <Button variant="contained" color="primary" sx={{ padding: "10px 20px" }}>
        Tìm Xe
      </Button>
    </Box>
  );
};

export default SearchForm;
