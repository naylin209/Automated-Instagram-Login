'use client'

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ThemeProvider, CssBaseline, CircularProgress, Box, Typography, Paper, Container, Grid, Card, CardContent } from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import Layout from '../../components/Layout';
import theme from '../../theme/theme';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import PeopleIcon from '@mui/icons-material/People';
import ChatIcon from '@mui/icons-material/Chat';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { supabase } from '../../lib/supabase';

export default function AdminDashboardPage() {
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
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Typography variant="h4" gutterBottom>
            Admin Dashboard
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <AnalyticsIcon color="primary" sx={{ mr: 1 }} />
                    <Typography variant="h6">Total Users</Typography>
                  </Box>
                  <Typography variant="h4" color="primary">
                    1,234
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    +12% from last month
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <ChatIcon color="secondary" sx={{ mr: 1 }} />
                    <Typography variant="h6">Total Chats</Typography>
                  </Box>
                  <Typography variant="h4" color="secondary">
                    5,678
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    +8% from last month
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <PeopleIcon color="success" sx={{ mr: 1 }} />
                    <Typography variant="h6">Active Users</Typography>
                  </Box>
                  <Typography variant="h4" color="success.main">
                    892
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    +15% from last month
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <TrendingUpIcon color="info" sx={{ mr: 1 }} />
                    <Typography variant="h6">Growth Rate</Typography>
                  </Box>
                  <Typography variant="h4" color="info.main">
                    23%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    +5% from last month
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Recent Activity
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Admin dashboard features will be implemented soon.
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Layout>
    </ThemeProvider>
  );
} 