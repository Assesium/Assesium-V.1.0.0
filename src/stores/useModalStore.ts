import { create } from 'zustand';

interface ModalState {
  activeModals: Record<string, boolean>;
  modalData: Record<string, any>;
  openModal: (modalName: string, data?: any) => void;
  closeModal: (modalName: string) => void;
}

const defaultModalData = {
  appearance: { settings: {} },
  avatar: { currentAvatar: '' },
  export: { options: {} },
  generateReport: { student: null },
  import: { type: 'students' },
  institution: { data: null },
  paymentMethod: { existingMethods: [], mode: 'add' },
  preferences: { settings: {} },
  security: { settings: {} },
  statsPreview: { stats: {} },
  student: { data: null },
  subscription: { selectedPlan: null, currentPlan: null },
  teacher: { data: null },
  userProfile: { data: null },
  viewDetails: { title: 'Details', data: {}, type: 'student', onEdit: null, onDelete: null, onExport: null },
  examDetails: { data: {} }
};

export const useModalStore = create<ModalState>((set) => ({
  activeModals: {},
  modalData: defaultModalData,
  openModal: (modalName, data) => set((state) => ({
    activeModals: { ...state.activeModals, [modalName]: true },
    modalData: { 
      ...state.modalData, 
      [modalName]: { 
        ...defaultModalData[modalName as keyof typeof defaultModalData], 
        ...data 
      } 
    }
  })),
  closeModal: (modalName) => set((state) => {
    // Create new objects without the specified modal instead of using delete
    const newActiveModals = Object.entries(state.activeModals)
      .filter(([key]) => key !== modalName)
      .reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {});
    
    const newModalData = Object.entries(state.modalData)
      .filter(([key]) => key !== modalName)
      .reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {});
    
    return { activeModals: newActiveModals, modalData: newModalData };
  }),
}));