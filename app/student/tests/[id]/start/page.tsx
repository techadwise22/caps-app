'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/providers/AuthProvider';
import { useParams, useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { 
  ClockIcon, 
  QuestionMarkCircleIcon,
  PlayIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

interface TestQuestion {
  id: string;
  question: string;
  options: string[];
  correct_answer: number;
  explanation?: string;
}

interface Test {
  id: string;
  title: string;
  subject: string;
  level: string;
  duration: string;
  questions: number;
  instructions: string;
}

export default function TestStartPage() {
  const { user } = useAuth();
  const params = useParams();
  const router = useRouter();
  const testId = params.id as string;
  
  const [test, setTest] = useState<Test | null>(null);
  const [questions, setQuestions] = useState<TestQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [testStarted, setTestStarted] = useState(false);
  const [testCompleted, setTestCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTestData();
  }, [testId]);

  useEffect(() => {
    if (testStarted && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            completeTest();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [testStarted, timeRemaining]);

  const loadTestData = () => {
    setLoading(true);
    
    // Mock test data based on test ID
    const mockTest: Test = {
      id: testId,
      title: 'CA Foundation - Practice Test',
      subject: 'General',
      level: 'Foundation',
      duration: '1 hour',
      questions: 50,
      instructions: 'This is a practice test covering various CA Foundation topics.'
    };

    const mockQuestions: TestQuestion[] = [
      {
        id: '1',
        question: 'What is the basic accounting equation?',
        options: [
          'Assets = Liabilities + Owner\'s Equity',
          'Assets = Liabilities - Owner\'s Equity',
          'Assets + Liabilities = Owner\'s Equity',
          'Assets - Liabilities = Owner\'s Equity'
        ],
        correct_answer: 0,
        explanation: 'The basic accounting equation is Assets = Liabilities + Owner\'s Equity.'
      },
      {
        id: '2',
        question: 'Which of the following is a current asset?',
        options: [
          'Land',
          'Buildings',
          'Cash',
          'Equipment'
        ],
        correct_answer: 2,
        explanation: 'Cash is a current asset as it can be converted to cash within one year.'
      },
      {
        id: '3',
        question: 'What is the primary purpose of a trial balance?',
        options: [
          'To prepare financial statements',
          'To check the mathematical accuracy of accounts',
          'To record business transactions',
          'To calculate profit or loss'
        ],
        correct_answer: 1,
        explanation: 'A trial balance is used to check the mathematical accuracy of accounts.'
      },
      {
        id: '4',
        question: 'Which accounting principle states that expenses should be recognized when incurred?',
        options: [
          'Matching principle',
          'Cost principle',
          'Revenue recognition principle',
          'Consistency principle'
        ],
        correct_answer: 0,
        explanation: 'The matching principle states that expenses should be recognized when incurred.'
      },
      {
        id: '5',
        question: 'What is the normal balance of an asset account?',
        options: [
          'Credit',
          'Debit',
          'Either debit or credit',
          'Zero'
        ],
        correct_answer: 1,
        explanation: 'Asset accounts normally have a debit balance.'
      }
    ];

    setTest(mockTest);
    setQuestions(mockQuestions);
    setTimeRemaining(60 * 60); // 1 hour in seconds
    setLoading(false);
  };

  const startTest = () => {
    setTestStarted(true);
    toast.success('Test started! Good luck!');
  };

  const selectAnswer = (questionId: string, optionIndex: number) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: optionIndex
    }));
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const previousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const completeTest = () => {
    const correctAnswers = questions.reduce((count, question) => {
      const userAnswer = answers[question.id];
      return userAnswer === question.correct_answer ? count + 1 : count;
    }, 0);

    const finalScore = Math.round((correctAnswers / questions.length) * 100);
    setScore(finalScore);
    setTestCompleted(true);
    setTestStarted(false);
    
    toast.success(`Test completed! Your score: ${finalScore}%`);
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

  const getQuestionStatus = (index: number) => {
    if (answers[questions[index]?.id]) {
      return 'answered';
    }
    return 'unanswered';
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (!test) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <ExclamationTriangleIcon className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-surface-900 mb-2">Test Not Found</h2>
            <p className="text-surface-600 mb-4">The test you're looking for doesn't exist.</p>
            <button
              onClick={() => router.push('/student/tests')}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Back to Tests
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (testCompleted) {
    return (
      <DashboardLayout>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-xl shadow-soft p-8 text-center">
            <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-surface-900 mb-4">Test Completed!</h1>
            
            <div className="bg-green-50 rounded-lg p-6 mb-6">
              <h2 className="text-2xl font-semibold text-green-800 mb-2">Your Score</h2>
              <p className="text-4xl font-bold text-green-600">{score}%</p>
              <p className="text-green-700 mt-2">
                {score >= 80 ? 'Excellent! Keep up the great work!' : 
                 score >= 60 ? 'Good job! You\'re on the right track!' : 
                 'Keep practicing! You\'ll improve with time!'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-blue-600 text-sm font-medium">Questions</p>
                <p className="text-2xl font-bold text-blue-800">{questions.length}</p>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <p className="text-green-600 text-sm font-medium">Correct</p>
                <p className="text-2xl font-bold text-green-800">
                  {Math.round((score / 100) * questions.length)}
                </p>
              </div>
              <div className="bg-purple-50 rounded-lg p-4">
                <p className="text-purple-600 text-sm font-medium">Time Used</p>
                <p className="text-2xl font-bold text-purple-800">
                  {formatTime(60 * 60 - timeRemaining)}
                </p>
              </div>
            </div>

            <div className="flex space-x-4 justify-center">
              <button
                onClick={() => router.push('/student/tests')}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Back to Tests
              </button>
              <button
                onClick={() => window.location.reload()}
                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
              >
                Retake Test
              </button>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!testStarted) {
    return (
      <DashboardLayout>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-xl shadow-soft p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-surface-900 mb-4">{test.title}</h1>
              <p className="text-surface-600 text-lg">{test.instructions}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-blue-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-blue-800 mb-2">Test Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Subject:</span>
                    <span className="font-medium">{test.subject}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Level:</span>
                    <span className="font-medium">{test.level}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Duration:</span>
                    <span className="font-medium">{test.duration}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Questions:</span>
                    <span className="font-medium">{test.questions}</span>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-yellow-800 mb-2">Instructions</h3>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>• Read each question carefully</li>
                  <li>• Select only one answer per question</li>
                  <li>• You can navigate between questions</li>
                  <li>• Timer will start when you begin</li>
                  <li>• Test will auto-submit when time expires</li>
                </ul>
              </div>
            </div>

            <div className="text-center">
              <button
                onClick={startTest}
                className="bg-green-600 text-white px-8 py-4 rounded-lg hover:bg-green-700 transition-colors text-lg font-semibold flex items-center mx-auto"
              >
                <PlayIcon className="h-6 w-6 mr-2" />
                Start Test Now
              </button>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Test Header */}
        <div className="bg-white rounded-xl shadow-soft p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-surface-900">{test.title}</h1>
              <p className="text-surface-600">Question {currentQuestionIndex + 1} of {questions.length}</p>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="bg-red-50 rounded-lg px-4 py-2">
                <div className="flex items-center space-x-2">
                  <ClockIcon className="h-5 w-5 text-red-600" />
                  <span className="font-semibold text-red-800">{formatTime(timeRemaining)}</span>
                </div>
              </div>
              
              <button
                onClick={completeTest}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                Submit Test
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
            ></div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Question Area */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-soft p-6">
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-surface-900 mb-4">
                  Question {currentQuestionIndex + 1}
                </h2>
                <p className="text-surface-700 text-lg leading-relaxed">
                  {currentQuestion.question}
                </p>
              </div>

              <div className="space-y-3">
                {currentQuestion.options.map((option, index) => (
                  <label
                    key={index}
                    className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                      answers[currentQuestion.id] === index
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name={`question-${currentQuestion.id}`}
                      value={index}
                      checked={answers[currentQuestion.id] === index}
                      onChange={() => selectAnswer(currentQuestion.id, index)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <span className="ml-3 text-surface-700">{option}</span>
                  </label>
                ))}
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between mt-8">
                <button
                  onClick={previousQuestion}
                  disabled={currentQuestionIndex === 0}
                  className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                
                <button
                  onClick={nextQuestion}
                  disabled={currentQuestionIndex === questions.length - 1}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          </div>

          {/* Question Navigator */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-soft p-6">
              <h3 className="text-lg font-semibold text-surface-900 mb-4">Question Navigator</h3>
              
              <div className="grid grid-cols-5 gap-2">
                {questions.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentQuestionIndex(index)}
                    className={`p-2 rounded-lg text-sm font-medium transition-colors ${
                      index === currentQuestionIndex
                        ? 'bg-blue-600 text-white'
                        : getQuestionStatus(index) === 'answered'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>

              <div className="mt-4 space-y-2 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-600 rounded"></div>
                  <span>Current</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-100 rounded border border-green-300"></div>
                  <span>Answered</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-gray-100 rounded border border-gray-300"></div>
                  <span>Unanswered</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
} 