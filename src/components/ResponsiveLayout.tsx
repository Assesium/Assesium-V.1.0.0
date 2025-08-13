import { ReactNode, useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  GraduationCap, 
  BarChart2, 
  Building2, 
  Brain, 
  Users, 
  FileText, 
  Settings, 
  LogOut, 
  User, 
  ChevronDown, 
  CreditCard,
  Menu,
  X,
  Calendar,
  BookOpen,
  UsersRound
} from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import FloatingAIChat from './FloatingAIChat';

interface LayoutProps {
  children: ReactNode;
}

export default function ResponsiveLayout({ children }: LayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [, forceUpdate] = useState({});
  
  // Listen for avatar updates
  useEffect(() => {
    const handleAvatarUpdate = () => {
      forceUpdate({});
    };
    
    window.addEventListener('avatarUpdated', handleAvatarUpdate);
    
    return () => {
      window.removeEventListener('avatarUpdated', handleAvatarUpdate);
    };
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsSidebarOpen(false);
  }, [location.pathname]);

  const navigationItems = [
    { path: '/', label: 'Dashboard', icon: BarChart2 },
    { path: '/institutions', label: 'Institutions', icon: Building2 },
    { path: '/ai-processing', label: 'AI Processing', icon: Brain },
    { path: '/students', label: 'Students', icon: Users },
    { path: '/teachers', label: 'Teachers', icon: GraduationCap },
    { path: '/teacher-schedule', label: 'Schedule', icon: Calendar },
    { path: '/reports', label: 'Reports', icon: FileText },
    { path: '/tutoring', label: 'Tutoring', icon: BookOpen },
    { path: '/community-groups', label: 'Community/Groups', icon: UsersRound },
    { path: '/payments', label: 'Payments', icon: CreditCard },
    { path: '/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 dark:text-white transition-colors duration-300">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-indigo-700 dark:from-gray-800 dark:to-gray-900 text-white fixed top-0 left-0 right-0 z-50 shadow-md">
        <div className="container mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            {/* Logo and Mobile Menu Button */}
            <div className="flex items-center space-x-4">
              <button
                className="md:hidden p-2 rounded-md hover:bg-white/10 transition-colors"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              >
                {isSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
              
              <div className="flex items-center space-x-2">
                <img src="/logo.png" alt="SSESIUM Logo" className="h-8 md:h-12" />
                <span className="text-xl md:text-3xl font-bold text-white">ssesium</span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:block">
              <ul className="flex space-x-6">
                {navigationItems.slice(0, 6).map((item) => (
                  <li key={item.path}>
                    <Link 
                      to={item.path}
                      className={`px-3 py-2 rounded-md transition-colors text-sm ${
                        location.pathname === item.path ? 'bg-white/20' : 'hover:bg-white/10'
                      }`}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Mobile Navigation Toggle */}
            <div className="lg:hidden">
              <button
                className="p-2 rounded-md hover:bg-white/10 transition-colors"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <Menu className="h-6 w-6" />
              </button>
            </div>

            {/* Profile and Theme Toggle */}
            <div className="hidden md:flex items-center space-x-4">
              <ThemeToggle />
              <div className="relative">
                <button
                  className="flex items-center space-x-2 hover:bg-white/10 px-3 py-2 rounded-md transition-colors"
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                >
                  {(() => {
                    const userAvatar = localStorage.getItem('userAvatar');
                    if (userAvatar) {
                      return (
                        <img 
                          src={userAvatar} 
                          alt="User Avatar" 
                          className="h-8 w-8 rounded-full object-cover"
                        />
                      );
                    } else {
                      return (
                        <div className="h-8 w-8 bg-pink-500 rounded-full flex items-center justify-center">
                          <span className="font-semibold text-sm">
                            {(() => {
                              const userName = localStorage.getItem('userName') || 'Teacher Admin';
                              return userName.split(' ').map(n => n[0]).join('');
                            })()}
                          </span>
                        </div>
                      );
                    }
                  })()}
                  <span className="hidden lg:block">
                    {localStorage.getItem('userName') || 'Teacher Admin'}
                  </span>
                  <ChevronDown className="h-4 w-4" />
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-10">
                    <button
                      onClick={() => {
                        setIsProfileOpen(false);
                        navigate('/settings');
                      }}
                      className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
                    >
                      <User className="h-4 w-4" />
                      <span>Update Profile</span>
                    </button>
                    <button
                      onClick={() => {
                        setIsProfileOpen(false);
                        navigate('/settings');
                      }}
                      className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
                    >
                      <Settings className="h-4 w-4" />
                      <span>Settings</span>
                    </button>
                    <button
                      onClick={() => {
                        setIsProfileOpen(false);
                        navigate('/');
                        alert('You have been logged out successfully!');
                      }}
                      className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Log Out</span>
                    </button>
                  </div>
                )}
              </div>
              
              <button
                className="flex items-center space-x-2 hover:bg-white/10 px-3 py-2 rounded-md transition-colors"
                onClick={() => window.open('mailto:support@examsmart.ai')}
              >
                <span>Support</span>
              </button>
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          {isMobileMenuOpen && (
            <div className="lg:hidden mt-4 pb-4 border-t border-white/20">
              <nav className="mt-4">
                <ul className="space-y-2">
                  {navigationItems.map((item) => (
                    <li key={item.path}>
                      <Link 
                        to={item.path}
                        className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors ${
                          location.pathname === item.path ? 'bg-white/20' : 'hover:bg-white/10'
                        }`}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <item.icon className="h-5 w-5" />
                        <span>{item.label}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
              
              <div className="mt-4 pt-4 border-t border-white/20 flex items-center justify-between">
                <ThemeToggle />
                <button
                  className="text-sm hover:bg-white/10 px-3 py-2 rounded-md transition-colors"
                  onClick={() => window.open('mailto:support@examsmart.ai')}
                >
                  Support
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Sidebar Overlay for Mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content Container */}
      <div className="pt-16 md:pt-20">
        <div className="flex">
          {/* Sidebar */}
          <aside className={`
            fixed inset-y-0 left-0 z-40 w-64 bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out
            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
            pt-16 md:pt-20
          `}>
            <div className="p-4 h-full overflow-y-auto">
              <h3 className="text-lg font-semibold text-indigo-900 dark:text-indigo-300 mb-4">Main Menu</h3>
              <nav>
                <ul className="space-y-2">
                  {navigationItems.map((item) => (
                    <li key={item.path}>
                      <Link 
                        to={item.path}
                        className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors ${
                          location.pathname === item.path 
                            ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-300' 
                            : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/30'
                        }`}
                        onClick={() => setIsSidebarOpen(false)}
                      >
                        <item.icon className="h-5 w-5" />
                        <span>{item.label}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 p-4 md:p-6 md:ml-64">
            <div className="max-w-full overflow-x-auto">
              {children}
            </div>
          </main>
        </div>
      </div>
      
      {/* Floating AI Chat */}
      <FloatingAIChat />
    </div>
  );
}

