# KJV Bible App - Setup Guide

## Prerequisites

Before you begin, ensure you have the following installed on your machine:

- **Node.js** (version 18.0 or later) - [Download here](https://nodejs.org/)
- **VS Code** - [Download here](https://code.visualstudio.com/)
- **Git** (optional, for version control) - [Download here](https://git-scm.com/)

## Option 1: Standard React Application Setup (Recommended for Beginners)

### Step 1: Create Project Directory

```bash
# Create a new directory for your project
mkdir kjv-bible-app
cd kjv-bible-app
```

### Step 2: Initialize React + TypeScript Project

Choose one of the following options:

#### Option A: Using Vite (Recommended - Faster Development)
```bash
# Create React + TypeScript project with Vite
npm create vite@latest . -- --template react-ts

# Install dependencies
npm install
```

#### Option B: Using Create React App
```bash
# Create React + TypeScript project with CRA
npx create-react-app . --template typescript

# Install dependencies (already done with CRA)
```

### Step 3: Install Required Dependencies

```bash
# Install core dependencies
npm install lucide-react clsx tailwind-merge class-variance-authority

# Install Tailwind CSS v4 and related packages
npm install -D tailwindcss@next @tailwindcss/typography autoprefixer postcss
```

### Step 4: Configure Tailwind CSS

#### Create `tailwind.config.js`:
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

#### Create `postcss.config.js`:
```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

### Step 5: Setup Project Structure

#### Clean up default files (if using CRA):
```bash
# Remove unnecessary files
rm src/App.css src/App.test.tsx src/index.css src/logo.svg src/reportWebVitals.ts src/setupTests.ts
```

#### Create directory structure:
```bash
mkdir -p src/components/ui src/components/figma src/hooks src/styles src/guidelines
```

### Step 6: Copy Application Files

Copy the provided files to your project:

1. **Copy `App.tsx`** to `src/App.tsx`
2. **Copy all component files** to `src/components/`
3. **Copy `hooks/useBibleApi.ts`** to `src/hooks/useBibleApi.ts`
4. **Copy `styles/globals.css`** to `src/styles/globals.css`
5. **Copy `guidelines/Guidelines.md`** to `src/guidelines/Guidelines.md`

### Step 7: Update Import Paths

Update the import paths in your components to work with the `src/` structure:

**In `src/App.tsx`**, update imports:
```typescript
import { BibleHeader } from "./components/BibleHeader";
import { VerseDisplay } from "./components/VerseDisplay";
import { Favorites } from "./components/Favorites";
import { Topics } from "./components/Topics";
import { useBibleApi } from "./hooks/useBibleApi";
```

**In component files**, update UI component imports:
```typescript
// Change from:
import { Input } from "./ui/input";
// To:
import { Input } from "../ui/input";
```

### Step 8: Update Main Entry Point

#### For Vite (`src/main.tsx`):
```typescript
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './styles/globals.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

#### For Create React App (`src/index.tsx`):
```typescript
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/globals.css';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

### Step 9: Run the Application

```bash
# Start the development server
npm run dev          # For Vite
# OR
npm start           # For Create React App
```

Visit the provided localhost URL (usually `http://localhost:3000` or `http://localhost:5173`) to see your application.

---

## Option 2: Next.js Setup (Recommended for Production)

### Step 1: Create Next.js Project

```bash
# Create Next.js project with all modern features
npx create-next-app@latest kjv-bible-app \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir \
  --import-alias "@/*"

cd kjv-bible-app
```

### Step 2: Install Additional Dependencies

```bash
npm install lucide-react clsx tailwind-merge class-variance-authority
```

### Step 3: Setup Project Structure

```bash
# Create additional directories
mkdir -p src/components/ui src/components/figma src/hooks src/guidelines
```

### Step 4: Configure for Next.js

#### Update `src/app/page.tsx`:
```typescript
import App from '@/components/App';

export default function Home() {
  return <App />;
}
```

#### Move and update `App.tsx`:
Move `App.tsx` to `src/components/App.tsx` and add the "use client" directive:

```typescript
"use client";

import { useState, useEffect } from "react";
// ... rest of your App component code (unchanged)
```

#### Add "use client" to interactive components:
Add `"use client";` to the top of these files:
- `src/components/BibleHeader.tsx`
- `src/components/VerseDisplay.tsx`
- `src/components/Favorites.tsx`
- `src/components/Topics.tsx`
- `src/hooks/useBibleApi.ts`

### Step 5: Update Global Styles

Replace the contents of `src/app/globals.css` with your provided `globals.css` content.

### Step 6: Update Component Imports

Update all component imports to use the `@/` alias:

```typescript
// Change from:
import { BibleHeader } from "./components/BibleHeader";
// To:
import { BibleHeader } from "@/components/BibleHeader";
```

### Step 7: Run Next.js Application

```bash
npm run dev
```

Visit `http://localhost:3000` to see your Next.js application.

---

## VS Code Setup & Configuration

### Step 1: Install Recommended Extensions

Open VS Code and install these extensions:

1. **ES7+ React/Redux/React-Native snippets** (`dsznajder.es7-react-js-snippets`)
2. **TypeScript Importer** (`pmneo.tsimporter`)
3. **Tailwind CSS IntelliSense** (`bradlc.vscode-tailwindcss`)
4. **Auto Rename Tag** (`formulahendry.auto-rename-tag`)
5. **Prettier - Code formatter** (`esbenp.prettier-vscode`)
6. **Error Lens** (`usernamehw.errorlens`)

### Step 2: Create VS Code Configuration

#### Create `.vscode/settings.json`:
```json
{
  "typescript.preferences.importModuleSpecifier": "relative",
  "editor.codeActionsOnSave": {
    "source.organizeImports": true
  },
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "tailwindCSS.experimental.classRegex": [
    "class\\s*(?:Name)?\\s*[=:]\\s*['\"`]([^'\"`]*)['\"`]",
    "className\\s*[=:]\\s*['\"`]([^'\"`]*)['\"`]"
  ],
  "files.associations": {
    "*.css": "tailwindcss"
  },
  "emmet.includeLanguages": {
    "typescript": "html",
    "typescriptreact": "html"
  }
}
```

#### Create `.vscode/extensions.json`:
```json
{
  "recommendations": [
    "bradlc.vscode-tailwindcss",
    "dsznajder.es7-react-js-snippets",
    "ms-vscode.vscode-typescript-next",
    "esbenp.prettier-vscode",
    "usernamehw.errorlens"
  ]
}
```

### Step 3: Create Prettier Configuration

#### Create `.prettierrc`:
```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": false,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false
}
```

---

## Environment Setup

### Step 1: Create Environment File

Create `.env.local` (Next.js) or `.env` (React):

```env
# Bible App Configuration
NEXT_PUBLIC_BIBLE_API_URL=https://your-bible-api.com/api
NEXT_PUBLIC_API_KEY=your-api-key-here

# Optional: For development
NODE_ENV=development
```

### Step 2: Update API Hook

Replace the mock data in `useBibleApi.ts` with your actual API calls:

```typescript
// In hooks/useBibleApi.ts

const API_BASE_URL = process.env.NEXT_PUBLIC_BIBLE_API_URL || 'https://api.scripture.api.bible/v1';
const API_KEY = process.env.NEXT_PUBLIC_API_KEY || 'your-api-key';

const fetchChapter = async (book: string, chapter: number) => {
  setLoading(true);
  setError(null);
  
  try {
    const response = await fetch(`${API_BASE_URL}/books/${book}/chapters/${chapter}`, {
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    setVerses(data.verses); // Adjust based on your API response structure
  } catch (err) {
    setError("Failed to fetch verses");
    setVerses([]);
  } finally {
    setLoading(false);
  }
};
```

---

## Development Workflow

### Available Scripts

```json
{
  "scripts": {
    "dev": "vite",           // For Vite
    "dev": "next dev",       // For Next.js
    "build": "vite build",   // For Vite
    "build": "next build",   // For Next.js
    "start": "next start",   // For Next.js production
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "preview": "vite preview", // For Vite
    "type-check": "tsc --noEmit"
  }
}
```

### Git Setup

```bash
# Initialize Git repository
git init

# Create .gitignore file
echo "node_modules
.next
.env.local
.env
dist
build
*.log" > .gitignore

# Initial commit
git add .
git commit -m "Initial commit: KJV Bible App application"
```

---

## Troubleshooting

### Common Issues

1. **Import errors**: Make sure all import paths are correct for your chosen setup (relative vs. absolute paths)

2. **Tailwind not working**: Ensure your `tailwind.config.js` content paths are correct

3. **TypeScript errors**: Run `npm run type-check` to see detailed TypeScript errors

4. **Environment variables not loading**: 
   - For Next.js: Use `NEXT_PUBLIC_` prefix for client-side variables
   - For React: Use `REACT_APP_` prefix for Create React App

### Getting Help

- Check the [VS Code documentation](https://code.visualstudio.com/docs)
- Review [Next.js documentation](https://nextjs.org/docs) if using Next.js
- Check [Vite documentation](https://vitejs.dev/guide/) if using Vite
- Review [Tailwind CSS documentation](https://tailwindcss.com/docs)

---

## Next Steps

Once your application is running:

1. **Connect to your real Bible API** by updating the `useBibleApi.ts` hook
2. **Customize the styling** by modifying the Tailwind configuration
3. **Add more features** like user authentication, cloud storage, or additional Bible translations
4. **Deploy your application** to platforms like Vercel, Netlify, or your preferred hosting service

Your KJV Bible App application should now be fully functional with reading, favorites, and topics management features!