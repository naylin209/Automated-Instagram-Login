'use client';

import { useState, useRef, useEffect, memo, useCallback } from 'react';
import {
  Box,
  Paper,
  TextField,
  IconButton,
  Typography,
  Avatar,
  CircularProgress,
  Button,
  Card,
  CardContent,
  Chip,
  Fab,
} from '@mui/material';
import {
  Send,
  AttachFile,
  SmartToy,
  Person,
  Add,
  Engineering,
  Analytics,
  Gavel,
  MonetizationOn,
} from '@mui/icons-material';
import { useAuth } from '@/contexts/AuthContext';
import { Message, Chat } from '@/lib/supabase';
import { createChat, updateChat, generateChatTitle, getChatById, testDatabaseConnection } from '@/lib/chatService';

interface ChatInterfaceProps {
  chatId?: string;
}

interface SuggestionCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  prompt: string;
  onSuggestionClick: (prompt: string) => void;
}

const SuggestionCard = memo(function SuggestionCard({ 
  title, 
  description, 
  icon, 
  prompt,
  onSuggestionClick 
}: SuggestionCardProps) {
  return (
    <Card 
      sx={{ 
        cursor: 'pointer',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: 3,
        }
      }}
      onClick={() => onSuggestionClick(prompt)}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
          <Box sx={{ color: 'primary.main' }}>
            {icon}
          </Box>
          <Typography variant="h6" fontWeight={600}>
            {title}
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </CardContent>
    </Card>
  );
});

const suggestions = [
  {
    title: 'Project Planning',
    description: 'Best practices for managing construction timelines and resources',
    icon: <Engineering />,
    prompt: 'What are the best project management methodologies for a high-rise construction project?',
  },
  {
    title: 'Cost Estimation',
    description: 'Accurate budgeting and cost control strategies',
    icon: <MonetizationOn />,
    prompt: 'How can I create an accurate cost estimate for a residential foundation project?',
  },
  {
    title: 'Building Codes',
    description: 'Understanding regulations and compliance requirements',
    icon: <Gavel />,
    prompt: 'What building codes should I consider for commercial construction in urban areas?',
  },
  {
    title: 'Material Selection',
    description: 'Choosing the right materials for durability and cost-effectiveness',
    icon: <Analytics />,
    prompt: 'What are the most sustainable and cost-effective materials for concrete construction?',
  },
];

