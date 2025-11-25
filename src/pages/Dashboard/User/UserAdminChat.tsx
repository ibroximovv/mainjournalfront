
import React, { useState, useEffect, useRef } from 'react';
import { Send, Search, CheckCheck, Check, Circle, Users, User, AlertCircle, ArrowLeft } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { io, Socket } from 'socket.io-client';

// Types
interface UserType {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  phoneNumber: string;
  telegramUsername: string;
  courseNumber: number;
  groupName: string;
  image: string;
  role: 'USER' | 'ADMIN' | 'SUPERADMIN';
  createdAt: string;
  updatedAt: string;
}

interface MessageType {
  id: number;
  fromId: number;
  toId: number;
  message: string;
  isRead: boolean;
  createdAt: string;
  from?: UserType;
  to?: UserType;
  articleUserChatId: number;
}

interface ChatType {
  id: number;
  fromId: number;
  toId: number;
  createdAt: string;
  updatedAt: string;
}

const API_BASE = 'https://backendjournal.ilyosbekibroximov.uz/api';
const SOCKET_URL = 'https://backendjournal.ilyosbekibroximov.uz';

const UserAdminChat = () => {
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);
  const [chats, setChats] = useState<ChatType[]>([]);
  const [users, setUsers] = useState<UserType[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserType[]>([]);
  const [selectedChat, setSelectedChat] = useState<UserType | null>(null);
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [messageInput, setMessageInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [onlineUsers, setOnlineUsers] = useState<number[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Get token from localStorage
  const getToken = () => localStorage.getItem('token');

  // API Headers
  const getHeaders = () => ({
    'Authorization': `Bearer ${getToken()}`,
    'Content-Type': 'application/json',
  });

  // Scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize Socket
  useEffect(() => {
    const token = getToken();
    if (!token) {
      setError('Token topilmadi. Iltimos, qayta login qiling.');
      setIsLoading(false);
      return;
    }

    const newSocket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('✅ Socket connected:', newSocket.id);
      setIsConnected(true);
      setError(null);
    });

    newSocket.on('disconnect', () => {
      console.log('❌ Socket disconnected');
      setIsConnected(false);
    });

    newSocket.on('connect_error', (err) => {
      console.error('Socket connection error:', err);
      setError('Server bilan aloqa o\'rnatib bo\'lmadi');
    });

    return () => {
      newSocket.close();
    };
  }, []);

  // Fetch current user
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await fetch(`${API_BASE}/user/me`, {
          headers: getHeaders(),
        });

        if (!response.ok) {
          throw new Error('Foydalanuvchi ma\'lumotlarini olishda xatolik');
        }

        const data = await response.json();
        console.log('Current user data:', data);

        if (data.statusCode === 200 && data.data) {
          setCurrentUser(data.data);

          // Join socket room
          if (socket && isConnected) {
            socket.emit('join_user', { userId: data.data.id });
            console.log('Joined user room:', data.data.id);
          }
        } else if (data.id) {
          // API returns user directly without wrapper
          setCurrentUser(data);

          if (socket && isConnected) {
            socket.emit('join_user', { userId: data.id });
            console.log('Joined user room:', data.id);
          }
        } else {
          throw new Error('Noto\'g\'ri javob formati');
        }
      } catch (error) {
        console.error('Error fetching current user:', error);
        setError('Foydalanuvchi ma\'lumotlarini yuklashda xatolik yuz berdi');
      }
    };

    if (socket && isConnected) {
      fetchCurrentUser();
    }
  }, [socket, isConnected]);

  // Fetch chats and users
  useEffect(() => {
    const fetchData = async () => {
      if (!currentUser) return;

      try {
        setIsLoading(true);
        setError(null);

        // Fetch all users first (except current user)
        const usersResponse = await fetch(`${API_BASE}/user`, {
          headers: getHeaders(),
        });

        if (!usersResponse.ok) {
          throw new Error('Foydalanuvchilarni yuklashda xatolik');
        }

        const usersData = await usersResponse.json();
        console.log('Users data:', usersData);

        if (usersData.statusCode === 200 && usersData.data) {
          const filteredUsersList = usersData.data.filter(
            (user: UserType) => user.id !== currentUser.id
          );
          setUsers(filteredUsersList);
          setFilteredUsers(filteredUsersList);
          console.log('Filtered users:', filteredUsersList.length);
        } else if (Array.isArray(usersData)) {
          // API returns array directly
          const filteredUsersList = usersData.filter(
            (user: UserType) => user.id !== currentUser.id
          );
          setUsers(filteredUsersList);
          setFilteredUsers(filteredUsersList);
        }

        // Fetch chats (this might fail if no chats exist yet)
        try {
          const chatsResponse = await fetch(
            `${API_BASE}/article-user-chat?page=1&limit=100&sortBy=createdAt&sortOrder=desc`,
            { headers: getHeaders() }
          );

          if (chatsResponse.ok) {
            const chatsData = await chatsResponse.json();
            console.log('Chats data:', chatsData);

            if (chatsData.statusCode === 200 && chatsData.data) {
              setChats(chatsData.data);
            } else if (Array.isArray(chatsData)) {
              setChats(chatsData);
            }
          }
        } catch (chatError) {
          console.log('No chats yet or error fetching chats:', chatError);
          // This is not critical, user can still start new chats
        }

        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Ma\'lumotlarni yuklashda xatolik yuz berdi');
        setIsLoading(false);
      }
    };

    fetchData();
  }, [currentUser]);

  // Socket listeners
  useEffect(() => {
    if (!socket || !currentUser || !isConnected) return;

    socket.on('load_previous_messages', (msgs: MessageType[]) => {
      console.log('Loaded previous messages:', msgs.length);
      setMessages(msgs);
    });

    socket.on('new_message', (message: MessageType) => {
      console.log('New message received:', message);
      setMessages(prev => {
        // Avoid duplicates
        if (prev.some(m => m.id === message.id)) return prev;
        return [...prev, message];
      });

      // Mark as read if chat is open
      if (selectedChat && message.fromId === selectedChat.id && message.toId === currentUser.id) {
        socket.emit('mark_as_read', {
          messageId: message.id,
          toId: currentUser.id
        });
      }
    });

    socket.on('message_sent', (message: MessageType) => {
      console.log('Message sent confirmed:', message);
      setMessages(prev => {
        // Avoid duplicates
        if (prev.some(m => m.id === message.id)) return prev;
        return [...prev, message];
      });
    });

    socket.on('message_read', (message: MessageType) => {
      console.log('Message marked as read:', message);
      setMessages(prev =>
        prev.map(msg => msg.id === message.id ? { ...msg, isRead: true } : msg)
      );
    });

    // Get online users
    const fetchOnlineUsers = () => {
      socket.emit('get_online_users', {}, (response: any) => {
        if (response && response.onlineUsers) {
          setOnlineUsers(response.onlineUsers);
        }
      });
    };

    // Fetch immediately and then periodically
    fetchOnlineUsers();
    const interval = setInterval(fetchOnlineUsers, 5000);

    return () => {
      clearInterval(interval);
      socket.off('load_previous_messages');
      socket.off('new_message');
      socket.off('message_sent');
      socket.off('message_read');
    };
  }, [socket, currentUser, selectedChat, isConnected]);

  // Filter messages for selected chat
  const currentChatMessages = messages.filter(
    msg =>
      (msg.fromId === currentUser?.id && msg.toId === selectedChat?.id) ||
      (msg.fromId === selectedChat?.id && msg.toId === currentUser?.id)
  );

  // Handle chat selection
  const handleSelectChat = async (user: UserType) => {
    setSelectedChat(user);

    // Create or get chat
    try {
      const response = await fetch(`${API_BASE}/article-user-chat`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ toId: user.id }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Chat created/fetched:', data);
      }
    } catch (error) {
      console.error('Error creating chat:', error);
    }
  };

  // Send message
  const handleSendMessage = () => {
    if (!messageInput.trim() || !selectedChat || !currentUser || !socket || !isConnected) {
      if (!isConnected) {
        setError('Server bilan aloqa yo\'q. Iltimos, kutib turing...');
      }
      return;
    }

    console.log('Sending message:', {
      fromId: currentUser.id,
      toId: selectedChat.id,
      message: messageInput.trim(),
    });

    socket.emit('send_message', {
      fromId: currentUser.id,
      toId: selectedChat.id,
      message: messageInput.trim(),
    });

    setMessageInput('');
  };

  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setFilteredUsers(users);
      return;
    }

    const filtered = users.filter(user => {
      const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
      const username = user.username.toLowerCase();
      const searchLower = query.toLowerCase();
      return fullName.includes(searchLower) || username.includes(searchLower);
    });

    setFilteredUsers(filtered);
  };

  // Get last message for user
  const getLastMessage = (userId: number) => {
    const userMessages = messages.filter(
      msg =>
        (msg.fromId === currentUser?.id && msg.toId === userId) ||
        (msg.fromId === userId && msg.toId === currentUser?.id)
    );
    return userMessages[userMessages.length - 1];
  };

  // Get unread count
  const getUnreadCount = (userId: number) => {
    return messages.filter(
      msg => msg.fromId === userId && msg.toId === currentUser?.id && !msg.isRead
    ).length;
  };

  // Separate users by role
  const adminUsers = filteredUsers.filter(u => ['ADMIN', 'SUPERADMIN'].includes(u.role));
  const regularUsers = filteredUsers.filter(u => u.role === 'USER');

  // Format time
  const formatTime = (date: string) => {
    try {
      return new Date(date).toLocaleTimeString('uz-UZ', {
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return '';
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-slate-50 to-slate-100 gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
        <p className="text-slate-600 text-sm">Ma'lumotlar yuklanmoqda...</p>
      </div>
    );
  }

  if (error && !currentUser) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="flex md:rounded-2xl max-h-screen h-[99%] rounded-2xl overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Sidebar - Users List */}
      <div className={`${selectedChat ? 'hidden md:flex' : 'flex'} w-full md:w-80 bg-white border-r border-slate-200 flex-col shadow-lg overflow-hidden`}>
        {/* Header */}
        <div className="p-3 md:p-4 border-b border-slate-200 bg-gradient-to-r from-[#133654] to-blue-800 flex-shrink-0">
          <div className="flex items-center gap-2 md:gap-3 mb-3">
            <Avatar className="h-10 w-10 md:h-12 md:w-12 border-2 border-white shadow-md">
              <AvatarImage src={currentUser?.image} />
              <AvatarFallback className="bg-blue-500 text-white text-sm">
                {currentUser?.firstName?.[0]}{currentUser?.lastName?.[0]}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <h2 className="font-semibold text-white text-sm md:text-base truncate">
                {currentUser?.firstName} {currentUser?.lastName}
              </h2>
              <p className="text-xs text-blue-100 truncate">@{currentUser?.username}</p>
            </div>
            <div className={`h-2 w-2 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'} animate-pulse flex-shrink-0`}
              title={isConnected ? 'Ulangan' : 'Ulanmagan'} />
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Qidirish..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10 bg-white/90 border-0 focus-visible:ring-2 focus-visible:ring-white/50 text-sm"
            />
          </div>
        </div>

        {/* Users List */}
        <ScrollArea className="flex-1">
          <div className="p-2">
            {/* Admin Section */}
            {adminUsers.length > 0 && (
              <div className="mb-4">
                <div className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  <Users className="h-3 w-3" />
                  Adminlar
                </div>
                {adminUsers.map(user => {
                  const lastMsg = getLastMessage(user.id);
                  const unreadCount = getUnreadCount(user.id);
                  const isOnline = onlineUsers.includes(user.id);

                  return (
                    <button
                      key={user.id}
                      onClick={() => handleSelectChat(user)}
                      className={`w-full p-2 md:p-3 rounded-lg mb-1 transition-all duration-200 hover:bg-slate-50 ${selectedChat?.id === user.id
                        ? 'bg-blue-50 border border-blue-200 shadow-sm'
                        : 'hover:shadow-sm'
                        }`}
                    >
                      <div className="flex items-start gap-2 md:gap-3">
                        <div className="relative flex-shrink-0">
                          <Avatar className="h-10 w-10 md:h-11 md:w-11">
                            <AvatarImage src={user.image} />
                            <AvatarFallback className="bg-gradient-to-br from-[#133654] to-blue-700 text-white text-sm">
                              {user.firstName[0]}{user.lastName[0]}
                            </AvatarFallback>
                          </Avatar>
                          {isOnline && (
                            <Circle className="absolute bottom-0 right-0 h-2.5 w-2.5 md:h-3 md:w-3 fill-green-500 text-green-500 border-2 border-white rounded-full" />
                          )}
                        </div>
                        <div className="flex-1 text-left overflow-hidden min-w-0">
                          <div className="flex items-center justify-between mb-1 gap-2">
                            <span className="font-medium text-xs md:text-sm text-slate-800 truncate">
                              {user.firstName} {user.lastName}
                            </span>
                            {lastMsg && (
                              <span className="text-xs text-slate-400 flex-shrink-0">
                                {formatTime(lastMsg.createdAt)}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center justify-between gap-2">
                            <p className="text-xs text-slate-500 truncate">
                              {lastMsg?.message || 'Xabar yo\'q'}
                            </p>
                            {unreadCount > 0 && (
                              <Badge className="h-5 min-w-[20px] bg-blue-500 hover:bg-blue-600 text-white text-xs flex-shrink-0">
                                {unreadCount}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Regular Users Section */}
            {regularUsers.length > 0 && (
              <div>
                <div className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  <User className="h-3 w-3" />
                  Foydalanuvchilar
                </div>
                {regularUsers.map(user => {
                  const lastMsg = getLastMessage(user.id);
                  const unreadCount = getUnreadCount(user.id);
                  const isOnline = onlineUsers.includes(user.id);

                  return (
                    <button
                      key={user.id}
                      onClick={() => handleSelectChat(user)}
                      className={`w-full p-2 md:p-3 rounded-lg mb-1 transition-all duration-200 hover:bg-slate-50 ${selectedChat?.id === user.id
                        ? 'bg-blue-50 border border-blue-200 shadow-sm'
                        : 'hover:shadow-sm'
                        }`}
                    >
                      <div className="flex items-start gap-2 md:gap-3">
                        <div className="relative flex-shrink-0">
                          <Avatar className="h-10 w-10 md:h-11 md:w-11">
                            <AvatarImage src={user.image} />
                            <AvatarFallback className="bg-gradient-to-br from-slate-400 to-slate-500 text-white text-sm">
                              {user.firstName[0]}{user.lastName[0]}
                            </AvatarFallback>
                          </Avatar>
                          {isOnline && (
                            <Circle className="absolute bottom-0 right-0 h-2.5 w-2.5 md:h-3 md:w-3 fill-green-500 text-green-500 border-2 border-white rounded-full" />
                          )}
                        </div>
                        <div className="flex-1 text-left overflow-hidden min-w-0">
                          <div className="flex items-center justify-between mb-1 gap-2">
                            <span className="font-medium text-xs md:text-sm text-slate-800 truncate">
                              {user.firstName} {user.lastName}
                            </span>
                            {lastMsg && (
                              <span className="text-xs text-slate-400 flex-shrink-0">
                                {formatTime(lastMsg.createdAt)}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center justify-between gap-2">
                            <p className="text-xs text-slate-500 truncate">
                              {lastMsg?.message || 'Xabar yo\'q'}
                            </p>
                            {unreadCount > 0 && (
                              <Badge className="h-5 min-w-[20px] bg-blue-500 hover:bg-blue-600 text-white text-xs flex-shrink-0">
                                {unreadCount}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {/* No users found */}
            {filteredUsers.length === 0 && (
              <div className="text-center py-8">
                <p className="text-slate-500 text-sm">Foydalanuvchi topilmadi</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Chat Area */}
      <div className={`${selectedChat ? 'flex' : 'hidden md:flex'} flex-1 flex-col overflow-hidden`}>
        {selectedChat ? (
          <>
            {/* Chat Header */}
            <div className="p-3 md:p-4 bg-[#d1d6f5c2] border-b border-slate-200 shadow-sm flex-shrink-0">
              <div className="flex items-center gap-2 md:gap-3">
                {/* Back button for mobile */}
                <button
                  onClick={() => setSelectedChat(null)}
                  className="md:hidden p-2 hover:bg-white/50 rounded-lg transition-colors flex-shrink-0 -ml-1"
                  aria-label="Orqaga qaytish"
                >
                  <ArrowLeft className="w-5 h-5 text-slate-700" />
                </button>

                <div className="relative flex-shrink-0">
                  <Avatar className="h-10 w-10 md:h-12 md:w-12">
                    <AvatarImage src={selectedChat.image} />
                    <AvatarFallback className="bg-gradient-to-br from-[#133654] to-blue-600 text-white text-sm">
                      {selectedChat.firstName[0]}{selectedChat.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                  {onlineUsers.includes(selectedChat.id) && (
                    <Circle className="absolute bottom-0 right-0 h-2.5 w-2.5 md:h-3 md:w-3 fill-green-500 text-green-500 border-2 border-white rounded-full" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-slate-800 text-sm md:text-base truncate">
                    {selectedChat.firstName} {selectedChat.lastName}
                  </h3>
                  <p className="text-xs md:text-sm text-slate-500">
                    {onlineUsers.includes(selectedChat.id) ? 'Onlayn' : 'Oflayn'}
                  </p>
                </div>
                <Badge variant="outline" className="text-xs flex-shrink-0">
                  {selectedChat.role}
                </Badge>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 overflow-y-auto p-3 md:p-4 bg-[linear-gradient(to_top,#f3e7e9_0%,#e3eeff_99%,#e3eeff_100%)]" ref={scrollAreaRef}>
              <div className="space-y-3 md:space-y-4">
                {currentChatMessages.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-slate-400 text-sm">Xabarlar yo'q</p>
                    <p className="text-slate-400 text-xs md:text-sm mt-1">Birinchi xabarni yuboring</p>
                  </div>
                ) : (
                  currentChatMessages.map((msg, index) => {
                    const isOwn = msg.fromId === currentUser?.id;
                    const showAvatar = index === 0 ||
                      currentChatMessages[index - 1].fromId !== msg.fromId;

                    return (
                      <div
                        key={msg.id}
                        className={`flex items-end gap-1.5 md:gap-2 ${isOwn ? 'flex-row-reverse' : 'flex-row'} animate-in slide-in-from-bottom-2 duration-300`}
                      >
                        {!isOwn && (
                          <Avatar className={`h-7 w-7 md:h-8 md:w-8 flex-shrink-0 ${showAvatar ? 'opacity-100' : 'opacity-0'}`}>
                            <AvatarImage src={selectedChat.image} />
                            <AvatarFallback className="bg-gradient-to-br from-slate-400 to-slate-500 text-white text-xs">
                              {selectedChat.firstName[0]}{selectedChat.lastName[0]}
                            </AvatarFallback>
                          </Avatar>
                        )}

                        <div className={`flex flex-col ${isOwn ? 'items-end' : 'items-start'} max-w-[85%] md:max-w-[70%]`}>
                          <div
                            className={`px-3 py-2 md:px-4 md:py-2 rounded-2xl shadow-sm ${isOwn
                              ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-br-sm'
                              : 'bg-white text-slate-800 rounded-bl-sm border border-slate-200'
                              }`}
                          >
                            <p className="text-xs md:text-sm break-words whitespace-pre-wrap">{msg.message}</p>
                          </div>
                          <div className={`flex items-center gap-1 mt-1 px-1 ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}>
                            <span className="text-xs text-slate-400">
                              {formatTime(msg.createdAt)}
                            </span>
                            {isOwn && (
                              msg.isRead ? (
                                <CheckCheck className="h-3 w-3 text-blue-500" />
                              ) : (
                                <Check className="h-3 w-3 text-slate-400" />
                              )
                            )}
                          </div>
                        </div>

                        {isOwn && (
                          <Avatar className={`h-7 w-7 md:h-8 md:w-8 flex-shrink-0 ${showAvatar ? 'opacity-100' : 'opacity-0'}`}>
                            <AvatarImage src={currentUser?.image} />
                            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white text-xs">
                              {currentUser?.firstName[0]}{currentUser?.lastName[0]}
                            </AvatarFallback>
                          </Avatar>
                        )}
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Error message */}
            {error && (
              <div className="px-4 py-2 bg-red-50 border-t border-red-100 flex-shrink-0">
                <p className="text-xs text-red-600">{error}</p>
              </div>
            )}

            {/* Message Input */}
            <div className="p-4 bg-[#d1d6f5c2] border-t border-slate-200 shadow-lg flex-shrink-0">
              <div className="flex items-end gap-2">
                <div className="flex-1 bg-slate-50 rounded-2xl border border-slate-200 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all">
                  <textarea
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    placeholder="Xabar yozing..."
                    className="w-full px-4 py-3 bg-transparent resize-none outline-none text-sm max-h-32 min-h-[44px]"
                    rows={1}
                    disabled={!isConnected}
                  />
                </div>
                <Button
                  onClick={handleSendMessage}
                  disabled={!messageInput.trim() || !isConnected}
                  className="h-11 w-11 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  title={!isConnected ? 'Server bilan aloqa yo\'q' : 'Yuborish'}
                >
                  <Send className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
            <div className="text-center space-y-4 animate-in fade-in duration-500">
              <div className="w-24 h-24 mx-auto bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center">
                <Users className="h-12 w-12 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-slate-700 mb-2">
                  Suhbatni boshlang
                </h3>
                <p className="text-slate-500">
                  Xabar yuborish uchun foydalanuvchini tanlang
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserAdminChat;