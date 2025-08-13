import { useParams } from 'react-router-dom';
import { Download, Mail, Phone, Eye } from 'lucide-react';
import { DynamicChart } from '../components/charts/DynamicChart';
import { students } from '../data/students';
import { generateReport } from '../components/ReportGenerator';
import { useState } from 'react';
import ExamDetailsModal from '../components/ExamDetailsModal';

export default function StudentDetails() {
  const { id } = useParams<{ id: string }>();
  const student = students.find(s => s.id === id);
  const [activeTab, setActiveTab] = useState('Academic Performance');
  const [isExamModalOpen, setIsExamModalOpen] = useState(false);
  const [selectedExam, setSelectedExam] = useState<any>(null);

  if (!student) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-gray-500">Student not found</p>
      </div>
    );
  }

  const performanceData = {
    labels: ['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'],
    datasets: [{
      label: 'Student Score',
      data: [72, 75, 80, 78, 82, 85, 87],
      borderColor: '#4361ee',
      backgroundColor: 'rgba(67, 97, 238, 0.1)',
      tension: 0.3,
      fill: true
    },
    {
      label: 'Class Average',
      data: [68, 70, 72, 75, 73, 76, 76],
      borderColor: '#f72585',
      borderDash: [5, 5],
      backgroundColor: 'transparent',
      tension: 0.3,
      fill: false
    }]
  };

  const subjectData = {
    labels: ['Mathematics', 'English', 'Physics', 'Chemistry', 'Biology', 'History'],
    datasets: [{
      label: 'Student Score',
      data: student.subjects.map(s => s.score),
      backgroundColor: 'rgba(67, 97, 238, 0.2)',
      borderColor: '#4361ee',
      pointBackgroundColor: '#4361ee',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: '#4361ee',
      borderWidth: 2,
      fill: true
    },
    {
      label: 'Class Average',
      data: [75, 78, 72, 70, 76, 74],
      backgroundColor: 'rgba(247, 37, 133, 0.1)',
      borderColor: '#f72585',
      pointBackgroundColor: '#f72585',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: '#f72585',
      borderWidth: 2,
      borderDash: [5, 5],
      fill: true
    }]
  };
  
  const progressTrendData = {
    labels: ['Term 1', 'Term 2', 'Term 3', 'Term 4'],
    datasets: [
      {
        label: 'Mathematics',
        data: [75, 78, 82, 85],
        backgroundColor: '#4361ee'
      },
      {
        label: 'English',
        data: [82, 85, 88, 90],
        backgroundColor: '#f72585'
      },
      {
        label: 'Physics',
        data: [70, 75, 80, 82],
        backgroundColor: '#4cc9f0'
      },
      {
        label: 'Chemistry',
        data: [76, 78, 80, 83],
        backgroundColor: '#3a0ca3'
      }
    ]
  };
  
  const handleViewExamDetails = (subject: any) => {
    // Create mock exam data based on the subject
    const examData = {
      examName: `${subject.name} Exam`,
      studentName: student.name,
      studentId: student.id,
      institution: student.institution,
      className: '12-A',
      examType: subject.name === 'Mathematics' ? 'Mid-Term' : 
                subject.name === 'English' ? 'Essay' : 
                subject.name === 'Physics' ? 'Practical' : 'Quiz',
      date: subject.date,
      score: `${subject.score}/100`,
      grade: subject.score >= 85 ? 'A' : subject.score >= 75 ? 'B+' : subject.score >= 70 ? 'B' : 'C',
      performance: '+11%',
      sections: [
        { name: 'Algebra', score: '18/20', weight: '20%' },
        { name: 'Calculus', score: '26/30', weight: '30%' },
        { name: 'Geometry', score: '23/30', weight: '30%' },
        { name: 'Statistics', score: '20/20', weight: '20%' }
      ],
      feedback: `${student.name.split(' ')[0]} demonstrates excellent understanding of mathematical concepts, particularly in Algebra and Statistics where ${student.name.split(' ')[0].endsWith('s') ? 'their' : 'his/her'} scores are very high marks. ${student.name.split(' ')[0].endsWith('s') ? 'Their' : 'His/Her'} work in Calculus is strong, but there are opportunities for improvement in handling advanced calculus problems. The AI suggests additional practice in this area. Overall, ${student.name.split(' ')[0]}'s performance is well above the class average, indicating strong mathematical aptitude.`
    };
    
    setSelectedExam(examData);
    setIsExamModalOpen(true);
  };
  
  const recentExams = [
    { date: 'Mar 15, 2025', subject: 'Mathematics', type: 'Mid-Term', score: '87/100', grade: 'A', classAvg: '76/100' },
    { date: 'Mar 10, 2025', subject: 'English', type: 'Essay', score: '92/100', grade: 'A+', classAvg: '83/100' },
    { date: 'Mar 05, 2025', subject: 'Physics', type: 'Practical', score: '79/100', grade: 'B+', classAvg: '72/100' },
    { date: 'Feb 28, 2025', subject: 'Chemistry', type: 'Quiz', score: '85/100', grade: 'A', classAvg: '69/100' }
  ];
  
  const tabs = ['Academic Performance', 'Exam History', 'Subject Analysis', 'Documents'];

  return (
    <div className="space-y-6">
      {/* Student Profile Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          <div className="flex-shrink-0">
            <div className="h-24 w-24 rounded-full bg-indigo-600 flex items-center justify-center">
              <span className="text-2xl font-bold text-white">
                {student.name.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
          </div>
          <div className="flex-grow text-center md:text-left">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{student.name}</h2>
            <p className="text-gray-500 dark:text-gray-400">{student.id}</p>
            <button 
              onClick={() => {
                // Open email client with student email
                window.open(`mailto:${student.name.toLowerCase().replace(' ', '.')}@student.example.com`);
              }}
              className="mt-2 bg-indigo-600 dark:bg-indigo-700 text-white px-4 py-2 rounded-md hover:bg-indigo-700 dark:hover:bg-indigo-800 text-sm transition-colors duration-300"
            >
              Contact Student
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4 md:gap-6 mt-4 md:mt-0">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Institution</p>
              <p className="font-medium text-gray-900 dark:text-white">{student.institution}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Level</p>
              <p className="font-medium text-gray-900 dark:text-white">Senior Secondary</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Class</p>
              <p className="font-medium text-gray-900 dark:text-white">12-A</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Age</p>
              <p className="font-medium text-gray-900 dark:text-white">17</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Gender</p>
              <p className="font-medium text-gray-900 dark:text-white">Male</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Enrolled Since</p>
              <p className="font-medium text-gray-900 dark:text-white">Sep 2023</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === tab
                ? 'border-indigo-600 dark:border-indigo-400 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'Academic Performance' && (
          <div className="space-y-6">
            {/* Performance Overview */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Performance Overview</h3>
                <select className="border dark:border-gray-600 rounded-md px-3 py-1.5 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                  <option>All Terms</option>
                  <option>Term 1</option>
                  <option>Term 2</option>
                  <option>Term 3</option>
                </select>
              </div>
              <div className="h-80">
                <DynamicChart type="line" data={performanceData} />
              </div>
            </div>

            {/* Two Charts in Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Subject Comparison */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Subject Comparison</h3>
                </div>
                <div className="h-80">
                  <DynamicChart type="radar" data={subjectData} />
                </div>
              </div>

              {/* Progress Trend */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Progress Trend</h3>
                </div>
                <div className="h-80">
                  <DynamicChart type="bar" data={progressTrendData} />
                </div>
              </div>
            </div>

            {/* Recent Assessment Results */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Assessment Results</h3>
                <button className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300 inline-flex items-center gap-1 text-sm">
                  <Download className="h-4 w-4" />
                  Download Report
                </button>
              </div>
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Subject</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Exam Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Score</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Grade</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Class Average</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {recentExams.map((exam, index) => (
                    <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {exam.date}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {exam.subject}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {exam.type}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {exam.score}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {exam.grade}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {exam.classAvg}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button 
                          onClick={() => handleViewExamDetails({
                            name: exam.subject,
                            score: parseInt(exam.score.split('/')[0]),
                            date: exam.date,
                            status: 'Completed'
                          })}
                          className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300 inline-flex items-center gap-1"
                        >
                          <Eye className="h-4 w-4" />
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'Exam History' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Exam History</h3>
                <div className="flex items-center gap-3">
                  <select className="border dark:border-gray-600 rounded-md px-3 py-1.5 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                    <option>All Subjects</option>
                    <option>Mathematics</option>
                    <option>English</option>
                    <option>Physics</option>
                    <option>Chemistry</option>
                    <option>Biology</option>
                  </select>
                  <select className="border dark:border-gray-600 rounded-md px-3 py-1.5 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                    <option>All Terms</option>
                    <option>Term 1</option>
                    <option>Term 2</option>
                    <option>Term 3</option>
                    <option>Term 4</option>
                  </select>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Subject</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Exam Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Score</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Grade</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Class Average</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {[
                      { date: 'Mar 15, 2025', subject: 'Mathematics', type: 'Mid-Term', score: '87/100', grade: 'A', classAvg: '76/100' },
                      { date: 'Mar 10, 2025', subject: 'English', type: 'Essay', score: '92/100', grade: 'A+', classAvg: '83/100' },
                      { date: 'Mar 05, 2025', subject: 'Physics', type: 'Practical', score: '79/100', grade: 'B+', classAvg: '72/100' },
                      { date: 'Feb 28, 2025', subject: 'Chemistry', type: 'Quiz', score: '85/100', grade: 'A', classAvg: '69/100' },
                      { date: 'Feb 20, 2025', subject: 'Biology', type: 'Mid-Term', score: '81/100', grade: 'A-', classAvg: '74/100' },
                      { date: 'Feb 15, 2025', subject: 'Mathematics', type: 'Quiz', score: '83/100', grade: 'B+', classAvg: '75/100' },
                      { date: 'Feb 10, 2025', subject: 'English', type: 'Presentation', score: '88/100', grade: 'A', classAvg: '79/100' },
                      { date: 'Feb 05, 2025', subject: 'Physics', type: 'Quiz', score: '76/100', grade: 'B', classAvg: '70/100' },
                      { date: 'Jan 28, 2025', subject: 'Chemistry', type: 'Lab Report', score: '82/100', grade: 'B+', classAvg: '71/100' },
                      { date: 'Jan 20, 2025', subject: 'Biology', type: 'Quiz', score: '79/100', grade: 'B+', classAvg: '73/100' },
                    ].map((exam, index) => (
                      <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {exam.date}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                          {exam.subject}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {exam.type}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {exam.score}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {exam.grade}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {exam.classAvg}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button 
                            onClick={() => handleViewExamDetails({
                              name: exam.subject,
                              score: parseInt(exam.score.split('/')[0]),
                              date: exam.date,
                              status: 'Completed'
                            })}
                            className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300 inline-flex items-center gap-1"
                          >
                            <Eye className="h-4 w-4" />
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="mt-6 flex justify-between items-center">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Showing 10 of 42 exams
                </div>
                <div className="flex space-x-2">
                  <button className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
                    Previous
                  </button>
                  <button className="px-3 py-1 bg-indigo-600 text-white rounded-md text-sm hover:bg-indigo-700">
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'Subject Analysis' && (
          <div className="space-y-6">
            {/* Subject Performance Overview */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Subject Performance Overview</h3>
                <select className="border dark:border-gray-600 rounded-md px-3 py-1.5 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                  <option>All Terms</option>
                  <option>Term 1</option>
                  <option>Term 2</option>
                  <option>Term 3</option>
                </select>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {student.subjects.map((subject, index) => (
                  <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium text-gray-900 dark:text-white">{subject.name}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${subject.score >= 80 ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' : subject.score >= 70 ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300' : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300'}`}>
                        {subject.score >= 80 ? 'Excellent' : subject.score >= 70 ? 'Good' : 'Average'}
                      </span>
                    </div>
                    <div className="flex items-center mb-2">
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">{subject.score}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 ml-2">/ 100</div>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2 mb-4">
                      <div 
                        className={`h-2 rounded-full ${subject.score >= 80 ? 'bg-green-500' : subject.score >= 70 ? 'bg-blue-500' : 'bg-yellow-500'}`} 
                        style={{ width: `${subject.score}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-sm">
                      <div>
                        <div className="text-gray-500 dark:text-gray-400">Class Avg</div>
                        <div className="font-medium text-gray-900 dark:text-white">{subject.score - Math.floor(Math.random() * 10)}</div>
                      </div>
                      <div>
                        <div className="text-gray-500 dark:text-gray-400">Rank</div>
                        <div className="font-medium text-gray-900 dark:text-white">{Math.floor(Math.random() * 5) + 1}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'Documents' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Documents</h3>
            <p className="text-gray-500 dark:text-gray-400">Student documents will be displayed here.</p>
          </div>
        )}
      </div>

      {/* Exam Details Modal */}
      {selectedExam && (
        <ExamDetailsModal 
          isOpen={isExamModalOpen} 
          onClose={() => setIsExamModalOpen(false)} 
          examData={selectedExam} 
        />
      )}
    </div>
  );
}