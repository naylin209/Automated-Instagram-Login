'use client';

import { useState, ReactNode, memo, Suspense } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Chip,
} from '@mui/material';
import {
  Menu as MenuIcon,
  ChevronLeft,
  Chat,
  Add,
  Settings,
  Logout,
  AdminPanelSettings,
  History,
} from '@mui/icons-material';
import { useAuth } from '@/contexts/AuthContext';
import ChatList from '@/components/Chat/ChatList';

const DRAWER_WIDTH = 280;

interface DashboardLayoutProps {
  children: ReactNode;
}

interface NavItem {
  id: string;
  label: string;
  icon: ReactNode;
  path: string;
  adminOnly?: boolean;
}

const navItems: NavItem[] = [
  {
    id: 'new-chat',
    label: 'New Chat',
    icon: <Add />,
    path: '/dashboard',
  },
  {
    id: 'chat-history',
    label: 'Chat History',
    icon: <History />,
    path: '/dashboard/history',
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: <Settings />,
    path: '/dashboard/settings',
  },
  {
    id: 'admin',
    label: 'Admin Dashboard',
    icon: <AdminPanelSettings />,
    path: '/dashboard/admin',
    adminOnly: true,
  },
];

function DashboardLayoutContent({ children }: DashboardLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { user, profile, signOut } = useAuth();
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const selectedChatId = searchParams.get('chat');

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleAvatarClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSignOut = async () => {
    await signOut();
    handleMenuClose();
    router.push('/');
  };

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  const filteredNavItems = navItems.filter(item => 
    !item.adminOnly || profile?.role === 'admin'
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* App Bar */}
      <AppBar
        position="fixed"
        sx={{
          width: drawerOpen ? `calc(100% - ${DRAWER_WIDTH}px)` : '100%',
          ml: drawerOpen ? `${DRAWER_WIDTH}px` : 0,
          backgroundColor: 'background.paper',
          color: 'text.primary',
          boxShadow: 'none',
          borderBottom: '1px solid #e2e8f0',
          transition: 'width 0.3s ease, margin 0.3s ease',
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="toggle drawer"
            onClick={handleDrawerToggle}
            edge="start"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Construction AI Assistant
          </Typography>

          <IconButton onClick={handleAvatarClick} sx={{ p: 1 }}>
            <Avatar 
              src={profile?.profile_picture_url || undefined}
              sx={{ width: 32, height: 32 }}
            >
              {profile?.first_name?.charAt(0) || user?.email?.charAt(0) || 'U'}
            </Avatar>
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
            <MenuItem onClick={() => { handleNavigation('/dashboard/settings'); handleMenuClose(); }}>
              <ListItemIcon>
                <Settings fontSize="small" />
              </ListItemIcon>
              Settings
            </MenuItem>
            <MenuItem onClick={handleSignOut}>
              <ListItemIcon>
                <Logout fontSize="small" />
              </ListItemIcon>
              Sign Out
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {/* Drawer */}
      <Drawer
        variant="persistent"
        anchor="left"
        open={drawerOpen}
        sx={{
          width: DRAWER_WIDTH,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH,
            boxSizing: 'border-box',
            borderRight: '1px solid #e2e8f0',
          },
        }}
      >
        {/* Drawer Header */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          px: 2,
          py: 2,
          minHeight: 64,
        }}>
          <Typography variant="h6" fontWeight={600}>
            <span style={{ color: '#139ED5' }}>CPS</span>
            <span style={{ color: '#F22613' }}>Hub</span>
            <sup style={{ fontSize: '0.6rem' }}>®</sup>
          </Typography>
          <IconButton onClick={handleDrawerToggle}>
            <ChevronLeft />
          </IconButton>
        </Box>

        <Divider />

        {/* User Info */}
        <Box sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar 
              src={profile?.profile_picture_url || undefined}
              sx={{ width: 40, height: 40 }}
            >
              {profile?.first_name?.charAt(0) || user?.email?.charAt(0) || 'U'}
            </Avatar>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="subtitle2" noWrap>
                {profile?.first_name && profile?.last_name 
                  ? `${profile.first_name} ${profile.last_name}`
                  : user?.email
                }
              </Typography>
              {profile?.role === 'admin' && (
                <Chip 
                  label="Admin" 
                  size="small" 
                  color="primary" 
                  sx={{ mt: 0.5, height: 20, fontSize: '0.7rem' }}
                />
              )}
            </Box>
          </Box>
        </Box>

        <Divider />

        {/* Navigation */}
        <List sx={{ px: 1, py: 1 }}>
          {filteredNavItems.map((item) => (
            <ListItem key={item.id} disablePadding>
              <ListItemButton
                onClick={() => handleNavigation(item.path)}
                selected={pathname === item.path}
                sx={{ 
                  borderRadius: 2, 
                  mx: 1, 
                  mb: 0.5,
                  '&.Mui-selected': {
                    backgroundColor: 'primary.50',
                    '&:hover': {
                      backgroundColor: 'primary.100',
                    },
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>

        {/* Chat List - only show on dashboard page */}
        {pathname === '/dashboard' && (
          <>
            <Divider />
            <ChatList selectedChatId={selectedChatId || undefined} />
          </>
        )}
      </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          transition: 'margin 0.3s ease',
          ml: drawerOpen ? 0 : `-${DRAWER_WIDTH}px`,
        }}
      >
        <Toolbar /> {/* Spacer for AppBar */}
        <Box sx={{ height: 'calc(100vh - 64px)', overflow: 'hidden' }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
}

const DashboardLayout = memo(function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <Suspense fallback={
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <Typography>Loading...</Typography>
      </Box>
    }>
      <DashboardLayoutContent>{children}</DashboardLayoutContent>
    </Suspense>
  );
});

export default DashboardLayout;