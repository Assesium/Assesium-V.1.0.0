import { useState } from 'react';
import TeacherForm, { TeacherFormData } from './forms/TeacherForm';
import { v4 as uuidv4 } from 'uuid';

interface TeacherModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (teacher: TeacherFormData) => void;
  teacher?: TeacherFormData;
  title?: string;
}

export default function TeacherModal({ isOpen, onClose, onSave, teacher, title }: TeacherModalProps) {
  const handleSave = (teacherData: TeacherFormData) => {
    // If there's no ID, generate one (for new teachers)
    if (!teacherData.id) {
      teacherData.id = uuidv4();
    }
    
    onSave(teacherData);
  };

  return (
    <TeacherForm
      isOpen={isOpen}
      onClose={onClose}
      onSave={handleSave}
      initialData={teacher}
      title={title || (teacher ? 'Edit Teacher' : 'Add Teacher')}
    />
  );
}