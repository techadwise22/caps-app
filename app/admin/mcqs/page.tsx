'use client';

import { useState, useRef } from 'react';
import * as XLSX from 'xlsx';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { 
  PlusIcon, 
  TrashIcon, 
  DocumentArrowUpIcon,
  DocumentArrowDownIcon,
  CheckIcon,
  XMarkIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

interface MCQ {
  id: string;
  question: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctAnswer: string;
  subject: string;
  level: string;
  explanation: string;
  created_at: string;
  updated_at: string;
}

interface CSVRow {
  'Q.No': string;
  'Question': string;
  'Option A': string;
  'Option B': string;
  'Option C': string;
  'Option D': string;
  'Answer': string;
  'Subject': string;
  'Level': string;
  'Explanation': string;
}

export default function AdminMCQsPage() {
  const [mcqs, setMcqs] = useState<MCQ[]>([]);
  const [selectedMcqs, setSelectedMcqs] = useState<Set<string>>(new Set());
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadedData, setUploadedData] = useState<CSVRow[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSubject, setFilterSubject] = useState('');
  const [filterLevel, setFilterLevel] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Mock data for demonstration
  useState(() => {
    const mockMCQs: MCQ[] = [
      {
        id: '1',
        question: 'What is the basic accounting equation?',
        optionA: 'Assets = Liabilities + Owner\'s Equity',
        optionB: 'Assets = Liabilities - Owner\'s Equity',
        optionC: 'Assets + Liabilities = Owner\'s Equity',
        optionD: 'Assets - Liabilities = Owner\'s Equity',
        correctAnswer: 'A',
        subject: 'Accounting',
        level: 'Foundation',
        explanation: 'The basic accounting equation is Assets = Liabilities + Owner\'s Equity.',
        created_at: '2024-01-15T00:00:00Z',
        updated_at: '2024-01-15T00:00:00Z'
      },
      {
        id: '2',
        question: 'Which of the following is a current asset?',
        optionA: 'Land',
        optionB: 'Buildings',
        optionC: 'Cash',
        optionD: 'Equipment',
        correctAnswer: 'C',
        subject: 'Accounting',
        level: 'Foundation',
        explanation: 'Cash is a current asset as it can be converted to cash within one year.',
        created_at: '2024-01-15T00:00:00Z',
        updated_at: '2024-01-15T00:00:00Z'
      },
      {
        id: '3',
        question: 'What is the primary purpose of a trial balance?',
        optionA: 'To prepare financial statements',
        optionB: 'To check the mathematical accuracy of accounts',
        optionC: 'To record business transactions',
        optionD: 'To calculate profit or loss',
        correctAnswer: 'B',
        subject: 'Accounting',
        level: 'Foundation',
        explanation: 'A trial balance is used to check the mathematical accuracy of accounts.',
        created_at: '2024-01-15T00:00:00Z',
        updated_at: '2024-01-15T00:00:00Z'
      }
    ];
    setMcqs(mockMCQs);
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    
    if (fileExtension === 'xlsx' || fileExtension === 'xls') {
      handleExcelUpload(file);
    } else if (fileExtension === 'csv') {
      handleCSVUpload(file);
    } else {
      toast.error('Please upload a valid Excel (.xlsx/.xls) or CSV file');
    }
  };

  const handleExcelUpload = async (file: File) => {
    try {
      setIsUploading(true);
      toast.success('Excel file uploaded successfully! Processing...');
      
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          
          // Get the first sheet
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          
          // Convert to JSON
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
          
          if (jsonData.length < 2) {
            toast.error('Excel file must have at least a header row and one data row');
            setIsUploading(false);
            return;
          }
          
          // Get headers from first row
          const headers = jsonData[0] as string[];
          
          // Validate headers
          const requiredHeaders = ['Q.No', 'Question', 'Option A', 'Option B', 'Option C', 'Option D', 'Answer', 'Subject', 'Level'];
          const missingHeaders = requiredHeaders.filter(header => !headers.includes(header));
          
          if (missingHeaders.length > 0) {
            toast.error(`Missing required columns: ${missingHeaders.join(', ')}`);
            setIsUploading(false);
            return;
          }
          
          // Process data rows
          const processedData: CSVRow[] = [];
          for (let i = 1; i < jsonData.length; i++) {
            const row = jsonData[i] as any[];
            if (row.length > 0 && row.some(cell => cell)) { // Skip empty rows
              const rowData: CSVRow = {
                'Q.No': row[headers.indexOf('Q.No')]?.toString() || '',
                'Question': row[headers.indexOf('Question')]?.toString() || '',
                'Option A': row[headers.indexOf('Option A')]?.toString() || '',
                'Option B': row[headers.indexOf('Option B')]?.toString() || '',
                'Option C': row[headers.indexOf('Option C')]?.toString() || '',
                'Option D': row[headers.indexOf('Option D')]?.toString() || '',
                'Answer': row[headers.indexOf('Answer')]?.toString() || '',
                'Subject': row[headers.indexOf('Subject')]?.toString() || '',
                'Level': row[headers.indexOf('Level')]?.toString() || '',
                'Explanation': row[headers.indexOf('Explanation')]?.toString() || ''
              };
              processedData.push(rowData);
            }
          }
          
          if (processedData.length === 0) {
            toast.error('No valid data found in Excel file');
            setIsUploading(false);
            return;
          }
          
          setUploadedData(processedData);
          setShowUploadModal(true);
          toast.success(`Excel file processed successfully! Found ${processedData.length} questions.`);
          
        } catch (error) {
          toast.error('Error processing Excel file');
          console.error('Excel processing error:', error);
        } finally {
          setIsUploading(false);
        }
      };
      
      reader.readAsArrayBuffer(file);
      
    } catch (error) {
      toast.error('Error reading Excel file');
      console.error('Excel upload error:', error);
      setIsUploading(false);
    }
  };

  const handleCSVUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const csv = e.target?.result as string;
        const lines = csv.split('\n');
        const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
        
        const data: CSVRow[] = [];
        for (let i = 1; i < lines.length; i++) {
          if (lines[i].trim()) {
            const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
            const row: any = {};
            headers.forEach((header, index) => {
              row[header] = values[index] || '';
            });
            data.push(row as CSVRow);
          }
        }
        
        setUploadedData(data);
        setShowUploadModal(true);
        toast.success('CSV file uploaded successfully!');
      } catch (error) {
        toast.error('Error processing CSV file');
        console.error('CSV processing error:', error);
      }
    };
    reader.readAsText(file);
  };

  const importMCQs = () => {
    const newMCQs: MCQ[] = uploadedData.map((row, index) => ({
      id: Date.now().toString() + index,
      question: row['Question'],
      optionA: row['Option A'],
      optionB: row['Option B'],
      optionC: row['Option C'],
      optionD: row['Option D'],
      correctAnswer: row['Answer'],
      subject: row['Subject'],
      level: row['Level'],
      explanation: row['Explanation'],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }));

    setMcqs(prev => [...prev, ...newMCQs]);
    setShowUploadModal(false);
    setUploadedData([]);
    toast.success(`Successfully imported ${newMCQs.length} MCQs!`);
  };

  const toggleSelectAll = () => {
    if (selectedMcqs.size === mcqs.length) {
      setSelectedMcqs(new Set());
    } else {
      setSelectedMcqs(new Set(mcqs.map(mcq => mcq.id)));
    }
  };

  const toggleMcqSelection = (mcqId: string) => {
    const newSelected = new Set(selectedMcqs);
    if (newSelected.has(mcqId)) {
      newSelected.delete(mcqId);
    } else {
      newSelected.add(mcqId);
    }
    setSelectedMcqs(newSelected);
  };

  const deleteSelectedMcqs = () => {
    setMcqs(prev => prev.filter(mcq => !selectedMcqs.has(mcq.id)));
    setSelectedMcqs(new Set());
    setShowDeleteConfirm(false);
    toast.success(`Deleted ${selectedMcqs.size} MCQs successfully!`);
  };

  const deleteMcq = (mcqId: string) => {
    setMcqs(prev => prev.filter(mcq => mcq.id !== mcqId));
    setSelectedMcqs(prev => {
      const newSelected = new Set(prev);
      newSelected.delete(mcqId);
      return newSelected;
    });
    toast.success('MCQ deleted successfully!');
  };

  const downloadTemplate = () => {
    // Create sample data
    const sampleData = [
      {
        'Q.No': '1',
        'Question': 'What is the basic accounting equation?',
        'Option A': 'Assets = Liabilities + Owner\'s Equity',
        'Option B': 'Assets = Liabilities - Owner\'s Equity',
        'Option C': 'Assets + Liabilities = Owner\'s Equity',
        'Option D': 'Assets - Liabilities = Owner\'s Equity',
        'Answer': 'A',
        'Subject': 'Accounting',
        'Level': 'Foundation',
        'Explanation': 'The basic accounting equation is Assets = Liabilities + Owner\'s Equity. This equation must always balance and forms the foundation of double-entry bookkeeping.'
      },
      {
        'Q.No': '2',
        'Question': 'Which of the following is a current asset?',
        'Option A': 'Land',
        'Option B': 'Buildings',
        'Option C': 'Cash',
        'Option D': 'Equipment',
        'Answer': 'C',
        'Subject': 'Accounting',
        'Level': 'Foundation',
        'Explanation': 'Cash is a current asset as it can be converted to cash within one year.'
      }
    ];

    // Create Excel file
    const worksheet = XLSX.utils.json_to_sheet(sampleData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'MCQ Template');
    
    // Download Excel file
    XLSX.writeFile(workbook, 'mcq-template.xlsx');
    
    toast.success('Excel template downloaded successfully!');
  };

  const filteredMcqs = mcqs.filter(mcq => {
    const matchesSearch = mcq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         mcq.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = !filterSubject || mcq.subject === filterSubject;
    const matchesLevel = !filterLevel || mcq.level === filterLevel;
    
    return matchesSearch && matchesSubject && matchesLevel;
  });

  const subjects = Array.from(new Set(mcqs.map(mcq => mcq.subject)));
  const levels = Array.from(new Set(mcqs.map(mcq => mcq.level)));

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-surface-900 mb-2">MCQ Management</h1>
          <p className="text-surface-600">Upload, manage, and organize multiple choice questions</p>
        </div>

        {/* Action Bar */}
        <div className="bg-white rounded-xl shadow-soft p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
              <button
                onClick={() => setShowUploadModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
              >
                <DocumentArrowUpIcon className="h-5 w-5 mr-2" />
                Import MCQs
              </button>
              
              <button
                onClick={downloadTemplate}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center"
              >
                <DocumentArrowDownIcon className="h-5 w-5 mr-2" />
                Download Excel Template
              </button>
            </div>

            {selectedMcqs.size > 0 && (
              <div className="flex items-center space-x-3">
                <span className="text-sm text-surface-600">
                  {selectedMcqs.size} MCQ{selectedMcqs.size !== 1 ? 's' : ''} selected
                </span>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center"
                >
                  <TrashIcon className="h-5 w-5 mr-2" />
                  Delete Selected
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-soft p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-2">Search</label>
              <input
                type="text"
                placeholder="Search questions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-2">Subject</label>
              <select
                value={filterSubject}
                onChange={(e) => setFilterSubject(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Subjects</option>
                {subjects.map(subject => (
                  <option key={subject} value={subject}>{subject}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-2">Level</label>
              <select
                value={filterLevel}
                onChange={(e) => setFilterLevel(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Levels</option>
                {levels.map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>
            
            <div className="flex items-end">
              <button
                onClick={() => {
                  setSearchTerm('');
                  setFilterSubject('');
                  setFilterLevel('');
                }}
                className="w-full bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* MCQ List */}
        <div className="bg-white rounded-xl shadow-soft p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-surface-900">
              MCQs ({filteredMcqs.length})
            </h2>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={toggleSelectAll}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                {selectedMcqs.size === mcqs.length ? 'Deselect All' : 'Select All'}
              </button>
            </div>
          </div>

          {filteredMcqs.length === 0 ? (
            <div className="text-center py-12">
              <DocumentArrowUpIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No MCQs found. Import some MCQs to get started.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredMcqs.map((mcq) => (
                <div
                  key={mcq.id}
                  className={`border rounded-lg p-4 transition-colors ${
                    selectedMcqs.has(mcq.id) 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      checked={selectedMcqs.has(mcq.id)}
                      onChange={() => toggleMcqSelection(mcq.id)}
                      className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                            {mcq.subject}
                          </span>
                          <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                            {mcq.level}
                          </span>
                        </div>
                        
                        <button
                          onClick={() => deleteMcq(mcq.id)}
                          className="text-red-600 hover:text-red-800 p-1"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                      
                      <h3 className="font-medium text-surface-900 mb-3">{mcq.question}</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-3">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium text-surface-600">A:</span>
                          <span className={`text-sm ${mcq.correctAnswer === 'A' ? 'text-green-600 font-semibold' : 'text-surface-700'}`}>
                            {mcq.optionA}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium text-surface-600">B:</span>
                          <span className={`text-sm ${mcq.correctAnswer === 'B' ? 'text-green-600 font-semibold' : 'text-surface-700'}`}>
                            {mcq.optionB}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium text-surface-600">C:</span>
                          <span className={`text-sm ${mcq.correctAnswer === 'C' ? 'text-green-600 font-semibold' : 'text-surface-700'}`}>
                            {mcq.optionC}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium text-surface-600">D:</span>
                          <span className={`text-sm ${mcq.correctAnswer === 'D' ? 'text-green-600 font-semibold' : 'text-surface-700'}`}>
                            {mcq.optionD}
                          </span>
                        </div>
                      </div>
                      
                      {mcq.explanation && (
                        <p className="text-sm text-surface-600 bg-gray-50 p-2 rounded">
                          <span className="font-medium">Explanation:</span> {mcq.explanation}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Upload Modal */}
        {showUploadModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-surface-900">Import MCQs</h3>
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              <div className="mb-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <h4 className="font-medium text-blue-800 mb-2">Supported File Formats:</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• <strong>Excel (.xlsx, .xls)</strong> - Recommended for large datasets</li>
                    <li>• <strong>CSV (.csv)</strong> - Simple text format</li>
                  </ul>
                </div>

                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".xlsx,.xls,.csv"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  
                  <DocumentArrowUpIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Click to upload
                    </button>{' '}
                    or drag and drop
                  </p>
                  <p className="text-sm text-gray-500">
                    Excel (.xlsx, .xls) or CSV files up to 10MB
                  </p>
                </div>
              </div>

              {uploadedData.length > 0 && (
                <div className="mb-6">
                  <h4 className="font-medium text-surface-900 mb-3">
                    Preview ({uploadedData.length} questions)
                  </h4>
                  
                  <div className="border rounded-lg overflow-hidden">
                    <div className="bg-gray-50 px-4 py-2 border-b">
                      <div className="grid grid-cols-10 gap-2 text-xs font-medium text-gray-600">
                        <div className="col-span-1">Q.No</div>
                        <div className="col-span-2">Question</div>
                        <div className="col-span-1">Option A</div>
                        <div className="col-span-1">Option B</div>
                        <div className="col-span-1">Option C</div>
                        <div className="col-span-1">Option D</div>
                        <div className="col-span-1">Answer</div>
                        <div className="col-span-1">Subject</div>
                        <div className="col-span-1">Level</div>
                      </div>
                    </div>
                    
                    <div className="max-h-64 overflow-y-auto">
                      {uploadedData.slice(0, 5).map((row, index) => (
                        <div key={index} className="px-4 py-2 border-b hover:bg-gray-50">
                          <div className="grid grid-cols-10 gap-2 text-xs">
                            <div className="col-span-1">{row['Q.No']}</div>
                            <div className="col-span-2 truncate">{row['Question']}</div>
                            <div className="col-span-1 truncate">{row['Option A']}</div>
                            <div className="col-span-1 truncate">{row['Option B']}</div>
                            <div className="col-span-1 truncate">{row['Option C']}</div>
                            <div className="col-span-1 truncate">{row['Option D']}</div>
                            <div className="col-span-1">{row['Answer']}</div>
                            <div className="col-span-1">{row['Subject']}</div>
                            <div className="col-span-1">{row['Level']}</div>
                          </div>
                        </div>
                      ))}
                      {uploadedData.length > 5 && (
                        <div className="px-4 py-2 text-center text-sm text-gray-500">
                          ... and {uploadedData.length - 5} more questions
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                
                {uploadedData.length > 0 && (
                  <button
                    onClick={importMCQs}
                    disabled={isUploading}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                  >
                    {isUploading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Processing...
                      </>
                    ) : (
                      <>
                        <CheckIcon className="h-4 w-4 mr-2" />
                        Import {uploadedData.length} MCQs
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
              <div className="flex items-center space-x-3 mb-4">
                <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
                <h3 className="text-lg font-semibold text-surface-900">Confirm Deletion</h3>
              </div>
              
              <p className="text-surface-600 mb-6">
                Are you sure you want to delete {selectedMcqs.size} MCQ{selectedMcqs.size !== 1 ? 's' : ''}? 
                This action cannot be undone.
              </p>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={deleteSelectedMcqs}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
} 