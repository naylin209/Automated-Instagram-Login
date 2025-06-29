// Analytics service for processing chat data
export const getAnalytics = () => {
  const chats = JSON.parse(localStorage.getItem('cpshub_chats') || '[]');
  
  if (chats.length === 0) {
    return {
      totalChats: 0,
      totalMessages: 0,
      avgMessagesPerChat: 0,
      totalApiCalls: 0,
      dailyStats: [],
      topicAnalysis: {},
      engagementMetrics: {},
      recentActivity: []
    };
  }

  // Basic metrics
  const totalChats = chats.length;
  const totalMessages = chats.reduce((sum, chat) => sum + (chat.messages?.length || 0), 0);
  const avgMessagesPerChat = Math.round(totalMessages / totalChats);
  
  // API calls (AI responses)
  const totalApiCalls = chats.reduce((sum, chat) => 
    sum + (chat.messages?.filter(msg => msg.sender === 'ai').length || 0), 0
  );

  // Daily activity
  const dailyStats = getDailyStats(chats);
  
  // Topic analysis
  const topicAnalysis = getTopicAnalysis(chats);
  
  // Engagement metrics
  const engagementMetrics = getEngagementMetrics(chats);
  
  // Recent activity
  const recentActivity = getRecentActivity(chats);

  return {
    totalChats,
    totalMessages,
    avgMessagesPerChat,
    totalApiCalls,
    dailyStats,
    topicAnalysis,
    engagementMetrics,
    recentActivity
  };
};

const getDailyStats = (chats) => {
  const last7Days = [];
  const today = new Date();
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    
    const dayChats = chats.filter(chat => {
      const chatDate = new Date(chat.createdAt).toISOString().split('T')[0];
      return chatDate === dateStr;
    });
    
    const dayMessages = dayChats.reduce((sum, chat) => sum + (chat.messages?.length || 0), 0);
    const dayApiCalls = dayChats.reduce((sum, chat) => 
      sum + (chat.messages?.filter(msg => msg.sender === 'ai').length || 0), 0
    );
    
    last7Days.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      chats: dayChats.length,
      messages: dayMessages,
      apiCalls: dayApiCalls
    });
  }
  
  return last7Days;
};

const getTopicAnalysis = (chats) => {
  const constructionKeywords = {
    'Materials': ['concrete', 'steel', 'wood', 'brick', 'material', 'cement', 'rebar', 'lumber'],
    'Planning': ['planning', 'schedule', 'timeline', 'project', 'plan', 'methodology', 'management'],
    'Regulations': ['regulation', 'code', 'building code', 'permit', 'compliance', 'safety', 'standard'],
    'Cost Management': ['cost', 'budget', 'price', 'expense', 'optimization', 'waste', 'efficiency'],
    'Construction Methods': ['construction', 'building', 'foundation', 'structure', 'technique', 'method'],
    'Sustainability': ['sustainable', 'green', 'environmental', 'energy', 'efficient', 'eco']
  };

  const topics = {};
  
  Object.keys(constructionKeywords).forEach(topic => {
    topics[topic] = 0;
  });

  chats.forEach(chat => {
    chat.messages?.forEach(message => {
      const text = message.text.toLowerCase();
      
      Object.entries(constructionKeywords).forEach(([topic, keywords]) => {
        keywords.forEach(keyword => {
          if (text.includes(keyword)) {
            topics[topic]++;
          }
        });
      });
    });
  });

  return topics;
};

const getEngagementMetrics = (chats) => {
  const conversationLengths = chats.map(chat => chat.messages?.length || 0);
  const avgConversationLength = conversationLengths.length > 0 
    ? Math.round(conversationLengths.reduce((a, b) => a + b, 0) / conversationLengths.length)
    : 0;
  
  const longConversations = conversationLengths.filter(length => length > 10).length;
  const shortConversations = conversationLengths.filter(length => length <= 3).length;
  
  // Calculate average response times (simulated)
  const avgResponseTime = Math.round(Math.random() * 2000 + 1000); // 1-3 seconds simulation
  
  return {
    avgConversationLength,
    longConversations,
    shortConversations,
    avgResponseTime,
    totalConversations: chats.length
  };
};

const getRecentActivity = (chats) => {
  return chats
    .sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt))
    .slice(0, 5)
    .map(chat => ({
      id: chat.id,
      title: chat.title,
      lastActive: new Date(chat.updatedAt || chat.createdAt).toLocaleDateString(),
      messageCount: chat.messages?.length || 0
    }));
};