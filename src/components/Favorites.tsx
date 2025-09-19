import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Heart, Copy, Share, Trash2 } from "lucide-react";

interface Verse {
  book: string;
  chapter: number;
  verse: number;
  text: string;
}

interface FavoritesProps {
  favoriteVerses: Verse[];
  onRemoveFavorite: (verse: Verse) => void;
}

export function Favorites({ favoriteVerses, onRemoveFavorite }: FavoritesProps) {
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

  if (favoriteVerses.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Card className="p-8 text-center">
            <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Favorite Verses Yet</h3>
            <p className="text-muted-foreground">
              Start adding verses to your favorites by clicking the heart icon while reading.
            </p>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h2 className="text-3xl font-semibold mb-2">Your Favorite Verses</h2>
          <Badge variant="secondary">
            {favoriteVerses.length} verses
          </Badge>
        </div>
        
        <div className="space-y-6">
          {favoriteVerses.map((verse) => {
            const key = `${verse.book}_${verse.chapter}_${verse.verse}`;
            
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
                      onClick={() => onRemoveFavorite(verse)}
                      className="text-red-500 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
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