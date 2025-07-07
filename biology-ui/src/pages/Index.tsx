
import { useState, useRef, useEffect } from 'react';
import SearchHeader from '@/components/SearchHeader';
import ResourceCard from '@/components/ResourceCard';
import DocumentViewer from '@/components/DocumentViewer';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import MCQQuestion from '@/components/MCQQuestion';
import LearningPathways from '@/components/LearningPathways';
import { useLanguage } from '@/contexts/LanguageContext';
import { SelectionChatbot } from '@/components/SelectionChatbot';
import { TopicImageDisplay } from '@/components/TopicImageDisplay';
import { biologyLearnAPI } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, BookOpen, ArrowRight, Brain, Clock } from 'lucide-react';

interface BiologyTopicResult {
  topic: string;
  introduction: string;
  learningPathways: string[];
  mcqQuestion: string;
  sources: string[];
  responseTime: number;
  timestamp: string;
}

interface Resource {
  id: string;
  title: string;
  description: string;
  type: string;
  lastModified: string;
  content: string;
}

const Index = () => {
  const [currentView, setCurrentView] = useState<'search' | 'learning'>('search');
  const [biologyResults, setBiologyResults] = useState<BiologyTopicResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [chatbotVisible, setChatbotVisible] = useState(false);
  const [mcqCompletedForTopic, setMcqCompletedForTopic] = useState<{ [key: number]: boolean }>({});
  const { translate } = useLanguage();
  
  // Refs for auto-scrolling
  const newContentRef = useRef<HTMLDivElement>(null);
  const learningPathwaysRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll to new content when biology results are added
  useEffect(() => {
    if (biologyResults.length > 0 && newContentRef.current) {
      // Wait a bit longer for content to fully load and render
      setTimeout(() => {
        newContentRef.current?.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start',
          inline: 'nearest'
        });
      }, 500);
    }
  }, [biologyResults.length]);
  
  // Auto-scroll to learning pathways when they unlock
  useEffect(() => {
    const hasAnyCompleted = Object.values(mcqCompletedForTopic).some(completed => completed);
    if (hasAnyCompleted && learningPathwaysRef.current) {
      setTimeout(() => {
        learningPathwaysRef.current?.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center',
          inline: 'nearest'
        });
      }, 500);
    }
  }, [mcqCompletedForTopic]);

  // Example biology topics
  const exampleTopics = [
    { id: '1', title: 'DNA Structure', description: 'Learn about the double helix and genetic code' },
    { id: '2', title: 'Photosynthesis', description: 'Understand how plants convert light into energy' },
    { id: '3', title: 'Cell Division', description: 'Explore mitosis and meiosis processes' },
    { id: '4', title: 'Enzymes', description: 'Discover how biological catalysts work' },
    { id: '5', title: 'Evolution', description: 'Study natural selection and adaptation' },
    { id: '6', title: 'Ecosystems', description: 'Learn about ecological relationships' }
  ];

  const handleTopicSearch = async (topic: string) => {
    if (!topic.trim()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const data = await biologyLearnAPI(topic.trim());
      
      if (data.success) {
        // Add new result to the array instead of replacing
        setBiologyResults(prevResults => [...prevResults, data]);
        setCurrentView('learning');
      } else {
        setError(data.error || 'Failed to get biology content');
      }
    } catch (err) {
      setError('Failed to connect to the server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleExampleClick = (title: string) => {
    handleTopicSearch(title);
  };

  const handleBackToSearch = () => {
    setCurrentView('search');
    setBiologyResults([]);
    setError(null);
    setMcqCompletedForTopic({});
  };

  const handleMcqCompleted = (topicIndex: number) => {
    setMcqCompletedForTopic(prev => ({ ...prev, [topicIndex]: true }));
  };

  const handleMcqSkipped = (topicIndex: number) => {
    setMcqCompletedForTopic(prev => ({ ...prev, [topicIndex]: true }));
  };

  if (currentView === 'learning' && biologyResults.length > 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cream-50 via-cream-100 to-cream-200">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-6">
            <Button 
              onClick={handleBackToSearch}
              variant="outline"
            >
              ← Back to Topics
            </Button>
            <div className="text-sm text-gray-600">
              Learning Journey: {biologyResults.length} topic{biologyResults.length > 1 ? 's' : ''} explored
            </div>
          </div>
          
          <div className="max-w-4xl mx-auto space-y-8">
            {biologyResults.map((biologyResult, resultIndex) => (
              <div 
                key={resultIndex} 
                className="space-y-6"
                ref={resultIndex === biologyResults.length - 1 ? newContentRef : null}
              >
                {/* Header */}
                <Card className={`border-navy-200 ${resultIndex === biologyResults.length - 1 ? 'animate-fade-in' : ''}`}>
                  <CardHeader className="bg-gradient-to-r from-navy-600 to-navy-700 text-white rounded-t-lg">
                    <CardTitle className="flex items-center gap-2">
                      <Brain className="h-6 w-6" />
                      {biologyResult.topic}
                      {resultIndex > 0 && (
                        <span className="text-sm bg-navy-800 px-2 py-1 rounded ml-2">
                          Step {resultIndex + 1}
                        </span>
                      )}
                    </CardTitle>
                    <CardDescription className="text-navy-100 flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Response time: {(biologyResult.responseTime / 1000).toFixed(1)}s
                    </CardDescription>
                  </CardHeader>
                </Card>
                
                {/* Introduction */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-navy-700">
                      <BookOpen className="h-5 w-5" />
                      Introduction
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-gray-700 leading-relaxed whitespace-pre-line select-text">
                      {biologyResult.introduction}
                    </div>
                  </CardContent>
                </Card>
                
                {/* Visual Learning Images */}
                <TopicImageDisplay 
                  topic={biologyResult.topic}
                  className=""
                />
                
                {/* MCQ Question */}
                {biologyResult.mcqQuestion && (
                  <MCQQuestion 
                    mcqText={biologyResult.mcqQuestion} 
                    onAnswered={() => handleMcqCompleted(resultIndex)}
                    onSkipped={() => handleMcqSkipped(resultIndex)}
                  />
                )}
                
                {/* Learning Pathways - Show only after MCQ is completed/skipped */}
                {mcqCompletedForTopic[resultIndex] ? (
                  <div ref={learningPathwaysRef}>
                    <LearningPathways 
                      pathways={biologyResult.learningPathways} 
                      onPathwayClick={handleTopicSearch}
                    />
                  </div>
                ) : biologyResult.mcqQuestion && (
                  <Card className="border-dashed border-2 border-gray-300 bg-gray-50">
                    <CardContent className="p-6 text-center">
                      <div className="flex items-center justify-center gap-2 text-gray-500">
                        <BookOpen className="h-5 w-5" />
                        <span className="font-medium">Learning Pathways Awaiting</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-2">
                        Complete or skip the quiz above to unlock personalized learning recommendations
                      </p>
                    </CardContent>
                  </Card>
                )}
                
                {/* Sources */}
                {biologyResult.sources.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-navy-700">Sources</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {biologyResult.sources.map((source, index) => (
                          <div key={index} className="text-sm text-gray-600 p-2 bg-gray-50 rounded">
                            {source}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
                
                {/* Separator between topics (except last one) */}
                {resultIndex < biologyResults.length - 1 && (
                  <div className="border-t-2 border-dashed border-navy-200 my-8 pt-2">
                    <div className="text-center text-sm text-gray-500 bg-white px-4 py-2 rounded-full mx-auto w-fit">
                      Continue Learning Journey ↓
                    </div>
                  </div>
                )}
              </div>
            ))}
            
            {/* Loading indicator for new content */}
            {loading && (
              <Card className="border-dashed border-2 border-gray-300">
                <CardContent className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin mr-2" />
                  <span>Loading next topic...</span>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
        
        {/* Selection Chatbot */}
        <SelectionChatbot
          isVisible={chatbotVisible}
          onToggle={() => setChatbotVisible(!chatbotVisible)}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream-50 via-cream-100 to-cream-200">
      {/* Header with language switcher */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-sm border-b border-cream-300">
        <div className="container mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-navy-700 flex items-center gap-2">
              <Brain className="h-8 w-8" />
              Biology Learning RAG
            </h1>
            <LanguageSwitcher />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Search Section */}
        <div className="flex items-center justify-center min-h-[40vh] mb-12">
          <div className="w-full max-w-2xl">
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold text-navy-700 mb-4">
                Explore Biology Topics
              </h2>
              <p className="text-lg text-gray-600">
                Get comprehensive introductions, learning pathways, and quiz questions
              </p>
            </div>
            <SearchHeader onSearch={handleTopicSearch} />
            
            {loading && (
              <div className="flex items-center justify-center mt-6">
                <Loader2 className="h-6 w-6 animate-spin mr-2" />
                <span>Generating biology content...</span>
              </div>
            )}
            
            {error && (
              <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600">{error}</p>
              </div>
            )}
          </div>
        </div>

        {/* Example Topics */}
        <div className="max-w-6xl mx-auto">
          <h3 className="text-2xl font-semibold text-navy-700 mb-6 text-center">
            Popular Biology Topics
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {exampleTopics.map((topic) => (
              <Card 
                key={topic.id} 
                className="cursor-pointer hover:shadow-lg transition-shadow border-cream-300 hover:border-navy-300"
                onClick={() => handleExampleClick(topic.title)}
              >
                <CardHeader>
                  <CardTitle className="text-navy-700 flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    {topic.title}
                  </CardTitle>
                  <CardDescription className="select-text">
                    {topic.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Badge variant="secondary" className="bg-cream-200 text-navy-700">
                    Click to explore
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
      
      {/* Selection Chatbot */}
      <SelectionChatbot
        isVisible={chatbotVisible}
        onToggle={() => setChatbotVisible(!chatbotVisible)}
      />
    </div>
  );
};

export default Index;
