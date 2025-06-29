import React from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Container, 
  Grid, 
  Card, 
  CardContent,
  Paper
} from '@mui/material';
import { useTheme } from '@mui/material/styles';

const WelcomePage = ({ onLogin, onSignUp }) => {
  const theme = useTheme();

  const features = [
    { 
      icon: '🤖', 
      title: 'AI-Powered Assistant', 
      desc: 'Get responses tailored specifically for your construction needs' 
    },
    { 
      icon: '🏗️', 
      title: 'Construction Expertise', 
      desc: 'Specialized knowledge in materials, regulations, and best practices' 
    },
    { 
      icon: '📈', 
      title: 'Project Insights', 
      desc: 'Smart analytics and recommendations for your construction projects' 
    },
    { 
      icon: '🔒', 
      title: 'Secure & Reliable', 
      desc: 'Enterprise-grade security for your sensitive project data' 
    },
    { 
      icon: '⚡', 
      title: 'Lightning Fast', 
      desc: 'Get answers in seconds, not hours. Boost your productivity instantly' 
    },
    { 
      icon: '👥', 
      title: 'Team Collaboration', 
      desc: 'Share insights and collaborate with your construction team seamlessly' 
    }
  ];

  return (
    <Box sx={{ backgroundColor: theme.palette.background.default, minHeight: '100vh' }}>
      {/* Header */}
      <Paper 
        elevation={1} 
        sx={{ 
          borderRadius: 0,
          backgroundColor: theme.palette.background.paper,
          borderBottom: `1px solid ${theme.palette.divider}`
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
              <span style={{ color: theme.palette.primary.main }}>CPS</span>
              <span style={{ color: theme.palette.secondary.main }}>hub</span>
              <sup style={{ fontSize: '0.7rem' }}>®</sup>
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button 
                variant="outlined" 
                onClick={onLogin}
              >
                Login
              </Button>
              <Button 
                variant="contained" 
                onClick={onSignUp}
              >
                Sign Up
              </Button>
            </Box>
          </Box>
        </Container>
      </Paper>

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        {/* Hero Section */}
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography 
            variant="h2" 
            fontWeight={600} 
            sx={{ mb: 2, color: theme.palette.text.primary }}
          >
            cpshub.ai
          </Typography>
          
          <Typography 
            variant="h6" 
            sx={{ 
              mb: 4, 
              color: theme.palette.text.secondary,
              maxWidth: 600, 
              mx: 'auto'
            }}
          >
            Get AI responses tailored specifically for your construction needs. 
            Expert insights, intelligent recommendations, and instant answers for your construction projects.
          </Typography>

          <Button 
            variant="contained" 
            size="large" 
            onClick={onSignUp}
            sx={{ mb: 4 }}
          >
            Get Started Free
          </Button>

          <Typography variant="body2" color="text.secondary">
            Trusted by 500+ construction professionals worldwide
          </Typography>
        </Box>

        {/* Image Placeholder */}
        <Paper 
          sx={{ 
            height: 300, 
            mb: 8, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            backgroundColor: theme.palette.grey[100],
            border: `2px dashed ${theme.palette.divider}`
          }}
        >
          <img
            src="https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=800&q=80"
            alt="Construction cranes and skyscrapers under construction"
            style={{ height: '100%', width: 'auto', maxWidth: '100%', objectFit: 'cover', borderRadius: 8 }}
          />
        </Paper>

        {/* Features Section */}
        <Box sx={{ mb: 8 }}>
          <Typography 
            variant="h4" 
            textAlign="center" 
            fontWeight={600} 
            sx={{ mb: 2, color: theme.palette.text.primary }}
          >
            Why Choose CPShub?
          </Typography>
          
          <Typography 
            variant="body1" 
            textAlign="center" 
            color="text.secondary"
            sx={{ mb: 6, maxWidth: 600, mx: 'auto' }}
          >
            Powerful AI tools designed specifically for the construction industry
          </Typography>
          
          <Grid container spacing={3} justifyContent="center" alignItems="stretch">
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={4} key={index} sx={{ display: 'flex' }}>
                <Card sx={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardContent sx={{ 
                    textAlign: 'center', 
                    p: 3, 
                    display: 'flex', 
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: 200,
                    flex: 1
                  }}>
                    <Box sx={{ fontSize: 40, mb: 2, color: theme.palette.primary.main }}>
                      {feature.icon}
                    </Box>
                    <Typography variant="h6" fontWeight={600} gutterBottom sx={{ textAlign: 'center' }}>
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', lineHeight: 1.5 }}>
                      {feature.desc}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Bottom CTA */}
        <Paper sx={{ p: 6, textAlign: 'center' }}>
          <Typography variant="h4" fontWeight={600} gutterBottom>
            Ready to Transform Your Construction Projects?
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Join thousands of professionals using CPShub to make smarter decisions with AI-powered construction intelligence.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button 
              variant="contained" 
              size="large"
              onClick={onSignUp}
            >
              Start Building Smarter
            </Button>
            <Button 
              variant="outlined" 
              size="large"
            >
              Contact Sales
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default WelcomePage;