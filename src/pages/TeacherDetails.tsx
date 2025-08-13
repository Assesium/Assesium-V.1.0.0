import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Search, Filter, GraduationCap, Mail, Phone, BookOpen, Users, Edit, Trash, Plus, TrendingUp, Award, Calendar, Clock, FileText, CheckCircle2, ArrowUpRight, ArrowDownRight, X, MapPin } from 'lucide-react';
import { DynamicChart } from '../components/charts/DynamicChart';
import CountUp from 'react-countup';
import AnimatedProgressBar from '../components/AnimatedProgressBar';
import { useInstitutionStore } from '../stores/useInstitutionStore';

interface Student {
  id: string;
  name: string;
  grade: string;
  performance: number;
  attendance: number;
  lastSubmission: string;
}

interface ClassSession {
  id: string;
  subject: string;
  date: string;
  time: string;
  duration: string;
  room: string;
  students: number;
}

interface TeacherPerformance {
  label: string;
  value: number;
  previousValue: number;
  trend: 'up' | 'down';
  trendValue: string;
}

interface Teacher {
  id: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  subjects: string[];
  students: string[];
  institution: string;
  joinDate: string;
  qualification: string;
  bio: string;
  achievements: string[];
  profileImage?: string;
}

interface ClassDetails extends ClassSession {
  description: string;
  syllabus: string[];
  materials: { name: string; type: string }[];
  assignments: { title: string; dueDate: string }[];
}

