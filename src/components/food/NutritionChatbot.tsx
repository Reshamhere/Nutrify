import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Send, Leaf } from 'lucide-react';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export const NutritionChatbot = () => {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // System prompt to enforce nutrition-only responses
  const SYSTEM_PROMPT = `You are a nutrition expert AI assistant. You must ONLY answer questions related to:
- Food and nutrition
- Healthy eating
- Meal planning
- Dietary requirements
- Food science
- Weight management
- Recipe suggestions

Give short responses of 2 to 3 sentences and avoid unnecessary details. Do not provide any disclaimers or additional information outside of the nutrition domain.
For any other topics, respond with: "I'm sorry, I can only answer questions about nutrition and healthy eating".

"`;
  
  const sendMessage = async () => {
    if (!message.trim() || isLoading) return;

    // Add user message to chat
    const userMessage: ChatMessage = { role: 'user', content: message };
    setChatHistory(prev => [...prev, userMessage]);
    setMessage('');
    setIsLoading(true);

    try {
      const response = await fetch(import.meta.env.VITE_AZURE_VISION_API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_AZURE_VISION_API_KEY}`
        },
        body: JSON.stringify({
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            ...chatHistory.map(msg => ({ role: msg.role, content: msg.content })),
            { role: 'user', content: message }
          ],
          max_tokens: 150,
          temperature: 0.7
        })
      });

      if (!response.ok) throw new Error('Failed to get response');

      const data = await response.json();
      const aiResponse = data.choices[0]?.message?.content || "I couldn't process that request.";

      setChatHistory(prev => [...prev, { role: 'assistant', content: aiResponse }]);
    } catch (error) {
      console.error('Chat error:', error);
      toast({
        title: "Error",
        description: "Failed to get response. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <div className="flex items-center gap-2 mb-4 p-4 border-b border-border/40">
        <Leaf className="h-6 w-6 text-primary" />
        <h2 className="text-xl font-semibold">Nutrition Assistant</h2>
      </div>

      {/* Chat Messages */}
      <div className="flex-grow overflow-y-auto p-4 space-y-4">
        {chatHistory.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
            <Leaf className="h-10 w-10 mb-4" />
            <p className="text-lg">Ask me anything about nutrition!</p>
            <p className="text-sm">I can help with meal plans, food facts, and healthy eating tips.</p>
          </div>
        ) : (
          chatHistory.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-4 ${
                  msg.role === 'user'
                    ? 'bg-primary/10 text-primary rounded-br-none'
                    : 'bg-muted/50 text-foreground rounded-bl-none'
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-border/40">
        <div className="flex gap-2">
          <Input
            placeholder="Ask a nutrition question..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            disabled={isLoading}
          />
          <Button
            onClick={sendMessage}
            disabled={isLoading || !message.trim()}
            size="icon"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2 text-center">
          I can only answer questions about nutrition and healthy eating
        </p>
      </div>
    </div>
  );
};

export default NutritionChatbot;