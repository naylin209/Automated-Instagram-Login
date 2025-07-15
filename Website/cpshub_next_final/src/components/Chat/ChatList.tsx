'use client';

import { useState, useEffect, memo, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
  IconButton,
  Divider,
  CircularProgress,
  Button,
} from '@mui/material';
import {
  Chat as ChatIcon,
  Add,
  Delete,
} from '@mui/icons-material';
import { useAuth } from '@/contexts/AuthContext';
import { getUserChats, deleteChat } from '@/lib/chatService';
import { Chat } from '@/lib/supabase';

interface ChatListProps {
  selectedChatId?: string;
}

const ChatList = memo(function ChatList({ selectedChatId }: ChatListProps) {
  const { user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);

  const loadChats = useCallback(async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await getUserChats(user.id);
      if (!error) {
        setChats(data);
      }
    } catch (error) {
      console.error('Error loading chats:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadChats();
  }, [loadChats]);

  const handleChatSelect = (chatId: string) => {
    router.push(`/dashboard?chat=${chatId}`);
  };

  const handleNewChat = () => {
    router.push('/dashboard');
  };

  const handleDeleteChat = async (chatId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!user || !confirm('Are you sure you want to delete this chat?')) return;
    
    try {
      await deleteChat(chatId, user.id);
      setChats(chats.filter(chat => chat.id !== chatId));
      
      // If we're currently viewing the deleted chat, go to new chat
      if (selectedChatId === chatId) {
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Error deleting chat:', error);
    }
  };

  // Only show chat list on dashboard page
  if (pathname !== '/dashboard') {
    return null;
  }

  return (
    <Box sx={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ p: 2 }}>
        <Button
          fullWidth
          variant="contained"
          startIcon={<Add />}
          onClick={handleNewChat}
          sx={{ mb: 2 }}
        >
          New Chat
        </Button>
      </Box>

      <Divider />

      <Box sx={{ p: 2 }}>
        <Typography variant="h6" fontWeight={600}>
          Recent Chats
        </Typography>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress size={24} />
        </Box>
      ) : (
        <List sx={{ flex: 1, overflow: 'auto', px: 1 }}>
          {chats.map((chat) => (
            <ListItem key={chat.id} disablePadding>
              <ListItemButton
                onClick={() => handleChatSelect(chat.id)}
                selected={selectedChatId === chat.id}
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
                <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                  <ChatIcon sx={{ mr: 1.5, fontSize: 20 }} />
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <ListItemText
                      primary={
                        <Typography variant="body2" noWrap>
                          {chat.title}
                        </Typography>
                      }
                      secondary={
                        <Typography variant="caption" color="text.secondary" noWrap>
                          {chat.excerpt}
                        </Typography>
                      }
                    />
                  </Box>
                  <IconButton
                    size="small"
                    onClick={(e) => handleDeleteChat(chat.id, e)}
                    sx={{ ml: 1 }}
                  >
                    <Delete fontSize="small" />
                  </IconButton>
                </Box>
              </ListItemButton>
            </ListItem>
          ))}
          
          {chats.length === 0 && (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="body2" color="text.secondary">
                No chats yet. Start a new conversation!
              </Typography>
            </Box>
          )}
        </List>
      )}
    </Box>
  );
});

export default ChatList;