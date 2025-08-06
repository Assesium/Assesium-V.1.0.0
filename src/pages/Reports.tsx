import { useState } from 'react';
import { FileText, Download, Filter } from 'lucide-react';
import { DynamicChart } from '../components/charts/DynamicChart';
import { institutions } from '../data/institutions';

export default function Reports() {
  const [selectedInstitution, setSelectedInstitution] = useState('All Institutions');
  const [selectedTimeframe, setSelectedTimeframe] = useState('Last 30 Days');

  const performanceData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [
      {
        label: 'Mathematics',
        data: [76, 82, 85, 87],
        backgroundColor: '#4361ee'
      },
      {
        label: 'English',
        data: [85, 88, 90, 92],
        backgroundColor: '#f72585'
      },
      {
        label: 'Physics',
        data: [72, 75, 78, 79],
        backgroundColor: '#4cc9f0'
      },
      {
        label: 'Chemistry',
        data: [78, 80, 82, 85],
        backgroundColor: '#3a0ca3'
      }
    ]
  };

  const reports = [
    {
      id: 1,
      name: 'Monthly Performance Analysis',
      institution: 'Cambridge High School',
      date: 'Mar 15, 2025',
      type: 'Performance',
      size: '2.4 MB'
    },
    {
      id: 2,
      name: 'Subject-wise Progress Report',
      institution: 'Oxford Academy',
      date: 'Mar 14, 2025',
      type: 'Progress',
      size: '1.8 MB'
    },
    {
      id: 3,
      name: 'AI Processing Efficiency Report',
      institution: 'Stanford University',
      date: 'Mar 13, 2025',
      type: 'System',
      size: '3.1 MB'
    },
    {
      id: 4,
      name: 'Student Achievement Summary',
      institution: 'MIT Preparatory',
      date: 'Mar 12, 2025',
      type: 'Achievement',
      size: '4.2 MB'
    },
    {
      id: 5,
      name: 'Institutional Comparison Report',
      institution: 'All Institutions',
      date: 'Mar 11, 2025',
      type: 'Comparison',
      size: '5.6 MB'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Reports</h1>
        <button className="bg-indigo-600 dark:bg-indigo-700 text-white px-4 py-2 rounded-md hover:bg-indigo-700 dark:hover:bg-indigo-800 transition-colors duration-300">
          Generate New Report
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
        <div className="flex gap-4">
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
          <div className="flex items-center gap-2">
            <Filter className="text-gray-400 dark:text-gray-300 h-5 w-5" />
            <select 
              className="border dark:border-gray-600 rounded-md px-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              value={selectedTimeframe}
              onChange={(e) => setSelectedTimeframe(e.target.value)}
            >
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
              <option>Last 90 Days</option>
              <option>This Year</option>
            </select>
          </div>
        </div>
      </div>

      {/* Charts Section - Side by Side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Performance Overview */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Performance Overview</h2>
            <button className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300 inline-flex items-center gap-1">
              <Download className="h-4 w-4" />
              Export
            </button>
          </div>
          <div className="h-80">
            <DynamicChart type="bar" data={performanceData} />
          </div>
        </div>
        
        {/* Subject Distribution */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Subject Distribution</h2>
            <button className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300 inline-flex items-center gap-1">
              <Download className="h-4 w-4" />
              Export
            </button>
          </div>
          <div className="h-80">
            <DynamicChart type="doughnut" data={{
              labels: ['Mathematics', 'English', 'Science', 'History', 'Geography', 'Art'],
              datasets: [{
                data: [25, 20, 18, 15, 12, 10],
                backgroundColor: [
                  '#4361ee', // Bright blue
                  '#3a0ca3', // Royal blue
                  '#f72585', // Vibrant pink
                  '#4cc9f0', // Light blue
                  '#ffbe0b', // Bright orange
                  '#7209b7'  // Deep purple
                ],
                hoverOffset: 4
              }]
            }} />
          </div>
        </div>
      </div>

      {/* Recent Reports */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden transition-colors duration-300">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Reports</h2>
        </div>
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {reports.map((report) => (
            <div key={report.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-300">
              <div className="flex items-center space-x-4">
                <div className="bg-indigo-100 dark:bg-indigo-900/30 p-2 rounded-lg">
                  <FileText className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">{report.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {report.institution} • {report.date} • {report.size}
                  </p>
                </div>
              </div>
              <button className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300 inline-flex items-center gap-1 transition-colors duration-300">
                <Download className="h-4 w-4" />
                Download
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}