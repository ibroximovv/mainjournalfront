import AuthLogin from "@/pages/Auth/AuthLogin"
import AuthRegister from "@/pages/Auth/AuthRegister"
import { AdminAuthor, AdminChat, AdminHome, AdminJournal, AdminProfile, AdminSettings, ChackArticle, SuperadminControl, Home as AdminHomeMain, AdminCategory } from "@/pages/Dashboard/Admin"
import { UserControl } from "@/pages/Dashboard/Superadmin"
import { UserAdminChat, UserArticle, UserAuthor, UserHome, UserProfile } from "@/pages/Dashboard/User"
import ArticleHome from "@/pages/Main/ArticleHome"
import Home from "@/pages/Main/Home"
import JournalHome from "@/pages/Main/JournalHome"
import { BookOpen, CassetteTape, CircleOff, FileText, HomeIcon, LayoutDashboard, MessageCircle, Settings, SquareArrowOutUpLeftIcon, User, UserCog, Users } from "lucide-react"

export const Paths = {
    main: '/',
    about: '/about',
    journal: '/journal',
    article: '/article',
    journalId: '/journal/:id',
    articleId: '/article/:id',
    search: '/search',
    login: '/auth/login',
    register: '/auth/register',
    sendOtp: '/auth/send-otp',
    verifyOtp: '/auth/verify-otp',
    forgotPassword: '/auth/forgot-password',
    resetPassword: '/auth/reset-password',
    dashboard: '/dashboard',
    profile: '/dashboard/profile',
    settings: '/dashboard/settings',
    dashoardArticle: '/dashboard/article',
    dashoardArticleId: '/dashboard/article/:id',
    dashoardJournal: '/dashboard/journal',
    dashoardJournalId: '/dashboard/journal/:id',
    dashoardSearch: '/dashboard/search',
    dashoardSearchId: '/dashboard/search/:id',
}

export const DashboardPaths = {
    dashboard: '/dashboard',
    profile: '/dashboard/profile',
    settings: '/dashboard/settings',
    dashoardArticle: '/dashboard/article',
    dashoardArticleId: '/dashboard/article/:id',
    dashoardJournal: '/dashboard/journal',
    dashoardJournalId: '/dashboard/journal/:id',
    dashoardSearch: '/dashboard/search',
    dashoardSearchId: '/dashboard/search/:id',
}

export const MainPaths = {
    main: '/',
    home: '/home',
    about: '/about',
    journalId: '/journal/:id',
    journalAll: '/journal/:id/all',
    article: '/journal/:id/article',
    articleId: '/journal/:id/article/:id',
    search: '/search',
    login: '/login',
    register: '/register',
    sendOtp: '/send-otp',
    verifyOtp: '/verify-otp',
    forgotPassword: '/forgot-password',
    resetPassword: '/reset-password',
}

export const AuthPaths = {
  login: '/auth/login',
  register: '/auth/register',
  sendOtp: '/auth/send-otp',
  verifyOtp: '/auth/verify-otp',
  forgotPassword: '/auth/forgot-password',
  resetPassword: '/auth/reset-password',
}


export const MainRouteList = [
  { id: 1, path: '/', element: <Home /> },
  { id: 2, path: '/journal/:id/all', element: <JournalHome /> },
  { id: 3, path: '/journal/:id/article', element: <ArticleHome /> },
  { id: 4, path: '/journal/:id', element: <JournalHome /> },
  { id: 5, path: '/journal/:id/article/:id', element: <ArticleHome /> },
  // Auth
  { id: 6, path: AuthPaths.login, element: <AuthLogin /> },
  { id: 7, path: AuthPaths.register, element: <AuthRegister /> },
]


export const MainNavList = [
    { label: 'About', path: MainPaths.about },
    { label: 'Journal', path: MainPaths.journalAll },
    { label: 'Article', path: MainPaths.article },
    { label: 'Search', path: MainPaths.search },
]

