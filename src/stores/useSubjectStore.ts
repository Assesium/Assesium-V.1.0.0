import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Subject {
  id: string;
  name: string;
  description: string;
  gradeLevel: string[];
  courses: Course[];
  markingSchemes: MarkingScheme[];
}

export interface Course {
  id: string;
  name: string;
  subjectId: string;
  description: string;
  gradeLevel: string;
  year: number;
  topics: Topic[];
  assessments: Assessment[];
}

export interface Topic {
  id: string;
  name: string;
  description: string;
  courseId: string;
  learningObjectives: string[];
}

export interface Assessment {
  id: string;
  name: string;
  type: 'exam' | 'quiz' | 'assignment' | 'project';
  courseId: string;
  topicId?: string;
  description: string;
  duration?: number; // in minutes
  totalMarks: number;
  passingMarks: number;
  questions: Question[];
  markingScheme?: MarkingScheme;
  aiMarkingEnabled: boolean;
}

export interface Question {
  id: string;
  text: string;
  type: 'multiple_choice' | 'short_answer' | 'essay' | 'true_false';
  marks: number;
  options?: string[];
  correctAnswer?: string;
  markingCriteria?: string[];
}

export interface MarkingScheme {
  id: string;
  name: string;
  subjectId: string;
  criteria: MarkingCriterion[];
}

export interface MarkingCriterion {
  id: string;
  description: string;
  maxMarks: number;
  subCriteria?: MarkingCriterion[];
}

interface SubjectState {
  subjects: Subject[];
  courses: Course[];
  topics: Topic[];
  assessments: Assessment[];
  markingSchemes: MarkingScheme[];
  addSubject: (subject: Omit<Subject, 'id'>) => void;
  updateSubject: (id: string, subject: Partial<Subject>) => void;
  deleteSubject: (id: string) => void;
  addCourse: (course: Omit<Course, 'id'>) => void;
  updateCourse: (id: string, course: Partial<Course>) => void;
  deleteCourse: (id: string) => void;
  addTopic: (topic: Omit<Topic, 'id'>) => void;
  updateTopic: (id: string, topic: Partial<Topic>) => void;
  deleteTopic: (id: string) => void;
  addAssessment: (assessment: Omit<Assessment, 'id'>) => void;
  updateAssessment: (id: string, assessment: Partial<Assessment>) => void;
  deleteAssessment: (id: string) => void;
  addMarkingScheme: (scheme: Omit<MarkingScheme, 'id'>) => void;
  updateMarkingScheme: (id: string, scheme: Partial<MarkingScheme>) => void;
  deleteMarkingScheme: (id: string) => void;
}

export const useSubjectStore = create<SubjectState>()(
  persist(
    (set, get) => ({
      subjects: [],
      courses: [],
      topics: [],
      assessments: [],
      markingSchemes: [],

      addSubject: (subject) => {
        const newSubject = { ...subject, id: crypto.randomUUID() };
        set((state) => ({ subjects: [...state.subjects, newSubject] }));
      },

      updateSubject: (id, subject) => {
        set((state) => ({
          subjects: state.subjects.map((s) =>
            s.id === id ? { ...s, ...subject } : s
          ),
        }));
      },

      deleteSubject: (id) => {
        set((state) => ({
          subjects: state.subjects.filter((s) => s.id !== id),
          courses: state.courses.filter((c) => c.subjectId !== id),
        }));
      },

      addCourse: (course) => {
        const newCourse = { ...course, id: crypto.randomUUID() };
        set((state) => ({ courses: [...state.courses, newCourse] }));
      },

      updateCourse: (id, course) => {
        set((state) => ({
          courses: state.courses.map((c) =>
            c.id === id ? { ...c, ...course } : c
          ),
        }));
      },

      deleteCourse: (id) => {
        set((state) => ({
          courses: state.courses.filter((c) => c.id !== id),
          topics: state.topics.filter((t) => t.courseId !== id),
          assessments: state.assessments.filter((a) => a.courseId !== id),
        }));
      },

      addTopic: (topic) => {
        const newTopic = { ...topic, id: crypto.randomUUID() };
        set((state) => ({ topics: [...state.topics, newTopic] }));
      },

      updateTopic: (id, topic) => {
        set((state) => ({
          topics: state.topics.map((t) =>
            t.id === id ? { ...t, ...topic } : t
          ),
        }));
      },

      deleteTopic: (id) => {
        set((state) => ({
          topics: state.topics.filter((t) => t.id !== id),
          assessments: state.assessments.filter((a) => a.topicId !== id),
        }));
      },

      addAssessment: (assessment) => {
        const newAssessment = { ...assessment, id: crypto.randomUUID() };
        set((state) => ({ assessments: [...state.assessments, newAssessment] }));
      },

      updateAssessment: (id, assessment) => {
        set((state) => ({
          assessments: state.assessments.map((a) =>
            a.id === id ? { ...a, ...assessment } : a
          ),
        }));
      },

      deleteAssessment: (id) => {
        set((state) => ({
          assessments: state.assessments.filter((a) => a.id !== id),
        }));
      },

      addMarkingScheme: (scheme) => {
        const newScheme = { ...scheme, id: crypto.randomUUID() };
        set((state) => ({
          markingSchemes: [...state.markingSchemes, newScheme],
        }));
      },

      updateMarkingScheme: (id, scheme) => {
        set((state) => ({
          markingSchemes: state.markingSchemes.map((s) =>
            s.id === id ? { ...s, ...scheme } : s
          ),
        }));
      },

      deleteMarkingScheme: (id) => {
        set((state) => ({
          markingSchemes: state.markingSchemes.filter((s) => s.id !== id),
        }));
      },
    }),
    {
      name: 'subject-storage',
    }
  )
); 