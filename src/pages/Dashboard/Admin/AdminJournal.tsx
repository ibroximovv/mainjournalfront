import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Plus, Edit, Trash2, Search, ChevronLeft, ChevronRight, Loader2, X, FileText, BookOpen, Users, UserPlus, FileCheck } from 'lucide-react';

const API_BASE = 'https://backendjournal.ilyosbekibroximov.uz/api';
const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

interface Journal {
  id: number;
  title: string;
  description: string;
  abstract?: string;
  imageUrl?: string;
  publishedDate?: string;
  issn?: string;
  doi?: string;
  webSiteUrl?: string;
  journalFileUrl?: string;
  isActive: boolean;
  createdAt?: string;
}

interface Article {
  id: number;
  title: string;
  issn?: string;
  description: string;
  abstract?: string;
  imageUrl?: string;
  doi?: string;
  webSiteUrl?: string;
  articleFileUrl?: string;
  isActive: boolean;
  submissionDate: string;
  acceptanceDate?: string;
  publicationDate?: string;
  status: string;
  categoryId?: number;
  userId: number;
  createdAt: string;
  updatedAt: string;
}

interface Author {
  id: number;
  fullName: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

interface JournalVersion {
  id: number;
  journalId: number;
  articleId: number;
  pageStart: number;
  pageEnd: number;
  imageUrl?: string;
  doi?: string;
  webSiteUrl?: string;
  publishedDate: string;
  createdAt?: string;
}

interface JournalAuthor {
  id: number;
  journalId: number;
  authorId: number;
  authorLevel: string;
  createdAt: string;
}

type StepType = 'journals' | 'authors' | 'journal-authors' | 'versions';

const AdminJournal = () => {
  const [currentStep, setCurrentStep] = useState<StepType>('journals');
  const [journals, setJournals] = useState<Journal[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [journalVersions, setJournalVersions] = useState<JournalVersion[]>([]);
  const [journalAuthors, setJournalAuthors] = useState<JournalAuthor[]>([]);
  
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(10);
  
  const [showDialog, setShowDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState<'create' | 'edit'>('create');
  const [selectedItem, setSelectedItem] = useState<any>(null);
  
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<any>(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingPdf, setUploadingPdf] = useState(false);

  const [journalForm, setJournalForm] = useState({
    title: '',
    description: '',
    abstract: '',
    imageUrl: '',
    publishedDate: '',
    issn: '',
    doi: '',
    webSiteUrl: '',
    journalFileUrl: '',
    isActive: true
  });

  const [authorForm, setAuthorForm] = useState({
    fullName: '',
    email: ''
  });

  const [versionForm, setVersionForm] = useState({
    journalId: '',
    articleId: '',
    pageStart: '',
    pageEnd: '',
    imageUrl: '',
    doi: '',
    webSiteUrl: '',
    publishedDate: ''
  });

  const [journalAuthorForm, setJournalAuthorForm] = useState({
    journalId: '',
    authorId: '',
    authorLevel: '1'
  });

  const steps = [
    { id: 'journals', label: 'Create Journal', icon: BookOpen, description: 'Step 1: Create a new journal' },
    { id: 'authors', label: 'Add Authors', icon: Users, description: 'Step 2: Add authors to system' },
    { id: 'journal-authors', label: 'Link Authors', icon: UserPlus, description: 'Step 3: Link authors to journal' },
    { id: 'versions', label: 'Publish Articles', icon: FileCheck, description: 'Step 4: Publish articles to journal' }
  ];

  useEffect(() => {
    fetchData();
  }, [currentStep, currentPage]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const sortBy = 'createdAt';
      const sortOrder = 'desc';
      const headers = { 'Authorization': `Bearer ${token}` };
      
      switch(currentStep) {
        case 'journals':
          const journalsRes = await fetch(`${API_BASE}/journal?page=${currentPage}&limit=${limit}&sortBy=${sortBy}&sortOrder=${sortOrder}`, { headers });
          const journalsData = await journalsRes.json();
          setJournals(journalsData.data || []);
          setTotalPages(Math.ceil((journalsData.total || 0) / limit));
          break;
          
        case 'authors':
          const authorsRes = await fetch(`${API_BASE}/author?page=${currentPage}&limit=${limit}&sortBy=${sortBy}&sortOrder=${sortOrder}`, { headers });
          const authorsData = await authorsRes.json();
          setAuthors(authorsData.data || []);
          setTotalPages(Math.ceil((authorsData.total || 0) / limit));
          break;
          
        case 'journal-authors':
          const jaRes = await fetch(`${API_BASE}/journal-author?page=${currentPage}&limit=${limit}&sortBy=${sortBy}&sortOrder=${sortOrder}`, { headers });
          const jaData = await jaRes.json();
          setJournalAuthors(jaData.data || []);
          setTotalPages(Math.ceil((jaData.total || 0) / limit));
          
          const authorsAllRes = await fetch(`${API_BASE}/author?page=1&limit=100&sortBy=${sortBy}&sortOrder=${sortOrder}`, { headers });
          const authorsAllData = await authorsAllRes.json();
          setAuthors(authorsAllData.data || []);
          
          const journalsAllRes = await fetch(`${API_BASE}/journal?page=1&limit=100&sortBy=${sortBy}&sortOrder=${sortOrder}`, { headers });
          const journalsAllData = await journalsAllRes.json();
          setJournals(journalsAllData.data || []);
          break;
          
        case 'versions':
          const versionsRes = await fetch(`${API_BASE}/journal-version?page=${currentPage}&limit=${limit}&sortBy=${sortBy}&sortOrder=${sortOrder}`, { headers });
          const versionsData = await versionsRes.json();
          setJournalVersions(versionsData.data || []);
          setTotalPages(Math.ceil((versionsData.total || 0) / limit));
          
          const acceptedArticlesRes = await fetch(`${API_BASE}/article?page=1&limit=100&sortBy=${sortBy}&sortOrder=${sortOrder}`, { headers });
          const acceptedArticlesData = await acceptedArticlesRes.json();
          
          setArticles((acceptedArticlesData.data || []).filter((a: Article) => a.status === 'ACCEPTED'));
          
          const allJournalsRes = await fetch(`${API_BASE}/journal?page=1&limit=100&sortBy=${sortBy}&sortOrder=${sortOrder}`, { headers });
          const allJournalsData = await allJournalsRes.json();
          setJournals(allJournalsData.data || []);
          break;
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, formType: 'journal' | 'version') => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch(`${API_BASE}/file/upload-image`, {
        method: 'POST',
        body: formData,
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      
      if (data.success) {
        if (formType === 'journal') {
          setJournalForm(prev => ({ ...prev, imageUrl: data.link }));
        } else if (formType === 'version') {
          setVersionForm(prev => ({ ...prev, imageUrl: data.link }));
        }
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setUploadingImage(false);
    }
  };

  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingPdf(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch(`${API_BASE}/file/upload-journal`, {
        method: 'POST',
        body: formData,
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      
      if (data.success) {
        setJournalForm(prev => ({ ...prev, journalFileUrl: data.link }));
      }
    } catch (error) {
      console.error('Error uploading PDF:', error);
    } finally {
      setUploadingPdf(false);
    }
  };

  const openDialog = (mode: 'create' | 'edit', item: any = null) => {
    setDialogMode(mode);
    setSelectedItem(item);
    
    if (mode === 'edit' && item) {
      switch(currentStep) {
        case 'journals':
          setJournalForm(item);
          break;
        case 'authors':
          setAuthorForm(item);
          break;
        case 'versions':
          setVersionForm({
            journalId: item.journalId?.toString() || '',
            articleId: item.articleId?.toString() || '',
            pageStart: item.pageStart?.toString() || '',
            pageEnd: item.pageEnd?.toString() || '',
            imageUrl: item.imageUrl || '',
            doi: item.doi || '',
            webSiteUrl: item.webSiteUrl || '',
            publishedDate: item.publishedDate || ''
          });
          break;
        case 'journal-authors':
          setJournalAuthorForm({
            journalId: item.journalId?.toString() || '',
            authorId: item.authorId?.toString() || '',
            authorLevel: item.authorLevel || '1'
          });
          break;
      }
    } else {
      resetForms();
    }
    
    setShowDialog(true);
  };

  const resetForms = () => {
    setJournalForm({
      title: '',
      description: '',
      abstract: '',
      imageUrl: '',
      publishedDate: '',
      issn: '',
      doi: '',
      webSiteUrl: '',
      journalFileUrl: '',
      isActive: true
    });
    setAuthorForm({ fullName: '', email: '' });
    setVersionForm({
      journalId: '',
      articleId: '',
      pageStart: '',
      pageEnd: '',
      imageUrl: '',
      doi: '',
      webSiteUrl: '',
      publishedDate: ''
    });
    setJournalAuthorForm({
      journalId: '',
      authorId: '',
      authorLevel: '1'
    });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      let endpoint = '';
      let body: any = {};
      
      switch(currentStep) {
        case 'journals':
          endpoint = dialogMode === 'edit' ? `${API_BASE}/journal/${selectedItem?.id}` : `${API_BASE}/journal`;
          body = journalForm;
          break;
        case 'authors':
          endpoint = dialogMode === 'edit' ? `${API_BASE}/author/${selectedItem?.id}` : `${API_BASE}/author`;
          body = authorForm;
          break;
        case 'versions':
          endpoint = `${API_BASE}/journal-version`;
          body = {
            ...versionForm,
            journalId: parseInt(versionForm.journalId),
            articleId: parseInt(versionForm.articleId),
            pageStart: parseInt(versionForm.pageStart),
            pageEnd: parseInt(versionForm.pageEnd)
          };
          break;
        case 'journal-authors':
          endpoint = `${API_BASE}/journal-author`;
          body = {
            ...journalAuthorForm,
            journalId: parseInt(journalAuthorForm.journalId),
            authorId: parseInt(journalAuthorForm.authorId)
          };
          break;
      }

      const method = dialogMode === 'edit' ? 'PATCH' : 'POST';
      
      await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(body)
      });

      setShowDialog(false);
      fetchData();
      resetForms();
    } catch (error) {
      console.error('Error saving:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!itemToDelete) return;
    
    setLoading(true);
    try {
      let endpoint = '';
      
      switch(currentStep) {
        case 'journals':
          endpoint = `${API_BASE}/journal/${itemToDelete.id}`;
          break;
        case 'authors':
          endpoint = `${API_BASE}/author/${itemToDelete.id}`;
          break;
        case 'versions':
          endpoint = `${API_BASE}/journal-version/${itemToDelete.id}`;
          break;
        case 'journal-authors':
          endpoint = `${API_BASE}/journal-author/${itemToDelete.id}`;
          break;
      }

      await fetch(endpoint, { 
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      setShowDeleteDialog(false);
      setItemToDelete(null);
      fetchData();
    } catch (error) {
      console.error('Error deleting:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date?: string) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const getStepIndex = (step: StepType) => steps.findIndex(s => s.id === step);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Journal Management System</h1>
              <p className="mt-1 text-sm text-gray-600">Professional journal publication workflow</p>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 w-64 border-gray-300"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stepper */}
        <Card className="mb-8 border-gray-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const isActive = currentStep === step.id;
                const isCompleted = getStepIndex(currentStep) > index;
                
                return (
                  <React.Fragment key={step.id}>
                    <div className="flex flex-col items-center flex-1">
                      <button
                        onClick={() => setCurrentStep(step.id as StepType)}
                        className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                          isActive 
                            ? 'bg-blue-600 text-white shadow-lg' 
                            : isCompleted
                            ? 'bg-green-600 text-white'
                            : 'bg-gray-200 text-gray-500'
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                      </button>
                      <div className="mt-2 text-center">
                        <p className={`text-sm font-medium ${isActive ? 'text-blue-600' : 'text-gray-600'}`}>
                          {step.label}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">{step.description}</p>
                      </div>
                    </div>
                    {index < steps.length - 1 && (
                      <div className={`flex-1 h-0.5 mx-4 mb-12 ${
                        isCompleted ? 'bg-green-600' : 'bg-gray-200'
                      }`} />
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <Card className="border-gray-200">
          <CardHeader className="p-5 border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-semibold text-gray-900">
                {steps.find(s => s.id === currentStep)?.label}
              </CardTitle>
              <Button 
                onClick={() => openDialog('create')}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add New
              </Button>
            </div>
          </CardHeader>

          <CardContent className="p-6">
            {currentStep === 'journals' && (
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead className="font-semibold text-gray-900">Title</TableHead>
                      <TableHead className="font-semibold text-gray-900">ISSN</TableHead>
                      <TableHead className="font-semibold text-gray-900">Published</TableHead>
                      <TableHead className="font-semibold text-gray-900">Status</TableHead>
                      <TableHead className="text-right font-semibold text-gray-900">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-12">
                          <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-600" />
                        </TableCell>
                      </TableRow>
                    ) : journals.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-12 text-gray-500">
                          No journals found. Create your first journal to get started.
                        </TableCell>
                      </TableRow>
                    ) : (
                      journals.filter(j => j.title?.toLowerCase().includes(searchTerm.toLowerCase())).map((journal) => (
                        <TableRow key={journal.id} className="hover:bg-gray-50">
                          <TableCell className="font-medium text-gray-900">{journal.title}</TableCell>
                          <TableCell className="text-gray-600">{journal.issn || 'N/A'}</TableCell>
                          <TableCell className="text-gray-600">{formatDate(journal.publishedDate)}</TableCell>
                          <TableCell>
                            <Badge variant={journal.isActive ? 'default' : 'secondary'} 
                              className={journal.isActive ? 'bg-green-100 text-green-800 border-green-200' : 'bg-gray-100 text-gray-800'}>
                              {journal.isActive ? 'Active' : 'Inactive'}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button size="sm" variant="ghost" onClick={() => openDialog('edit', journal)} className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="ghost" className="text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => { setItemToDelete(journal); setShowDeleteDialog(true); }}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            )}

            {currentStep === 'authors' && (
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead className="font-semibold text-gray-900">Full Name</TableHead>
                      <TableHead className="font-semibold text-gray-900">Email</TableHead>
                      <TableHead className="font-semibold text-gray-900">Created At</TableHead>
                      <TableHead className="text-right font-semibold text-gray-900">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-12">
                          <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-600" />
                        </TableCell>
                      </TableRow>
                    ) : authors.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-12 text-gray-500">
                          No authors found. Add authors to continue.
                        </TableCell>
                      </TableRow>
                    ) : (
                      authors.filter(a => a.fullName?.toLowerCase().includes(searchTerm.toLowerCase())).map((author) => (
                        <TableRow key={author.id} className="hover:bg-gray-50">
                          <TableCell className="font-medium text-gray-900">{author.fullName}</TableCell>
                          <TableCell className="text-gray-600">{author.email}</TableCell>
                          <TableCell className="text-gray-600">{formatDate(author.createdAt)}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button size="sm" variant="ghost" onClick={() => openDialog('edit', author)} className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="ghost" className="text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => { setItemToDelete(author); setShowDeleteDialog(true); }}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            )}

            {currentStep === 'journal-authors' && (
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead className="font-semibold text-gray-900">Journal ID</TableHead>
                      <TableHead className="font-semibold text-gray-900">Author ID</TableHead>
                      <TableHead className="font-semibold text-gray-900">Level</TableHead>
                      <TableHead className="font-semibold text-gray-900">Created At</TableHead>
                      <TableHead className="text-right font-semibold text-gray-900">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-12">
                          <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-600" />
                        </TableCell>
                      </TableRow>
                    ) : journalAuthors.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-12 text-gray-500">
                          No author links found. Link authors to journals.
                        </TableCell>
                      </TableRow>
                    ) : (
                      journalAuthors.map((ja) => (
                        <TableRow key={ja.id} className="hover:bg-gray-50">
                          <TableCell className="font-medium text-gray-900">{ja.journalId}</TableCell>
                          <TableCell className="text-gray-600">{ja.authorId}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="border-blue-200 text-blue-800">Level {ja.authorLevel}</Badge>
                          </TableCell>
                          <TableCell className="text-gray-600">{formatDate(ja.createdAt)}</TableCell>
                          <TableCell className="text-right">
                            <Button size="sm" variant="ghost" className="text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => { setItemToDelete(ja); setShowDeleteDialog(true); }}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            )}

            {currentStep === 'versions' && (
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead className="font-semibold text-gray-900">Journal ID</TableHead>
                      <TableHead className="font-semibold text-gray-900">Article ID</TableHead>
                      <TableHead className="font-semibold text-gray-900">Pages</TableHead>
                      <TableHead className="font-semibold text-gray-900">Published</TableHead>
                      <TableHead className="text-right font-semibold text-gray-900">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-12">
                          <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-600" />
                        </TableCell>
                      </TableRow>
                    ) : journalVersions.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-12 text-gray-500">
                          No published versions. Publish articles to journals.
                        </TableCell>
                      </TableRow>
                    ) : (
                      journalVersions.map((version) => (
                        <TableRow key={version.id} className="hover:bg-gray-50">
                          <TableCell className="font-medium text-gray-900">{version.journalId}</TableCell>
                          <TableCell className="text-gray-600">{version.articleId}</TableCell>
                          <TableCell className="text-gray-600">{version.pageStart} - {version.pageEnd}</TableCell>
                          <TableCell className="text-gray-600">{formatDate(version.publishedDate)}</TableCell>
                          <TableCell className="text-right">
                            <Button size="sm" variant="ghost" className="text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => { setItemToDelete(version); setShowDeleteDialog(true); }}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            )}

            {/* Pagination */}
            <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="border-gray-300"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="border-gray-300"
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-gray-900">
              {dialogMode === 'create' ? 'Create New' : 'Edit'} {steps.find(s => s.id === currentStep)?.label}
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              {dialogMode === 'create' ? 'Fill in the details below' : 'Update the information'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {currentStep === 'journals' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-sm font-medium text-gray-900">Title *</Label>
                  <Input
                    id="title"
                    value={journalForm.title}
                    onChange={(e) => setJournalForm(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter journal title"
                    className="border-gray-300"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-sm font-medium text-gray-900">Description *</Label>
                  <Textarea
                    id="description"
                    value={journalForm.description}
                    onChange={(e) => setJournalForm(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Enter journal description"
                    rows={3}
                    className="border-gray-300"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="abstract" className="text-sm font-medium text-gray-900">Abstract</Label>
                  <Textarea
                    id="abstract"
                    value={journalForm.abstract}
                    onChange={(e) => setJournalForm(prev => ({ ...prev, abstract: e.target.value }))}
                    placeholder="Enter abstract"
                    rows={4}
                    className="border-gray-300"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="issn" className="text-sm font-medium text-gray-900">ISSN</Label>
                    <Input
                      id="issn"
                      value={journalForm.issn}
                      onChange={(e) => setJournalForm(prev => ({ ...prev, issn: e.target.value }))}
                      placeholder="0000-0000"
                      className="border-gray-300"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="doi" className="text-sm font-medium text-gray-900">DOI</Label>
                    <Input
                      id="doi"
                      value={journalForm.doi}
                      onChange={(e) => setJournalForm(prev => ({ ...prev, doi: e.target.value }))}
                      placeholder="10.1000/example"
                      className="border-gray-300"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="webSiteUrl" className="text-sm font-medium text-gray-900">Website URL</Label>
                  <Input
                    id="webSiteUrl"
                    value={journalForm.webSiteUrl}
                    onChange={(e) => setJournalForm(prev => ({ ...prev, webSiteUrl: e.target.value }))}
                    placeholder="https://example.com"
                    className="border-gray-300"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="publishedDate" className="text-sm font-medium text-gray-900">Published Date</Label>
                  <Input
                    id="publishedDate"
                    type="datetime-local"
                    value={journalForm.publishedDate ? new Date(journalForm.publishedDate).toISOString().slice(0, 16) : ''}
                    onChange={(e) => setJournalForm(prev => ({ ...prev, publishedDate: e.target.value ? new Date(e.target.value).toISOString() : '' }))}
                    className="border-gray-300"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="image" className="text-sm font-medium text-gray-900">Cover Image</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="image"
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, 'journal')}
                      disabled={uploadingImage}
                      className="border-gray-300"
                    />
                    {uploadingImage && <Loader2 className="h-4 w-4 animate-spin text-blue-600" />}
                  </div>
                  {journalForm.imageUrl && (
                    <div className="relative mt-2 inline-block">
                      <img src={journalForm.imageUrl} alt="Preview" className="h-32 w-32 object-cover rounded-lg border border-gray-300" />
                      <Button
                        size="sm"
                        variant="destructive"
                        className="absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full"
                        onClick={() => setJournalForm(prev => ({ ...prev, imageUrl: '' }))}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pdf" className="text-sm font-medium text-gray-900">Journal PDF</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="pdf"
                      type="file"
                      accept=".pdf"
                      onChange={handlePdfUpload}
                      disabled={uploadingPdf}
                      className="border-gray-300"
                    />
                    {uploadingPdf && <Loader2 className="h-4 w-4 animate-spin text-blue-600" />}
                  </div>
                  {journalForm.journalFileUrl && (
                    <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 p-2 rounded border border-green-200">
                      <FileText className="h-4 w-4" />
                      PDF uploaded successfully
                    </div>
                  )}
                </div>

                <div className="flex items-center space-x-2 pt-2">
                  <Switch
                    id="isActive"
                    checked={journalForm.isActive}
                    onCheckedChange={(checked) => setJournalForm(prev => ({ ...prev, isActive: checked }))}
                  />
                  <Label htmlFor="isActive" className="text-sm font-medium text-gray-900">Active Status</Label>
                </div>
              </>
            )}

            {currentStep === 'authors' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-sm font-medium text-gray-900">Full Name *</Label>
                  <Input
                    id="fullName"
                    value={authorForm.fullName}
                    onChange={(e) => setAuthorForm(prev => ({ ...prev, fullName: e.target.value }))}
                    placeholder="John Doe"
                    className="border-gray-300"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-gray-900">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={authorForm.email}
                    onChange={(e) => setAuthorForm(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="john.doe@example.com"
                    className="border-gray-300"
                  />
                </div>
              </>
            )}

            {currentStep === 'versions' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="journalId" className="text-sm font-medium text-gray-900">Journal *</Label>
                  <Select
                    value={versionForm.journalId}
                    onValueChange={(value) => setVersionForm(prev => ({ ...prev, journalId: value }))}
                  >
                    <SelectTrigger className="border-gray-300">
                      <SelectValue placeholder="Select journal" />
                    </SelectTrigger>
                    <SelectContent>
                      {journals.map(j => (
                        <SelectItem key={j.id} value={j.id.toString()}>
                          {j.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="articleId" className="text-sm font-medium text-gray-900">Article (Accepted Only) *</Label>
                  <Select
                    value={versionForm.articleId}
                    onValueChange={(value) => setVersionForm(prev => ({ ...prev, articleId: value }))}
                  >
                    <SelectTrigger className="border-gray-300">
                      <SelectValue placeholder="Select article" />
                    </SelectTrigger>
                    <SelectContent>
                      {articles.map(a => (
                        <SelectItem key={a.id} value={a.id.toString()}>
                          {a.title} - {a.status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="pageStart" className="text-sm font-medium text-gray-900">Start Page *</Label>
                    <Input
                      id="pageStart"
                      type="number"
                      value={versionForm.pageStart}
                      onChange={(e) => setVersionForm(prev => ({ ...prev, pageStart: e.target.value }))}
                      placeholder="1"
                      className="border-gray-300"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="pageEnd" className="text-sm font-medium text-gray-900">End Page *</Label>
                    <Input
                      id="pageEnd"
                      type="number"
                      value={versionForm.pageEnd}
                      onChange={(e) => setVersionForm(prev => ({ ...prev, pageEnd: e.target.value }))}
                      placeholder="10"
                      className="border-gray-300"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="versionDoi" className="text-sm font-medium text-gray-900">DOI</Label>
                  <Input
                    id="versionDoi"
                    value={versionForm.doi}
                    onChange={(e) => setVersionForm(prev => ({ ...prev, doi: e.target.value }))}
                    placeholder="10.1000/example"
                    className="border-gray-300"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="versionWebSiteUrl" className="text-sm font-medium text-gray-900">Website URL</Label>
                  <Input
                    id="versionWebSiteUrl"
                    value={versionForm.webSiteUrl}
                    onChange={(e) => setVersionForm(prev => ({ ...prev, webSiteUrl: e.target.value }))}
                    placeholder="https://example.com"
                    className="border-gray-300"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="versionPublishedDate" className="text-sm font-medium text-gray-900">Published Date</Label>
                  <Input
                    id="versionPublishedDate"
                    type="datetime-local"
                    value={versionForm.publishedDate ? new Date(versionForm.publishedDate).toISOString().slice(0, 16) : ''}
                    onChange={(e) => setVersionForm(prev => ({ ...prev, publishedDate: e.target.value ? new Date(e.target.value).toISOString() : '' }))}
                    className="border-gray-300"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="versionImage" className="text-sm font-medium text-gray-900">Version Image</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="versionImage"
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, 'version')}
                      disabled={uploadingImage}
                      className="border-gray-300"
                    />
                    {uploadingImage && <Loader2 className="h-4 w-4 animate-spin text-blue-600" />}
                  </div>
                  {versionForm.imageUrl && (
                    <div className="relative mt-2 inline-block">
                      <img src={versionForm.imageUrl} alt="Preview" className="h-32 w-32 object-cover rounded-lg border border-gray-300" />
                      <Button
                        size="sm"
                        variant="destructive"
                        className="absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full"
                        onClick={() => setVersionForm(prev => ({ ...prev, imageUrl: '' }))}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                  <p className="text-sm text-blue-900">
                    <strong>Note:</strong> Creating a journal version will automatically change the article status to "PUBLISHED"
                  </p>
                </div>
              </>
            )}

            {currentStep === 'journal-authors' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="jaJournalId" className="text-sm font-medium text-gray-900">Journal *</Label>
                  <Select
                    value={journalAuthorForm.journalId}
                    onValueChange={(value) => setJournalAuthorForm(prev => ({ ...prev, journalId: value }))}
                  >
                    <SelectTrigger className="border-gray-300">
                      <SelectValue placeholder="Select journal" />
                    </SelectTrigger>
                    <SelectContent>
                      {journals.map(j => (
                        <SelectItem key={j.id} value={j.id.toString()}>
                          {j.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="jaAuthorId" className="text-sm font-medium text-gray-900">Author *</Label>
                  <Select
                    value={journalAuthorForm.authorId}
                    onValueChange={(value) => setJournalAuthorForm(prev => ({ ...prev, authorId: value }))}
                  >
                    <SelectTrigger className="border-gray-300">
                      <SelectValue placeholder="Select author" />
                    </SelectTrigger>
                    <SelectContent>
                      {authors.map(a => (
                        <SelectItem key={a.id} value={a.id.toString()}>
                          {a.fullName} ({a.email})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="authorLevel" className="text-sm font-medium text-gray-900">Author Level *</Label>
                  <Select
                    value={journalAuthorForm.authorLevel}
                    onValueChange={(value) => setJournalAuthorForm(prev => ({ ...prev, authorLevel: value }))}
                  >
                    <SelectTrigger className="border-gray-300">
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Level 1 - Primary Author</SelectItem>
                      <SelectItem value="2">Level 2 - Co-Author</SelectItem>
                      <SelectItem value="3">Level 3 - Contributor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}
          </div>

          <DialogFooter className="border-t border-gray-200 pt-4">
            <Button variant="outline" onClick={() => setShowDialog(false)} className="border-gray-300">
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit} 
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                dialogMode === 'create' ? 'Create' : 'Update'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-semibold text-gray-900">Are you sure?</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600">
              This action cannot be undone. This will permanently delete the selected item from the database.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-gray-300">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminJournal;