
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

interface DocumentViewerProps {
  title: string;
  content: string;
  onBack: () => void;
}

const DocumentViewer = ({ title, content, onBack }: DocumentViewerProps) => {
  const { translate } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream-50 to-cream-100">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button 
            onClick={onBack}
            variant="ghost"
            className="text-navy-600 hover:text-navy-700 hover:bg-cream-200"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {translate('backToResources')}
          </Button>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-cream-300 p-8">
            <h1 className="text-3xl font-bold text-navy-700 mb-6">
              {title}
            </h1>
            
            <div className="prose prose-lg max-w-none">
              <div className="text-gray-700 leading-relaxed text-lg">
                {content}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentViewer;
