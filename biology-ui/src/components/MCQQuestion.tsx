import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Brain, CheckCircle, XCircle, RotateCcw } from 'lucide-react';

interface MCQQuestionProps {
  mcqText: string;
  onAnswered?: () => void;
  onSkipped?: () => void;
}

interface ParsedMCQ {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation?: string;
}

const MCQQuestion = ({ mcqText, onAnswered, onSkipped }: MCQQuestionProps) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [parsedMCQ, setParsedMCQ] = useState<ParsedMCQ | null>(null);

  // Parse the MCQ text when component mounts or mcqText changes
  useEffect(() => {
    const parsed = parseMCQText(mcqText);
    setParsedMCQ(parsed);
    // Reset state when mcqText changes
    setSelectedAnswer(null);
    setShowResult(false);
  }, [mcqText]);

  const parseMCQText = (text: string): ParsedMCQ | null => {
    try {
      // Split the text into lines and clean them
      const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
      
      let question = '';
      const options: string[] = [];
      let correctAnswer = '';
      let explanation = '';
      
      let currentSection = 'question';
      
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        
        // Skip empty lines, markdown formatting, and common prefixes
        if (!line || line.startsWith('---') || line.startsWith('**') || line.startsWith('*')) {
          continue;
        }
        
        // Check for different sections with more flexible matching
        if (line.toLowerCase().includes('question') && line.includes(':')) {
          currentSection = 'question';
          question = line.replace(/.*question:?\s*/i, '').trim();
          continue;
        }
        
        if (line.toLowerCase().includes('options') || line.toLowerCase().includes('choices')) {
          currentSection = 'options';
          continue;
        }
        
        if (line.toLowerCase().includes('correct answer') || (line.toLowerCase().includes('answer') && line.includes(':'))) {
          currentSection = 'answer';
          correctAnswer = line.replace(/.*answer:?\s*/i, '').trim();
          // Extract just the letter if it's in format "A) text" or "A. text" or just "A"
          const answerMatch = correctAnswer.match(/([A-D])/);
          if (answerMatch) {
            correctAnswer = answerMatch[1];
          }
          continue;
        }
        
        if (line.toLowerCase().includes('explanation')) {
          currentSection = 'explanation';
          explanation = line.replace(/.*explanation:?\s*/i, '').trim();
          continue;
        }
        
        // Process content based on current section
        if (currentSection === 'question' && !question) {
          question = line;
        } else if (currentSection === 'question' && question && !line.match(/^[A-D][.)]/)) {
          question += ' ' + line;
        } else if (currentSection === 'options' || line.match(/^[A-D][.)]/)) {
          // Match options like "A) text", "A. text"
          if (line.match(/^[A-D][.)]/)) {
            options.push(line);
            currentSection = 'options'; // Switch to options if we find an option
          } else if (options.length > 0 && !line.match(/^[A-D]/) && currentSection === 'options') {
            // Continue previous option
            options[options.length - 1] += ' ' + line;
          }
        } else if (currentSection === 'explanation') {
          explanation += ' ' + line;
        }
      }
      
      // If we couldn't parse properly, try a simpler approach
      if (!question || options.length === 0) {
        return parseSimpleMCQ(text);
      }
      
      return {
        question: question.trim(),
        options: options.filter(opt => opt.length > 0),
        correctAnswer: correctAnswer.trim(),
        explanation: explanation.trim() || undefined
      };
    } catch (error) {
      console.error('Error parsing MCQ:', error);
      return parseSimpleMCQ(text);
    }
  };

  const parseSimpleMCQ = (text: string): ParsedMCQ | null => {
    
    // Fallback: try to extract at least some structure
    const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    
    if (lines.length < 2) {
      return null;
    }
    
    let question = '';
    const options: string[] = [];
    let correctAnswer = '';
    let explanation = '';
    
    // More aggressive parsing
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // Skip markdown and formatting
      if (line.startsWith('**') || line.startsWith('*') || line.startsWith('---')) {
        continue;
      }
      
      // If it looks like an option (A), B), C), D))
      if (line.match(/^[A-D][.)]/)) {
        options.push(line);
        continue;
      }
      
      // If it mentions answer or correct
      if (line.toLowerCase().includes('answer') || line.toLowerCase().includes('correct')) {
        const match = line.match(/([A-D])/);
        if (match) {
          correctAnswer = match[1];
        }
        continue;
      }
      
      // If it mentions explanation
      if (line.toLowerCase().includes('explanation')) {
        explanation = line.replace(/.*explanation:?\s*/i, '').trim();
        continue;
      }
      
      // If we don't have a question yet and this doesn't look like an option
      if (!question && !line.match(/^[A-D][.)]/) && line.length > 10) {
        question = line.replace(/^(question:?\s*)/i, '').trim();
      }
    }
    
    // If still no question, use the first substantial line
    if (!question && lines.length > 0) {
      question = lines.find(line => 
        line.length > 10 && 
        !line.match(/^[A-D][.)]/) && 
        !line.toLowerCase().includes('answer') &&
        !line.startsWith('**')
      ) || lines[0];
    }
    
    return {
      question: question || 'Unable to parse question',
      options: options.length > 0 ? options : ['Unable to parse options'],
      correctAnswer: correctAnswer || 'A',
      explanation: explanation || undefined
    };
  };

  const handleAnswerSelect = (option: string) => {
    if (showResult) return;
    
    // Extract the letter from the option (A, B, C, D)
    const letterMatch = option.match(/^([A-D])[.)]/);
    const selectedLetter = letterMatch ? letterMatch[1] : option;
    
    setSelectedAnswer(selectedLetter);
  };

  const handleSubmit = () => {
    if (selectedAnswer) {
      setShowResult(true);
      // Call onAnswered callback after a short delay to show the result
      setTimeout(() => {
        onAnswered?.();
      }, 2000);
    }
  };

  const handleSkip = () => {
    onSkipped?.();
  };

  const handleReset = () => {
    setSelectedAnswer(null);
    setShowResult(false);
  };

  const isCorrect = selectedAnswer === parsedMCQ?.correctAnswer;

  if (!parsedMCQ) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-navy-700">
            <Brain className="h-5 w-5" />
            Test Your Understanding
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <p className="text-yellow-700">Unable to parse the MCQ question. Here's the original text:</p>
            <pre className="mt-2 text-gray-700 whitespace-pre-wrap font-sans text-sm">
              {mcqText}
            </pre>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-navy-700">
          <Brain className="h-5 w-5" />
          Test Your Understanding
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Question */}
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="font-medium text-gray-800 mb-3">{parsedMCQ.question}</h4>
            
            {/* Options */}
            <div className="space-y-2">
              {parsedMCQ.options.map((option, index) => {
                const letterMatch = option.match(/^([A-D])[.)]/);
                const letter = letterMatch ? letterMatch[1] : String.fromCharCode(65 + index);
                const optionText = letterMatch ? option : `${letter}) ${option}`;
                
                const isSelected = selectedAnswer === letter;
                const isCorrectOption = letter === parsedMCQ.correctAnswer;
                
                let buttonVariant: "default" | "outline" | "secondary" = "outline";
                let buttonClass = "w-full text-left justify-start p-4 h-auto";
                
                if (showResult) {
                  if (isCorrectOption) {
                    buttonClass += " bg-green-50 border-green-300 text-green-800 hover:bg-green-50";
                  } else if (isSelected && !isCorrectOption) {
                    buttonClass += " bg-red-50 border-red-300 text-red-800 hover:bg-red-50";
                  }
                } else if (isSelected) {
                  buttonVariant = "default";
                }
                
                return (
                  <Button
                    key={index}
                    variant={buttonVariant}
                    className={buttonClass}
                    onClick={() => handleAnswerSelect(letter)}
                    disabled={showResult}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span>{optionText}</span>
                      {showResult && isCorrectOption && (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      )}
                      {showResult && isSelected && !isCorrectOption && (
                        <XCircle className="h-5 w-5 text-red-600" />
                      )}
                    </div>
                  </Button>
                );
              })}
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex gap-2 justify-between">
            <div className="flex gap-2">
              {!showResult ? (
                <>
                  <Button 
                    onClick={handleSubmit} 
                    disabled={!selectedAnswer}
                    className="bg-navy-600 hover:bg-navy-700"
                  >
                    Submit Answer
                  </Button>
                  <Button 
                    onClick={handleSkip} 
                    variant="outline"
                    className="text-gray-600 hover:text-gray-800"
                  >
                    ✕ Skip Question
                  </Button>
                </>
              ) : (
                <Button 
                  onClick={handleReset} 
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <RotateCcw className="h-4 w-4" />
                  Try Again
                </Button>
              )}
            </div>
          </div>
          
          {/* Result */}
          {showResult && (
            <div className={`p-4 rounded-lg border ${
              isCorrect 
                ? 'bg-green-50 border-green-200' 
                : 'bg-red-50 border-red-200'
            }`}>
              <div className="flex items-center gap-2 mb-2">
                {isCorrect ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-600" />
                )}
                <Badge variant={isCorrect ? "default" : "destructive"}>
                  {isCorrect ? 'Correct!' : 'Incorrect'}
                </Badge>
              </div>
              
              {!isCorrect && (
                <p className="text-sm text-gray-700 mb-2">
                  The correct answer is <strong>{parsedMCQ.correctAnswer}</strong>
                </p>
              )}
              
              {parsedMCQ.explanation && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <p className="text-sm text-gray-700">
                    <strong>Explanation:</strong> {parsedMCQ.explanation}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MCQQuestion;
