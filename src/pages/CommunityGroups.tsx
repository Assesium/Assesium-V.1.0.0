import React, { useState } from 'react';
import { 
  MessageCircle, 
  Users, 
  Calendar, 
  Bell, 
  Search, 
  Plus,
  Send,
  Paperclip,
  MoreVertical,
  Hash,
  Globe,
  Lock,
  CheckSquare,
  Clock,
  User,
  School,
  MessageSquare,
  Phone,
  Video,
  Settings,
  Star,
  Pin,
  X,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

const CommunityGroups: React.FC = () => {
  const [activeTab, setActiveTab] = useState('messages');
  const [selectedChat, setSelectedChat] = useState(null);
  const [messageText, setMessageText] = useState('');
  const [showCreateGroupModal, setShowCreateGroupModal] = useState(false);
  const [showJoinGroupModal, setShowJoinGroupModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);
  const [notifications, setNotifications] = useState([]);
  
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'Dr. Sarah Wilson',
      content: 'Thanks for sharing the new curriculum guidelines!',
      timestamp: '10:30 AM',
      isOwn: false
    },
    {
      id: 2,
      sender: 'You',
      content: 'You\'re welcome! Let me know if you need any clarification.',
      timestamp: '10:32 AM',
      isOwn: true
    }
  ]);
  
  const [newGroup, setNewGroup] = useState({
    name: '',
    description: '',
    privacy: 'public',
    type: 'subject'
  });
  
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: 'medium',
    assignTo: ''
  });
  
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: '',
    content: '',
    pinned: false
  });

  const handleSendMessage = () => {
    if (messageText.trim()) {
      const newMessage = {
        id: messages.length + 1,
        sender: 'You',
        content: messageText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isOwn: true
      };
      setMessages([...messages, newMessage]);
      setMessageText('');
      setNotifications([...notifications, {
        id: Date.now(),
        type: 'success',
        message: 'Message sent successfully!',
        timestamp: new Date().toLocaleTimeString()
      }]);
    }
  };

  const handlePhoneCall = () => {
    setNotifications([...notifications, {
      id: Date.now(),
      type: 'info',
      message: 'Initiating phone call...',
      timestamp: new Date().toLocaleTimeString()
    }]);
  };

  const handleVideoCall = () => {
    setNotifications([...notifications, {
      id: Date.now(),
      type: 'info',
      message: 'Starting video call...',
      timestamp: new Date().toLocaleTimeString()
    }]);
  };

  const handleSettings = () => {
    setNotifications([...notifications, {
      id: Date.now(),
      type: 'info',
      message: 'Opening chat settings...',
      timestamp: new Date().toLocaleTimeString()
    }]);
  };
  
  const handleCreateGroup = (e: React.FormEvent) => {
    e.preventDefault();
    setNotifications([...notifications, {
      id: Date.now(),
      type: 'success',
      message: `Group "${newGroup.name}" created successfully!`,
      timestamp: new Date().toLocaleTimeString()
    }]);
    setNewGroup({
      name: '',
      description: '',
      privacy: 'public',
      type: 'subject'
    });
    setShowCreateGroupModal(false);
  };
  
  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    setNotifications([...notifications, {
      id: Date.now(),
      type: 'success',
      message: `Task "${newTask.title}" created successfully!`,
      timestamp: new Date().toLocaleTimeString()
    }]);
    setNewTask({
      title: '',
      description: '',
      dueDate: '',
      priority: 'medium',
      assignTo: ''
    });
    setShowTaskModal(false);
  };
  
  const handleCreateAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    setNotifications([...notifications, {
      id: Date.now(),
      type: 'success',
      message: `Announcement "${newAnnouncement.title}" posted successfully!`,
      timestamp: new Date().toLocaleTimeString()
    }]);
    setNewAnnouncement({
      title: '',
      content: '',
      pinned: false
    });
    setShowAnnouncementModal(false);
  };
  
  const dismissNotification = (id: number) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const groups = [
    {
      id: 1,
      name: 'Mathematics Teachers',
      type: 'subject',
      members: 45,
      lastActivity: '2 hours ago',
      unread: 3,
      avatar: 'MT',
      description: 'Discussion group for mathematics educators',
      privacy: 'public'
    },
    {
      id: 2,
      name: 'Cambridge High School',
      type: 'institution',
      members: 120,
      lastActivity: '30 minutes ago',
      unread: 8,
      avatar: 'CHS',
      description: 'Official school communication channel',
      privacy: 'private'
    },
    {
      id: 3,
      name: 'Science Department',
      type: 'department',
      members: 28,
      lastActivity: '1 hour ago',
      unread: 0,
      avatar: 'SD',
      description: 'Science teachers collaboration space',
      privacy: 'private'
    },
    {
      id: 4,
      name: 'Parent-Teacher Forum',
      type: 'forum',
      members: 89,
      lastActivity: '45 minutes ago',
      unread: 12,
      avatar: 'PTF',
      description: 'Open forum for parent-teacher discussions',
      privacy: 'public'
    }
  ];

  const directMessages = [
    {
      id: 1,
      name: 'Dr. Sarah Wilson',
      role: 'Mathematics Teacher',
      lastMessage: 'Thanks for sharing the new curriculum guidelines!',
      timestamp: '10:30 AM',
      unread: 2,
      online: true,
      avatar: 'SW'
    },
    {
      id: 2,
      name: 'Prof. James Rodriguez',
      role: 'Physics Teacher',
      lastMessage: 'Can we schedule a meeting for next week?',
      timestamp: 'Yesterday',
      unread: 0,
      online: false,
      avatar: 'JR'
    },
    {
      id: 3,
      name: 'Ms. Emily Thompson',
      role: 'English Teacher',
      lastMessage: 'The student essays are ready for review',
      timestamp: '2 days ago',
      unread: 1,
      online: true,
      avatar: 'ET'
    }
  ];

  const tasks = [
    {
      id: 1,
      title: 'Review Q3 Exam Results',
      description: 'Analyze and provide feedback on third quarter examination results',
      assignedBy: 'Dr. Sarah Wilson',
      dueDate: '2024-12-20',
      priority: 'high',
      status: 'pending',
      group: 'Mathematics Teachers'
    },
    {
      id: 2,
      title: 'Prepare Parent-Teacher Meeting',
      description: 'Organize materials and schedule for upcoming parent-teacher conferences',
      assignedBy: 'Principal Johnson',
      dueDate: '2024-12-18',
      priority: 'medium',
      status: 'in-progress',
      group: 'Cambridge High School'
    },
    {
      id: 3,
      title: 'Update Science Lab Equipment List',
      description: 'Inventory and update the list of required laboratory equipment',
      assignedBy: 'Prof. James Rodriguez',
      dueDate: '2024-12-22',
      priority: 'low',
      status: 'completed',
      group: 'Science Department'
    }
  ];

  const announcements = [
    {
      id: 1,
      title: 'New Grading System Implementation',
      content: 'Starting next semester, we will be implementing a new digital grading system. Training sessions will be held next week.',
      author: 'Principal Johnson',
      timestamp: '2 hours ago',
      group: 'Cambridge High School',
      pinned: true
    },
    {
      id: 2,
      title: 'Mathematics Curriculum Update',
      content: 'The mathematics curriculum has been updated to include new problem-solving methodologies. Please review the attached documents.',
      author: 'Dr. Sarah Wilson',
      timestamp: '1 day ago',
      group: 'Mathematics Teachers',
      pinned: false
    }
  ];

  const renderMessages = () => (
    <div className="flex h-[600px]">
      {/* Sidebar */}
      <div className="w-1/3 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        {/* Search */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search conversations..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>

        {/* Groups */}
        <div className="p-4">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Groups</h3>
          <div className="space-y-2">
            {groups.map((group) => (
              <div
                key={group.id}
                className="flex items-center p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                onClick={() => setSelectedChat({ type: 'group', data: group })}
              >
                <img 
                  src={`/images/profiles/${group.id === 1 ? 'ZWLWcRggpYva.jpg' : group.id === 2 ? 'n91lAu9LXutZ.jpg' : group.id === 3 ? 'VDztaTdpSgnw.jpg' : 'uTFAIJG9jQbS.jpg'}`}
                  alt={group.name}
                  className="h-10 w-10 rounded-lg object-cover"
                />
                <div className="ml-3 flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{group.name}</p>
                    {group.unread > 0 && (
                      <span className="bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {group.unread}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{group.members} members</p>
                </div>
                <div className="flex items-center">
                  {group.privacy === 'private' ? (
                    <Lock className="h-3 w-3 text-gray-400" />
                  ) : (
                    <Globe className="h-3 w-3 text-gray-400" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Direct Messages */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Direct Messages</h3>
          <div className="space-y-2">
            {directMessages.map((dm) => (
              <div
                key={dm.id}
                className="flex items-center p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                onClick={() => setSelectedChat({ type: 'dm', data: dm })}
              >
                <div className="relative">
                  <img 
                    src={`/images/profiles/${dm.id === 1 ? 'ZWLWcRggpYva.jpg' : dm.id === 2 ? 'n91lAu9LXutZ.jpg' : 'VDztaTdpSgnw.jpg'}`}
                    alt={dm.name}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                  {dm.online && (
                    <div className="absolute -bottom-1 -right-1 h-3 w-3 bg-green-400 rounded-full border-2 border-white dark:border-gray-800"></div>
                  )}
                </div>
                <div className="ml-3 flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{dm.name}</p>
                    <span className="text-xs text-gray-500 dark:text-gray-400">{dm.timestamp}</span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{dm.lastMessage}</p>
                </div>
                {dm.unread > 0 && (
                  <span className="bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {dm.unread}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-white dark:bg-gray-800">
        {selectedChat ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <div className="flex items-center">
                <img 
                  src={`/images/profiles/${selectedChat.type === 'group' ? 
                    (selectedChat.data.id === 1 ? 'ZWLWcRggpYva.jpg' : selectedChat.data.id === 2 ? 'n91lAu9LXutZ.jpg' : 'VDztaTdpSgnw.jpg') :
                    (selectedChat.data.id === 1 ? 'ZWLWcRggpYva.jpg' : selectedChat.data.id === 2 ? 'n91lAu9LXutZ.jpg' : 'VDztaTdpSgnw.jpg')
                  }`}
                  alt={selectedChat.data.name}
                  className={`h-10 w-10 object-cover ${selectedChat.type === 'group' ? 'rounded-lg' : 'rounded-full'}`}
                />
                <div className="ml-3">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {selectedChat.data.name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {selectedChat.type === 'group' 
                      ? `${selectedChat.data.members} members`
                      : selectedChat.data.role
                    }
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {selectedChat.type === 'dm' && (
                  <>
                    <button 
                      className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      onClick={handlePhoneCall}
                    >
                      <Phone className="h-5 w-5" />
                    </button>
                    <button 
                      className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      onClick={handleVideoCall}
                    >
                      <Video className="h-5 w-5" />
                    </button>
                  </>
                )}
                <button 
                  className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  onClick={handleSettings}
                >
                  <Settings className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div key={message.id} className="flex items-start">
                    {message.isOwn ? (
                      <div className="h-8 w-8 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold text-xs">You</span>
                      </div>
                    ) : (
                      <img 
                        src="/images/profiles/ZWLWcRggpYva.jpg"
                        alt={message.sender}
                        className="h-8 w-8 rounded-full object-cover"
                      />
                    )}
                    <div className="ml-3 flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-gray-900 dark:text-white">{message.sender}</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">{message.timestamp}</span>
                      </div>
                      <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                        {message.content}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-2">
                <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                  <Paperclip className="h-5 w-5" />
                </button>
                <div className="flex-1">
                  <input
                    type="text"
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleSendMessage();
                      }
                    }}
                    placeholder="Type a message..."
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <button 
                  className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  onClick={handleSendMessage}
                >
                  <Send className="h-5 w-5" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Select a conversation</h3>
              <p className="text-gray-500 dark:text-gray-400">Choose a group or direct message to start chatting</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderTasks = () => (
    <div className="space-y-6">
      {/* Task Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Tasks</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">24</p>
            </div>
            <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
              <CheckSquare className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">8</p>
            </div>
            <div className="h-12 w-12 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg flex items-center justify-center">
              <Clock className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">In Progress</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">12</p>
            </div>
            <div className="h-12 w-12 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center">
              <Clock className="h-6 w-6 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Completed</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">4</p>
            </div>
            <div className="h-12 w-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
              <CheckSquare className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Tasks List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Tasks & Assignments</h3>
            <button 
              onClick={() => setShowTaskModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Task
            </button>
          </div>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {tasks.map((task) => (
              <div key={task.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h4 className="text-lg font-medium text-gray-900 dark:text-white">{task.title}</h4>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        task.priority === 'high' ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400' :
                        task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' :
                        'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                      }`}>
                        {task.priority}
                      </span>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        task.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' :
                        task.status === 'in-progress' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400' :
                        'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
                      }`}>
                        {task.status}
                      </span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 mb-3">{task.description}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                      <span>Assigned by: {task.assignedBy}</span>
                      <span>Due: {task.dueDate}</span>
                      <span>Group: {task.group}</span>
                    </div>
                  </div>
                  <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                    <MoreVertical className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderAnnouncements = () => (
    <div className="space-y-6">
      {/* Announcements Header */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Announcements & Updates</h3>
            <p className="text-gray-600 dark:text-gray-400">Stay updated with the latest news and announcements</p>
          </div>          <button 
            onClick={() => setShowAnnouncementModal(true)}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Announcement
          </button>      </div>
      </div>

      {/* Announcements List */}
      <div className="space-y-4">
        {announcements.map((announcement) => (
          <div key={announcement.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    {announcement.pinned && (
                      <Pin className="h-4 w-4 text-yellow-500" />
                    )}
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {announcement.title}
                    </h4>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">{announcement.content}</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-1" />
                      {announcement.author}
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {announcement.timestamp}
                    </div>
                    <div className="flex items-center">
                      <Hash className="h-4 w-4 mr-1" />
                      {announcement.group}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                    <Star className="h-4 w-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                    <MoreVertical className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Notifications */}
      {notifications.length > 0 && (
        <div className="fixed top-4 right-4 z-50 space-y-2">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-4 rounded-lg shadow-lg flex items-center justify-between min-w-80 ${
                notification.type === 'success' ? 'bg-green-100 text-green-800 border border-green-200' :
                notification.type === 'error' ? 'bg-red-100 text-red-800 border border-red-200' :
                'bg-blue-100 text-blue-800 border border-blue-200'
              }`}
            >
              <div className="flex items-center">
                {notification.type === 'success' ? (
                  <CheckCircle className="h-5 w-5 mr-2" />
                ) : (
                  <AlertCircle className="h-5 w-5 mr-2" />
                )}
                <div>
                  <p className="font-medium">{notification.message}</p>
                  <p className="text-xs opacity-75">{notification.timestamp}</p>
                </div>
              </div>
              <button
                onClick={() => dismissNotification(notification.id)}
                className="ml-4 text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Community & Groups</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Connect, collaborate, and communicate with your educational community
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex space-x-2">
          <button 
            onClick={() => setShowCreateGroupModal(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Group
          </button>
          <button 
            onClick={() => setShowJoinGroupModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            Join Group
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Groups</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">12</p>
            </div>
            <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
              <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Members</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">342</p>
            </div>
            <div className="h-12 w-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
              <School className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Messages Today</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">89</p>
            </div>
            <div className="h-12 w-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
              <MessageSquare className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Unread</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">23</p>
            </div>
            <div className="h-12 w-12 bg-red-100 dark:bg-red-900/20 rounded-lg flex items-center justify-center">
              <Bell className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('messages')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'messages'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300'
            }`}
          >
            Messages & Chats
          </button>
          <button
            onClick={() => setActiveTab('tasks')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'tasks'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300'
            }`}
          >
            Tasks & Assignments
          </button>
          <button
            onClick={() => setActiveTab('announcements')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'announcements'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300'
            }`}
          >
            Announcements
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
        {activeTab === 'messages' && renderMessages()}
        {activeTab === 'tasks' && renderTasks()}
        {activeTab === 'announcements' && renderAnnouncements()}
      </div>

      {/* Create Group Modal */}
      {showCreateGroupModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Create New Group</h3>
              <button
                onClick={() => setShowCreateGroupModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <form onSubmit={handleCreateGroup} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Group Name *
                </label>
                <input
                  type="text"
                  required
                  value={newGroup.name}
                  onChange={(e) => setNewGroup({...newGroup, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="Enter group name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  value={newGroup.description}
                  onChange={(e) => setNewGroup({...newGroup, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  rows={3}
                  placeholder="Describe the group purpose"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Group Type
                </label>
                <select 
                  value={newGroup.type}
                  onChange={(e) => setNewGroup({...newGroup, type: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                >
                  <option value="subject">Subject Group</option>
                  <option value="institution">Institution</option>
                  <option value="department">Department</option>
                  <option value="forum">Forum</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Privacy
                </label>
                <select 
                  value={newGroup.privacy}
                  onChange={(e) => setNewGroup({...newGroup, privacy: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                >
                  <option value="public">Public</option>
                  <option value="private">Private</option>
                </select>
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateGroupModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-md transition-colors"
                >
                  Create Group
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Join Group Modal */}
      {showJoinGroupModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Join Group</h3>
              <button
                onClick={() => setShowJoinGroupModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Search Groups
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="Search for groups to join..."
                  />
                </div>
              </div>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {groups.map((group) => (
                  <div key={group.id} className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-600 rounded-lg">
                    <div className="flex items-center">
                      <div className="h-10 w-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center mr-3">
                        <span className="text-blue-600 dark:text-blue-400 font-semibold text-sm">{group.avatar}</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{group.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{group.members} members</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => {
                        setNotifications([...notifications, {
                          id: Date.now(),
                          type: 'success',
                          message: `Joined ${group.name} successfully!`,
                          timestamp: new Date().toLocaleTimeString()
                        }]);
                        setShowJoinGroupModal(false);
                      }}
                      className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Join
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex justify-end pt-4">
                <button
                  onClick={() => setShowJoinGroupModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Task Modal */}
      {showTaskModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Create New Task</h3>
              <button
                onClick={() => setShowTaskModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Task Title *
                </label>
                <input
                  type="text"
                  required
                  value={newTask.title}
                  onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="Enter task title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  value={newTask.description}
                  onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  rows={3}
                  placeholder="Describe the task"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Due Date
                </label>
                <input
                  type="date"
                  value={newTask.dueDate}
                  onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Priority
                </label>
                <select 
                  value={newTask.priority}
                  onChange={(e) => setNewTask({...newTask, priority: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Assign To
                </label>
                <input
                  type="text"
                  value={newTask.assignTo}
                  onChange={(e) => setNewTask({...newTask, assignTo: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="Assign to (optional)"
                />
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowTaskModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
                >
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Announcement Modal */}
      {showAnnouncementModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Create Announcement</h3>
              <button
                onClick={() => setShowAnnouncementModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <form onSubmit={handleCreateAnnouncement} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  required
                  value={newAnnouncement.title}
                  onChange={(e) => setNewAnnouncement({...newAnnouncement, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="Enter announcement title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Content *
                </label>
                <textarea
                  required
                  value={newAnnouncement.content}
                  onChange={(e) => setNewAnnouncement({...newAnnouncement, content: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  rows={5}
                  placeholder="Write your announcement content"
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="pinned"
                  checked={newAnnouncement.pinned}
                  onChange={(e) => setNewAnnouncement({...newAnnouncement, pinned: e.target.checked})}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="pinned" className="ml-2 block text-sm text-gray-900 dark:text-white">
                  Pin this announcement
                </label>
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAnnouncementModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-md transition-colors"
                >
                  Post Announcement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommunityGroups;

