import { useState } from "react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import { ChevronLeft, BookOpen, Heart, Copy, Share } from "lucide-react";

interface Verse {
  book: string;
  chapter: number;
  verse: number;
  text: string;
}

interface BooksExplorerProps {
  onBookSelect: (book: string, chapter?: number) => void;
  favorites: Set<string>;
  onToggleFavorite: (verse: Verse) => void;
  verses: Verse[];
  loading: boolean;
}

// Complete Bible books with Apocrypha
const bibleStructure = {
  "Old Testament": [
    "Genesis", "Exodus", "Leviticus", "Numbers", "Deuteronomy",
    "Joshua", "Judges", "Ruth", "1 Samuel", "2 Samuel",
    "1 Kings", "2 Kings", "1 Chronicles", "2 Chronicles",
    "Ezra", "Nehemiah", "Esther", "Job", "Psalms", "Proverbs",
    "Ecclesiastes", "Song of Solomon", "Isaiah", "Jeremiah",
    "Lamentations", "Ezekiel", "Daniel", "Hosea", "Joel",
    "Amos", "Obadiah", "Jonah", "Micah", "Nahum", "Habakkuk",
    "Zephaniah", "Haggai", "Zechariah", "Malachi"
  ],
  "New Testament": [
    "Matthew", "Mark", "Luke", "John", "Acts", "Romans",
    "1 Corinthians", "2 Corinthians", "Galatians", "Ephesians",
    "Philippians", "Colossians", "1 Thessalonians", "2 Thessalonians",
    "1 Timothy", "2 Timothy", "Titus", "Philemon", "Hebrews",
    "James", "1 Peter", "2 Peter", "1 John", "2 John", "3 John",
    "Jude", "Revelation"
  ],
  "Apocrypha": [
    "Tobit", "Judith", "Esther (Greek)", "Wisdom of Solomon",
    "Sirach", "Baruch", "Letter of Jeremiah", "Song of the Three Young Men",
    "Susanna", "Bel and the Dragon", "1 Maccabees", "2 Maccabees",
    "1 Esdras", "2 Esdras", "Prayer of Manasseh", "Psalm 151",
    "3 Maccabees", "4 Maccabees"
  ]
};

// Mock chapter counts for demonstration
const getChapterCount = (book: string): number => {
  const chapterCounts: { [key: string]: number } = {
    // Old Testament
    "Genesis": 50, "Exodus": 40, "Leviticus": 27, "Numbers": 36, "Deuteronomy": 34,
    "Joshua": 24, "Judges": 21, "Ruth": 4, "1 Samuel": 31, "2 Samuel": 24,
    "1 Kings": 22, "2 Kings": 25, "1 Chronicles": 29, "2 Chronicles": 36,
    "Ezra": 10, "Nehemiah": 13, "Esther": 10, "Job": 42, "Psalms": 150, "Proverbs": 31,
    "Ecclesiastes": 12, "Song of Solomon": 8, "Isaiah": 66, "Jeremiah": 52,
    "Lamentations": 5, "Ezekiel": 48, "Daniel": 12, "Hosea": 14, "Joel": 3,
    "Amos": 9, "Obadiah": 1, "Jonah": 4, "Micah": 7, "Nahum": 3, "Habakkuk": 3,
    "Zephaniah": 3, "Haggai": 2, "Zechariah": 14, "Malachi": 4,
    
    // New Testament
    "Matthew": 28, "Mark": 16, "Luke": 24, "John": 21, "Acts": 28, "Romans": 16,
    "1 Corinthians": 16, "2 Corinthians": 13, "Galatians": 6, "Ephesians": 6,
    "Philippians": 4, "Colossians": 4, "1 Thessalonians": 5, "2 Thessalonians": 3,
    "1 Timothy": 6, "2 Timothy": 4, "Titus": 3, "Philemon": 1, "Hebrews": 13,
    "James": 5, "1 Peter": 5, "2 Peter": 3, "1 John": 5, "2 John": 1, "3 John": 1,
    "Jude": 1, "Revelation": 22,
    
    // Apocrypha
    "Tobit": 14, "Judith": 16, "Esther (Greek)": 16, "Wisdom of Solomon": 19,
    "Sirach": 51, "Baruch": 6, "Letter of Jeremiah": 1, "Song of the Three Young Men": 1,
    "Susanna": 1, "Bel and the Dragon": 1, "1 Maccabees": 16, "2 Maccabees": 15,
    "1 Esdras": 9, "2 Esdras": 16, "Prayer of Manasseh": 1, "Psalm 151": 1,
    "3 Maccabees": 7, "4 Maccabees": 18
  };
  return chapterCounts[book] || 25;
};

