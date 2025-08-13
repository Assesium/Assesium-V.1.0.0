import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Bell, Lock, Palette, Save, Moon, Sun, Monitor, Check, X } from 'lucide-react';
import { useThemeStore } from '../stores/useThemeStore';
import { useModalStore } from '../stores/useModalStore';
import { useUIStore } from '../stores/useUIStore';
import Button from '../components/Button';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('profile');
  const { isDarkMode, toggleTheme } = useThemeStore();
  const { preferences, toggleColorScheme, updatePreferences } = useUIStore();
  const { openModal } = useModalStore();
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState('30');
  const [primaryColor, setPrimaryColor] = useState('indigo');
  const [fontSize, setFontSize] = useState(preferences.fontSize || 'medium');
  const [, forceUpdate] = useState({});
  
  // Listen for avatar updates
  useEffect(() => {
    const handleAvatarUpdate = () => {
      // Force a re-render when avatar is updated
      forceUpdate({});
    };
    
    window.addEventListener('avatarUpdated', handleAvatarUpdate);
    
    return () => {
      window.removeEventListener('avatarUpdated', handleAvatarUpdate);
    };
  }, []);
  
  // Mock user data
  const [userData, setUserData] = useState({
    name: 'Teacher Admin',
    email: 'admin@examsmart.ai',
    role: 'Administrator',
    institution: 'Cambridge High School',
    phone: '+1 (555) 123-4567',
    avatar: 'TA' // Initials for avatar
  });

  const [formData, setFormData] = useState({
    name: userData.name,
    email: userData.email,
    phone: userData.phone,
    institution: userData.institution
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSaveProfile = () => {
    setUserData({
      ...userData,
      ...formData
    });
    // Show success message or toast notification
    alert('Profile updated successfully!');
  };

  const colorOptions = [
    { name: 'Indigo', value: 'indigo' },
    { name: 'Blue', value: 'blue' },
    { name: 'Purple', value: 'purple' },
    { name: 'Pink', value: 'pink' },
    { name: 'Teal', value: 'teal' }
  ];

  const fontSizeOptions = [
    { name: 'Small', value: 'small' },
    { name: 'Medium', value: 'medium' },
    { name: 'Large', value: 'large' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-1 transition-colors duration-300">
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-3 font-medium text-sm flex-1 text-center flex items-center justify-center gap-2 ${activeTab === 'profile' ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
          >
            <User className="h-4 w-4" />
            Profile
          </button>
          <button
            onClick={() => setActiveTab('notifications')}
            className={`px-4 py-3 font-medium text-sm flex-1 text-center flex items-center justify-center gap-2 ${activeTab === 'notifications' ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
          >
            <Bell className="h-4 w-4" />
            Notifications
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`px-4 py-3 font-medium text-sm flex-1 text-center flex items-center justify-center gap-2 ${activeTab === 'security' ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
          >
            <Lock className="h-4 w-4" />
            Security
          </button>
          <button
            onClick={() => setActiveTab('appearance')}
            className={`px-4 py-3 font-medium text-sm flex-1 text-center flex items-center justify-center gap-2 ${activeTab === 'appearance' ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
          >
            <Palette className="h-4 w-4" />
            Appearance
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row gap-8">
                {/* Avatar Section */}
                <div className="flex flex-col items-center space-y-4">
                  <div className="h-32 w-32 rounded-full flex items-center justify-center overflow-hidden">
                    {(() => {
                      const userAvatar = localStorage.getItem('userAvatar');
                      if (userAvatar) {
                        return (
                          <img 
                            src={userAvatar} 
                            alt="User Avatar" 
                            className="h-full w-full object-cover"
                          />
                        );
                      } else {
                        return (
                          <div className="h-full w-full bg-indigo-600 flex items-center justify-center">
                            <span className="text-3xl font-bold text-white">{userData.avatar}</span>
                          </div>
                        );
                      }
                    })()}
                    <span className="text-3xl font-bold text-white">{userData.avatar}</span>
                  </div>
                  <button 
                    className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 text-sm font-medium"
                    onClick={() => openModal('avatar', { currentAvatar: userData.avatar })}
                  >
                    Change Avatar
                  </button>
                  <div className="text-center mt-2">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">{userData.name}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{userData.role}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{userData.institution}</p>
                  </div>
                </div>

                {/* Form Section */}
                <div className="flex-1 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="institution" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Institution
                      </label>
                      <input
                        type="text"
                        id="institution"
                        name="institution"
                        value={formData.institution}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3">
                    <Button 
                      variant="outline"
                      onClick={() => openModal('userProfile', { data: userData })}
                    >
                      Edit Full Profile
                    </Button>
                    <Button 
                      variant="primary"
                      icon={<Save className="h-4 w-4" />}
                      onClick={handleSaveProfile}
                    >
                      Save Profile
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Notification Preferences</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage how you receive notifications</p>
                  </div>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => openModal('preferences', { 
                      settings: {
                        emailNotifications: emailNotifications,
                        pushNotifications: pushNotifications,
                        smsNotifications: smsNotifications,
                        marketingEmails: false,
                        weeklyDigest: true,
                        notificationSound: 'default'
                      }
                    })}
                  >
                    Notification Preferences
                  </Button>
                </div>
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  <div className="px-6 py-4 flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white">Email Notifications</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Receive notifications via email</p>
                    </div>
                    <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out rounded-full cursor-pointer">
                      <input
                        type="checkbox"
                        id="email-notifications"
                        className="absolute w-0 h-0 opacity-0"
                        checked={emailNotifications}
                        onChange={() => setEmailNotifications(!emailNotifications)}
                      />
                      <label
                        htmlFor="email-notifications"
                        className={`block h-6 overflow-hidden rounded-full cursor-pointer transition-colors duration-200 ease-in-out ${emailNotifications ? 'bg-indigo-600 dark:bg-indigo-500' : 'bg-gray-300 dark:bg-gray-600'}`}
                      >
                        <span
                          className={`block h-6 w-6 rounded-full transform transition-transform duration-200 ease-in-out bg-white shadow-md ${emailNotifications ? 'translate-x-6' : 'translate-x-0'}`}
                        ></span>
                      </label>
                    </div>
                  </div>
                  <div className="px-6 py-4 flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white">Push Notifications</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Receive notifications in the browser</p>
                    </div>
                    <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out rounded-full cursor-pointer">
                      <input
                        type="checkbox"
                        id="push-notifications"
                        className="absolute w-0 h-0 opacity-0"
                        checked={pushNotifications}
                        onChange={() => setPushNotifications(!pushNotifications)}
                      />
                      <label
                        htmlFor="push-notifications"
                        className={`block h-6 overflow-hidden rounded-full cursor-pointer transition-colors duration-200 ease-in-out ${pushNotifications ? 'bg-indigo-600 dark:bg-indigo-500' : 'bg-gray-300 dark:bg-gray-600'}`}
                      >
                        <span
                          className={`block h-6 w-6 rounded-full transform transition-transform duration-200 ease-in-out bg-white shadow-md ${pushNotifications ? 'translate-x-6' : 'translate-x-0'}`}
                        ></span>
                      </label>
                    </div>
                  </div>
                  <div className="px-6 py-4 flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white">SMS Notifications</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Receive notifications via SMS</p>
                    </div>
                    <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out rounded-full cursor-pointer">
                      <input
                        type="checkbox"
                        id="sms-notifications"
                        className="absolute w-0 h-0 opacity-0"
                        checked={smsNotifications}
                        onChange={() => setSmsNotifications(!smsNotifications)}
                      />
                      <label
                        htmlFor="sms-notifications"
                        className={`block h-6 overflow-hidden rounded-full cursor-pointer transition-colors duration-200 ease-in-out ${smsNotifications ? 'bg-indigo-600 dark:bg-indigo-500' : 'bg-gray-300 dark:bg-gray-600'}`}
                      >
                        <span
                          className={`block h-6 w-6 rounded-full transform transition-transform duration-200 ease-in-out bg-white shadow-md ${smsNotifications ? 'translate-x-6' : 'translate-x-0'}`}
                        ></span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-indigo-600 dark:bg-indigo-700 text-white px-4 py-2 rounded-md hover:bg-indigo-700 dark:hover:bg-indigo-800 flex items-center gap-2 transition-colors duration-300"
                >
                  <Save className="h-4 w-4" />
                  Save Preferences
                </motion.button>
              </div>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Security Settings</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage your account security</p>
                  </div>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => openModal('security', { 
                      settings: {
                        twoFactorAuth: twoFactorAuth,
                        sessionTimeout: sessionTimeout,
                        passwordResetInterval: 'never',
                        loginNotifications: true,
                        ipRestriction: false
                      }
                    })}
                  >
                    Advanced Security Settings
                  </Button>
                </div>
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  <div className="px-6 py-4 flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white">Two-Factor Authentication</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Add an extra layer of security to your account</p>
                    </div>
                    <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out rounded-full cursor-pointer">
                      <input
                        type="checkbox"
                        id="two-factor-auth"
                        className="absolute w-0 h-0 opacity-0"
                        checked={twoFactorAuth}
                        onChange={() => setTwoFactorAuth(!twoFactorAuth)}
                      />
                      <label
                        htmlFor="two-factor-auth"
                        className={`block h-6 overflow-hidden rounded-full cursor-pointer transition-colors duration-200 ease-in-out ${twoFactorAuth ? 'bg-indigo-600 dark:bg-indigo-500' : 'bg-gray-300 dark:bg-gray-600'}`}
                      >
                        <span
                          className={`block h-6 w-6 rounded-full transform transition-transform duration-200 ease-in-out bg-white shadow-md ${twoFactorAuth ? 'translate-x-6' : 'translate-x-0'}`}
                        ></span>
                      </label>
                    </div>
                  </div>
                  <div className="px-6 py-4">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Session Timeout</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Automatically log out after a period of inactivity</p>
                    <select
                      value={sessionTimeout}
                      onChange={(e) => setSessionTimeout(e.target.value)}
                      className="border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="15">15 minutes</option>
                      <option value="30">30 minutes</option>
                      <option value="60">1 hour</option>
                      <option value="120">2 hours</option>
                      <option value="never">Never</option>
                    </select>
                  </div>
                  <div className="px-6 py-4">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Change Password</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Update your password regularly for better security</p>
                    <button className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-white px-4 py-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-300">
                      Change Password
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-indigo-600 dark:bg-indigo-700 text-white px-4 py-2 rounded-md hover:bg-indigo-700 dark:hover:bg-indigo-800 flex items-center gap-2 transition-colors duration-300"
                >
                  <Save className="h-4 w-4" />
                  Save Security Settings
                </motion.button>
              </div>
            </div>
          )}

          {/* Appearance Tab */}
          {activeTab === 'appearance' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="space-y-6 p-6"
            >
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Theme</h3>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => {
                      toggleTheme();
                      updatePreferences({ colorScheme: isDarkMode ? 'light' : 'dark' });
                    }}
                    className={`flex items-center justify-center p-3 rounded-lg ${preferences.colorScheme === 'dark' || isDarkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-900 border border-gray-200'}`}
                  >
                    {preferences.colorScheme === 'dark' || isDarkMode ? (
                      <>
                        <Sun className="h-5 w-5 mr-2 text-yellow-300" />
                        Light Mode
                      </>
                    ) : (
                      <>
                        <Moon className="h-5 w-5 mr-2 text-indigo-400" />
                        Dark Mode
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => {
                      updatePreferences({ colorScheme: 'system' });
                    }}
                    className={`flex items-center justify-center p-3 rounded-lg ${preferences.colorScheme === 'system' ? 'bg-blue-600 text-white' : 'bg-white text-gray-900 border border-gray-200'}`}
                  >
                    <Monitor className="h-5 w-5 mr-2 text-blue-300" />
                    System Theme
                  </button>
                </div>
              </div>
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  <div className="px-6 py-4 flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white">Dark Mode</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Switch between light and dark themes</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Sun className={`h-5 w-5 ${!isDarkMode ? 'text-yellow-500' : 'text-gray-400 dark:text-gray-500'}`} />
                      <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out rounded-full cursor-pointer">
                        <input
                          type="checkbox"
                          id="dark-mode"
                          className="absolute w-0 h-0 opacity-0"
                          checked={isDarkMode}
                          onChange={toggleTheme}
                        />
                        <label
                          htmlFor="dark-mode"
                          className={`block h-6 overflow-hidden rounded-full cursor-pointer transition-colors duration-200 ease-in-out ${isDarkMode ? 'bg-indigo-600 dark:bg-indigo-500' : 'bg-gray-300 dark:bg-gray-600'}`}
                        >
                          <span
                            className={`block h-6 w-6 rounded-full transform transition-transform duration-200 ease-in-out bg-white shadow-md ${isDarkMode ? 'translate-x-6' : 'translate-x-0'}`}
                          ></span>
                        </label>
                      </div>
                      <Moon className={`h-5 w-5 ${isDarkMode ? 'text-indigo-400' : 'text-gray-400 dark:text-gray-500'}`} />
                    </div>
                  </div>
                  <div className="px-6 py-4">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Primary Color</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Choose the main color for buttons and highlights</p>
                    <div className="flex flex-wrap gap-2">
                      {colorOptions.map((color) => (
                        <div
                          key={color.value}
                          onClick={() => setPrimaryColor(color.value)}
                          className={`w-8 h-8 rounded-full cursor-pointer flex items-center justify-center bg-${color.value}-600 hover:ring-2 hover:ring-offset-2 hover:ring-${color.value}-600 ${primaryColor === color.value ? 'ring-2 ring-offset-2 ring-gray-400 dark:ring-gray-300' : ''}`}
                        >
                          {primaryColor === color.value && <Check className="h-4 w-4 text-white" />}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="px-6 py-4">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Font Size</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Adjust the text size throughout the application</p>
                    <div className="flex space-x-4">
                      {fontSizeOptions.map((option) => (
                        <button
                          key={option.value}
                          onClick={() => {
                            setFontSize(option.value);
                            updatePreferences({ fontSize: option.value });
                          }}
                          className={`px-4 py-2 rounded-md ${preferences.fontSize === option.value ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 font-medium' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}`}
                        >
                          {option.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

              <div className="flex justify-end space-x-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-indigo-600 dark:bg-indigo-700 text-white px-4 py-2 rounded-md hover:bg-indigo-700 dark:hover:bg-indigo-800 flex items-center gap-2 transition-colors duration-300"
                >
                  <Save className="h-4 w-4" />
                  Save Appearance Settings
                </motion.button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}