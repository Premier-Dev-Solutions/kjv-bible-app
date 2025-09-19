'use client'

import { useState, useEffect } from "react";
import { BibleHeader } from "@/components/BibleHeader";
import { VerseDisplay } from "@/components/VerseDisplay";
import { Favorites } from "@/components/Favorites";
import { Topics } from "@/components/Topics";
import { BooksExplorer } from "@/components/BooksExplorer";
import { useBibleApi } from "@/hooks/useBibleApi";

interface Verse {
  book: string;
  chapter: number;
  verse: number;
  text: string;
}

interface Topic {
  id: string;
  title: string;
  description: string;
  verses: Verse[];
  createdAt: Date;
}

export default function HomePage() {
  const [selectedBook, setSelectedBook] = useState("John");
  const [selectedChapter, setSelectedChapter] = useState(3);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchMode, setSearchMode] = useState(false);
  const [activeTab, setActiveTab] = useState("read");

  // Favorites state
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [favoriteVerses, setFavoriteVerses] = useState<Verse[]>([]);

  // Topics state
  const [topics, setTopics] = useState<Topic[]>([]);

  const { verses, loading, error, fetchChapter, searchVerses } = useBibleApi();

  // Load initial chapter on component mount
  useEffect(() => {
    fetchChapter(selectedBook, selectedChapter);
  }, []);

  // Update favorite verses array when favorites set changes
  useEffect(() => {
    const favoritesArray: Verse[] = [];
    favorites.forEach(favoriteKey => {
      const verse = findVerseByKey(favoriteKey);
      if (verse) {
        favoritesArray.push(verse);
      }
    });
    setFavoriteVerses(favoritesArray);
  }, [favorites]);

  const findVerseByKey = (key: string): Verse | null => {
    // Try to find the verse in current verses first
    const foundVerse = verses.find(v => `${v.book}_${v.chapter}_${v.verse}` === key);
    if (foundVerse) return foundVerse;

    // If not found, try to find in favoriteVerses (for existing favorites)
    const existingFavorite = favoriteVerses.find(v => `${v.book}_${v.chapter}_${v.verse}` === key);
    if (existingFavorite) return existingFavorite;

    return null;
  };

  const handleBookChange = (book: string) => {
    setSelectedBook(book);
    setSelectedChapter(1);
    setSearchMode(false);
    fetchChapter(book, 1);
  };

  const handleChapterChange = (chapter: number) => {
    setSelectedChapter(chapter);
    setSearchMode(false);
    fetchChapter(selectedBook, chapter);
  };

  const handleSearch = (query: string) => {
    if (query.trim()) {
      setSearchMode(true);
      searchVerses(query);
    } else {
      setSearchMode(false);
      fetchChapter(selectedBook, selectedChapter);
    }
  };

  // Handle book selection from Books Explorer
  const handleBooksExplorerSelection = (book: string, chapter?: number) => {
    setSelectedBook(book);
    if (chapter) {
      setSelectedChapter(chapter);
      fetchChapter(book, chapter);
    } else {
      setSelectedChapter(1);
      fetchChapter(book, 1);
    }
    setSearchMode(false);
  };

  const handleToggleFavorite = (verse: Verse) => {
    const key = `${verse.book}_${verse.chapter}_${verse.verse}`;
    const newFavorites = new Set(favorites);
    const newFavoriteVerses = [...favoriteVerses];

    if (newFavorites.has(key)) {
      newFavorites.delete(key);
      const index = newFavoriteVerses.findIndex(v => `${v.book}_${v.chapter}_${v.verse}` === key);
      if (index > -1) {
        newFavoriteVerses.splice(index, 1);
      }
    } else {
      newFavorites.add(key);
      newFavoriteVerses.push(verse);
    }

    setFavorites(newFavorites);
    setFavoriteVerses(newFavoriteVerses);
  };

  const handleRemoveFavorite = (verse: Verse) => {
    handleToggleFavorite(verse);
  };

  const handleCreateTopic = (topicData: Omit<Topic, 'id' | 'createdAt'>) => {
    const newTopic: Topic = {
      ...topicData,
      id: Date.now().toString(),
      createdAt: new Date()
    };
    setTopics([...topics, newTopic]);
  };

  const handleDeleteTopic = (topicId: string) => {
    setTopics(topics.filter(topic => topic.id !== topicId));
  };

  const handleAddVerseToTopic = (topicId: string, verse: Verse) => {
    setTopics(topics.map(topic => {
      if (topic.id === topicId) {
        // Check if verse is already in this topic
        const verseExists = topic.verses.some(v =>
          v.book === verse.book && v.chapter === verse.chapter && v.verse === verse.verse
        );
        if (!verseExists) {
          return { ...topic, verses: [...topic.verses, verse] };
        }
      }
      return topic;
    }));
  };

  const handleRemoveVerseFromTopic = (topicId: string, verse: Verse) => {
    setTopics(topics.map(topic => {
      if (topic.id === topicId) {
        return {
          ...topic,
          verses: topic.verses.filter(v =>
            !(v.book === verse.book && v.chapter === verse.chapter && v.verse === verse.verse)
          )
        };
      }
      return topic;
    }));
  };

  // Search function for Topics component
  const handleTopicsSearch = async (query: string): Promise<Verse[]> => {
    return new Promise((resolve) => {
      // Simulate API delay
      setTimeout(() => {
        // This uses the same mock search logic as useBibleApi
        // In a real app, you'd call your actual search API here
        const allMockVerses = [
          {
            book: "Genesis",
            chapter: 1,
            verse: 1,
            text: "In the beginning God created the heavens and the earth."
          },
          {
            book: "John",
            chapter: 3,
            verse: 16,
            text: "For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life."
          },
          {
            book: "Psalms",
            chapter: 23,
            verse: 1,
            text: "The Lord is my shepherd, I lack nothing."
          },
          {
            book: "Matthew",
            chapter: 5,
            verse: 14,
            text: "You are the light of the world. A town built on a hill cannot be hidden."
          },
          {
            book: "Romans",
            chapter: 8,
            verse: 28,
            text: "And we know that in all things God works for the good of those who love him, who have been called according to his purpose."
          },
          {
            book: "Philippians",
            chapter: 4,
            verse: 13,
            text: "I can do all this through him who gives me strength."
          },
          {
            book: "Tobit",
            chapter: 4,
            verse: 15,
            text: "Do to no one what you yourself dislike."
          },
          {
            book: "Wisdom of Solomon",
            chapter: 3,
            verse: 1,
            text: "But the souls of the righteous are in the hand of God, and no torment will ever touch them."
          }
        ];

        const results = allMockVerses.filter(verse =>
          verse.text.toLowerCase().includes(query.toLowerCase()) ||
          verse.book.toLowerCase().includes(query.toLowerCase())
        );

        resolve(results);
      }, 500);
    });
  };

  // Function to fetch chapter context for verse expansion
  const handleFetchChapter = async (book: string, chapter: number): Promise<Verse[]> => {
    return new Promise((resolve, reject) => {
      // Simulate API delay
      setTimeout(() => {
        try {
          // This simulates fetching a full chapter
          // In a real app, you'd call your actual chapter API here
          const mockChapterData: { [key: string]: Verse[] } = {
            "Genesis_1": [
              { book: "Genesis", chapter: 1, verse: 1, text: "In the beginning God created the heavens and the earth." },
              { book: "Genesis", chapter: 1, verse: 2, text: "Now the earth was formless and empty, darkness was over the surface of the deep, and the Spirit of God was hovering over the waters." },
              { book: "Genesis", chapter: 1, verse: 3, text: "And God said, 'Let there be light,' and there was light." },
              { book: "Genesis", chapter: 1, verse: 4, text: "God saw that the light was good, and he separated the light from the darkness." },
              { book: "Genesis", chapter: 1, verse: 5, text: "God called the light 'day,' and the darkness he called 'night.' And there was evening, and there was morning—the first day." }
            ],
            "John_3": [
              { book: "John", chapter: 3, verse: 14, text: "Just as Moses lifted up the snake in the wilderness, so the Son of Man must be lifted up," },
              { book: "John", chapter: 3, verse: 15, text: "that everyone who believes may have eternal life in him." },
              { book: "John", chapter: 3, verse: 16, text: "For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life." },
              { book: "John", chapter: 3, verse: 17, text: "For God did not send his Son into the world to condemn the world, but to save the world through him." },
              { book: "John", chapter: 3, verse: 18, text: "Whoever believes in him is not condemned, but whoever does not believe stands condemned already because they have not believed in the name of God's one and only Son." }
            ],
            "Psalms_23": [
              { book: "Psalms", chapter: 23, verse: 1, text: "The Lord is my shepherd, I lack nothing." },
              { book: "Psalms", chapter: 23, verse: 2, text: "He makes me lie down in green pastures, he leads me beside quiet waters," },
              { book: "Psalms", chapter: 23, verse: 3, text: "he refreshes my soul. He guides me along the right paths for his name's sake." },
              { book: "Psalms", chapter: 23, verse: 4, text: "Even though I walk through the darkest valley, I will fear no evil, for you are with me; your rod and your staff, they comfort me." },
              { book: "Psalms", chapter: 23, verse: 5, text: "You prepare a table before me in the presence of my enemies. You anoint my head with oil; my cup overflows." },
              { book: "Psalms", chapter: 23, verse: 6, text: "Surely your goodness and love will follow me all the days of my life, and I will dwell in the house of the Lord forever." }
            ]
          };

          const key = `${book}_${chapter}`;
          const chapterData = mockChapterData[key];

          if (chapterData) {
            resolve(chapterData);
          } else {
            // Generate mock verses for unknown chapters
            const generatedVerses: Verse[] = Array.from({ length: 15 }, (_, i) => ({
              book,
              chapter,
              verse: i + 1,
              text: `This is verse ${i + 1} from ${book} chapter ${chapter}. Replace this with your actual API data.`
            }));
            resolve(generatedVerses);
          }
        } catch (error) {
          reject(error);
        }
      }, 300);
    });
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case "books":
        return (
          <BooksExplorer
            onBookSelect={handleBooksExplorerSelection}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
            verses={verses}
            loading={loading}
          />
        );
      case "favorites":
        return (
          <Favorites
            favoriteVerses={favoriteVerses}
            onRemoveFavorite={handleRemoveFavorite}
          />
        );
      case "topics":
        return (
          <Topics
            topics={topics}
            favoriteVerses={favoriteVerses}
            onCreateTopic={handleCreateTopic}
            onDeleteTopic={handleDeleteTopic}
            onAddVerseToTopic={handleAddVerseToTopic}
            onRemoveVerseFromTopic={handleRemoveVerseFromTopic}
            onSearchVerses={handleTopicsSearch}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
          />
        );
      default:
        return (
          <VerseDisplay
            verses={verses}
            loading={loading}
            searchMode={searchMode}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
            onFetchChapter={handleFetchChapter}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <BibleHeader
        onSearch={handleSearch}
        onBookChange={handleBookChange}
        onChapterChange={handleChapterChange}
        selectedBook={selectedBook}
        selectedChapter={selectedChapter}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {error && (
        <div className="container mx-auto px-4 py-4">
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 text-destructive">
            Error: {error}
          </div>
        </div>
      )}

      {renderActiveTab()}
    </div>
  );
}