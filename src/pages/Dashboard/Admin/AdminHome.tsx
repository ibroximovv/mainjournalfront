import { useEffect, useState } from "react"
import { MessageSquare, CheckCircle, XCircle, AlertCircle, Clock, Send, Loader2, Save, X } from "lucide-react"
import io, { Socket } from "socket.io-client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Article {
  id: number
  title: string
  issn: string
  description: string
  abstract: string
  imageUrl: string
  doi: string | null
  webSiteUrl: string | null
  articleFileUrl: string
  isActive: boolean
  submissionDate: string
  acceptanceDate: string
  publicationDate: string
  status: "PENDING" | "ACCEPTED" | "PUBLISHED" | "ERROR" | "REJECTED"
  categoryId: number
  userId: number
  createdAt: string
  updatedAt: string
}

interface ArticleResponse {
  statusCode: number
  message: string
  total: number
  page: number
  limit: number
  data: Article[]
}

interface Author {
  id: number
  fullName: string
  email: string
  createdAt: string
  updatedAt: string
}

interface Category {
  id: number
  name: string
  createdAt: string
  updatedAt: string
}

interface ChatMessage {
  id: number
  fromId: number
  toId: number
  message: string
  articleUserChatId: number
  createdAt: string
  isRead: boolean
}

interface ArticleUserChat {
  id: number
  fromId: number
  toId: number
  createdAt: string
  updatedAt: string
}

interface ArticleFormData {
  title: string
  issn: string
  description: string
  abstract: string
  doi: string
  webSiteUrl: string
  categoryId: number
}

