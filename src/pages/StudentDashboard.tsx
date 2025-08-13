import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BookOpen, 
  Calendar, 
  Clock, 
  FileText, 
  GraduationCap, 
  TrendingUp, 
  Award,
  ChevronRight,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import { useUIStore } from '../stores/useUIStore';
import { useAIStore } from '../stores/useAIStore';
import AnimatedProgressBar from '../components/AnimatedProgressBar';

interface ExamResult {
  id: string;
  subject: string;
  date: string;
  score: number;
  totalScore: number;
  grade: string;
  status: 'Passed' | 'Failed' | 'Pending';
  feedback?: string;
}

interface UpcomingExam {
  id: string;
  subject: string;
  date: string;
  time: string;
  duration: string;
  venue: string;
}

interface PerformanceMetric {
  label: string;
  value: number;
  previousValue: number;
  trend: 'up' | 'down';
  trendValue: string;
}

export default function StudentDashboard() {
  const navigate = useNavigate();
  const { preferences } = useUIStore();
  const { history } = useAIStore();
  
  const [recentResults, setRecentResults] = useState<ExamResult[]>([
    {
      id: '1',
      subject: 'Mathematics',
      date: '2024-03-15',
      score: 85,
      totalScore: 100,
      grade: 'A',
      status: 'Passed',
      feedback: 'Excellent work! Strong understanding of core concepts.'
    },
    {
      id: '2',
      subject: 'Physics',
      date: '2024-03-10',
      score: 92,
      totalScore: 100,
      grade: 'A+',
      status: 'Passed',
      feedback: 'Outstanding performance! Very detailed analysis.'
    }
  ]);

  const [upcomingExams, setUpcomingExams] = useState<UpcomingExam[]>([
    {
      id: '1',
      subject: 'Chemistry',
      date: '2024-03-20',
      time: '09:00 AM',
      duration: '2 hours',
      venue: 'Room 301'
    },
    {
      id: '2',
      subject: 'Biology',
      date: '2024-03-25',
      time: '10:30 AM',
      duration: '1.5 hours',
      venue: 'Room 302'
    }
  ]);

  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetric[]>([
    {
      label: 'Average Score',
      value: 88.5,
      previousValue: 85.2,
      trend: 'up',
      trendValue: '+3.3%'
    },
    {
      label: 'Attendance Rate',
      value: 95,
      previousValue: 92,
      trend: 'up',
      trendValue: '+3%'
    },
    {
      label: 'Completion Rate',
      value: 98,
      previousValue: 96,
      trend: 'up',
      trendValue: '+2%'
    }
  ]);

  const [selectedTab, setSelectedTab] = useState<'overview' | 'results' | 'schedule'>('overview');

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 transition-colors duration-300">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Student Dashboard</h1>
            <p className="text-gray-500 dark:text-gray-400">Welcome back! Here's your academic overview.</p>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/profile')}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
            >
              Profile Settings
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 transition-colors duration-300">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setSelectedTab('overview')}
              className={`${
                selectedTab === 'overview'
                  ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Overview
            </button>
            <button
              onClick={() => setSelectedTab('results')}
              className={`${
                selectedTab === 'results'
                  ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Results
            </button>
            <button
              onClick={() => setSelectedTab('schedule')}
              className={`${
                selectedTab === 'schedule'
                  ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Schedule
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Performance Overview */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 transition-colors duration-300">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2" />
              Performance Overview
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {performanceMetrics.map((metric, index) => (
                <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <p className="text-sm text-gray-500 dark:text-gray-400">{metric.label}</p>
                  <div className="flex items-baseline mt-2">
                    <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                      {metric.value}%
                    </p>
                    <p className={`ml-2 text-sm font-medium ${
                      metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {metric.trendValue}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Results */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 transition-colors duration-300">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <FileText className="w-5 h-5 mr-2" />
              Recent Results
            </h2>
            <div className="space-y-4">
              {recentResults.map((result) => (
                <div key={result.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className={`p-2 rounded-lg ${
                      result.status === 'Passed' ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'
                    }`}>
                      {result.status === 'Passed' ? (
                        <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400" />
                      ) : (
                        <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white">{result.subject}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(result.date).toLocaleDateString()} • Score: {result.score}/{result.totalScore}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className={`text-sm font-medium ${
                      result.status === 'Passed' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {result.grade}
                    </span>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Upcoming Exams */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 transition-colors duration-300">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              Upcoming Exams
            </h2>
            <div className="space-y-4">
              {upcomingExams.map((exam) => (
                <div key={exam.id} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">{exam.subject}</h3>
                    <span className="text-sm text-gray-500 dark:text-gray-400">{exam.date}</span>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {exam.time}
                    </div>
                    <div className="flex items-center">
                      <GraduationCap className="h-4 w-4 mr-1" />
                      {exam.venue}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 transition-colors duration-300">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <Award className="w-5 h-5 mr-2" />
              Quick Actions
            </h2>
            <div className="space-y-3">
              <button
                onClick={() => navigate('/study-materials')}
                className="w-full flex items-center justify-between p-3 text-left bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
              >
                <div className="flex items-center">
                  <BookOpen className="h-5 w-5 mr-3 text-gray-500 dark:text-gray-400" />
                  <span className="text-sm font-medium text-gray-900 dark:text-white">Study Materials</span>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </button>
              <button
                onClick={() => navigate('/timetable')}
                className="w-full flex items-center justify-between p-3 text-left bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
              >
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 mr-3 text-gray-500 dark:text-gray-400" />
                  <span className="text-sm font-medium text-gray-900 dark:text-white">View Timetable</span>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </button>
              <button
                onClick={() => navigate('/progress')}
                className="w-full flex items-center justify-between p-3 text-left bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
              >
                <div className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-3 text-gray-500 dark:text-gray-400" />
                  <span className="text-sm font-medium text-gray-900 dark:text-white">Progress Report</span>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}