import { X, Download } from 'lucide-react';

import { ProcessingHistoryEntry } from '../stores/useAIStore';

interface ExamDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  exam: ProcessingHistoryEntry | null;
  examData?: any; // Add support for detailed exam data
}

export default function ExamDetailsModal({ isOpen, onClose, exam, examData }: ExamDetailsModalProps) {
  if (!isOpen || (!exam && !examData)) return null;
  
  // Use examData if provided, otherwise use exam
  const data = examData || exam;
  const isExamData = !!examData;
  
  // Generate a mock performance value for display purposes if not provided
  const performanceValue = isExamData ? examData.performance : "+11%";
  const isPositive = true;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-auto transition-colors duration-300">
        <div className="p-6 relative">
          <button
            onClick={onClose}
            className="absolute right-6 top-6 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          </button>

          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              {isExamData ? examData.examName : `${data.subject} - ${data.institution}`}
            </h2>
            <span className={`px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300`}>
              {isExamData ? examData.examType : `${data.status} - ${data.papers} Papers`}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Institution Details</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Name:</span>
                  <span className="text-sm font-medium dark:text-gray-200">{isExamData ? examData.institution : exam.institution}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Subject:</span>
                  <span className="text-sm font-medium dark:text-gray-200">{isExamData ? examData.examName.split(' ')[0] : exam.subject}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">{isExamData ? 'Class:' : 'Papers:'}</span>
                  <span className="text-sm font-medium dark:text-gray-200">{isExamData ? examData.className : exam.papers}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">{isExamData ? 'Student Details' : 'Processing Details'}</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">{isExamData ? 'Name:' : 'Status:'}</span>
                  <span className="text-sm font-medium dark:text-gray-200">{isExamData ? examData.studentName : exam.status}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Date:</span>
                  <span className="text-sm font-medium dark:text-gray-200">{isExamData ? examData.date : new Date(exam.date).toLocaleString()}</span>
                </div>
                {isExamData ? (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Student ID:</span>
                    <span className="text-sm font-medium dark:text-gray-200">{examData.studentId}</span>
                  </div>
                ) : exam.progress !== undefined && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Progress:</span>
                    <span className="text-sm font-medium dark:text-gray-200">{exam.progress}%</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">{isExamData ? 'Exam Results' : 'Processing Status'}</h3>
              <div className="flex items-center gap-4">
                {isExamData ? (
                  <span className="text-lg font-bold text-green-600 dark:text-green-400">
                    {examData.grade}
                  </span>
                ) : (
                  <span className={`text-lg font-bold ${exam.status === 'Completed' ? 'text-green-600 dark:text-green-400' : exam.status === 'Failed' ? 'text-red-600 dark:text-red-400' : 'text-blue-600 dark:text-blue-400'}`}>
                    {exam.status}
                  </span>
                )}
              </div>
            </div>
            {isExamData ? (
              <div className="mt-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Score</h3>
                  <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400">{examData.score}</span>
                </div>
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Performance</h3>
                  <span className="text-lg font-bold text-green-600 dark:text-green-400">{performanceValue}</span>
                </div>
              </div>
            ) : exam.progress !== undefined && (
              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Progress</h3>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-indigo-600 dark:bg-indigo-500 h-2 rounded-full" 
                    style={{ width: `${exam.progress}%` }}
                  ></div>
                </div>
                <div className="flex justify-end mt-1">
                  <span className="text-sm text-gray-500 dark:text-gray-400">{exam.progress}%</span>
                </div>
              </div>
            )}
          </div>

          <div className="mb-6">
            {isExamData ? (
              <div>
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Section Breakdown</h3>
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b dark:border-gray-600">
                        <th className="text-left py-2 text-gray-700 dark:text-gray-300">Section</th>
                        <th className="text-left py-2 text-gray-700 dark:text-gray-300">Score</th>
                        <th className="text-left py-2 text-gray-700 dark:text-gray-300">Weight</th>
                      </tr>
                    </thead>
                    <tbody>
                      {examData.sections.map((section: any, index: number) => (
                        <tr key={index} className="border-b dark:border-gray-600 last:border-0">
                          <td className="py-2 text-gray-700 dark:text-gray-300">{section.name}</td>
                          <td className="py-2 text-gray-700 dark:text-gray-300">{section.score}</td>
                          <td className="py-2 text-gray-700 dark:text-gray-300">{section.weight}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mt-4 mb-2">AI Feedback</h3>
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg text-sm text-gray-700 dark:text-gray-300">
                  <p>{examData.feedback}</p>
                </div>
              </div>
            ) : (
              <div>
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Processing Information</h3>
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg text-sm text-gray-700 dark:text-gray-300">
                  {exam.status === 'Completed' ? (
                    <p>This exam has been successfully processed. All papers have been analyzed and results are ready for review.</p>
                  ) : exam.status === 'Failed' ? (
                    <p>Processing of this exam has failed. Please check the system logs or contact support for assistance.</p>
                  ) : exam.status === 'In Review' ? (
                    <p>This exam is currently under review. Results will be available once the review process is complete.</p>
                  ) : (
                    <p>This exam is currently being processed. Progress is at {exam.progress}%. Please wait for the processing to complete.</p>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Close
            </button>
            {(isExamData || exam?.status === 'Completed') && (
              <button
                className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Download Full Report
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}