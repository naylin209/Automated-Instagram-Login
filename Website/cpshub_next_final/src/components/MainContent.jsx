import { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation'; // Updated for Next.js
import { 
  Box, 
  Paper, 
  IconButton, 
  Typography, 
  Avatar,
  CircularProgress,
  Divider,
  Card,
  CardContent,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import SendIcon from '@mui/icons-material/Send';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import AddIcon from '@mui/icons-material/Add';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import { getAIResponse } from '../services/groqapi';
import { useAuth } from '../contexts/AuthContext';
import { fetchChatById, createChat, updateChat } from '../services/chats';
import useSWR, { mutate as globalMutate } from 'swr';

const MessageContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  maxWidth: '70%',
  borderRadius: theme.shape.borderRadius,
  marginBottom: theme.spacing(2),
}));

const UserMessage = styled(MessageContainer)(({ theme }) => ({
  backgroundColor: 'white',
  color: 'black',
  marginLeft: 'auto',
  marginRight: theme.spacing(2),
  border: '1px solid #e0e0e0',
  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
}));

const AIMessage = styled(MessageContainer)(({ theme }) => ({
  backgroundColor: theme.palette.grey[100],
  color: theme.palette.text.primary,
  marginLeft: theme.spacing(2),
  marginRight: 'auto',
  display: 'flex',
  alignItems: 'flex-start',
}));

