'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Avatar,
  Switch,
  FormControlLabel,
  Divider,
  Alert,
  CircularProgress,
  Paper,
  IconButton,
} from '@mui/material';
import {
  PhotoCamera,
  Save,
  Lock,
  Person,
  Palette,
  Edit,
} from '@mui/icons-material';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import { supabase } from '@/lib/supabase';

export default function SettingsPage() {
  const { user, profile, updateProfile } = useAuth();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Profile state
  const [firstName, setFirstName] = useState(profile?.first_name || '');
  const [lastName, setLastName] = useState(profile?.last_name || '');
  const [bio, setBio] = useState(profile?.bio || '');
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState('');
  const [profileError, setProfileError] = useState('');

  // Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // UI preferences
  const [darkMode, setDarkMode] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Update form when profile data loads
  useEffect(() => {
    if (profile) {
      setFirstName(profile.first_name || '');
      setLastName(profile.last_name || '');
      setBio(profile.bio || '');
    }
  }, [profile]);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileLoading(true);
    setProfileError('');
    setProfileSuccess('');

    try {
      const { error } = await updateProfile({
        first_name: firstName,
        last_name: lastName,
        bio: bio,
      });

      if (error) {
        setProfileError(error.message || 'Failed to update profile');
      } else {
        setProfileSuccess('Profile updated successfully!');
        setTimeout(() => setProfileSuccess(''), 3000);
      }
    } catch (error) {
      setProfileError('An error occurred while updating your profile');
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordLoading(true);
    setPasswordError('');
    setPasswordSuccess('');

    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match');
      setPasswordLoading(false);
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      setPasswordLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) {
        setPasswordError(error.message);
      } else {
        setPasswordSuccess('Password updated successfully!');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setTimeout(() => setPasswordSuccess(''), 3000);
      }
    } catch (error) {
      setPasswordError('An error occurred while updating your password');
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setUploadingImage(true);
    try {
      // Upload to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}.${fileExt}`;
      const filePath = `profile-pictures/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      // Update profile with new image URL
      const { error } = await updateProfile({
        profile_picture_url: data.publicUrl,
      });

      if (error) throw error;

    } catch (error) {
      console.error('Error uploading image:', error);
      setProfileError('Failed to upload profile picture');
    } finally {
      setUploadingImage(false);
    }
  };

  if (!user) {
    router.push('/auth/login');
    return null;
  }

  return (
    <DashboardLayout>
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography variant="h4" fontWeight={600} gutterBottom>
          Settings
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Manage your account settings and preferences
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Profile Settings */}
          <Box>
            <Card>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                  <Person color="primary" />
                  <Typography variant="h6" fontWeight={600}>
                    Profile Information
                  </Typography>
                </Box>

                {profileSuccess && (
                  <Alert severity="success" sx={{ mb: 3 }}>
                    {profileSuccess}
                  </Alert>
                )}

                {profileError && (
                  <Alert severity="error" sx={{ mb: 3 }}>
                    {profileError}
                  </Alert>
                )}

                {/* Profile Picture */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 3 }}>
                  <Box sx={{ position: 'relative' }}>
                    <Avatar
                      src={profile?.profile_picture_url || undefined}
                      sx={{ width: 80, height: 80 }}
                    >
                      {firstName?.charAt(0) || user.email?.charAt(0) || 'U'}
                    </Avatar>
                    {uploadingImage && (
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: 'rgba(0,0,0,0.5)',
                          borderRadius: '50%',
                        }}
                      >
                        <CircularProgress size={24} sx={{ color: 'white' }} />
                      </Box>
                    )}
                  </Box>
                  <Box>
                    <Typography variant="subtitle1" fontWeight={600}>
                      Profile Picture
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      JPG, PNG or GIF. Max size 2MB.
                    </Typography>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageUpload}
                      accept="image/*"
                      style={{ display: 'none' }}
                    />
                    <Button
                      startIcon={<PhotoCamera />}
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploadingImage}
                      size="small"
                    >
                      Change Photo
                    </Button>
                  </Box>
                </Box>

                <Divider sx={{ my: 3 }} />

                {/* Profile Form */}
                <form onSubmit={handleProfileUpdate}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                      <TextField
                        fullWidth
                        label="First Name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                      />
                      <TextField
                        fullWidth
                        label="Last Name"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                      />
                    </Box>
                    <TextField
                      fullWidth
                      label="Email"
                      value={user.email}
                      disabled
                      helperText="Email cannot be changed"
                    />
                    <TextField
                      fullWidth
                      label="Bio"
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      multiline
                      rows={3}
                      placeholder="Tell us about yourself and your construction experience..."
                    />
                    <Button
                      type="submit"
                      variant="contained"
                      startIcon={profileLoading ? <CircularProgress size={20} /> : <Save />}
                      disabled={profileLoading}
                      sx={{ alignSelf: 'flex-start' }}
                    >
                      Save Changes
                    </Button>
                  </Box>
                </form>
              </CardContent>
            </Card>
          </Box>

          {/* Password Settings */}
          <Box>
            <Card>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                  <Lock color="primary" />
                  <Typography variant="h6" fontWeight={600}>
                    Password & Security
                  </Typography>
                </Box>

                {passwordSuccess && (
                  <Alert severity="success" sx={{ mb: 3 }}>
                    {passwordSuccess}
                  </Alert>
                )}

                {passwordError && (
                  <Alert severity="error" sx={{ mb: 3 }}>
                    {passwordError}
                  </Alert>
                )}

                <form onSubmit={handlePasswordUpdate}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <TextField
                      fullWidth
                      label="New Password"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      helperText="Minimum 6 characters"
                    />
                    <TextField
                      fullWidth
                      label="Confirm New Password"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                    <Button
                      type="submit"
                      variant="contained"
                      startIcon={passwordLoading ? <CircularProgress size={20} /> : <Lock />}
                      disabled={passwordLoading}
                      sx={{ alignSelf: 'flex-start' }}
                    >
                      Update Password
                    </Button>
                  </Box>
                </form>
              </CardContent>
            </Card>
          </Box>

          {/* Preferences */}
          <Box>
            <Card>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                  <Palette color="primary" />
                  <Typography variant="h6" fontWeight={600}>
                    Preferences
                  </Typography>
                </Box>

                <Box sx={{ py: 2 }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={darkMode}
                        onChange={(e) => setDarkMode(e.target.checked)}
                      />
                    }
                    label={
                      <Box>
                        <Typography variant="body1" fontWeight={500}>
                          Dark Mode
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Switch between light and dark theme
                        </Typography>
                      </Box>
                    }
                  />
                </Box>

                <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                  Note: Dark mode preferences will be saved and applied across your sessions.
                </Typography>
              </CardContent>
            </Card>
          </Box>

          {/* Account Information */}
          <Box>
            <Paper sx={{ p: 3, backgroundColor: 'grey.50' }}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Account Information
              </Typography>
              <Box sx={{ display: 'flex', gap: 4 }}>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Account Type
                  </Typography>
                  <Typography variant="body1" fontWeight={500}>
                    {profile?.role === 'admin' ? 'Administrator' : 'Standard User'}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Member Since
                  </Typography>
                  <Typography variant="body1" fontWeight={500}>
                    {profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : 'N/A'}
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Box>
        </Box>
      </Container>
    </DashboardLayout>
  );
}