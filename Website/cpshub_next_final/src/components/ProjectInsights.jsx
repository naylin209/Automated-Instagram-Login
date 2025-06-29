// ProjectInsights.jsx
import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

function ProjectInsights() {
  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Project Insights
        </Typography>
        <Typography variant="body1">
          This is the Project Insights component. Content will be added here.
        </Typography>
      </Paper>
    </Box>
  );
}

export default ProjectInsights;