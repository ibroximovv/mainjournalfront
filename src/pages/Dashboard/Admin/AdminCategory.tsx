import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Loader2, Trash2, Edit, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

interface Category {
  id: number;
  name: string;
}

const AdminCategory = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editName, setEditName] = useState("");

  const API_BASE = "https://backendjournal.ilyosbekibroximov.uz/api";
  const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null;

  // GET categories
  const fetchCategories = (pageNumber: number = 1) => {
    setLoading(true);
    fetch(`${API_BASE}/category?page=${pageNumber}&limit=10&sortBy=createdAt&sortOrder=asc`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch categories");
        return res.json();
      })
      .then((data) => {
        setCategories(data.data || []);
        setTotalPages(data.totalPages || 1);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchCategories(page);
  }, [page]);

  // CREATE category
  const createCategory = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.preventDefault();
    if (!newCategory.trim()) return;
    setCreateLoading(true);
    fetch(`${API_BASE}/category`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name: newCategory.trim() }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to create category");
        return res.json();
      })
      .then(() => {
        setNewCategory("");
        fetchCategories(page);
      })
      .catch((err) => console.error(err))
      .finally(() => setCreateLoading(false));
  };

  // DELETE category
  const deleteCategory = (id: number) => {
    if (!confirm("Are you sure you want to delete this category?")) return;
    fetch(`${API_BASE}/category/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to delete category");
        fetchCategories(page);
      })
      .catch((err) => console.error(err));
  };

  // Open edit dialog
  const openEditDialog = (category: Category) => {
    setEditingCategory(category);
    setEditName(category.name);
    setEditDialogOpen(true);
  };

  // PATCH category (update)
  const updateCategory = () => {
    if (!editingCategory || !editName.trim()) return;
    fetch(`${API_BASE}/category/${editingCategory.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name: editName.trim() }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to update category");
        return res.json();
      })
      .then(() => {
        fetchCategories(page);
        setEditDialogOpen(false);
        setEditingCategory(null);
        setEditName("");
      })
      .catch((err) => console.error(err));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-800 mb-2">Category Management</h1>
          <p className="text-slate-600">Create and manage your categories</p>
        </div>

        {/* Create section */}
        <Card className="mb-8 border-slate-200 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-700">
              <Plus className="w-5 h-5" />
              Add New Category
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-3">
              <Input
                placeholder="Enter category name..."
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    createCategory(e);
                  }
                }}
                className="flex-1"
                disabled={createLoading}
              />
              <Button
                onClick={createCategory}
                disabled={createLoading || !newCategory.trim()}
                className="sm:w-auto w-full"
              >
                {createLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {createLoading ? "Creating..." : "Create Category"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Categories Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-slate-500" />
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-slate-500 text-lg">No categories found. Create your first one!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {categories.map((cat, index) => (
              <Card
                key={cat.id}
                className="group relative overflow-hidden border-slate-200 hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1"
              >
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-semibold text-slate-700">
                    {index + 1 + (page - 1) * 10}. {cat.name}
                  </CardTitle>
                </CardHeader>
                {/* <CardContent className="pb-3">
                  <p className="text-sm text-slate-500">ID: {cat.id}</p>
                </CardContent> */}
                
                {/* Action buttons that slide up */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-white via-white to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out p-4 pt-8">
                  <div className="flex gap-2 justify-end">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openEditDialog(cat)}
                      className="hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300 transition-colors"
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => deleteCategory(cat.id)}
                      className="hover:bg-red-600 transition-colors"
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
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
              className="hover:bg-slate-100"
            >
              Previous
            </Button>
            {Array.from({ length: totalPages }, (_, i) => (
              <Button
                key={i}
                variant={i + 1 === page ? "default" : "outline"}
                onClick={() => setPage(i + 1)}
                className={i + 1 === page ? "" : "hover:bg-slate-100"}
              >
                {i + 1}
              </Button>
            ))}
            <Button
              variant="outline"
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              className="hover:bg-slate-100"
            >
              Next
            </Button>
          </div>
        )}
      </div>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
            <DialogDescription>
              Update the category name below.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="edit-name" className="text-right">
              Category Name
            </Label>
            <Input
              id="edit-name"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="mt-2"
              placeholder="Enter new category name..."
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEditDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={updateCategory}
              disabled={!editName.trim()}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminCategory;