import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { Plus, Search, Edit, Trash2, ChevronLeft, ChevronRight, ArrowUpDown } from "lucide-react";

export interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  courseNumber?: number;
  groupName?: string;
  telegramUsername?: string;
  image?: string;
  role: "USER" | "ADMIN" | "SUPERADMIN";
  createdAt: string;
  updatedAt: string;
}

interface ApiResponse {
  statusCode: number;
  message: string;
  total: number;
  page: number;
  limit: number;
  data: User[];
}

const SuperadminControl = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [searchFields] = useState("firstName,lastName,email,username");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [loading, setLoading] = useState(false);
  
  // Modal states
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
    courseNumber: "",
    groupName: "",
    telegramUsername: "",
    image: "",
    role: "USER" as "USER" | "ADMIN" | "SUPERADMIN"
  });

  const API_BASE = "https://backendjournal.ilyosbekibroximov.uz/api";

  // Fetch users with pagination, search, and sort
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        sortBy,
        sortOrder,
        ...(search && { search, searchFields })
      });

      const res = await fetch(`${API_BASE}/user?${params}`);
      const data: ApiResponse = await res.json();
      setUsers(data.data);
      setTotal(data.total);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, limit, sortBy, sortOrder, search]);

  const token = localStorage.getItem("token");

  // Create user
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        courseNumber: formData.courseNumber ? parseInt(formData.courseNumber) : undefined,
        groupName: formData.groupName || undefined,
        telegramUsername: formData.telegramUsername || undefined,
        image: formData.image || undefined,
      };

      await fetch(`${API_BASE}/user/create-admin`, {
        method: "POST",
        body: JSON.stringify(payload),
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
      });

      setIsCreateOpen(false);
      resetForm();
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  // Update user
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;

    try {
      const payload = {
        username: formData.username,
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phoneNumber: formData.phoneNumber,
        courseNumber: formData.courseNumber ? parseInt(formData.courseNumber) : undefined,
        groupName: formData.groupName || undefined,
        telegramUsername: formData.telegramUsername || undefined,
        image: formData.image || undefined,
        role: formData.role,
      };

      await fetch(`${API_BASE}/user/${selectedUser.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify(payload),
      });

      setIsEditOpen(false);
      setSelectedUser(null);
      resetForm();
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  // Delete user
  const handleDelete = async (id: number) => {
    if (!confirm("Foydalanuvchini o'chirishni xohlaysizmi?")) return;
    try {
      await fetch(`${API_BASE}/user/${id}`, { method: "DELETE", headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` }, });
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  // Open edit modal
  const openEditModal = (user: User) => {
    setSelectedUser(user);
    setFormData({
      username: user.username,
      password: "",
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phoneNumber: user.phoneNumber,
      courseNumber: user.courseNumber?.toString() || "",
      groupName: user.groupName || "",
      telegramUsername: user.telegramUsername || "",
      image: user.image || "",
      role: user.role,
    });
    setIsEditOpen(true);
  };

  const resetForm = () => {
    setFormData({
      username: "",
      password: "",
      email: "",
      firstName: "",
      lastName: "",
      phoneNumber: "",
      courseNumber: "",
      groupName: "",
      telegramUsername: "",
      image: "",
      role: "USER",
    });
  };

  const totalPages = Math.ceil(total / limit);

  const getRoleBadge = (role: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive"> = {
      USER: "secondary",
      ADMIN: "default",
      SUPERADMIN: "destructive",
    };
    return <Badge variant={variants[role] || "default"}>{role}</Badge>;
  };

  return (
    <Card className="shadow-lg border-slate-200">
      <CardHeader className="border-b bg-gradient-to-r from-slate-50 to-slate-100">
        <CardTitle className="text-2xl flex items-center gap-2">
          <span>Foydalanuvchilar Boshqaruvi</span>
          <Badge variant="outline" className="ml-auto">{total} ta foydalanuvchi</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {/* Search and Actions */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Ism, email yoki username bo'yicha qidirish..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="pl-10"
            />
          </div>
          
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Yangi Foydalanuvchi
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Yangi Foydalanuvchi Yaratish</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreate} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Username *</Label>
                    <Input
                      required
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Parol *</Label>
                    <Input
                      required
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Ism *</Label>
                    <Input
                      required
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Familiya *</Label>
                    <Input
                      required
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Email *</Label>
                    <Input
                      required
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Telefon *</Label>
                    <Input
                      required
                      value={formData.phoneNumber}
                      onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                      placeholder="+998999999999"
                    />
                  </div>
                  <div>
                    <Label>Kurs</Label>
                    <Input
                      type="number"
                      value={formData.courseNumber}
                      onChange={(e) => setFormData({ ...formData, courseNumber: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Guruh</Label>
                    <Input
                      value={formData.groupName}
                      onChange={(e) => setFormData({ ...formData, groupName: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Telegram</Label>
                    <Input
                      value={formData.telegramUsername}
                      onChange={(e) => setFormData({ ...formData, telegramUsername: e.target.value })}
                      placeholder="@username"
                    />
                  </div>
                  <div>
                    <Label>Rol *</Label>
                    <Select
                      value={formData.role}
                      onValueChange={(value: any) => setFormData({ ...formData, role: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USER">USER</SelectItem>
                        <SelectItem value="ADMIN">ADMIN</SelectItem>
                        <SelectItem value="SUPERADMIN">SUPERADMIN</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>
                    Bekor qilish
                  </Button>
                  <Button type="submit">Yaratish</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Sort Controls */}
        <div className="flex gap-2 mb-4">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Saralash" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="createdAt">Yaratilgan sana</SelectItem>
              <SelectItem value="firstName">Ism</SelectItem>
              <SelectItem value="lastName">Familiya</SelectItem>
              <SelectItem value="email">Email</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
          >
            <ArrowUpDown className="w-4 h-4" />
          </Button>
        </div>

        {/* Table */}
        <div className="rounded-lg border overflow-hidden">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead className="font-semibold">ID</TableHead>
                <TableHead className="font-semibold">Foydalanuvchi</TableHead>
                <TableHead className="font-semibold">Email</TableHead>
                <TableHead className="font-semibold">Telefon</TableHead>
                <TableHead className="font-semibold">Kurs/Guruh</TableHead>
                <TableHead className="font-semibold">Rol</TableHead>
                <TableHead className="font-semibold text-right">Amallar</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                  </TableCell>
                </TableRow>
              ) : users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-slate-500">
                    Foydalanuvchilar topilmadi
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user, idx) => (
                  <TableRow 
                    key={user.id} 
                    className="hover:bg-slate-50 transition-colors animate-fadeIn"
                    style={{ animationDelay: `${idx * 50}ms` }}
                  >
                    <TableCell className="font-medium">{user.id}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{user.firstName} {user.lastName}</div>
                        <div className="text-sm text-slate-500">@{user.username}</div>
                      </div>
                    </TableCell>
                    <TableCell className="text-slate-600">{user.email}</TableCell>
                    <TableCell className="text-slate-600">{user.phoneNumber}</TableCell>
                    <TableCell>
                      {user.courseNumber && user.groupName ? (
                        <div className="text-sm">
                          <div>{user.courseNumber}-kurs</div>
                          <div className="text-slate-500">{user.groupName}</div>
                        </div>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </TableCell>
                    <TableCell>{getRoleBadge(user.role)}</TableCell>
                    <TableCell>
                      <div className="flex gap-2 justify-end">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditModal(user)}
                          className="gap-1"
                        >
                          <Edit className="w-3 h-3" />
                          Tahrirlash
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(user.id)}
                          className="gap-1"
                        >
                          <Trash2 className="w-3 h-3" />
                          O'chirish
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
          <div className="text-sm text-slate-600">
            Jami: {total} ta | Sahifa: {page} / {totalPages}
          </div>
          <div className="flex items-center gap-2">
            <Select value={limit.toString()} onValueChange={(v) => setLimit(parseInt(v))}>
              <SelectTrigger className="w-[100px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5 ta</SelectItem>
                <SelectItem value="10">10 ta</SelectItem>
                <SelectItem value="20">20 ta</SelectItem>
                <SelectItem value="50">50 ta</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="sm"
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="gap-1"
            >
              <ChevronLeft className="w-4 h-4" />
              Oldingi
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages}
              onClick={() => setPage(page + 1)}
              className="gap-1"
            >
              Keyingi
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>

      {/* Edit Modal */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Foydalanuvchini Tahrirlash</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdate} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Username *</Label>
                <Input
                  required
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                />
              </div>
              <div>
                <Label>Email *</Label>
                <Input
                  required
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div>
                <Label>Ism *</Label>
                <Input
                  required
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                />
              </div>
              <div>
                <Label>Familiya *</Label>
                <Input
                  required
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                />
              </div>
              <div>
                <Label>Telefon *</Label>
                <Input
                  required
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                />
              </div>
              <div>
                <Label>Kurs</Label>
                <Input
                  type="number"
                  value={formData.courseNumber}
                  onChange={(e) => setFormData({ ...formData, courseNumber: e.target.value })}
                />
              </div>
              <div>
                <Label>Guruh</Label>
                <Input
                  value={formData.groupName}
                  onChange={(e) => setFormData({ ...formData, groupName: e.target.value })}
                />
              </div>
              <div>
                <Label>Telegram</Label>
                <Input
                  value={formData.telegramUsername}
                  onChange={(e) => setFormData({ ...formData, telegramUsername: e.target.value })}
                  placeholder="@username"
                />
              </div>
              <div>
                <Label>Rol *</Label>
                <Select
                  value={formData.role}
                  onValueChange={(value: any) => setFormData({ ...formData, role: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USER">USER</SelectItem>
                    <SelectItem value="ADMIN">ADMIN</SelectItem>
                    <SelectItem value="SUPERADMIN">SUPERADMIN</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsEditOpen(false)}>
                Bekor qilish
              </Button>
              <Button type="submit">Saqlash</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default SuperadminControl;