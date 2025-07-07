
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface LanguageContextType {
  currentLanguage: string;
  setLanguage: (language: string) => void;
  translate: (key: string) => string;
}

const languages = {
  en: 'English',
  hi: 'हिन्दी',
  ta: 'தமிழ்',
  pa: 'ਪੰਜਾਬੀ',
  es: 'Español',
  fr: 'Français'
};

const translations = {
  en: {
    title: 'LearnRAG',
    subtitle: 'Discover knowledge through intelligent document exploration',
    searchPlaceholder: 'Search through your uploaded documents...',
    uploadDocuments: 'Upload Documents',
    searchResults: 'Search Results',
    availableResources: 'Available Resources',
    backToResources: 'Back to Resources',
    modified: 'Modified',
    askAnalogy: 'Ask for Analogy',
    chatBot: 'Chat Assistant',
    typeMessage: 'Type your message...',
    send: 'Send',
    musicPlayer: 'Study Music'
  },
  hi: {
    title: 'लर्नRAG',
    subtitle: 'बुद्धिमान दस्तावेज़ अन्वेषण के माध्यम से ज्ञान की खोज करें',
    searchPlaceholder: 'अपने अपलोड किए गए दस्तावेज़ों में खोजें...',
    uploadDocuments: 'दस्तावेज़ अपलोड करें',
    searchResults: 'खोज परिणाम',
    availableResources: 'उपलब्ध संसाधन',
    backToResources: 'संसाधनों पर वापस',
    modified: 'संशोधित',
    askAnalogy: 'उदाहरण मांगें',
    chatBot: 'चैट सहायक',
    typeMessage: 'अपना संदेश टाइप करें...',
    send: 'भेजें',
    musicPlayer: 'अध्ययन संगीत'
  },
  ta: {
    title: 'கற்றல்RAG',
    subtitle: 'அறிவார்ந்த ஆவண ஆய்வின் மூலம் அறிவைக் கண்டறியுங்கள்',
    searchPlaceholder: 'உங்கள் பதிவேற்றிய ஆவணங்களில் தேடுங்கள்...',
    uploadDocuments: 'ஆவணங்களைப் பதிவேற்றுங்கள்',
    searchResults: 'தேடல் முடிவுகள்',
    availableResources: 'கிடைக்கும் வளங்கள்',
    backToResources: 'வளங்களுக்குத் திரும்பு',
    modified: 'மாற்றப்பட்டது',
    askAnalogy: 'ஒப்புமை கேளுங்கள்',
    chatBot: 'அரட்டை உதவியாளர்',
    typeMessage: 'உங்கள் செய்தியை தட்டச்சு செய்யுங்கள்...',
    send: 'அனுப்பு',
    musicPlayer: 'படிப்பு இசை'
  },
  pa: {
    title: 'ਸਿੱਖਣRAG',
    subtitle: 'ਬੁੱਧੀਮਾਨ ਦਸਤਾਵੇਜ਼ ਖੋਜ ਰਾਹੀਂ ਗਿਆਨ ਦੀ ਖੋਜ ਕਰੋ',
    searchPlaceholder: 'ਆਪਣੇ ਅਪਲੋਡ ਕੀਤੇ ਦਸਤਾਵੇਜ਼ਾਂ ਵਿੱਚ ਖੋਜ ਕਰੋ...',
    uploadDocuments: 'ਦਸਤਾਵੇਜ਼ ਅਪਲੋਡ ਕਰੋ',
    searchResults: 'ਖੋਜ ਨਤੀਜੇ',
    availableResources: 'ਉਪਲਬਧ ਸਰੋਤ',
    backToResources: 'ਸਰੋਤਾਂ ਵਾਪਸ',
    modified: 'ਸੋਧਿਆ ਗਿਆ',
    askAnalogy: 'ਮਿਸਾਲ ਮੰਗੋ',
    chatBot: 'ਚੈਟ ਸਹਾਇਕ',
    typeMessage: 'ਆਪਣਾ ਸੰਦੇਸ਼ ਟਾਈਪ ਕਰੋ...',
    send: 'ਭੇਜੋ',
    musicPlayer: 'ਅਧਿਐਨ ਸੰਗੀਤ'
  },
  es: {
    title: 'AprenderRAG',
    subtitle: 'Descubre conocimiento a través de la exploración inteligente de documentos',
    searchPlaceholder: 'Busca en tus documentos subidos...',
    uploadDocuments: 'Subir Documentos',
    searchResults: 'Resultados de Búsqueda',
    availableResources: 'Recursos Disponibles',
    backToResources: 'Volver a Recursos',
    modified: 'Modificado',
    askAnalogy: 'Pedir Analogía',
    chatBot: 'Asistente de Chat',
    typeMessage: 'Escribe tu mensaje...',
    send: 'Enviar',
    musicPlayer: 'Música de Estudio'
  },
  fr: {
    title: 'ApprendreRAG',
    subtitle: 'Découvrez la connaissance grâce à l\'exploration intelligente de documents',
    searchPlaceholder: 'Recherchez dans vos documents téléchargés...',
    uploadDocuments: 'Télécharger des Documents',
    searchResults: 'Résultats de Recherche',
    availableResources: 'Ressources Disponibles',
    backToResources: 'Retour aux Ressources',
    modified: 'Modifié',
    askAnalogy: 'Demander une Analogie',
    chatBot: 'Assistant de Chat',
    typeMessage: 'Tapez votre message...',
    send: 'Envoyer',
    musicPlayer: 'Musique d\'Étude'
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [currentLanguage, setCurrentLanguage] = useState('en');

  const setLanguage = (language: string) => {
    setCurrentLanguage(language);
  };

  const translate = (key: string): string => {
    return translations[currentLanguage as keyof typeof translations]?.[key as keyof typeof translations.en] || key;
  };

  return (
    <LanguageContext.Provider value={{ currentLanguage, setLanguage, translate }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export { languages };
