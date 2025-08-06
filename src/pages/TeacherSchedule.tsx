import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Plus, Edit, Trash2, Check, X, BookOpen, Users, Bell } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  status: 'pending' | 'completed' | 'incomplete';
  type: 'class' | 'meeting' | 'grading' | 'other';
  priority: 'low' | 'medium' | 'high';
}

interface Schedule {
  id: string;
  day: string;
  time: string;
  subject: string;
  class: string;
  room: string;
}

export default function TeacherSchedule() {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Grade Mathematics Exam Papers',
      description: 'Grade final exam papers for Grade 10 Mathematics',
      date: '2025-08-06',
      time: '14:00',
      status: 'pending',
      type: 'grading',
      priority: 'high'
    },
    {
      id: '2',
      title: 'Parent-Teacher Meeting',
      description: 'Meeting with Sarah Johnson\'s parents',
      date: '2025-08-07',
      time: '15:30',
      status: 'pending',
      type: 'meeting',
      priority: 'medium'
    },
    {
      id: '3',
      title: 'Prepare Chemistry Lab',
      description: 'Set up equipment for tomorrow\'s chemistry experiment',
      date: '2025-08-06',
      time: '16:00',
      status: 'completed',
      type: 'class',
      priority: 'medium'
    }
  ]);

  const [schedule, setSchedule] = useState<Schedule[]>([
    { id: '1', day: 'Monday', time: '08:00-09:00', subject: 'Mathematics', class: 'Grade 10A', room: 'Room 101' },
    { id: '2', day: 'Monday', time: '09:00-10:00', subject: 'Physics', class: 'Grade 11B', room: 'Lab 1' },
    { id: '3', day: 'Monday', time: '11:00-12:00', subject: 'Mathematics', class: 'Grade 10B', room: 'Room 101' },
    { id: '4', day: 'Tuesday', time: '08:00-09:00', subject: 'Physics', class: 'Grade 11A', room: 'Lab 1' },
    { id: '5', day: 'Tuesday', time: '10:00-11:00', subject: 'Mathematics', class: 'Grade 10A', room: 'Room 101' },
    { id: '6', day: 'Wednesday', time: '09:00-10:00', subject: 'Physics', class: 'Grade 11B', room: 'Lab 1' },
    { id: '7', day: 'Wednesday', time: '14:00-15:00', subject: 'Mathematics', class: 'Grade 10B', room: 'Room 101' },
    { id: '8', day: 'Thursday', time: '08:00-09:00', subject: 'Mathematics', class: 'Grade 10A', room: 'Room 101' },
    { id: '9', day: 'Thursday', time: '11:00-12:00', subject: 'Physics', class: 'Grade 11A', room: 'Lab 1' },
    { id: '10', day: 'Friday', time: '09:00-10:00', subject: 'Mathematics', class: 'Grade 10B', room: 'Room 101' },
    { id: '11', day: 'Friday', time: '15:00-16:00', subject: 'Physics', class: 'Grade 11B', room: 'Lab 1' }
  ]);

  const [showTaskModal, setShowTaskModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [currentView, setCurrentView] = useState<'calendar' | 'tasks' | 'timetable'>('calendar');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const [newTask, setNewTask] = useState<Partial<Task>>({
    title: '',
    description: '',
    date: selectedDate,
    time: '',
    status: 'pending',
    type: 'other',
    priority: 'medium'
  });

  const handleAddTask = () => {
    if (newTask.title && newTask.date && newTask.time) {
      const task: Task = {
        id: Date.now().toString(),
        title: newTask.title!,
        description: newTask.description || '',
        date: newTask.date!,
        time: newTask.time!,
        status: newTask.status as Task['status'],
        type: newTask.type as Task['type'],
        priority: newTask.priority as Task['priority']
      };
      setTasks([...tasks, task]);
      setNewTask({
        title: '',
        description: '',
        date: selectedDate,
        time: '',
        status: 'pending',
        type: 'other',
        priority: 'medium'
      });
      setShowTaskModal(false);
    }
  };

  const handleUpdateTaskStatus = (taskId: string, status: Task['status']) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, status } : task
    ));
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const getTasksForDate = (date: string) => {
    return tasks.filter(task => task.date === date);
  };

  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100 dark:bg-green-900/20 dark:text-green-400';
      case 'incomplete': return 'text-red-600 bg-red-100 dark:bg-red-900/20 dark:text-red-400';
      default: return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-400';
    }
  };

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'high': return 'border-l-red-500';
      case 'medium': return 'border-l-yellow-500';
      default: return 'border-l-green-500';
    }
  };

  const getTypeIcon = (type: Task['type']) => {
    switch (type) {
      case 'class': return <BookOpen className="h-4 w-4" />;
      case 'meeting': return <Users className="h-4 w-4" />;
      case 'grading': return <Edit className="h-4 w-4" />;
      default: return <Bell className="h-4 w-4" />;
    }
  };

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const timeSlots = ['08:00-09:00', '09:00-10:00', '10:00-11:00', '11:00-12:00', '14:00-15:00', '15:00-16:00'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Teacher Schedule</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Manage your classes, tasks, and schedule</p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setCurrentView('calendar')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              currentView === 'calendar' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            <Calendar className="h-4 w-4 inline mr-2" />
            Calendar
          </button>
          <button
            onClick={() => setCurrentView('tasks')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              currentView === 'tasks' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            <Clock className="h-4 w-4 inline mr-2" />
            Tasks
          </button>
          <button
            onClick={() => setCurrentView('timetable')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              currentView === 'timetable' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            <BookOpen className="h-4 w-4 inline mr-2" />
            Timetable
          </button>
          <button
            onClick={() => setShowTaskModal(true)}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Plus className="h-4 w-4 inline mr-2" />
            Add Task
          </button>
        </div>
      </div>

      {/* Calendar View */}
      {currentView === 'calendar' && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <div className="mb-6">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Tasks for {new Date(selectedDate).toLocaleDateString()}
            </h3>
            
            {getTasksForDate(selectedDate).length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400">No tasks scheduled for this date.</p>
            ) : (
              <div className="space-y-3">
                {getTasksForDate(selectedDate).map((task) => (
                  <div
                    key={task.id}
                    className={`p-4 border-l-4 bg-gray-50 dark:bg-gray-700 rounded-r-lg ${getPriorityColor(task.priority)}`}
                  >
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {getTypeIcon(task.type)}
                          <h4 className="font-semibold text-gray-900 dark:text-white">{task.title}</h4>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                            {task.status}
                          </span>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">{task.description}</p>
                        <p className="text-gray-500 dark:text-gray-500 text-sm">
                          <Clock className="h-4 w-4 inline mr-1" />
                          {task.time}
                        </p>
                      </div>
                      
                      <div className="flex gap-2">
                        {task.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleUpdateTaskStatus(task.id, 'completed')}
                              className="p-2 text-green-600 hover:bg-green-100 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                              title="Mark as completed"
                            >
                              <Check className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleUpdateTaskStatus(task.id, 'incomplete')}
                              className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                              title="Mark as incomplete"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => handleDeleteTask(task.id)}
                          className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                          title="Delete task"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tasks View */}
      {currentView === 'tasks' && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">All Tasks</h3>
          
          <div className="space-y-4">
            {tasks.map((task) => (
              <div
                key={task.id}
                className={`p-4 border-l-4 bg-gray-50 dark:bg-gray-700 rounded-r-lg ${getPriorityColor(task.priority)}`}
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {getTypeIcon(task.type)}
                      <h4 className="font-semibold text-gray-900 dark:text-white">{task.title}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                        {task.status}
                      </span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">{task.description}</p>
                    <p className="text-gray-500 dark:text-gray-500 text-sm">
                      <Calendar className="h-4 w-4 inline mr-1" />
                      {new Date(task.date).toLocaleDateString()} at {task.time}
                    </p>
                  </div>
                  
                  <div className="flex gap-2">
                    {task.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleUpdateTaskStatus(task.id, 'completed')}
                          className="p-2 text-green-600 hover:bg-green-100 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                          title="Mark as completed"
                        >
                          <Check className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleUpdateTaskStatus(task.id, 'incomplete')}
                          className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                          title="Mark as incomplete"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => handleDeleteTask(task.id)}
                      className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      title="Delete task"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Timetable View */}
      {currentView === 'timetable' && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Weekly Timetable</h3>
          
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="border border-gray-300 dark:border-gray-600 p-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white font-semibold">
                    Time
                  </th>
                  {daysOfWeek.map((day) => (
                    <th key={day} className="border border-gray-300 dark:border-gray-600 p-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white font-semibold">
                      {day}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {timeSlots.map((timeSlot) => (
                  <tr key={timeSlot}>
                    <td className="border border-gray-300 dark:border-gray-600 p-3 bg-gray-50 dark:bg-gray-700 font-medium text-gray-900 dark:text-white">
                      {timeSlot}
                    </td>
                    {daysOfWeek.map((day) => {
                      const classForSlot = schedule.find(s => s.day === day && s.time === timeSlot);
                      return (
                        <td key={`${day}-${timeSlot}`} className="border border-gray-300 dark:border-gray-600 p-3">
                          {classForSlot ? (
                            <div className="bg-blue-100 dark:bg-blue-900/20 p-2 rounded-lg">
                              <div className="font-semibold text-blue-900 dark:text-blue-300 text-sm">
                                {classForSlot.subject}
                              </div>
                              <div className="text-blue-700 dark:text-blue-400 text-xs">
                                {classForSlot.class}
                              </div>
                              <div className="text-blue-600 dark:text-blue-500 text-xs">
                                {classForSlot.room}
                              </div>
                            </div>
                          ) : (
                            <div className="h-16"></div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Task Modal */}
      {showTaskModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Add New Task</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={newTask.title || ''}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Enter task title"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  value={newTask.description || ''}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Enter task description"
                  rows={3}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    value={newTask.date || ''}
                    onChange={(e) => setNewTask({ ...newTask, date: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Time
                  </label>
                  <input
                    type="time"
                    value={newTask.time || ''}
                    onChange={(e) => setNewTask({ ...newTask, time: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Type
                  </label>
                  <select
                    value={newTask.type || 'other'}
                    onChange={(e) => setNewTask({ ...newTask, type: e.target.value as Task['type'] })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="class">Class</option>
                    <option value="meeting">Meeting</option>
                    <option value="grading">Grading</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Priority
                  </label>
                  <select
                    value={newTask.priority || 'medium'}
                    onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as Task['priority'] })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowTaskModal(false)}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddTask}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add Task
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

