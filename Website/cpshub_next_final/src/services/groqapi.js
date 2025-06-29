const formatMessages = (messages) => {
  const formattedMessages = [
    {
      role: 'system',
      content: `You are a helpful AI assistant specialized in the construction industry. Provide accurate information about construction materials, project management, regulations, best practices, and related topics.

Format your responses with proper structure for readability:
- For numbered methodologies, use this format: "1. Method Name" on one line, followed by the description on a new line
- Separate different numbered items with a blank line between them
- Put each numbered method on its own line, don't combine multiple methods in one paragraph
- For section headers use double asterisks like: **Main Section Headers:**
- Use double line breaks between sections

For example, format methodology lists like this:
1. Traditional Method
Detailed description of the traditional method goes here.

2. Agile Method
Detailed description of the agile method goes here.

Provide well-structured responses with clear separation between sections and proper formatting of numbered items.`
    }
  ];

  messages.forEach(msg => {
    formattedMessages.push({
      role: msg.sender === 'user' ? 'user' : 'assistant',
      content: msg.text
    });
  });

  return formattedMessages;
};

export const getAIResponse = async (messages) => {
  try {
    // Call our Next.js API route instead of directly calling Groq
    const response = await fetch('/api/ai/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: formatMessages(messages)
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`API Error: ${response.status} - ${errorData.error || 'Unknown error'}`);
    }
    
    const data = await response.json();
    return data.content;
    
  } catch (error) {
    console.error('Error getting AI response:', error);
    return 'I apologize, but I encountered an error. Please try again later.';
  }
};