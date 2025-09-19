import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";
import { Search, Book } from "lucide-react";

interface BibleHeaderProps {
  onSearch: (query: string) => void;
  onBookChange: (book: string) => void;
  onChapterChange: (chapter: number) => void;
  selectedBook: string;
  selectedChapter: number;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

// Mock Bible books data
const bibleBooks = [
  "Genesis", "Exodus", "Leviticus", "Numbers", "Deuteronomy",
  "Joshua", "Judges", "Ruth", "1 Samuel", "2 Samuel",
  "1 Kings", "2 Kings", "1 Chronicles", "2 Chronicles",
  "Ezra", "Nehemiah", "Esther", "Job", "Psalms", "Proverbs",
  "Ecclesiastes", "Song of Solomon", "Isaiah", "Jeremiah",
  "Lamentations", "Ezekiel", "Daniel", "Hosea", "Joel",
  "Amos", "Obadiah", "Jonah", "Micah", "Nahum", "Habakkuk",
  "Zephaniah", "Haggai", "Zechariah", "Malachi",
  "Matthew", "Mark", "Luke", "John", "Acts", "Romans",
  "1 Corinthians", "2 Corinthians", "Galatians", "Ephesians",
  "Philippians", "Colossians", "1 Thessalonians", "2 Thessalonians",
  "1 Timothy", "2 Timothy", "Titus", "Philemon", "Hebrews",
  "James", "1 Peter", "2 Peter", "1 John", "2 John", "3 John",
  "Jude", "Revelation"
];

const getChapterCount = (book: string): number => {
  // Mock chapter counts for demonstration
  const chapterCounts: { [key: string]: number } = {
    "Genesis": 50, "Exodus": 40, "Psalms": 150, "Matthew": 28,
    "Mark": 16, "Luke": 24, "John": 21, "Acts": 28, "Romans": 16
  };
  return chapterCounts[book] || 25; // Default to 25 if not specified
};

export function BibleHeader({
  onSearch,
  onBookChange,
  onChapterChange,
  selectedBook,
  selectedChapter,
  searchQuery,
  setSearchQuery,
  activeTab,
  onTabChange
}: BibleHeaderProps) {
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  const chapters = Array.from({ length: getChapterCount(selectedBook) }, (_, i) => i + 1);

  return (
    <header className="bg-card border-b border-border sticky top-0 z-10">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center gap-2">
            <Book className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-semibold">KJV Bible API</h1>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-4">
          <Tabs value={activeTab} onValueChange={onTabChange}>
            <TabsList className="grid w-full max-w-lg grid-cols-4">
              <TabsTrigger value="read">Read</TabsTrigger>
              <TabsTrigger value="books">Books</TabsTrigger>
              <TabsTrigger value="favorites">Favorites</TabsTrigger>
              <TabsTrigger value="topics">Topics</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        {/* Show search and navigation only on read tab */}
        {activeTab === "read" && (
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
            {/* Search */}
            <form onSubmit={handleSearch} className="flex gap-2 flex-1 max-w-md">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search verses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button type="submit">Search</Button>
            </form>

            {/* Navigation */}
            <div className="flex gap-2 items-center">
              <Select value={selectedBook} onValueChange={onBookChange}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Select book" />
                </SelectTrigger>
                <SelectContent>
                  {bibleBooks.map((book) => (
                    <SelectItem key={book} value={book}>
                      {book}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedChapter.toString()} onValueChange={(value) => onChapterChange(parseInt(value))}>
                <SelectTrigger className="w-24">
                  <SelectValue placeholder="Ch." />
                </SelectTrigger>
                <SelectContent>
                  {chapters.map((chapter) => (
                    <SelectItem key={chapter} value={chapter.toString()}>
                      {chapter}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}