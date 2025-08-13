import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type NotificationType = 
  | 'assessment_completed'
  | 'assessment_graded'
  | 'grade_updated'
  | 'progress_report'
  | 'announcement'
  | 'message'
  | 'payment'
  | 'subscription'
  | 'system';

export type NotificationPriority = 'low' | 'medium' | 'high';

export interface Notification {
  id: string;
  type: NotificationType;
  priority: NotificationPriority;
  title: string;
  message: string;
  userId: string;
  institutionId?: string;
  classId?: string;
  assessmentId?: string;
  studentId?: string;
  read: boolean;
  action?: {
    type: string;
    data: Record<string, any>;
  };
  createdAt: string;
  expiresAt?: string;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  subject: string;
  content: string;
  attachments?: {
    name: string;
    url: string;
    type: string;
    size: number;
  }[];
  read: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  authorId: string;
  institutionId: string;
  targetAudience: {
    roles: string[];
    departments?: string[];
    classes?: string[];
  };
  attachments?: {
    name: string;
    url: string;
    type: string;
    size: number;
  }[];
  createdAt: string;
  updatedAt: string;
  expiresAt?: string;
}

interface NotificationState {
  notifications: Notification[];
  messages: Message[];
  announcements: Announcement[];
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt'>) => void;
  updateNotification: (id: string, notification: Partial<Notification>) => void;
  deleteNotification: (id: string) => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: (userId: string) => void;
  addMessage: (message: Omit<Message, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateMessage: (id: string, message: Partial<Message>) => void;
  deleteMessage: (id: string) => void;
  markMessageAsRead: (id: string) => void;
  addAnnouncement: (announcement: Omit<Announcement, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateAnnouncement: (id: string, announcement: Partial<Announcement>) => void;
  deleteAnnouncement: (id: string) => void;
  getUnreadNotifications: (userId: string) => Notification[];
  getUnreadMessages: (userId: string) => Message[];
  getActiveAnnouncements: (institutionId: string) => Announcement[];
  getNotificationStats: (userId: string) => {
    total: number;
    unread: number;
    byType: Record<NotificationType, number>;
    byPriority: Record<NotificationPriority, number>;
  };
}

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set, get) => ({
      notifications: [],
      messages: [],
      announcements: [],

      addNotification: (notification) => {
        const newNotification = {
          ...notification,
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
          read: false,
        };
        set((state) => ({
          notifications: [...state.notifications, newNotification],
        }));
      },

      updateNotification: (id, notification) => {
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, ...notification } : n
          ),
        }));
      },

      deleteNotification: (id) => {
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id),
        }));
      },

      markNotificationAsRead: (id) => {
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
          ),
        }));
      },

      markAllNotificationsAsRead: (userId) => {
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.userId === userId ? { ...n, read: true } : n
          ),
        }));
      },

      addMessage: (message) => {
        const newMessage = {
          ...message,
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          read: false,
        };
        set((state) => ({
          messages: [...state.messages, newMessage],
        }));
      },

      updateMessage: (id, message) => {
        set((state) => ({
          messages: state.messages.map((m) =>
            m.id === id
              ? { ...m, ...message, updatedAt: new Date().toISOString() }
              : m
          ),
        }));
      },

      deleteMessage: (id) => {
        set((state) => ({
          messages: state.messages.filter((m) => m.id !== id),
        }));
      },

      markMessageAsRead: (id) => {
        set((state) => ({
          messages: state.messages.map((m) =>
            m.id === id ? { ...m, read: true } : m
          ),
        }));
      },

      addAnnouncement: (announcement) => {
        const newAnnouncement = {
          ...announcement,
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        set((state) => ({
          announcements: [...state.announcements, newAnnouncement],
        }));
      },

      updateAnnouncement: (id, announcement) => {
        set((state) => ({
          announcements: state.announcements.map((a) =>
            a.id === id
              ? { ...a, ...announcement, updatedAt: new Date().toISOString() }
              : a
          ),
        }));
      },

      deleteAnnouncement: (id) => {
        set((state) => ({
          announcements: state.announcements.filter((a) => a.id !== id),
        }));
      },

      getUnreadNotifications: (userId) => {
        return get().notifications.filter(
          (n) => n.userId === userId && !n.read
        );
      },

      getUnreadMessages: (userId) => {
        return get().messages.filter(
          (m) => m.receiverId === userId && !m.read
        );
      },

      getActiveAnnouncements: (institutionId) => {
        const now = new Date().toISOString();
        return get().announcements.filter(
          (a) =>
            a.institutionId === institutionId &&
            (!a.expiresAt || new Date(a.expiresAt) > new Date(now))
        );
      },

      getNotificationStats: (userId) => {
        const userNotifications = get().notifications.filter(
          (n) => n.userId === userId
        );

        const byType = userNotifications.reduce(
          (acc, n) => ({
            ...acc,
            [n.type]: (acc[n.type] || 0) + 1,
          }),
          {} as Record<NotificationType, number>
        );

        const byPriority = userNotifications.reduce(
          (acc, n) => ({
            ...acc,
            [n.priority]: (acc[n.priority] || 0) + 1,
          }),
          {} as Record<NotificationPriority, number>
        );

        return {
          total: userNotifications.length,
          unread: userNotifications.filter((n) => !n.read).length,
          byType,
          byPriority,
        };
      },
    }),
    {
      name: 'notification-storage',
    }
  )
); 