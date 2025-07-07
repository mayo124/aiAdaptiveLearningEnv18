import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, BookOpen, Globe, Lightbulb, Shuffle } from 'lucide-react';

interface WordExplanation {
  word: string;
  explanation: string;
  context: string;
  etymology: string;
  alternatives: string[];
  category?: string;
}

interface WordExplanationTooltipProps {
  word: string;
  position: { x: number; y: number };
  onClose: () => void;
  visible: boolean;
}

export const WordExplanationTooltip: React.FC<WordExplanationTooltipProps> = ({
  word,
  position,
  onClose,
  visible
}) => {
  const [explanation, setExplanation] = useState<WordExplanation | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (visible && word) {
      fetchWordExplanation(word);
    }
  }, [word, visible]);

  const fetchWordExplanation = async (selectedWord: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:3001/api/biology/word-explanation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          word: selectedWord,
          context: 'biology' // We can make this dynamic based on the current content
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch word explanation');
      }

      const data = await response.json();
      
      if (data.success) {
        // Parse the AI response to extract structured information
        const parsed = parseAIResponse(data.explanation);
        setExplanation(parsed);
      } else {
        setError(data.error || 'Failed to get explanation');
      }
    } catch (error) {
      console.error('Word explanation error:', error);
      setError('Unable to fetch word explanation');
    } finally {
      setLoading(false);
    }
  };

  const parseAIResponse = (aiResponse: string): WordExplanation => {
    // Parse the AI response to extract structured data
    const lines = aiResponse.split('\n');
    let explanation = '';
    let context = '';
    let etymology = '';
    let alternatives: string[] = [];

    for (const line of lines) {
      if (line.startsWith('Explanation:')) {
        explanation = line.replace('Explanation:', '').trim();
      } else if (line.startsWith('Context:')) {
        context = line.replace('Context:', '').trim();
      } else if (line.startsWith('Etymology:')) {
        etymology = line.replace('Etymology:', '').trim();
      } else if (line.startsWith('Alternative Words:')) {
        const alts = line.replace('Alternative Words:', '').trim();
        alternatives = alts.split(',').map(alt => alt.trim());
      }
    }

    return {
      word,
      explanation: explanation || aiResponse.substring(0, 200) + '...',
      context: context || 'Used in biology context',
      etymology: etymology || 'Etymology information available',
      alternatives: alternatives.length > 0 ? alternatives : ['synonym1', 'synonym2'],
      category: 'Biology Term'
    };
  };

  if (!visible) return null;

  // Calculate position to keep tooltip on screen
  const tooltipStyle = {
    position: 'fixed' as const,
    left: Math.min(position.x, window.innerWidth - 320),
    top: Math.min(position.y + 20, window.innerHeight - 300),
    zIndex: 1000,
    maxWidth: '320px',
  };

  return (
    <div 
      style={tooltipStyle}
      className="animate-fade-in"
      onMouseEnter={() => {/* Keep tooltip open when hovering over it */}}
      onMouseLeave={onClose}
    >
      <Card className="shadow-lg border-2 border-blue-200 bg-white/95 backdrop-blur-sm">
        <CardContent className="p-4 space-y-3">
          {loading ? (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
              <span className="ml-2 text-sm text-gray-600">Getting explanation...</span>
            </div>
          ) : error ? (
            <div className="text-center py-4">
              <p className="text-red-500 text-sm">{error}</p>
              <button 
                onClick={() => fetchWordExplanation(word)}
                className="mt-2 text-blue-500 text-sm underline"
              >
                Try again
              </button>
            </div>
          ) : explanation ? (
            <>
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <h3 className="font-bold text-lg text-gray-800">{explanation.word}</h3>
                  {explanation.category && (
                    <Badge variant="secondary" className="text-xs">
                      {explanation.category}
                    </Badge>
                  )}
                </div>
                <button 
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600 text-xl"
                >
                  ×
                </button>
              </div>

              {/* Explanation */}
              <div className="space-y-2">
                <div className="flex items-start space-x-2">
                  <BookOpen className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-gray-700 leading-relaxed">
                    <strong>Definition:</strong> {explanation.explanation}
                  </p>
                </div>

                {/* Context */}
                <div className="flex items-start space-x-2">
                  <Lightbulb className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-gray-600">
                    <strong>Context:</strong> {explanation.context}
                  </p>
                </div>

                {/* Etymology */}
                <div className="flex items-start space-x-2">
                  <Globe className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-gray-600">
                    <strong>Etymology:</strong> {explanation.etymology}
                  </p>
                </div>

                {/* Alternative Words */}
                {explanation.alternatives.length > 0 && (
                  <div className="flex items-start space-x-2">
                    <Shuffle className="h-4 w-4 text-purple-500 mt-0.5 flex-shrink-0" />
                    <div className="text-sm">
                      <strong className="text-gray-700">Alternatives:</strong>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {explanation.alternatives.map((alt, index) => (
                          <Badge 
                            key={index} 
                            variant="outline" 
                            className="text-xs bg-purple-50 border-purple-200"
                          >
                            {alt}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="pt-2 border-t border-gray-100">
                <p className="text-xs text-gray-400 text-center">
                  💡 Hover over words to learn more • AI-powered explanations
                </p>
              </div>
            </>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
};

export default WordExplanationTooltip;
