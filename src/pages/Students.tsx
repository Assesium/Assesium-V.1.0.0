import { useState, useEffect } from 'react';
import { Search, Filter, Download, Eye, Plus, Upload, Users, Building2, GraduationCap } from 'lucide-react';
import StudentModal, { StudentFormData } from '../components/StudentModal';
import { students, subjects, educationLevels } from '../data/students';
import { institutions, countries } from '../data/institutions';
import { generateReport } from '../components/ReportGenerator';
import { useNavigate, useLocation } from 'react-router-dom';
import ImportModal from '../components/ImportModal';
import CountUp from 'react-countup';

export default function Students() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const institutionParam = queryParams.get('institution');
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedInstitution, setSelectedInstitution] = useState(institutionParam ? decodeURIComponent(institutionParam) : 'All Institutions');
  const [selectedCountry, setSelectedCountry] = useState('All Countries');
  const [selectedStatus, setSelectedStatus] = useState('All Status');
  const [selectedSubject, setSelectedSubject] = useState('All Subjects');
  const [selectedLevel, setSelectedLevel] = useState('All Levels');
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<StudentFormData | undefined>(undefined);
  const [showImportModal, setShowImportModal] = useState(false);
  
  // Update selected institution when URL parameter changes
  useEffect(() => {
    if (institutionParam) {
      const decodedInstitution = decodeURIComponent(institutionParam);
      setSelectedInstitution(decodedInstitution);
    }
  }, [institutionParam]);

  const filteredStudents = students.filter(student => 
    (selectedInstitution === 'All Institutions' || student.institution === selectedInstitution) &&
    (selectedCountry === 'All Countries' || institutions.find(inst => inst.name === student.institution)?.country === selectedCountry) &&
    (selectedStatus === 'All Status' || student.subjects.some(subj => subj.status === selectedStatus)) &&
    (selectedSubject === 'All Subjects' || student.subjects.some(subj => subj.name === selectedSubject)) &&
    (selectedLevel === 'All Levels' || (student.level && student.level === selectedLevel)) &&
    (searchTerm === '' || 
     student.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
     student.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
     student.institution.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleGenerateReport = (student: typeof students[0]) => {
    generateReport({
      studentName: student.name,
      studentId: student.id,
      institution: student.institution,
      subjects: student.subjects.map(s => ({
        name: s.name,
        score: s.score,
        date: s.date
      }))
    });
  };

  const handleSaveStudent = (studentData: StudentFormData) => {
    // Here you would typically save the student data to your backend or state management
    console.log('Saving student:', studentData);
    
    // For demo purposes, we'll just show an alert
    alert(`Student ${studentData.name} saved successfully!`);
    
    // Close the modal
    setShowStudentModal(false);
  };

  const handleImportStudents = (importedData: any[]) => {
    // Here you would typically process and save the imported students to your backend
    console.log('Importing students:', importedData);
    
    // For demo purposes, we'll just show an alert
    alert(`${importedData.length} students imported successfully!`);
  };

  return (
    <div className="space-y-6">
      {/* Student Modal */}
      <StudentModal
        isOpen={showStudentModal}
        onClose={() => setShowStudentModal(false)}
        onSave={handleSaveStudent}
        student={selectedStudent}
      />
      
      {/* Import Modal */}
      <ImportModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        onImport={handleImportStudents}
        type="students"
      />
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {institutionParam ? `Students - ${decodeURIComponent(institutionParam)}` : 'All Students'}
        </h1>
        <div className="flex space-x-2">
          <button 
            onClick={() => setShowImportModal(true)}
            className="bg-green-600 dark:bg-green-700 text-white px-4 py-2 rounded-md hover:bg-green-700 dark:hover:bg-green-800 transition-colors duration-300 flex items-center gap-2"
          >
            <Upload className="h-4 w-4" />
            Import Students
          </button>
          <button 
            onClick={() => setShowStudentModal(true)}
            className="bg-indigo-600 dark:bg-indigo-700 text-white px-4 py-2 rounded-md hover:bg-indigo-700 dark:hover:bg-indigo-800 transition-colors duration-300 flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Student
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
              placeholder="Search students..."
              className="pl-10 w-full border dark:border-gray-600 rounded-md px-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="text-gray-400 dark:text-gray-300 h-5 w-5" />
            <select 
              className="border dark:border-gray-600 rounded-md px-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              value={selectedInstitution}
              onChange={(e) => setSelectedInstitution(e.target.value)}
            >
              <option>All Institutions</option>
              {institutions.map(inst => (
                <option key={inst.id}>{inst.name}</option>
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
              <p className="text-sm text-gray-500 dark:text-gray-300">Total Students</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                <CountUp end={students.length} separator="," duration={2} />
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
                <CountUp end={new Set(students.map(s => s.institution)).size} duration={2} />
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
                <CountUp end={countries.length} duration={2} />
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 transition-colors duration-300">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="text-gray-400 dark:text-gray-300 h-5 w-5" />
            <select 
              className="border dark:border-gray-600 rounded-md px-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
            >
              <option>All Countries</option>
              {countries.map(country => (
                <option key={country}>{country}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <Filter className="text-gray-400 dark:text-gray-300 h-5 w-5" />
            <select 
              className="border dark:border-gray-600 rounded-md px-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
            >
              <option>All Levels</option>
              {educationLevels.map(level => (
                <option key={level}>{level}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <Filter className="text-gray-400 dark:text-gray-300 h-5 w-5" />
            <select 
              className="border dark:border-gray-600 rounded-md px-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option>All Status</option>
              <option>Completed</option>
              <option>Under Review</option>
              <option>Processing</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <Filter className="text-gray-400 dark:text-gray-300 h-5 w-5" />
            <select 
              className="border dark:border-gray-600 rounded-md px-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
            >
              <option>All Subjects</option>
              {subjects.map(subject => (
                <option key={subject}>{subject}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Students List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden mt-6">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
            <Users className="w-5 h-5 mr-2" />
            {institutionParam ? `Students at ${decodeURIComponent(institutionParam)}` : 'All Students'}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Click on a student to view their detailed performance</p>
        </div>
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Student</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Institution</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Latest Subject</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Score</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {filteredStudents.map((student) => (
              <tr key={student.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-300">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center text-gray-600 dark:text-gray-200 font-semibold">
                      {student.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">{student.name}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{student.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{student.institution}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{student.subjects[0].name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{student.subjects[0].score}/100</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    student.subjects[0].status === 'Completed' 
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' 
                      : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300'
                  }`}>
                    {student.subjects[0].status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-4">
                    <button 
                      onClick={() => navigate(`/students/${student.id}`)}
                      className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300 inline-flex items-center gap-1 transition-colors duration-300"
                    >
                      <Eye className="h-4 w-4" />
                      View
                    </button>
                    <button 
                      onClick={() => handleGenerateReport(student)}
                      className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300 inline-flex items-center gap-1 transition-colors duration-300"
                    >
                      <Download className="h-4 w-4" />
                      Report
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}