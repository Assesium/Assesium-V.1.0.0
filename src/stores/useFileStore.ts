import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type FileType = 
  | 'document'
  | 'image'
  | 'video'
  | 'audio'
  | 'spreadsheet'
  | 'presentation'
  | 'pdf'
  | 'archive'
  | 'other';

export type FileStatus = 'uploading' | 'processing' | 'ready' | 'error' | 'deleted';

export interface FileMetadata {
  id: string;
  name: string;
  type: FileType;
  mimeType: string;
  size: number;
  url: string;
  thumbnailUrl?: string;
  status: FileStatus;
  uploadedBy: string;
  institutionId: string;
  classId?: string;
  subjectId?: string;
  assessmentId?: string;
  studentId?: string;
  tags: string[];
  description?: string;
  createdAt: string;
  updatedAt: string;
  expiresAt?: string;
  processingMetadata?: {
    duration?: number;
    dimensions?: {
      width: number;
      height: number;
    };
    pages?: number;
    bitrate?: number;
    format?: string;
  };
}

export interface UploadProgress {
  fileId: string;
  progress: number;
  speed: number;
  status: 'uploading' | 'processing' | 'completed' | 'error';
  error?: string;
  startedAt: string;
  completedAt?: string;
}

interface FileState {
  files: FileMetadata[];
  uploadProgress: Record<string, UploadProgress>;
  addFile: (file: Omit<FileMetadata, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateFile: (id: string, file: Partial<FileMetadata>) => void;
  deleteFile: (id: string) => void;
  updateUploadProgress: (fileId: string, progress: Partial<UploadProgress>) => void;
  getFilesByType: (type: FileType, institutionId: string) => FileMetadata[];
  getFilesByAssessment: (assessmentId: string) => FileMetadata[];
  getFilesByStudent: (studentId: string) => FileMetadata[];
  getFileStats: (institutionId: string) => {
    total: number;
    byType: Record<FileType, number>;
    totalSize: number;
    recentFiles: FileMetadata[];
  };
}

export const useFileStore = create<FileState>()(
  persist(
    (set, get) => ({
      files: [],
      uploadProgress: {},

      addFile: (file) => {
        const newFile: FileMetadata = {
          ...file,
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          status: 'uploading' as FileStatus,
        };
        set((state) => ({
          files: [...state.files, newFile],
          uploadProgress: {
            ...state.uploadProgress,
            [newFile.id]: {
              fileId: newFile.id,
              progress: 0,
              speed: 0,
              status: 'uploading',
              startedAt: new Date().toISOString(),
            },
          },
        }));
      },

      updateFile: (id, file) => {
        set((state) => ({
          files: state.files.map((f) =>
            f.id === id
              ? { ...f, ...file, updatedAt: new Date().toISOString() }
              : f
          ),
        }));
      },

      deleteFile: (id) => {
        set((state) => ({
          files: state.files.filter((f) => f.id !== id),
          uploadProgress: Object.fromEntries(
            Object.entries(state.uploadProgress).filter(([key]) => key !== id)
          ),
        }));
      },

      updateUploadProgress: (fileId, progress) => {
        set((state) => ({
          uploadProgress: {
            ...state.uploadProgress,
            [fileId]: {
              ...state.uploadProgress[fileId],
              ...progress,
              completedAt: progress.status === 'completed' ? new Date().toISOString() : undefined,
            },
          },
        }));
      },

      getFilesByType: (type, institutionId) => {
        return get().files.filter(
          (f) => f.type === type && f.institutionId === institutionId
        );
      },

      getFilesByAssessment: (assessmentId) => {
        return get().files.filter((f) => f.assessmentId === assessmentId);
      },

      getFilesByStudent: (studentId) => {
        return get().files.filter((f) => f.studentId === studentId);
      },

      getFileStats: (institutionId) => {
        const institutionFiles = get().files.filter(
          (f) => f.institutionId === institutionId
        );

        const byType = institutionFiles.reduce(
          (acc, f) => ({
            ...acc,
            [f.type]: (acc[f.type] || 0) + 1,
          }),
          {} as Record<FileType, number>
        );

        const totalSize = institutionFiles.reduce((acc, f) => acc + f.size, 0);

        const recentFiles = institutionFiles
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 5);

        return {
          total: institutionFiles.length,
          byType,
          totalSize,
          recentFiles,
        };
      },
    }),
    {
      name: 'file-storage',
    }
  )
); 