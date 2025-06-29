import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Box, 
  Typography, 
  IconButton, 
  Divider,
  Card,
  CardContent,
  InputAdornment,
  TextField,
  Paper,
  Grid,
  Avatar,
  Button
} from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import ChatIcon from '@mui/icons-material/Chat';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SearchIcon from '@mui/icons-material/Search';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import PersonIcon from '@mui/icons-material/Person';

const SearchBar = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  '& .MuiOutlinedInput-root': {
    borderRadius: theme.shape.borderRadius,
    backgroundColor: theme.palette.background.paper,
  }
}));

const ChatCard = styled(Card)(({ theme, selected }) => ({
  marginBottom: theme.spacing(2),
  transition: 'all 0.2s ease',
  cursor: 'pointer',
  borderLeft: selected ? `4px solid ${theme.palette.primary.main}` : 'none',
  backgroundColor: selected ? theme.palette.action.selected : theme.palette.background.paper,
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  }
}));

const EmptyState = styled(Box)(({ theme }) => ({
  height: '70vh',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  textAlign: 'center',
  padding: theme.spacing(2),
}));

const MessageBubble = styled(Paper)(({ theme, sender }) => ({
  padding: theme.spacing(1.5),
  marginBottom: theme.spacing(1.5),
  maxWidth: '80%',
  backgroundColor: sender === 'user' ? theme.palette.primary.light : theme.palette.grey[100],
  alignSelf: sender === 'user' ? 'flex-end' : 'flex-start',
  borderRadius: sender === 'user' ? '16px 4px 16px 16px' : '4px 16px 16px 16px',
}));

function SavedChats() {
  const theme = useTheme();
  const route = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedChat, setSelectedChat] = useState(null);
  const [savedChats, setSavedChats] = useState([]);

  useEffect(() => {
    const loadChats = () => {
      const chats = JSON.parse(localStorage.getItem('cpshub_chats') || '[]');
      setSavedChats(chats);
    };

    loadChats();
    
    const handleStorageChange = () => {
      loadChats();
    };
    
    window.addEventListener('storage', handleStorageChange);
    const pollInterval = setInterval(loadChats, 2000);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(pollInterval);
    };
  }, []);

  const filteredChats = savedChats.filter(chat => {
    const matchesSearch = chat.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        (chat.excerpt && chat.excerpt.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesSearch;
  });

  const handleChatSelect = (chat) => {
    setSelectedChat(chat.id === selectedChat ? null : chat.id);
  };

  const handleDeleteChat = (chatId, e) => {
    e.stopPropagation();
    const updatedChats = savedChats.filter(chat => chat.id !== chatId);
    localStorage.setItem('cpshub_chats', JSON.stringify(updatedChats));
    setSavedChats(updatedChats);
    
    if (selectedChat === chatId) {
      setSelectedChat(null);
    }
  };

  const handleOpenChat = (chatId) => {
    route.push(`/chat/${chatId}`);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
    });
  };

  const selectedChatData = selectedChat ? filteredChats.find(chat => chat.id === selectedChat) : null;

  return (
    <Box sx={{ p: 3, maxWidth: 1200, margin: '0 auto' }}>
      <Typography variant="h5" gutterBottom fontWeight="medium">
        Saved Chats
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, mb: 2 }}>
            <SearchBar
              fullWidth
              placeholder="Search saved chats..."
              variant="outlined"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />

            {filteredChats.length > 0 ? (
              filteredChats.map(chat => (
                <ChatCard 
                  key={chat.id} 
                  selected={selectedChat === chat.id}
                  onClick={() => handleChatSelect(chat)}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <ChatIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
                      <Typography variant="subtitle1" sx={{ fontWeight: 'medium', flexGrow: 1 }}>
                        {chat.title}
                      </Typography>
                      <IconButton 
                        size="small"
                        onClick={(e) => handleDeleteChat(chat.id, e)}
                      >
                        <DeleteOutlineIcon fontSize="small" />
                      </IconButton>
                    </Box>
                    {chat.excerpt && (
                      <Typography variant="body2" color="text.secondary" noWrap sx={{ mb: 1 }}>
                        {chat.excerpt}
                      </Typography>
                    )}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="caption" color="text.secondary">
                        {formatDate(chat.updatedAt || chat.createdAt)}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {chat.messages ? chat.messages.length : 0} messages
                      </Typography>
                    </Box>
                  </CardContent>
                </ChatCard>
              ))
            ) : (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="body1" color="text.secondary">
                  {searchTerm ? 'No chats found. Try adjusting your search.' : 'No saved chats yet. Start a conversation to see it here!'}
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={8}>
          {selectedChatData ? (
            <Paper sx={{ p: 0, height: '80vh', display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ p: 3, borderBottom: 1, borderColor: 'divider' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h6">
                    {selectedChatData.title}
                  </Typography>
                  <Box>
                    <Button 
                      variant="outlined" 
                      size="small" 
                      sx={{ mr: 1 }}
                      onClick={() => handleOpenChat(selectedChatData.id)}
                    >
                      Continue Chat
                    </Button>
                    <IconButton onClick={(e) => handleDeleteChat(selectedChatData.id, e)}>
                      <DeleteOutlineIcon />
                    </IconButton>
                  </Box>
                </Box>
                <Typography variant="caption" color="text.secondary">
                  {formatDate(selectedChatData.updatedAt || selectedChatData.createdAt)} • {selectedChatData.messages.length} messages
                </Typography>
              </Box>
              
              <Box sx={{ flex: 1, overflow: 'auto', p: 2, display: 'flex', flexDirection: 'column' }}>
                {selectedChatData.messages.map((message, index) => (
                  <Box key={index} sx={{ display: 'flex', mb: 2, alignItems: 'flex-start' }}>
                    {message.sender === 'ai' && (
                      <Avatar 
                        sx={{ 
                          mr: 1, 
                          bgcolor: theme.palette.primary.main,
                          width: 32,
                          height: 32
                        }}
                      >
                        <SmartToyIcon fontSize="small" />
                      </Avatar>
                    )}
                    
                    <MessageBubble sender={message.sender} elevation={1}>
                      <Typography variant="body2">
                        {message.text}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                        {message.time}
                      </Typography>
                    </MessageBubble>
                    
                    {message.sender === 'user' && (
                      <Avatar 
                        sx={{ 
                          ml: 1, 
                          bgcolor: theme.palette.secondary.main,
                          width: 32,
                          height: 32
                        }}
                      >
                        <PersonIcon fontSize="small" />
                      </Avatar>
                    )}
                  </Box>
                ))}
              </Box>
            </Paper>
          ) : (
            <EmptyState>
              <ChatIcon sx={{ fontSize: 64, color: theme.palette.primary.main, mb: 2 }} />
              <Typography variant="h5" gutterBottom>
                No chat selected
              </Typography>
              <Typography variant="body1" color="textSecondary">
                Select a chat from the list to view its contents.
              </Typography>
            </EmptyState>
          )}
        </Grid>
      </Grid>
    </Box>
  );
}

export default SavedChats;