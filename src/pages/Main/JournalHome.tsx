import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  BookOpen,
  FileText,
  Users,
  Download,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  ArrowLeft,
  User,
  Mail,
  Hash,
  Globe,
  Clock,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Author {
  id: number;
  fullName: string;
  email: string;
}

interface Article {
  id: number;
  title: string;
  issn: string;
  description: string;
  abstract: string;
  imageUrl: string;
  doi: string | null;
  webSiteUrl: string | null;
  articleFileUrl: string;
  status: string;
  submissionDate: string;
  acceptanceDate: string;
  publicationDate: string;
}

interface JournalVersion {
  id: number;
  journalId: number;
  articleId: number;
  pageStart: number;
  pageEnd: number;
  publishedDate: string;
  article: Article;
}

interface JournalAuthor {
  id: number;
  journalId: number;
  authorId: number;
  authorLevel: string;
}

interface Journal {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  abstract: string;
  publishedDate: string;
  issn: string;
  doi: string;
  webSiteUrl: string;
  journalFileUrl: string;
  quantity: number;
  createdAt: string;
  journalVersions: JournalVersion[];
  journalAuthors: JournalAuthor[];
  user: {
    firstName: string;
    lastName: string;
    email: string;
  };
}

const JournalHome = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [journal, setJournal] = useState<Journal | null>(null);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [articleAuthors, setArticleAuthors] = useState<any[]>([]);
  const [otherJournals, setOtherJournals] = useState<Journal[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedArticle, setExpandedArticle] = useState<number | null>(null);

  useEffect(() => {
    fetchJournalData();
  }, [id]);

  const fetchJournalData = async () => {
    try {
      // Fetch journal with all relations
      const journalResponse = await fetch(
        "https://backendjournal.ilyosbekibroximov.uz/api/journal/include-journal?page=1&limit=100&sortBy=createdAt&sortOrder=desc"
      );
      const journalData = await journalResponse.json();
      const currentJournal = journalData.data.find(
        (j: Journal) => j.id === parseInt(id!)
      );
      setJournal(currentJournal);

      // Fetch all authors
      const authorsResponse = await fetch(
        "https://backendjournal.ilyosbekibroximov.uz/api/author?page=1&limit=100&sortBy=createdAt&sortOrder=asc"
      );
      const authorsData = await authorsResponse.json();
      setAuthors(authorsData.data);

      // Fetch article authors
      const articleAuthorsResponse = await fetch(
        "https://backendjournal.ilyosbekibroximov.uz/api/article-author?page=1&limit=100&sortBy=createdAt&sortOrder=asc"
      );
      const articleAuthorsData = await articleAuthorsResponse.json();
      console.log(articleAuthorsData);
      
      setArticleAuthors(articleAuthorsData.data);

      // Get other journals
      const otherJournalsList = journalData.data.filter(
        (j: Journal) => j.id !== parseInt(id!)
      );
      setOtherJournals(otherJournalsList.slice(0, 3));

      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  const getAuthorById = (authorId: number) => {
    return authors.find((a) => a.id === authorId);
  };

  const getArticleAuthors = (articleId: number) => {
    return articleAuthors.filter((aa) => aa.articleId === articleId);
  };

  const getJournalAuthors = () => {
    if (!journal) return [];
    return journal.journalAuthors.map((ja) => ({
      ...ja,
      author: getAuthorById(ja.authorId),
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-[#133654] border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (!journal) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Journal Not Found
            </h2>
            <p className="text-gray-600 mb-4">
              The requested journal could not be found.
            </p>
            <Button onClick={() => navigate("/")}>Return Home</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Hero Header */}
      <div className="relative bg-gradient-to-r from-[#133654] via-[#1b4b78] to-[#0d2438] text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
              backgroundSize: "40px 40px",
            }}
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 py-12 relative z-10">
          <motion.button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-white/80 hover:text-white transition-colors mb-6"
            whileHover={{ x: -5 }}
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Home
          </motion.button>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <Badge className="bg-white/20 text-white border-0 px-4 py-1">
                Volume {journal.quantity}
              </Badge>
              {journal.issn && (
                <Badge className="bg-white/20 text-white border-0 px-4 py-1">
                  ISSN: {journal.issn}
                </Badge>
              )}
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {journal.title}
            </h1>

            <div className="flex flex-wrap gap-6 text-white/90 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                <span>
                  {new Date(journal.publishedDate).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                <span>{journal.journalVersions?.length || 0} Articles</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                <span>{journal.journalAuthors?.length || 0} Authors</span>
              </div>
              <div className="flex items-center gap-2">
                <User className="w-5 h-5" />
                <span>
                  By {journal.user.firstName} {journal.user.lastName}
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Journal Image */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="overflow-hidden shadow-xl">
                <img
                  src={journal.imageUrl}
                  alt={journal.title}
                  className="w-full h-96 object-cover"
                />
              </Card>
            </motion.div>

            {/* Tabs for Content Organization */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-3 h-auto">
                  <TabsTrigger value="overview" className="py-3">
                    Overview
                  </TabsTrigger>
                  <TabsTrigger value="articles" className="py-3">
                    Articles ({journal.journalVersions?.length || 0})
                  </TabsTrigger>
                  <TabsTrigger value="authors" className="py-3">
                    Authors ({journal.journalAuthors?.length || 0})
                  </TabsTrigger>
                </TabsList>

                {/* Overview Tab */}
                <TabsContent value="overview" className="space-y-6 mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Description</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700 leading-relaxed">
                        {journal.description}
                      </p>
                    </CardContent>
                  </Card>

                  {journal.abstract && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Abstract</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-700 leading-relaxed">
                          {journal.abstract}
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>

                {/* Articles Tab */}
                <TabsContent value="articles" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Published Articles</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {journal.journalVersions &&
                      journal.journalVersions.length > 0 ? (
                        <Accordion type="single" collapsible className="w-full">
                          {journal.journalVersions.map((version, index) => (
                            <AccordionItem
                              key={version.id}
                              value={`article-${version.id}`}
                            >
                              <AccordionTrigger className="hover:no-underline">
                                <div className="flex-1 text-left pr-4">
                                  <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                        {version.article?.title ||
                                          `Article ${index + 1}`}
                                      </h3>
                                      <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                                        <span className="flex items-center gap-1">
                                          <Hash className="w-4 h-4" />
                                          Pages {version.pageStart}-
                                          {version.pageEnd}
                                        </span>
                                        {version.article?.issn && (
                                          <span>
                                            ISSN: {version.article.issn}
                                          </span>
                                        )}
                                        <span className="flex items-center gap-1">
                                          <Clock className="w-4 h-4" />
                                          {new Date(
                                            version.publishedDate
                                          ).toLocaleDateString()}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </AccordionTrigger>

                              <AccordionContent>
                                <div className="pt-4 space-y-4">
                                  {version.article?.imageUrl && (
                                    <img
                                      src={version.article.imageUrl}
                                      alt={version.article.title}
                                      className="w-full h-64 object-cover rounded-lg"
                                    />
                                  )}

                                  {version.article?.abstract && (
                                    <div>
                                      <h4 className="font-semibold text-gray-900 mb-2">
                                        Abstract:
                                      </h4>
                                      <p className="text-gray-700 text-sm leading-relaxed">
                                        {version.article.abstract}
                                      </p>
                                    </div>
                                  )}

                                  {version.article?.description && (
                                    <div>
                                      <h4 className="font-semibold text-gray-900 mb-2">
                                        Description:
                                      </h4>
                                      <p className="text-gray-700 text-sm leading-relaxed">
                                        {version.article.description}
                                      </p>
                                    </div>
                                  )}

                                  {/* Article Authors */}
                                  <div>
                                    <h4 className="font-semibold text-gray-900 mb-3">
                                      Authors:
                                    </h4>
                                    <div className="grid gap-2">
                                      {getArticleAuthors(
                                        version.article?.id
                                      ).map((aa) => {
                                        const author = getAuthorById(
                                          aa.authorId
                                        );
                                        return (
                                          <div
                                            key={aa.id}
                                            className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                                          >
                                            <div className="w-10 h-10 bg-[#133654] text-white rounded-full flex items-center justify-center font-semibold">
                                              {author?.fullName.charAt(0)}
                                            </div>
                                            <div className="flex-1">
                                              <p className="font-medium text-gray-900">
                                                {author?.fullName}
                                              </p>
                                              <p className="text-sm text-gray-600">
                                                {author?.email}
                                              </p>
                                            </div>
                                            <Badge variant="secondary">
                                              Level {aa.authorLevel}
                                            </Badge>
                                          </div>
                                        );
                                      })}
                                    </div>
                                  </div>

                                  {/* Article Dates */}
                                  <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg text-sm">
                                    <div>
                                      <p className="text-gray-600 mb-1">
                                        Submitted
                                      </p>
                                      <p className="font-semibold">
                                        {new Date(
                                          version.article.submissionDate
                                        ).toLocaleDateString()}
                                      </p>
                                    </div>
                                    <div>
                                      <p className="text-gray-600 mb-1">
                                        Accepted
                                      </p>
                                      <p className="font-semibold">
                                        {new Date(
                                          version.article.acceptanceDate
                                        ).toLocaleDateString()}
                                      </p>
                                    </div>
                                    <div>
                                      <p className="text-gray-600 mb-1">
                                        Published
                                      </p>
                                      <p className="font-semibold">
                                        {new Date(
                                          version.article.publicationDate
                                        ).toLocaleDateString()}
                                      </p>
                                    </div>
                                  </div>

                                  {version.article?.articleFileUrl && (
                                    <Button
                                      asChild
                                      className="w-full bg-[#133654] hover:bg-[#1b4b78]"
                                    >
                                      <a
                                        href={version.article.articleFileUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                      >
                                        <Download className="w-4 h-4 mr-2" />
                                        Download Article PDF
                                      </a>
                                    </Button>
                                  )}
                                </div>
                              </AccordionContent>
                            </AccordionItem>
                          ))}
                        </Accordion>
                      ) : (
                        <p className="text-gray-500 text-center py-8">
                          No articles available
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Authors Tab */}
                <TabsContent value="authors" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Journal Authors</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {journal.journalAuthors &&
                      journal.journalAuthors.length > 0 ? (
                        <div className="grid gap-4">
                          {getJournalAuthors().map((ja) => (
                            <motion.div
                              key={ja.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                            >
                              <div className="w-16 h-16 bg-gradient-to-br from-[#133654] to-[#1b4b78] text-white rounded-full flex items-center justify-center text-2xl font-bold">
                                {ja.author?.fullName.charAt(0)}
                              </div>
                              <div className="flex-1">
                                <h3 className="text-lg font-semibold text-gray-900">
                                  {ja.author?.fullName}
                                </h3>
                                <p className="text-sm text-gray-600 flex items-center gap-1">
                                  <Mail className="w-4 h-4" />
                                  {ja.author?.email}
                                </p>
                              </div>
                              <Badge className="bg-[#133654]">
                                Level {ja.authorLevel}
                              </Badge>
                            </motion.div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500 text-center py-8">
                          No authors listed
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Download Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="sticky top-6 shadow-xl">
                <CardHeader>
                  <CardTitle>Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {journal.journalFileUrl && (
                    <Button
                      asChild
                      className="w-full bg-[#133654] hover:bg-[#1b4b78]"
                      size="lg"
                    >
                      <a
                        href={journal.journalFileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Download className="w-5 h-5 mr-2" />
                        Download Full Journal
                      </a>
                    </Button>
                  )}

                  {journal.webSiteUrl && (
                    <Button
                      asChild
                      variant="outline"
                      className="w-full"
                      size="lg"
                    >
                      <a
                        href={journal.webSiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Globe className="w-5 h-5 mr-2" />
                        Visit Website
                      </a>
                    </Button>
                  )}
                </CardContent>

                <Separator />

                <CardContent className="pt-6">
                  <h4 className="font-semibold text-gray-900 mb-4">
                    Journal Information
                  </h4>
                  <div className="space-y-3 text-sm">
                    {journal.doi && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">DOI:</span>
                        <span className="text-gray-900 font-medium">
                          <a href={journal.doi} target="_blank" rel="noopener noreferrer">{journal.doi}</a>
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-600">Created:</span>
                      <span className="text-gray-900 font-medium">
                        {new Date(journal.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Volume:</span>
                      <span className="text-gray-900 font-medium">
                        {journal.quantity}
                      </span>
                    </div>
                  </div>
                </CardContent>

                <Separator />

                <CardContent className="pt-6">
                  <h4 className="font-semibold text-gray-900 mb-4">
                    Published By
                  </h4>
                  <div className="space-y-2">
                    <p className="font-medium text-gray-900">
                      {journal.user.firstName} {journal.user.lastName}
                    </p>
                    <p className="text-sm text-gray-600 flex items-center gap-1">
                      <Mail className="w-4 h-4" />
                      {journal.user.email}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Other Journals */}
            {otherJournals.length > 0 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Other Journals</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {otherJournals.map((otherJournal) => (
                      <motion.div
                        key={otherJournal.id}
                        whileHover={{ scale: 1.02 }}
                        onClick={() => navigate(`/journal/${otherJournal.id}`)}
                        className="cursor-pointer group"
                      >
                        <div className="relative overflow-hidden rounded-lg">
                          <img
                            src={otherJournal.imageUrl}
                            alt={otherJournal.title}
                            className="w-full h-32 object-cover transition-transform group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                          <div className="absolute bottom-2 left-2 right-2">
                            <h4 className="text-white font-semibold text-sm line-clamp-1">
                              {otherJournal.title}
                            </h4>
                            <p className="text-white/80 text-xs">
                              {new Date(
                                otherJournal.publishedDate
                              ).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JournalHome;