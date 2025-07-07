
import { useState } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, Music, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { useLanguage } from '@/contexts/LanguageContext';

const MusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [volume, setVolume] = useState([50]);
  const { translate } = useLanguage();

  const tracks = [
    'Peaceful Study Session',
    'Focus Flow',
    'Concentration Waves',
    'Study Ambience',
    'Deep Focus',
    'Rain & Coffee'
  ];

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
    console.log(isPlaying ? 'Pausing music' : 'Playing music');
  };

  const nextTrack = () => {
    setCurrentTrack((prev) => (prev + 1) % tracks.length);
  };

  const prevTrack = () => {
    setCurrentTrack((prev) => (prev - 1 + tracks.length) % tracks.length);
  };

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isVisible ? (
        <Button
          onClick={toggleVisibility}
          className="bg-navy-600 hover:bg-navy-700 text-white rounded-full p-3 shadow-lg"
        >
          <Music className="h-5 w-5" />
        </Button>
      ) : (
        <Card className="bg-white/95 backdrop-blur-sm border-cream-300 shadow-lg animate-fade-in">
          <CardContent className="p-4 w-64">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-navy-700">{translate('musicPlayer')}</h3>
              <Button variant="ghost" size="sm" onClick={toggleVisibility}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="text-center mb-3">
              <p className="text-xs text-muted-foreground">{tracks[currentTrack]}</p>
            </div>
            
            <div className="flex items-center justify-center gap-2 mb-3">
              <Button variant="ghost" size="sm" onClick={prevTrack}>
                <SkipBack className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={togglePlay}
                className="bg-navy-600 text-white hover:bg-navy-700"
              >
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>
              <Button variant="ghost" size="sm" onClick={nextTrack}>
                <SkipForward className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <Volume2 className="h-4 w-4 text-muted-foreground" />
              <Slider
                value={volume}
                onValueChange={setVolume}
                max={100}
                step={1}
                className="flex-1"
              />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MusicPlayer;
