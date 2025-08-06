import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type GradeLevel = 'primary' | 'secondary' | 'tertiary' | 'advanced';
export type PerformanceLevel = 'excellent' | 'good' | 'satisfactory' | 'needs_improvement';

export interface Student {
  id: string;
  name: string;
  email: string;
  gradeLevel: GradeLevel;
  grade: string;
  institutionId: string;
  subjects: string[];
  parentId?: string;
  teacherIds: string[];
  createdAt: string;
  updatedAt: string;
}

export interface StudentProgress {
  id: string;
  studentId: string;
  subjectId: string;
  courseId: string;
  topicId: string;
  completionPercentage: number;
  lastAccessed: string;
  timeSpent: number; // in minutes
  assessmentsCompleted: number;
  averageScore: number;
  performanceLevel: PerformanceLevel;
  strengths: string[];
  weaknesses: string[];
  learningPath: string[];
  nextSteps: string[];
  metadata?: Record<string, any>;
}

export interface AssessmentResult {
  id: string;
  studentId: string;
  assessmentId: string;
  score: number;
  maxScore: number;
  percentage: number;
  feedback: string;
  markedBy: string; // teacherId or 'ai'
  markedAt: string;
  timeTaken: number; // in minutes
  attempts: number;
  status: 'completed' | 'in_progress' | 'submitted';
  answers: Record<string, any>;
  aiAnalysis?: {
    confidence: number;
    suggestions: string[];
    resources: string[];
  };
}

interface StudentState {
  students: Student[];
  progress: StudentProgress[];
  assessmentResults: AssessmentResult[];
  addStudent: (student: Omit<Student, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateStudent: (id: string, student: Partial<Student>) => void;
  deleteStudent: (id: string) => void;
  addProgress: (progress: Omit<StudentProgress, 'id'>) => void;
  updateProgress: (id: string, progress: Partial<StudentProgress>) => void;
  addAssessmentResult: (result: Omit<AssessmentResult, 'id'>) => void;
  updateAssessmentResult: (id: string, result: Partial<AssessmentResult>) => void;
  getStudentProgress: (studentId: string, subjectId: string) => StudentProgress | undefined;
  getStudentAssessmentResults: (studentId: string) => AssessmentResult[];
  getSubjectPerformance: (studentId: string, subjectId: string) => {
    averageScore: number;
    completionRate: number;
    timeSpent: number;
    performanceLevel: PerformanceLevel;
  };
  getLearningAnalytics: (studentId: string) => {
    overallProgress: number;
    subjectProgress: Record<string, number>;
    strengths: string[];
    weaknesses: string[];
    recommendedTopics: string[];
  };
}

export const useStudentStore = create<StudentState>()(
  persist(
    (set, get) => ({
      students: [],
      progress: [],
      assessmentResults: [],

      addStudent: (student) => {
        const newStudent = {
          ...student,
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        set((state) => ({ students: [...state.students, newStudent] }));
      },

      updateStudent: (id, student) => {
        set((state) => ({
          students: state.students.map((s) =>
            s.id === id
              ? { ...s, ...student, updatedAt: new Date().toISOString() }
              : s
          ),
        }));
      },

      deleteStudent: (id) => {
        set((state) => ({
          students: state.students.filter((s) => s.id !== id),
          progress: state.progress.filter((p) => p.studentId !== id),
          assessmentResults: state.assessmentResults.filter(
            (r) => r.studentId !== id
          ),
        }));
      },

      addProgress: (progress) => {
        const newProgress = { ...progress, id: crypto.randomUUID() };
        set((state) => ({ progress: [...state.progress, newProgress] }));
      },

      updateProgress: (id, progress) => {
        set((state) => ({
          progress: state.progress.map((p) =>
            p.id === id ? { ...p, ...progress } : p
          ),
        }));
      },

      addAssessmentResult: (result) => {
        const newResult = { ...result, id: crypto.randomUUID() };
        set((state) => ({
          assessmentResults: [...state.assessmentResults, newResult],
        }));
      },

      updateAssessmentResult: (id, result) => {
        set((state) => ({
          assessmentResults: state.assessmentResults.map((r) =>
            r.id === id ? { ...r, ...result } : r
          ),
        }));
      },

      getStudentProgress: (studentId, subjectId) => {
        return get().progress.find(
          (p) => p.studentId === studentId && p.subjectId === subjectId
        );
      },

      getStudentAssessmentResults: (studentId) => {
        return get().assessmentResults
          .filter((r) => r.studentId === studentId)
          .sort((a, b) => new Date(b.markedAt).getTime() - new Date(a.markedAt).getTime());
      },

      getSubjectPerformance: (studentId, subjectId) => {
        const results = get().assessmentResults.filter(
          (r) => r.studentId === studentId
        );
        const progress = get().progress.find(
          (p) => p.studentId === studentId && p.subjectId === subjectId
        );

        const averageScore =
          results.reduce((acc, r) => acc + r.percentage, 0) / results.length || 0;

        return {
          averageScore,
          completionRate: progress?.completionPercentage || 0,
          timeSpent: progress?.timeSpent || 0,
          performanceLevel: progress?.performanceLevel || 'needs_improvement',
        };
      },

      getLearningAnalytics: (studentId) => {
        const progress = get().progress.filter((p) => p.studentId === studentId);
        const results = get().assessmentResults.filter(
          (r) => r.studentId === studentId
        );

        const overallProgress =
          progress.reduce((acc, p) => acc + p.completionPercentage, 0) /
          progress.length || 0;

        const subjectProgress = progress.reduce(
          (acc, p) => ({
            ...acc,
            [p.subjectId]: p.completionPercentage,
          }),
          {} as Record<string, number>
        );

        const strengths = progress.reduce(
          (acc, p) => [...acc, ...p.strengths],
          [] as string[]
        );

        const weaknesses = progress.reduce(
          (acc, p) => [...acc, ...p.weaknesses],
          [] as string[]
        );

        const recommendedTopics = progress.reduce(
          (acc, p) => [...acc, ...p.nextSteps],
          [] as string[]
        );

        return {
          overallProgress,
          subjectProgress,
          strengths: [...new Set(strengths)],
          weaknesses: [...new Set(weaknesses)],
          recommendedTopics: [...new Set(recommendedTopics)],
        };
      },
    }),
    {
      name: 'student-storage',
    }
  )
); 