import React, { useState } from 'react';
import { Camera, Upload, Check } from 'lucide-react';
import ActionModal from './ActionModal';
import Button from './Button';
import { FileUpload } from './FileUpload';

interface AvatarChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentAvatar?: string;
  onSave: (avatarData: string | File) => void;
}

export default function AvatarChangeModal({
  isOpen,
  onClose,
  currentAvatar,
  onSave
}: AvatarChangeModalProps) {
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileUpload = (files: File[]) => {
    if (files.length === 0) return;
    
    const file = files[0];
    setAvatarFile(file);
    
    // Create a preview
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setAvatarPreview(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    setIsLoading(true);
    // In a real app, you would upload the file to a server here
    setTimeout(() => {
      // Save the avatar data
      if (avatarFile) {
        onSave(avatarFile);
      } else if (avatarPreview) {
        onSave(avatarPreview);
      }
      
      // Update the avatar in the UI immediately
      if (avatarPreview) {
        // Update the avatar in localStorage to persist it
        try {
          localStorage.setItem('userAvatar', avatarPreview);
          // Force a UI refresh by dispatching a custom event
          window.dispatchEvent(new Event('avatarUpdated'));
        } catch (error) {
          console.error('Failed to save avatar to localStorage:', error);
        }
      }
      
      setIsLoading(false);
      onClose();
    }, 1000); // Simulate network request
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
        icon={<Check className="h-4 w-4" />}
        disabled={!avatarPreview && !avatarFile}
      >
        Save Avatar
      </Button>
    </div>
  );

  return (
    <ActionModal
      isOpen={isOpen}
      onClose={onClose}
      title="Change Avatar"
      footer={renderFooter()}
      size="sm"
    >
      <div className="space-y-6">
        <div className="flex justify-center">
          {avatarPreview ? (
            <div className="relative">
              <img 
                src={avatarPreview} 
                alt="Avatar Preview" 
                className="h-32 w-32 rounded-full object-cover border-4 border-indigo-100 dark:border-indigo-900"
              />
              <button
                onClick={() => {
                  setAvatarPreview(null);
                  setAvatarFile(null);
                }}
                className="absolute -top-2 -right-2 bg-white dark:bg-gray-800 rounded-full p-1 shadow-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          ) : currentAvatar ? (
            <div className="h-32 w-32 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-4xl font-bold">
              {currentAvatar}
            </div>
          ) : (
            <div className="h-32 w-32 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
              <Camera className="h-12 w-12 text-gray-400 dark:text-gray-500" />
            </div>
          )}
        </div>
        
        <FileUpload
          onUpload={handleFileUpload}
          acceptedFileTypes={['image/jpeg', 'image/png', 'image/gif']}
          maxSize={5 * 1024 * 1024} // 5MB
          label="Click to upload or drag and drop"
          description="Supports: JPG, PNG, GIF (max. 5MB)"
          icon={<Upload className="w-10 h-10 mx-auto mb-2 text-gray-400" />}
        />
      </div>
    </ActionModal>
  );
}