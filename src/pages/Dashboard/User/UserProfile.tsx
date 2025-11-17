// src/components/UserProfile.tsx
import React, { useEffect, useState, type ChangeEvent } from "react";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Edit2, Check, X, FileText, BookOpen } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import cn from "classnames";

type Article = {
  id: number;
  title: string;
  issn?: string | null;
  description?: string | null;
  imageUrl?: string | null;
  articleFileUrl?: string | null;
  status?: string | null;
  categoryId?: number | null;
  submissionDate?: string | null;
};

type User = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  username?: string;
  phoneNumber?: string | null;
  telegramUsername?: string | null;
  courseNumber?: number | null;
  groupName?: string | null;
  image?: string | null;
  role?: string;
  createdAt?: string;
  updatedAt?: string;
  articles?: Article[];
  journals?: any[]; // agar kerak bo'lsa yangilang
  references?: any[];
};

const API_BASE = "https://backendjournal.ilyosbekibroximov.uz/api";

const HumanDate: React.FC<{ iso?: string }> = ({ iso }) => {
  if (!iso) return <span className="text-sm text-slate-500">—</span>;
  try {
    return <span className="text-sm text-slate-500">{format(new Date(iso), "PPP p")}</span>;
  } catch {
    return <span className="text-sm text-slate-500">{iso}</span>;
  }
};

