'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  IconButton,
  TextField,
  InputAdornment,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Search,
  Chat,
  Delete,
  DateRange,
  Message,
} from '@mui/icons-material';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import { getUserChats, deleteChat } from '@/lib/chatService';
import { Chat as ChatType } from '@/lib/supabase';

export default function ChatHistoryPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [chats, setChats] = useState<ChatType[]>([]);
  const [filteredChats, setFilteredChats] = useState<ChatType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    chatId: string | null;
    chatTitle: string;
  }>({
    open: false,
    chatId: null,
    chatTitle: '',
  });
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');

  // Load chats
  useEffect(() => {
    if (!user) {
      router.push('/auth/login');
      return;
    }

    const loadChats = async () => {
      try {
        const { data, error } = await getUserChats(user.id);
        if (error) {
          setError('Failed to load chat history');
        } else {
          setChats(data);
          setFilteredChats(data);
        }
      } catch (error) {
        setError('An error occurred while loading chats');
      } finally {
        setLoading(false);
      }
    };

    loadChats();
  }, [user, router]);

  // Filter chats based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredChats(chats);
    } else {
      const filtered = chats.filter(chat =>
        chat.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        chat.excerpt?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredChats(filtered);
    }
  }, [searchQuery, chats]);

  const handleChatClick = (chatId: string) => {
    router.push(`/dashboard/chat/${chatId}`);
  };

  const handleDeleteClick = (chatId: string, chatTitle: string) => {
    setDeleteDialog({
      open: true,
      chatId,
      chatTitle,
    });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteDialog.chatId || !user) return;

    setDeleting(true);
    try {
      const { error } = await deleteChat(deleteDialog.chatId, user.id);
      if (error) {
        setError('Failed to delete chat');
      } else {
        // Remove from local state
        const updatedChats = chats.filter(chat => chat.id !== deleteDialog.chatId);
        setChats(updatedChats);
        setFilteredChats(updatedChats.filter(chat =>
          chat.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          chat.excerpt?.toLowerCase().includes(searchQuery.toLowerCase())
        ));
      }
    } catch (error) {
      setError('An error occurred while deleting the chat');
    } finally {
      setDeleting(false);
      setDeleteDialog({ open: false, chatId: null, chatTitle: '' });
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 24 * 7) {
      return date.toLocaleDateString([], { weekday: 'short', hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
    }
  };

  const getMessageCount = (chat: ChatType) => {
    return Array.isArray(chat.messages) ? chat.messages.length : 0;
  };

  if (!user) {
    return null;
  }

  return (
    <DashboardLayout>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" fontWeight={600} gutterBottom>
          Chat History
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          View and manage your previous conversations
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        {/* Search */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <TextField
              fullWidth
              placeholder="Search your chats..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search color="action" />
                  </InputAdornment>
                ),
              }}
            />
          </CardContent>
        </Card>

        {/* Loading State */}
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        )}

        {/* Empty State */}
        {!loading && filteredChats.length === 0 && (
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 6 }}>
              <Chat sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                {searchQuery ? 'No chats found' : 'No chat history yet'}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                {searchQuery 
                  ? 'Try adjusting your search terms'
                  : 'Start a new conversation to see your chat history here'
                }
              </Typography>
              {!searchQuery && (
                <Button 
                  variant="contained" 
                  onClick={() => router.push('/dashboard')}
                >
                  Start New Chat
                </Button>
              )}
            </CardContent>
          </Card>
        )}

        {/* Chat List */}
        {!loading && filteredChats.length > 0 && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {filteredChats.map((chat) => (
              <Card 
                key={chat.id}
                sx={{ 
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: 3,
                  }
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                    <Box 
                      sx={{ flex: 1, minWidth: 0 }}
                      onClick={() => handleChatClick(chat.id)}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                        <Typography variant="h6" fontWeight={600} noWrap>
                          {chat.title}
                        </Typography>
                        <Chip 
                          label={`${getMessageCount(chat)} messages`} 
                          size="small" 
                          color="primary" 
                          variant="outlined"
                        />
                      </Box>
                      
                      {chat.excerpt && (
                        <Typography 
                          variant="body2" 
                          color="text.secondary" 
                          sx={{ mb: 2 }}
                          noWrap
                        >
                          {chat.excerpt}
                        </Typography>
                      )}

                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <DateRange fontSize="small" color="action" />
                          <Typography variant="caption" color="text.secondary">
                            Updated {formatDate(chat.updated_at)}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <Message fontSize="small" color="action" />
                          <Typography variant="caption" color="text.secondary">
                            Created {formatDate(chat.created_at)}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>

                    <IconButton
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteClick(chat.id, chat.title);
                      }}
                      color="error"
                      sx={{ opacity: 0.7, '&:hover': { opacity: 1 } }}
                    >
                      <Delete />
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        )}

        {/* Summary */}
        {!loading && chats.length > 0 && (
          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Showing {filteredChats.length} of {chats.length} total conversations
            </Typography>
          </Box>
        )}

        {/* Delete Confirmation Dialog */}
        <Dialog 
          open={deleteDialog.open} 
          onClose={() => !deleting && setDeleteDialog({ open: false, chatId: null, chatTitle: '' })}
        >
          <DialogTitle>Delete Chat</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete &quot;{deleteDialog.chatTitle}&quot;? 
              This action cannot be undone.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button 
              onClick={() => setDeleteDialog({ open: false, chatId: null, chatTitle: '' })}
              disabled={deleting}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleDeleteConfirm}
              color="error"
              disabled={deleting}
              startIcon={deleting ? <CircularProgress size={20} /> : <Delete />}
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </DashboardLayout>
  );
}