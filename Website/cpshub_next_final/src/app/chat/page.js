'use client'

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ThemeProvider, CssBaseline, CircularProgress, Box } from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import Layout from '../../components/Layout';
import MainContent from '../../components/MainContent';
import theme from '../../theme/theme';

export default function ChatPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      // Not authenticated, redirect to home
      router.push('/');
    }
  }, [user, loading, router]);

  // Show loading while checking auth
  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <CircularProgress />
      </Box>
    );
  }

  // Show loading while redirecting
  if (!user) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Layout>
        <MainContent />
      </Layout>
    </ThemeProvider>
  );
}
