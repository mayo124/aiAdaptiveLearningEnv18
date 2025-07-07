import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Lightbulb, X, Loader2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface TextSelectionAnalogyProps {
  selectedText: string;
  position: { x: number; y: number };
  onClose: () => void;
}

const TextSelectionAnalogy = ({ selectedText, position, onClose }: TextSelectionAnalogyProps) => {
  const [analogy, setAnalogy] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const { translate } = useLanguage();

  useEffect(() => {
    if (selectedText) {
      fetchAnalogy();
    }
  }, [selectedText]);

  const fetchAnalogy = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3001/api/analogy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: selectedText })
      });

      const data = await response.json();

      if (data.success) {
        setAnalogy(data.analogy);
      } else {
        setAnalogy('Sorry, I couldn\'t generate an analogy for this text. Please try again.');
      }
    } catch (error) {
      setAnalogy('Failed to connect to the server. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card 
      className="fixed z-50 w-80 bg-white/95 backdrop-blur-sm border-navy-300 shadow-xl animate-fade-in"
      style={{
        left: Math.min(position.x, window.innerWidth - 320),
        top: Math.min(position.y, window.innerHeight - 200),
      }}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-navy-700 text-lg flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            {translate('askAnalogy')}
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="p-3 bg-cream-100 rounded-lg border-l-4 border-navy-600">
            <p className="text-sm font-medium text-navy-700 mb-1">Selected Text:</p>
            <p className="text-sm text-gray-700 italic">"{selectedText}"</p>
          </div>
          
          {loading ? (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="h-5 w-5 animate-spin mr-2" />
              <span className="text-sm">Generating analogy...</span>
            </div>
          ) : analogy ? (
            <div className="p-3 bg-navy-50 rounded-lg">
              <p className="text-sm font-medium text-navy-700 mb-2">Analogy:</p>
              <p className="text-sm text-gray-700 leading-relaxed">{analogy}</p>
            </div>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
};

export default TextSelectionAnalogy;
