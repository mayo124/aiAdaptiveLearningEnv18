import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, BookOpen, Lightbulb } from 'lucide-react';

interface LearningPathwaysProps {
  pathways: string[];
  onPathwayClick: (topic: string) => void;
}

const LearningPathways = ({ pathways, onPathwayClick }: LearningPathwaysProps) => {
  if (!pathways || pathways.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-navy-700">
          <Lightbulb className="h-5 w-5" />
          Explore Related Topics
        </CardTitle>
        <CardDescription>
          Click on any pathway to dive deeper into these closely related concepts
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {pathways.map((pathway, index) => {
            // Extract the main topic from the pathway (text before the colon)
            const topicMatch = pathway.match(/\*\*([^*]+)\*\*:?/);
            const topic = topicMatch ? topicMatch[1] : `Related Topic ${index + 1}`;
            const description = pathway.replace(/\*\*[^*]+\*\*:?\s*/, '');
            
            return (
              <div 
                key={index} 
                className="p-4 bg-cream-50 rounded-lg border border-cream-200 hover:border-navy-300 hover:bg-cream-100 transition-all cursor-pointer group hover:shadow-md"
                onClick={() => onPathwayClick(topic)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <BookOpen className="h-4 w-4 text-navy-500" />
                      <h4 className="font-semibold text-navy-700 group-hover:text-navy-800">
                        {topic}
                      </h4>
                    </div>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      {description}
                    </p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-navy-400 group-hover:text-navy-600 mt-1 ml-3 flex-shrink-0 transform group-hover:translate-x-1 transition-transform" />
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <Badge variant="secondary" className="bg-navy-100 text-navy-700 hover:bg-navy-200">
                    Click to explore
                  </Badge>
                  <span className="text-xs text-gray-500">
                    Related concept #{index + 1}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Additional helpful info */}
        <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center gap-2 mb-1">
            <Lightbulb className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-800">Learning Tip</span>
          </div>
          <p className="text-sm text-blue-700">
            These pathways are curated to help you build a comprehensive understanding. 
            Each topic connects to enhance your overall knowledge in biology.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default LearningPathways;
