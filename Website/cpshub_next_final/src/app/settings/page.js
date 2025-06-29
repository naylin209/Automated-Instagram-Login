'use client'

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ThemeProvider, CssBaseline, CircularProgress, Box, Typography, Paper, Container, TextField, Button, Avatar, Snackbar, Alert, Divider } from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import Layout from '../../components/Layout';
import theme from '../../theme/theme';
import { uploadProfilePicture } from '../../services/storage';
import { supabase } from '../../lib/supabase';

export default function SettingsPage() {
  const { user, profile, loading, updateProfile, changePassword, mutateProfile } = useAuth();
  const router = useRouter();
  
  // Debug logging
  console.log('Settings page state:', { user: user?.id, profile, loading });
  
  const [editState, setEditState] = useState({
    first_name: profile?.first_name || '',
    last_name: profile?.last_name || '',
    bio: profile?.bio || '',
    profile_picture_url: profile?.profile_picture_url || '',
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isPasswordSaving, setIsPasswordSaving] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [retryCount, setRetryCount] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);
  const fileInputRef = useRef();

  // Update editState when profile changes
  useEffect(() => {
    if (profile) {
      setEditState({
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        bio: profile.bio || '',
        profile_picture_url: profile.profile_picture_url || '',
      });
    }
  }, [profile]);

  // Retry mechanism for profile fetching
  const retryFetchProfile = async () => {
    setIsRetrying(true);
    setError('');
    try {
      await mutateProfile();
      setRetryCount(prev => prev + 1);
    } catch (err) {
      setError('Failed to fetch profile. Please try again.');
    } finally {
      setIsRetrying(false);
    }
  };

  // Fallback for missing profile - try to fetch it again
  if (!loading && !profile && user) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Layout>
          <Container maxWidth="sm" sx={{ py: 4 }}>
            <Paper sx={{ p: 3, mb: 3, textAlign: 'center' }}>
              <Typography variant="h6" color="warning.main" gutterBottom>
                Profile Loading Issue
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                Your profile could not be loaded. This may be a temporary issue.
                {retryCount > 0 && ` (Attempt ${retryCount + 1})`}
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={retryFetchProfile}
                disabled={isRetrying}
                sx={{ mr: 2 }}
              >
                {isRetrying ? 'Retrying...' : 'Retry Loading Profile'}
              </Button>
              <Button
                variant="outlined"
                onClick={() => window.location.reload()}
                disabled={isRetrying}
              >
                Reload Page
              </Button>
              {isRetrying && <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}><CircularProgress size={24} /></Box>}
              {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
            </Paper>
          </Container>
        </Layout>
      </ThemeProvider>
    );
  }

  if (loading || !profile) {
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

  const handleInputChange = (e) => {
    setEditState({ ...editState, [e.target.name]: e.target.value });
  };

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccess('');
    setError('');
    try {
      const { data, error } = await updateProfile(editState);
      if (error) setError(error.message);
      else setSuccess('Profile updated successfully!');
    } catch (err) {
      setError('Failed to update profile.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleProfilePictureChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setIsSaving(true);
    setSuccess('');
    setError('');
    try {
      const publicUrl = await uploadProfilePicture(user.id, file);
      setEditState((prev) => ({ ...prev, profile_picture_url: publicUrl }));
      await updateProfile({ profile_picture_url: publicUrl });
      mutateProfile((prev) => ({ ...prev, profile_picture_url: publicUrl }));
      setSuccess('Profile picture updated!');
    } catch (err) {
      setError('Failed to upload profile picture.');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setIsPasswordSaving(true);
    setPasswordError('');
    setSuccess('');
    setError('');
    if (password !== passwordConfirm) {
      setPasswordError('Passwords do not match.');
      setIsPasswordSaving(false);
      return;
    }
    if (password.length < 8 || !/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/[0-9]/.test(password) || !/[^A-Za-z0-9]/.test(password)) {
      setPasswordError('Password must be at least 8 characters and include uppercase, lowercase, number, and symbol.');
      setIsPasswordSaving(false);
      return;
    }
    try {
      const { error } = await changePassword(password);
      if (error) setError(error.message);
      else setSuccess('Password changed successfully!');
      setPassword('');
      setPasswordConfirm('');
    } catch (err) {
      setError('Failed to change password.');
    } finally {
      setIsPasswordSaving(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Layout>
        <Container maxWidth="sm" sx={{ py: 4 }}>
          <Typography variant="h4" gutterBottom>
            Profile Settings
          </Typography>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
              <Avatar src={editState.profile_picture_url} sx={{ width: 80, height: 80, mb: 1 }} />
              <Button variant="outlined" size="small" onClick={() => fileInputRef.current.click()} disabled={isSaving}>
                Change Profile Picture
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleProfilePictureChange}
              />
            </Box>
            <form onSubmit={handleProfileSave}>
              <TextField
                label="First Name"
                name="first_name"
                value={editState.first_name}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                required
              />
              <TextField
                label="Last Name"
                name="last_name"
                value={editState.last_name}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                required
              />
              <TextField
                label="Bio / About Me"
                name="bio"
                value={editState.bio}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                multiline
                minRows={2}
                maxRows={6}
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 2 }}
                disabled={isSaving}
              >
                {isSaving ? 'Saving...' : 'Save Profile'}
              </Button>
            </form>
          </Paper>

          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Change Password
            </Typography>
            <form onSubmit={handlePasswordChange}>
              <TextField
                label="New Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                fullWidth
                margin="normal"
                required
              />
              <TextField
                label="Confirm New Password"
                type="password"
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
                fullWidth
                margin="normal"
                required
                error={!!passwordError}
                helperText={passwordError}
              />
              <Button
                type="submit"
                variant="contained"
                color="secondary"
                fullWidth
                sx={{ mt: 2 }}
                disabled={isPasswordSaving}
              >
                {isPasswordSaving ? 'Changing...' : 'Change Password'}
              </Button>
            </form>
          </Paper>
        </Container>
        <Snackbar open={!!success} autoHideDuration={6000} onClose={() => setSuccess('')}>
          <Alert onClose={() => setSuccess('')} severity="success" sx={{ width: '100%' }}>
            {success}
          </Alert>
        </Snackbar>
        <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError('')}>
          <Alert onClose={() => setError('')} severity="error" sx={{ width: '100%' }}>
            {error}
          </Alert>
        </Snackbar>
      </Layout>
    </ThemeProvider>
  );
} 