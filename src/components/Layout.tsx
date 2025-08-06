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
  Calendar
} from 'lucide-react';
import ThemeToggle from './ThemeToggle';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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
  }, [location.pathname]);

  const navigationItems = [
    { path: '/', label: 'Dashboard', icon: BarChart2 },
    { path: '/institutions', label: 'Institutions', icon: Building2 },
    { path: '/ai-processing', label: 'AI Processing', icon: Brain },
    { path: '/students', label: 'Students', icon: Users },
    { path: '/teachers', label: 'Teachers', icon: GraduationCap },
    { path: '/schedule', label: 'Schedule', icon: Calendar },
    { path: '/reports', label: 'Reports', icon: FileText },
    { path: '/payments', label: 'Payments', icon: CreditCard },
    { path: '/settings', label: 'Settings', icon: Settings }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-indigo-700 dark:from-gray-800 dark:to-gray-900 text-white fixed top-0 left-0 right-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                  <div className="w-4 h-4 bg-white rounded-sm transform rotate-45"></div>
                </div>
                <span className="text-xl font-bold">ssesium</span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-1">
              {navigationItems.slice(0, 7).map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    location.pathname === item.path
                      ? 'bg-white/20 text-white'
                      : 'text-white/80 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Right side - Theme toggle and Profile */}
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              
              {/* Profile Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-2 hover:bg-white/10 px-3 py-2 rounded-md transition-colors"
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
                          <span className="text-sm font-semibold">
                            {(() => {
                              const userName = localStorage.getItem('userName') || 'Teacher Admin';
                              return userName.split(' ').map(n => n[0]).join('');
                            })()}
                          </span>
                        </div>
                      );
                    }
                  })()}
                  <span className="hidden sm:block text-sm">
                    {localStorage.getItem('userName') || 'Teacher Admin'}
                  </span>
                  <ChevronDown className="h-4 w-4" />
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-20">
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

              {/* Mobile menu button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 rounded-md hover:bg-white/10 transition-colors"
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <div className="md:hidden border-t border-white/20">
              <div className="px-2 pt-2 pb-3 space-y-1">
                {navigationItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium transition-colors ${
                      location.pathname === item.path
                        ? 'bg-white/20 text-white'
                        : 'text-white/80 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main Layout */}
      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex gap-6">
            {/* Desktop Sidebar */}
            <aside className="hidden lg:block w-64 flex-shrink-0">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 transition-colors duration-300 sticky top-24">
                <h3 className="text-lg font-semibold text-indigo-900 dark:text-indigo-300 mb-4">Main Menu</h3>
                <nav>
                  <ul className="space-y-2">
                    {navigationItems.map((item) => (
                      <li key={item.path}>
                        <Link 
                          to={item.path}
                          className={`flex items-center space-x-3 px-3 py-2 rounded-md transition-colors ${
                            location.pathname === item.path 
                              ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-300' 
                              : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/30'
                          }`}
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
            <main className="flex-1 min-w-0">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm transition-colors duration-300">
                {children}
              </div>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}

