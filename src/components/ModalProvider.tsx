import React from 'react';
import { useModalStore } from '../stores/useModalStore';

// Import all modal components
import AppearanceSettingsModal from './AppearanceSettingsModal';
import AvatarChangeModal from './AvatarChangeModal';
import ExportModal from './ExportModal';
import GenerateReportModal from './GenerateReportModal';
import ImportModal from './ImportModal';
import InstitutionModal from './InstitutionModal';
import PaymentMethodModal from './PaymentMethodModal';
import PreferencesModal from './PreferencesModal';
import SecuritySettingsModal from './SecuritySettingsModal';
import StatsPreviewModal from './StatsPreviewModal';
import StudentModal from './StudentModal';
import SubscriptionPlanModal from './SubscriptionPlanModal';
import TeacherModal from './TeacherModal';
import UserProfileModal from './UserProfileModal';
import ViewDetailsModal from './ViewDetailsModal';
import ExamDetailsModal from './ExamDetailsModal';

// Default settings/data for modals
const defaultAppearanceSettings = {
  theme: 'system' as const,
  primaryColor: 'indigo' as const,
  fontSize: 'medium' as const,
  compactMode: false
};

const defaultSecuritySettings = {
  twoFactorAuth: false,
  sessionTimeout: '30' as const,
  passwordResetInterval: 'never' as const,
  loginNotifications: true,
  ipRestriction: false
};

const defaultUserPreferences = {
  emailNotifications: true,
  pushNotifications: true,
  smsNotifications: false,
  marketingEmails: false,
  weeklyDigest: true,
  notificationSound: 'default' as const
};

