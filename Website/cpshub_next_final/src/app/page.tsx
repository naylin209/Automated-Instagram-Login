'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Paper,
} from '@mui/material';
import {
  Engineering,
  Analytics,
  Security,
  Speed,
  Groups,
  SmartToy,
} from '@mui/icons-material';
import { useAuth } from '@/contexts/AuthContext';

const features = [
  {
    icon: <SmartToy sx={{ fontSize: 40 }} />,
    title: 'AI-Powered Assistant',
    description: 'Get responses tailored specifically for your construction needs',
  },
  {
    icon: <Engineering sx={{ fontSize: 40 }} />,
    title: 'Construction Expertise',
    description: 'Specialized knowledge in materials, regulations, and best practices',
  },
  {
    icon: <Analytics sx={{ fontSize: 40 }} />,
    title: 'Project Insights',
    description: 'Smart analytics and recommendations for your construction projects',
  },
  {
    icon: <Security sx={{ fontSize: 40 }} />,
    title: 'Secure & Reliable',
    description: 'Enterprise-grade security for your sensitive project data',
  },
  {
    icon: <Speed sx={{ fontSize: 40 }} />,
    title: 'Lightning Fast',
    description: 'Get answers in seconds, not hours. Boost your productivity instantly',
  },
  {
    icon: <Groups sx={{ fontSize: 40 }} />,
    title: 'Team Collaboration',
    description: 'Share insights and collaborate with your construction team seamlessly',
  },
];

export default function LandingPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      {/* Header */}
      <Paper 
        elevation={0} 
        sx={{ 
          borderRadius: 0,
          backgroundColor: 'white',
          borderBottom: '1px solid #e2e8f0'
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            py: 2 
          }}>
            <Typography variant="h5" fontWeight={600}>
              <span style={{ color: '#139ED5' }}>CPS</span>
              <span style={{ color: '#F22613' }}>Hub</span>
              <sup style={{ fontSize: '0.7rem' }}>®</sup>
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button 
                variant="outlined" 
                onClick={() => router.push('/auth/login')}
              >
                Login
              </Button>
              <Button 
                variant="contained" 
                onClick={() => router.push('/auth/signup')}
              >
                Sign Up
              </Button>
            </Box>
          </Box>
        </Container>
      </Paper>

      {/* Hero Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography 
            variant="h2" 
            fontWeight={600} 
            sx={{ mb: 3, fontSize: { xs: '2.5rem', md: '3.5rem' } }}
          >
            CPSHub.ai
          </Typography>
          
          <Typography 
            variant="h6" 
            sx={{ 
              mb: 4, 
              color: 'text.secondary',
              maxWidth: 700, 
              mx: 'auto',
              fontSize: { xs: '1.1rem', md: '1.25rem' }
            }}
          >
            Get AI responses tailored specifically for your construction needs. 
            Expert insights, intelligent recommendations, and instant answers for your construction projects.
          </Typography>

          <Button 
            variant="contained" 
            size="large" 
            onClick={() => router.push('/auth/signup')}
            sx={{ mb: 4, px: 4, py: 1.5 }}
          >
            Get Started Free
          </Button>

          <Typography variant="body2" color="text.secondary">
            Trusted by construction professionals worldwide
          </Typography>
        </Box>

        {/* Features Section */}
        <Box sx={{ mb: 8 }}>
          <Typography 
            variant="h4" 
            textAlign="center" 
            fontWeight={600} 
            sx={{ mb: 2 }}
          >
            Why Choose CPSHub?
          </Typography>
          
          <Typography 
            variant="body1" 
            textAlign="center" 
            color="text.secondary"
            sx={{ mb: 6, maxWidth: 600, mx: 'auto' }}
          >
            Powerful AI tools designed specifically for the construction industry
          </Typography>
          
          <Grid container spacing={3}>
            {features.map((feature, index) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
                <Card sx={{ height: '100%', textAlign: 'center' }}>
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ 
                      color: 'primary.main', 
                      mb: 2,
                      display: 'flex',
                      justifyContent: 'center'
                    }}>
                      {feature.icon}
                    </Box>
                    <Typography variant="h6" fontWeight={600} gutterBottom>
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* CTA Section */}
        <Paper sx={{ p: 6, textAlign: 'center', borderRadius: 3 }}>
          <Typography variant="h4" fontWeight={600} gutterBottom>
            Ready to Transform Your Construction Projects?
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Join professionals using CPSHub to make smarter decisions with AI-powered construction intelligence.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button 
              variant="contained" 
              size="large"
              onClick={() => router.push('/auth/signup')}
            >
              Start Building Smarter
            </Button>
            <Button 
              variant="outlined" 
              size="large"
            >
              Learn More
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}