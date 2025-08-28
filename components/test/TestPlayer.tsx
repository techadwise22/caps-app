'use client';

import { useState, useEffect, useCallback } from 'react';
import { Test, Question, TestAttempt } from '@/types';
import { formatDuration } from '@/lib/utils';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ClockIcon,
  CheckIcon,
  ExclamationTriangleIcon,
  EyeIcon,
  EyeSlashIcon,
} from '@heroicons/react/24/outline';

interface TestPlayerProps {
  test: Test;
  onComplete: (attempt: TestAttempt) => void;
  onExit: () => void;
}

export default function TestPlayer({ test, onComplete, onExit }: TestPlayerProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [markedForReview, setMarkedForReview] = useState<Set<string>>(new Set());
  const [timeRemaining, setTimeRemaining] = useState(test.duration_minutes * 60);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [lastSaved, setLastSaved] = useState<string>('Saved');
  const [showNavigation, setShowNavigation] = useState(true);

  // Mock questions for demonstration
  const mockQuestions: Question[] = [
    {
      id: 'q1',
      section_id: 's1',
      question_text: 'What is the time complexity of binary search?',
      question_type: 'single_choice',
      marks: 2,
      order_index: 1,
      tags: ['algorithms', 'complexity'],
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
      tags: ['data-structures'],
      difficulty: 'easy',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
    },
    {
      id: 'q3',
      section_id: 's1',
      question_text: 'What is the value of 2^10?',
      question_type: 'numeric',
      marks: 1,
      order_index: 3,
      tags: ['mathematics'],
      difficulty: 'easy',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
    },
  ];

  const mockOptions: Record<string, { id: string; text: string; is_correct: boolean }[]> = {
    q1: [
      { id: 'opt1', text: 'O(1)', is_correct: false },
      { id: 'opt2', text: 'O(log n)', is_correct: true },
      { id: 'opt3', text: 'O(n)', is_correct: false },
      { id: 'opt4', text: 'O(n²)', is_correct: false },
    ],
    q2: [
      { id: 'opt1', text: 'Array', is_correct: true },
      { id: 'opt2', text: 'Linked List', is_correct: true },
      { id: 'opt3', text: 'Stack', is_correct: true },
      { id: 'opt4', text: 'Invalid Structure', is_correct: false },
    ],
  };

  // Timer effect
  useEffect(() => {
    if (timeRemaining <= 0 || isSubmitted) return;

    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining, isSubmitted]);

  // Auto-save effect
  useEffect(() => {
    const autoSave = setInterval(() => {
      // Simulate auto-save
      setLastSaved('Saved a moment ago');
      setTimeout(() => setLastSaved('Saved'), 2000);
    }, 10000); // Auto-save every 10 seconds

    return () => clearInterval(autoSave);
  }, []);

  const handleAnswerChange = useCallback((questionId: string, answer: any) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer,
    }));
  }, []);

  const toggleMarkForReview = useCallback((questionId: string) => {
    setMarkedForReview(prev => {
      const newSet = new Set(prev);
      if (newSet.has(questionId)) {
        newSet.delete(questionId);
      } else {
        newSet.add(questionId);
      }
      return newSet;
    });
  }, []);

  const handleSubmit = useCallback(() => {
    if (confirm('Are you sure you want to submit the test? You cannot change your answers after submission.')) {
      setIsSubmitted(true);
      const attempt: TestAttempt = {
        id: 'attempt-1',
        test_id: test.id,
        user_id: 'user-1',
        started_at: new Date().toISOString(),
        submitted_at: new Date().toISOString(),
        status: 'submitted',
        time_taken_minutes: test.duration_minutes - Math.ceil(timeRemaining / 60),
      };
      onComplete(attempt);
    }
  }, [test, timeRemaining, onComplete]);

  const currentQuestion = mockQuestions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === mockQuestions.length - 1;
  const isFirstQuestion = currentQuestionIndex === 0;

  const getQuestionStatus = (index: number) => {
    const questionId = mockQuestions[index]?.id;
    if (!questionId) return 'unanswered';
    
    if (markedForReview.has(questionId)) return 'marked';
    
    const answer = answers[questionId];
    if (answer && (
      (typeof answer === 'string' && answer.trim() !== '') ||
      (Array.isArray(answer) && answer.length > 0) ||
      (typeof answer === 'number' && !isNaN(answer))
    )) {
      return 'answered';
    }
    
    return 'unanswered';
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-surface-50">
      {/* Top Bar */}
      <div className="bg-white border-b border-surface-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-lg font-semibold text-surface-900">{test.title}</h1>
            <div className="flex items-center space-x-2 text-sm text-surface-600">
              <span>Question {currentQuestionIndex + 1} of {mockQuestions.length}</span>
              <span>•</span>
              <span>{formatDuration(test.duration_minutes)}</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-surface-600">
              <span>{lastSaved}</span>
            </div>
            
            <div className={`flex items-center space-x-2 font-mono text-lg ${
              timeRemaining <= 300 ? 'text-danger-600' : 
              timeRemaining <= 600 ? 'text-warning-600' : 'text-surface-900'
            }`}>
              <ClockIcon className="h-5 w-5" />
              <span className={timeRemaining <= 300 ? 'animate-pulse' : ''}>
                {formatTime(timeRemaining)}
              </span>
            </div>
            
            <button
              onClick={() => setShowNavigation(!showNavigation)}
              className="btn-ghost p-2"
              title={showNavigation ? 'Hide navigation' : 'Show navigation'}
            >
              {showNavigation ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Question Navigation */}
        {showNavigation && (
          <div className="w-80 bg-white border-r border-surface-200 p-4 overflow-y-auto">
            <h3 className="font-medium text-surface-900 mb-4">Question Navigation</h3>
            <div className="grid grid-cols-5 gap-2">
              {mockQuestions.map((question, index) => (
                <button
                  key={question.id}
                  onClick={() => setCurrentQuestionIndex(index)}
                  className={`p-3 rounded-lg border-2 text-sm font-medium transition-colors ${
                    index === currentQuestionIndex
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : getQuestionStatus(index) === 'answered'
                      ? 'border-success-500 bg-success-50 text-success-700'
                      : getQuestionStatus(index) === 'marked'
                      ? 'border-warning-500 bg-warning-50 text-warning-700'
                      : 'border-surface-300 bg-white text-surface-700 hover:border-surface-400'
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
            
            <div className="mt-6 space-y-2">
              <div className="flex items-center space-x-2 text-sm">
                <div className="w-4 h-4 border-2 border-success-500 bg-success-50 rounded"></div>
                <span>Answered</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <div className="w-4 h-4 border-2 border-warning-500 bg-warning-50 rounded"></div>
                <span>Marked for Review</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <div className="w-4 h-4 border-2 border-surface-300 bg-white rounded"></div>
                <span>Unanswered</span>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Question */}
          <div className="flex-1 p-8 overflow-y-auto">
            <div className="max-w-4xl mx-auto">
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-surface-900">
                    Question {currentQuestionIndex + 1}
                  </h2>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-surface-600">
                      {currentQuestion.marks} mark{currentQuestion.marks !== 1 ? 's' : ''}
                    </span>
                    <span className={`badge ${
                      currentQuestion.difficulty === 'easy' ? 'badge-success' :
                      currentQuestion.difficulty === 'medium' ? 'badge-warning' : 'badge-danger'
                    }`}>
                      {currentQuestion.difficulty}
                    </span>
                  </div>
                </div>
                
                <p className="text-lg text-surface-900 mb-6">{currentQuestion.question_text}</p>

                {/* Question Options */}
                {currentQuestion.question_type === 'single_choice' && (
                  <div className="space-y-3">
                    {mockOptions[currentQuestion.id]?.map((option) => (
                      <label
                        key={option.id}
                        className="question-option cursor-pointer"
                      >
                        <input
                          type="radio"
                          name={currentQuestion.id}
                          value={option.id}
                          checked={answers[currentQuestion.id] === option.id}
                          onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                          className="sr-only"
                        />
                        <span className="ml-3">{option.text}</span>
                      </label>
                    ))}
                  </div>
                )}

                {currentQuestion.question_type === 'multiple_choice' && (
                  <div className="space-y-3">
                    {mockOptions[currentQuestion.id]?.map((option) => (
                      <label
                        key={option.id}
                        className="question-option cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          value={option.id}
                          checked={answers[currentQuestion.id]?.includes(option.id) || false}
                          onChange={(e) => {
                            const currentAnswers = answers[currentQuestion.id] || [];
                            const newAnswers = e.target.checked
                              ? [...currentAnswers, option.id]
                              : currentAnswers.filter((id: string) => id !== option.id);
                            handleAnswerChange(currentQuestion.id, newAnswers);
                          }}
                          className="sr-only"
                        />
                        <span className="ml-3">{option.text}</span>
                      </label>
                    ))}
                  </div>
                )}

                {currentQuestion.question_type === 'numeric' && (
                  <div>
                    <input
                      type="number"
                      value={answers[currentQuestion.id] || ''}
                      onChange={(e) => handleAnswerChange(currentQuestion.id, parseFloat(e.target.value) || '')}
                      className="form-input w-48"
                      placeholder="Enter your answer"
                      step="0.01"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Bottom Navigation */}
          <div className="bg-white border-t border-surface-200 p-4">
            <div className="max-w-4xl mx-auto flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
                  disabled={isFirstQuestion}
                  className="btn-outline disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeftIcon className="h-4 w-4 mr-2" />
                  Previous
                </button>
                
                <button
                  onClick={() => toggleMarkForReview(currentQuestion.id)}
                  className={`btn-outline ${
                    markedForReview.has(currentQuestion.id) ? 'bg-warning-50 border-warning-300 text-warning-700' : ''
                  }`}
                >
                  <ExclamationTriangleIcon className="h-4 w-4 mr-2" />
                  {markedForReview.has(currentQuestion.id) ? 'Unmark Review' : 'Mark for Review'}
                </button>
              </div>

              <div className="flex items-center space-x-3">
                {!isLastQuestion ? (
                  <button
                    onClick={() => setCurrentQuestionIndex(prev => Math.min(mockQuestions.length - 1, prev + 1))}
                    className="btn-outline"
                  >
                    Next
                    <ChevronRightIcon className="h-4 w-4 ml-2" />
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitted}
                    className="btn-primary"
                  >
                    <CheckIcon className="h-4 w-4 mr-2" />
                    Submit Test
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 