export default function ModalProvider() {
  const { activeModals, modalData, closeModal } = useModalStore();

  // Handlers for modal actions
  const handleSaveAppearance = (settings: any) => {
    console.log('Saving appearance settings:', settings);
    // In a real app, you would save these settings to your state management or API
    closeModal('appearance');
  };

  const handleSaveSecurity = (settings: any) => {
    console.log('Saving security settings:', settings);
    closeModal('security');
  };

  const handleSavePreferences = (preferences: any) => {
    console.log('Saving preferences:', preferences);
    closeModal('preferences');
  };

  const handleSavePaymentMethod = (paymentMethod: any) => {
    console.log('Saving payment method:', paymentMethod);
    closeModal('paymentMethod');
  };

  const handleSaveAvatar = (avatar: any) => {
    console.log('Saving avatar:', avatar);
    closeModal('avatar');
  };

  const handleExport = (exportData: any) => {
    console.log('Exporting data:', exportData);
    closeModal('export');
  };

  const handleGenerateReport = (reportData: any) => {
    console.log('Generating report:', reportData);
    closeModal('generateReport');
  };

  const handleImport = (importData: any) => {
    console.log('Importing data:', importData);
    closeModal('import');
  };

  const handleSaveInstitution = (institution: any) => {
    console.log('Saving institution:', institution);
    closeModal('institution');
  };

  const handleSaveStudent = (student: any) => {
    console.log('Saving student:', student);
    closeModal('student');
  };

  const handleSubscriptionChange = (subscription: any) => {
    console.log('Changing subscription:', subscription);
    closeModal('subscription');
  };

  const handleSaveTeacher = (teacher: any) => {
    console.log('Saving teacher:', teacher);
    closeModal('teacher');
  };

  const handleSaveUserProfile = (profile: any) => {
    console.log('Saving user profile:', profile);
    closeModal('userProfile');
  };

  return (
    <>
      {/* Appearance Settings Modal */}
      <AppearanceSettingsModal
        isOpen={activeModals.appearance}
        onClose={() => closeModal('appearance')}
        onSave={handleSaveAppearance}
        initialSettings={modalData.appearance.settings || defaultAppearanceSettings}
      />

      {/* Avatar Change Modal */}
      <AvatarChangeModal
        isOpen={activeModals.avatar}
        onClose={() => closeModal('avatar')}
        onSave={handleSaveAvatar}
        currentAvatar={modalData.avatar?.currentAvatar || ''}
      />

      {/* Export Modal */}
      <ExportModal
        isOpen={activeModals.export}
        onClose={() => closeModal('export')}
        onExport={handleExport}
        exportOptions={modalData.export.options || {}}
      />

      {/* Generate Report Modal */}
      <GenerateReportModal
        isOpen={activeModals.generateReport}
        onClose={() => closeModal('generateReport')}
        onGenerate={handleGenerateReport}
        student={modalData.generateReport.student || null}
      />

      {/* Import Modal */}
      <ImportModal
        isOpen={activeModals.import}
        onClose={() => closeModal('import')}
        onImport={handleImport}
        importType={modalData.import.type || 'students'}
      />

      {/* Institution Modal */}
      <InstitutionModal
        isOpen={activeModals.institution}
        onClose={() => closeModal('institution')}
        onSave={handleSaveInstitution}
        institution={modalData.institution.data || null}
      />

      {/* Payment Method Modal */}
      <PaymentMethodModal
        isOpen={activeModals.paymentMethod}
        onClose={() => closeModal('paymentMethod')}
        onSave={handleSavePaymentMethod}
        existingPaymentMethods={modalData.paymentMethod.existingMethods || []}
        mode={modalData.paymentMethod.mode || 'add'}
      />

      {/* Preferences Modal */}
      <PreferencesModal
        isOpen={activeModals.preferences}
        onClose={() => closeModal('preferences')}
        onSave={handleSavePreferences}
        initialPreferences={modalData.preferences?.settings || defaultUserPreferences}
      />

      {/* Security Settings Modal */}
      <SecuritySettingsModal
        isOpen={activeModals.security}
        onClose={() => closeModal('security')}
        onSave={handleSaveSecurity}
        initialSettings={modalData.security?.settings || defaultSecuritySettings}
      />

      {/* Stats Preview Modal */}
      <StatsPreviewModal
        isOpen={activeModals.statsPreview}
        onClose={() => closeModal('statsPreview')}
        stats={modalData.statsPreview.stats || {}}
      />

      {/* Student Modal */}
      <StudentModal
        isOpen={activeModals.student}
        onClose={() => closeModal('student')}
        onSave={handleSaveStudent}
        student={modalData.student.data || null}
      />

      {/* Subscription Plan Modal */}
      <SubscriptionPlanModal
        isOpen={activeModals.subscription}
        onClose={() => closeModal('subscription')}
        onConfirm={handleSubscriptionChange}
        selectedPlan={modalData.subscription.selectedPlan || null}
        currentPlan={modalData.subscription.currentPlan || null}
      />

      {/* Teacher Modal */}
      <TeacherModal
        isOpen={activeModals.teacher}
        onClose={() => closeModal('teacher')}
        onSave={handleSaveTeacher}
        teacher={modalData.teacher.data || null}
      />

      {/* User Profile Modal */}
      <UserProfileModal
        isOpen={activeModals.userProfile}
        onClose={() => closeModal('userProfile')}
        onSave={handleSaveUserProfile}
        userData={modalData.userProfile.data || null}
      />

      {/* View Details Modal */}
      <ViewDetailsModal
        isOpen={activeModals.viewDetails}
        onClose={() => closeModal('viewDetails')}
        title={modalData.viewDetails.title || 'Details'}
        data={modalData.viewDetails.data || {}}
        type={modalData.viewDetails.type || 'student'}
        onEdit={modalData.viewDetails.onEdit}
        onDelete={modalData.viewDetails.onDelete}
        onExport={modalData.viewDetails.onExport}
      />

      {/* Exam Details Modal */}
      <ExamDetailsModal
        isOpen={activeModals.examDetails}
        onClose={() => closeModal('examDetails')}
        examData={modalData.examDetails.data || {}}
      />
    </>
  );
}