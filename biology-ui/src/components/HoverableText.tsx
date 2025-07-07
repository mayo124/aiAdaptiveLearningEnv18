import React from 'react';

interface HoverableTextProps {
  text: string;
  onWordHover: (word: string, event: React.MouseEvent) => void;
  onWordLeave: () => void;
  className?: string;
}

export const HoverableText: React.FC<HoverableTextProps> = ({
  text,
  onWordHover,
  onWordLeave,
  className = ''
}) => {
  // Split text into words while preserving punctuation and spacing
  const tokenizeText = (text: string) => {
    // This regex splits on word boundaries but keeps punctuation and spaces
    return text.split(/(\s+|[.,;:!?()[\]{}""''—-])/).filter(token => token.length > 0);
  };

  const tokens = tokenizeText(text);

  const isWord = (token: string) => {
    // Check if token is a word (contains letters)
    return /[a-zA-Z]/.test(token) && token.trim().length > 0;
  };

  const cleanWord = (word: string) => {
    // Remove punctuation from the beginning and end of words
    return word.replace(/^[^\w]+|[^\w]+$/g, '');
  };

  return (
    <span className={className}>
      {tokens.map((token, index) => {
        if (isWord(token)) {
          const cleanedWord = cleanWord(token);
          return (
            <span
              key={index}
              className="hover:bg-blue-50 hover:text-blue-700 cursor-help transition-colors duration-200 rounded px-0.5"
              onMouseEnter={(e) => onWordHover(cleanedWord, e)}
              onMouseLeave={onWordLeave}
            >
              {token}
            </span>
          );
        } else {
          // Return spaces and punctuation as-is
          return <span key={index}>{token}</span>;
        }
      })}
    </span>
  );
};

export default HoverableText;