const AdminHome = () => {
  const [articles, setArticles] = useState<Article[]>([])
  const [authors, setAuthors] = useState<Author[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [activeStatus, setActiveStatus] = useState<Article["status"]>("PENDING")
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null)
  const [showChat, setShowChat] = useState(false)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [currentChatId, setCurrentChatId] = useState<number | null>(null)
  const [messageInput, setMessageInput] = useState("")
  const [socket, setSocket] = useState<Socket | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<ArticleFormData>({
    title: "",
    issn: "",
    description: "",
    abstract: "",
    doi: "",
    webSiteUrl: "",
    categoryId: 0,
  })

  const statuses: Array<{
    name: Article["status"]
    icon: typeof Clock
    variant: "default" | "secondary" | "destructive" | "outline"
  }> = [
    { name: "PENDING", icon: Clock, variant: "default" },
    { name: "ACCEPTED", icon: CheckCircle, variant: "default" },
    { name: "PUBLISHED", icon: CheckCircle, variant: "default" },
    { name: "ERROR", icon: AlertCircle, variant: "destructive" },
    { name: "REJECTED", icon: XCircle, variant: "destructive" },
  ]

  const adminUserId = 1

  useEffect(() => {
    const newSocket = io("https://backendjournal.ilyosbekibroximov.uz", {
      transports: ["websocket"],
    })

    newSocket.on("connect", () => {
      console.log("Socket connected")
      newSocket.emit("join_user", { userId: adminUserId })
    })

    newSocket.on("load_previous_messages", (messages: ChatMessage[]) => {
      console.log("Loaded previous messages:", messages)
      setChatMessages(messages)
    })

    newSocket.on("new_message", (message: ChatMessage) => {
      console.log("New message received:", message)
      // Only add message if it's for the current chat
      setChatMessages((prev) => {
        // Avoid duplicates
        if (prev.some(m => m.id === message.id)) return prev
        return [...prev, message]
      })
    })

    newSocket.on("message_sent", (message: ChatMessage) => {
      console.log("Message sent confirmed:", message)
      setChatMessages((prev) => {
        // Avoid duplicates
        if (prev.some(m => m.id === message.id)) return prev
        return [...prev, message]
      })
    })

    setSocket(newSocket)

    return () => {
      newSocket.close()
    }
  }, [])

  const fetchArticles = async (page: number = 1) => {
    setLoading(true)
    try {
      const response = await fetch(
        `https://backendjournal.ilyosbekibroximov.uz/api/article?page=${page}&limit=10&sortBy=createdAt&sortOrder=desc`
      )
      const data: ArticleResponse = await response.json()
      setArticles(data.data || [])
      setTotalPages(Math.ceil(data.total / 10))
      setCurrentPage(page)
    } catch (error) {
      console.error("Error fetching articles:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchAuthors = async () => {
    try {
      const response = await fetch(
        "https://backendjournal.ilyosbekibroximov.uz/api/author?page=1&limit=100&sortBy=createdAt&sortOrder=asc"
      )
      const data = await response.json()
      setAuthors(data.data || [])
    } catch (error) {
      console.error("Error fetching authors:", error)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await fetch(
        "https://backendjournal.ilyosbekibroximov.uz/api/category?page=1&limit=100&sortBy=createdAt&sortOrder=asc"
      )
      const data = await response.json()
      setCategories(data.data || [])
    } catch (error) {
      console.error("Error fetching categories:", error)
    }
  }

  useEffect(() => {
    fetchArticles(currentPage)
    fetchAuthors()
    fetchCategories()
  }, [currentPage])

  const filteredArticles = articles.filter((article) => article.status === activeStatus)

  const handleStatusChange = async (articleId: number, newStatus: Article["status"]) => {
    try {
      const token = localStorage.getItem("token")
      await fetch(`https://backendjournal.ilyosbekibroximov.uz/api/article/${articleId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      })
      await fetchArticles(currentPage)
      setSelectedArticle(null)
    } catch (error) {
      console.error("Error updating status:", error)
    }
  }

  const handleUpdateArticle = async () => {
    if (!selectedArticle) return
    
    try {
      const token = localStorage.getItem("token")
      await fetch(`https://backendjournal.ilyosbekibroximov.uz/api/article/${selectedArticle.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      })
      await fetchArticles(currentPage)
      setSelectedArticle(null)
    } catch (error) {
      console.error("Error updating article:", error)
    }
  }

  const openChat = async (article: Article) => {
    setShowChat(true)
    setSelectedArticle(article)
    setChatMessages([]) // Clear previous messages
    setCurrentChatId(null) // Reset chat ID
    
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(
        "https://backendjournal.ilyosbekibroximov.uz/api/article-user-chat",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ toId: article.userId }),
        }
      )
      
      if (response.ok) {
        const chatData: { statusCode: number; data: ArticleUserChat } = await response.json()
        console.log("Chat data:", chatData)
        
        if (chatData.statusCode === 200 && chatData.data) {
          setCurrentChatId(chatData.data.id)
          
          // Request messages for this specific chat
          if (socket) {
            socket.emit("load_messages", { 
              fromId: adminUserId, 
              toId: article.userId 
            })
          }
        }
      } else {
        console.error("Error creating chat:", response.status)
      }
    } catch (error) {
      console.error("Error opening chat:", error)
    }
  }

  const sendMessage = () => {
    if (messageInput.trim() && socket && selectedArticle) {
      socket.emit("send_message", {
        fromId: adminUserId,
        toId: selectedArticle.userId,
        message: messageInput,
      })
      setMessageInput("")
    }
  }

  const getCategoryName = (categoryId: number) => {
    const category = categories.find(c => c.id === categoryId)
    return category ? category.name : "Unknown"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="animate-in fade-in slide-in-from-top duration-500">
          <h1 className="text-4xl font-bold text-slate-800 mb-2">Article Management</h1>
          <p className="text-slate-600">Review and manage submitted articles</p>
        </div>

        {/* Status Filter */}
        <div className="flex flex-wrap gap-2">
          {statuses.map((status) => {
            const Icon = status.icon
            const count = articles.filter((a) => a.status === status.name).length
            return (
              <Button
                key={status.name}
                variant={activeStatus === status.name ? status.variant : "outline"}
                onClick={() => setActiveStatus(status.name)}
                className="gap-2"
              >
                <Icon className="w-4 h-4" />
                {status.name}
                <Badge variant="secondary" className="ml-2">{count}</Badge>
              </Button>
            )
          })}
        </div>

        {/* Articles Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.map((article, index) => (
              <Card
                key={article.id}
                className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-in fade-in slide-in-from-bottom"
                style={{ animationDelay: `${index * 50}ms` }}
                onClick={() => {
                  setSelectedArticle(article)
                  setFormData({
                    title: article.title,
                    issn: article.issn,
                    description: article.description,
                    abstract: article.abstract,
                    doi: article.doi || "",
                    webSiteUrl: article.webSiteUrl || "",
                    categoryId: article.categoryId,
                  })
                }}
              >
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <CardTitle className="text-lg line-clamp-2 mb-2">{article.title}</CardTitle>
                      <Badge variant="outline">{getCategoryName(article.categoryId)}</Badge>
                    </div>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation()
                        openChat(article)
                      }}
                      className="shrink-0"
                    >
                      <MessageSquare className="w-4 h-4" />
                    </Button>
                  </div>
                  <CardDescription className="line-clamp-3">{article.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>ISSN: {article.issn}</span>
                    <span>{new Date(article.createdAt).toLocaleDateString()}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2">
            <Button
              variant="outline"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <div className="px-4 py-2 bg-white rounded-lg shadow-sm">
              {currentPage} / {totalPages}
            </div>
            <Button
              variant="outline"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        )}

        {/* Article Detail Dialog */}
        <Dialog open={!!selectedArticle && !showChat} onOpenChange={(open) => {
          if (!open) setSelectedArticle(null)
        }}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Review & Edit Article</DialogTitle>
            </DialogHeader>

            {selectedArticle && (
              <div className="space-y-6">
                {/* Image Preview */}
                {selectedArticle.imageUrl && (
                  <div className="w-full h-48 rounded-lg overflow-hidden bg-slate-100">
                    <img 
                      src={selectedArticle.imageUrl} 
                      alt={selectedArticle.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {/* Form Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="issn">ISSN</Label>
                    <Input
                      id="issn"
                      value={formData.issn}
                      onChange={(e) => setFormData({ ...formData, issn: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="doi">DOI</Label>
                    <Input
                      id="doi"
                      value={formData.doi}
                      onChange={(e) => setFormData({ ...formData, doi: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="webSiteUrl">Website URL</Label>
                    <Input
                      id="webSiteUrl"
                      value={formData.webSiteUrl}
                      onChange={(e) => setFormData({ ...formData, webSiteUrl: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={formData.categoryId.toString()}
                      onValueChange={(value) => setFormData({ ...formData, categoryId: parseInt(value) })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id.toString()}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Status</Label>
                    <Badge variant="outline" className="text-sm">
                      {selectedArticle.status}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="abstract">Abstract</Label>
                  <Textarea
                    id="abstract"
                    value={formData.abstract}
                    onChange={(e) => setFormData({ ...formData, abstract: e.target.value })}
                    rows={6}
                  />
                </div>

                {/* Article File Link */}
                {selectedArticle.articleFileUrl && (
                  <div className="space-y-2">
                    <Label>Article File</Label>
                    <a 
                      href={selectedArticle.articleFileUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline block"
                    >
                      View Article PDF
                    </a>
                  </div>
                )}

                {/* Dates */}
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <Label className="text-xs text-slate-600">Submission Date</Label>
                    <p>{new Date(selectedArticle.submissionDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-slate-600">Acceptance Date</Label>
                    <p>{new Date(selectedArticle.acceptanceDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-slate-600">Publication Date</Label>
                    <p>{new Date(selectedArticle.publicationDate).toLocaleDateString()}</p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3 pt-4 border-t">
                  <Button
                    variant="default"
                    onClick={handleUpdateArticle}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </Button>

                  <Button
                    variant="default"
                    className="bg-green-500 hover:bg-green-600"
                    onClick={() => handleStatusChange(selectedArticle.id, "ACCEPTED")}
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Accept
                  </Button>

                  <Button
                    variant="default"
                    className="bg-orange-500 hover:bg-orange-600"
                    onClick={() => handleStatusChange(selectedArticle.id, "ERROR")}
                  >
                    <AlertCircle className="w-4 h-4 mr-2" />
                    Mark as Error
                  </Button>

                  <Button
                    variant="destructive"
                    onClick={() => handleStatusChange(selectedArticle.id, "REJECTED")}
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Reject
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowChat(true)
                      openChat(selectedArticle)
                    }}
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Open Chat
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Chat Dialog */}
        <Dialog open={showChat} onOpenChange={(open) => {
          if (!open) {
            setShowChat(false)
            setChatMessages([])
            setCurrentChatId(null)
          }
        }}>
          <DialogContent className="max-w-2xl h-[80vh] flex flex-col p-0 overflow-hidden">
            <DialogHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 flex-shrink-0">
              <DialogTitle className="text-xl">Chat with Author</DialogTitle>
              {selectedArticle && (
                <div className="text-sm text-blue-100 space-y-1">
                  <p>User ID: {selectedArticle.userId}</p>
                  {currentChatId && <p>Chat ID: {currentChatId}</p>}
                </div>
              )}
            </DialogHeader>

            <ScrollArea className="flex-1 p-6 bg-slate-50 overflow-y-auto">
              <div className="space-y-4">
                {currentChatId === null ? (
                  <div className="text-center text-slate-400 py-8">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
                    Loading chat...
                  </div>
                ) : chatMessages.filter((msg) => msg.articleUserChatId === currentChatId).length === 0 ? (
                  <div className="text-center text-slate-400 py-8">
                    No messages yet. Start the conversation!
                  </div>
                ) : (
                  chatMessages
                    .filter((msg) => msg.articleUserChatId === currentChatId)
                    .map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${msg.fromId === adminUserId ? "justify-end" : "justify-start"} animate-in slide-in-from-bottom duration-300`}
                      >
                        <div
                          className={`max-w-[70%] rounded-2xl px-4 py-3 ${
                            msg.fromId === adminUserId
                              ? "bg-blue-500 text-white rounded-br-sm"
                              : "bg-white text-slate-800 shadow rounded-bl-sm"
                          }`}
                        >
                          <p className="break-words">{msg.message}</p>
                          <span className={`text-xs mt-1 block ${
                            msg.fromId === adminUserId ? "text-blue-100" : "text-slate-500"
                          }`}>
                            {new Date(msg.createdAt).toLocaleTimeString()}
                          </span>
                        </div>
                      </div>
                    ))
                )}
              </div>
            </ScrollArea>

            <div className="p-4 border-t bg-white flex-shrink-0">
              <div className="flex gap-2">
                <Input
                  type="text"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                  placeholder="Type your message..."
                  className="flex-1"
                />
                <Button onClick={sendMessage} size="icon">
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

export default AdminHome