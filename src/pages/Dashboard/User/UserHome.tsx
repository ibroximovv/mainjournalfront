import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import {
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Sparkles,
  Calendar,
  MessageSquare,
  Send,
  Eye,
  User
} from 'lucide-react';

interface Article {
  id: number;
  title: string;
  issn?: string;
  description: string;
  abstract: string;
  imageUrl?: string;
  doi?: string | null;
  webSiteUrl?: string | null;
  articleFileUrl?: string;
  isActive: boolean;
  submissionDate: string;
  acceptanceDate?: string;
  publicationDate?: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'PUBLISHED' | 'ERROR';
  categoryId: number;
  createdAt: string;
  updatedAt: string;
  userId: number;
  rejectionReason?: string;
  errorMessage?: string;
}

interface Stats {
  total: number;
  pending: number;
  accepted: number;
  rejected: number;
  published: number;
  error: number;
}

interface ChatMessage {
  type: 'user' | 'admin' | 'system';
  message: string;
  timestamp: Date;
}

interface StatusConfig {
  color: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  borderColor: string;
  bgColor: string;
  darkColor: string;
}

const UserHome: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [stats, setStats] = useState<Stats>({
    total: 0,
    pending: 0,
    accepted: 0,
    rejected: 0,
    published: 0,
    error: 0
  });
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [chatMessage, setChatMessage] = useState<string>('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>('all');

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async (): Promise<void> => {
    try {
      setLoading(true);

      const userRes = await fetch(
        'https://backendjournal.ilyosbekibroximov.uz/api/user/me',
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const userData = await userRes.json();
      // console.log("USER DATA:", userData,);

      const articleRes = await fetch(
        'https://backendjournal.ilyosbekibroximov.uz/api/article?page=1&limit=100&sortBy=createdAt&sortOrder=desc',
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const articleData = await articleRes.json();
      // console.log("ARTICLE DATA:", articleData);

      if (articleData.statusCode === 200) {
        const filtered = articleData.data.filter(
          (article: Article) => article.userId === userData.id
        );

        setArticles(filtered);
        calculateStats(filtered);
      }

    } catch (error) {
      console.error('Error fetching articles:', error);
      setDemoData();
    } finally {
      setLoading(false);
    }
  };


  const setDemoData = (): void => {
    const demoArticles: Article[] = [
      {
        id: 1,
        title: "Machine Learning in Healthcare Systems",
        status: "PENDING",
        submissionDate: "2025-11-15T10:00:00.000Z",
        categoryId: 1,
        description: "An exploration of ML applications in modern healthcare",
        abstract: "This paper explores various machine learning techniques and their practical applications in healthcare diagnostics and treatment planning.",
        isActive: true,
        createdAt: "2025-11-15T10:00:00.000Z",
        updatedAt: "2025-11-15T10:00:00.000Z",
        userId: 1
      },
      {
        id: 2,
        title: "Quantum Computing Advances",
        status: "ACCEPTED",
        submissionDate: "2025-11-10T10:00:00.000Z",
        acceptanceDate: "2025-11-16T10:00:00.000Z",
        categoryId: 2,
        description: "Recent developments in quantum computing",
        abstract: "An analysis of the latest quantum computing breakthroughs and their implications for computational science.",
        isActive: true,
        createdAt: "2025-11-10T10:00:00.000Z",
        updatedAt: "2025-11-16T10:00:00.000Z",
        userId: 1
      },
      {
        id: 3,
        title: "Neural Network Architectures",
        status: "REJECTED",
        submissionDate: "2025-11-08T10:00:00.000Z",
        categoryId: 1,
        description: "Comparative study of neural networks",
        abstract: "This research compares different neural network models and their performance across various tasks.",
        rejectionReason: "The methodology section needs more detail. Please provide more information about the dataset used and the evaluation metrics.",
        isActive: true,
        createdAt: "2025-11-08T10:00:00.000Z",
        updatedAt: "2025-11-14T10:00:00.000Z",
        userId: 1
      },
      {
        id: 4,
        title: "Blockchain Technology in Finance",
        status: "PUBLISHED",
        submissionDate: "2025-10-20T10:00:00.000Z",
        publicationDate: "2025-11-15T10:00:00.000Z",
        categoryId: 3,
        description: "Blockchain applications in financial systems",
        abstract: "Investigating blockchain's role in modern finance and its potential to transform financial services.",
        isActive: true,
        createdAt: "2025-10-20T10:00:00.000Z",
        updatedAt: "2025-11-15T10:00:00.000Z",
        userId: 1
      },
      {
        id: 5,
        title: "AI Ethics and Governance",
        status: "ERROR",
        submissionDate: "2025-11-12T10:00:00.000Z",
        categoryId: 4,
        description: "Ethical considerations in AI development",
        abstract: "Exploring ethical frameworks for AI systems and governance models for responsible AI deployment.",
        errorMessage: "File upload error. Please re-upload the PDF document.",
        isActive: true,
        createdAt: "2025-11-12T10:00:00.000Z",
        updatedAt: "2025-11-12T10:00:00.000Z",
        userId: 1
      }
    ];
    setArticles(demoArticles);
    calculateStats(demoArticles);
  };

  const calculateStats = (articleData: Article[]): void => {
    const newStats: Stats = {
      total: articleData.length,
      pending: articleData.filter(a => a.status === 'PENDING').length,
      accepted: articleData.filter(a => a.status === 'ACCEPTED').length,
      rejected: articleData.filter(a => a.status === 'REJECTED').length,
      published: articleData.filter(a => a.status === 'PUBLISHED').length,
      error: articleData.filter(a => a.status === 'ERROR').length
    };
    setStats(newStats);
  };

  const getStatusConfig = (status: string): StatusConfig => {
    const configs: Record<string, StatusConfig> = {
      PENDING: {
        color: 'text-amber-600',
        icon: Clock,
        label: 'Ko\'rib chiqilmoqda',
        borderColor: 'border-amber-200',
        bgColor: 'bg-amber-50',
        darkColor: 'bg-amber-600'
      },
      ACCEPTED: {
        color: 'text-emerald-600',
        icon: CheckCircle2,
        label: 'Qabul qilindi',
        borderColor: 'border-emerald-200',
        bgColor: 'bg-emerald-50',
        darkColor: 'bg-emerald-600'
      },
      REJECTED: {
        color: 'text-rose-600',
        icon: XCircle,
        label: 'Rad etildi',
        borderColor: 'border-rose-200',
        bgColor: 'bg-rose-50',
        darkColor: 'bg-rose-600'
      },
      PUBLISHED: {
        color: 'text-blue-600',
        icon: Sparkles,
        label: 'Nashr etildi',
        borderColor: 'border-blue-200',
        bgColor: 'bg-blue-50',
        darkColor: 'bg-blue-600'
      },
      ERROR: {
        color: 'text-purple-600',
        icon: AlertCircle,
        label: 'Xatolik',
        borderColor: 'border-purple-200',
        bgColor: 'bg-purple-50',
        darkColor: 'bg-purple-600'
      }
    };
    return configs[status] || configs.PENDING;
  };

  const handleArticleClick = (article: Article): void => {
    setSelectedArticle(article);
    if (article.status === 'REJECTED' || article.status === 'ERROR') {
      setChatHistory([
        {
          type: 'system',
          message: article.rejectionReason || article.errorMessage || 'Iltimos, quyidagi muammolarni hal qiling.',
          timestamp: new Date()
        }
      ]);
    } else {
      setChatHistory([]);
    }
  };

  const handleSendMessage = (): void => {
    if (chatMessage.trim() && selectedArticle) {
      setChatHistory([...chatHistory, {
        type: 'user',
        message: chatMessage,
        timestamp: new Date()
      }]);
      setChatMessage('');

      setTimeout(() => {
        setChatHistory(prev => [...prev, {
          type: 'admin',
          message: 'Rahmat, xabaringiz qabul qilindi. Tez orada ko\'rib chiqamiz.',
          timestamp: new Date()
        }]);
      }, 1000);
    }
  };

  const filterArticles = (status: string): Article[] => {
    if (status === 'all') return articles;
    return articles.filter(a => a.status === status);
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('uz-UZ', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-4xl md:text-5xl font-bold text-[#0f172a]">
            Maqolalar Boshqaruvi
          </h1>
          <p className="text-gray-600 text-lg">Barcha maqolalaringizni bir joyda boshqaring va kuzatib boring</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {[
            { label: 'Jami', value: stats.total, icon: FileText, color: 'from-gray-600 to-gray-700', count: stats.total },
            { label: 'Kutilmoqda', value: stats.pending, icon: Clock, color: 'from-amber-500 to-amber-600', count: stats.pending },
            { label: 'Qabul qilindi', value: stats.accepted, icon: CheckCircle2, color: 'from-emerald-500 to-emerald-600', count: stats.accepted },
            { label: 'Rad etildi', value: stats.rejected, icon: XCircle, color: 'from-rose-500 to-rose-600', count: stats.rejected },
            { label: 'Nashr etildi', value: stats.published, icon: Sparkles, color: 'from-blue-500 to-blue-600', count: stats.published }
          ].map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <Card
                key={index}
                className="bg-white border-gray-200 hover:shadow-lg transition-all duration-300"
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-lg bg-gradient-to-br ${stat.color}`}>
                      <IconComponent className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm font-medium mb-1">{stat.label}</p>
                    <p className="text-3xl font-bold text-[#0f172a]">
                      {stat.count}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Articles Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-white border border-gray-200 p-1.5 h-auto flex-wrap justify-start gap-2">
            <TabsTrigger
              value="all"
              className="data-[state=active]:bg-[#0f172a] data-[state=active]:text-white text-gray-600"
            >
              Hammasi
            </TabsTrigger>
            <TabsTrigger
              value="PENDING"
              className="data-[state=active]:bg-amber-500 data-[state=active]:text-white text-gray-600"
            >
              Kutilmoqda
            </TabsTrigger>
            <TabsTrigger
              value="ACCEPTED"
              className="data-[state=active]:bg-emerald-500 data-[state=active]:text-white text-gray-600"
            >
              Qabul qilindi
            </TabsTrigger>
            <TabsTrigger
              value="REJECTED"
              className="data-[state=active]:bg-rose-500 data-[state=active]:text-white text-gray-600"
            >
              Rad etildi
            </TabsTrigger>
            <TabsTrigger
              value="PUBLISHED"
              className="data-[state=active]:bg-blue-500 data-[state=active]:text-white text-gray-600"
            >
              Nashr etildi
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-4">
            {filterArticles(activeTab).length === 0 ? (
              <Card className="bg-white border-gray-200">
                <CardContent className="p-12 text-center">
                  <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600 text-lg font-medium">Hech qanday maqola topilmadi</p>
                  <p className="text-gray-500 text-sm mt-2">Yangi maqola qo'shish uchun yuqoridagi tugmani bosing</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filterArticles(activeTab).map((article) => {
                  const statusConfig = getStatusConfig(article.status);
                  const StatusIcon = statusConfig.icon;

                  return (
                    <Card
                      key={article.id}
                      className="bg-white border-gray-200 hover:shadow-lg hover:border-gray-300 transition-all duration-300 cursor-pointer group"
                      onClick={() => handleArticleClick(article)}
                    >
                      <CardHeader className="space-y-3">
                        <div className="flex items-start justify-between gap-2">
                          <Badge className={`${statusConfig.bgColor} ${statusConfig.color} ${statusConfig.borderColor} border px-3 py-1.5 flex items-center gap-2 font-medium`}>
                            <StatusIcon className="w-3.5 h-3.5" />
                            {statusConfig.label}
                          </Badge>
                          {(article.status === 'REJECTED' || article.status === 'ERROR') && (
                            <MessageSquare className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
                          )}
                        </div>
                        <CardTitle className="text-lg text-[#0f172a] group-hover:text-blue-600 transition-colors line-clamp-2 leading-tight">
                          {article.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed">
                          {article.description || article.abstract}
                        </p>
                        <div className="space-y-2 pt-2 border-t border-gray-100">
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <Calendar className="w-3.5 h-3.5" />
                            <span>Yuborildi: {formatDate(article.submissionDate)}</span>
                          </div>
                          {article.acceptanceDate && (
                            <div className="flex items-center gap-2 text-xs text-emerald-600">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Qabul qilindi: {formatDate(article.acceptanceDate)}</span>
                            </div>
                          )}
                          {article.publicationDate && (
                            <div className="flex items-center gap-2 text-xs text-blue-600">
                              <Sparkles className="w-3.5 h-3.5" />
                              <span>Nashr etildi: {formatDate(article.publicationDate)}</span>
                            </div>
                          )}
                        </div>
                        <Button
                          variant="outline"
                          className="w-full text-gray-600 hover:text-[#0f172a] hover:bg-gray-50 border-gray-200"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          Batafsil ko'rish
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Article Detail Dialog */}
      <Dialog open={!!selectedArticle} onOpenChange={() => setSelectedArticle(null)}>
        <DialogContent className="max-w-4xl h-[85vh] bg-white border-gray-200 text-[#0f172a] p-0 flex flex-col">
          <DialogHeader className="px-6 pt-6 pb-4 border-b border-gray-200 shrink-0">
            <DialogTitle className="text-2xl text-[#0f172a] pr-8">{selectedArticle?.title}</DialogTitle>
            <div className="flex items-center gap-2 mt-3">
              {selectedArticle && (() => {
                const config = getStatusConfig(selectedArticle.status);
                const StatusIcon = config.icon;
                return (
                  <Badge className={`${config.bgColor} ${config.color} ${config.borderColor} border px-3 py-1.5 flex items-center gap-2`}>
                    <StatusIcon className="w-3.5 h-3.5" />
                    {config.label}
                  </Badge>
                );
              })()}
            </div>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto px-6 py-4">
            <div className="space-y-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-sm text-gray-600 mb-2 uppercase tracking-wide">Tavsif</h4>
                  <p className="text-gray-700 leading-relaxed">{selectedArticle?.description}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-gray-600 mb-2 uppercase tracking-wide">Abstrakt</h4>
                  <p className="text-gray-700 leading-relaxed">{selectedArticle?.abstract}</p>
                </div>

                {selectedArticle?.issn && (
                  <div>
                    <h4 className="font-semibold text-sm text-gray-600 mb-2 uppercase tracking-wide">ISSN</h4>
                    <p className="text-gray-700">{selectedArticle.issn}</p>
                  </div>
                )}
              </div>

              {/* Chat Section */}
              {(selectedArticle?.status === 'REJECTED' || selectedArticle?.status === 'ERROR') && (
                <div className="flex flex-col border border-gray-200 rounded-lg bg-gray-50 overflow-hidden">
                  <div className="bg-white border-b border-gray-200 px-4 py-3">
                    <h4 className="font-semibold flex items-center gap-2 text-[#0f172a]">
                      <MessageSquare className="w-5 h-5" />
                      Muhokama
                    </h4>
                  </div>

                  <ScrollArea className="h-[300px] p-4">
                    <div className="space-y-3">
                      {chatHistory.map((msg, idx) => (
                        <div
                          key={idx}
                          className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div className={`flex gap-2 max-w-[80%] ${msg.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.type === 'user'
                              ? 'bg-blue-600'
                              : msg.type === 'system'
                                ? 'bg-rose-600'
                                : 'bg-emerald-600'
                              }`}>
                              <User className="w-4 h-4 text-white" />
                            </div>
                            <div
                              className={`rounded-lg p-3 ${msg.type === 'user'
                                ? 'bg-blue-600 text-white'
                                : msg.type === 'system'
                                  ? 'bg-rose-50 text-rose-800 border border-rose-200'
                                  : 'bg-white text-gray-800 border border-gray-200'
                                }`}
                            >
                              <p className="text-sm leading-relaxed">{msg.message}</p>
                              <p className={`text-xs mt-2 ${msg.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                                }`}>
                                {msg.timestamp.toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' })}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>

                  <div className="p-3 bg-white border-t border-gray-200 flex gap-2">
                    <Input
                      placeholder="Xabar yozing..."
                      value={chatMessage}
                      onChange={(e) => setChatMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      className="flex-1 bg-white border-gray-300 text-gray-900 placeholder:text-gray-400"
                    />
                    <Button
                      onClick={handleSendMessage}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserHome;