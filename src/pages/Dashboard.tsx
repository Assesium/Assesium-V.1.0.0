import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart3, Users, Building2, Clock3 } from 'lucide-react';
import { DynamicChart } from '../components/charts/DynamicChart';
import { students } from '../data/students';
import { institutions } from '../data/institutions';
import CountUp from 'react-countup';

export default function Dashboard() {
  const navigate = useNavigate();
  const [timeRange, setTimeRange] = useState('Last 7 Days');
  const [selectedInstitution, setSelectedInstitution] = useState('All Institutions');
  const [totalStudents, setTotalStudents] = useState(13426348);
  const [totalInstitutions, setTotalInstitutions] = useState(2684);
  const [examsProcessed, setExamsProcessed] = useState(3580384);

  useEffect(() => {
    const interval = setInterval(() => {
      setTotalStudents(prev => prev + Math.floor(Math.random() * 5));
      setTotalInstitutions(prev => prev + Math.floor(Math.random() * 1));
      setExamsProcessed(prev => prev + Math.floor(Math.random() * 8));
    }, 120000);
    return () => clearInterval(interval);
  }, []);
  const performanceData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Average Score',
        data: [78, 82, 80, 85, 83, 87],
        borderColor: '#4361ee',
        backgroundColor: 'rgba(67, 97, 238, 0.1)',
        tension: 0.3,
        fill: true,
        pointRadius: 4,
        pointHoverRadius: 6
      },
      {
        label: 'Pass Rate',
        data: [85, 88, 84, 89, 91, 92],
        borderColor: '#f72585',
        backgroundColor: 'rgba(247, 37, 133, 0.1)',
        tension: 0.3,
        fill: true,
        pointRadius: 4,
        pointHoverRadius: 6
      }
    ]
  };

  const subjectData = {
    labels: ['Mathematics', 'English', 'Science', 'History', 'Geography', 'Art'],
    datasets: [{
      data: [25, 20, 18, 15, 12, 10],
      backgroundColor: [
        '#4361ee',
        '#3a0ca3',
        '#f72585',
        '#4cc9f0',
        '#ffbe0b',
        '#7209b7'
      ],
      borderColor: '#ffffff',
      borderWidth: 2,
      hoverOffset: 4,
      hoverBorderWidth: 3
    }]
  };

  return (
    <div className="space-y-8 p-6">
      <div className="space-y-6 max-w-[1400px] mx-auto">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div
            onClick={() => navigate('/students')}
            className="bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700 rounded-2xl shadow-xl p-6 transform transition-all duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-blue-100">Total Students</p>
                <p className="text-3xl font-bold text-white mt-2">
                  <CountUp end={totalStudents} separator="," duration={5} />
                </p>
              </div>
              <div className="bg-blue-400/30 p-2 rounded-lg">
                <Users className="h-5 w-5 text-white" />
              </div>
            </div>
            <div className="mt-2 flex items-center text-xs text-blue-100">
              <span>↑ 12% from last month</span>
            </div>
          </div>
      
          <div
            onClick={() => navigate('/institutions')}
            className="bg-gradient-to-br from-purple-500 via-purple-600 to-fuchsia-700 rounded-2xl shadow-xl p-6 transform transition-all duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-purple-100">Institutions</p>
                <p className="text-3xl font-bold text-white mt-2">
                  <CountUp end={totalInstitutions} separator="," duration={5} />
                </p>
              </div>
              <div className="bg-purple-400/30 p-2 rounded-lg">
                <Building2 className="h-5 w-5 text-white" />
              </div>
            </div>
            <div className="mt-2 flex items-center text-xs text-purple-100">
              <span>↑ 8% from last month</span>
            </div>
          </div>
      
          <div
            onClick={() => navigate('/ai-processing')}
            title="Click to view AI Processing details"
            className="bg-gradient-to-br from-pink-500 via-pink-600 to-rose-700 rounded-2xl shadow-xl p-6 transform transition-all duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-pink-100">Exams Processed</p>
                <p className="text-3xl font-bold text-white mt-2">
                  <CountUp end={examsProcessed} separator="," duration={2} />
                </p>
              </div>
              <div className="bg-pink-400/30 p-2 rounded-lg">
                <BarChart3 className="h-5 w-5 text-white" />
              </div>
            </div>
            <div className="mt-2 flex items-center text-xs text-pink-100">
              <span>↑ 15% from last month</span>
            </div>
          </div>
      
          <div
            onClick={() => navigate('/reports')}
            className="bg-gradient-to-br from-cyan-500 via-cyan-600 to-teal-700 rounded-2xl shadow-xl p-6 transform transition-all duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-cyan-100">Avg. Processing Time</p>
                <p className="text-3xl font-bold text-white mt-2">1.2h</p>
              </div>
              <div className="bg-cyan-400/30 p-2 rounded-lg">
                <Clock3 className="h-5 w-5 text-white" />
              </div>
            </div>
            <div className="mt-2 flex items-center text-xs text-cyan-100">
              <span>↓ 15% from last month</span>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 px-2">
        <div className="bg-gradient-to-br from-white to-blue-50 dark:from-gray-800 dark:to-gray-700 rounded-xl shadow-lg p-4 transform transition-all duration-200 hover:translate-y-[-2px]">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-base font-semibold text-gray-800 dark:text-white">Performance Trends</h3>
            <select 
              className="border dark:border-gray-600 rounded-lg px-2 py-1 text-xs bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-800 dark:text-white transition-colors"
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
            >
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
              <option>Last 90 Days</option>
            </select>
          </div>
          <div className="h-[300px]">
            <DynamicChart type="line" data={performanceData} />
          </div>
        </div>

        <div className="bg-gradient-to-br from-white to-purple-50 dark:from-gray-800 dark:to-gray-700 rounded-xl shadow-lg p-4 transform transition-all duration-200 hover:translate-y-[-2px]">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-base font-semibold text-gray-800 dark:text-white">Subject Distribution</h3>
            <select 
              className="border dark:border-gray-600 rounded-lg px-2 py-1 text-xs bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-800 dark:text-white transition-colors"
              value={selectedInstitution}
              onChange={(e) => setSelectedInstitution(e.target.value)}>
              <option>All Institutions</option>
              {institutions.map(inst => (
                <option key={inst.id}>{inst.name}</option>
              ))}
            </select>
          </div>
          <div className="h-[350px]">
            <DynamicChart type="doughnut" data={subjectData} />
          </div>
        </div>
      </div>

      {/* Recent Exam Results Table */}
      <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 rounded-xl shadow-lg p-4 transition-colors duration-300">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
          <h3 className="text-base font-semibold text-gray-800 dark:text-white">Recent Exam Results</h3>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <input 
              type="text" 
              placeholder="Search by name or ID..." 
              className="border dark:border-gray-600 rounded-lg px-2 py-1 text-xs w-full sm:w-auto bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
            <select 
              className="border dark:border-gray-600 rounded-lg px-2 py-1 text-xs bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors w-full sm:w-auto text-gray-900 dark:text-white"
              value={selectedInstitution}
              onChange={(e) => setSelectedInstitution(e.target.value)}>
              <option>All Institutions</option>
              {institutions.map(inst => (
                <option key={inst.id}>{inst.name}</option>
              ))}
            </select>
            <button className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white px-3 py-1 rounded-lg text-xs transition-colors">
              Filter
            </button>
          </div>
        </div>

        <div className="overflow-x-auto rounded-lg">
          <table className="w-full text-xs">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-3 py-2 text-left font-medium text-gray-500 dark:text-gray-300">Student</th>
                <th className="px-3 py-2 text-left font-medium text-gray-500 dark:text-gray-300">ID</th>
                <th className="px-3 py-2 text-left font-medium text-gray-500 dark:text-gray-300">Institution</th>
                <th className="px-3 py-2 text-left font-medium text-gray-500 dark:text-gray-300">Subject</th>
                <th className="px-3 py-2 text-left font-medium text-gray-500 dark:text-gray-300">Score</th>
                <th className="px-3 py-2 text-left font-medium text-gray-500 dark:text-gray-300">Grade</th>
                <th className="px-3 py-2 text-left font-medium text-gray-500 dark:text-gray-300">Status</th>
                <th className="px-3 py-2 text-left font-medium text-gray-500 dark:text-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-100 dark:divide-gray-700">
              {/* JD - Shan McCartney */}
              <tr className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer" onClick={() => navigate(`/students/S10045`)}>
                <td className="px-3 py-2 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center text-gray-600 dark:text-gray-200 text-xs font-medium">
                      JD
                    </div>
                    <div className="ml-2">
                      <div className="font-medium text-gray-900 dark:text-white">Shan McCartney</div>
                    </div>
                  </div>
                </td>
                <td className="px-3 py-2 whitespace-nowrap text-gray-500">S10045</td>
                <td className="px-3 py-2 whitespace-nowrap text-gray-500">Cambridge High School</td>
                <td className="px-3 py-2 whitespace-nowrap text-gray-500">Mathematics</td>
                <td className="px-3 py-2 whitespace-nowrap text-gray-500">87/100</td>
                <td className="px-3 py-2 whitespace-nowrap text-gray-500">A</td>
                <td className="px-3 py-2 whitespace-nowrap">
                  <span className="px-2 py-1 text-[10px] font-medium rounded-full bg-blue-100 text-blue-800">
                    Completed
                  </span>
                </td>
                <td className="px-3 py-2 whitespace-nowrap">
                  <div className="flex space-x-2">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/students/S10045`);
                      }} 
                      className="p-1 text-blue-600 hover:text-blue-800 transition-colors"
                      title="View Details"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                      </svg>
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        // Download functionality would go here
                      }} 
                      className="p-1 text-blue-600 hover:text-blue-800 transition-colors"
                      title="Download Report"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                        <polyline points="7 10 12 15 17 10"></polyline>
                        <line x1="12" y1="15" x2="12" y2="3"></line>
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
              
              {/* AJ - Alice Johnson */}
              <tr className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer" onClick={() => navigate(`/students/S10046`)}>
                <td className="px-3 py-2 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center text-gray-600 dark:text-gray-200 text-xs font-medium">
                      AJ
                    </div>
                    <div className="ml-2">
                      <div className="font-medium text-gray-900 dark:text-white">Alice Johnson</div>
                    </div>
                  </div>
                </td>
                <td className="px-3 py-2 whitespace-nowrap text-gray-500 dark:text-gray-300">S10046</td>
                <td className="px-3 py-2 whitespace-nowrap text-gray-500 dark:text-gray-300">Cambridge High School</td>
                <td className="px-3 py-2 whitespace-nowrap text-gray-500 dark:text-gray-300">English Literature</td>
                <td className="px-3 py-2 whitespace-nowrap text-gray-500 dark:text-gray-300">92/100</td>
                <td className="px-3 py-2 whitespace-nowrap text-gray-500 dark:text-gray-300">A+</td>
                <td className="px-3 py-2 whitespace-nowrap">
                  <span className="px-2 py-1 text-[10px] font-medium rounded-full bg-blue-100 text-blue-800">
                    Completed
                  </span>
                </td>
                <td className="px-3 py-2 whitespace-nowrap">
                  <div className="flex space-x-2">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/students/S10046`);
                      }} 
                      className="p-1 text-blue-600 hover:text-blue-800 transition-colors"
                      title="View Details"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                      </svg>
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        // Download functionality would go here
                      }} 
                      className="p-1 text-blue-600 hover:text-blue-800 transition-colors"
                      title="Download Report"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                        <polyline points="7 10 12 15 17 10"></polyline>
                        <line x1="12" y1="15" x2="12" y2="3"></line>
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
              
              {/* MS - Michael Williams Jr */}
              <tr className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer" onClick={() => navigate(`/students/S10047`)}>
                <td className="px-3 py-2 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center text-gray-600 dark:text-gray-200 text-xs font-medium">
                      MS
                    </div>
                    <div className="ml-2">
                      <div className="font-medium text-gray-900 dark:text-white">Michael Williams Jr</div>
                    </div>
                  </div>
                </td>
                <td className="px-3 py-2 whitespace-nowrap text-gray-500 dark:text-gray-300">S10047</td>
                <td className="px-3 py-2 whitespace-nowrap text-gray-500 dark:text-gray-300">Oxford Academy</td>
                <td className="px-3 py-2 whitespace-nowrap text-gray-500 dark:text-gray-300">Physics</td>
                <td className="px-3 py-2 whitespace-nowrap text-gray-500 dark:text-gray-300">78/100</td>
                <td className="px-3 py-2 whitespace-nowrap text-gray-500 dark:text-gray-300">B+</td>
                <td className="px-3 py-2 whitespace-nowrap">
                  <span className="px-2 py-1 text-[10px] font-medium rounded-full bg-blue-100 text-blue-800">
                    Completed
                  </span>
                </td>
                <td className="px-3 py-2 whitespace-nowrap">
                  <div className="flex space-x-2">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/students/S10047`);
                      }} 
                      className="p-1 text-blue-600 hover:text-blue-800 transition-colors"
                      title="View Details"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                      </svg>
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        // Download functionality would go here
                      }} 
                      className="p-1 text-blue-600 hover:text-blue-800 transition-colors"
                      title="Download Report"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                        <polyline points="7 10 12 15 17 10"></polyline>
                        <line x1="12" y1="15" x2="12" y2="3"></line>
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
              
              {/* EW - Emily Williams */}
              <tr className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer" onClick={() => navigate(`/students/S10048`)}>
                <td className="px-3 py-2 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center text-gray-600 dark:text-gray-200 text-xs font-medium">
                      EW
                    </div>
                    <div className="ml-2">
                      <div className="font-medium text-gray-900">Emily Williams</div>
                    </div>
                  </div>
                </td>
                <td className="px-3 py-2 whitespace-nowrap text-gray-500 dark:text-gray-300">S10048</td>
                <td className="px-3 py-2 whitespace-nowrap text-gray-500 dark:text-gray-300">Stanford University</td>
                <td className="px-3 py-2 whitespace-nowrap text-gray-500 dark:text-gray-300">Chemistry</td>
                <td className="px-3 py-2 whitespace-nowrap text-gray-500 dark:text-gray-300">65/100</td>
                <td className="px-3 py-2 whitespace-nowrap text-gray-500 dark:text-gray-300">C</td>
                <td className="px-3 py-2 whitespace-nowrap">
                  <span className="px-2 py-1 text-[10px] font-medium rounded-full bg-yellow-100 text-yellow-800">
                    Under Review
                  </span>
                </td>
                <td className="px-3 py-2 whitespace-nowrap">
                  <div className="flex space-x-2">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/students/S10048`);
                      }} 
                      className="p-1 text-blue-600 hover:text-blue-800 transition-colors"
                      title="View Details"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                      </svg>
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        // Download functionality would go here
                      }} 
                      className="p-1 text-blue-600 hover:text-blue-800 transition-colors"
                      title="Download Report"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                        <polyline points="7 10 12 15 17 10"></polyline>
                        <line x1="12" y1="15" x2="12" y2="3"></line>
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
              
              {/* RB - Robert Brown */}
              <tr className="hover:bg-gray-50 cursor-pointer" onClick={() => navigate(`/students/S10049`)}>
                <td className="px-3 py-2 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center text-gray-600 dark:text-gray-200 text-xs font-medium">
                      RB
                    </div>
                    <div className="ml-2">
                      <div className="font-medium text-gray-900">Robert Brown</div>
                    </div>
                  </div>
                </td>
                <td className="px-3 py-2 whitespace-nowrap text-gray-500">S10049</td>
                <td className="px-3 py-2 whitespace-nowrap text-gray-500">Oxford Academy</td>
                <td className="px-3 py-2 whitespace-nowrap text-gray-500">History</td>
                <td className="px-3 py-2 whitespace-nowrap text-gray-500">72/100</td>
                <td className="px-3 py-2 whitespace-nowrap text-gray-500">B</td>
                <td className="px-3 py-2 whitespace-nowrap">
                  <span className="px-2 py-1 text-[10px] font-medium rounded-full bg-red-100 text-red-800">
                    Pending
                  </span>
                </td>
                <td className="px-3 py-2 whitespace-nowrap">
                  <div className="flex space-x-2">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/students/S10049`);
                      }} 
                      className="p-1 text-blue-600 hover:text-blue-800 transition-colors"
                      title="View Details"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                      </svg>
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        // Download functionality would go here
                      }} 
                      className="p-1 text-blue-600 hover:text-blue-800 transition-colors"
                      title="Download Report"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                        <polyline points="7 10 12 15 17 10"></polyline>
                        <line x1="12" y1="15" x2="12" y2="3"></line>
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}