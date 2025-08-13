import React, { useState } from 'react';
import { Download, FileText, FileSpreadsheet, FileJson, Check } from 'lucide-react';
import ActionModal from './ActionModal';
import Button from './Button';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: (exportConfig: ExportConfig) => void;
  title?: string;
  dataType: 'students' | 'teachers' | 'reports' | 'grades' | 'attendance';
  itemCount?: number;
}

export interface ExportConfig {
  format: 'pdf' | 'csv' | 'excel' | 'json';
  includeHeaders: boolean;
  selection: 'all' | 'filtered' | 'selected';
  dateRange?: {
    startDate: string;
    endDate: string;
  };
}

export default function ExportModal({
  isOpen,
  onClose,
  onExport,
  title = 'Export Data',
  dataType,
  itemCount = 0
}: ExportModalProps) {
  const [exportConfig, setExportConfig] = useState<ExportConfig>({
    format: 'pdf',
    includeHeaders: true,
    selection: 'all'
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [showDateRange, setShowDateRange] = useState(false);

  const handleFormatChange = (format: 'pdf' | 'csv' | 'excel' | 'json') => {
    setExportConfig({
      ...exportConfig,
      format
    });
  };

  const handleSelectionChange = (selection: 'all' | 'filtered' | 'selected') => {
    setExportConfig({
      ...exportConfig,
      selection
    });
  };

  const handleToggleHeaders = () => {
    setExportConfig({
      ...exportConfig,
      includeHeaders: !exportConfig.includeHeaders
    });
  };

  const handleDateRangeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setExportConfig({
      ...exportConfig,
      dateRange: {
        ...exportConfig.dateRange || { startDate: '', endDate: '' },
        [name]: value
      }
    });
  };

  const handleExport = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      onExport(exportConfig);
      setIsLoading(false);
      onClose();
    }, 1500);
  };

  const renderFooter = () => (
    <div className="flex justify-end space-x-3">
      <Button 
        variant="outline" 
        onClick={() => {
          // Ensure we're not accessing undefined properties
          try {
            onClose();
          } catch (error) {
            console.error('Error closing export modal:', error);
          }
        }}
      >
        Cancel
      </Button>
      <Button 
        variant="primary" 
        onClick={() => {
          // Ensure exportConfig is properly initialized before export
          try {
            handleExport();
          } catch (error) {
            console.error('Error during export:', error);
          }
        }}
        isLoading={isLoading}
        icon={<Download className="h-4 w-4" />}
      >
        Export
      </Button>
    </div>
  );

  const formatOptions = [
    { 
      id: 'pdf', 
      name: 'PDF Document', 
      icon: <FileText className="h-6 w-6 text-red-500" />,
      description: 'Best for printing and sharing'
    },
    { 
      id: 'excel', 
      name: 'Excel Spreadsheet', 
      icon: <FileSpreadsheet className="h-6 w-6 text-green-600" />,
      description: 'Best for data analysis'
    },
    { 
      id: 'csv', 
      name: 'CSV File', 
      icon: <FileText className="h-6 w-6 text-gray-500" />,
      description: 'Compatible with most systems'
    },
    { 
      id: 'json', 
      name: 'JSON File', 
      icon: <FileJson className="h-6 w-6 text-yellow-500" />,
      description: 'Best for developers'
    }
  ];

  return (
    <ActionModal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      footer={renderFooter()}
      size="md">
      <div className="space-y-6">
        {/* Format Selection */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Export Format</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {formatOptions.map((option) => (
              <div 
                key={option.id}
                className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${exportConfig.format === option.id ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20' : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
                onClick={() => handleFormatChange(option.id as 'pdf' | 'csv' | 'excel' | 'json')}
              >
                <div className="mr-4">
                  {option.icon}
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">{option.name}</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{option.description}</p>
                </div>
                {exportConfig.format === option.id && (
                  <div className="ml-auto">
                    <Check className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Export Options */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Export Options</h3>
          
          <div className="space-y-3">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="includeHeaders"
                checked={exportConfig.includeHeaders}
                onChange={handleToggleHeaders}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="includeHeaders" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                Include column headers
              </label>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-gray-700 dark:text-gray-300">Data to export:</p>
              <div className="space-y-2">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="all"
                    name="selection"
                    checked={exportConfig.selection === 'all'}
                    onChange={() => handleSelectionChange('all')}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                  />
                  <label htmlFor="all" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                    All data ({itemCount} {dataType})
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="filtered"
                    name="selection"
                    checked={exportConfig.selection === 'filtered'}
                    onChange={() => handleSelectionChange('filtered')}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                  />
                  <label htmlFor="filtered" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                    Current filtered data
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="selected"
                    name="selection"
                    checked={exportConfig.selection === 'selected'}
                    onChange={() => handleSelectionChange('selected')}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                  />
                  <label htmlFor="selected" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                    Selected items only
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Date Range (optional) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Date Range</h3>
            <button
              type="button"
              onClick={() => setShowDateRange(!showDateRange)}
              className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300"
            >
              {showDateRange ? 'Hide' : 'Show'}
            </button>
          </div>
          
          {showDateRange && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  id="startDate"
                  name="startDate"
                  value={exportConfig.dateRange?.startDate || ''}
                  onChange={handleDateRangeChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  id="endDate"
                  name="endDate"
                  value={exportConfig.dateRange?.endDate || ''}
                  onChange={handleDateRangeChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </ActionModal>
  );
}