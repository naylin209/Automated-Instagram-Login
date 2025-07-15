'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Tabs,
  Tab,
  LinearProgress,
} from '@mui/material';
import {
  People,
  Chat,
  TrendingUp,
  Settings,
  Save,
  History,
} from '@mui/icons-material';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/Layout/DashboardLayout';

interface AnalyticsData {
  overview: {
    totalUsers: number;
    totalChats: number;
    activeUsers: number;
    recentChats: number;
  };
  dailyStats: Array<{ date: string; chats: number }>;
  recentActivity: Array<{
    id: string;
    title: string;
    created_at: string;
    user_id: string;
  }>;
  topUsers: Array<{
    user_id: string;
    chat_count: number;
  }>;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel({ children, value, index }: TabPanelProps) {
  return (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

export default function AdminDashboard() {
  const { user, profile } = useAuth();
  const router = useRouter();
  const [tabValue, setTabValue] = useState(0);
  
  // Analytics state
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(true);
  
  // AI Instructions state
  const [instructions, setInstructions] = useState('');
  const [originalInstructions, setOriginalInstructions] = useState('');
  const [instructionsLoading, setInstructionsLoading] = useState(false);
  const [instructionsSuccess, setInstructionsSuccess] = useState('');
  const [instructionsError, setInstructionsError] = useState('');

  // Check admin access
  useEffect(() => {
    if (!user) {
      router.push('/auth/login');
      return;
    }
    
    if (profile && profile.role !== 'admin') {
      router.push('/dashboard');
      return;
    }
  }, [user, profile, router]);

  // Load analytics data
  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        const response = await fetch('/api/admin/analytics');
        if (response.ok) {
          const data = await response.json();
          setAnalytics(data);
        }
      } catch (error) {
        console.error('Failed to load analytics:', error);
      } finally {
        setAnalyticsLoading(false);
      }
    };

    loadAnalytics();
  }, []);

  // Load AI instructions
  useEffect(() => {
    const loadInstructions = async () => {
      try {
        const response = await fetch('/api/admin/instructions');
        if (response.ok) {
          const data = await response.json();
          const currentInstructions = data.instructions || '';
          setInstructions(currentInstructions);
          setOriginalInstructions(currentInstructions);
        }
      } catch (error) {
        console.error('Failed to load instructions:', error);
      }
    };

    loadInstructions();
  }, []);

  const handleInstructionsUpdate = async () => {
    setInstructionsLoading(true);
    setInstructionsError('');
    setInstructionsSuccess('');

    try {
      const response = await fetch('/api/admin/instructions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ instructions }),
      });

      if (response.ok) {
        setInstructionsSuccess('AI instructions updated successfully!');
        setOriginalInstructions(instructions);
        setTimeout(() => setInstructionsSuccess(''), 3000);
      } else {
        const error = await response.json();
        setInstructionsError(error.error || 'Failed to update instructions');
      }
    } catch (error) {
      setInstructionsError('An error occurred while updating instructions');
    } finally {
      setInstructionsLoading(false);
    }
  };

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleResetInstructions = () => {
    setInstructions(originalInstructions);
  };

  if (!user || (profile && profile.role !== 'admin')) {
    return null;
  }

  return (
    <DashboardLayout>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" fontWeight={600} gutterBottom>
          Admin Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Monitor platform usage and manage AI behavior
        </Typography>

        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab 
              label="Analytics" 
              icon={<TrendingUp />} 
              iconPosition="start"
            />
            <Tab 
              label="AI Instructions" 
              icon={<Settings />} 
              iconPosition="start"
            />
          </Tabs>
        </Box>

        {/* Analytics Tab */}
        <TabPanel value={tabValue} index={0}>
          {analyticsLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : analytics ? (
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr 1fr' }, gap: 3, mb: 3 }}>
              {/* Overview Cards */}
              <Card>
                <CardContent sx={{ textAlign: 'center' }}>
                  <People sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                  <Typography variant="h4" fontWeight={600}>
                    {analytics.overview.totalUsers}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Users
                  </Typography>
                </CardContent>
              </Card>

              <Card>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Chat sx={{ fontSize: 40, color: 'secondary.main', mb: 1 }} />
                  <Typography variant="h4" fontWeight={600}>
                    {analytics.overview.totalChats}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Chats
                  </Typography>
                </CardContent>
              </Card>

              <Card>
                <CardContent sx={{ textAlign: 'center' }}>
                  <TrendingUp sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
                  <Typography variant="h4" fontWeight={600}>
                    {analytics.overview.activeUsers}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Active Users (30d)
                  </Typography>
                </CardContent>
              </Card>

              <Card>
                <CardContent sx={{ textAlign: 'center' }}>
                  <History sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
                  <Typography variant="h4" fontWeight={600}>
                    {analytics.overview.recentChats}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Recent Chats (7d)
                  </Typography>
                </CardContent>
              </Card>
            </Box>
          ) : (
            <Typography color="text.secondary">Failed to load analytics data</Typography>
          )}
        </TabPanel>

        {/* AI Instructions Tab */}
        <TabPanel value={tabValue} index={1}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                AI Response Instructions
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Configure how the AI assistant responds to users. These instructions will be used 
                as system prompts to guide the AI&apos;s behavior and response format.
              </Typography>

              {instructionsSuccess && (
                <Alert severity="success" sx={{ mb: 3 }}>
                  {instructionsSuccess}
                </Alert>
              )}

              {instructionsError && (
                <Alert severity="error" sx={{ mb: 3 }}>
                  {instructionsError}
                </Alert>
              )}

              <TextField
                fullWidth
                multiline
                rows={12}
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                placeholder="Enter AI instructions here..."
                sx={{ mb: 3 }}
              />

              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <Button
                  variant="contained"
                  startIcon={instructionsLoading ? <CircularProgress size={20} /> : <Save />}
                  onClick={handleInstructionsUpdate}
                  disabled={instructionsLoading || instructions === originalInstructions}
                >
                  Save Instructions
                </Button>
                
                <Button
                  variant="outlined"
                  onClick={handleResetInstructions}
                  disabled={instructions === originalInstructions}
                >
                  Reset
                </Button>

                {instructions !== originalInstructions && (
                  <Chip 
                    label="Unsaved changes" 
                    color="warning" 
                    size="small" 
                  />
                )}
              </Box>
            </CardContent>
          </Card>
        </TabPanel>
      </Container>
    </DashboardLayout>
  );
}