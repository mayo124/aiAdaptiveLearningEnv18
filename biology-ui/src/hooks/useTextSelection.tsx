import { useState, useEffect, useRef } from 'react';

interface TextSelection {
  text: string;
  position: { x: number; y: number };
}

export const useTextSelection = () => {
  const [selection, setSelection] = useState<TextSelection | null>(null);
  const selectionTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const handleSelection = () => {
      // Clear any existing timeout
      if (selectionTimeoutRef.current) {
        clearTimeout(selectionTimeoutRef.current);
      }

      // Small delay to ensure selection is complete
      selectionTimeoutRef.current = setTimeout(() => {
        const selectedText = window.getSelection()?.toString().trim();
        
        if (selectedText && selectedText.length > 5) {
          const range = window.getSelection()?.getRangeAt(0);
          if (range) {
            const rect = range.getBoundingClientRect();
            setSelection({
              text: selectedText,
              position: {
                x: rect.left + rect.width / 2,
                y: rect.bottom + 10
              }
            });
          }
        } else {
          setSelection(null);
        }
      }, 100);
    };

    const handleClick = (event: MouseEvent) => {
      // Close popup if clicking outside
      const target = event.target as HTMLElement;
      if (!target.closest('[data-analogy-popup]') && !window.getSelection()?.toString()) {
        setSelection(null);
      }
    };

    document.addEventListener('mouseup', handleSelection);
    document.addEventListener('click', handleClick);
    document.addEventListener('keyup', handleSelection);

    return () => {
      document.removeEventListener('mouseup', handleSelection);
      document.removeEventListener('click', handleClick);
      document.removeEventListener('keyup', handleSelection);
      if (selectionTimeoutRef.current) {
        clearTimeout(selectionTimeoutRef.current);
      }
    };
  }, []);

  const clearSelection = () => {
    setSelection(null);
    window.getSelection()?.removeAllRanges();
  };

  return {
    selection,
    clearSelection
  };
};
