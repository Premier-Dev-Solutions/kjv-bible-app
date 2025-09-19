import { useState, useEffect } from "react";

interface Verse {
  book: string;
  chapter: number;
  verse: number;
  text: string;
}

// Mock Bible data - replace this with your actual API calls
const mockVerses: { [key: string]: Verse[] } = {
  "Genesis_1": [
    {
      book: "Genesis",
      chapter: 1,
      verse: 1,
      text: "In the beginning God created the heavens and the earth."
    },
    {
      book: "Genesis",
      chapter: 1,
      verse: 2,
      text: "Now the earth was formless and empty, darkness was over the surface of the deep, and the Spirit of God was hovering over the waters."
    },
    {
      book: "Genesis",
      chapter: 1,
      verse: 3,
      text: "And God said, 'Let there be light,' and there was light."
    }
  ],
  "John_3": [
    {
      book: "John",
      chapter: 3,
      verse: 16,
      text: "For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life."
    },
    {
      book: "John",
      chapter: 3,
      verse: 17,
      text: "For God did not send his Son into the world to condemn the world, but to save the world through him."
    }
  ],
  "Psalms_23": [
    {
      book: "Psalms",
      chapter: 23,
      verse: 1,
      text: "The Lord is my shepherd, I lack nothing."
    },
    {
      book: "Psalms",
      chapter: 23,
      verse: 2,
      text: "He makes me lie down in green pastures, he leads me beside quiet waters."
    },
    {
      book: "Psalms",
      chapter: 23,
      verse: 3,
      text: "He refreshes my soul. He guides me along the right paths for his name's sake."
    }
  ]
};

export function useBibleApi() {
  const [verses, setVerses] = useState<Verse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchChapter = async (book: string, chapter: number) => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Replace this with your actual API call
      // const response = await fetch(`YOUR_API_ENDPOINT/books/${book}/chapters/${chapter}`);
      // const data = await response.json();
      
      const key = `${book}_${chapter}`;
      const mockData = mockVerses[key] || [];
      
      if (mockData.length === 0) {
        // Generate some mock verses for demonstration
        const generatedVerses: Verse[] = Array.from({ length: 10 }, (_, i) => ({
          book,
          chapter,
          verse: i + 1,
          text: `This is verse ${i + 1} from ${book} chapter ${chapter}. Replace this with your actual API data.`
        }));
        setVerses(generatedVerses);
      } else {
        setVerses(mockData);
      }
    } catch (err) {
      setError("Failed to fetch verses");
      setVerses([]);
    } finally {
      setLoading(false);
    }
  };

  const searchVerses = async (query: string) => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Replace this with your actual search API call
      // const response = await fetch(`YOUR_API_ENDPOINT/search?q=${encodeURIComponent(query)}`);
      // const data = await response.json();
      
      // Mock search results
      const allVerses = Object.values(mockVerses).flat();
      const searchResults = allVerses.filter(verse => 
        verse.text.toLowerCase().includes(query.toLowerCase())
      );
      
      if (searchResults.length === 0 && query.trim()) {
        // Generate mock search results for demonstration
        setVerses([
          {
            book: "Matthew",
            chapter: 5,
            verse: 14,
            text: `Search results for "${query}" would appear here. Replace with your actual search API.`
          }
        ]);
      } else {
        setVerses(searchResults);
      }
    } catch (err) {
      setError("Failed to search verses");
      setVerses([]);
    } finally {
      setLoading(false);
    }
  };

  return {
    verses,
    loading,
    error,
    fetchChapter,
    searchVerses
  };
}