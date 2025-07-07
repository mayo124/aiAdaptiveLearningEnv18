
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';

interface ResourceCardProps {
  title: string;
  description: string;
  type: string;
  lastModified: string;
  onClick: () => void;
}

const ResourceCard = ({ title, description, type, lastModified, onClick }: ResourceCardProps) => {
  const { translate } = useLanguage();

  return (
    <Card 
      className="cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 bg-white/70 backdrop-blur-sm border-cream-300 hover:border-navy-600 group"
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-navy-700 group-hover:text-navy-800 transition-colors line-clamp-2">
              {title}
            </CardTitle>
            <CardDescription className="mt-2 line-clamp-2">
              {description}
            </CardDescription>
          </div>
          <Badge variant="secondary" className="ml-2 bg-cream-200 text-navy-600">
            {type}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-sm text-muted-foreground">
          {translate('modified')} {lastModified}
        </p>
      </CardContent>
    </Card>
  );
};

export default ResourceCard;