export const DashboardAdminPaths = {
  main: '/',
  home: '/dashboard/admin',
  journal: '/dashboard/admin/journal',
  article: '/dashboard/admin/article',
  author: '/dashboard/admin/author',
  profile: '/dashboard/admin/profile',
  chat: '/dashboard/admin/chat',
  settings: '/dashboard/admin/settings',
  journalId: '/dashboard/admin/journal/:id',
  journalVersion: '/dashboard/admin/journal/:id/version',
  articleId: '/dashboard/admin/article/:id',
  authorId: '/dashboard/admin/author/:id',
  superadminControll: '/dashboard/admin/superadmin-controll',
  userControl: '/dashboard/admin/user-control',
  category: '/dashboard/admin/category',
}

export const DashboardAdminRouteList = [
  {
    id: 1,
    path: DashboardAdminPaths.home,
    element: <AdminHome />
  },
  {
    id: 2,
    path: DashboardAdminPaths.journal,
    element: <AdminJournal />
  },
  {
    id: 3,
    path: DashboardAdminPaths.article,
    element: <ChackArticle />
  },
  {
    id: 4,
    path: DashboardAdminPaths.superadminControll,
    element: <SuperadminControl />
  },
  {
    id: 5,
    path: DashboardAdminPaths.author,
    element: <AdminAuthor />
  },
  {
    id: 6,
    path: DashboardAdminPaths.profile,
    element: <AdminProfile />
  },
  {
    id: 7,
    path: DashboardAdminPaths.chat,
    element: <AdminChat />
  },
  {
    id: 8,
    path: DashboardAdminPaths.settings,
    element: <AdminSettings />
  },
  {
    id: 9,
    path: DashboardAdminPaths.userControl,
    element: <UserControl />
  },
  {
    id: 10,
    path: DashboardAdminPaths.main,
    element: <AdminHomeMain />
  },
  {
    id: 11,
    path: DashboardAdminPaths.category,
    element: <AdminCategory />
  }
]

export const UserPaths = {
  home: '/dashboard/user',
  articles: '/dashboard/user/articles',
  profile: '/dashboard/user/profile',
  settings: '/dashboard/user/settings',
  chat: '/dashboard/user/chat',
  author: 'dashboard/user/articles/author',
  authorId: 'dashboard/user/articles/author/:id'
}

export const DashboardUserRouteList = [
  {
    id: 1,
    path: UserPaths.home,
    element: <UserHome />
  },
  {
    id: 2,
    path: UserPaths.articles,
    element: <UserArticle />
  },
  {
    id: 3,
    path: UserPaths.profile,
    element: <UserProfile />
  },
  {
    id: 4,
    path: UserPaths.chat,
    element: <UserAdminChat />
  },
  {
    id: 5,
    path: UserPaths.author,
    element: <UserAuthor />
  },
  {
    id: 6,
    path: UserPaths.authorId,
    element: <UserAuthor />
  }
]

export const DashboardAdminNavList = [
  { key: 'home', title: 'Home', url: '/dashboard/admin', icon: HomeIcon },
  { key: 'journal', title: 'Journal', url: '/dashboard/admin/journal', icon: BookOpen },
  { key: 'category', title: 'Category', url: '/dashboard/admin/category', icon: CassetteTape },
  // { key: 'userControl', title: 'User Control', url: '/dashboard/admin/users', icon: Users },
  { key: 'superadminControll', title: 'Users Control', url: '/dashboard/admin/superadmin-controll', icon: UserCog },
];

export const DashboardSuperadminNavList = [
  { key: 'dashboard', title: 'Dashboard', url: '/superadmin', icon: LayoutDashboard },
  { key: 'admins', title: 'Admins', url: '/superadmin/admins', icon: UserCog },
  { key: 'settings', title: 'Settings', url: '/superadmin/settings', icon: Settings },
];

export const DashboardUserNavList = [
  { key: 'home', title: 'Home', url: '/dashboard/user', icon: HomeIcon },
  { key: 'chat', title: 'Chat', url: '/dashboard/user/chat', icon: MessageCircle },
  { key: 'articles', title: 'Articles', url: '/dashboard/user/articles', icon: FileText },
  { key: 'atuhor', title: 'Author', url: '/dashboard/user/articles/author', icon: SquareArrowOutUpLeftIcon },
  { key: 'profile', title: 'Profile', url: '/dashboard/user/profile', icon: User },
];
