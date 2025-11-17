import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Search, UserPlus, Users, X, Check, Plus, Pencil } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

interface Author {
  id: number;
  fullName: string;
  email: string;
}

interface Article {
  id: number;
  title: string;
  description: string;
  status?: string;
  userId?: number;
  authors?: ArticleAuthor[];
}

interface ArticleAuthor {
  id: number;
  authorId: number;
  authorLevel: string;
  author?: Author;
}

interface SelectedAuthor {
  id: number;
  level: string;
}

const API_BASE = "https://backendjournal.ilyosbekibroximov.uz/api";

const AuthorManagement = () => {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const [articles, setArticles] = useState<Article[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [selectedAuthors, setSelectedAuthors] = useState<SelectedAuthor[]>([]);
  const [currentArticle, setCurrentArticle] = useState<Article | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [articleAuthorCounts, setArticleAuthorCounts] = useState<Record<number, number>>({});
  
  // New author creation
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newAuthorName, setNewAuthorName] = useState("");
  const [newAuthorEmail, setNewAuthorEmail] = useState("");
  const [creatingAuthor, setCreatingAuthor] = useState(false);
  
  // Edit author
  const [editingAuthor, setEditingAuthor] = useState<Author | null>(null);
  const [editAuthorName, setEditAuthorName] = useState("");
  const [editAuthorEmail, setEditAuthorEmail] = useState("");
  const [updatingAuthor, setUpdatingAuthor] = useState(false);

  // Fetch pending articles
  const fetchArticles = async () => {
    try {      
      // Avval current user ma'lumotlarini olish
      const userRes = await fetch(`${API_BASE}/user/me`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      
      const userData = await userRes.json();
      
      const currentUserId = userData.id;
      // console.log(currentUserId);
      

      // Barcha maqolalarni olish
      const res = await fetch(`${API_BASE}/article`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      
      // Faqat current user yaratgan va pending holatdagi maqolalarni filtrlash
      const pendingArticles = data.data.filter((a: Article) => 
        (a.status?.toLowerCase() === "pending" || !a.status) && 
        a.userId === currentUserId
      );
      setArticles(pendingArticles);
      
      // Fetch author counts for all articles
      const counts: Record<number, number> = {};
      for (const article of pendingArticles) {
        const authorData = await fetchArticleAuthors();
        
        const filteredAuthors = authorData.filter((aa: any ) => aa.articleId === article.id);
        counts[article.id] = filteredAuthors.length;
      }
      
      setArticleAuthorCounts(counts);
    } catch (err) {
      // console.log(err);
      
      toast.error("Maqolalarni yuklashda xatolik");
    }
  };

  // Fetch all authors
  const fetchAuthors = async () => {
    try {
      const res = await fetch(`${API_BASE}/author`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setAuthors(data.data);
    } catch (err) {
      toast.error("Mualliflarni yuklashda xatolik");
    }
  };

  // Fetch article authors
  const fetchArticleAuthors = async () => {
    try {
      const res = await fetch(`${API_BASE}/article-author`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      return data.data || [];
    } catch (err) {
      return [];
    }
  };

  useEffect(() => {
    fetchArticles();
    fetchAuthors();
  }, []);

  // Open sheet for specific article
  const openAuthorSheet = async (articleId: number) => {
    const article = articles.find((a) => a.id === articleId);
    if (!article) return;

    setCurrentArticle(article);
    setIsSheetOpen(true);
    setShowCreateForm(false);

    const existingAuthors = await fetchArticleAuthors();
    const mapped = existingAuthors.filter((ea: any) => ea.articleId === articleId).map((ea: any) => ({
      id: ea.authorId,
      level: ea.authorLevel,
    }));
    setSelectedAuthors(mapped);
  };

  // Toggle author selection
  const toggleAuthor = (authorId: number) => {
    const exists = selectedAuthors.find((a) => a.id === authorId);
    if (exists) {
      setSelectedAuthors(selectedAuthors.filter((a) => a.id !== authorId));
    } else {
      // Check if maximum 5 authors limit reached
      if (selectedAuthors.length >= 5) {
        toast.error("Maksimum 5 ta muallif biriktirish mumkin");
        return;
      }
      setSelectedAuthors([...selectedAuthors, { id: authorId, level: "1" }]);
    }
  };

  // Update author level
  const updateAuthorLevel = (authorId: number, level: string) => {
    setSelectedAuthors((prev) =>
      prev.map((a) => (a.id === authorId ? { ...a, level } : a))
    );
  };

  // Remove selected author
  const removeAuthor = (authorId: number) => {
    setSelectedAuthors(selectedAuthors.filter((a) => a.id !== authorId));
  };

  // Create new author
  const createAuthor = async () => {
    if (!newAuthorName.trim() || !newAuthorEmail.trim()) {
      toast.error("Barcha maydonlarni to'ldiring");
      return;
    }

    // Email formatini tekshirish
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newAuthorEmail)) {
      toast.error("Email formatini to'g'ri kiriting");
      return;
    }

    // Check if maximum 5 authors limit reached
    if (selectedAuthors.length >= 5) {
      toast.error("Maksimum 5 ta muallif biriktirish mumkin");
      return;
    }

    setCreatingAuthor(true);
    try {
      const res = await fetch(`${API_BASE}/author`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: newAuthorName.trim(),
          email: newAuthorEmail.trim(),
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to create author");
      }
      
      const data = await res.json();

      // Yangi muallifni ro'yxatga qo'shish
      setAuthors([...authors, data.data]);
      
      // Tanlangan mualliflar ro'yxatiga qo'shish
      setSelectedAuthors([...selectedAuthors, { id: data.data.id, level: "1" }]);
      
      // Formani tozalash
      setNewAuthorName("");
      setNewAuthorEmail("");
      setShowCreateForm(false);
      
      toast.success("Muallif yaratildi va tanlandi");
    } catch (err: any) {
      toast.error(err.message || "Muallif yaratishda xatolik");
    } finally {
      setCreatingAuthor(false);
    }
  };

  // Start editing author
  const startEditAuthor = (author: Author) => {
    setEditingAuthor(author);
    setEditAuthorName(author.fullName);
    setEditAuthorEmail(author.email);
    setShowCreateForm(false);
  };

  // Update author
  const updateAuthor = async () => {
    if (!editingAuthor || !editAuthorName.trim() || !editAuthorEmail.trim()) {
      toast.error("Barcha maydonlarni to'ldiring");
      return;
    }

    setUpdatingAuthor(true);
    try {
      const res = await fetch(`${API_BASE}/author/${editingAuthor.id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: editAuthorName,
          email: editAuthorEmail,
        }),
      });

      if (!res.ok) throw new Error("Failed to update author");
      const data = await res.json();

      setAuthors(authors.map(a => a.id === editingAuthor.id ? data.data : a));
      setEditingAuthor(null);
      setEditAuthorName("");
      setEditAuthorEmail("");
      toast.success("Muallif tahrirlandi");
    } catch (err) {
      toast.error("Muallif tahrirlashda xatolik");
    } finally {
      setUpdatingAuthor(false);
    }
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditingAuthor(null);
    setEditAuthorName("");
    setEditAuthorEmail("");
  };

  // Save authors to article
  const saveAuthors = async () => {
    if (!currentArticle || !selectedAuthors.length) {
      toast.error("Kamida bitta muallif tanlang");
      return;
    }

    if (selectedAuthors.length > 5) {
      toast.error("Maksimum 5 ta muallif biriktirish mumkin");
      return;
    }

    setLoading(true);
    try {
      // const existing = await fetchArticleAuthors();
      // for (const ea of existing) {
      //   await fetch(`${API_BASE}/article-author/${ea.id}`, {
      //     method: "DELETE",
      //     headers: { Authorization: `Bearer ${token}` },
      //   });
      // }

      for (const author of selectedAuthors) {
        await fetch(`${API_BASE}/article-author`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            articleId: currentArticle.id,
            authorId: author.id,
            authorLevel: author.level,
          }),
        });
      }

      // Update author count for this article
      setArticleAuthorCounts(prev => ({
        ...prev,
        [currentArticle.id]: selectedAuthors.length
      }));

      toast.success("Mualliflar muvaffaqiyatli biriktirildi!");
      setIsSheetOpen(false);
      setSelectedAuthors([]);
    } catch (err) {
      toast.error("Xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  };

  // Close sheet
  const closeSheet = () => {
    setIsSheetOpen(false);
    setSelectedAuthors([]);
    setSearchQuery("");
    setShowCreateForm(false);
    setNewAuthorName("");
    setNewAuthorEmail("");
    setEditingAuthor(null);
    setEditAuthorName("");
    setEditAuthorEmail("");
  };

  // Filter authors
  const filteredAuthors = authors.filter((a) =>
    a.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get author count
  const getAuthorCount = (articleId: number) => {
    return articleAuthorCounts[articleId] || 0;
  };

  // Get status color
  const getStatusColor = (authorCount: number) => {
    if (authorCount === 0) return "bg-red-100 text-red-800 border-red-300";
    if (authorCount < 5) return "bg-yellow-100 text-yellow-800 border-yellow-300";
    return "bg-green-100 text-green-800 border-green-300";
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Mualliflarni boshqarish</h1>
          <p className="text-muted-foreground mt-1">
            Pending holatidagi maqolalarga mualliflarni biriktiring
          </p>
        </div>
        <Badge variant="outline" className="px-4 py-2">
          <Users className="w-4 h-4 mr-2" />
          {articles.length} ta maqola
        </Badge>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">#</TableHead>
                <TableHead>Maqola nomi</TableHead>
                <TableHead>Tavsif</TableHead>
                <TableHead className="text-center w-32">Mualliflar</TableHead>
                <TableHead className="text-center w-32">Holat</TableHead>
                <TableHead className="text-right w-48">Amallar</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {articles.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                    Pending holatida maqolalar topilmadi
                  </TableCell>
                </TableRow>
              ) : (
                articles.map((article, idx) => {
                  const authorCount = getAuthorCount(article.id);
                  return (
                    <TableRow key={article.id}>
                      <TableCell className="font-medium">{idx + 1}</TableCell>
                      <TableCell className="font-medium max-w-xs">
                        <div className="truncate">{article.title}</div>
                      </TableCell>
                      <TableCell className="max-w-md">
                        <div className="line-clamp-2 text-sm text-muted-foreground">
                          {article.description}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline" className="font-mono">
                          {authorCount}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline" className={getStatusColor(authorCount)}>
                          {authorCount === 0 ? "Yo'q" : authorCount < 5 ? "Kam" : "To'liq"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openAuthorSheet(article.id)}
                        >
                          <UserPlus className="w-4 h-4 mr-2" />
                          Muallif qo'shish
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Author Assignment Sheet */}
      <Sheet open={isSheetOpen} onOpenChange={closeSheet}>
        <SheetContent className="w-full sm:max-w-xl overflow-y-auto p-4">
          <SheetHeader>
            <SheetTitle>Mualliflarni biriktirish</SheetTitle>
            <SheetDescription className="line-clamp-1">
              {currentArticle?.title}
            </SheetDescription>
          </SheetHeader>

          <div className="py-6 space-y-6">
            {/* Edit Author Form */}
            {editingAuthor ? (
              <Card className="border-2 border-blue-500">
                <CardContent className="pt-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-base font-semibold">Muallifni tahrirlash</Label>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={cancelEdit}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="edit-name">To'liq ism</Label>
                      <Input
                        id="edit-name"
                        placeholder="Muallifning to'liq ismi"
                        value={editAuthorName}
                        onChange={(e) => setEditAuthorName(e.target.value)}
                        className="mt-1.5"
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit-email">Email</Label>
                      <Input
                        id="edit-email"
                        type="email"
                        placeholder="muallif@email.com"
                        value={editAuthorEmail}
                        onChange={(e) => setEditAuthorEmail(e.target.value)}
                        className="mt-1.5"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={cancelEdit}
                        disabled={updatingAuthor}
                        className="flex-1"
                      >
                        Bekor qilish
                      </Button>
                      <Button
                        onClick={updateAuthor}
                        disabled={updatingAuthor}
                        className="flex-1"
                      >
                        {updatingAuthor ? "Saqlanmoqda..." : "Saqlash"}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : null}

            {/* Create New Author Form */}
            {showCreateForm ? (
              <Card className="border-2 border-primary">
                <CardContent className="pt-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-base font-semibold">Yangi muallif yaratish</Label>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowCreateForm(false)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="name">To'liq ism</Label>
                      <Input
                        id="name"
                        placeholder="Muallifning to'liq ismi"
                        value={newAuthorName}
                        onChange={(e) => setNewAuthorName(e.target.value)}
                        className="mt-1.5"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="muallif@email.com"
                        value={newAuthorEmail}
                        onChange={(e) => setNewAuthorEmail(e.target.value)}
                        className="mt-1.5"
                      />
                    </div>
                    <Button
                      onClick={createAuthor}
                      disabled={creatingAuthor}
                      className="w-full"
                    >
                      {creatingAuthor ? "Yaratilmoqda..." : "Muallif yaratish"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : !editingAuthor ? (
              <Button
                variant="outline"
                onClick={() => setShowCreateForm(true)}
                className="w-full border-dashed border-2"
              >
                <Plus className="w-4 h-4 mr-2" />
                Yangi muallif yaratish
              </Button>
            ) : null}

            <Separator />

            {/* Search Authors */}
            <div className="space-y-2">
              <Label>Mualliflarni qidiring</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Ism yoki email bo'yicha qidiring..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            {/* Authors List */}
            <div className="space-y-2">
              <Label>Mavjud mualliflar</Label>
              <ScrollArea className="h-[180px] rounded-md border">
                <div className="p-3 space-y-2">
                  {filteredAuthors.length === 0 ? (
                    <div className="text-center py-8 text-sm text-muted-foreground">
                      Mualliflar topilmadi
                    </div>
                  ) : (
                    filteredAuthors.map((author) => {
                      const isSelected = selectedAuthors.some((sa) => sa.id === author.id);
                      return (
                        <div
                          key={author.id}
                          className={`flex items-center justify-between p-3 rounded-lg transition-all ${
                            isSelected
                              ? "bg-primary/10 border-2 border-primary"
                              : "hover:bg-muted/50 border-2 border-transparent"
                          }`}
                        >
                          <div 
                            className="flex-1 min-w-0 cursor-pointer"
                            onClick={() => toggleAuthor(author.id)}
                          >
                            <div className="font-medium truncate">{author.fullName}</div>
                            <div className="text-xs text-muted-foreground truncate">
                              {author.email}
                            </div>
                          </div>
                          <div className="flex items-center gap-2 ml-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 flex-shrink-0"
                              onClick={() => startEditAuthor(author)}
                            >
                              <Pencil className="w-4 h-4" />
                            </Button>
                            {isSelected && <Check className="w-5 h-5 text-primary flex-shrink-0" />}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </ScrollArea>
            </div>

            <Separator />

            {/* Selected Authors */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Tanlangan mualliflar ({selectedAuthors.length}/5)</Label>
                {selectedAuthors.length >= 5 && (
                  <Badge variant="secondary" className="text-xs">
                    Maksimum limit
                  </Badge>
                )}
              </div>
              <ScrollArea className="h-[200px] rounded-md border">
                <div className="p-3 space-y-2">
                  {selectedAuthors.length === 0 ? (
                    <div className="text-center py-8 text-sm text-muted-foreground">
                      Hali muallif tanlanmagan
                    </div>
                  ) : (
                    selectedAuthors.map((sa) => {
                      const author = authors.find((a) => a.id === sa.id);
                      return (
                        <Card key={sa.id}>
                          <CardContent className="p-3">
                            <div className="flex items-center gap-3">
                              <div className="flex-1 min-w-0">
                                <div className="font-medium text-sm truncate">
                                  {author?.fullName}
                                </div>
                                <div className="text-xs text-muted-foreground truncate">
                                  {author?.email}
                                </div>
                              </div>
                              <Select
                                value={sa.level}
                                onValueChange={(val) => updateAuthorLevel(sa.id, val)}
                              >
                                <SelectTrigger className="w-[110px]">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="1">Daraja 1</SelectItem>
                                  <SelectItem value="2">Daraja 2</SelectItem>
                                  <SelectItem value="3">Daraja 3</SelectItem>
                                  <SelectItem value="4">Daraja 4</SelectItem>
                                  <SelectItem value="5">Daraja 5</SelectItem>
                                </SelectContent>
                              </Select>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => removeAuthor(sa.id)}
                                className="flex-shrink-0"
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })
                  )}
                </div>
              </ScrollArea>
            </div>
          </div>

          <SheetFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={closeSheet} disabled={loading} className="flex-1">
              Bekor qilish
            </Button>
            <Button
              onClick={saveAuthors}
              disabled={!selectedAuthors.length || loading}
              className="flex-1"
            >
              {loading ? "Saqlanmoqda..." : `Saqlash (${selectedAuthors.length})`}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default AuthorManagement;