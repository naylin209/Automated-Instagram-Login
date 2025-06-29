'use client'

import { useRouter } from 'next/navigation';
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from '../theme/theme';
import WelcomePage from '../components/WelcomePage';

export default function HomePage() {
  const router = useRouter();

  // TEMPORARILY DISABLE AUTH CHECK FOR DEVELOPMENT
  const DISABLE_AUTH_CHECK = true; // Set to false when you want auth back

  const handleLogin = () => {
    router.push('/login');
  };

  const handleSignUp = () => {
    router.push('/signup');
  };

  if (DISABLE_AUTH_CHECK) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <WelcomePage onLogin={handleLogin} onSignUp={handleSignUp} />
      </ThemeProvider>
    );
  }

  // Your original auth logic would go here
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <WelcomePage onLogin={handleLogin} onSignUp={handleSignUp} />
    </ThemeProvider>
  );
}