export default function TeacherDetails() {
  const { teacherId } = useParams<{ teacherId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const institutionParam = queryParams.get('institution');
  const { institutions } = useInstitutionStore();
  
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState<'overview' | 'performance' | 'schedule'>('overview');
  
  // Sample students data
  const [students, setStudents] = useState<Student[]>([
    {
      id: 'S10045',
      name: 'Emma Thompson',
      grade: '10th',
      performance: 92,
      attendance: 98,
      lastSubmission: '2024-03-15'
    },
    {
      id: 'S10046',
      name: 'James Wilson',
      grade: '10th',
      performance: 85,
      attendance: 92,
      lastSubmission: '2024-03-14'
    },
    {
      id: 'S10047',
      name: 'Sophia Chen',
      grade: '10th',
      performance: 88,
      attendance: 95,
      lastSubmission: '2024-03-16'
    }
  ]);
  
  // Sample class sessions
  const [classSessions, setClassSessions] = useState<ClassSession[]>([
    {
      id: '1',
      subject: 'Physics',
      date: '2024-03-20',
      time: '09:00 AM',
      duration: '1.5 hours',
      room: 'Room 301',
      students: 28
    },
    {
      id: '2',
      subject: 'Chemistry',
      date: '2024-03-20',
      time: '11:00 AM',
      duration: '1 hour',
      room: 'Lab 102',
      students: 24
    },
    {
      id: '3',
      subject: 'Physics',
      date: '2024-03-21',
      time: '09:00 AM',
      duration: '1.5 hours',
      room: 'Room 301',
      students: 28
    },
    {
      id: '4',
      subject: 'Chemistry',
      date: '2024-03-21',
      time: '11:00 AM',
      duration: '1 hour',
      room: 'Lab 102',
      students: 24
    }
  ]);

  // Performance metrics data
  const [performanceMetrics, setPerformanceMetrics] = useState<TeacherPerformance[]>([
    {
      label: 'Average Student Score',
      value: 82.5,
      previousValue: 78.2,
      trend: 'up',
      trendValue: '+4.3%'
    },
    {
      label: 'Class Attendance',
      value: 94,
      previousValue: 91,
      trend: 'up',
      trendValue: '+3%'
    },
    {
      label: 'Assignment Completion',
      value: 88,
      previousValue: 85,
      trend: 'up',
      trendValue: '+3%'
    }
  ]);

  // Teacher stats data
  const [teacherStats, setTeacherStats] = useState({
    totalStudents: students.length,
    totalClasses: classSessions.length,
    departments: 1
  });

  // Subject distribution data
  const [subjectDistribution, setSubjectDistribution] = useState({
    labels: ['Physics', 'Chemistry'],
    data: [60, 40]
  });

  // Performance trends data
  const [performanceTrends, setPerformanceTrends] = useState({
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Average Score',
        data: [75, 78, 82, 80, 85, 82.5],
        borderColor: '#4361ee', // Updated to match consistent color palette
        backgroundColor: 'rgba(67, 97, 238, 0.1)',
        tension: 0.4,
        fill: true
      }
    ]
  });

  const [selectedClass, setSelectedClass] = useState<ClassDetails | null>(null);
  const [showClassModal, setShowClassModal] = useState(false);

  // Fetch teacher data
  useEffect(() => {
    const fetchTeacher = async () => {
      try {
        // Simulate API call
        setTimeout(() => {
          const teacherData: Teacher = {
            id: teacherId || '',
            name: 'Dr. Sarah Johnson',
            email: 'sarah.johnson@example.com',
            phone: '+1 (555) 123-4567',
            department: 'Science',
            subjects: ['Physics', 'Chemistry'],
            students: ['S10045', 'S10046', 'S10047'],
            institution: institutionParam ? decodeURIComponent(institutionParam) : 'Cambridge High School',
            joinDate: '2018-08-15',
            qualification: 'Ph.D. in Physics',
            bio: 'Dr. Sarah Johnson is an experienced educator with over 10 years of teaching experience in Physics and Chemistry. She has a passion for making complex scientific concepts accessible to students of all learning styles.',
            achievements: [
              'Teacher of the Year 2022',
              'Published research in Quantum Physics',
              'Developed innovative teaching methodologies'
            ]
          };
          
          setTeacher(teacherData);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching teacher data:', error);
        setLoading(false);
      }
    };
    
    fetchTeacher();
  }, [teacherId, institutionParam]);

  const handleViewClassDetails = (sessionId: string) => {
    // Simulate fetching detailed class information
    const classDetails: ClassDetails = {
      ...classSessions.find(session => session.id === sessionId)!,
      description: 'In this class, students will learn about fundamental physics concepts including motion, forces, and energy. The session includes both theoretical explanations and practical demonstrations.',
      syllabus: [
        'Introduction to Motion',
        'Newton\'s Laws of Motion',
        'Conservation of Energy',
        'Practical Demonstrations'
      ],
      materials: [
        { name: 'Physics Textbook Chapter 3', type: 'PDF' },
        { name: 'Motion Simulation', type: 'Interactive' },
        { name: 'Practice Problems Set', type: 'Document' }
      ],
      assignments: [
        { title: 'Motion Problems Set', dueDate: '2024-03-23' },
        { title: 'Lab Report', dueDate: '2024-03-25' }
      ]
    };
    setSelectedClass(classDetails);
    setShowClassModal(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!teacher) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Teacher not found</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">The requested teacher could not be found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-indigo-600 dark:text-indigo-400 text-xl font-semibold">
              {teacher.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{teacher.name}</h1>
              <p className="text-lg text-gray-600 dark:text-gray-400">{teacher.department} Department</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => navigate(`/teachers/${teacher.id}/edit?institution=${encodeURIComponent(teacher.institution)}`)}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors duration-300 flex items-center gap-2"
            >
              <Edit className="h-4 w-4" />
              Edit Profile
            </button>
            <button
              onClick={() => navigate(`/teachers?institution=${encodeURIComponent(teacher.institution)}`)}
              className="bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 px-4 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-300 border border-gray-200 dark:border-gray-700"
            >
              Back to List
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-12 gap-6">
          {/* Left Sidebar */}
          <div className="col-span-3">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <Mail className="h-5 w-5" />
                  <span>{teacher.email}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <Phone className="h-5 w-5" />
                  <span>{teacher.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <GraduationCap className="h-5 w-5" />
                  <span>{teacher.qualification}</span>
                </div>
              </div>
              <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Stats</h3>
                <div className="grid grid-cols-1 gap-4">
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <div className="text-sm text-gray-600 dark:text-gray-400">Total Students</div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">{teacherStats.totalStudents}</div>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <div className="text-sm text-gray-600 dark:text-gray-400">Total Classes</div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">{teacherStats.totalClasses}</div>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <div className="text-sm text-gray-600 dark:text-gray-400">Departments</div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">{teacherStats.departments}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="col-span-9 space-y-6">
            {/* Tabs */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm">
              <div className="border-b border-gray-200 dark:border-gray-700">
                <nav className="flex space-x-8 px-6" aria-label="Tabs">
                  {(['overview', 'performance', 'schedule'] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setSelectedTab(tab)}
                      className={`${
                        selectedTab === tab
                          ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                      } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm capitalize`}
                    >
                      {tab}
                    </button>
                  ))}
                </nav>
              </div>

              <div className="p-6">
                {selectedTab === 'overview' && (
                  <div className="space-y-6">
                    {/* Performance Overview */}
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Performance Overview</h2>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {performanceMetrics.map((metric) => (
                          <div key={metric.label} className="bg-gray-50 dark:bg-gray-700 p-6 rounded-xl">
                            <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">{metric.label}</div>
                            <div className="flex items-end gap-2">
                              <div className="text-3xl font-bold text-gray-900 dark:text-white">{metric.value}%</div>
                              <div className={`text-sm ${metric.trend === 'up' ? 'text-green-600' : 'text-red-600'} flex items-center gap-1`}>
                                {metric.trend === 'up' ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                                {metric.trendValue}
                              </div>
                            </div>
                            <div className="mt-4">
                              <AnimatedProgressBar value={metric.value} color={metric.trend === 'up' ? '#10b981' : '#ef4444'} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Subject Distribution */}
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Subject Distribution</h2>
                      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                        <DynamicChart
                          type="doughnut"
                          data={{
                            labels: subjectDistribution.labels,
                            datasets: [
                              {
                                data: subjectDistribution.data,
                                backgroundColor: ['#4f46e5', '#10b981']
                              }
                            ]
                          }}
                          options={{
                            responsive: true,
                            plugins: {
                              legend: {
                                position: 'bottom'
                              }
                            }
                          }}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {selectedTab === 'performance' && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Performance Trends</h2>
                      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                        <DynamicChart
                          type="line"
                          data={performanceTrends}
                          options={{
                            responsive: true,
                            plugins: {
                              legend: {
                                display: false
                              }
                            },
                            scales: {
                              y: {
                                beginAtZero: true,
                                max: 100
                              }
                            }
                          }}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {selectedTab === 'schedule' && (
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Upcoming Classes</h2>
                    <div className="space-y-4">
                      {classSessions.map((session) => (
                        <div
                          key={session.id}
                          className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6 flex items-center justify-between"
                        >
                          <div>
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white">{session.subject}</h3>
                            <div className="mt-1 flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                {session.date}
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                {session.time}
                              </div>
                              <div className="flex items-center gap-1">
                                <Users className="h-4 w-4" />
                                {session.students} students
                              </div>
                            </div>
                          </div>
                          <button
                            onClick={() => handleViewClassDetails(session.id)}
                            className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                          >
                            View Details
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Class Details Modal */}
        {showClassModal && selectedClass && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="p-6 space-y-6">
                {/* Modal Header */}
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{selectedClass.subject}</h2>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">Class Details</p>
                  </div>
                  <button
                    onClick={() => setShowClassModal(false)}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                {/* Class Information */}
                <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <Calendar className="h-5 w-5" />
                    <span>{selectedClass.date}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <Clock className="h-5 w-5" />
                    <span>{selectedClass.time} ({selectedClass.duration})</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <MapPin className="h-5 w-5" />
                    <span>{selectedClass.room}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <Users className="h-5 w-5" />
                    <span>{selectedClass.students} students</span>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Description</h3>
                  <p className="text-gray-600 dark:text-gray-400">{selectedClass.description}</p>
                </div>

                {/* Syllabus */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Syllabus</h3>
                  <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-400">
                    {selectedClass.syllabus.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>

                {/* Materials */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Class Materials</h3>
                  <div className="space-y-2">
                    {selectedClass.materials.map((material, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600"
                      >
                        <div className="flex items-center gap-3">
                          <FileText className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                          <span className="text-gray-900 dark:text-white">{material.name}</span>
                        </div>
                        <span className="text-sm text-gray-500 dark:text-gray-400">{material.type}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Assignments */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Assignments</h3>
                  <div className="space-y-2">
                    {selectedClass.assignments.map((assignment, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600"
                      >
                        <div className="flex items-center gap-3">
                          <CheckCircle2 className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                          <span className="text-gray-900 dark:text-white">{assignment.title}</span>
                        </div>
                        <span className="text-sm text-gray-500 dark:text-gray-400">Due: {assignment.dueDate}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="border-t border-gray-200 dark:border-gray-700 p-6">
                <button
                  onClick={() => setShowClassModal(false)}
                  className="w-full bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors duration-300"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}