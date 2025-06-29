'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ThemeProvider, CssBaseline, Alert, Snackbar, Box, Typography, Button } from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import theme from '../../theme/theme';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();
  const { signUp } = useAuth();

  const handleSignup = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    if (password.length < 8 || !/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/[0-9]/.test(password) || !/[^A-Za-z0-9]/.test(password)) {
      setError('Password must be at least 8 characters and include uppercase, lowercase, number, and symbol.');
      setIsLoading(false);
      return;
    }

    if (!firstName.trim() || !lastName.trim()) {
      setError('First name and last name are required.');
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await signUp(email, password);
      
      if (error) {
        setError(error.message);
      } else {
        // Insert into profiles table
        const user = data.user;
        if (user) {
          await supabase.from('profiles').insert([
            {
              id: user.id,
              first_name: firstName,
              last_name: lastName,
              profile_picture_url: '',
              role: 'user'
            }
          ]);
        }
        setSuccess('Account created successfully! Redirecting to login...');
        setTimeout(() => router.push('/login'), 1500);
      }
    } catch (error) {
      setError('An unexpected error occurred. Please try again.');
      console.error('Signup error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseError = () => {
    setError('');
  };

  const handleCloseSuccess = () => {
    setSuccess('');
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        backgroundColor: '#f5f5f5'
      }}>
        <Box sx={{
          backgroundColor: 'white',
          padding: '2rem',
          borderRadius: '8px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          width: '100%',
          maxWidth: '400px'
        }}>
          {/* CPSHub Logo Branding */}
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 3 }}>
            <Typography variant="h5" fontWeight={600}>
              <span style={{ color: theme.palette.primary.main }}>CPS</span>
              <span style={{ color: theme.palette.secondary.main }}>hub</span>
              <sup style={{ fontSize: '0.7rem' }}>®</sup>
            </Typography>
          </Box>
          <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>
            Sign Up for CPSHub.ai
          </h1>
          
          <form onSubmit={handleSignup}>
            <div style={{ marginBottom: '1rem' }}>
              <label htmlFor="firstName" style={{ display: 'block', marginBottom: '0.5rem' }}>
                First Name:
              </label>
              <input
                type="text"
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '1rem'
                }}
                required
              />
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label htmlFor="lastName" style={{ display: 'block', marginBottom: '0.5rem' }}>
                Last Name:
              </label>
              <input
                type="text"
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '1rem'
                }}
                required
              />
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label htmlFor="email" style={{ display: 'block', marginBottom: '0.5rem' }}>
                Email:
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '1rem'
                }}
                required
              />
            </div>
            
            <div style={{ marginBottom: '1rem' }}>
              <label htmlFor="password" style={{ display: 'block', marginBottom: '0.5rem' }}>
                Password:
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '1rem'
                }}
                required
              />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label htmlFor="confirmPassword" style={{ display: 'block', marginBottom: '0.5rem' }}>
                Confirm Password:
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '1rem'
                }}
                required
              />
            </div>
            
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={isLoading}
              sx={{ py: 1.5, fontSize: '1rem', fontWeight: 600 }}
            >
              {isLoading ? 'Creating Account...' : 'Sign Up'}
            </Button>
          </form>
          
          <p style={{ textAlign: 'center', marginTop: '1rem' }}>
            Already have an account?{' '}
            <Button
              onClick={() => router.push('/login')}
              variant="text"
              color="primary"
              sx={{ textTransform: 'none', fontWeight: 600 }}
            >
              Login
            </Button>
          </p>
        </Box>
      </Box>

      <Snackbar open={!!error} autoHideDuration={6000} onClose={handleCloseError}>
        <Alert onClose={handleCloseError} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
      <Snackbar open={!!success} autoHideDuration={6000} onClose={handleCloseSuccess}>
        <Alert onClose={handleCloseSuccess} severity="success" sx={{ width: '100%' }}>
          {success}
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
}