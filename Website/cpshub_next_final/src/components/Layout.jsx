import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import useSWR from 'swr';
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
  Collapse,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button
} from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import { useAuth } from '../contexts/AuthContext';
import { fetchChats, deleteChat } from '../services/chats';

// Icons
import AnalyticsIcon from '@mui/icons-material/Analytics';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import BusinessIcon from '@mui/icons-material/Business';
import FolderIcon from '@mui/icons-material/Folder';
import PeopleIcon from '@mui/icons-material/People';
import InventoryIcon from '@mui/icons-material/Inventory';
import BookmarkIcon from '@mui/icons-material/BookmarkBorder';
import NotificationsIcon from '@mui/icons-material/NotificationsNone';
import SettingsIcon from '@mui/icons-material/Settings';
import SearchIcon from '@mui/icons-material/Search';
import MenuIcon from '@mui/icons-material/Menu';
import ChatIcon from '@mui/icons-material/Chat';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import LogoutIcon from '@mui/icons-material/Logout';
import AddIcon from '@mui/icons-material/Add';

const drawerWidth = 260;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: 0,
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  }),
);

const StyledAppBar = styled(AppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.primary,
  boxShadow: 'none',
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

const Logo = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 2),
  ...theme.mixins.toolbar,
  justifyContent: 'space-between',
}));

const SavedChatItem = styled(ListItemButton)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  margin: theme.spacing(0.5, 1),
  padding: theme.spacing(0.5, 1),
  fontSize: '0.875rem',
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

const fetchUserChats = async (userId) => {
  if (!userId) return [];
  const { data } = await fetchChats(userId);
  return data || [];
};

