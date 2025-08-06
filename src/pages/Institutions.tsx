import React, { useState, useEffect, useRef } from 'react';
import { Building2, Search, Filter, Users, BookOpen, GraduationCap, BarChart2, CheckCircle2, AlertCircle, Clock, Eye, Play, Pause, FileText, Download, Plus } from 'lucide-react';
import { institutions, countries } from '../data/institutions';
import { DynamicChart } from '../components/charts/DynamicChart';
import CountUp from 'react-countup';
import { motion } from 'framer-motion';
import AnimatedProgressBar from '../components/AnimatedProgressBar';
import { useNavigate } from 'react-router-dom';
import ExamDetailsModal from '../components/ExamDetailsModal';
import { ProcessingHistoryEntry } from '../stores/useAIStore';
import { useAIStore } from '../stores/useAIStore';
import InstitutionModal, { InstitutionFormData } from '../components/InstitutionModal';

export default function Institutions() {
  const navigate = useNavigate();
  const [selectedCountry, setSelectedCountry] = useState('All Countries');
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [totalInstitutions, setTotalInstitutions] = useState(2684);
  const [totalCountries, setTotalCountries] = useState(156);
  const [avgPerformance, setAvgPerformance] = useState(85.7);
  const [totalStudents, setTotalStudents] = useState(1850);
  const [totalTeachers, setTotalTeachers] = useState(120);
  const [examsProcessed, setExamsProcessed] = useState(4270);
  const [avgPassRate, setAvgPassRate] = useState(78);
  const [selectedTerm, setSelectedTerm] = useState('All Terms');
  const [selectedInstitution, setSelectedInstitution] = useState(institutions[0]);
  const [selectedProcessingEntry, setSelectedProcessingEntry] = useState<ProcessingHistoryEntry | null>(null);
  const [showExamDetailsModal, setShowExamDetailsModal] = useState(false);
  const [showInstitutionModal, setShowInstitutionModal] = useState(false);
  const [selectedInstitutionData, setSelectedInstitutionData] = useState<InstitutionFormData | undefined>(undefined);
  const searchRef = useRef(null);
  
  // Get processing history from the AI store
  const processingHistory = useAIStore(state => state.history);

  const filteredInstitutions = institutions.filter(inst => 
    (selectedCountry === 'All Countries' || inst.country === selectedCountry) &&
    inst.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const searchResults = searchTerm.length > 0 
    ? institutions.filter(inst => inst.name.toLowerCase().includes(searchTerm.toLowerCase()))
    : [];
    
  // Handle click outside of search dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const targetInstitutions = 2765;
    const targetCountries = 189;
    const targetAvgPerformance = 91.7;
    const targetStudents = 1950;
    const targetTeachers = 135;
    const targetExams = 4500;
    const targetPassRate = 82;
    
    const interval = setInterval(() => {
      setTotalInstitutions(prev => {
        const increment = Math.ceil((targetInstitutions - prev) * 0.05);
        return prev + (prev < targetInstitutions ? Math.max(1, increment) : 0);
      });
      setTotalCountries(prev => {
        const increment = Math.ceil((targetCountries - prev) * 0.05);
        return prev + (prev < targetCountries ? Math.max(1, increment) : 0);
      });
      setAvgPerformance(prev => {
        const increment = (targetAvgPerformance - prev) * 0.05;
        return Math.min(targetAvgPerformance, prev + increment);
      });
      setTotalStudents(prev => {
        const increment = Math.ceil((targetStudents - prev) * 0.05);
        return prev + (prev < targetStudents ? Math.max(1, increment) : 0);
      });
      setTotalTeachers(prev => {
        const increment = Math.ceil((targetTeachers - prev) * 0.05);
        return prev + (prev < targetTeachers ? Math.max(1, increment) : 0);
      });
      setExamsProcessed(prev => {
        const increment = Math.ceil((targetExams - prev) * 0.05);
        return prev + (prev < targetExams ? Math.max(1, increment) : 0);
      });
      setAvgPassRate(prev => {
        const increment = Math.ceil((targetPassRate - prev) * 0.05);
        return prev + (prev < targetPassRate ? Math.max(1, increment) : 0);
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const performanceData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
      label: 'Average Score',
      data: [82, 85, 78, 80, 88, 91],
      backgroundColor: '#4361ee',
      borderRadius: 4
    }]
  };

  const handleSaveInstitution = (institutionData: InstitutionFormData) => {
    // Here you would typically save the institution data to your backend or state management
    console.log('Saving institution:', institutionData);
    
    // For demo purposes, we'll just show an alert
    alert(`Institution ${institutionData.name} saved successfully!`);
    
    // Close the modal
    setShowInstitutionModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Institution Modal */}
      <InstitutionModal
        isOpen={showInstitutionModal}
        onClose={() => setShowInstitutionModal(false)}
        onSave={handleSaveInstitution}
        institution={selectedInstitutionData}
      />
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Institutions</h1>
        <button 
          onClick={() => setShowInstitutionModal(true)}
          className="bg-indigo-600 dark:bg-indigo-700 text-white px-4 py-2 rounded-md hover:bg-indigo-700 dark:hover:bg-indigo-800 transition-colors duration-300 flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Institution
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div 
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 transform transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer"
          whileHover={{ y: -5 }}
          onClick={() => window.location.href = '/institutions'}
        >
          <div className="flex items-center gap-4">
            <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-lg">
              <Building2 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-300">Total Institutions</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                <CountUp end={totalInstitutions} separator="," duration={5} decimals={0} />
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 transform transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer"
          whileHover={{ y: -5 }}
          onClick={() => window.location.href = '/reports?view=countries'}
        >
          <div className="flex items-center gap-4">
            <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-lg">
              <Building2 className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-300">Countries</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                <CountUp end={totalCountries} duration={5} decimals={0} />
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 transform transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer"
          whileHover={{ y: -5 }}
          onClick={() => window.location.href = '/reports?view=performance'}
        >
          <div className="flex items-center gap-4">
            <div className="bg-pink-100 dark:bg-pink-900/30 p-3 rounded-lg">
              <Building2 className="h-6 w-6 text-pink-600 dark:text-pink-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-300">Average Performance</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                <CountUp end={avgPerformance} duration={5} decimals={1} suffix="%" />
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
        <div className="flex gap-4">
          <div className="flex-1 relative" ref={searchRef}>
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-300 h-5 w-5" />
            <input
              type="text"
              placeholder="Search institutions..."
              className="pl-10 w-full border dark:border-gray-600 rounded-md px-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setShowDropdown(e.target.value.length > 0);
              }}
              onFocus={() => setShowDropdown(searchTerm.length > 0)}
            />
            {showDropdown && searchResults.length > 0 && (
              <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-700 border dark:border-gray-600 rounded-md shadow-lg max-h-60 overflow-auto">
                {searchResults.map(inst => (
                  <div 
                    key={inst.id} 
                    className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer"
                    onClick={() => {
                      setSelectedInstitution(inst);
                      setSearchTerm(inst.name);
                      setShowDropdown(false);
                    }}
                  >
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-300 font-semibold">
                        {inst.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium dark:text-white">{inst.name}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-300">{inst.country}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
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
        </div>
      </div>
      
      {/* Institution Details */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-lg shadow-sm p-6 text-white">
        <div className="flex items-center gap-4 mb-6">
          <div className="h-16 w-16 bg-white rounded-lg flex items-center justify-center text-indigo-600 font-bold text-2xl">
            {selectedInstitution.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
          </div>
          <div>
            <h2 className="text-2xl font-bold">{selectedInstitution.name}</h2>
            <p className="text-blue-100">{selectedInstitution.country}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <motion.div 
            className="bg-white/10 rounded-lg p-4 transform transition-all duration-300 hover:scale-105 hover:shadow-md cursor-pointer"
            whileHover={{ y: -3, backgroundColor: "rgba(255, 255, 255, 0.15)" }}
            onClick={() => navigate(`/students?institution=${encodeURIComponent(selectedInstitution.name)}`)}
          >
            <div className="flex items-center gap-3">
              <div className="bg-blue-500/30 p-2 rounded-lg">
                <Users className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-xs text-blue-100">Total Students</p>
                <p className="text-xl font-bold">
                  <CountUp end={totalStudents} separator="," duration={5} />
                </p>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            className="bg-white/10 rounded-lg p-4 transform transition-all duration-300 hover:scale-105 hover:shadow-md cursor-pointer"
            whileHover={{ y: -3, backgroundColor: "rgba(255, 255, 255, 0.15)" }}
            onClick={() => navigate(`/teachers?institution=${encodeURIComponent(selectedInstitution.name)}`)}
          >
            <div className="flex items-center gap-3">
              <div className="bg-purple-500/30 p-2 rounded-lg">
                <GraduationCap className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-xs text-blue-100">Teachers</p>
                <p className="text-xl font-bold">
                  <CountUp end={totalTeachers} duration={5} />
                </p>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            className="bg-white/10 rounded-lg p-4 transform transition-all duration-300 hover:scale-105 hover:shadow-md cursor-pointer"
            whileHover={{ y: -3, backgroundColor: "rgba(255, 255, 255, 0.15)" }}
            onClick={() => navigate(`/ai-processing?institution=${encodeURIComponent(selectedInstitution.name)}`)}
          >
            <div className="flex items-center gap-3">
              <div className="bg-pink-500/30 p-2 rounded-lg">
                <BookOpen className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-xs text-blue-100">Exams Processed</p>
                <p className="text-xl font-bold">
                  <CountUp end={examsProcessed} separator="," duration={5} />
                </p>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            className="bg-white/10 rounded-lg p-4 transform transition-all duration-300 hover:scale-105 hover:shadow-md cursor-pointer"
            whileHover={{ y: -3, backgroundColor: "rgba(255, 255, 255, 0.15)" }}
            onClick={() => navigate(`/reports?institution=${encodeURIComponent(selectedInstitution.name)}&view=pass-rate`)}
          >
            <div className="flex items-center gap-3">
              <div className="bg-cyan-500/30 p-2 rounded-lg">
                <BarChart2 className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-xs text-blue-100">Avg. Pass Rate</p>
                <p className="text-xl font-bold">
                  <CountUp end={avgPassRate} suffix="%" duration={5} />
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Charts Section - Side by Side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Academic Performance by Department</h3>
            <select 
              className="border dark:border-gray-600 rounded-md px-3 py-1.5 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              value={selectedTerm}
              onChange={(e) => setSelectedTerm(e.target.value)}
            >
              <option>All Terms</option>
              <option>Term 1</option>
              <option>Term 2</option>
              <option>Term 3</option>
            </select>
          </div>
          <div className="h-80">
            <DynamicChart type="bar" data={performanceData} />
          </div>
        </div>

        {/* Grade Distribution Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Grade Distribution</h3>
            <select className="border dark:border-gray-600 rounded-md px-3 py-1.5 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
              <option>All Levels</option>
              <option>Level 1</option>
              <option>Level 2</option>
              <option>Level 3</option>
            </select>
          </div>
          <div className="h-80">
            <DynamicChart 
              type="doughnut" 
              data={{
                labels: ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'D', 'F'],
                datasets: [{
                  data: [15, 20, 18, 12, 10, 8, 7, 5, 3, 2],
                  backgroundColor: [
                    '#4cc9f0', // A+
                    '#4361ee', // A
                    '#3a0ca3', // A-
                    '#7209b7', // B+
                    '#560bad', // B
                    '#480ca8', // B-
                    '#f72585', // C+
                    '#b5179e', // C
                    '#ffbe0b', // D
                    '#fb5607'  // F
                  ],
                  borderWidth: 0
                }]
              }}
              options={{
                plugins: {
                  legend: {
                    position: 'right',
                    labels: {
                      usePointStyle: true,
                      pointStyle: 'circle',
                      padding: 15
                    }
                  }
                },
                cutout: '60%'
              }}
            />
          </div>
        </div>
      </div>

      {/* Processing History Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden transition-colors duration-300">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Processing History</h2>
          <div className="flex gap-2">
            <select 
              className="border dark:border-gray-600 rounded-md px-3 py-1.5 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              defaultValue="all"
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="processing">Processing</option>
              <option value="review">In Review</option>
              <option value="failed">Failed</option>
            </select>
            <button className="bg-indigo-600 text-white px-3 py-1.5 rounded-md text-sm hover:bg-indigo-700 transition-colors flex items-center gap-1">
              <Download className="h-4 w-4" />
              Export
            </button>
          </div>
        </div>
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {processingHistory
            .filter(entry => entry.institution === selectedInstitution.name)
            .map((processingEntry) => {
            // For demo purposes, generate random data for each entry
            let examCount = processingEntry.papers;
            let status = processingEntry.status;
            let progress = processingEntry.progress;
            let date = new Date(processingEntry.date);
            
            return (
              <div key={processingEntry.id} className="px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-300">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-4">
                    <div className={`p-2 rounded-lg ${status === 'Completed' ? 'bg-green-100 dark:bg-green-900/30' : status === 'Failed' ? 'bg-red-100 dark:bg-red-900/30' : status === 'In Review' ? 'bg-yellow-100 dark:bg-yellow-900/30' : 'bg-blue-100 dark:bg-blue-900/30'}`}>
                      {status === 'Completed' ? (
                        <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400" />
                      ) : status === 'Failed' ? (
                        <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
                      ) : status === 'In Review' ? (
                        <Eye className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                      ) : (
                        <Clock className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white">{processingEntry.subject} - {processingEntry.institution}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {selectedInstitution.country} • {date.toLocaleString()} • {examCount} papers
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => {
                        setSelectedProcessingEntry(processingEntry);
                        setShowExamDetailsModal(true);
                      }}
                      className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-full"
                      title="View Processing Details"
                    >
                      <Eye className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => {
                        navigate(`/students?institution=${encodeURIComponent(processingEntry.institution)}`);
                      }}
                      className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-full"
                      title="View Students"
                    >
                      <Users className="h-5 w-5" />
                    </button>
                    {status === 'Completed' && (
                      <button
                        onClick={() => {
                          // In a real app, this would download a report
                          alert('Downloading report for ' + processingEntry.institution);
                        }}
                        className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-full"
                        title="Download Report"
                      >
                        <FileText className="h-5 w-5" />
                      </button>
                    )}
                    <button
                      onClick={() => {
                        // Toggle processing status
                        // In a real app, this would call an API
                        const newStatus = status === 'Processing' ? 'In Review' : 'Processing';
                        // For demo purposes, we're just updating the UI
                        status = newStatus;
                      }}
                      className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-full"
                      title={status === 'Processing' ? 'Pause Processing' : 'Start Processing'}
                    >
                      {status === 'Processing' ? (
                        <Pause className="h-5 w-5" />
                      ) : (
                        <Play className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>
                <div className="mt-2">
                  {status !== 'Completed' && status !== 'Failed' && (
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-4">
                      <div 
                        className="bg-blue-600 dark:bg-blue-500 h-2.5 rounded-full" 
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Exam Details Modal */}
      <ExamDetailsModal 
        isOpen={showExamDetailsModal}
        onClose={() => setShowExamDetailsModal(false)}
        exam={selectedProcessingEntry}
      />
    </div>
  );
}