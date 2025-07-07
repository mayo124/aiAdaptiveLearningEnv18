
# Knowledge Hub - AI-Powered Document Search Platform

A modern, responsive web application for searching and viewing documents with multi-language support. Built with React, TypeScript, and Tailwind CSS.

## ✨ Features

- **Smart Search**: Search through documents by title and description
- **Document Viewer**: Clean, readable document viewing experience
- **Multi-language Support**: Interface available in multiple languages
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Modern UI**: Beautiful, accessible interface with smooth animations

## 🚀 Tech Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS + shadcn/ui components
- **Build Tool**: Vite
- **State Management**: React Context API
- **Icons**: Lucide React
- **Routing**: React Router DOM

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd knowledge-hub
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui base components
│   ├── DocumentViewer.tsx
│   ├── LanguageSwitcher.tsx
│   ├── ResourceCard.tsx
│   └── SearchHeader.tsx
├── contexts/           # React Context providers
│   └── LanguageContext.tsx
├── pages/              # Page components
│   ├── Index.tsx       # Main landing page
│   └── NotFound.tsx    # 404 page
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
└── App.tsx             # Main app component
```

## 🎨 Key Components

### SearchHeader
- Main search interface with input field and search button
- Displays application title and subtitle
- Handles search form submission

### ResourceCard
- Displays document information in card format
- Shows title, description, type, and last modified date
- Clickable to navigate to document viewer

### DocumentViewer
- Full-screen document reading experience
- Navigation back to search results
- Clean typography for optimal readability

### LanguageSwitcher
- Dropdown menu for language selection
- Supports multiple languages via context
- Persistent language preference

## 🌐 Multi-language Support

The app supports multiple languages through React Context:
- Language switching via dropdown menu
- Translations stored in context provider
- Easy to add new languages by extending the translations object

## 🎯 Usage

1. **Search Documents**: Use the search bar to find documents by title or description
2. **View Documents**: Click on any document card to open the full document viewer
3. **Change Language**: Use the language switcher in the top-right corner
4. **Navigate Back**: Use the back button in document viewer to return to search

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Adding New Documents

To add new documents, modify the `mockResources` array in `src/pages/Index.tsx`:

```typescript
const mockResources: Resource[] = [
  {
    id: 'unique-id',
    title: 'Document Title',
    description: 'Document description',
    type: 'PDF', // or 'DOC', 'Article', etc.
    lastModified: 'Date string',
    content: 'Full document content...'
  }
];
```

### Adding New Languages

1. Update the `languages` object in `src/contexts/LanguageContext.tsx`
2. Add translations for the new language in the `translations` object

## 🚀 Deployment

This project can be deployed to any static hosting service:

### Vercel
```bash
npm run build
# Deploy the 'dist' folder to Vercel
```

### Netlify
```bash
npm run build
# Deploy the 'dist' folder to Netlify
```

### GitHub Pages
```bash
npm run build
# Deploy the 'dist' folder to GitHub Pages
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Built with [Vite](https://vitejs.dev/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Icons from [Lucide React](https://lucide.dev/)
- Styling with [Tailwind CSS](https://tailwindcss.com/)
