import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type InstitutionType = 'school' | 'college' | 'university' | 'training_center' | 'tutoring_center';
export type SubscriptionTier = 'free' | 'basic' | 'premium' | 'enterprise';

export interface Institution {
  id: string;
  name: string;
  type: InstitutionType;
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
  };
  contact: {
    email: string;
    phone: string;
    website?: string;
  };
  subscription: {
    tier: SubscriptionTier;
    startDate: string;
    endDate: string;
    autoRenew: boolean;
    status: 'active' | 'suspended' | 'cancelled';
  };
  settings: {
    allowAI: boolean;
    allowCustomMarking: boolean;
    allowParentAccess: boolean;
    allowStudentAccess: boolean;
    defaultMarkingScheme?: string;
    customBranding?: {
      logo?: string;
      colors?: {
        primary: string;
        secondary: string;
      };
    };
  };
  createdAt: string;
  updatedAt: string;
}

export interface Department {
  id: string;
  institutionId: string;
  name: string;
  description: string;
  headId: string;
  subjects: string[];
  teachers: string[];
  students: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Class {
  id: string;
  institutionId: string;
  departmentId: string;
  name: string;
  grade: string;
  academicYear: string;
  teachers: string[];
  students: string[];
  subjects: string[];
  schedule: {
    startDate: string;
    endDate: string;
    sessions: {
      day: string;
      startTime: string;
      endTime: string;
      subject: string;
      teacher: string;
    }[];
  };
  createdAt: string;
  updatedAt: string;
}

interface InstitutionState {
  institutions: Institution[];
  departments: Department[];
  classes: Class[];
  addInstitution: (institution: Omit<Institution, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateInstitution: (id: string, institution: Partial<Institution>) => void;
  deleteInstitution: (id: string) => void;
  addDepartment: (department: Omit<Department, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateDepartment: (id: string, department: Partial<Department>) => void;
  deleteDepartment: (id: string) => void;
  addClass: (class_: Omit<Class, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateClass: (id: string, class_: Partial<Class>) => void;
  deleteClass: (id: string) => void;
  getInstitutionDepartments: (institutionId: string) => Department[];
  getDepartmentClasses: (departmentId: string) => Class[];
  getInstitutionClasses: (institutionId: string) => Class[];
  getInstitutionStats: (institutionId: string) => {
    totalStudents: number;
    totalTeachers: number;
    totalDepartments: number;
    totalClasses: number;
    activeSubscriptions: number;
  };
}

export const useInstitutionStore = create<InstitutionState>()(
  persist(
    (set, get) => ({
      institutions: [],
      departments: [],
      classes: [],

      addInstitution: (institution) => {
        const newInstitution = {
          ...institution,
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        set((state) => ({
          institutions: [...state.institutions, newInstitution],
        }));
      },

      updateInstitution: (id, institution) => {
        set((state) => ({
          institutions: state.institutions.map((i) =>
            i.id === id
              ? { ...i, ...institution, updatedAt: new Date().toISOString() }
              : i
          ),
        }));
      },

      deleteInstitution: (id) => {
        set((state) => ({
          institutions: state.institutions.filter((i) => i.id !== id),
          departments: state.departments.filter((d) => d.institutionId !== id),
          classes: state.classes.filter((c) => c.institutionId !== id),
        }));
      },

      addDepartment: (department) => {
        const newDepartment = {
          ...department,
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        set((state) => ({
          departments: [...state.departments, newDepartment],
        }));
      },

      updateDepartment: (id, department) => {
        set((state) => ({
          departments: state.departments.map((d) =>
            d.id === id
              ? { ...d, ...department, updatedAt: new Date().toISOString() }
              : d
          ),
        }));
      },

      deleteDepartment: (id) => {
        set((state) => ({
          departments: state.departments.filter((d) => d.id !== id),
          classes: state.classes.filter((c) => c.departmentId !== id),
        }));
      },

      addClass: (class_) => {
        const newClass = {
          ...class_,
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        set((state) => ({
          classes: [...state.classes, newClass],
        }));
      },

      updateClass: (id, class_) => {
        set((state) => ({
          classes: state.classes.map((c) =>
            c.id === id
              ? { ...c, ...class_, updatedAt: new Date().toISOString() }
              : c
          ),
        }));
      },

      deleteClass: (id) => {
        set((state) => ({
          classes: state.classes.filter((c) => c.id !== id),
        }));
      },

      getInstitutionDepartments: (institutionId) => {
        return get().departments.filter((d) => d.institutionId === institutionId);
      },

      getDepartmentClasses: (departmentId) => {
        return get().classes.filter((c) => c.departmentId === departmentId);
      },

      getInstitutionClasses: (institutionId) => {
        return get().classes.filter((c) => c.institutionId === institutionId);
      },

      getInstitutionStats: (institutionId) => {
        const departments = get().getInstitutionDepartments(institutionId);
        const classes = get().getInstitutionClasses(institutionId);

        const totalStudents = classes.reduce(
          (acc, c) => acc + c.students.length,
          0
        );

        const totalTeachers = classes.reduce(
          (acc, c) => acc + c.teachers.length,
          0
        );

        return {
          totalStudents,
          totalTeachers,
          totalDepartments: departments.length,
          totalClasses: classes.length,
          activeSubscriptions: get().institutions.filter(
            (i) => i.id === institutionId && i.subscription.status === 'active'
          ).length,
        };
      },
    }),
    {
      name: 'institution-storage',
    }
  )
); 