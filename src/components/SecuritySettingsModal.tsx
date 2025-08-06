import React, { useState } from 'react';
import { Save, Lock, Shield, Key, Clock, Bell } from 'lucide-react';
import ActionModal from './ActionModal';
import Button from './Button';

interface SecuritySettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (settings: SecuritySettings) => void;
  initialSettings: SecuritySettings;
}

export interface SecuritySettings {
  twoFactorAuth: boolean;
  sessionTimeout: '15' | '30' | '60' | '120';
  passwordResetInterval: 'never' | '30' | '60' | '90';
  loginNotifications: boolean;
  ipRestriction: boolean;
}

export default function SecuritySettingsModal({
  isOpen,
  onClose,
  onSave,
  initialSettings
}: SecuritySettingsModalProps) {
  const [settings, setSettings] = useState<SecuritySettings>(initialSettings);
  const [isLoading, setIsLoading] = useState(false);

  const handleToggle = (key: keyof SecuritySettings) => {
    setSettings({
      ...settings,
      [key]: !settings[key]
    });
  };

  const handleSessionTimeoutChange = (timeout: '15' | '30' | '60' | '120') => {
    setSettings({
      ...settings,
      sessionTimeout: timeout
    });
  };

  const handlePasswordResetChange = (interval: 'never' | '30' | '60' | '90') => {
    setSettings({
      ...settings,
      passwordResetInterval: interval
    });
  };

  const handleSave = () => {
    setIsLoading(true);
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
        Save Security Settings
      </Button>
    </div>
  );

  return (
    <ActionModal
      isOpen={isOpen}
      onClose={onClose}
      title="Security Settings"
      footer={renderFooter()}
      size="md"
    >
      <div className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Account Security</h3>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center">
                  <Shield className="h-5 w-5 text-gray-400 mr-3" />
                  <span className="text-gray-700 dark:text-gray-300 font-medium">Two-Factor Authentication</span>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 ml-8 mt-1">Add an extra layer of security to your account</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={settings.twoFactorAuth}
                  onChange={() => handleToggle('twoFactorAuth')}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center">
                  <Bell className="h-5 w-5 text-gray-400 mr-3" />
                  <span className="text-gray-700 dark:text-gray-300 font-medium">Login Notifications</span>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 ml-8 mt-1">Get notified when someone logs into your account</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={settings.loginNotifications}
                  onChange={() => handleToggle('loginNotifications')}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center">
                  <Lock className="h-5 w-5 text-gray-400 mr-3" />
                  <span className="text-gray-700 dark:text-gray-300 font-medium">IP Restriction</span>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 ml-8 mt-1">Restrict access to trusted IP addresses only</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={settings.ipRestriction}
                  onChange={() => handleToggle('ipRestriction')}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
              </label>
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Session Settings</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Session Timeout (minutes)</label>
            <div className="grid grid-cols-4 gap-2">
              {['15', '30', '60', '120'].map((timeout) => (
                <button
                  key={timeout}
                  type="button"
                  className={`px-4 py-2 rounded-md text-sm ${settings.sessionTimeout === timeout ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300 font-medium' : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'}`}
                  onClick={() => handleSessionTimeoutChange(timeout as any)}
                >
                  {timeout} min
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Your account will be logged out after this period of inactivity</p>
          </div>
        </div>
        
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Password Settings</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Password Reset Interval (days)</label>
            <div className="grid grid-cols-4 gap-2">
              {['never', '30', '60', '90'].map((interval) => (
                <button
                  key={interval}
                  type="button"
                  className={`px-4 py-2 rounded-md text-sm ${settings.passwordResetInterval === interval ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300 font-medium' : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'}`}
                  onClick={() => handlePasswordResetChange(interval as any)}
                >
                  {interval === 'never' ? 'Never' : `${interval} days`}
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">You will be prompted to change your password after this period</p>
          </div>
          
          <div className="mt-6">
            <Button
              variant="outline"
              size="sm"
              className="text-sm"
              icon={<Key className="h-4 w-4" />}
            >
              Change Password
            </Button>
          </div>
        </div>
      </div>
    </ActionModal>
  );
}