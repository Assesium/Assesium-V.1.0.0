import React, { useState } from 'react';
import { FileText, Download, Calendar, School, Filter, Save } from 'lucide-react';
import ActionModal from './ActionModal';
import Button from './Button';
import { institutions } from '../data/institutions';

interface GenerateReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (reportConfig: ReportConfig) => void;
}

export interface ReportConfig {
  title: string;
  type: 'performance' | 'attendance' | 'grades' | 'behavior' | 'custom';
  institution: string;
  timeframe: 'last_7_days' | 'last_30_days' | 'last_90_days' | 'custom';
  customDateRange?: {
    startDate: string;
    endDate: string;
  };
  includeCharts: boolean;
  includeRawData: boolean;
  format: 'pdf' | 'excel' | 'csv';
}

export default function GenerateReportModal({
  isOpen,
  onClose,
  onGenerate
}: GenerateReportModalProps) {
  const [reportConfig, setReportConfig] = useState<ReportConfig>({
    title: '',
    type: 'performance',
    institution: 'All Institutions',
    timeframe: 'last_30_days',
    includeCharts: true,
    includeRawData: false,
    format: 'pdf'
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [showCustomDateRange, setShowCustomDateRange] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setReportConfig({
      ...reportConfig,
      [name]: value
    });
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setReportConfig({
      ...reportConfig,
      [name]: checked
    });
  };

  const handleTimeframeChange = (value: 'last_7_days' | 'last_30_days' | 'last_90_days' | 'custom') => {
    setReportConfig({
      ...reportConfig,
      timeframe: value
    });
    setShowCustomDateRange(value === 'custom');
  };

  const handleCustomDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setReportConfig({
      ...reportConfig,
      customDateRange: {
        ...reportConfig.customDateRange,
        [name]: value
      }
    });
  };

  const handleFormatChange = (format: 'pdf' | 'excel' | 'csv') => {
    setReportConfig({
      ...reportConfig,
      format
    });
  };

  const handleGenerate = () => {
    if (!reportConfig.title) return;
    
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      onGenerate(reportConfig);
      setIsLoading(false);
      onClose();
    }, 1500);
  };

  const renderFooter = () => (
    <div className="flex justify-end space-x-3">
      <Button 
        variant="outline" 
        onClick={onClose}
      >
        Cancel
      </Button>
      <Button 
        variant="primary" 
        onClick={handleGenerate}
        isLoading={isLoading}
        icon={<FileText className="h-4 w-4" />}
        disabled={!reportConfig.title}
      >
        Generate Report
      </Button>
    </div>
  );

  const reportTypes = [
    { value: 'performance', label: 'Performance Report' },
    { value: 'attendance', label: 'Attendance Report' },
    { value: 'grades', label: 'Grades Report' },
    { value: 'behavior', label: 'Behavior Report' },
    { value: 'custom', label: 'Custom Report' }
  ];

  return (
    <ActionModal
      isOpen={isOpen}
      onClose={onClose}
      title="Generate New Report"
      footer={renderFooter()}
      size="lg"
    >
      <div className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Report Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={reportConfig.title}
            onChange={handleInputChange}
            placeholder="Enter report title"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
            required
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Report Type
            </label>
            <div className="relative">
              <select
                id="type"
                name="type"
                value={reportConfig.type}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none dark:bg-gray-700 dark:text-white"
              >
                {reportTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
          
          <div>
            <label htmlFor="timeframe" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Timeframe
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => handleTimeframeChange('last_7_days')}
                className={`px-3 py-1.5 text-sm border rounded-md flex items-center ${reportConfig.timeframe === 'last_7_days' ? 'bg-indigo-50 border-indigo-500 text-indigo-700 dark:bg-indigo-900/30 dark:border-indigo-500 dark:text-indigo-300' : 'border-gray-300 dark:border-gray-600 dark:text-gray-300'}`}
              >
                <Calendar className="h-3.5 w-3.5 mr-1.5" />
                Last 7 Days
              </button>
              <button
                type="button"
                onClick={() => handleTimeframeChange('last_30_days')}
                className={`px-3 py-1.5 text-sm border rounded-md flex items-center ${reportConfig.timeframe === 'last_30_days' ? 'bg-indigo-50 border-indigo-500 text-indigo-700 dark:bg-indigo-900/30 dark:border-indigo-500 dark:text-indigo-300' : 'border-gray-300 dark:border-gray-600 dark:text-gray-300'}`}
              >
                <Calendar className="h-3.5 w-3.5 mr-1.5" />
                Last 30 Days
              </button>
              <button
                type="button"
                onClick={() => handleTimeframeChange('last_90_days')}
                className={`px-3 py-1.5 text-sm border rounded-md flex items-center ${reportConfig.timeframe === 'last_90_days' ? 'bg-indigo-50 border-indigo-500 text-indigo-700 dark:bg-indigo-900/30 dark:border-indigo-500 dark:text-indigo-300' : 'border-gray-300 dark:border-gray-600 dark:text-gray-300'}`}
              >
                <Calendar className="h-3.5 w-3.5 mr-1.5" />
                Last 90 Days
              </button>
              <button
                type="button"
                onClick={() => handleTimeframeChange('custom')}
                className={`px-3 py-1.5 text-sm border rounded-md flex items-center ${reportConfig.timeframe === 'custom' ? 'bg-indigo-50 border-indigo-500 text-indigo-700 dark:bg-indigo-900/30 dark:border-indigo-500 dark:text-indigo-300' : 'border-gray-300 dark:border-gray-600 dark:text-gray-300'}`}
              >
                <Calendar className="h-3.5 w-3.5 mr-1.5" />
                Custom Range
              </button>
            </div>
            
            {showCustomDateRange && (
              <div className="mt-3 grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="startDate" className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    id="startDate"
                    name="startDate"
                    value={reportConfig.customDateRange?.startDate || ''}
                    onChange={handleCustomDateChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="endDate" className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    id="endDate"
                    name="endDate"
                    value={reportConfig.customDateRange?.endDate || ''}
                    onChange={handleCustomDateChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white text-sm"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Report Options</h3>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="includeCharts"
              name="includeCharts"
              checked={reportConfig.includeCharts}
              onChange={handleCheckboxChange}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label htmlFor="includeCharts" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
              Include charts and visualizations
            </label>
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="includeRawData"
              name="includeRawData"
              checked={reportConfig.includeRawData}
              onChange={handleCheckboxChange}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label htmlFor="includeRawData" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
              Include raw data tables
            </label>
          </div>
        </div>
        
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Export Format</h3>
          
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={() => handleFormatChange('pdf')}
              className={`px-4 py-2 border rounded-md flex items-center ${reportConfig.format === 'pdf' ? 'bg-indigo-50 border-indigo-500 text-indigo-700 dark:bg-indigo-900/30 dark:border-indigo-500 dark:text-indigo-300' : 'border-gray-300 dark:border-gray-600 dark:text-gray-300'}`}
            >
              <FileText className="h-4 w-4 mr-2" />
              PDF
            </button>
            <button
              type="button"
              onClick={() => handleFormatChange('excel')}
              className={`px-4 py-2 border rounded-md flex items-center ${reportConfig.format === 'excel' ? 'bg-indigo-50 border-indigo-500 text-indigo-700 dark:bg-indigo-900/30 dark:border-indigo-500 dark:text-indigo-300' : 'border-gray-300 dark:border-gray-600 dark:text-gray-300'}`}
            >
              <FileText className="h-4 w-4 mr-2" />
              Excel
            </button>
            <button
              type="button"
              onClick={() => handleFormatChange('csv')}
              className={`px-4 py-2 border rounded-md flex items-center ${reportConfig.format === 'csv' ? 'bg-indigo-50 border-indigo-500 text-indigo-700 dark:bg-indigo-900/30 dark:border-indigo-500 dark:text-indigo-300' : 'border-gray-300 dark:border-gray-600 dark:text-gray-300'}`}
            >
              <FileText className="h-4 w-4 mr-2" />
              CSV
            </button>
          </div>
        </div>
        
        <div>
            <label htmlFor="institution" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Institution
            </label>
            <div className="relative">
              <select
                id="institution"
                name="institution"
                value={reportConfig.institution}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none dark:bg-gray-700 dark:text-white"
              >
                <option value="All Institutions">All Institutions</option>
                {institutions.map(inst => (
                  <option key={inst.id} value={inst.name}>{inst.name}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
          
          <div>
            <label htmlFor="timeframe" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Timeframe
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => handleTimeframeChange('last_7_days')}
                className={`px-3 py-1.5 text-sm border rounded-md flex items-center ${reportConfig.timeframe === 'last_7_days' ? 'bg-indigo-50 border-indigo-500 text-indigo-700 dark:bg-indigo-900/30 dark:border-indigo-500 dark:text-indigo-300' : 'border-gray-300 dark:border-gray-600 dark:text-gray-300'}`}
              >
                <Calendar className="h-3.5 w-3.5 mr-1.5" />
                Last 7 Days
              </button>
              <button
                type="button"
                onClick={() => handleTimeframeChange('last_30_days')}
                className={`px-3 py-1.5 text-sm border rounded-md flex items-center ${reportConfig.timeframe === 'last_30_days' ? 'bg-indigo-50 border-indigo-500 text-indigo-700 dark:bg-indigo-900/30 dark:border-indigo-500 dark:text-indigo-300' : 'border-gray-300 dark:border-gray-600 dark:text-gray-300'}`}
              >
                <Calendar className="h-3.5 w-3.5 mr-1.5" />
                Last 30 Days
              </button>
              <button
                type="button"
                onClick={() => handleTimeframeChange('last_90_days')}
                className={`px-3 py-1.5 text-sm border rounded-md flex items-center ${reportConfig.timeframe === 'last_90_days' ? 'bg-indigo-50 border-indigo-500 text-indigo-700 dark:bg-indigo-900/30 dark:border-indigo-500 dark:text-indigo-300' : 'border-gray-300 dark:border-gray-600 dark:text-gray-300'}`}
              >
                <Calendar className="h-3.5 w-3.5 mr-1.5" />
                Last 90 Days
              </button>
              <button
                type="button"
                onClick={() => handleTimeframeChange('custom')}
                className={`px-3 py-1.5 text-sm border rounded-md flex items-center ${reportConfig.timeframe === 'custom' ? 'bg-indigo-50 border-indigo-500 text-indigo-700 dark:bg-indigo-900/30 dark:border-indigo-500 dark:text-indigo-300' : 'border-gray-300 dark:border-gray-600 dark:text-gray-300'}`}
              >
                <Calendar className="h-3.5 w-3.5 mr-1.5" />
                Custom Range
              </button>
            </div>
            
            {showCustomDateRange && (
              <div className="mt-3 grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="startDate" className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    id="startDate"
                    name="startDate"
                    value={reportConfig.customDateRange?.startDate || ''}
                    onChange={handleCustomDateChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="endDate" className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    id="endDate"
                    name="endDate"
                    value={reportConfig.customDateRange?.endDate || ''}
                    onChange={handleCustomDateChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white text-sm"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Report Options</h3>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="includeCharts"
              name="includeCharts"
              checked={reportConfig.includeCharts}
              onChange={handleCheckboxChange}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label htmlFor="includeCharts" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
              Include charts and visualizations
            </label>
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="includeRawData"
              name="includeRawData"
              checked={reportConfig.includeRawData}
              onChange={handleCheckboxChange}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label htmlFor="includeRawData" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
              Include raw data tables
            </label>
          </div>
        </div>
        
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Export Format</h3>
          
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={() => handleFormatChange('pdf')}
              className={`px-4 py-2 border rounded-md flex items-center ${reportConfig.format === 'pdf' ? 'bg-indigo-50 border-indigo-500 text-indigo-700 dark:bg-indigo-900/30 dark:border-indigo-500 dark:text-indigo-300' : 'border-gray-300 dark:border-gray-600 dark:text-gray-300'}`}
            >
              <FileText className="h-4 w-4 mr-2" />
              PDF
            </button>
            <button
              type="button"
              onClick={() => handleFormatChange('excel')}
              className={`px-4 py-2 border rounded-md flex items-center ${reportConfig.format === 'excel' ? 'bg-indigo-50 border-indigo-500 text-indigo-700 dark:bg-indigo-900/30 dark:border-indigo-500 dark:text-indigo-300' : 'border-gray-300 dark:border-gray-600 dark:text-gray-300'}`}
            >
              <FileText className="h-4 w-4 mr-2" />
              Excel
            </button>
            <button
              type="button"
              onClick={() => handleFormatChange('csv')}
              className={`px-4 py-2 border rounded-md flex items-center ${reportConfig.format === 'csv' ? 'bg-indigo-50 border-indigo-500 text-indigo-700 dark:bg-indigo-900/30 dark:border-indigo-500 dark:text-indigo-300' : 'border-gray-300 dark:border-gray-600 dark:text-gray-300'}`}
            >
              <FileText className="h-4 w-4 mr-2" />
              CSV
            </button>
          </div>
      </div>
    </ActionModal>
  );
}
