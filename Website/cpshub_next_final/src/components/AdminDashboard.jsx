import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Grid,
  Paper,
  List,
  ListItem,
  ListItemText,
  Chip,
  LinearProgress,
  IconButton
} from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import ChatIcon from '@mui/icons-material/Chat';
import MessageIcon from '@mui/icons-material/Message';
import ApiIcon from '@mui/icons-material/Api';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TopicIcon from '@mui/icons-material/Topic';
import SpeedIcon from '@mui/icons-material/Speed';
import RefreshIcon from '@mui/icons-material/Refresh';
import { getAnalytics } from '../services/analytics';

const StatsCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.2s, box-shadow 0.2s',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[8],
  }
}));

const MetricValue = styled(Typography)(({ theme }) => ({
  fontSize: '2.5rem',
  fontWeight: 700,
  color: theme.palette.primary.main,
  lineHeight: 1.2,
}));

const TopicBar = ({ topic, count, maxCount, color }) => {
  const percentage = maxCount > 0 ? (count / maxCount) * 100 : 0;
  
  return (
    <Box sx={{ mb: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
        <Typography variant="body2" fontWeight="medium">
          {topic}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {count}
        </Typography>
      </Box>
      <LinearProgress 
        variant="determinate" 
        value={percentage} 
        sx={{ 
          height: 8, 
          borderRadius: 4,
          backgroundColor: 'grey.200',
          '& .MuiLinearProgress-bar': {
            backgroundColor: color,
            borderRadius: 4,
          }
        }}
      />
    </Box>
  );
};

function AdminDashboard() {
  const theme = useTheme();
  const router = useRouter();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadAnalytics = () => {
    setLoading(true);
    setTimeout(() => {
      const data = getAnalytics();
      setAnalytics(data);
      setLoading(false);
    }, 500);
  };

  useEffect(() => {
    loadAnalytics();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(loadAnalytics, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading || !analytics) {
    return (
      <Box sx={{ p: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <Typography variant="h6">Loading analytics...</Typography>
      </Box>
    );
  }

  const topicColors = [
    theme.palette.primary.main,
    theme.palette.secondary.main,
    theme.palette.project.main,
    theme.palette.people.main,
    theme.palette.product.main,
    theme.palette.info.main
  ];

  const maxTopicCount = Math.max(...Object.values(analytics.topicAnalysis));

  return (
    <Box sx={{ p: 3, maxWidth: 1400, margin: '0 auto' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <AnalyticsIcon sx={{ fontSize: 32, color: theme.palette.primary.main, mr: 1 }} />
          <Typography variant="h4" fontWeight="bold">
            Admin Dashboard
          </Typography>
        </Box>
        <IconButton onClick={loadAnalytics} color="primary">
          <RefreshIcon />
        </IconButton>
      </Box>

      {/* Key Metrics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard>
            <CardContent sx={{ textAlign: 'center' }}>
              <ChatIcon sx={{ fontSize: 40, color: theme.palette.primary.main, mb: 1 }} />
              <MetricValue>{analytics.totalChats}</MetricValue>
              <Typography color="text.secondary">Total Chats</Typography>
            </CardContent>
          </StatsCard>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard>
            <CardContent sx={{ textAlign: 'center' }}>
              <MessageIcon sx={{ fontSize: 40, color: theme.palette.secondary.main, mb: 1 }} />
              <MetricValue>{analytics.totalMessages}</MetricValue>
              <Typography color="text.secondary">Total Messages</Typography>
            </CardContent>
          </StatsCard>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard>
            <CardContent sx={{ textAlign: 'center' }}>
              <ApiIcon sx={{ fontSize: 40, color: theme.palette.project.main, mb: 1 }} />
              <MetricValue>{analytics.totalApiCalls}</MetricValue>
              <Typography color="text.secondary">API Calls</Typography>
            </CardContent>
          </StatsCard>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard>
            <CardContent sx={{ textAlign: 'center' }}>
              <TrendingUpIcon sx={{ fontSize: 40, color: theme.palette.people.main, mb: 1 }} />
              <MetricValue>{analytics.avgMessagesPerChat}</MetricValue>
              <Typography color="text.secondary">Avg Messages/Chat</Typography>
            </CardContent>
          </StatsCard>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Topic Analysis */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '400px' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <TopicIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
                <Typography variant="h6" fontWeight="bold">
                  Popular Construction Topics
                </Typography>
              </Box>
              
              {Object.entries(analytics.topicAnalysis)
                .sort(([,a], [,b]) => b - a)
                .map(([topic, count], index) => (
                  <TopicBar
                    key={topic}
                    topic={topic}
                    count={count}
                    maxCount={maxTopicCount}
                    color={topicColors[index % topicColors.length]}
                  />
                ))}
            </CardContent>
          </Card>
        </Grid>

        {/* Engagement Metrics */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '400px' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <SpeedIcon sx={{ mr: 1, color: theme.palette.secondary.main }} />
                <Typography variant="h6" fontWeight="bold">
                  Engagement & Performance
                </Typography>
              </Box>
              
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'primary.light', color: 'primary.contrastText' }}>
                    <Typography variant="h4" fontWeight="bold">
                      {analytics.engagementMetrics.avgConversationLength}
                    </Typography>
                    <Typography variant="body2">
                      Avg Conversation Length
                    </Typography>
                  </Paper>
                </Grid>
                
                <Grid item xs={6}>
                  <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'secondary.light', color: 'secondary.contrastText' }}>
                    <Typography variant="h4" fontWeight="bold">
                      {(analytics.engagementMetrics.avgResponseTime / 1000).toFixed(1)}s
                    </Typography>
                    <Typography variant="body2">
                      Avg Response Time
                    </Typography>
                  </Paper>
                </Grid>
                
                <Grid item xs={6}>
                  <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'success.light', color: 'success.contrastText' }}>
                    <Typography variant="h4" fontWeight="bold">
                      {analytics.engagementMetrics.longConversations}
                    </Typography>
                    <Typography variant="body2">
                      Long Conversations (10+ msgs)
                    </Typography>
                  </Paper>
                </Grid>
                
                <Grid item xs={6}>
                  <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'warning.light', color: 'warning.contrastText' }}>
                    <Typography variant="h4" fontWeight="bold">
                      {analytics.engagementMetrics.shortConversations}
                    </Typography>
                    <Typography variant="body2">
                      Quick Chats (≤3 msgs)
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Activity */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                Recent Chat Activity
              </Typography>
              
              {analytics.recentActivity.length > 0 ? (
                <List>
                  {analytics.recentActivity.map((activity, index) => (
                    <ListItem 
                      key={activity.id}
                      sx={{ 
                        bgcolor: index % 2 === 0 ? 'grey.50' : 'transparent',
                        borderRadius: 1,
                        mb: 1,
                        cursor: 'pointer',
                        '&:hover': { bgcolor: 'action.hover' }
                      }}
                      onClick={() => route.push(`/chat/${activity.id}`)}
                    >
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Typography variant="subtitle1" fontWeight="medium">
                              {activity.title}
                            </Typography>
                            <Chip 
                              label={`${activity.messageCount} messages`} 
                              size="small" 
                              color="primary" 
                              variant="outlined"
                            />
                          </Box>
                        }
                        secondary={`Last active: ${activity.lastActive}`}
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                  No recent activity
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default AdminDashboard;