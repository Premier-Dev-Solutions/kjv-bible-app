import { useState } from "react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./ui/tabs";
import { Plus, BookOpen, Trash2, Edit, Copy, Share, Search, Heart } from "lucide-react";

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

interface TopicsProps {
  topics: Topic[];
  favoriteVerses: Verse[];
  onCreateTopic: (topic: Omit<Topic, 'id' | 'createdAt'>) => void;
  onDeleteTopic: (topicId: string) => void;
  onAddVerseToTopic: (topicId: string, verse: Verse) => void;
  onRemoveVerseFromTopic: (topicId: string, verse: Verse) => void;
  onSearchVerses: (query: string) => Promise<Verse[]>;
  favorites: Set<string>;
  onToggleFavorite: (verse: Verse) => void;
}

export function Topics({ 
  topics, 
  favoriteVerses, 
  onCreateTopic, 
  onDeleteTopic, 
  onAddVerseToTopic, 
  onRemoveVerseFromTopic,
  onSearchVerses,
  favorites,
  onToggleFavorite
}: TopicsProps) {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newTopicTitle, setNewTopicTitle] = useState("");
  const [newTopicDescription, setNewTopicDescription] = useState("");
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [selectedVerseToAdd, setSelectedVerseToAdd] = useState<string>("");
  
  // Search functionality
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Verse[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [activeAddTab, setActiveAddTab] = useState("favorites");

  const handleCreateTopic = () => {
    if (newTopicTitle.trim()) {
      onCreateTopic({
        title: newTopicTitle,
        description: newTopicDescription,
        verses: []
      });
      setNewTopicTitle("");
      setNewTopicDescription("");
      setIsCreateDialogOpen(false);
    }
  };

  const handleAddVerseToTopic = () => {
    if (selectedTopic && selectedVerseToAdd) {
      const verse = favoriteVerses.find(v => 
        `${v.book}_${v.chapter}_${v.verse}` === selectedVerseToAdd
      );
      if (verse) {
        onAddVerseToTopic(selectedTopic.id, verse);
        setSelectedVerseToAdd("");
      }
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchLoading(true);
      try {
        const results = await onSearchVerses(searchQuery);
        setSearchResults(results);
      } catch (error) {
        console.error("Search failed:", error);
        setSearchResults([]);
      } finally {
        setSearchLoading(false);
      }
    }
  };

  const handleAddSearchResultToTopic = (verse: Verse) => {
    if (selectedTopic) {
      onAddVerseToTopic(selectedTopic.id, verse);
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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-semibold mb-2">Study Topics & Lessons</h2>
            <Badge variant="secondary">
              {topics.length} topics
            </Badge>
          </div>
          
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Topic
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Study Topic</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Topic Title</label>
                  <Input
                    placeholder="e.g., Faith and Trust"
                    value={newTopicTitle}
                    onChange={(e) => setNewTopicTitle(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Description</label>
                  <Textarea
                    placeholder="Brief description of this study topic..."
                    value={newTopicDescription}
                    onChange={(e) => setNewTopicDescription(e.target.value)}
                  />
                </div>
                <Button onClick={handleCreateTopic} className="w-full">
                  Create Topic
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {topics.length === 0 ? (
          <Card className="p-8 text-center">
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Study Topics Yet</h3>
            <p className="text-muted-foreground mb-4">
              Create your first study topic to organize verses by theme or lesson.
            </p>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Topic
                </Button>
              </DialogTrigger>
            </Dialog>
          </Card>
        ) : (
          <div className="space-y-6">
            {topics.map((topic) => (
              <Card key={topic.id} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-1">{topic.title}</h3>
                    <p className="text-muted-foreground mb-2">{topic.description}</p>
                    <Badge variant="outline">
                      {topic.verses.length} verses
                    </Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const newSelectedTopic = selectedTopic?.id === topic.id ? null : topic;
                        setSelectedTopic(newSelectedTopic);
                        // Reset search when switching topics
                        if (newSelectedTopic) {
                          setSearchQuery("");
                          setSearchResults([]);
                          setActiveAddTab("favorites");
                        }
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDeleteTopic(topic.id)}
                      className="text-red-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Add verses to topic */}
                {selectedTopic?.id === topic.id && (
                  <div className="mb-4 p-4 bg-muted/50 rounded-lg">
                    <h4 className="text-sm font-medium mb-4">Add Verses to Topic</h4>
                    
                    <Tabs value={activeAddTab} onValueChange={setActiveAddTab}>
                      <TabsList className="grid w-full grid-cols-2 mb-4">
                        <TabsTrigger value="favorites">From Favorites</TabsTrigger>
                        <TabsTrigger value="search">Search Verses</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="favorites">
                        {favoriteVerses.length > 0 ? (
                          <div className="flex gap-2">
                            <Select value={selectedVerseToAdd} onValueChange={setSelectedVerseToAdd}>
                              <SelectTrigger className="flex-1">
                                <SelectValue placeholder="Select a verse from your favorites" />
                              </SelectTrigger>
                              <SelectContent>
                                {favoriteVerses
                                  .filter(v => !topic.verses.some(tv => 
                                    tv.book === v.book && tv.chapter === v.chapter && tv.verse === v.verse
                                  ))
                                  .map((verse) => {
                                    const key = `${verse.book}_${verse.chapter}_${verse.verse}`;
                                    return (
                                      <SelectItem key={key} value={key}>
                                        {verse.book} {verse.chapter}:{verse.verse}
                                      </SelectItem>
                                    );
                                  })}
                              </SelectContent>
                            </Select>
                            <Button onClick={handleAddVerseToTopic} disabled={!selectedVerseToAdd}>
                              Add
                            </Button>
                          </div>
                        ) : (
                          <p className="text-muted-foreground text-center py-4">
                            No favorite verses available. Add some verses to your favorites first.
                          </p>
                        )}
                      </TabsContent>
                      
                      <TabsContent value="search">
                        <div className="space-y-4">
                          <form onSubmit={handleSearch} className="flex gap-2">
                            <div className="relative flex-1">
                              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                              <Input
                                placeholder="Search for verses to add..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10"
                              />
                            </div>
                            <Button type="submit" disabled={searchLoading}>
                              {searchLoading ? "Searching..." : "Search"}
                            </Button>
                          </form>
                          
                          {searchResults.length > 0 && (
                            <div className="max-h-64 overflow-y-auto space-y-3">
                              {searchResults
                                .filter(v => !topic.verses.some(tv => 
                                  tv.book === v.book && tv.chapter === v.chapter && tv.verse === v.verse
                                ))
                                .map((verse) => {
                                  const key = `${verse.book}_${verse.chapter}_${verse.verse}`;
                                  const isFavorite = favorites.has(key);
                                  
                                  return (
                                    <div key={key} className="border border-border rounded-lg p-3 bg-background">
                                      <div className="flex items-start justify-between gap-3">
                                        <div className="flex-1">
                                          <Badge variant="outline" className="mb-2">
                                            {verse.book} {verse.chapter}:{verse.verse}
                                          </Badge>
                                          <p className="text-sm leading-relaxed">
                                            {verse.text}
                                          </p>
                                        </div>
                                        <div className="flex gap-1">
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => onToggleFavorite(verse)}
                                            className={isFavorite ? "text-red-500" : "text-muted-foreground"}
                                          >
                                            <Heart className={`h-4 w-4 ${isFavorite ? "fill-current" : ""}`} />
                                          </Button>
                                          <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleAddSearchResultToTopic(verse)}
                                          >
                                            <Plus className="h-4 w-4" />
                                          </Button>
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })}
                            </div>
                          )}
                          
                          {searchQuery && searchResults.length === 0 && !searchLoading && (
                            <p className="text-muted-foreground text-center py-4">
                              No verses found for &quot;{searchQuery}&quot;. Try different search terms.
                            </p>
                          )}
                        </div>
                      </TabsContent>
                    </Tabs>
                  </div>
                )}

                {/* Topic verses */}
                {topic.verses.length > 0 ? (
                  <div className="space-y-4">
                    {topic.verses.map((verse) => {
                      const key = `${verse.book}_${verse.chapter}_${verse.verse}`;
                      return (
                        <div key={key} className="border border-border rounded-lg p-4">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <Badge variant="outline" className="mb-2">
                                {verse.book} {verse.chapter}:{verse.verse}
                              </Badge>
                              <p className="text-foreground leading-relaxed">
                                {verse.text}
                              </p>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onRemoveVerseFromTopic(topic.id, verse)}
                                className="text-red-500"
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
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-4">
                    No verses added to this topic yet. 
                    {favoriteVerses.length === 0 
                      ? " Add some verses to your favorites first, then you can organize them into topics."
                      : " Click the edit button to add verses from your favorites or search for new ones."
                    }
                  </p>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}