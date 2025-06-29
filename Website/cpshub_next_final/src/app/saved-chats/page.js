'use client'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ThemeProvider, CssBaseline, CircularProgress, Box, Typography, Paper, Container, List, ListItem, ListItemText, ListItemButton, IconButton, Chip, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import Layout from '../../components/Layout';
import theme from '../../theme/theme';
import ChatIcon from '@mui/icons-material/Chat';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { fetchChats, deleteChat } from '../../services/chats';

export default function SavedChatsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [savedChats, setSavedChats] = useState([]);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, chatId: null });

  useEffect(() => {
    if (!loading && !user) {
      // Not authenticated, redirect to home
      router.push('/');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (!user) return;
    const loadChats = async () => {
      const { data } = await fetchChats(user.id);
      setSavedChats(data || []);
    };
    loadChats();
  }, [user]);

  const handleChatClick = (chatId) => {
    router.push(`/chat/${chatId}`);
  };

  const handleDeleteChat = (chatId, e) => {
    e.stopPropagation();
    setDeleteDialog({ open: true, chatId });
  };

  const confirmDeleteChat = async () => {
    if (!user || !deleteDialog.chatId) return;
    await deleteChat(user.id, deleteDialog.chatId);
    setSavedChats((prev) => prev.filter(chat => chat.id !== deleteDialog.chatId));
    setDeleteDialog({ open: false, chatId: null });
  };

  const cancelDeleteChat = () => {
    setDeleteDialog({ open: false, chatId: null });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Show loading while checking auth
  if (loading) {
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

  // Show loading while redirecting
  if (!user) {
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

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Layout>
        <Container maxWidth="md" sx={{ py: 4 }}>
          <Typography variant="h4" gutterBottom>
            Saved Chats
          </Typography>
          
          {savedChats.length === 0 ? (
            <Paper sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No saved chats yet
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Start a new chat to see your conversation history here.
              </Typography>
            </Paper>
          ) : (
            <Paper>
              <List>
                {savedChats.map((chat, index) => (
                  <ListItem
                    key={chat.id}
                    disablePadding
                    divider={index < savedChats.length - 1}
                  >
                    <ListItemButton onClick={() => handleChatClick(chat.id)}>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <ChatIcon fontSize="small" color="primary" />
                            <Typography variant="subtitle1" component="span">
                              {chat.title}
                            </Typography>
                          </Box>
                        }
                        secondary={
                          <Box sx={{ mt: 1 }}>
                            <Typography variant="body2" color="text.secondary" component="span" sx={{ mb: 1, display: 'block' }}>
                              {chat.excerpt}
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                              <Chip 
                                label={formatDate(chat.updated_at || chat.created_at)} 
                                size="small" 
                                variant="outlined"
                              />
                              <Typography variant="caption" color="text.secondary" component="span">
                                {chat.messages.length} messages
                              </Typography>
                            </Box>
                          </Box>
                        }
                      />
                      <IconButton 
                        onClick={(e) => handleDeleteChat(chat.id, e)}
                        sx={{ opacity: 0.7, '&:hover': { opacity: 1 } }}
                      >
                        <DeleteOutlineIcon />
                      </IconButton>
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </Paper>
          )}
        </Container>
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
      </Layout>
    </ThemeProvider>
  );
} 