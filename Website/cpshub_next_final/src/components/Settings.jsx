import { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Switch,
  TextField,
  Button,
  Avatar,
  IconButton,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Snackbar
} from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import PersonIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock';
import NotificationsIcon from '@mui/icons-material/Notifications';
import LanguageIcon from '@mui/icons-material/Language';
import PaletteIcon from '@mui/icons-material/Palette';
import DeleteIcon from '@mui/icons-material/Delete';
import HelpIcon from '@mui/icons-material/Help';
import CloudSyncIcon from '@mui/icons-material/CloudSync';
import PhotoCamera from '@mui/icons-material/PhotoCamera';

const SettingsSection = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
}));

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

function Settings() {
  const theme = useTheme();
  const [activeSection, setActiveSection] = useState('profile');
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Mock user data
  const [userData, setUserData] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    company: 'Acme Construction',
    jobTitle: 'Project Manager',
    language: 'english',
    theme: 'light',
    notifications: {
      email: true,
      push: true,
      chat: false
    }
  });

  const handleSaveChanges = () => {
    setSnackbar({
      open: true,
      message: 'Settings saved successfully',
      severity: 'success'
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({
      ...snackbar,
      open: false
    });
  };

  const handleChange = (field, value) => {
    setUserData({
      ...userData,
      [field]: value
    });
  };

  const handleNotificationChange = (field) => {
    setUserData({
      ...userData,
      notifications: {
        ...userData.notifications,
        [field]: !userData.notifications[field]
      }
    });
  };

  const renderContent = () => {
    switch(activeSection) {
      case 'profile':
        return (
          <SettingsSection>
            <Typography variant="h6" gutterBottom>
              Profile Settings
            </Typography>
            <Divider sx={{ mb: 3 }} />
            
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, mb: 4 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mr: { sm: 4 } }}>
                <Avatar 
                  sx={{ 
                    width: 100, 
                    height: 100, 
                    mb: 2,
                    bgcolor: theme.palette.primary.main 
                  }}
                >
                  {userData.name.split(' ').map(n => n[0]).join('')}
                </Avatar>
                <Button 
                  component="label" 
                  variant="outlined" 
                  startIcon={<PhotoCamera />}
                  size="small"
                >
                  Change Photo
                  <VisuallyHiddenInput type="file" />
                </Button>
              </Box>
              
              <Box sx={{ flexGrow: 1, mt: { xs: 3, sm: 0 } }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Name"
                      value={userData.name}
                      onChange={(e) => handleChange('name', e.target.value)}
                      margin="normal"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Email"
                      value={userData.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      margin="normal"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Company"
                      value={userData.company}
                      onChange={(e) => handleChange('company', e.target.value)}
                      margin="normal"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Job Title"
                      value={userData.jobTitle}
                      onChange={(e) => handleChange('jobTitle', e.target.value)}
                      margin="normal"
                    />
                  </Grid>
                </Grid>
              </Box>
            </Box>
            
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button variant="contained" color="primary" onClick={handleSaveChanges}>
                Save Changes
              </Button>
            </Box>
          </SettingsSection>
        );
        
      case 'password':
        return (
          <SettingsSection>
            <Typography variant="h6" gutterBottom>
              Password & Security
            </Typography>
            <Divider sx={{ mb: 3 }} />
            
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Current Password"
                  type="password"
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box sx={{ height: 56 }} /> {/* Spacer */}
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="New Password"
                  type="password"
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Confirm New Password"
                  type="password"
                  margin="normal"
                />
              </Grid>
            </Grid>
            
            <Alert severity="info" sx={{ mt: 3, mb: 3 }}>
              For maximum security, use a password with at least 12 characters that includes numbers, symbols, and both uppercase and lowercase letters.
            </Alert>
            
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button variant="contained" color="primary" onClick={handleSaveChanges}>
                Update Password
              </Button>
            </Box>
          </SettingsSection>
        );
        
      case 'notifications':
        return (
          <SettingsSection>
            <Typography variant="h6" gutterBottom>
              Notification Settings
            </Typography>
            <Divider sx={{ mb: 3 }} />
            
            <List>
              <ListItem>
                <ListItemText 
                  primary="Email Notifications" 
                  secondary="Receive updates and alerts via email"
                />
                <Switch
                  edge="end"
                  checked={userData.notifications.email}
                  onChange={() => handleNotificationChange('email')}
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Push Notifications" 
                  secondary="Receive notifications in your browser"
                />
                <Switch
                  edge="end"
                  checked={userData.notifications.push}
                  onChange={() => handleNotificationChange('push')}
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Chat Notifications" 
                  secondary="Get notified about new messages and chat updates"
                />
                <Switch
                  edge="end"
                  checked={userData.notifications.chat}
                  onChange={() => handleNotificationChange('chat')}
                />
              </ListItem>
            </List>
            
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
              <Button variant="contained" color="primary" onClick={handleSaveChanges}>
                Save Preferences
              </Button>
            </Box>
          </SettingsSection>
        );
        
      case 'appearance':
        return (
          <SettingsSection>
            <Typography variant="h6" gutterBottom>
              Appearance
            </Typography>
            <Divider sx={{ mb: 3 }} />
            
            <FormControl fullWidth margin="normal">
              <InputLabel>Language</InputLabel>
              <Select
                value={userData.language}
                label="Language"
                onChange={(e) => handleChange('language', e.target.value)}
              >
                <MenuItem value="english">English</MenuItem>
                <MenuItem value="spanish">Spanish</MenuItem>
                <MenuItem value="french">French</MenuItem>
                <MenuItem value="german">German</MenuItem>
                <MenuItem value="chinese">Chinese</MenuItem>
              </Select>
            </FormControl>
            
            <FormControl fullWidth margin="normal" sx={{ mt: 3 }}>
              <InputLabel>Theme</InputLabel>
              <Select
                value={userData.theme}
                label="Theme"
                onChange={(e) => handleChange('theme', e.target.value)}
              >
                <MenuItem value="light">Light</MenuItem>
                <MenuItem value="dark">Dark</MenuItem>
                <MenuItem value="system">System Default</MenuItem>
              </Select>
            </FormControl>
            
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
              <Button variant="contained" color="primary" onClick={handleSaveChanges}>
                Apply Changes
              </Button>
            </Box>
          </SettingsSection>
        );
        
      case 'data':
        return (
          <SettingsSection>
            <Typography variant="h6" gutterBottom>
              Data & Privacy
            </Typography>
            <Divider sx={{ mb: 3 }} />
            
            <Alert severity="warning" sx={{ mb: 3 }}>
              These actions affect your account data and cannot be undone.
            </Alert>
            
            <List>
              <ListItem>
                <ListItemText 
                  primary="Download Your Data" 
                  secondary="Get a copy of all your conversations and saved information"
                />
                <Button variant="outlined" color="primary" size="small">
                  Download
                </Button>
              </ListItem>
              
              <ListItem>
                <ListItemText 
                  primary="Clear Conversation History" 
                  secondary="Delete all your past conversations with the AI assistant"
                />
                <Button variant="outlined" color="error" size="small" startIcon={<DeleteIcon />}>
                  Clear
                </Button>
              </ListItem>
              
              <ListItem>
                <ListItemText 
                  primary="Delete Account" 
                  secondary="Permanently remove your account and all associated data"
                />
                <Button variant="outlined" color="error" size="small">
                  Delete
                </Button>
              </ListItem>
            </List>
          </SettingsSection>
        );
        
      case 'support':
        return (
          <SettingsSection>
            <Typography variant="h6" gutterBottom>
              Help & Support
            </Typography>
            <Divider sx={{ mb: 3 }} />
            
            <Typography variant="body1" paragraph>
              Need help with CPShub? Our support team is ready to assist you.
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Paper sx={{ p: 2, textAlign: 'center', height: '100%' }}>
                  <HelpIcon color="primary" sx={{ fontSize: 48, mb: 1 }} />
                  <Typography variant="h6" gutterBottom>
                    Knowledge Base
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    Browse through our comprehensive guides and tutorials
                  </Typography>
                  <Button variant="outlined">Visit Knowledge Base</Button>
                </Paper>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Paper sx={{ p: 2, textAlign: 'center', height: '100%' }}>
                  <CloudSyncIcon color="primary" sx={{ fontSize: 48, mb: 1 }} />
                  <Typography variant="h6" gutterBottom>
                    Contact Support
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    Get in touch with our support team for personalized help
                  </Typography>
                  <Button variant="contained" color="primary">Contact Us</Button>
                </Paper>
              </Grid>
            </Grid>
          </SettingsSection>
        );
        
      default:
        return null;
    }
  };

  return (
    <Box sx={{ p: 3, maxWidth: 1200, margin: '0 auto' }}>
      <Typography variant="h5" gutterBottom fontWeight="medium">
        Settings
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          <Paper sx={{ mb: { xs: 3, md: 0 } }}>
            <List component="nav">
              <ListItemButton 
                selected={activeSection === 'profile'}
                onClick={() => setActiveSection('profile')}
              >
                <ListItemIcon>
                  <PersonIcon />
                </ListItemIcon>
                <ListItemText primary="Profile" />
              </ListItemButton>
              
              <ListItemButton 
                selected={activeSection === 'password'}
                onClick={() => setActiveSection('password')}
              >
                <ListItemIcon>
                  <LockIcon />
                </ListItemIcon>
                <ListItemText primary="Password & Security" />
              </ListItemButton>
              
              <ListItemButton 
                selected={activeSection === 'notifications'}
                onClick={() => setActiveSection('notifications')}
              >
                <ListItemIcon>
                  <NotificationsIcon />
                </ListItemIcon>
                <ListItemText primary="Notifications" />
              </ListItemButton>
              
              <ListItemButton 
                selected={activeSection === 'appearance'}
                onClick={() => setActiveSection('appearance')}
              >
                <ListItemIcon>
                  <PaletteIcon />
                </ListItemIcon>
                <ListItemText primary="Appearance" />
              </ListItemButton>
              
              <ListItemButton 
                selected={activeSection === 'data'}
                onClick={() => setActiveSection('data')}
              >
                <ListItemIcon>
                  <DeleteIcon />
                </ListItemIcon>
                <ListItemText primary="Data & Privacy" />
              </ListItemButton>
              
              <ListItemButton 
                selected={activeSection === 'support'}
                onClick={() => setActiveSection('support')}
              >
                <ListItemIcon>
                  <HelpIcon />
                </ListItemIcon>
                <ListItemText primary="Help & Support" />
              </ListItemButton>
            </List>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={9}>
          {renderContent()}
        </Grid>
      </Grid>
      
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity} 
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default Settings;