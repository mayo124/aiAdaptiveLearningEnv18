
import { useState } from 'react';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/contexts/LanguageContext';

interface SearchHeaderProps {
  onSearch: (query: string) => void;
}

const SearchHeader = ({ onSearch }: SearchHeaderProps) => {
  const [query, setQuery] = useState('');
  const { translate } = useLanguage();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-5xl font-bold text-navy-700 mb-4">
          {translate('title')}
        </h1>
        <p className="text-xl text-muted-foreground">
          {translate('subtitle')}
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
          <Input
            type="text"
            placeholder={translate('searchPlaceholder')}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-12 pr-24 py-6 text-lg bg-white/80 backdrop-blur-sm border-cream-300 focus:border-navy-600 focus:ring-navy-600 rounded-2xl shadow-lg"
          />
          <Button 
            type="submit"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-navy-600 hover:bg-navy-700 rounded-xl px-6"
          >
            Search
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SearchHeader;
