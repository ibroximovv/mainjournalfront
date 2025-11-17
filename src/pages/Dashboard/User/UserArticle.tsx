import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Loader2,
  Plus,
  Edit,
  Trash2,
  FileText,
  Search,
  Upload,
  Eye,
  ChevronsUpDown,
  Check,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";

interface Article {
  id: number;
  title: string;
  issn: string;
  description: string;
  abstract: string;
  imageUrl: string;
  articleFileUrl: string;
  isActive: boolean;
  status: string;
  userId: number;
  categoryId: number;
  createdAt: string;
}

interface Category {
  id: number;
  name: string;
}

const UserArticle = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [fileUploading, setFileUploading] = useState(false);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [filterStatus, setFilterStatus] = useState<string>("ALL");

  const [dialogOpen, setDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [viewingArticle, setViewingArticle] = useState<Article | null>(null);
  const [userId, setUserId] = useState<number | null>(null);

  const [open, setOpen] = useState(false);

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    issn: "",
    description: "",
    abstract: "",
    imageUrl: "",
    articleFileUrl: "",
    isActive: true,
    status: "PENDING",
    categoryId: 0,
  });

  const API_BASE = "https://backendjournal.ilyosbekibroximov.uz/api";
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const statusColors: Record<string, string> = {
    PENDING: "bg-yellow-100 text-yellow-800",
    ACCEPTED: "bg-green-100 text-green-800",
    PUBLISHED: "bg-blue-100 text-blue-800",
    REJECTED: "bg-red-100 text-red-800",
    ERROR: "bg-gray-100 text-gray-800",
  };

  const fetchUser = () => {
    fetch(`${API_BASE}/user/me`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        // console.log("Fetched user data:", data.id);
        setUserId(data?.id);
      })
      .catch((err) => console.error("Error:", err));
  };


  // Fetch categories
  const fetchCategories = () => {
    fetch(`${API_BASE}/category?page=1&limit=100`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setCategories(data.data || []))
      .catch((err) => console.error(err));
  };

  // Fetch articles
  const fetchArticles = () => {
    setLoading(true);
    const statusParam = filterStatus !== "ALL" ? `&articleStatus=${filterStatus}` : "";
    const searchParam = searchQuery ? `&search=${searchQuery}` : "";

    fetch(
      `${API_BASE}/article?page=${page}&limit=9&sortBy=${sortBy}&sortOrder=${sortOrder}${statusParam}${searchParam}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        setArticles(data.data || []);
        setTotalPages(data.totalPages || 1);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchUser();
  }, [])

  useEffect(() => {
    fetchArticles();
  }, [page, sortBy, sortOrder, filterStatus]);

  // Upload image
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageUploading(true);
    const formDataUpload = new FormData();
    formDataUpload.append("file", file);

    try {
      const res = await fetch(`${API_BASE}/file/upload-image`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataUpload,
      });
      const data = await res.json();
      console.log(data);

      if (data.success) {
        setFormData({ ...formData, imageUrl: data.link });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setImageUploading(false);
    }
  };

  // Upload article file
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileUploading(true);
    const formDataUpload = new FormData();
    formDataUpload.append("file", file);

    try {
      const res = await fetch(`${API_BASE}/file/upload-article`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataUpload,
      });
      const data = await res.json();

      if (data.success) {
        setFormData({ ...formData, articleFileUrl: data.link });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setFileUploading(false);
    }
  };

  // Create or Update
  const handleSubmit = async () => {
    if (!formData.title || !formData.categoryId) return;

    setCreateLoading(true);
    const url = editingArticle
      ? `${API_BASE}/article/${editingArticle.id}`
      : `${API_BASE}/article`;
    const method = editingArticle ? "PATCH" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        resetForm();
        fetchArticles();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setCreateLoading(false);
    }
  };

  // Delete
  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this article?")) return;

    try {
      await fetch(`${API_BASE}/article/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchArticles();
    } catch (err) {
      console.error(err);
    }
  };

  // Open create dialog
  const openCreateDialog = () => {
    resetForm();
    setDialogOpen(true);
  };

  // Open edit dialog
  const openEditDialog = (article: Article) => {
    setEditingArticle(article);
    setFormData({
      title: article.title,
      issn: article.issn,
      description: article.description,
      abstract: article.abstract,
      imageUrl: article.imageUrl,
      articleFileUrl: article.articleFileUrl,
      isActive: article.isActive,
      status: article.status,
      categoryId: article.categoryId,
    });
    setDialogOpen(true);
  };

  // View article
  const openViewDialog = (article: Article) => {
    setViewingArticle(article);
    setViewDialogOpen(true);
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      title: "",
      issn: "",
      description: "",
      abstract: "",
      imageUrl: "",
      articleFileUrl: "",
      isActive: true,
      status: "PENDING",
      categoryId: 0,
    });
    setEditingArticle(null);
    setDialogOpen(false);
  };

  const handleSearch = () => {
    setPage(1);
    fetchArticles();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-800 mb-2">Maqolalar boshqaruvi</h1>
          <p className="text-slate-600">Yangi maqola yaratish, mavjud maqolalaringizni ko'rish, tahrirlash va o'chirish</p>
        </div>

        {/* Filters & Search */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <div className="flex gap-2">
                  <Input
                    placeholder="Search articles..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  />
                  <Button onClick={handleSearch} variant="outline">
                    <Search className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Status</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="ACCEPTED">Accepted</SelectItem>
                  <SelectItem value="PUBLISHED">Published</SelectItem>
                  <SelectItem value="REJECTED">Rejected</SelectItem>
                  <SelectItem value="ERROR">Error</SelectItem>
                </SelectContent>
              </Select>

              <Select value={`${sortBy}-${sortOrder}`} onValueChange={(val) => {
                const [field, order] = val.split("-");
                setSortBy(field);
                setSortOrder(order as "asc" | "desc");
              }}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="createdAt-desc">Newest First</SelectItem>
                  <SelectItem value="createdAt-asc">Oldest First</SelectItem>
                  <SelectItem value="title-asc">Title A-Z</SelectItem>
                  <SelectItem value="title-desc">Title Z-A</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Create Button */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <Button onClick={openCreateDialog} className="w-full sm:w-auto">
            <Plus className="w-4 h-4 mr-2" />
            Yangi maqola yaratish
          </Button>
          <Button
            onClick={() => navigate(`/dashboard/user/articles/author`)}
            className="cursor-pointer"
          >
            Muallif biriktirish
          </Button>
        </div>

        {/* Articles Grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-slate-500" />
          </div>
        ) : articles.filter((article) => article.userId == userId).length === 0 ? (
          <div className="text-center py-20">
            <FileText className="w-16 h-16 mx-auto text-slate-300 mb-4" />
            <p className="text-slate-500 text-lg">No articles found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.filter(article => article.userId == userId).map((article) => (
              <Card
                key={article.id}
                className={`group hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] overflow-hidden`}
              >
                {article.imageUrl && (
                  <div className="h-48 overflow-hidden bg-slate-200">
                    <img
                      src={article.imageUrl}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                )}
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <CardTitle className="text-lg line-clamp-2">{article.title}</CardTitle>
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${statusColors[article.status]}`}>
                      {article.status}
                    </span>
                  </div>
                  <p className="text-sm text-slate-500">ISSN: {article.issn}</p>
                </CardHeader>
                <CardContent className="space-y-4 bottom-4">
                  <p className="text-sm text-slate-600 line-clamp-3 mb-4">
                    {article.description}
                  </p>
                  <div className="relative">
                    <div className="flex gap-2 flex-wrap">
                      <Button size="sm" variant="outline" onClick={() => openViewDialog(article)}>
                        <Eye className="w-3 h-3 mr-1" />
                        Ko'rish
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => openEditDialog(article)}>
                        <Edit className="w-3 h-3 mr-1" />
                        Tahrir
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDelete(article.id)}>
                        <Trash2 className="w-3 h-3 mr-1" />
                        O'chirish
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-8 gap-2 flex-wrap">
            <Button
              variant="outline"
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
            >
              Previous
            </Button>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              const pageNum = i + 1;
              return (
                <Button
                  key={pageNum}
                  variant={pageNum === page ? "default" : "outline"}
                  onClick={() => setPage(pageNum)}
                >
                  {pageNum}
                </Button>
              );
            })}
            {totalPages > 5 && <span className="px-2 py-2">...</span>}
            <Button
              variant="outline"
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
            >
              Next
            </Button>
          </div>
        )}
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingArticle ? "Edit Article" : "Create New Article"}</DialogTitle>
            <DialogDescription>Fill in the article details below</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-3">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Article title"
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="issn">ISSN *</Label>
              <Input
                id="issn"
                value={formData.issn}
                onChange={(e) => setFormData({ ...formData, issn: e.target.value })}
                placeholder="1234-5678"
              />
            </div>

            <div className="space-y-3 w-full">
              <Label>Category *</Label>

              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    className={cn(
                      "w-full flex items-center justify-between rounded-md border px-3 py-2 text-left text-sm",
                      "bg-white"
                    )}
                  >
                    {formData.categoryId
                      ? categories.find((c) => c.id === formData.categoryId)?.name
                      : "Select category"}

                    <ChevronsUpDown className="h-4 w-4 opacity-50" />
                  </button>
                </PopoverTrigger>

                <PopoverContent align="start" side="bottom" sideOffset={10} className="w-full p-0 ">
                  <Command>
                    <CommandInput placeholder="Search category..." />
                    <CommandList>
                      <CommandEmpty>No categories found.</CommandEmpty>

                      <CommandGroup>
                        {categories.map((cat) => (
                          <CommandItem
                            key={cat.id}
                            value={cat.name}
                            onSelect={() => {
                              setFormData({ ...formData, categoryId: cat.id });
                              setOpen(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                formData.categoryId === cat.id ? "opacity-100" : "opacity-0"
                              )}
                            />
                            {cat.name}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-3">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Brief description"
                rows={3}
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="abstract">Abstract</Label>
              <Textarea
                id="abstract"
                value={formData.abstract}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, abstract: e.target.value })}
                placeholder="Article abstract"
                rows={4}
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="image">Article Image</Label>
              <div className="flex gap-2 items-center">
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={imageUploading}
                />
                {imageUploading && <Loader2 className="w-4 h-4 animate-spin" />}
              </div>
              {formData.imageUrl && (
                <div className="mt-2">
                  <img src={formData.imageUrl} alt="Preview" className="w-32 h-32 object-cover rounded" />
                </div>
              )}
            </div>

            <div className="space-y-3">
              <Label htmlFor="file">Article PDF</Label>
              <div className="flex gap-2 items-center">
                <Input
                  id="file"
                  type="file"
                  accept=".pdf"
                  onChange={handleFileUpload}
                  disabled={fileUploading}
                />
                {fileUploading && <Loader2 className="w-4 h-4 animate-spin" />}
              </div>
              {formData.articleFileUrl && (
                <p className="text-sm text-green-600 mt-1">✓ File uploaded</p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={createLoading || !formData.title || !formData.categoryId}
            >
              {createLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {editingArticle ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{viewingArticle?.title}</DialogTitle>
          </DialogHeader>
          {viewingArticle && (
            <div className="space-y-4">
              {viewingArticle.imageUrl && (
                <img src={viewingArticle.imageUrl} alt={viewingArticle.title} className="w-full h-64 object-cover rounded" />
              )}
              <div>
                <Label>ISSN</Label>
                <p className="text-sm">{viewingArticle.issn}</p>
              </div>
              <div>
                <Label>Status</Label>
                <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${statusColors[viewingArticle.status]}`}>
                  {viewingArticle.status}
                </span>
              </div>
              <div>
                <Label>Description</Label>
                <p className="text-sm">{viewingArticle.description}</p>
              </div>
              <div>
                <Label>Abstract</Label>
                <p className="text-sm">{viewingArticle.abstract}</p>
              </div>
              {viewingArticle.articleFileUrl && (
                <div>
                  <Label>Article File</Label>
                  <a
                    href={viewingArticle.articleFileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline text-sm flex items-center gap-1"
                  >
                    <FileText className="w-4 h-4" />
                    Download PDF
                  </a>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserArticle;