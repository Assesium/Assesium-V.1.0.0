import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Search, Filter, GraduationCap, Mail, Phone, BookOpen, Users, Edit, Trash, Plus, TrendingUp, Award, Calendar, Clock, FileText, CheckCircle2, Building2, Upload } from 'lucide-react';
import { useInstitutionStore } from '../stores/useInstitutionStore';
import { DynamicChart } from '../components/charts/DynamicChart';
import CountUp from 'react-countup';
import AnimatedProgressBar from '../components/AnimatedProgressBar';
import InstitutionSelector from '../components/InstitutionSelector';
import { institutions } from '../data/institutions';
import TeacherModal from '../components/TeacherModal';
import { TeacherFormData } from '../components/forms/TeacherForm';
import ImportModal from '../components/ImportModal';

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
  profileImage?: string;
}

interface TeacherMetric {
  label: string;
  value: number;
  previousValue: number;
  trend: 'up' | 'down';
  trendValue: string;
}

interface UpcomingClass {
  id: string;
  subject: string;
  date: string;
  time: string;
  duration: string;
  room: string;
  students: number;
}

// Sample teacher data
const sampleTeachers: Teacher[] = [
  {
    id: 'T1001',
    name: 'Dr. Sarah Johnson',
    email: 'sarah.johnson@example.com',
    phone: '+1 (555) 123-4567',
    department: 'Science',
    subjects: ['Physics', 'Chemistry'],
    students: ['S10045', 'S10046', 'S10047'],
    institution: 'Cambridge High School',
    joinDate: '2018-08-15',
    qualification: 'Ph.D. in Physics'
  },
  {
    id: 'T1002',
    name: 'Prof. Michael Chen',
    email: 'michael.chen@example.com',
    phone: '+1 (555) 234-5678',
    department: 'Mathematics',
    subjects: ['Algebra', 'Calculus'],
    students: ['S10048', 'S10049', 'S10050'],
    institution: 'Cambridge High School',
    joinDate: '2019-01-10',
    qualification: 'M.Sc. in Mathematics'
  },
  {
    id: 'T1003',
    name: 'Ms. Emily Rodriguez',
    email: 'emily.rodriguez@example.com',
    phone: '+1 (555) 345-6789',
    department: 'Languages',
    subjects: ['English Literature', 'Spanish'],
    students: ['S10051', 'S10052'],
    institution: 'Cambridge High School',
    joinDate: '2020-03-22',
    qualification: 'M.A. in English Literature'
  },
  {
    id: 'T1004',
    name: 'Dr. James Wilson',
    email: 'james.wilson@example.com',
    phone: '+1 (555) 456-7890',
    department: 'Social Sciences',
    subjects: ['History', 'Geography'],
    students: ['S10053', 'S10054', 'S10055'],
    institution: 'Oxford Academy',
    joinDate: '2017-09-05',
    qualification: 'Ph.D. in History'
  },
  {
    id: 'T1005',
    name: 'Mrs. Sophia Patel',
    email: 'sophia.patel@example.com',
    phone: '+1 (555) 567-8901',
    department: 'Arts',
    subjects: ['Fine Arts', 'Music'],
    students: ['S10056', 'S10057'],
    institution: 'Oxford Academy',
    joinDate: '2021-01-15',
    qualification: 'B.F.A. in Fine Arts'
  },
  {
    id: 'T1006',
    name: 'Mr. David Kim',
    email: 'david.kim@example.com',
    phone: '+1 (555) 678-9012',
    department: 'Physical Education',
    subjects: ['Physical Education', 'Health Science'],
    students: ['S10058', 'S10059', 'S10060'],
    institution: "St. Mary's International School",
    joinDate: '2019-08-20',
    qualification: 'M.S. in Physical Education'
  }
];

export default function Teachers() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const institutionParam = queryParams.get('institution');

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('All Departments');
  const [teachers, setTeachers] = useState<Teacher[]>(sampleTeachers);
  const [filteredTeachers, setFilteredTeachers] = useState<Teacher[]>(sampleTeachers);
  const [selectedTab, setSelectedTab] = useState<'overview' | 'performance' | 'schedule'>('overview');
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Teacher | null;
    direction: 'asc' | 'desc';
  }>({ key: null, direction: 'asc' });
  
  // Modal states
  const [isTeacherModalOpen, setIsTeacherModalOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<TeacherFormData | undefined>(undefined);
  const [showImportModal, setShowImportModal] = useState(false);
  
  // Teacher metrics data
  const [teacherMetrics, setTeacherMetrics] = useState<TeacherMetric[]>([
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

  // Upcoming classes data
  const [upcomingClasses, setUpcomingClasses] = useState<UpcomingClass[]>([
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
    }
  ]);
  
  // Performance data for charts
  const performanceData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Average Score',
        data: [76, 79, 82, 80, 85, 88],
        borderColor: '#4361ee',
        backgroundColor: 'rgba(67, 97, 238, 0.1)',
        tension: 0.3,
        fill: true
      },
      {
        label: 'Attendance Rate',
        data: [88, 90, 92, 91, 94, 95],
        borderColor: '#f72585',
        backgroundColor: 'rgba(247, 37, 133, 0.1)',
        tension: 0.3,
        fill: true
      }
    ]
  };

  const subjectDistribution = {
    labels: ['Physics', 'Chemistry', 'Biology', 'Mathematics', 'Computer Science'],
    datasets: [{
      data: [28, 24, 22, 30, 18],
      backgroundColor: [
        '#4361ee',
        '#3a0ca3',
        '#f72585',
        '#4cc9f0',
        '#7209b7'
      ],
      hoverOffset: 4
    }]
  };

  // Get departments from the institution store
  const departments = useInstitutionStore(state => state.departments);
  const departmentNames = ['All Departments', ...new Set(departments.map(dept => dept.name))];

  // Sort function
  const sortTeachers = (teachers: Teacher[], key: keyof Teacher, direction: 'asc' | 'desc') => {
    return [...teachers].sort((a, b) => {
      if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
      if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
      return 0;
    });
  };

  // Handle sort
  const handleSort = (key: keyof Teacher) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
    setFilteredTeachers(sortTeachers(filteredTeachers, key, direction));
  };

  useEffect(() => {
    // Apply search and department filters
    let filtered = teachers;
    
    // Filter by institution if provided
    if (institutionParam) {
      const decodedInstitution = decodeURIComponent(institutionParam);
      filtered = filtered.filter(teacher => 
        teacher.institution.toLowerCase() === decodedInstitution.toLowerCase()
      );
    }
    
    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(teacher =>
        teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        teacher.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        teacher.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
        teacher.subjects.some(subject => subject.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    // Filter by department
    if (selectedDepartment !== 'All Departments') {
      filtered = filtered.filter(teacher => teacher.department === selectedDepartment);
    }

    // Apply sorting if configured
    if (sortConfig.key) {
      filtered = sortTeachers(filtered, sortConfig.key, sortConfig.direction);
    }
    
    setFilteredTeachers(filtered);
  }, [searchTerm, selectedDepartment, institutionParam, teachers, sortConfig]);

  const handleAddTeacher = () => {
    setSelectedTeacher(undefined);
    setIsTeacherModalOpen(true);
  };

  const handleEditTeacher = (teacherId: string) => {
    const teacher = teachers.find(t => t.id === teacherId);
    if (teacher) {
      setSelectedTeacher({
        id: teacher.id,
        name: teacher.name,
        email: teacher.email,
        phone: teacher.phone,
        department: teacher.department,
        subjects: teacher.subjects,
        institution: teacher.institution,
        qualification: teacher.qualification,
        joinDate: teacher.joinDate
      });
      setIsTeacherModalOpen(true);
    }
  };

  const handleDeleteTeacher = (teacherId: string) => {
    if (window.confirm('Are you sure you want to delete this teacher?')) {
      const updatedTeachers = teachers.filter(teacher => teacher.id !== teacherId);
      setTeachers(updatedTeachers);
    }
  };

  const handleViewTeacherDetails = (teacherId: string) => {
    navigate(`/teachers/${teacherId}`);
  };
  
  const handleSaveTeacher = (teacherData: TeacherFormData) => {
    if (teacherData.id) {
      // Update existing teacher
      setTeachers(prevTeachers => 
        prevTeachers.map(teacher => 
          teacher.id === teacherData.id ? 
          {
            ...teacher,
            ...teacherData,
            // Ensure students array is preserved
            students: teacher.students
          } : teacher
        )
      );
    } else {
      // Add new teacher with empty students array
      const newTeacher: Teacher = {
        ...teacherData,
        id: `T${Math.floor(1000 + Math.random() * 9000)}`,
        students: []
      };
      setTeachers(prevTeachers => [...prevTeachers, newTeacher]);
    }
  };

  const handleImportTeachers = (importedData: any[]) => {
    // Here you would typically process and save the imported teachers to your backend
    console.log('Importing teachers:', importedData);
    
    // For demo purposes, we'll just show an alert
    alert(`${importedData.length} teachers imported successfully!`);
  };

  return (
    <div className="space-y-6">
      {/* Teacher Modal */}
      <TeacherModal
        isOpen={isTeacherModalOpen}
        onClose={() => setIsTeacherModalOpen(false)}
        onSave={handleSaveTeacher}
        teacher={selectedTeacher}
      />
      
      {/* Import Modal */}
      <ImportModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        onImport={handleImportTeachers}
        type="teachers"
      />
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {institutionParam ? `Teachers - ${decodeURIComponent(institutionParam)}` : 'All Teachers'}
        </h1>
        <div className="flex space-x-2">
          <button 
            onClick={() => setShowImportModal(true)}
            className="bg-green-600 dark:bg-green-700 text-white px-4 py-2 rounded-md hover:bg-green-700 dark:hover:bg-green-800 transition-colors duration-300 flex items-center gap-2"
          >
            <Upload className="h-4 w-4" />
            Import Teachers
          </button>
          <button 
            onClick={handleAddTeacher}
            className="bg-indigo-600 dark:bg-indigo-700 text-white px-4 py-2 rounded-md hover:bg-indigo-700 dark:hover:bg-indigo-800 transition-colors duration-300 flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Teacher
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-300 h-5 w-5" />
            <input
              type="text"
              placeholder="Search teachers..."
              className="pl-10 w-full border dark:border-gray-600 rounded-md px-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="text-gray-400 dark:text-gray-300 h-5 w-5" />
            <select
              className="border dark:border-gray-600 rounded-md px-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
            >
              {departmentNames.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Dashboard Counters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 transform transition-all duration-300 hover:shadow-md">
          <div className="flex items-center gap-4">
            <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-lg">
              <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-300">Total Teachers</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                <CountUp end={teachers.length} separator="," duration={2} />
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 transform transition-all duration-300 hover:shadow-md">
          <div className="flex items-center gap-4">
            <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-lg">
              <Building2 className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-300">Total Institutions</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                <CountUp end={new Set(teachers.map(t => t.institution)).size} duration={2} />
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 transform transition-all duration-300 hover:shadow-md">
          <div className="flex items-center gap-4">
            <div className="bg-pink-100 dark:bg-pink-900/30 p-3 rounded-lg">
              <GraduationCap className="h-6 w-6 text-pink-600 dark:text-pink-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-300">Total Countries</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                <CountUp end={3} duration={2} />
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Teachers List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden mt-6">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
            <Users className="w-5 h-5 mr-2" />
            {institutionParam ? `Teachers at ${decodeURIComponent(institutionParam)}` : 'All Teachers'}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Click on a teacher to view their detailed performance</p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('name')}
                >
                  <div className="flex items-center gap-1">
                    Name
                    {sortConfig.key === 'name' && (
                      <span>{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('department')}
                >
                  <div className="flex items-center gap-1">
                    Department
                    {sortConfig.key === 'department' && (
                      <span>{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Subjects</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Students</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Institution</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredTeachers.length > 0 ? (
                filteredTeachers.map((teacher) => (
                  <tr 
                    key={teacher.id} 
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors duration-200"
                    onClick={() => handleViewTeacherDetails(teacher.id)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-300 font-semibold">
                          {teacher.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">{teacher.name}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-300">{teacher.qualification}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">{teacher.department}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-wrap gap-1">
                        {teacher.subjects.map((subject, index) => (
                          <span 
                            key={index} 
                            className="px-2 py-1 text-xs rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300"
                          >
                            {subject}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Users className="h-4 w-4 text-gray-500 dark:text-gray-400 mr-1" />
                        <span className="text-sm text-gray-900 dark:text-white">{teacher.students.length}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">{teacher.institution}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2" onClick={(e) => e.stopPropagation()}>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditTeacher(teacher.id);
                          }} 
                          className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteTeacher(teacher.id);
                          }} 
                          className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
                        >
                          <Trash className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                    No teachers found. Try adjusting your filters or add a new teacher.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}