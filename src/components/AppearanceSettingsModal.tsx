import React, { useState, useEffect } from 'react';
import { Save, Palette, Type, Layout, Sun, Moon, Monitor } from 'lucide-react';
import ActionModal from './ActionModal';
import Button from './Button';
import { useThemeStore } from '../stores/useThemeStore';
import { useUIStore } from '../stores/useUIStore';

interface AppearanceSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (settings: AppearanceSettings) => void;
  initialSettings: AppearanceSettings;
}

export interface AppearanceSettings {
  theme: 'light' | 'dark' | 'system';
  primaryColor: 'indigo' | 'blue' | 'purple' | 'pink' | 'teal';
  fontSize: 'small' | 'medium' | 'large';
  compactMode: boolean;
}

export default function AppearanceSettingsModal({
  isOpen,
  onClose,
  onSave,
  initialSettings
}: AppearanceSettingsModalProps) {
  const { isDarkMode, toggleTheme } = useThemeStore();
  const { preferences, updatePreferences } = useUIStore();
  const [settings, setSettings] = useState<AppearanceSettings>({
    ...initialSettings,
    theme: preferences.colorScheme || initialSettings.theme,
    fontSize: preferences.fontSize || initialSettings.fontSize
  });
  const [isLoading, setIsLoading] = useState(false);
  
  // Update settings when preferences change
  useEffect(() => {
    setSettings(prev => ({
      ...prev,
      theme: preferences.colorScheme,
      fontSize: preferences.fontSize
    }));
  }, [preferences.colorScheme, preferences.fontSize]);

  const handleThemeChange = (theme: 'light' | 'dark' | 'system') => {
    setSettings({
      ...settings,
      theme
    });
  };

  const handleColorChange = (primaryColor: 'indigo' | 'blue' | 'purple' | 'pink' | 'teal') => {
    setSettings({
      ...settings,
      primaryColor
    });
  };

  const handleFontSizeChange = (fontSize: 'small' | 'medium' | 'large') => {
    setSettings({
      ...settings,
      fontSize
    });
  };

  const handleToggleCompactMode = () => {
    setSettings({
      ...settings,
      compactMode: !settings.compactMode
    });
  };

  const handleSave = () => {
    setIsLoading(true);
    
    // Update both theme stores for consistency
    updatePreferences({
      colorScheme: settings.theme,
      fontSize: settings.fontSize
    });
    
    // Update isDarkMode in ThemeStore to match
    if (settings.theme === 'dark' && !isDarkMode) {
      toggleTheme();
    } else if (settings.theme === 'light' && isDarkMode) {
      toggleTheme();
    } else if (settings.theme === 'system') {
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (systemPrefersDark !== isDarkMode) {
        toggleTheme();
      }
    }
    
    // Simulate API call
    setTimeout(() => {
      onSave(settings);
      setIsLoading(false);
      onClose();
    }, 1000);
  };

  const renderFooter = () => (
    <div className="flex justify-end space-x-3">
      <Button 
        variant="outline" 
        onClick={onClose}
      >
        Cancel
      </Button>
      <Button 
        variant="primary" 
        onClick={handleSave}
        isLoading={isLoading}
        icon={<Save className="h-4 w-4" />}
      >
        Save Appearance Settings
      </Button>
    </div>
  );

  const colorOptions = [
    { name: 'Indigo', value: 'indigo', class: 'bg-indigo-500' },
    { name: 'Blue', value: 'blue', class: 'bg-blue-500' },
    { name: 'Purple', value: 'purple', class: 'bg-purple-500' },
    { name: 'Pink', value: 'pink', class: 'bg-pink-500' },
    { name: 'Teal', value: 'teal', class: 'bg-teal-500' }
  ];

  return (
    <ActionModal
      isOpen={isOpen}
      onClose={onClose}
      title="Appearance Settings"
      footer={renderFooter()}
      size="md"
    >
      <div className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Theme</h3>
          
          <div className="grid grid-cols-3 gap-3">
            <button
              type="button"
              className={`border rounded-lg p-3 flex flex-col items-center space-y-2 ${settings.theme === 'light' ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20' : 'border-gray-200 dark:border-gray-700'}`}
              onClick={() => handleThemeChange('light')}
            >
              <div className="w-full h-12 bg-white border border-gray-200 rounded-md shadow-sm"></div>
              <span className="text-sm font-medium text-gray-900 dark:text-white">Light</span>
            </button>
            
            <button
              type="button"
              className={`border rounded-lg p-3 flex flex-col items-center space-y-2 ${settings.theme === 'dark' ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20' : 'border-gray-200 dark:border-gray-700'}`}
              onClick={() => handleThemeChange('dark')}
            >
              <div className="w-full h-12 bg-gray-900 border border-gray-700 rounded-md shadow-sm"></div>
              <span className="text-sm font-medium text-gray-900 dark:text-white">Dark</span>
            </button>
            
            <button
              type="button"
              className={`border rounded-lg p-3 flex flex-col items-center space-y-2 ${settings.theme === 'system' ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20' : 'border-gray-200 dark:border-gray-700'}`}
              onClick={() => handleThemeChange('system')}
            >
              <div className="w-full h-12 bg-gradient-to-r from-white to-gray-900 border border-gray-200 rounded-md shadow-sm"></div>
              <span className="text-sm font-medium text-gray-900 dark:text-white">System</span>
            </button>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Primary Color</h3>
            <Palette className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          </div>
          
          <div className="flex flex-wrap gap-3">
            {colorOptions.map((color) => (
              <button
                key={color.value}
                type="button"
                className={`w-8 h-8 rounded-full ${color.class} ${settings.primaryColor === color.value ? 'ring-2 ring-offset-2 ring-gray-400 dark:ring-gray-600' : ''}`}
                onClick={() => handleColorChange(color.value as any)}
                title={color.name}
              ></button>
            ))}
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Font Size</h3>
            <Type className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              type="button"
              className={`px-4 py-2 rounded-md ${settings.fontSize === 'small' ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300' : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'}`}
              onClick={() => handleFontSizeChange('small')}
            >
              <span className="text-xs">Small</span>
            </button>
            
            <button
              type="button"
              className={`px-4 py-2 rounded-md ${settings.fontSize === 'medium' ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300' : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'}`}
              onClick={() => handleFontSizeChange('medium')}
            >
              <span className="text-sm">Medium</span>
            </button>
            
            <button
              type="button"
              className={`px-4 py-2 rounded-md ${settings.fontSize === 'large' ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300' : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'}`}
              onClick={() => handleFontSizeChange('large')}
            >
              <span className="text-base">Large</span>
            </button>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Compact Mode</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Reduce spacing for a more compact layout</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={settings.compactMode}
                onChange={handleToggleCompactMode}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
            </label>
          </div>
        </div>
      </div>
    </ActionModal>
  );
}