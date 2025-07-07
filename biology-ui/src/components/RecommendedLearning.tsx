
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, BookOpen, Video, FileText } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface RecommendedLearningProps {
  currentTopic: string;
  onTopicSelect: (topic: string, content: string) => void;
}

const RecommendedLearning = ({ currentTopic, onTopicSelect }: RecommendedLearningProps) => {
  const { translate } = useLanguage();
  
  const recommendations = [
    {
      title: 'Advanced Machine Learning Concepts',
      description: 'Dive deeper into neural networks, deep learning architectures, and advanced algorithms that build upon artificial intelligence foundations.',
      type: 'article',
      icon: BookOpen,
      content: 'Deep learning represents a sophisticated subset of machine learning algorithms inspired by the structure and function of biological neural networks. These multi-layered networks excel at recognizing patterns in vast datasets, enabling breakthrough applications in computer vision, natural language processing, and autonomous systems. The hierarchical feature extraction capabilities of deep neural networks allow them to automatically discover intricate representations from raw data, revolutionizing fields from medical diagnosis to autonomous vehicle navigation.'
    },
    {
      title: 'Ethics in Artificial Intelligence',
      description: 'Explore the moral implications, bias considerations, and responsible development practices in AI systems.',
      type: 'discussion',
      icon: Video,
      content: 'The ethical development of artificial intelligence systems requires careful consideration of algorithmic bias, privacy protection, and societal impact. As AI systems become more prevalent in decision-making processes affecting employment, healthcare, and criminal justice, ensuring fairness and transparency becomes paramount. Developers must implement robust testing protocols to identify potential discrimination, establish clear accountability frameworks, and maintain human oversight in critical applications to preserve democratic values and human dignity.'
    },
    {
      title: 'Quantum Computing Fundamentals',
      description: 'Understand the principles of quantum mechanics applied to computational systems and their potential impact.',
      type: 'technical',
      icon: FileText,
      content: 'Quantum computing harnesses the counterintuitive principles of quantum mechanics to process information in fundamentally different ways than classical computers. Quantum bits, or qubits, can exist in superposition states, enabling parallel processing of multiple possibilities simultaneously. This quantum parallelism, combined with entanglement phenomena, provides exponential computational advantages for specific problem domains including cryptography, optimization, and molecular simulation. Understanding quantum algorithms requires grasping concepts like quantum interference and measurement collapse.'
    }
  ];

  const getIconColor = (type: string) => {
    switch (type) {
      case 'article': return 'text-blue-600';
      case 'discussion': return 'text-green-600';
      case 'technical': return 'text-purple-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="max-w-6xl mx-auto mt-12 px-4">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-navy-700 mb-2">Continue Your Learning Journey</h2>
        <p className="text-gray-600">Based on "{currentTopic}", here are recommended topics to explore next:</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {recommendations.map((rec, index) => {
          const IconComponent = rec.icon;
          return (
            <Card 
              key={index}
              className="cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 bg-white/70 backdrop-blur-sm border-cream-300 hover:border-navy-600 group"
            >
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3 mb-2">
                  <IconComponent className={`h-5 w-5 ${getIconColor(rec.type)}`} />
                  <span className="text-xs uppercase tracking-wide text-muted-foreground font-medium">
                    {rec.type}
                  </span>
                </div>
                <CardTitle className="text-navy-700 group-hover:text-navy-800 transition-colors text-lg">
                  {rec.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600 line-clamp-3">
                  {rec.description}
                </p>
                <Button
                  onClick={() => onTopicSelect(rec.title, rec.content)}
                  className="w-full bg-navy-600 hover:bg-navy-700 text-white group-hover:bg-navy-700"
                >
                  Explore Topic
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default RecommendedLearning;
