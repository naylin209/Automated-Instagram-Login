'use client';

import { Container, Typography, Button, Box } from '@mui/material';
import { Home } from '@mui/icons-material';
import Link from 'next/link';

export default function NotFound() {
  return (
    <Container maxWidth="sm">
      <Box sx={{ 
        minHeight: '100vh', 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center', 
        justifyContent: 'center',
        textAlign: 'center',
        py: 4
      }}>
        <Typography variant="h1" color="primary" sx={{ fontSize: '6rem', fontWeight: 'bold' }}>
          404
        </Typography>
        <Typography variant="h4" gutterBottom>
          Page Not Found
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          The page you&apos;re looking for doesn&apos;t exist.
        </Typography>
        <Button
          component={Link}
          href="/"
          variant="contained"
          startIcon={<Home />}
          size="large"
        >
          Go Home
        </Button>
      </Box>
    </Container>
  );
}