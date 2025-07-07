import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Image as ImageIcon, 
  ExternalLink, 
  RotateCcw, 
  Eye,
  EyeOff,
  Loader2
} from 'lucide-react';

interface TopicImageDisplayProps {
  topic: string;
  className?: string;
}

interface ImageResult {
  title: string;
  link: string;
  thumbnail: string;
  source: string;
  snippet?: string;
}

export const TopicImageDisplay: React.FC<TopicImageDisplayProps> = ({
  topic,
  className = ''
}) => {
  const [images, setImages] = useState<ImageResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showImages, setShowImages] = useState(true);
  const [selectedImage, setSelectedImage] = useState<ImageResult | null>(null);

  useEffect(() => {
    if (topic && showImages) {
      fetchImages(topic);
    }
  }, [topic, showImages]);

  const fetchImages = async (searchTopic: string) => {
    setLoading(true);
    setError(null);
    
    try {
      // Since we can't directly access Google Images API without an API key,
      // we'll use a combination of methods:
      // 1. First try with a simple image search API
      // 2. Fallback to curated biology images based on topic keywords
      
      const searchQuery = `${searchTopic} biology diagram illustration`;
      const fallbackImages = getCuratedImages(searchTopic);
      
      // For now, we'll use curated images as Google Images API requires setup
      // In production, you would integrate with Google Custom Search API
      setTimeout(() => {
        setImages(fallbackImages);
        setSelectedImage(fallbackImages[0] || null);
        setLoading(false);
      }, 1000);
      
    } catch (err) {
      console.error('Image search error:', err);
      setError('Unable to load images');
      setLoading(false);
    }
  };

  const getCuratedImages = (searchTopic: string): ImageResult[] => {
    const topicLower = searchTopic.toLowerCase();
    
    // Define curated images for common biology topics
    const imageDatabase: { [key: string]: ImageResult[] } = {
      'dna': [
        {
          title: 'DNA Double Helix Structure',
          link: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/DNA_Structure%2BKey%2BLabelled.pn_NoBB.png/800px-DNA_Structure%2BKey%2BLabelled.pn_NoBB.png',
          thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/DNA_Structure%2BKey%2BLabelled.pn_NoBB.png/300px-DNA_Structure%2BKey%2BLabelled.pn_NoBB.png',
          source: 'Wikimedia Commons',
          snippet: 'Detailed diagram of DNA double helix structure'
        },
        {
          title: 'DNA Replication Process',
          link: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/DNA_replication_en.svg/800px-DNA_replication_en.svg.png',
          thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/DNA_replication_en.svg/300px-DNA_replication_en.svg.png',
          source: 'Wikimedia Commons',
          snippet: 'Illustration of DNA replication mechanism'
        }
      ],
      'photosynthesis': [
        {
          title: 'Photosynthesis Process Diagram',
          link: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Photosynthesis_en.svg/800px-Photosynthesis_en.svg.png',
          thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Photosynthesis_en.svg/300px-Photosynthesis_en.svg.png',
          source: 'Wikimedia Commons',
          snippet: 'Complete photosynthesis process in plants'
        },
        {
          title: 'Chloroplast Structure',
          link: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Chloroplast_II.svg/800px-Chloroplast_II.svg.png',
          thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Chloroplast_II.svg/300px-Chloroplast_II.svg.png',
          source: 'Wikimedia Commons',
          snippet: 'Detailed chloroplast anatomy'
        }
      ],
      'cell': [
        {
          title: 'Animal Cell Structure',
          link: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/11/Animal_cell_structure_en.svg/800px-Animal_cell_structure_en.svg.png',
          thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/11/Animal_cell_structure_en.svg/300px-Animal_cell_structure_en.svg.png',
          source: 'Wikimedia Commons',
          snippet: 'Complete animal cell with organelles'
        },
        {
          title: 'Plant Cell Structure',
          link: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Plant_cell_structure_svg.svg/800px-Plant_cell_structure_svg.svg.png',
          thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Plant_cell_structure_svg.svg/300px-Plant_cell_structure_svg.svg.png',
          source: 'Wikimedia Commons',
          snippet: 'Complete plant cell with organelles'
        }
      ],
      'mitosis': [
        {
          title: 'Mitosis Phases',
          link: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Major_events_in_mitosis.svg/800px-Major_events_in_mitosis.svg.png',
          thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Major_events_in_mitosis.svg/300px-Major_events_in_mitosis.svg.png',
          source: 'Wikimedia Commons',
          snippet: 'Complete mitosis cycle phases'
        }
      ],
      'enzyme': [
        {
          title: 'Enzyme Activity Mechanism',
          link: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/Enzyme_mechanism.svg/800px-Enzyme_mechanism.svg.png',
          thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/Enzyme_mechanism.svg/300px-Enzyme_mechanism.svg.png',
          source: 'Wikimedia Commons',
          snippet: 'How enzymes catalyze reactions'
        }
      ]
    };

    // Search for matching keywords
    for (const [keyword, imgs] of Object.entries(imageDatabase)) {
      if (topicLower.includes(keyword) || keyword.includes(topicLower)) {
        return imgs;
      }
    }

    // Default fallback images for general biology topics
    return [
      {
        title: 'Biology Concept Illustration',
        link: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/BiologyPortal.svg/800px-BiologyPortal.svg.png',
        thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/BiologyPortal.svg/300px-BiologyPortal.svg.png',
        source: 'Wikimedia Commons',
        snippet: 'General biology concept visualization'
      }
    ];
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.style.display = 'none';
  };

  const toggleImages = () => {
    setShowImages(!showImages);
  };

  const refreshImages = () => {
    if (topic) {
      fetchImages(topic);
    }
  };

  if (!showImages) {
    return (
      <Card className={`border-blue-200 ${className}`}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-gray-600">
              <EyeOff className="h-4 w-4" />
              <span className="text-sm">Visual Content Hidden</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={toggleImages}
              className="text-blue-600 hover:text-blue-700"
            >
              <Eye className="h-4 w-4 mr-1" />
              Show Images
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`border-blue-200 ${className}`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5 text-blue-600" />
            <h3 className="font-semibold text-gray-800">Visual Learning</h3>
            <Badge variant="secondary" className="text-xs">
              Educational Images
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={refreshImages}
              disabled={loading}
              className="text-gray-600 hover:text-gray-800"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleImages}
              className="text-gray-600 hover:text-gray-800"
            >
              <EyeOff className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
            <span className="ml-2 text-gray-600">Loading visual content...</span>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-red-500 text-sm mb-3">{error}</p>
            <Button
              variant="outline"
              size="sm"
              onClick={refreshImages}
              className="text-blue-600"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          </div>
        ) : images.length > 0 ? (
          <div className="space-y-4">
            {/* Main Featured Image */}
            {selectedImage && (
              <div className="relative group">
                <img
                  src={selectedImage.link}
                  alt={selectedImage.title}
                  className="w-full h-48 object-contain bg-gray-50 rounded-lg border"
                  onError={handleImageError}
                />
                <div className="absolute bottom-2 left-2 right-2 bg-black/75 text-white p-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="text-sm font-medium">{selectedImage.title}</p>
                  <p className="text-xs text-gray-300">{selectedImage.source}</p>
                </div>
                <a
                  href={selectedImage.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute top-2 right-2 bg-white/90 p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
                >
                  <ExternalLink className="h-4 w-4 text-gray-700" />
                </a>
              </div>
            )}

            {/* Thumbnail Gallery */}
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(image)}
                    className={`flex-shrink-0 w-16 h-16 rounded border-2 overflow-hidden transition-all ${
                      selectedImage?.link === image.link
                        ? 'border-blue-500 ring-2 ring-blue-200'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    <img
                      src={image.thumbnail}
                      alt={image.title}
                      className="w-full h-full object-cover"
                      onError={handleImageError}
                    />
                  </button>
                ))}
              </div>
            )}

            <div className="text-xs text-gray-500 text-center">
              Educational content from {selectedImage?.source || 'various sources'} • Click image for full size
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <ImageIcon className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No images available for this topic</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TopicImageDisplay;