export function BooksExplorer({ onBookSelect, favorites, onToggleFavorite, verses, loading }: BooksExplorerProps) {
  const [viewMode, setViewMode] = useState<'categories' | 'chapters' | 'verses'>('categories');
  const [selectedBook, setSelectedBook] = useState<string>('');
  const [selectedChapter, setSelectedChapter] = useState<number>(0);

  const handleBookClick = (book: string) => {
    setSelectedBook(book);
    setViewMode('chapters');
  };

  const handleChapterClick = (chapter: number) => {
    setSelectedChapter(chapter);
    setViewMode('verses');
    onBookSelect(selectedBook, chapter);
  };

  const handleBack = () => {
    if (viewMode === 'verses') {
      setViewMode('chapters');
    } else if (viewMode === 'chapters') {
      setViewMode('categories');
      setSelectedBook('');
    }
  };

  const copyVerse = (verse: Verse) => {
    const text = `"${verse.text}" - ${verse.book} ${verse.chapter}:${verse.verse}`;
    navigator.clipboard.writeText(text);
  };

  const shareVerse = (verse: Verse) => {
    if (navigator.share) {
      navigator.share({
        title: `${verse.book} ${verse.chapter}:${verse.verse}`,
        text: verse.text,
      });
    }
  };

  if (viewMode === 'verses') {
    if (loading) {
      return (
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-2 mb-6">
              <Button variant="ghost" onClick={handleBack}>
                <ChevronLeft className="h-4 w-4 mr-2" />
                Back to Chapters
              </Button>
            </div>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="p-6">
                  <div className="animate-pulse">
                    <div className="h-4 bg-muted rounded w-1/4 mb-3"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-muted rounded w-full"></div>
                      <div className="h-4 bg-muted rounded w-3/4"></div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2 mb-6">
            <Button variant="ghost" onClick={handleBack}>
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back to Chapters
            </Button>
          </div>
          
          {verses.length > 0 && (
            <div className="mb-6">
              <h2 className="text-3xl font-semibold mb-2">
                {verses[0].book} {verses[0].chapter}
              </h2>
              <Badge variant="secondary">
                {verses.length} verses
              </Badge>
            </div>
          )}
          
          <div className="space-y-6">
            {verses.map((verse) => {
              const key = `${verse.book}_${verse.chapter}_${verse.verse}`;
              const isFavorite = favorites.has(key);
              
              return (
                <Card key={key} className="p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-3">
                        <Badge variant="outline">
                          {verse.book} {verse.chapter}:{verse.verse}
                        </Badge>
                      </div>
                      <p className="text-lg leading-relaxed text-foreground">
                        <span className="font-medium text-primary mr-2">
                          {verse.verse}
                        </span>
                        {verse.text}
                      </p>
                    </div>
                    
                    <div className="flex flex-col gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onToggleFavorite(verse)}
                        className={isFavorite ? "text-red-500" : "text-muted-foreground"}
                      >
                        <Heart className={`h-4 w-4 ${isFavorite ? "fill-current" : ""}`} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyVerse(verse)}
                        className="text-muted-foreground"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => shareVerse(verse)}
                        className="text-muted-foreground"
                      >
                        <Share className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  if (viewMode === 'chapters') {
    const chapterCount = getChapterCount(selectedBook);
    const chapters = Array.from({ length: chapterCount }, (_, i) => i + 1);

    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2 mb-6">
            <Button variant="ghost" onClick={handleBack}>
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back to Books
            </Button>
          </div>
          
          <div className="mb-6">
            <h2 className="text-3xl font-semibold mb-2">{selectedBook}</h2>
            <Badge variant="secondary">
              {chapterCount} chapters
            </Badge>
          </div>

          <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-3">
            {chapters.map((chapter) => (
              <Button
                key={chapter}
                variant="outline"
                className="aspect-square p-0 flex items-center justify-center hover:bg-primary hover:text-primary-foreground"
                onClick={() => handleChapterClick(chapter)}
              >
                {chapter}
              </Button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h2 className="text-3xl font-semibold mb-2">Bible Books</h2>
          <Badge variant="secondary">
            {Object.values(bibleStructure).flat().length} books
          </Badge>
        </div>

        <div className="space-y-8">
          {Object.entries(bibleStructure).map(([category, books]) => (
            <Card key={category} className="p-6">
              <div className="mb-4">
                <h3 className="text-xl font-semibold mb-1">{category}</h3>
                <Badge variant="outline">
                  {books.length} books
                </Badge>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {books.map((book) => {
                  const chapterCount = getChapterCount(book);
                  return (
                    <Card
                      key={book}
                      className="p-4 hover:bg-accent hover:cursor-pointer transition-colors border border-border"
                      onClick={() => handleBookClick(book)}
                    >
                      <div className="flex items-start gap-3">
                        <BookOpen className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-foreground leading-tight mb-1 break-words">
                            {book}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {chapterCount} chapters
                          </p>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}