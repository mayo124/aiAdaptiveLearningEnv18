import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { wordExplanationAPI } from '@/lib/api';
import { 
  MessageCircle, 
  Send, 
  X, 
  Minimize2, 
  Maximize2, 
  Copy, 
  Lightbulb,
  BookOpen,
  HelpCircle
} from 'lucide-react';

interface ChatMessage {
  id: string;
  type: 'user' | 'ai' | 'selection';
  content: string;
  timestamp: Date;
  selectedText?: string;
}

interface SelectionChatbotProps {
  isVisible: boolean;
  onToggle: () => void;
}

export const SelectionChatbot: React.FC<SelectionChatbotProps> = ({
  isVisible,
  onToggle
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'ai',
      content: '👋 Hi! I\'m your Biology Learning Assistant. Select any text on the page, and I\'ll help explain it! You can also ask me questions directly.',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [selectedText, setSelectedText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Handle text selection
  useEffect(() => {
    const handleSelection = () => {
      const selection = window.getSelection();
      const text = selection?.toString().trim();
      
      if (text && text.length > 2) {
        setSelectedText(text);
        // Auto-open chatbot when text is selected
        if (!isVisible) {
          onToggle();
        }
      }
    };

    document.addEventListener('mouseup', handleSelection);
    document.addEventListener('keyup', handleSelection);

    return () => {
      document.removeEventListener('mouseup', handleSelection);
      document.removeEventListener('keyup', handleSelection);
    };
  }, [isVisible, onToggle]);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when chatbot opens
  useEffect(() => {
    if (isVisible && !isMinimized) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isVisible, isMinimized]);

  const sendMessage = async (content: string, isSelection = false) => {
    if (!content.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: isSelection ? 'selection' : 'user',
      content: content,
      timestamp: new Date(),
      selectedText: isSelection ? selectedText : undefined
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Prepare the prompt based on whether it's a selection or regular question
      let prompt = content;
      if (isSelection) {
        prompt = `Please explain this text from a biology context: "${selectedText}"\n\nUser's question: ${content}`;
      }

      const data = await wordExplanationAPI(prompt, 'biology learning assistant');

      if (data.success) {
        const aiMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          type: 'ai',
          content: data.explanation,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, aiMessage]);
      } else {
        throw new Error(data.error || 'AI response failed');
      }
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: '❌ Sorry, I couldn\'t process your request. Please try again or check if the server is running.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputMessage);
  };

  const handleSelectionQuestion = (question: string) => {
    sendMessage(question, true);
    setSelectedText('');
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const formatTimestamp = (timestamp: Date) => {
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (!isVisible) {
    return (
      <Button
        onClick={onToggle}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg z-50"
        size="sm"
      >
        <MessageCircle className="h-6 w-6 text-white" />
      </Button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Card className={`w-96 shadow-xl border-2 border-blue-200 ${isMinimized ? 'h-16' : 'h-[600px]'} transition-all duration-300`}>
        {/* Header */}
        <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Biology Assistant
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMinimized(!isMinimized)}
              className="text-white hover:bg-blue-800 h-8 w-8 p-0"
            >
              {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggle}
              className="text-white hover:bg-blue-800 h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        {!isMinimized && (
          <>
            {/* Selection Prompt */}
            {selectedText && (
              <div className="p-4 bg-yellow-50 border-b">
                <div className="text-sm text-yellow-800 mb-2">
                  <Lightbulb className="h-4 w-4 inline mr-1" />
                  You selected: <strong>"{selectedText.substring(0, 50)}{selectedText.length > 50 ? '...' : ''}"</strong>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleSelectionQuestion('What does this mean?')}
                    className="text-xs"
                  >
                    <HelpCircle className="h-3 w-3 mr-1" />
                    Explain this
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleSelectionQuestion('Give me more details about this concept')}
                    className="text-xs"
                  >
                    <BookOpen className="h-3 w-3 mr-1" />
                    More details
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleSelectionQuestion('How does this relate to other biology concepts?')}
                    className="text-xs"
                  >
                    <Lightbulb className="h-3 w-3 mr-1" />
                    Connections
                  </Button>
                </div>
              </div>
            )}

            {/* Messages */}
            <CardContent className="flex-1 overflow-y-auto p-4 space-y-4 h-[400px]">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' || message.type === 'selection' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.type === 'ai'
                        ? 'bg-gray-100 text-gray-800'
                        : message.type === 'selection'
                        ? 'bg-yellow-500 text-white'
                        : 'bg-blue-600 text-white'
                    }`}
                  >
                    {message.type === 'selection' && message.selectedText && (
                      <div className="text-xs opacity-75 mb-1">
                        Selected: "{message.selectedText.substring(0, 30)}..."
                      </div>
                    )}
                    <div className="text-sm whitespace-pre-wrap">{message.content}</div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs opacity-75">
                        {formatTimestamp(message.timestamp)}
                      </span>
                      {message.type === 'ai' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(message.content)}
                          className="h-6 w-6 p-0 opacity-75 hover:opacity-100"
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 rounded-lg p-3 text-gray-600">
                    <div className="flex items-center gap-2">
                      <div className="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                      Thinking...
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </CardContent>

            {/* Input */}
            <div className="p-4 border-t">
              <form onSubmit={handleSubmit} className="flex gap-2">
                <Input
                  ref={inputRef}
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Ask me about biology..."
                  className="flex-1"
                  disabled={isLoading}
                />
                <Button
                  type="submit"
                  disabled={!inputMessage.trim() || isLoading}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </>
        )}
      </Card>
    </div>
  );
};

export default SelectionChatbot;
