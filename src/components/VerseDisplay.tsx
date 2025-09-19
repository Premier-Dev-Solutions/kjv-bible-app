import { useState } from "react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Heart, Copy, Share, ChevronUp, X } from "lucide-react";

interface Verse {
  book: string;
  chapter: number;
  verse: number;
  text: string;
}

interface VerseDisplayProps {
  verses: Verse[];
  loading: boolean;
  searchMode: boolean;
  favorites: Set<string>;
  onToggleFavorite: (verse: Verse) => void;
  onFetchChapter: (book: string, chapter: number) => Promise<Verse[]>;
}

export function VerseDisplay({ verses, loading, searchMode, favorites, onToggleFavorite, onFetchChapter }: VerseDisplayProps) {
  const [expandedVerse, setExpandedVerse] = useState<Verse | null>(null);
  const [chapterContext, setChapterContext] = useState<Verse[]>([]);
  const [loadingContext, setLoadingContext] = useState(false);
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

  const handleVerseClick = async (verse: Verse) => {
    if (expandedVerse && 
        expandedVerse.book === verse.book && 
        expandedVerse.chapter === verse.chapter && 
        expandedVerse.verse === verse.verse) {
      // Collapse if clicking the same verse
      setExpandedVerse(null);
      setChapterContext([]);
      return;
    }

    setLoadingContext(true);
    try {
      const context = await onFetchChapter(verse.book, verse.chapter);
      setChapterContext(context);
      setExpandedVerse(verse);
    } catch (error) {
      console.error('Failed to fetch chapter context:', error);
    } finally {
      setLoadingContext(false);
    }
  };

  const handleCloseExpanded = () => {
    setExpandedVerse(null);
    setChapterContext([]);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
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
    );
  }

  if (verses.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">
            {searchMode ? "No verses found. Try a different search term." : "Select a book and chapter to start reading."}
          </p>
        </Card>
      </div>
    );
  }

  // If a verse is expanded, show the chapter context
  if (expandedVerse && chapterContext.length > 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-semibold mb-2">
                {expandedVerse.book} {expandedVerse.chapter}
              </h2>
              <Badge variant="secondary">
                {chapterContext.length} verses • Verse {expandedVerse.verse} selected
              </Badge>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCloseExpanded}
              className="flex items-center gap-2"
            >
              <X className="h-4 w-4" />
              Close
            </Button>
          </div>
          
          <div className="space-y-4">
            {chapterContext.map((verse) => {
              const key = `${verse.book}_${verse.chapter}_${verse.verse}`;
              const isFavorite = favorites.has(key);
              const isSelected = verse.verse === expandedVerse.verse;
              
              return (
                <Card 
                  key={key} 
                  className={`p-6 transition-all ${
                    isSelected 
                      ? "bg-accent/50 border-primary/30 shadow-md" 
                      : "hover:shadow-md"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-3">
                        <Badge variant={isSelected ? "default" : "outline"}>
                          {verse.book} {verse.chapter}:{verse.verse}
                        </Badge>
                        {isSelected && (
                          <Badge variant="secondary" className="text-xs">
                            Selected
                          </Badge>
                        )}
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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {!searchMode && verses.length > 0 && (
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
              <Card 
                key={key} 
                className="p-6 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => handleVerseClick(verse)}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant="outline">
                        {verse.book} {verse.chapter}:{verse.verse}
                      </Badge>
                      {searchMode && (
                        <Badge variant="secondary" className="text-xs">
                          Click to view chapter
                        </Badge>
                      )}
                    </div>
                    <p className="text-lg leading-relaxed text-foreground">
                      <span className="font-medium text-primary mr-2">
                        {verse.verse}
                      </span>
                      {verse.text}
                    </p>
                  </div>
                  
                  <div className="flex flex-col gap-2" onClick={(e) => e.stopPropagation()}>
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
        
        {loadingContext && (
          <div className="mt-6 text-center">
            <div className="animate-pulse">
              <p className="text-muted-foreground">Loading chapter context...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}