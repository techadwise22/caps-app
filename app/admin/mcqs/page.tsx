'use client';

import { useAuth } from '@/components/providers/AuthProvider';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { 
  QuestionMarkCircleIcon, 
  PlusIcon, 
  DocumentArrowUpIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  CheckCircleIcon,
  XCircleIcon
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
  explanation?: string;
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

export default function MCQManagement() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [mcqs, setMcqs] = useState<MCQ[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [previewData, setPreviewData] = useState<CSVRow[]>([]);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      loadMCQs();
    }
  }, [user]);

  const loadMCQs = () => {
    setLoadingData(true);
    
    // Mock data - in real app, this would fetch from API
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
        optionA: 'Building',
        optionB: 'Equipment',
        optionC: 'Cash',
        optionD: 'Land',
        correctAnswer: 'C',
        subject: 'Accounting',
        level: 'Foundation',
        explanation: 'Cash is a current asset as it can be converted to cash within one year.',
        created_at: '2024-01-15T00:00:00Z',
        updated_at: '2024-01-15T00:00:00Z'
      }
    ];
    
    setMcqs(mockMCQs);
    setLoadingData(false);
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'text/csv') {
      setCsvFile(file);
      parseCSV(file);
    } else {
      toast.error('Please select a valid CSV file');
    }
  };

  const parseCSV = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const rows = text.split('\n');
      const headers = rows[0].split(',').map(h => h.trim().replace(/"/g, ''));
      
      const data: CSVRow[] = [];
      for (let i = 1; i < rows.length; i++) {
        if (rows[i].trim()) {
          const values = rows[i].split(',').map(v => v.trim().replace(/"/g, ''));
          const row: any = {};
          headers.forEach((header, index) => {
            row[header] = values[index] || '';
          });
          data.push(row);
        }
      }
      
      setPreviewData(data);
      setShowPreview(true);
    };
    reader.readAsText(file);
  };

  const handleUpload = async () => {
    if (!csvFile) return;
    
    setUploading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Convert CSV data to MCQ format
      const newMCQs: MCQ[] = previewData.map((row, index) => ({
        id: `mcq-${Date.now()}-${index}`,
        question: row['Question'] || '',
        optionA: row['Option A'] || '',
        optionB: row['Option B'] || '',
        optionC: row['Option C'] || '',
        optionD: row['Option D'] || '',
        correctAnswer: row['Answer'] || 'A',
        subject: row['Subject'] || 'General',
        level: row['Level'] || 'Foundation',
        explanation: row['Explanation'] || '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }));
      
      // Add to existing MCQs
      setMcqs(prev => [...prev, ...newMCQs]);
      
      toast.success(`Successfully uploaded ${newMCQs.length} MCQs`);
      setShowUploadModal(false);
      setCsvFile(null);
      setPreviewData([]);
      setShowPreview(false);
      
    } catch (error) {
      toast.error('Failed to upload MCQs');
    } finally {
      setUploading(false);
    }
  };

  const deleteMCQ = (id: string) => {
    setMcqs(prev => prev.filter(mcq => mcq.id !== id));
    toast.success('MCQ deleted successfully');
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Foundation':
        return 'bg-primary-100 text-primary-700';
      case 'Intermediate':
        return 'bg-secondary-100 text-secondary-700';
      case 'Final':
        return 'bg-success-100 text-success-700';
      default:
        return 'bg-surface-100 text-surface-700';
    }
  };

  const getSubjectColor = (subject: string) => {
    switch (subject.toLowerCase()) {
      case 'accounting':
        return 'bg-blue-100 text-blue-700';
      case 'business laws':
        return 'bg-green-100 text-green-700';
      case 'economics':
        return 'bg-purple-100 text-purple-700';
      case 'mathematics':
        return 'bg-orange-100 text-orange-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  if (loading || loadingData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner w-8 h-8"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-surface-900">MCQ Management</h1>
            <p className="text-surface-600">Upload and manage multiple choice questions</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => {
                const link = document.createElement('a');
                link.href = '/mcq-template.csv';
                link.download = 'mcq-template.csv';
                link.click();
              }}
              className="bg-surface-100 text-surface-700 px-4 py-2 rounded-lg hover:bg-surface-200 transition-colors flex items-center"
            >
              <DocumentArrowUpIcon className="h-5 w-5 mr-2" />
              Download Template
            </button>
            <button
              onClick={() => setShowUploadModal(true)}
              className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center"
            >
              <DocumentArrowUpIcon className="h-5 w-5 mr-2" />
              Upload CSV
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-soft">
            <div className="flex items-center">
              <div className="p-2 bg-primary-100 rounded-lg">
                <QuestionMarkCircleIcon className="h-6 w-6 text-primary-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-surface-600">Total MCQs</p>
                <p className="text-2xl font-bold text-surface-900">{mcqs.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-soft">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <QuestionMarkCircleIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-surface-600">Accounting</p>
                <p className="text-2xl font-bold text-surface-900">{mcqs.filter(m => m.subject === 'Accounting').length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-soft">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <QuestionMarkCircleIcon className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-surface-600">Business Laws</p>
                <p className="text-2xl font-bold text-surface-900">{mcqs.filter(m => m.subject === 'Business Laws').length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-soft">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <QuestionMarkCircleIcon className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-surface-600">Other Subjects</p>
                <p className="text-2xl font-bold text-surface-900">{mcqs.filter(m => !['Accounting', 'Business Laws'].includes(m.subject)).length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* MCQ List */}
        <div className="bg-white rounded-xl shadow-soft">
          <div className="p-6 border-b border-surface-200">
            <h2 className="text-xl font-semibold text-surface-900">All MCQs</h2>
            <p className="text-surface-600 text-sm">Manage and review uploaded questions</p>
          </div>
          <div className="p-6">
            {mcqs.length > 0 ? (
              <div className="space-y-4">
                {mcqs.map((mcq) => (
                  <div key={mcq.id} className="border border-surface-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <div className="p-2 bg-primary-100 rounded-lg">
                            <QuestionMarkCircleIcon className="h-5 w-5 text-primary-600" />
                          </div>
                          <h3 className="text-lg font-semibold text-surface-900 line-clamp-2">{mcq.question}</h3>
                        </div>
                        
                        <div className="flex items-center space-x-3 mb-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSubjectColor(mcq.subject)}`}>
                            {mcq.subject}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(mcq.level)}`}>
                            {mcq.level}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-3 mb-4">
                          <div className="flex items-center space-x-2">
                            <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                              mcq.correctAnswer === 'A' ? 'border-success-500 bg-success-500' : 'border-surface-300'
                            }`}>
                              {mcq.correctAnswer === 'A' && <CheckCircleIcon className="h-3 w-3 text-white" />}
                            </span>
                            <span className="text-sm text-surface-700">A. {mcq.optionA}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                              mcq.correctAnswer === 'B' ? 'border-success-500 bg-success-500' : 'border-surface-300'
                            }`}>
                              {mcq.correctAnswer === 'B' && <CheckCircleIcon className="h-3 w-3 text-white" />}
                            </span>
                            <span className="text-sm text-surface-700">B. {mcq.optionB}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                              mcq.correctAnswer === 'C' ? 'border-success-500 bg-success-500' : 'border-surface-300'
                            }`}>
                              {mcq.correctAnswer === 'C' && <CheckCircleIcon className="h-3 w-3 text-white" />}
                            </span>
                            <span className="text-sm text-surface-700">C. {mcq.optionC}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                              mcq.correctAnswer === 'D' ? 'border-success-500 bg-success-500' : 'border-surface-300'
                            }`}>
                              {mcq.correctAnswer === 'D' && <CheckCircleIcon className="h-3 w-3 text-white" />}
                            </span>
                            <span className="text-sm text-surface-700">D. {mcq.optionD}</span>
                          </div>
                        </div>

                        {mcq.explanation && (
                          <p className="text-sm text-surface-600 mb-3">
                            <strong>Explanation:</strong> {mcq.explanation}
                          </p>
                        )}

                        <div className="flex items-center space-x-4 text-xs text-surface-500">
                          <span>Created: {new Date(mcq.created_at).toLocaleDateString()}</span>
                          <span>Updated: {new Date(mcq.updated_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2 ml-4">
                        <button className="bg-surface-100 text-surface-700 p-2 rounded-lg hover:bg-surface-200 transition-colors">
                          <EyeIcon className="h-4 w-4" />
                        </button>
                        <button className="bg-primary-100 text-primary-700 p-2 rounded-lg hover:bg-primary-200 transition-colors">
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => deleteMCQ(mcq.id)}
                          className="bg-danger-100 text-danger-700 p-2 rounded-lg hover:bg-danger-200 transition-colors"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-surface-600">
                <QuestionMarkCircleIcon className="h-12 w-12 mx-auto mb-4 text-surface-400" />
                <p>No MCQs uploaded yet</p>
                <p className="text-sm text-surface-500 mt-1">Upload a CSV file to get started</p>
              </div>
            )}
          </div>
        </div>

        {/* CSV Upload Modal */}
        {showUploadModal && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <div className="fixed inset-0 bg-surface-900/75 transition-opacity" onClick={() => setShowUploadModal(false)} />
              <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl">
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-primary-100 sm:mx-0 sm:h-10 sm:w-10">
                      <DocumentArrowUpIcon className="h-6 w-6 text-primary-600" />
                    </div>
                    <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                      <h3 className="text-lg font-medium leading-6 text-surface-900">
                        Upload MCQ CSV
                      </h3>
                      <div className="mt-2">
                        <p className="text-sm text-surface-600">
                          Upload a CSV file with MCQ data. The file should have columns: Q.No, Question, Option A, Option B, Option C, Option D, Answer, Subject, Level, Explanation.
                        </p>
                        
                        <div className="mt-4">
                          <label className="block text-sm font-medium text-surface-700 mb-2">
                            Select CSV File
                          </label>
                          <input
                            type="file"
                            accept=".csv"
                            onChange={handleFileSelect}
                            className="block w-full text-sm text-surface-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                          />
                        </div>

                        {csvFile && (
                          <div className="mt-4 p-3 bg-surface-50 rounded-lg">
                            <p className="text-sm text-surface-600">
                              <strong>Selected file:</strong> {csvFile.name}
                            </p>
                            <p className="text-sm text-surface-500">
                              Size: {(csvFile.size / 1024).toFixed(2)} KB
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-surface-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                  <button
                    type="button"
                    onClick={handleUpload}
                    disabled={!csvFile || uploading}
                    className="inline-flex w-full justify-center rounded-lg bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 disabled:opacity-50 disabled:cursor-not-allowed sm:ml-3 sm:w-auto"
                  >
                    {uploading ? 'Uploading...' : 'Upload MCQs'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowUploadModal(false)}
                    className="mt-3 inline-flex w-full justify-center rounded-lg bg-white px-3 py-2 text-sm font-semibold text-surface-900 shadow-sm ring-1 ring-inset ring-surface-300 hover:bg-surface-50 sm:mt-0 sm:w-auto"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* CSV Preview Modal */}
        {showPreview && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <div className="fixed inset-0 bg-surface-900/75 transition-opacity" onClick={() => setShowPreview(false)} />
              <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-6xl">
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-warning-100 sm:mx-0 sm:h-10 sm:w-10">
                      <EyeIcon className="h-6 w-6 text-warning-600" />
                    </div>
                    <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full">
                      <h3 className="text-lg font-medium leading-6 text-surface-900">
                        CSV Preview
                      </h3>
                      <div className="mt-2">
                        <p className="text-sm text-surface-600 mb-4">
                          Preview of {previewData.length} MCQs before upload
                        </p>
                        
                        <div className="overflow-x-auto">
                          <table className="min-w-full divide-y divide-surface-200">
                            <thead className="bg-surface-50">
                              <tr>
                                <th className="px-3 py-2 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">Q.No</th>
                                <th className="px-3 py-2 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">Question</th>
                                <th className="px-3 py-2 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">Option A</th>
                                <th className="px-3 py-2 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">Option B</th>
                                <th className="px-3 py-2 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">Option C</th>
                                <th className="px-3 py-2 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">Option D</th>
                                <th className="px-3 py-2 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">Answer</th>
                                <th className="px-3 py-2 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">Subject</th>
                                <th className="px-3 py-2 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">Level</th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-surface-200">
                              {previewData.slice(0, 10).map((row, index) => (
                                <tr key={index}>
                                  <td className="px-3 py-2 whitespace-nowrap text-sm text-surface-900">{row['Q.No']}</td>
                                  <td className="px-3 py-2 text-sm text-surface-900 max-w-xs truncate">{row['Question']}</td>
                                  <td className="px-3 py-2 text-sm text-surface-900 max-w-xs truncate">{row['Option A']}</td>
                                  <td className="px-3 py-2 text-sm text-surface-900 max-w-xs truncate">{row['Option B']}</td>
                                  <td className="px-3 py-2 text-sm text-surface-900 max-w-xs truncate">{row['Option C']}</td>
                                  <td className="px-3 py-2 text-sm text-surface-900 max-w-xs truncate">{row['Option D']}</td>
                                  <td className="px-3 py-2 whitespace-nowrap text-sm text-surface-900">{row['Answer']}</td>
                                  <td className="px-3 py-2 whitespace-nowrap text-sm text-surface-900">{row['Subject']}</td>
                                  <td className="px-3 py-2 whitespace-nowrap text-sm text-surface-900">{row['Level']}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                        
                        {previewData.length > 10 && (
                          <p className="text-sm text-surface-500 mt-2">
                            Showing first 10 rows of {previewData.length} total rows
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-surface-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                  <button
                    type="button"
                    onClick={handleUpload}
                    disabled={uploading}
                    className="inline-flex w-full justify-center rounded-lg bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 disabled:opacity-50 disabled:cursor-not-allowed sm:ml-3 sm:w-auto"
                  >
                    {uploading ? 'Uploading...' : `Upload ${previewData.length} MCQs`}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowPreview(false)}
                    className="mt-3 inline-flex w-full justify-center rounded-lg bg-white px-3 py-2 text-sm font-semibold text-surface-900 shadow-sm ring-1 ring-inset ring-surface-300 hover:bg-surface-50 sm:mt-0 sm:w-auto"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
} 