const ChatInterface = memo(function ChatInterface({ chatId }: ChatInterfaceProps) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [currentChatId, setCurrentChatId] = useState<string | null>(chatId || null);
  const [initialLoading, setInitialLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Load existing chat if chatId is provided
  useEffect(() => {
    if (chatId && user) {
      setInitialLoading(true);
      getChatById(chatId, user.id)
        .then(({ data, error }) => {
          if (data && !error) {
            setMessages(data.messages || []);
            setCurrentChatId(data.id);
          }
        })
        .finally(() => setInitialLoading(false));
    }
  }, [chatId, user]);

  const sendMessage = useCallback(async (messageText: string) => {
    if (!messageText.trim() || !user) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: messageText.trim(),
      sender: 'user',
      timestamp: new Date().toISOString(),
    };

    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: updatedMessages,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }

      const data = await response.json();

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.response,
        sender: 'ai',
        timestamp: new Date().toISOString(),
      };

      const finalMessages = [...updatedMessages, aiMessage];
      setMessages(finalMessages);

      // Save to Supabase
      if (currentChatId) {
        // Update existing chat
        await updateChat(currentChatId, user.id, {
          messages: finalMessages,
        });
      } else {
        // Create new chat
        const title = generateChatTitle(finalMessages);
        const { data: newChat } = await createChat({
          user_id: user.id,
          title,
          messages: finalMessages,
        });
        
        if (newChat) {
          setCurrentChatId(newChat.id);
          // Update the URL to include the chat ID
          window.history.replaceState({}, '', `/dashboard?chat=${newChat.id}`);
        }
      }
      
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Sorry, I encountered an error. Please try again.',
        sender: 'ai',
        timestamp: new Date().toISOString(),
      };
      setMessages([...updatedMessages, errorMessage]);
    } finally {
      setLoading(false);
    }
  }, [messages, user, currentChatId]);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  }, [input, sendMessage]);

  const handleSuggestionClick = useCallback((prompt: string) => {
    sendMessage(prompt);
  }, [sendMessage]);

  const handleFileUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      // TODO: Implement file upload to Supabase storage
      console.log('File upload:', file.name);
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
    }
  }, []);

  const formatMessage = (text: string) => {
    // Simple formatting for better readability
    const paragraphs = text.split('\n\n');
    return paragraphs.map((paragraph, index) => (
      <Typography 
        key={index} 
        variant="body1" 
        sx={{ mb: index < paragraphs.length - 1 ? 2 : 0 }}
      >
        {paragraph}
      </Typography>
    ));
  };

  if (initialLoading) {
    return (
      <Box sx={{ 
        height: '100%', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center' 
      }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Chat Messages */}
      <Box sx={{ 
        flex: 1, 
        overflow: 'auto', 
        p: 2,
        backgroundColor: '#f8fafc'
      }}>
        {messages.length === 0 ? (
          // Welcome Screen
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            textAlign: 'center',
            maxWidth: 800,
            mx: 'auto',
          }}>
            <SmartToy sx={{ fontSize: 64, color: 'primary.main', mb: 3 }} />
            <Typography variant="h4" fontWeight={600} gutterBottom>
              Welcome to CPSHub AI
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 600 }}>
              Your specialized construction industry assistant. Ask me anything about project management, 
              materials, building codes, cost estimation, and more.
            </Typography>

            {/* Database Test Button */}
            <Button 
              variant="outlined" 
              onClick={async () => {
                const result = await testDatabaseConnection();
                if (result.success) {
                  alert('✅ Database connection successful!');
                } else {
                  alert('❌ Database connection failed. Check console for details.');
                }
              }}
              sx={{ mb: 4 }}
            >
              Test Database Connection
            </Button>

            {/* Suggestion Cards */}
            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, 
              gap: 2,
              width: '100%',
              maxWidth: 600,
            }}>
              {suggestions.map((suggestion, index) => (
                <SuggestionCard
                  key={index}
                  title={suggestion.title}
                  description={suggestion.description}
                  icon={suggestion.icon}
                  prompt={suggestion.prompt}
                  onSuggestionClick={handleSuggestionClick}
                />
              ))}
            </Box>
          </Box>
        ) : (
          // Messages
          <Box sx={{ maxWidth: 800, mx: 'auto' }}>
            {messages.map((message) => (
              <Box
                key={message.id}
                sx={{
                  display: 'flex',
                  mb: 3,
                  flexDirection: message.sender === 'user' ? 'row-reverse' : 'row',
                }}
              >
                <Avatar
                  sx={{
                    mx: 1,
                    bgcolor: message.sender === 'user' ? 'primary.main' : 'grey.300',
                  }}
                >
                  {message.sender === 'user' ? <Person /> : <SmartToy />}
                </Avatar>
                <Paper
                  sx={{
                    p: 2,
                    maxWidth: '70%',
                    bgcolor: message.sender === 'user' ? 'primary.50' : 'background.paper',
                  }}
                >
                  {formatMessage(message.text)}
                  <Typography 
                    variant="caption" 
                    color="text.secondary" 
                    sx={{ display: 'block', mt: 1, textAlign: 'right' }}
                  >
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </Typography>
                </Paper>
              </Box>
            ))}
            
            {loading && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Avatar sx={{ bgcolor: 'grey.300' }}>
                  <SmartToy />
                </Avatar>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CircularProgress size={16} />
                  <Typography variant="body2" color="text.secondary">
                    Thinking...
                  </Typography>
                </Box>
              </Box>
            )}
            <div ref={messagesEndRef} />
          </Box>
        )}
      </Box>

      {/* Input Area */}
      <Paper 
        component="form" 
        onSubmit={handleSubmit}
        sx={{ 
          p: 2, 
          borderRadius: 0,
          borderTop: '1px solid #e2e8f0',
          display: 'flex',
          alignItems: 'center',
          gap: 1,
        }}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          style={{ display: 'none' }}
          accept="image/*,.pdf,.doc,.docx,.txt"
        />
        
        <IconButton 
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
        >
          {uploading ? <CircularProgress size={20} /> : <AttachFile />}
        </IconButton>

        <TextField
          fullWidth
          placeholder="Ask about construction projects, materials, regulations, or best practices..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={loading}
          variant="outlined"
          size="small"
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 3,
            },
          }}
        />

        <IconButton 
          type="submit" 
          disabled={!input.trim() || loading}
          color="primary"
        >
          <Send />
        </IconButton>
      </Paper>

      {/* New Chat FAB */}
      {messages.length > 0 && (
        <Fab
          color="primary"
          onClick={() => window.location.reload()}
          sx={{
            position: 'absolute',
            bottom: 100,
            right: 24,
          }}
        >
          <Add />
        </Fab>
      )}
    </Box>
  );
});

export default ChatInterface;