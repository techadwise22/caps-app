'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Question } from '@/types';
import { formatDate } from '@/lib/utils';
import {
  PlusIcon,
  PencilIcon,
  EyeIcon,
  TrashIcon,
  DocumentTextIcon,
  TagIcon,
  FilterIcon,
  MagnifyingGlassIcon,
  DocumentArrowDownIcon,
  DocumentArrowUpIcon,
} from '@heroicons/react/24/outline';

export default function QuestionsPage() {
  const router = useRouter();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'single_choice' | 'multiple_choice' | 'numeric'>('all');
  const [filterDifficulty, setFilterDifficulty] = useState<'all' | 'easy' | 'medium' | 'hard'>('all');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  useEffect(() => {
    // Mock data for demonstration
    const mockQuestions: Question[] = [
      {
        id: 'q1',
        section_id: 's1',
        question_text: 'What is the time complexity of binary search?',
        question_type: 'single_choice',
        marks: 2,
        order_index: 1,
        tags: ['algorithms', 'complexity', 'search'],
        difficulty: 'medium',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      },
      {
        id: 'q2',
        section_id: 's1',
        question_text: 'Which of the following are valid data structures? (Select all that apply)',
        question_type: 'multiple_choice',
        marks: 3,
        order_index: 2,
        tags: ['data-structures', 'fundamentals'],
        difficulty: 'easy',
        created_at: '2024-01-02T00:00:00Z',
        updated_at: '2024-01-02T00:00:00Z',
      },
      {
        id: 'q3',
        section_id: 's1',
        question_text: 'What is the value of 2^10?',
        question_type: 'numeric',
        marks: 1,
        order_index: 3,
        tags: ['mathematics', 'powers'],
        difficulty: 'easy',
        created_at: '2024-01-03T00:00:00Z',
        updated_at: '2024-01-03T00:00:00Z',
      },
      {
        id: 'q4',
        section_id: 's1',
        question_text: 'Explain the difference between a stack and a queue with examples.',
        question_type: 'single_choice',
        marks: 4,
        order_index: 4,
        tags: ['data-structures', 'stack', 'queue'],
        difficulty: 'hard',
        created_at: '2024-01-04T00:00:00Z',
        updated_at: '2024-01-04T00:00:00Z',
      },
    ];

    setQuestions(mockQuestions);
    setLoading(false);
  }, []);

  const filteredQuestions = questions.filter(question => {
    const matchesSearch = question.question_text.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         question.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = filterType === 'all' || question.question_type === filterType;
    const matchesDifficulty = filterDifficulty === 'all' || question.difficulty === filterDifficulty;
    const matchesTags = selectedTags.length === 0 || 
                       selectedTags.some(tag => question.tags.includes(tag));
    
    return matchesSearch && matchesType && matchesDifficulty && matchesTags;
  });

  const getAllTags = () => {
    const tags = new Set<string>();
    questions.forEach(question => {
      question.tags.forEach(tag => tags.add(tag));
    });
    return Array.from(tags).sort();
  };

  const getQuestionStats = () => {
    const stats = {
      total: questions.length,
      single_choice: questions.filter(q => q.question_type === 'single_choice').length,
      multiple_choice: questions.filter(q => q.question_type === 'multiple_choice').length,
      numeric: questions.filter(q => q.question_type === 'numeric').length,
      easy: questions.filter(q => q.difficulty === 'easy').length,
      medium: questions.filter(q => q.difficulty === 'medium').length,
      hard: questions.filter(q => q.difficulty === 'hard').length,
    };
    return stats;
  };

  const getQuestionTypeLabel = (type: string) => {
    switch (type) {
      case 'single_choice': return 'Single Choice';
      case 'multiple_choice': return 'Multiple Choice';
      case 'numeric': return 'Numeric';
      default: return type;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'badge-success';
      case 'medium': return 'badge-warning';
      case 'hard': return 'badge-danger';
      default: return 'badge-secondary';
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="spinner w-8 h-8"></div>
        </div>
      </DashboardLayout>
    );
  }

  const stats = getQuestionStats();

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-surface-900">Question Bank</h1>
            <p className="text-surface-600 mt-2">Create and manage questions for your tests</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => router.push('/instructor/questions/import')}
              className="btn-outline"
            >
              <DocumentArrowUpIcon className="h-5 w-5 mr-2" />
              Import CSV
            </button>
            <button
              onClick={() => router.push('/instructor/questions/create')}
              className="btn-primary"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Add Question
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="card p-6">
            <div className="flex items-center">
              <div className="p-2 bg-primary-100 rounded-lg">
                <DocumentTextIcon className="h-6 w-6 text-primary-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-surface-600">Total Questions</p>
                <p className="text-2xl font-bold text-surface-900">{stats.total}</p>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center">
              <div className="p-2 bg-success-100 rounded-lg">
                <TagIcon className="h-6 w-6 text-success-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-surface-600">Easy Questions</p>
                <p className="text-2xl font-bold text-surface-900">{stats.easy}</p>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center">
              <div className="p-2 bg-warning-100 rounded-lg">
                <TagIcon className="h-6 w-6 text-warning-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-surface-600">Medium Questions</p>
                <p className="text-2xl font-bold text-surface-900">{stats.medium}</p>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center">
              <div className="p-2 bg-danger-100 rounded-lg">
                <TagIcon className="h-6 w-6 text-danger-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-surface-600">Hard Questions</p>
                <p className="text-2xl font-bold text-surface-900">{stats.hard}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="card">
          <div className="card-body">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
              <div className="lg:col-span-2">
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-surface-400" />
                  <input
                    type="text"
                    placeholder="Search questions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 form-input"
                  />
                </div>
              </div>
              <div>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value as any)}
                  className="form-select"
                >
                  <option value="all">All Types</option>
                  <option value="single_choice">Single Choice</option>
                  <option value="multiple_choice">Multiple Choice</option>
                  <option value="numeric">Numeric</option>
                </select>
              </div>
              <div>
                <select
                  value={filterDifficulty}
                  onChange={(e) => setFilterDifficulty(e.target.value as any)}
                  className="form-select"
                >
                  <option value="all">All Difficulties</option>
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
            </div>

            {/* Tags Filter */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-surface-700 mb-2">Filter by Tags</label>
              <div className="flex flex-wrap gap-2">
                {getAllTags().map((tag) => (
                  <button
                    key={tag}
                    onClick={() => {
                      setSelectedTags(prev => 
                        prev.includes(tag) 
                          ? prev.filter(t => t !== tag)
                          : [...prev, tag]
                      );
                    }}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      selectedTags.includes(tag)
                        ? 'bg-primary-100 text-primary-700 border border-primary-300'
                        : 'bg-surface-100 text-surface-700 border border-surface-300 hover:bg-surface-200'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Questions List */}
        <div className="card">
          <div className="card-header">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-surface-900">
                Questions ({filteredQuestions.length})
              </h2>
              <button
                onClick={() => {
                  // Export questions to CSV
                  const csvContent = filteredQuestions.map(q => 
                    `${q.question_text},${q.question_type},${q.difficulty},${q.marks},${q.tags.join(';')}`
                  ).join('\n');
                  const blob = new Blob([csvContent], { type: 'text/csv' });
                  const url = window.URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = 'questions.csv';
                  a.click();
                }}
                className="btn-outline"
              >
                <DocumentArrowDownIcon className="h-5 w-5 mr-2" />
                Export CSV
              </button>
            </div>
          </div>
          <div className="card-body">
            {filteredQuestions.length === 0 ? (
              <div className="text-center py-12">
                <DocumentTextIcon className="h-12 w-12 text-surface-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-surface-900 mb-2">No questions found</h3>
                <p className="text-surface-600 mb-6">
                  {searchTerm || filterType !== 'all' || filterDifficulty !== 'all' || selectedTags.length > 0
                    ? 'Try adjusting your search or filters'
                    : 'Get started by creating your first question'
                  }
                </p>
                {!searchTerm && filterType === 'all' && filterDifficulty === 'all' && selectedTags.length === 0 && (
                  <button
                    onClick={() => router.push('/instructor/questions/create')}
                    className="btn-primary"
                  >
                    <PlusIcon className="h-5 w-5 mr-2" />
                    Add Question
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredQuestions.map((question) => (
                  <div key={question.id} className="border border-surface-200 rounded-lg p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <h3 className="text-lg font-medium text-surface-900">
                            {question.question_text.length > 100 
                              ? `${question.question_text.substring(0, 100)}...`
                              : question.question_text
                            }
                          </h3>
                          <span className={`badge ${getDifficultyColor(question.difficulty)}`}>
                            {question.difficulty}
                          </span>
                          <span className="badge badge-secondary">
                            {getQuestionTypeLabel(question.question_type)}
                          </span>
                          <span className="text-sm text-surface-500">
                            {question.marks} mark{question.marks !== 1 ? 's' : ''}
                          </span>
                        </div>
                        
                        <div className="flex flex-wrap gap-2 mb-4">
                          {question.tags.map((tag) => (
                            <span
                              key={tag}
                              className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-surface-100 text-surface-700"
                            >
                              <TagIcon className="h-3 w-3 mr-1" />
                              {tag}
                            </span>
                          ))}
                        </div>

                        <div className="text-sm text-surface-500">
                          Created: {formatDate(question.created_at)}
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 ml-4">
                        <button
                          onClick={() => router.push(`/instructor/questions/${question.id}/view`)}
                          className="btn-ghost p-2"
                          title="View question"
                        >
                          <EyeIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => router.push(`/instructor/questions/${question.id}/edit`)}
                          className="btn-ghost p-2"
                          title="Edit question"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm('Are you sure you want to delete this question?')) {
                              // Handle delete
                            }
                          }}
                          className="btn-ghost p-2 text-danger-600 hover:text-danger-700"
                          title="Delete question"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Question Type Distribution */}
        <div className="card">
          <div className="card-header">
            <h2 className="text-lg font-semibold text-surface-900">Question Distribution</h2>
          </div>
          <div className="card-body">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-600 mb-2">{stats.single_choice}</div>
                <div className="text-sm text-surface-600">Single Choice</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-success-600 mb-2">{stats.multiple_choice}</div>
                <div className="text-sm text-surface-600">Multiple Choice</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-secondary-600 mb-2">{stats.numeric}</div>
                <div className="text-sm text-surface-600">Numeric</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
} 