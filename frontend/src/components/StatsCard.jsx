import React from "react";
import { Paper, Box, Typography } from "@mui/material";

const StatsCard = ({ title, value, icon, color }) => {
  return (
    <Paper
      sx={{
        p: 3,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderLeft: `4px solid ${color}`,
      }}
    >
      <Box>
        <Typography variant="subtitle2" color="text.secondary">
          {title}
        </Typography>
        <Typography variant="h4" sx={{ mt: 1, color }}>
          {value}
        </Typography>
      </Box>
      <Box sx={{ color }}>{icon}</Box>
    </Paper>
  );
};

export default StatsCard;
