import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type AIModel = 'gpt-4' | 'gpt-3.5-turbo' | 'claude-3-opus' | 'claude-3-sonnet';
export type MarkingMode = 'ai_only' | 'scheme_only' | 'hybrid';
export type ProcessingStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'in_review';

export interface AIModelConfig {
  id: string;
  model: AIModel;
  temperature: number;
  maxTokens: number;
  topP: number;
  frequencyPenalty: number;
  presencePenalty: number;
}

export interface MarkingConfig {
  id: string;
  mode: MarkingMode;
  modelConfig: AIModelConfig;
  markingSchemeId?: string;
  customInstructions?: string;
  feedbackLevel: 'basic' | 'detailed' | 'comprehensive';
  includeSuggestions: boolean;
  includeResources: boolean;
}

export interface AIProcessingResult {
  id: string;
  assessmentId: string;
  studentId: string;
  status: ProcessingStatus;
  score: number;
  feedback: string;
  suggestions?: string[];
  resources?: string[];
  processingTime: number;
  modelUsed: AIModel;
  confidence: number;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface ProcessingHistoryEntry {
  id: string;
  institution: string;
  subject: string;
  status: ProcessingStatus;
  papers: number;
  progress: number;
  date: string;
  markingMethod: 'scheme' | 'llm';
}

interface AIState {
  modelConfigs: AIModelConfig[];
  markingConfigs: MarkingConfig[];
  processingResults: AIProcessingResult[];
  currentProcessing: Record<string, ProcessingStatus>;
  history: ProcessingHistoryEntry[];
  addModelConfig: (config: Omit<AIModelConfig, 'id'>) => void;
  updateModelConfig: (id: string, config: Partial<AIModelConfig>) => void;
  deleteModelConfig: (id: string) => void;
  addMarkingConfig: (config: Omit<MarkingConfig, 'id'>) => void;
  updateMarkingConfig: (id: string, config: Partial<MarkingConfig>) => void;
  deleteMarkingConfig: (id: string) => void;
  startProcessing: (assessmentId: string, studentId: string) => void;
  updateProcessingStatus: (assessmentId: string, status: ProcessingStatus) => void;
  addProcessingResult: (result: Omit<AIProcessingResult, 'id'>) => void;
  updateProcessingResult: (id: string, result: Partial<AIProcessingResult>) => void;
  getProcessingResult: (assessmentId: string, studentId: string) => AIProcessingResult | undefined;
  getProcessingStatus: (assessmentId: string) => ProcessingStatus | undefined;
  getProcessingHistory: (assessmentId: string) => AIProcessingResult[];
  addToHistory: (entry: Omit<ProcessingHistoryEntry, 'id' | 'date'>) => void;
  updateHistoryEntry: (id: string, entry: Partial<ProcessingHistoryEntry>) => void;
  deleteHistoryEntry: (id: string) => void;
}

export const useAIStore = create<AIState>()(
  persist(
    (set, get) => ({
      modelConfigs: [],
      markingConfigs: [],
      processingResults: [],
      currentProcessing: {},
      history: [],

      addModelConfig: (config) => {
        const newConfig = { ...config, id: crypto.randomUUID() };
        set((state) => ({
          modelConfigs: [...state.modelConfigs, newConfig],
        }));
      },

      updateModelConfig: (id, config) => {
        set((state) => ({
          modelConfigs: state.modelConfigs.map((c) =>
            c.id === id ? { ...c, ...config } : c
          ),
        }));
      },

      deleteModelConfig: (id) => {
        set((state) => ({
          modelConfigs: state.modelConfigs.filter((c) => c.id !== id),
        }));
      },

      addMarkingConfig: (config) => {
        const newConfig = { ...config, id: crypto.randomUUID() };
        set((state) => ({
          markingConfigs: [...state.markingConfigs, newConfig],
        }));
      },

      updateMarkingConfig: (id, config) => {
        set((state) => ({
          markingConfigs: state.markingConfigs.map((c) =>
            c.id === id ? { ...c, ...config } : c
          ),
        }));
      },

      deleteMarkingConfig: (id) => {
        set((state) => ({
          markingConfigs: state.markingConfigs.filter((c) => c.id !== id),
        }));
      },

      startProcessing: (assessmentId, studentId) => {
        set((state) => ({
          currentProcessing: {
            ...state.currentProcessing,
            [`${assessmentId}-${studentId}`]: 'pending',
          },
        }));
      },

      updateProcessingStatus: (assessmentId, status) => {
        set((state) => ({
          currentProcessing: {
            ...state.currentProcessing,
            [assessmentId]: status,
          },
        }));
      },

      addProcessingResult: (result) => {
        const newResult = { ...result, id: crypto.randomUUID() };
        set((state) => ({
          processingResults: [...state.processingResults, newResult],
          currentProcessing: {
            ...state.currentProcessing,
            [`${result.assessmentId}-${result.studentId}`]: 'completed',
          },
        }));
      },

      updateProcessingResult: (id, result) => {
        set((state) => ({
          processingResults: state.processingResults.map((r) =>
            r.id === id ? { ...r, ...result } : r
          ),
        }));
      },

      getProcessingResult: (assessmentId, studentId) => {
        return get().processingResults.find(
          (r) => r.assessmentId === assessmentId && r.studentId === studentId
        );
      },

      getProcessingStatus: (assessmentId) => {
        return get().currentProcessing[assessmentId];
      },

      getProcessingHistory: (assessmentId) => {
        return get().processingResults
          .filter((r) => r.assessmentId === assessmentId)
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      },

      addToHistory: (entry) => {
        const newEntry: ProcessingHistoryEntry = {
          ...entry,
          id: crypto.randomUUID(),
          date: new Date().toISOString(),
        };
        set((state) => ({
          history: [...state.history, newEntry],
        }));
      },

      updateHistoryEntry: (id, entry) => {
        set((state) => ({
          history: state.history.map((h) =>
            h.id === id ? { ...h, ...entry } : h
          ),
        }));
      },

      deleteHistoryEntry: (id) => {
        set((state) => ({
          history: state.history.filter((h) => h.id !== id),
        }));
      },
    }),
    {
      name: 'ai-storage',
    }
  )
);