const UserProfile: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [form, setForm] = useState<Partial<User>>({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("profile");

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/user/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Profile yuklanmadi");
      const data: User = await res.json();
      setUser(data);
      setForm({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        username: data.username,
        phoneNumber: data.phoneNumber ?? "",
        telegramUsername: data.telegramUsername ?? "",
        courseNumber: data.courseNumber ?? undefined,
        groupName: data.groupName ?? "",
        image: data.image ?? "",
      });
    } catch (err) {
      console.error(err);
      toast.error("Profilni yuklashda xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (k: keyof User, v: any) => {
    setForm((prev) => ({ ...prev, [k]: v }));
  };

  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const maxSizeMB = 6;
    if (file.size > maxSizeMB * 1024 * 1024) {
      toast.error(`Rasm maksimal hajmi ${maxSizeMB}MB dan oshmasligi kerak`);
      return;
    }

    try {
      setImageUploading(true);
      const fd = new FormData();
      fd.append("file", file);

      const res = await fetch(`${API_BASE}/file/upload-image`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` } as any,
        body: fd,
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Upload failed");
      }

      const data = await res.json();
      // backend structure ga qarab o'zgartiring
      const imageUrl = data.link ?? data.path ?? data.data?.link ?? data;
      handleChange("image", imageUrl);
      toast.success("Rasm yuklandi");
    } catch (err) {
      console.error(err);
      toast.error("Rasm yuklashda xatolik yuz berdi");
    } finally {
      setImageUploading(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      const payload = {
        firstName: form.firstName,
        lastName: form.lastName,
        phoneNumber: form.phoneNumber,
        telegramUsername: form.telegramUsername,
        courseNumber: form.courseNumber,
        groupName: form.groupName,
        image: form.image,
        username: form.username,
      };

      const res = await fetch(`${API_BASE}/user/${user.id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText || "Update failed");
      }

      const updated = await res.json();
      setUser(updated);
      setForm({
        firstName: updated.firstName,
        lastName: updated.lastName,
        email: updated.email,
        username: updated.username,
        phoneNumber: updated.phoneNumber ?? "",
        telegramUsername: updated.telegramUsername ?? "",
        courseNumber: updated.courseNumber ?? undefined,
        groupName: updated.groupName ?? "",
        image: updated.image ?? "",
      });
      toast.success("Profil yangilandi");
      setEditMode(false);
    } catch (err) {
      console.error(err);
      toast.error("Profilni saqlashda xatolik yuz berdi");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.32 }}
      className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column: Avatar + stats */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Profil</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center text-center">
              <div className="relative">
                <div
                  className={cn(
                    "w-full max-w-xs mx-auto mb-3 overflow-hidden rounded-xl shadow-md transition-all duration-300",
                    editMode ? "scale-95 opacity-90" : "scale-100"
                  )}
                >
                  {form.image ? (
                    <img
                      src={form.image}
                      alt={`${form.firstName} ${form.lastName}`}
                      className="w-full h-48 object-cover"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-3xl font-semibold text-gray-500">
                      {(user?.firstName?.[0] ?? "U") + (user?.lastName?.[0] ?? "")}
                    </div>
                  )}
                </div>


                {editMode && (
                  <div className="absolute -bottom-1 right-0">
                    <label className="inline-flex items-center gap-2 cursor-pointer text-xs bg-white border rounded px-2 py-1 shadow-sm">
                      <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                      {imageUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span className="text-xs">Rasm o‘zgartirish</span>}
                    </label>
                  </div>
                )}
              </div>

              <h3 className="text-lg font-semibold">{user ? `${user.firstName} ${user.lastName}` : "—"}</h3>
              <p className="text-sm text-slate-500">{user?.email}</p>

              <div className="mt-3 w-full">
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2 border rounded text-center">
                    <div className="text-xs text-slate-500">Ruxsat</div>
                    <div className="font-medium">{user?.role ?? "—"}</div>
                  </div>
                  <div className="p-2 border rounded text-center">
                    <div className="text-xs text-slate-500">Maqolalar</div>
                    <div className="font-medium">{user?.articles?.length ?? 0}</div>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex gap-2">
                <Button variant="ghost" onClick={() => setEditMode((s) => !s)}>
                  <Edit2 className="w-4 h-4 mr-2" /> {editMode ? "Bekor qilish" : "Tahrirlash"}
                </Button>
                {editMode && (
                  <Button onClick={handleSave} disabled={saving}>
                    {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Check className="w-4 h-4 mr-2" />}
                    Saqlash
                  </Button>
                )}
              </div>

              <Separator className="my-4" />

              <div className="text-xs text-slate-500 w-full">
                <div className="flex justify-between">
                  <span>Ro‘yxatdan o‘tgan:</span>
                  <HumanDate iso={user?.createdAt} />
                </div>
                <div className="flex justify-between mt-1">
                  <span>Oxirgi yangilanish:</span>
                  <HumanDate iso={user?.updatedAt} />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Right column: tabs */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Profil ma'lumotlari</CardTitle>
                <div className="text-sm text-slate-500">Siz bu yerda profilni tahrirlashingiz mumkin</div>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v)}>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                  <TabsList>
                    <TabsTrigger value="profile">Asosiy</TabsTrigger>
                    <TabsTrigger value="articles">Maqolalar</TabsTrigger>
                    
                    <TabsTrigger value="settings">Sozlamalar</TabsTrigger>
                  </TabsList>
                </div>

                {/* Profile tab */}
                <TabsContent value="profile">
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.05 }}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Ism</Label>
                        <Input value={form.firstName ?? ""} onChange={(e) => handleChange("firstName", e.target.value)} disabled={!editMode} />
                      </div>
                      <div className="space-y-2">
                        <Label>Familiya</Label>
                        <Input value={form.lastName ?? ""} onChange={(e) => handleChange("lastName", e.target.value)} disabled={!editMode} />
                      </div>

                      <div className="space-y-2 sm:col-span-2">
                        <Label>Email</Label>
                        <Input value={form.email ?? ""} disabled />
                      </div>

                      <div className="space-y-2">
                        <Label>Foydalanuvchi nomi</Label>
                        <Input value={form.username ?? ""} onChange={(e) => handleChange("username", e.target.value)} disabled={!editMode} />
                      </div>

                      <div className="space-y-2">
                        <Label>Telefon</Label>
                        <Input value={form.phoneNumber ?? ""} onChange={(e) => handleChange("phoneNumber", e.target.value)} disabled={!editMode} />
                      </div>

                      <div className="space-y-2">
                        <Label>Telegram</Label>
                        <Input value={form.telegramUsername ?? ""} onChange={(e) => handleChange("telegramUsername", e.target.value)} disabled={!editMode} />
                      </div>

                      <div className="space-y-2">
                        <Label>Kurs</Label>
                        <Input type="number" value={form.courseNumber ?? ""} onChange={(e) => handleChange("courseNumber", Number(e.target.value))} disabled={!editMode} />
                      </div>

                      <div className="space-y-2">
                        <Label>Guruh</Label>
                        <Input value={form.groupName ?? ""} onChange={(e) => handleChange("groupName", e.target.value)} disabled={!editMode} />
                      </div>

                      <div className="space-y-2 sm:col-span-2">
                        <Label>Qisqacha bio (ixtiyoriy)</Label>
                        <Textarea value={(form as any).bio ?? ""} onChange={(e) => handleChange("bio" as any, e.target.value)} rows={3} disabled={!editMode} />
                      </div>
                    </div>
                  </motion.div>
                </TabsContent>

                {/* Articles tab */}
                <TabsContent value="articles">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {user?.articles && user.articles.length > 0 ? (
                      user.articles.map((a) => (
                        <Card key={a.id} className="hover:shadow-lg transition-shadow">
                          <CardContent className="flex gap-3">
                            <div className="w-20 h-20 flex-shrink-0 rounded overflow-hidden bg-slate-100">
                              {a.imageUrl ? <img src={a.imageUrl} alt={a.title} className="w-full h-full object-cover" /> : <div className="w-full h-full" />}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-start justify-between">
                                <div>
                                  <div className="font-medium">{a.title}</div>
                                  <div className="text-xs text-slate-500 mt-1 line-clamp-2">{a.description}</div>
                                </div>
                                <div className="text-xs text-slate-400">{a.status}</div>
                              </div>

                              <div className="mt-3 flex items-center gap-2">
                                <a href={a.articleFileUrl ? a.articleFileUrl : '#'} target="_blank" rel="noreferrer" className="text-sm inline-flex items-center gap-2">
                                  <FileText className="w-4 h-4" /> Faylni ko‘rish
                                </a>
                                <span className="text-xs text-slate-400">ID: {a.id}</span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    ) : (
                      <div className="text-sm text-slate-500">Maqolalar topilmadi.</div>
                    )}
                  </div>
                </TabsContent>

                {/* Journals tab (placeholder) */}
                <TabsContent value="journals">
                  <div className="space-y-3">
                    <div className="text-sm text-slate-600">Sizning jurnallar va versiyalar (agar mavjud bo'lsa)</div>
                    {user?.journals && user.journals.length > 0 ? (
                      user.journals.map((j: any, idx: number) => (
                        <div key={idx} className="p-3 border rounded">{JSON.stringify(j)}</div>
                      ))
                    ) : (
                      <div className="text-sm text-slate-500">Hech qanday jurnal topilmadi.</div>
                    )}
                  </div>
                </TabsContent>

                {/* Settings tab */}
                <TabsContent value="settings">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Parolni o‘zgartirish</Label>
                      <div className="flex gap-2 mt-2">
                        <Input placeholder="Joriy parol" type="password" disabled />
                        <Button variant="outline" disabled>O‘zgartirish</Button>
                      </div>
                      <p className="text-xs text-slate-500 mt-2">Parol o‘zgartirish backend bilan qo‘shimcha endpoint talab qiladi.</p>
                    </div>

                    <div>
                      <Label>Notifikatsiya</Label>
                      <div className="mt-2 text-sm text-slate-500">E-pochta va Telegram orqali bildirishlar (keyinchalik sozlanadi).</div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
};

export default UserProfile;