import { useState, useCallback, useRef } from 'react';

interface WordHoverState {
  visible: boolean;
  word: string;
  position: { x: number; y: number };
}

export const useWordHover = () => {
  const [tooltipState, setTooltipState] = useState<WordHoverState>({
    visible: false,
    word: '',
    position: { x: 0, y: 0 }
  });

  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleWordHover = useCallback((word: string, event: React.MouseEvent) => {
    // Clear any existing timeout
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }

    // Only show for words longer than 3 characters to avoid common words
    if (word.length > 3) {
      const rect = (event.target as HTMLElement).getBoundingClientRect();
      setTooltipState({
        visible: true,
        word: word,
        position: {
          x: rect.left + rect.width / 2,
          y: rect.top
        }
      });
    }
  }, []);

  const handleWordLeave = useCallback(() => {
    // Add a small delay before hiding to allow moving to tooltip
    hoverTimeoutRef.current = setTimeout(() => {
      setTooltipState(prev => ({ ...prev, visible: false }));
    }, 300);
  }, []);

  const hideTooltip = useCallback(() => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    setTooltipState(prev => ({ ...prev, visible: false }));
  }, []);

  const keepTooltipOpen = useCallback(() => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
  }, []);

  return {
    tooltipState,
    handleWordHover,
    handleWordLeave,
    hideTooltip,
    keepTooltipOpen
  };
};
