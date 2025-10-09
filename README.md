
# KJV Bible App

A modern Bible reading application built with Next.js, featuring the King James Version (KJV) with powerful search capabilities, personal favorites, topic organization, and book exploration features.

## Features

### 📖 Bible Reading
- **Complete KJV Bible**: Access to all 66 books of the Bible
- **Chapter Navigation**: Easy navigation through books and chapters
- **Verse Display**: Clean, readable verse presentation
- **Book Explorer**: Browse all books organized by testament

### 🔍 Search & Discovery
- **Verse Search**: Search across the entire Bible text
- **Real-time Results**: Instant search results as you type
- **Context Navigation**: Jump from search results to full chapters

### ⭐ Personal Features
- **Favorites**: Save your favorite verses for quick access
- **Topics**: Create custom topic collections with related verses
- **Organized Storage**: Keep your spiritual insights organized

### 🎨 Modern UI
- **Responsive Design**: Works seamlessly on desktop and mobile
- **Dark/Light Theme**: Built with theme support
- **Clean Interface**: Distraction-free reading experience
- **Intuitive Navigation**: Tab-based interface for easy access

## Tech Stack

- **Framework**: Next.js 15.1.5 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4.1.3
- **UI Components**: Radix UI primitives
- **Database**: Supabase
- **Icons**: Lucide React
- **State Management**: React hooks

## Prerequisites

- Node.js 18.0 or later
- npm or yarn package manager
- Supabase account and project

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd kjv-bible-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Set up Supabase Database**

   Your Supabase database should have the following tables:
   - `bible_books`: Contains book information with columns like `book_id`, `book_name`, `testament`, `seq_number`
   - `bible_books_and_verses`: Contains verse data with columns like `book_name`, `book_chapter`, `verse_number`, `verse_text`

## Development

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout
│   └── page.tsx           # Main application page
├── components/
│   ├── BibleHeader.tsx    # Navigation and search header
│   ├── VerseDisplay.tsx   # Bible verse display component
│   ├── Favorites.tsx      # Favorites management
│   ├── Topics.tsx         # Topic creation and management
│   ├── BooksExplorer.tsx  # Bible books browser
│   └── ui/                # Reusable UI components
├── hooks/
│   └── useBibleApi.ts     # Custom hook for Bible data
└── lib/
    └── supabase.ts        # Supabase client configuration
```

## Key Components

### BibleHeader
Main navigation component with:
- Tab navigation (Read, Books, Favorites, Topics)
- Search functionality
- Book and chapter selection

### VerseDisplay
Displays Bible verses with:
- Favorite toggle functionality
- Context expansion
- Clean verse formatting

### Favorites
Manages favorite verses:
- Add/remove favorites
- Quick access to saved verses
- Persistent storage

### Topics
Topic organization system:
- Create custom topics
- Add verses to topics
- Organize spiritual insights

### BooksExplorer
Bible book navigation:
- Testament organization
- Quick book access
- Chapter navigation

## Database Schema

The application expects these Supabase tables:

### bible_books
```sql
- book_id (integer)
- book_name (text)
- testament (text)
- seq_number (integer)
```

### bible_books_and_verses
```sql
- book_name (text)
- book_chapter (integer)
- verse_number (integer)
- verse_text (text)
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -m 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit a pull request

## Design Reference

Original Figma design: https://www.figma.com/design/0CREXjTZ97OM6BpT8VlzQQ/Bible-API-Frontend

## License

This project is open source. Please ensure proper attribution when using Bible text content.

## Acknowledgments

- Bible text from the King James Version
- UI components powered by Radix UI
- Icons by Lucide React
- Database hosting by Supabase
  