const MessageInput = styled(Paper)(({ theme }) => ({
  position: 'fixed',
  bottom: theme.spacing(3),
  left: '50%',
  transform: 'translateX(-50%)',
  width: 'calc(100% - 300px)',
  maxWidth: 800,
  display: 'flex',
  padding: theme.spacing(1, 2),
  alignItems: 'center',
  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
  borderRadius: 24,
  backgroundColor: 'white',
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

function SuggestionCard({ title, text, onClick }) {
  return (
    <Card 
      sx={{ 
        maxWidth: 250,
        cursor: 'pointer',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 3,
        }
      }}
      onClick={onClick ? () => onClick(text) : undefined}
    >
      <CardContent>
        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {text}
        </Typography>
      </CardContent>
    </Card>
  );
}

function MainContent({ chatId: propChatId }) {
  const theme = useTheme();
  const route = useRouter();
  const { chatId: urlChatId } = useParams();
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [chatTitle, setChatTitle] = useState('');
  const [editTitle, setEditTitle] = useState(false);
  const [titleInput, setTitleInput] = useState('');
  const [editDialog, setEditDialog] = useState({ open: false, messageIdx: null, value: '' });
  const messagesEndRef = useRef(null);
  // Get sidebar chat list mutate function
  const sidebarChatsKey = user ? ['chats', user.id] : null;

  // Use prop chatId if provided, otherwise use URL param
  const chatId = propChatId || urlChatId;

  useEffect(() => {
    if (!user) return;
    if (chatId) {
      fetchChatById(user.id, chatId).then(({ data }) => {
        if (data) {
          setMessages(data.messages || []);
          setCurrentChatId(data.id);
          setChatTitle(data.title || '');
        }
      });
    } else {
      setMessages([]);
      setCurrentChatId(null);
      setChatTitle('');
    }
  }, [chatId, user]);

  const formatResponseText = (text) => {
    if (!text) return '';
    
    const paragraphs = text.split(/\n\n+/);
    
    return (
      <>
        {paragraphs.map((paragraph, index) => {
          const methodMatch = paragraph.trim().match(/^(\d+\.\s+)([^.]+?)(\s+)(.+)$/);
          
          if (methodMatch && methodMatch.length >= 5) {
            const [, number, methodName, separator, description] = methodMatch;
            
            return (
              <Box key={index} sx={{ mb: 3 }}>
                <Typography 
                  variant="body1" 
                  sx={{ mb: 1 }}
                >
                  <span style={{ fontWeight: 700 }}>{number}{methodName}</span>
                  {separator}{description}
                </Typography>
              </Box>
            );
          }
          
          const headerMatch = paragraph.trim().match(/^\*\*([^*]+)\*\*/);
          if (headerMatch) {
            const headerText = paragraph.replace(/\*\*/g, '');
            
            return (
              <Typography 
                key={index} 
                variant="h6" 
                sx={{ 
                  fontWeight: 700,
                  fontSize: '1.2rem',
                  mt: 2.5,
                  mb: 1.5,
                }}
              >
                {headerText}
              </Typography>
            );
          }
          
          return (
            <Typography 
              key={index} 
              variant="body1" 
              sx={{ mb: 2 }}
            >
              {paragraph}
            </Typography>
          );
        })}
      </>
    );
  };

  const postProcessResponse = (text) => {
    if (!text) return text;
    
    let processedText = text;
    
    const methodParagraphRegex = /(\d+\.\s+[A-Z][^:.]+)(:?\s+)([^.]+\.)(\s+\d+\.\s+[A-Z])/g;
    
    processedText = processedText.replace(methodParagraphRegex, (match, method1, separator, description, nextMethod) => {
      return `${method1}${separator}${description}\n\n${nextMethod.trim()}`;
    });
    
    return processedText;
  };

  const generateChatTitle = (messagesArr) => {
    // Use first user message or a summary
    const firstUserMsg = messagesArr.find(m => m.sender === 'user');
    if (firstUserMsg && firstUserMsg.text) {
      return firstUserMsg.text.length > 50 ? firstUserMsg.text.slice(0, 50) + '...' : firstUserMsg.text;
    }
    return 'Untitled Chat';
  };

  const saveCurrentChat = async (newMessages, newTitle) => {
    if (!user) return;
    try {
      if (currentChatId) {
        // Update existing chat
        await updateChat(user.id, currentChatId, {
          messages: newMessages,
          title: newTitle || chatTitle,
          excerpt: newMessages[newMessages.length - 1]?.text?.slice(0, 100) || '',
          updated_at: new Date().toISOString(),
        });
      } else {
        // Create new chat
        const { data, error } = await createChat(
          user.id,
          newMessages,
          newTitle || generateChatTitle(newMessages),
          newMessages[newMessages.length - 1]?.text?.slice(0, 100) || ''
        );
        if (error) throw error;
        if (data) {
          setCurrentChatId(data.id);
          setChatTitle(data.title);
          route.push(`/chat/${data.id}`, { replace: true });
        }
      }
      // Refresh sidebar chat list
      if (sidebarChatsKey) globalMutate(sidebarChatsKey);
    } catch (err) {
      alert('Failed to save chat: ' + (err.message || err));
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = {
      text: input,
      sender: 'user',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsTyping(true);
    try {
      const allMessages = [...messages, userMessage];
      const aiResponseText = await getAIResponse(allMessages);
      const aiMessage = {
        text: aiResponseText,
        sender: 'ai',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      const finalMessages = [...newMessages, aiMessage];
      setMessages(finalMessages);
      const newTitle = currentChatId ? chatTitle : generateChatTitle(finalMessages);
      await saveCurrentChat(finalMessages, newTitle);
    } catch (error) {
      const errorMessage = {
        text: "I'm sorry, I couldn't process your request. Please try again.",
        sender: 'ai',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      const finalMessages = [...messages, userMessage, errorMessage];
      setMessages(finalMessages);
      await saveCurrentChat(finalMessages);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSuggestionClick = (text) => {
    setInput(text);
    document.querySelector('input, textarea').focus();
  };

  // Edit chat title
  const handleEditTitle = () => {
    setTitleInput(chatTitle);
    setEditTitle(true);
  };
  const handleSaveTitle = async () => {
    setEditTitle(false);
    setChatTitle(titleInput);
    await saveCurrentChat(messages, titleInput);
  };

  // Edit message dialog
  const openEditDialog = (idx, value) => {
    setEditDialog({ open: true, messageIdx: idx, value });
  };
  const handleEditMessage = (e) => {
    setEditDialog((prev) => ({ ...prev, value: e.target.value }));
  };
  const handleSaveMessage = async () => {
    const idx = editDialog.messageIdx;
    const newMessages = [...messages];
    newMessages[idx].text = editDialog.value;
    setMessages(newMessages);
    await saveCurrentChat(newMessages);
    setEditDialog({ open: false, messageIdx: null, value: '' });
  };
  const handleCancelEdit = () => {
    setEditDialog({ open: false, messageIdx: null, value: '' });
  };

  const startNewChat = () => {
    setMessages([]);
    setCurrentChatId(null);
    setChatTitle('');
    route.push('/chat', { replace: true });
  };

  return (
    <Box sx={{ position: 'relative', height: 'calc(100vh - 64px)', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ 
        flexGrow: 1, 
        overflow: 'auto', 
        p: 2, 
        pb: 10, 
        display: 'flex', 
        flexDirection: 'column',
        backgroundColor: '#f5f5f7',
      }}>
        {messages.length === 0 ? (
          <EmptyState>
            <SmartToyIcon sx={{ fontSize: 64, color: theme.palette.primary.main, mb: 2 }} />
            <Typography variant="h5" gutterBottom>
              Welcome to CPShub AI Assistant
            </Typography>
            <Typography variant="body1" color="textSecondary" sx={{ maxWidth: 600 }}>
              How can I help you with your construction project today? Ask me about materials, regulations, best practices, or schedule optimization.
            </Typography>
            <Box sx={{ mt: 4, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 2 }}>
              <SuggestionCard 
                title="Project Planning" 
                text="What are the best project management methodologies for a high-rise construction?" 
                onClick={handleSuggestionClick}
              />
              <SuggestionCard 
                title="Materials" 
                text="What's the most sustainable concrete mix for a residential foundation?" 
                onClick={handleSuggestionClick}
              />
              <SuggestionCard 
                title="Regulations" 
                text="What building codes apply to commercial construction in my area?" 
                onClick={handleSuggestionClick}
              />
              <SuggestionCard 
                title="Cost Optimization" 
                text="How can I reduce material waste on my construction site?" 
                onClick={handleSuggestionClick}
              />
            </Box>
          </EmptyState>
        ) : (
          messages.map((message, index) => (
            message.sender === 'user' ? (
              <UserMessage key={index}>
                <Typography variant="body1" sx={{ color: 'black' }}>{message.text}</Typography>
                <Typography variant="caption" sx={{ display: 'block', textAlign: 'right', mt: 1, color: 'gray' }}>
                  {message.time}
                </Typography>
              </UserMessage>
            ) : (
              <AIMessage key={index}>
                <Avatar 
                  sx={{ 
                    mr: 1, 
                    bgcolor: theme.palette.primary.main,
                    width: 32,
                    height: 32,
                    alignSelf: 'flex-start',
                    mt: 1,
                  }}
                >
                  <SmartToyIcon fontSize="small" />
                </Avatar>
                <Box 
                  sx={{ 
                    width: '100%',
                    '& ul, & ol': {
                      pl: 3,
                      mb: 2,
                    },
                  }}
                >
                  {formatResponseText(message.text)}
                  <Typography variant="caption" sx={{ display: 'block', mt: 1.5, color: 'text.secondary', textAlign: 'right' }}>
                    {message.time}
                  </Typography>
                </Box>
              </AIMessage>
            )
          ))
        )}
        {isTyping && (
          <AIMessage>
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
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <CircularProgress size={16} />
              <Typography variant="body2" sx={{ ml: 1 }}>
                Thinking...
              </Typography>
            </Box>
          </AIMessage>
        )}
        <div ref={messagesEndRef} />
      </Box>

      <MessageInput elevation={3}>
        <IconButton size="small" sx={{ mr: 1 }}>
          <AddIcon />
        </IconButton>
        <IconButton size="small" sx={{ mr: 1 }}>
          <AttachFileIcon />
        </IconButton>
        <Divider orientation="vertical" flexItem sx={{ mr: 1 }} />
        
        <Box
          component="div"
          sx={{
            flex: 1,
            position: 'relative',
          }}
        >
          <textarea
            placeholder="Ask about construction projects, materials, regulations, or best practices..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            style={{
              width: '100%',
              border: 'none',
              outline: 'none',
              resize: 'none',
              backgroundColor: 'white',
              color: 'black',
              fontFamily: 'inherit',
              fontSize: '0.875rem',
              padding: '8px 0',
              minHeight: '24px',
            }}
            rows={1}
          />
        </Box>
        
        <IconButton 
          color="primary" 
          onClick={handleSendMessage}
          disabled={!input.trim()}
        >
          <SendIcon />
        </IconButton>
      </MessageInput>
    </Box>
  );
}

export default MainContent;