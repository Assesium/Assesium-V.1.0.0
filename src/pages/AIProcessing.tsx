import React, { useState, useEffect } from 'react';
import { Upload, AlertCircle, CheckCircle2, Clock, Brain, Eye, Play, Pause, RefreshCw, BarChart2, PieChart, Activity, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAIStore, ProcessingHistoryEntry } from '../stores/useAIStore';
import { FileUpload } from '../components/FileUpload';
import { institutions } from '../data/institutions';
import AIProcessingMetrics from '../components/AIProcessingMetrics';
import StatsPreviewModal from '../components/StatsPreviewModal';
import RealTimeStats from '../components/RealTimeStats';
import { PerformanceChart } from '../components/charts/PerformanceChart';
import { DistributionChart } from '../components/charts/DistributionChart';
import { MetricsChart } from '../components/charts/MetricsChart';
import AnimatedProgressBar from '../components/AnimatedProgressBar';
import ExamDetailsModal from '../components/ExamDetailsModal';

export default function AIProcessing() {
  const navigate = useNavigate();
  const { history, addToHistory, updateHistoryEntry } = useAIStore();
  const [selectedScheme, setSelectedScheme] = useState('');
  const [markingMethod, setMarkingMethod] = useState('scheme'); // 'scheme' or 'llm'
  const [selectedInstitution, setSelectedInstitution] = useState('');
  const [totalInstitutions, setTotalInstitutions] = useState(2684);
  const [totalCountries, setTotalCountries] = useState(156);
  const [avgPerformance, setAvgPerformance] = useState(85);
  const [showPreviewStats, setShowPreviewStats] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [selectedExam, setSelectedExam] = useState<ProcessingHistoryEntry | null>(null);
  const [showExamDetails, setShowExamDetails] = useState(false);
  const [showStatsPreview, setShowStatsPreview] = useState(false);
  const [performanceData, setPerformanceData] = useState({
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Accuracy',
        data: [78, 82, 80, 85, 83, 87],
        borderColor: '#4361ee',
        backgroundColor: 'rgba(67, 97, 238, 0.2)'
      },
      {
        label: 'Performance',
        data: [85, 88, 84, 89, 91, 92],
        borderColor: '#f72585',
        backgroundColor: 'rgba(247, 37, 133, 0.2)'
      }
    ]
  });

  const [distributionData, setDistributionData] = useState({
    labels: ['completed', 'processing', 'failed', 'pending', 'in_review'],
    datasets: [
      {
        label: 'Processing Status',
        data: [35, 25, 15, 15, 10],
        backgroundColor: ['#38b000', '#4361ee', '#f72585', '#ff9e00', '#8b5cf6']
      }
    ]
  });

  const [metricsData, setMetricsData] = useState({
    labels: ['Speed', 'Accuracy', 'Efficiency', 'Reliability', 'Consistency'],
    datasets: [
      {
        label: 'Current Performance',
        data: [85, 92, 78, 88, 90],
        backgroundColor: 'rgba(67, 97, 238, 0.2)',
        borderColor: '#4361ee'
      }
    ]
  });

  useEffect(() => {
    const targetInstitutions = 2765;
    const targetCountries = 189;
    const interval = setInterval(() => {
      setTotalInstitutions(prev => {
        const increment = Math.ceil((targetInstitutions - prev) * 0.05);
        return prev + (prev < targetInstitutions ? Math.max(1, increment) : 0);
      });
      setTotalCountries(prev => {
        const increment = Math.ceil((targetCountries - prev) * 0.05);
        return prev + (prev < targetCountries ? Math.max(1, increment) : 0);
      });
      setAvgPerformance(prev => Math.min(100, prev + Math.floor(Math.random() * 1)));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate updating performance data
      setPerformanceData(prev => ({
        ...prev,
        datasets: prev.datasets.map(dataset => ({
          ...dataset,
          data: dataset.data.map(value => 
            Math.min(100, value + (Math.random() * 2 - 1))
          )
        }))
      }));

      // Simulate updating distribution data
      setDistributionData(prev => ({
        ...prev,
        datasets: [{
          ...prev.datasets[0],
          data: prev.datasets[0].data.map(value => 
            Math.max(0, value + (Math.random() * 4 - 2))
          )
        }]
      }));

      // Simulate updating metrics data
      setMetricsData(prev => ({
        ...prev,
        datasets: [{
          ...prev.datasets[0],
          data: prev.datasets[0].data.map(value => 
            Math.min(100, Math.max(0, value + (Math.random() * 2 - 1)))
          )
        }]
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleUpload = (files: File[]) => {
    const newExam: Omit<ProcessingHistoryEntry, 'id' | 'date'> = {
      institution: selectedInstitution || 'Unknown Institution',
      subject: selectedScheme || 'General Assessment',
      status: 'pending',
      papers: files.length,
      progress: 0,
      markingMethod: markingMethod as 'scheme' | 'llm'
    };
    addToHistory(newExam);
  };

  const handleStartProcessing = (examId: string) => {
    const exam = history.find(e => e.id === examId);
    if (!exam) return;

    // If exam is not in processing state, start/restart processing
    if (exam.status !== 'processing') {
      updateHistoryEntry(examId, {
        status: 'processing',
        progress: exam.status === 'in_review' ? exam.progress : 0 // Keep progress if paused
      });
      
      // Simulate progress updates
      let progress = exam.status === 'in_review' ? exam.progress : 0; // Start from current progress if paused
      const interval = setInterval(() => {
        if (exam.status === 'in_review') { // If paused, stop updating
          clearInterval(interval);
          return;
        }
        
        progress += Math.floor(Math.random() * 5) + 1; // Random increment between 1-5%
        
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
          updateHistoryEntry(examId, {
            status: 'completed',
            progress: 100
          });
        } else {
          updateHistoryEntry(examId, {
            progress
          });
        }
      }, 800); // Update every 800ms for smoother animation
      
      // Store interval ID to clear it if needed
      return () => clearInterval(interval);
    } else {
      // If already processing, pause it by changing to in_review
      updateHistoryEntry(examId, {
        status: 'in_review',
        progress: exam.progress // Preserve current progress
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Upload Section */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 transition-colors duration-300">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Upload Exam Papers</h2>
            <div className="space-y-4">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Marking Method</label>
                <div className="flex space-x-4">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      className="form-radio text-indigo-600"
                      name="markingMethod"
                      value="scheme"
                      checked={markingMethod === 'scheme'}
                      onChange={() => setMarkingMethod('scheme')}
                    />
                    <span className="ml-2 text-gray-700 dark:text-gray-300">Use Marking Scheme</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      className="form-radio text-indigo-600"
                      name="markingMethod"
                      value="llm"
                      checked={markingMethod === 'llm'}
                      onChange={() => setMarkingMethod('llm')}
                    />
                    <span className="ml-2 text-gray-700 dark:text-gray-300">Use LLM Knowledge</span>
                  </label>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {markingMethod === 'scheme' 
                    ? 'The system will use the selected marking scheme to evaluate exams.' 
                    : 'The AI will use its own knowledge to evaluate exams without referencing a marking scheme.'}
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Institution</label>
                  <select
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    value={selectedInstitution}
                    onChange={(e) => setSelectedInstitution(e.target.value)}
                  >
                    <option value="">Select Institution</option>
                    {institutions.map((inst) => (
                      <option key={inst.id} value={inst.name}>
                        {inst.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Marking Scheme</label>
                  <select
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    value={selectedScheme}
                    onChange={(e) => setSelectedScheme(e.target.value)}
                  >
                    <option value="">Select Marking Scheme</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="Physics">Physics</option>
                    <option value="Chemistry">Chemistry</option>
                    <option value="Biology">Biology</option>
                    <option value="English">English</option>
                    <option value="History">History</option>
                    <option value="Geography">Geography</option>
                  </select>
                </div>
              </div>
              <FileUpload onUpload={handleUpload} />
            </div>
          </div>

          {/* Processing History Section */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden transition-colors duration-300">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Processing History</h2>
            </div>
            {history.length === 0 ? (
              <div className="p-6 text-center text-gray-500 dark:text-gray-400">
                <p>No processing history available</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {/* Display history in reverse order (newest first) */}
                {[...history].reverse().map((entry) => (
                  <div key={entry.id} className="px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-300">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-4">
                        <div className={`p-2 rounded-lg ${
                          entry.status === 'completed' ? 'bg-green-100 dark:bg-green-900/30' : 
                          entry.status === 'failed' ? 'bg-red-100 dark:bg-red-900/30' : 
                          entry.status === 'in_review' ? 'bg-yellow-100 dark:bg-yellow-900/30' : 
                          'bg-blue-100 dark:bg-blue-900/30'
                        }`}>
                          {entry.status === 'completed' ? (
                            <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400" />
                          ) : entry.status === 'failed' ? (
                            <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
                          ) : entry.status === 'in_review' ? (
                            <Eye className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                          ) : (
                            <Clock className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                          )}
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-900 dark:text-white">{entry.institution}</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {entry.subject} • {new Date(entry.date).toLocaleString()} • {entry.papers} papers
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Marking: {entry.markingMethod === 'llm' ? 'LLM Knowledge' : 'Marking Scheme'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => {
                            setSelectedExam(entry);
                            setShowPreview(true);
                          }}
                          className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                          title="View Details"
                        >
                          <Eye className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => navigate(`/students?institution=${encodeURIComponent(entry.institution)}`)}
                          className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                          title="View Results"
                        >
                          <FileText className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleStartProcessing(entry.id)}
                          className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                        >
                          {entry.status === 'processing' ? (
                            <Pause className="h-5 w-5" />
                          ) : (
                            <Play className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                    </div>
                    {entry.progress !== undefined && (
                      <div className="mt-2">
                        <AnimatedProgressBar 
                          value={entry.progress} 
                          showPercentage={true}
                          color={
                            entry.status === 'processing' ? 'bg-blue-500' : 
                            entry.status === 'completed' ? 'bg-green-500' : 
                            entry.status === 'failed' ? 'bg-red-500' : 
                            'bg-yellow-500'
                          }
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          {/* AI Processing Metrics */}
          <AIProcessingMetrics />

          {/* Performance Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 transition-colors duration-300">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Performance Overview</h2>
            <div className="h-[300px]">
              <PerformanceChart data={performanceData} />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 transition-colors duration-300">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <PieChart className="w-5 h-5 mr-2" />
            Processing Distribution
          </h2>
          <div className="h-[350px]">
            <DistributionChart data={distributionData} />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 transition-colors duration-300">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <Activity className="w-5 h-5 mr-2" />
            Processing Metrics
          </h2>
          <div className="h-[350px]">
            <MetricsChart data={metricsData} />
          </div>
        </div>
      </div>
      
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 transition-colors duration-300">
            <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
            <BarChart2 className="w-5 h-5 mr-2" />
            System Resource Usage
          </h2>
              <button 
            onClick={() => setShowStatsPreview(true)}
            className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 flex items-center"
              >
            <RefreshCw className="h-4 w-4 mr-1" />
            View Detailed Stats
              </button>
            </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <RealTimeStats 
            label="Total Institutions" 
            value={totalInstitutions} 
            previousValue={totalInstitutions - 50}
            gradientFrom="from-indigo-500" 
            gradientVia="via-indigo-600" 
            gradientTo="to-purple-600"
            trend="up"
            trendValue="+2.3% this month"
          />
          <RealTimeStats 
            label="Total Countries" 
            value={totalCountries} 
            previousValue={totalCountries - 10}
            gradientFrom="from-purple-500" 
            gradientVia="via-purple-600" 
            gradientTo="to-pink-600"
            trend="up"
            trendValue="+1.8% this month"
          />
          <RealTimeStats 
            label="Average Performance" 
            value={avgPerformance} 
            previousValue={avgPerformance - 2}
            gradientFrom="from-pink-500" 
            gradientVia="via-pink-600" 
            gradientTo="to-rose-600"
            trend="up"
            trendValue="+0.5% this month"
              />
            </div>
          </div>

      <ExamDetailsModal
        exam={selectedExam}
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
      />

      <StatsPreviewModal 
        isOpen={showStatsPreview} 
        onClose={() => setShowStatsPreview(false)}
        title="Detailed Statistics"
      >
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <RealTimeStats 
              label="Total Institutions" 
              value={totalInstitutions} 
              previousValue={totalInstitutions - 50}
              gradientFrom="from-indigo-500" 
              gradientVia="via-indigo-600" 
              gradientTo="to-purple-600"
              trend="up"
              trendValue="+2.3% this month"
            />
            <RealTimeStats 
              label="Total Countries" 
              value={totalCountries} 
              previousValue={totalCountries - 10}
              gradientFrom="from-purple-500" 
              gradientVia="via-purple-600" 
              gradientTo="to-pink-600"
              trend="up"
              trendValue="+1.8% this month"
            />
            <RealTimeStats 
              label="Average Performance" 
              value={avgPerformance} 
              previousValue={avgPerformance - 2}
              gradientFrom="from-pink-500" 
              gradientVia="via-pink-600" 
              gradientTo="to-rose-600"
              trend="up"
              trendValue="+0.5% this month"
            />
              </div>
          <div className="mt-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Processing Performance Trends</h3>
            <PerformanceChart data={performanceData} />
          </div>
        </div>
      </StatsPreviewModal>
    </div>
  );
}