function Layout({ children }) {
  const theme = useTheme();
  const route = useRouter();
  const pathname = usePathname();
  const { user, profile, signOut } = useAuth();
  const [open, setOpen] = useState(true);
  const [openProject, setOpenProject] = useState(false);
  const [openCompany, setOpenCompany] = useState(false);
  const [openProduct, setOpenProduct] = useState(false);
  const [openPeople, setOpenPeople] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, chatId: null });

  // SWR for chats
  const { data: savedChats = [], mutate: mutateChats, isValidating: chatsLoading } = useSWR(
    user ? ['chats', user.id] : null,
    () => fetchUserChats(user.id),
    { revalidateOnFocus: true }
  );

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const handleProjectClick = () => {
    setOpenProject(!openProject);
  };

  const handleCompanyClick = () => {
    setOpenCompany(!openCompany);
  };

  const handleProductClick = () => {
    setOpenProduct(!openProduct);
  };

  const handlePeopleClick = () => {
    setOpenPeople(!openPeople);
  };

  const handleChatClick = (chatId) => {
    route.push(`/chat/${chatId}`);
  };

  const handleAvatarClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      route.push('/');
    } catch (error) {
      console.error('Sign out error:', error);
    }
    handleMenuClose();
  };

  const handleDeleteChat = (chatId, e) => {
    e.stopPropagation();
    setDeleteDialog({ open: true, chatId });
  };

  const confirmDeleteChat = async () => {
    if (!user || !deleteDialog.chatId) return;
    await deleteChat(user.id, deleteDialog.chatId);
    mutateChats();
    setDeleteDialog({ open: false, chatId: null });
    if (pathname === `/chat/${deleteDialog.chatId}`) {
      route.push('/chat');
    }
  };

  const cancelDeleteChat = () => {
    setDeleteDialog({ open: false, chatId: null });
  };

  const navigate = (path) => {
    route.push(path);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <StyledAppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerToggle}
            edge="start"
            sx={{ mr: 2, ...(open && { display: 'none' }) }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Dashboard
          </Typography>
          <IconButton size="small" sx={{ ml: 2 }} onClick={handleAvatarClick}>
            <Avatar sx={{ width: 32, height: 32 }} src={profile?.profile_picture_url}>
              {profile?.first_name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || 'U'}
            </Avatar>
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            <MenuItem onClick={() => { route.push('/settings'); handleMenuClose(); }}>
              <ListItemIcon>
                <SettingsIcon fontSize="small" />
              </ListItemIcon>
              Settings
            </MenuItem>
            <MenuItem onClick={handleSignOut}>
              <ListItemIcon>
                <LogoutIcon fontSize="small" />
              </ListItemIcon>
              Sign Out
            </MenuItem>
          </Menu>
        </Toolbar>
      </StyledAppBar>
      
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <Logo>
          <Typography variant="h6" noWrap>
            <span style={{ color: theme.palette.primary.main }}>CPS</span>
            <span style={{ color: theme.palette.secondary.main }}>hub</span>
            <sup style={{ fontSize: '0.6rem' }}>®</sup>
          </Typography>
          <IconButton onClick={handleDrawerToggle}>
            {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </Logo>
        
        <Divider />

        <List component="nav">
          <ListItem disablePadding>
            <ListItemButton onClick={() => navigate('/chat')} sx={{ borderRadius: 1, mx: 1 }}>
              <ListItemIcon>
                <AddIcon />
              </ListItemIcon>
              <ListItemText primary="New Chat" />
            </ListItemButton>
          </ListItem>
        </List>

        {/* Recent Chats Section */}
        {savedChats.length > 0 && (
          <>
            <Divider sx={{ my: 1 }} />
            <List component="nav">
              <ListItem disablePadding>
                <Typography variant="caption" sx={{ px: 2, py: 1, color: 'text.secondary' }}>
                  Recent Chats
                </Typography>
              </ListItem>
              {savedChats.slice(0, 5).map((chat) => (
                <ListItem key={chat.id} disablePadding>
                  <SavedChatItem 
                    onClick={() => handleChatClick(chat.id)}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      width: '100%',
                      backgroundColor: pathname === `/chat/${chat.id}` ? theme.palette.action.selected : 'transparent',
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 32 }}>
                      <ChatIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText 
                      primary={
                        <Typography variant="body2" noWrap sx={{ fontSize: '0.875rem' }}>
                          {chat.title}
                        </Typography>
                      }
                      sx={{ flexGrow: 1 }}
                    />
                    <IconButton 
                      size="small" 
                      onClick={(e) => handleDeleteChat(chat.id, e)}
                      sx={{ ml: 1, opacity: 0.7, '&:hover': { opacity: 1 } }}
                    >
                      <DeleteOutlineIcon fontSize="small" />
                    </IconButton>
                  </SavedChatItem>
                </ListItem>
              ))}
            </List>
          </>
        )}

        <Divider sx={{ my: 1 }} />

        <List component="nav">
          {/* Project Section */}
          <ListItem disablePadding>
            <ListItemButton onClick={handleProjectClick} sx={{ borderRadius: 1, mx: 1 }}>
              <ListItemIcon>
                <FolderIcon sx={{ color: theme.palette.project.main }} />
              </ListItemIcon>
              <ListItemText primary="Project" />
              {openProject ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
          </ListItem>
          <Collapse in={openProject} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItemButton sx={{ pl: 4 }} onClick={() => route.push('/project/insights')}>
                <ListItemText primary="Project insights" />
              </ListItemButton>
              <ListItemButton sx={{ pl: 4 }} onClick={() => route.push('/project/planning')}>
                <ListItemText primary="Project planning" />
              </ListItemButton>
              <ListItemButton sx={{ pl: 4 }} onClick={() => route.push('/project/execution')}>
                <ListItemText primary="Project execution" />
              </ListItemButton>
              <ListItemButton sx={{ pl: 4 }} onClick={() => route.push('/project/monitoring')}>
                <ListItemText primary="Project monitoring" />
              </ListItemButton>
            </List>
          </Collapse>

          {/* Company Section */}
          <ListItem disablePadding>
            <ListItemButton onClick={handleCompanyClick} sx={{ borderRadius: 1, mx: 1 }}>
              <ListItemIcon>
                <BusinessIcon sx={{ color: theme.palette.secondary.main }} />
              </ListItemIcon>
              <ListItemText primary="Company" />
              {openCompany ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
          </ListItem>
          <Collapse in={openCompany} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItemButton sx={{ pl: 4 }}>
                <ListItemText primary="Company overview" />
              </ListItemButton>
              <ListItemButton sx={{ pl: 4 }}>
                <ListItemText primary="Organization" />
              </ListItemButton>
            </List>
          </Collapse>

          {/* Product Section */}
          <ListItem disablePadding>
            <ListItemButton onClick={handleProductClick} sx={{ borderRadius: 1, mx: 1 }}>
              <ListItemIcon>
                <InventoryIcon sx={{ color: theme.palette.product.main }} />
              </ListItemIcon>
              <ListItemText primary="Product" />
              {openProduct ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
          </ListItem>
          <Collapse in={openProduct} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItemButton sx={{ pl: 4 }}>
                <ListItemText primary="Product catalog" />
              </ListItemButton>
              <ListItemButton sx={{ pl: 4 }}>
                <ListItemText primary="Specifications" />
              </ListItemButton>
            </List>
          </Collapse>

          {/* People Section */}
          <ListItem disablePadding>
            <ListItemButton onClick={handlePeopleClick} sx={{ borderRadius: 1, mx: 1 }}>
              <ListItemIcon>
                <PeopleIcon sx={{ color: theme.palette.people.main }} />
              </ListItemIcon>
              <ListItemText primary="People" />
              {openPeople ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
          </ListItem>
          <Collapse in={openPeople} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItemButton sx={{ pl: 4 }}>
                <ListItemText primary="Team members" />
              </ListItemButton>
              <ListItemButton sx={{ pl: 4 }}>
                <ListItemText primary="Contractors" />
              </ListItemButton>
            </List>
          </Collapse>
        </List>

      <Divider sx={{ my: 1 }} />
        
        <List>
          {/* Only show admin dashboard for admin users */}
          {profile?.role === 'admin' && (
            <ListItem disablePadding>
              <ListItemButton onClick={() => route.push('/admin')} sx={{ borderRadius: 1, mx: 1 }}>
                <ListItemIcon>
                  <AnalyticsIcon sx={{ color: theme.palette.info.main }} />
                </ListItemIcon>
                <ListItemText primary="Admin Dashboard" />
              </ListItemButton>
            </ListItem>
          )}
        </List>
        
        <Divider sx={{ mt: 'auto' }} />
        
        <List>
          <ListItem disablePadding>
            <ListItemButton onClick={() => route.push('/saved-chats')} sx={{ borderRadius: 1, mx: 1 }}>
              <ListItemIcon>
                <BookmarkIcon />
              </ListItemIcon>
              <ListItemText primary="Saved Chats" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton sx={{ borderRadius: 1, mx: 1 }}>
              <ListItemIcon>
                <NotificationsIcon />
              </ListItemIcon>
              <ListItemText primary="Notifications" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton onClick={() => route.push('/settings')} sx={{ borderRadius: 1, mx: 1 }}>
              <ListItemIcon>
                <SettingsIcon />
              </ListItemIcon>
              <ListItemText primary="Settings" />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>
      
      <Dialog open={deleteDialog.open} onClose={cancelDeleteChat}>
        <DialogTitle>Delete Chat</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this chat? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelDeleteChat}>Cancel</Button>
          <Button onClick={confirmDeleteChat} color="error">Delete</Button>
        </DialogActions>
      </Dialog>
      
      <Main open={open}>
        <DrawerHeader />
        <Box sx={{ height: 'calc(100vh - 64px)', overflow: 'auto' }}>
          {children}
        </Box>
      </Main>
    </Box>
  );
}

export default Layout;