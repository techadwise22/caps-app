'use client';

import { useAuth } from '@/components/providers/AuthProvider';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { QuestionMarkCircleIcon, CheckCircleIcon, XCircleIcon, ArrowRightIcon } from '@heroicons/react/24/outline';

interface MCQ {
  id: string;
  question: string;
  options: string[];
  correct_answer: number;
  explanation: string;
}

export default function MCQPractice({ params }: { params: { subject: string } }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);

  // Mock MCQ data for different subjects - in real app, this would come from admin panel
  const mcqData: Record<string, MCQ[]> = {
    accounting: [
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
        explanation: 'The basic accounting equation is Assets = Liabilities + Owner\'s Equity. This equation must always balance and forms the foundation of double-entry bookkeeping.'
      },
      {
        id: '2',
        question: 'Which of the following is a current asset?',
        options: [
          'Building',
          'Equipment',
          'Cash',
          'Land'
        ],
        correct_answer: 2,
        explanation: 'Cash is a current asset as it can be converted to cash or used up within one year or the normal operating cycle of the business.'
      },
      {
        id: '3',
        question: 'What is the purpose of a trial balance?',
        options: [
          'To prepare financial statements',
          'To check if debits equal credits',
          'To record business transactions',
          'To calculate net income'
        ],
        correct_answer: 1,
        explanation: 'A trial balance is prepared to check if the total debits equal total credits, ensuring the accounting equation is in balance.'
      },
      {
        id: '4',
        question: 'What is the formula for calculating simple interest?',
        options: [
          'P × R × T',
          'P + R + T',
          'P × R / T',
          'P / (R × T)'
        ],
        correct_answer: 0,
        explanation: 'Simple interest is calculated using the formula: Principal × Rate × Time (P × R × T).'
      },
      {
        id: '5',
        question: 'Which of the following is NOT a financial statement?',
        options: [
          'Balance Sheet',
          'Income Statement',
          'Trial Balance',
          'Cash Flow Statement'
        ],
        correct_answer: 2,
        explanation: 'A trial balance is not a financial statement. It is an internal document used to check the accuracy of bookkeeping entries.'
      }
    ],
    'business-laws': [
      {
        id: '1',
        question: 'What is the minimum number of members required to form a private company?',
        options: [
          '1',
          '2',
          '7',
          '10'
        ],
        correct_answer: 1,
        explanation: 'A private company requires a minimum of 2 members and a maximum of 200 members as per the Companies Act.'
      },
      {
        id: '2',
        question: 'Which type of partnership has unlimited liability?',
        options: [
          'Limited partnership',
          'General partnership',
          'LLP',
          'Joint venture'
        ],
        correct_answer: 1,
        explanation: 'In a general partnership, all partners have unlimited liability, meaning they are personally responsible for all partnership debts.'
      },
      {
        id: '3',
        question: 'What is the maximum number of partners allowed in a partnership firm?',
        options: [
          '20',
          '50',
          '100',
          'No limit'
        ],
        correct_answer: 0,
        explanation: 'As per the Companies Act, a partnership firm cannot have more than 20 partners, except for professional firms which can have up to 50.'
      },
      {
        id: '4',
        question: 'What is the minimum age requirement for a director of a company?',
        options: [
          '16 years',
          '18 years',
          '21 years',
          '25 years'
        ],
        correct_answer: 1,
        explanation: 'A person must be at least 18 years old to be appointed as a director of a company.'
      },
      {
        id: '5',
        question: 'Which of the following is NOT a type of company?',
        options: [
          'Public Company',
          'Private Company',
          'Partnership Company',
          'One Person Company'
        ],
        correct_answer: 2,
        explanation: 'Partnership Company is not a type of company under the Companies Act. The correct types are Public, Private, and One Person Company.'
      }
    ],
    economics: [
      {
        id: '1',
        question: 'What is microeconomics?',
        options: [
          'Study of individual economic units',
          'Study of national economy',
          'Study of international trade',
          'Study of economic history'
        ],
        correct_answer: 0,
        explanation: 'Microeconomics is the study of individual economic units such as households, firms, and markets, focusing on decision-making and resource allocation.'
      },
      {
        id: '2',
        question: 'What is the law of demand?',
        options: [
          'As price increases, demand decreases',
          'As price increases, demand increases',
          'Price and demand are unrelated',
          'Demand is always constant'
        ],
        correct_answer: 0,
        explanation: 'The law of demand states that as the price of a good increases, the quantity demanded decreases, ceteris paribus.'
      },
      {
        id: '3',
        question: 'What is opportunity cost?',
        options: [
          'The cost of producing goods',
          'The value of the next best alternative foregone',
          'The total cost of production',
          'The fixed cost of business'
        ],
        correct_answer: 1,
        explanation: 'Opportunity cost is the value of the next best alternative that is foregone when making a choice.'
      }
    ],
    mathematics: [
      {
        id: '1',
        question: 'What is the square root of 144?',
        options: [
          '10',
          '11',
          '12',
          '13'
        ],
        correct_answer: 2,
        explanation: 'The square root of 144 is 12, as 12 × 12 = 144.'
      },
      {
        id: '2',
        question: 'What is the formula for calculating simple interest?',
        options: [
          'P × R × T',
          'P + R + T',
          'P × R / T',
          'P / (R × T)'
        ],
        correct_answer: 0,
        explanation: 'Simple interest is calculated using the formula: Principal × Rate × Time (P × R × T).'
      },
      {
        id: '3',
        question: 'What is the value of π (pi) to two decimal places?',
        options: [
          '3.12',
          '3.14',
          '3.16',
          '3.18'
        ],
        correct_answer: 1,
        explanation: 'The value of π (pi) to two decimal places is 3.14.'
      }
    ]
  };

  const questions = mcqData[params.subject] || mcqData.accounting;
  const currentQuestion = questions[currentQuestionIndex];

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) return;

    const isCorrect = selectedAnswer === currentQuestion.correct_answer;
    if (isCorrect) {
      setScore(score + 1);
    }

    setShowResult(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      setCompleted(true);
    }
  };

  const handleRetry = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setCompleted(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner w-8 h-8"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (completed) {
    const percentage = Math.round((score / questions.length) * 100);
    return (
      <DashboardLayout>
        <div className="max-w-2xl mx-auto py-8">
          <div className="bg-white rounded-xl shadow-soft p-8 text-center">
            <div className="mb-6">
              <CheckCircleIcon className="h-16 w-16 text-success-600 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-surface-900 mb-2">Practice Complete!</h1>
              <p className="text-surface-600">You've completed all questions for {params.subject}</p>
            </div>
            
            <div className="bg-surface-50 rounded-lg p-6 mb-6">
              <h2 className="text-lg font-semibold text-surface-900 mb-4">Your Results</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary-600">{score}</p>
                  <p className="text-sm text-surface-600">Correct</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-surface-900">{questions.length}</p>
                  <p className="text-sm text-surface-600">Total</p>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-lg font-semibold text-surface-900">Score: {percentage}%</p>
                <div className="w-full bg-surface-200 rounded-full h-3 mt-2">
                  <div 
                    className="bg-primary-600 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="flex space-x-4 justify-center">
              <button
                onClick={handleRetry}
                className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors"
              >
                Try Again
              </button>
              <button
                onClick={() => router.push('/student/content')}
                className="bg-surface-100 text-surface-700 px-6 py-2 rounded-lg hover:bg-surface-200 transition-colors"
              >
                Back to Content
              </button>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-surface-900 mb-2">
            MCQ Practice - {params.subject.charAt(0).toUpperCase() + params.subject.slice(1)}
          </h1>
          <p className="text-surface-600">
            Question {currentQuestionIndex + 1} of {questions.length}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-soft p-6">
          <div className="mb-6">
            <div className="flex items-center space-x-2 mb-4">
              <QuestionMarkCircleIcon className="h-6 w-6 text-primary-600" />
              <h2 className="text-lg font-semibold text-surface-900">Question {currentQuestionIndex + 1}</h2>
            </div>
            <p className="text-surface-900 text-lg leading-relaxed">{currentQuestion.question}</p>
          </div>

          <div className="space-y-3 mb-6">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => !showResult && handleAnswerSelect(index)}
                disabled={showResult}
                className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                  selectedAnswer === index
                    ? showResult
                      ? index === currentQuestion.correct_answer
                        ? 'border-success-500 bg-success-50'
                        : 'border-danger-500 bg-danger-50'
                      : 'border-primary-500 bg-primary-50'
                    : 'border-surface-200 hover:border-surface-300'
                } ${showResult && index === currentQuestion.correct_answer ? 'border-success-500 bg-success-50' : ''}`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    selectedAnswer === index
                      ? showResult
                        ? index === currentQuestion.correct_answer
                          ? 'border-success-500 bg-success-500'
                          : 'border-danger-500 bg-danger-500'
                        : 'border-primary-500 bg-primary-500'
                      : 'border-surface-300'
                  }`}>
                    {selectedAnswer === index && (
                      showResult ? (
                        index === currentQuestion.correct_answer ? (
                          <CheckCircleIcon className="h-3 w-3 text-white" />
                        ) : (
                          <XCircleIcon className="h-3 w-3 text-white" />
                        )
                      ) : (
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      )
                    )}
                  </div>
                  <span className="text-surface-900">{option}</span>
                </div>
              </button>
            ))}
          </div>

          {showResult && (
            <div className="mb-6 p-4 bg-surface-50 rounded-lg">
              <h3 className="font-semibold text-surface-900 mb-2">
                {selectedAnswer === currentQuestion.correct_answer ? 'Correct!' : 'Incorrect'}
              </h3>
              <p className="text-surface-700">{currentQuestion.explanation}</p>
            </div>
          )}

          <div className="flex justify-between items-center">
            <div className="text-sm text-surface-600">
              Score: {score} / {currentQuestionIndex + 1}
            </div>
            <div className="flex space-x-3">
              {!showResult ? (
                <button
                  onClick={handleSubmitAnswer}
                  disabled={selectedAnswer === null}
                  className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Submit Answer
                </button>
              ) : (
                <button
                  onClick={handleNextQuestion}
                  className="bg-success-600 text-white px-6 py-2 rounded-lg hover:bg-success-700 transition-colors flex items-center"
                >
                  {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Finish'}
                  <ArrowRightIcon className="h-4 w-4 ml-2" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
} 