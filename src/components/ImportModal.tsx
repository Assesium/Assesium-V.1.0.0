import { useState } from 'react';
import { X, Upload, FileText, AlertCircle, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { FileUpload } from './FileUpload';
import * as XLSX from 'xlsx';
import Papa from 'papaparse';

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (data: any[]) => void;
  type: 'students' | 'teachers';
  title?: string;
}

interface PreviewData {
  headers: string[];
  rows: any[];
  totalRows: number;
  validRows: number;
  invalidRows: number;
  errors: { row: number; message: string }[];
}

export default function ImportModal({ isOpen, onClose, onImport, type, title }: ImportModalProps) {
  const [step, setStep] = useState<'upload' | 'preview' | 'processing' | 'complete'>('upload');
  const [file, setFile] = useState<File | null>(null);
  const [previewData, setPreviewData] = useState<PreviewData | null>(null);
  const [processingStatus, setProcessingStatus] = useState({ current: 0, total: 0 });
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFileUpload = (files: File[]) => {
    if (files.length === 0) return;
    
    const uploadedFile = files[0];
    setFile(uploadedFile);
    
    // Process the file based on its type
    const fileExtension = uploadedFile.name.split('.').pop()?.toLowerCase();
    
    if (fileExtension === 'csv') {
      parseCSV(uploadedFile);
    } else if (fileExtension === 'xlsx' || fileExtension === 'xls') {
      parseExcel(uploadedFile);
    } else {
      setError('Unsupported file format. Please upload a CSV or Excel file.');
    }
  };

  const parseCSV = (file: File) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        processFileData(results.data, results.meta.fields || []);
      },
      error: (error) => {
        setError(`Error parsing CSV file: ${error.message}`);
      }
    });
  };

  const parseExcel = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        const headers = Object.keys(jsonData[0] || {});
        
        processFileData(jsonData, headers);
      } catch (err) {
        setError(`Error parsing Excel file: ${err.message}`);
      }
    };
    reader.onerror = () => {
      setError('Error reading file');
    };
    reader.readAsBinaryString(file);
  };

  const processFileData = (data: any[], headers: string[]) => {
    // Validate the data based on type (students or teachers)
    const requiredFields = type === 'students' 
      ? ['name', 'email', 'phone', 'grade', 'institution', 'guardianName', 'guardianContact', 'dateOfBirth', 'address']
      : ['name', 'email', 'phone', 'department', 'institution', 'qualification', 'joinDate'];
    
    const lowercaseHeaders = headers.map(h => h.toLowerCase());
    const missingFields = requiredFields.filter(field => 
      !lowercaseHeaders.some(header => header.includes(field.toLowerCase()))
    );
    
    if (missingFields.length > 0) {
      setError(`Missing required fields: ${missingFields.join(', ')}`);
      return;
    }
    
    // Map headers to standardized field names
    const fieldMapping = createFieldMapping(lowercaseHeaders, requiredFields);
    
    // Validate each row
    const errors: { row: number; message: string }[] = [];
    const validRows = data.filter((row, index) => {
      // Check for required fields
      for (const field of requiredFields) {
        const mappedField = fieldMapping[field];
        if (!mappedField || !row[mappedField]) {
          errors.push({ 
            row: index + 1, 
            message: `Missing value for ${field}` 
          });
          return false;
        }
      }
      return true;
    });
    
    // Prepare preview data
    setPreviewData({
      headers,
      rows: data.slice(0, 5), // Show first 5 rows for preview
      totalRows: data.length,
      validRows: validRows.length,
      invalidRows: data.length - validRows.length,
      errors: errors.slice(0, 5) // Show first 5 errors
    });
    
    // Move to preview step
    setStep('preview');
  };

  const createFieldMapping = (headers: string[], requiredFields: string[]) => {
    const mapping: Record<string, string> = {};
    
    for (const field of requiredFields) {
      // Find the header that contains the field name
      const matchingHeader = headers.find(header => header.includes(field.toLowerCase()));
      if (matchingHeader) {
        mapping[field] = matchingHeader;
      }
    }
    
    return mapping;
  };

  const handleConfirmImport = () => {
    if (!file || !previewData) return;
    
    setStep('processing');
    setProcessingStatus({ current: 0, total: previewData.totalRows });
    
    // In a real application, you would process the file in chunks
    // Here we'll simulate processing with a timeout
    const processChunk = (startIdx: number, endIdx: number, allData: any[]) => {
      setTimeout(() => {
        setProcessingStatus({ 
          current: Math.min(endIdx, allData.length), 
          total: allData.length 
        });
        
        if (endIdx >= allData.length) {
          // Processing complete
          setStep('complete');
          onImport(allData);
        } else {
          // Process next chunk
          processChunk(endIdx, endIdx + 10, allData);
        }
      }, 100);
    };
    
    // Start processing
    if (file.name.endsWith('.csv')) {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          processChunk(0, 10, results.data);
        }
      });
    } else {
      // For Excel files, we already have the data
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        processChunk(0, 10, jsonData);
      };
      reader.readAsBinaryString(file);
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 'upload':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <FileText className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Import {type === 'students' ? 'Students' : 'Teachers'}
              </h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Upload a CSV or Excel file containing {type === 'students' ? 'student' : 'teacher'} information.
                Make sure your file includes all required fields.
              </p>
            </div>
            
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4">
                <div className="flex items-start">
                  <AlertCircle className="h-5 w-5 text-red-500 dark:text-red-400 mt-0.5" />
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800 dark:text-red-300">Error</h3>
                    <div className="mt-1 text-sm text-red-700 dark:text-red-400">
                      {error}
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div className="mt-4">
              <FileUpload 
                onUpload={handleFileUpload} 
                acceptedFileTypes={['text/csv', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']}
                label="Click to upload or drag and drop"
                description="Supports: CSV, Excel (.xlsx, .xls)"
                icon={<Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />}
              />
            </div>
          </div>
        );
        
      case 'preview':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Preview Import Data
              </h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Review the data before importing. {previewData?.totalRows} rows found.
              </p>
            </div>
            
            <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 rounded-md p-4">
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {previewData?.validRows} valid rows
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Ready to import
                </p>
              </div>
              
              {previewData?.invalidRows ? (
                <div>
                  <p className="text-sm font-medium text-red-600 dark:text-red-400">
                    {previewData.invalidRows} invalid rows
                  </p>
                  <p className="text-xs text-red-500 dark:text-red-400">
                    Will be skipped
                  </p>
                </div>
              ) : null}
            </div>
            
            {/* Preview table */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    {previewData?.headers.map((header, index) => (
                      <th 
                        key={index}
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {previewData?.rows.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      {previewData.headers.map((header, colIndex) => (
                        <td 
                          key={colIndex}
                          className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300"
                        >
                          {row[header]}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {previewData?.errors.length ? (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4">
                <div className="flex">
                  <AlertCircle className="h-5 w-5 text-red-500 dark:text-red-400" />
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800 dark:text-red-300">Validation Errors</h3>
                    <ul className="mt-2 text-sm text-red-700 dark:text-red-400 list-disc pl-5 space-y-1">
                      {previewData.errors.map((error, index) => (
                        <li key={index}>
                          Row {error.row}: {error.message}
                        </li>
                      ))}
                    </ul>
                    {previewData.errors.length < previewData.invalidRows && (
                      <p className="mt-2 text-sm text-red-700 dark:text-red-400">
                        And {previewData.invalidRows - previewData.errors.length} more errors...
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ) : null}
            
            <div className="flex justify-end space-x-4 pt-4 border-t dark:border-gray-700">
              <button
                onClick={() => {
                  setStep('upload');
                  setFile(null);
                  setPreviewData(null);
                  setError(null);
                }}
                className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Back
              </button>
              <button
                onClick={handleConfirmImport}
                disabled={!previewData?.validRows}
                className={`px-6 py-2 rounded-lg font-medium flex items-center space-x-2 ${previewData?.validRows ? 'bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800' : 'bg-gray-300 text-gray-500 dark:bg-gray-700 dark:text-gray-400 cursor-not-allowed'}`}
              >
                <Upload className="h-4 w-4" />
                <span>Import {previewData?.validRows || 0} {type === 'students' ? 'Students' : 'Teachers'}</span>
              </button>
            </div>
          </div>
        );
        
      case 'processing':
        return (
          <div className="space-y-6 text-center py-8">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 dark:border-blue-400 mx-auto"></div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Processing Import
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Importing {processingStatus.current} of {processingStatus.total} records...
            </p>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
              <div 
                className="bg-blue-600 dark:bg-blue-500 h-2.5 rounded-full" 
                style={{ width: `${(processingStatus.current / processingStatus.total) * 100}%` }}
              ></div>
            </div>
          </div>
        );
        
      case 'complete':
        return (
          <div className="space-y-6 text-center py-8">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 dark:bg-green-900/30">
              <CheckCircle className="h-10 w-10 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Import Complete
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Successfully imported {processingStatus.current} {type === 'students' ? 'students' : 'teachers'}.
            </p>
            <button
              onClick={onClose}
              className="mt-4 inline-flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 transition-colors"
            >
              Done
            </button>
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-auto transition-colors duration-300"
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {title || (type === 'students' ? 'Import Students' : 'Import Teachers')}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 dark:text-gray-300 dark:hover:text-white transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {renderStepContent()}
        </div>
      </motion.div>
    </div>
  );
}