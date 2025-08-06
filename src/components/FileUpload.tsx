import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText } from 'lucide-react';
import toast from 'react-hot-toast';

interface FileUploadProps {
  onUpload: (files: File[]) => void;
  acceptedFileTypes?: string[];
  maxSize?: number;
  label?: string;
  description?: string;
  icon?: React.ReactNode;
}

export function FileUpload({ 
  onUpload, 
  acceptedFileTypes = ['image/png', 'image/jpeg', 'application/pdf'],
  maxSize = 10 * 1024 * 1024,
  label = 'Click to upload or drag and drop',
  description = 'Supports: PNG, JPG, PDF (max. 10MB per file)',
  icon = <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
}: FileUploadProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const validFiles = acceptedFiles.filter(
      file => 
        acceptedFileTypes.includes(file.type) && 
        file.size <= maxSize
    );

    if (validFiles.length !== acceptedFiles.length) {
      toast.error('Some files were rejected. Please check the file types and sizes.');
    }

    if (validFiles.length > 0) {
      onUpload(validFiles);
      toast.success(`${validFiles.length} files uploaded successfully`);
    }
  }, [onUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/png': ['.png'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt']
    },
    maxSize: maxSize
  });

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
        ${isDragActive ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-primary'}`}
    >
      <input {...getInputProps()} />
      {icon}
      <p className="text-lg font-semibold">
        {isDragActive ? 'Drop files here' : label}
      </p>
      <p className="text-sm text-gray-500 mt-2">
        {description}
      </p>
    </div>
  );
}