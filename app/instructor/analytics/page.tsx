'use client';

import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { TestAnalytics, QuestionAnalytics } from '@/types';
import {
  ChartBarIcon,
  UserGroupIcon,
  ClockIcon,
  AcademicCapIcon,
  TrendingUpIcon,
  TrendingDownIcon,
} from '@heroicons/react/24/outline';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<TestAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTest, setSelectedTest] = useState('all');

  useEffect(() => {
    // Mock analytics data
    const mockAnalytics: TestAnalytics = {
      test_id: 'test-1',
      total_attempts: 156,
      average_score: 78.5,
      completion_rate: 92.3,
      average_time_taken: 85,
      question_analytics: [
        {
          question_id: 'q1',
          correct_answers: 142,
          total_attempts: 156,
          difficulty_score: 0.91,
          average_time_spent: 45,
        },
        {
          question_id: 'q2',
          correct_answers: 98,
          total_attempts: 156,
          difficulty_score: 0.63,
          average_time_spent: 120,
        },
        {
          question_id: 'q3',
          correct_answers: 134,
          total_attempts: 156,
          difficulty_score: 0.86,
          average_time_spent: 60,
        },
        {
          question_id: 'q4',
          correct_answers: 87,
          total_attempts: 156,
          difficulty_score: 0.56,
          average_time_spent: 180,
        },
        {
          question_id: 'q5',
          correct_answers: 145,
          total_attempts: 156,
          difficulty_score: 0.93,
          average_time_spent: 30,
        },
      ],
    };

    setAnalytics(mockAnalytics);
    setLoading(false);
  }, []);

  const chartData = analytics?.question_analytics.map((q, index) => ({
    question: `Q${index + 1}`,
    correct: q.correct_answers,
    incorrect: q.total_attempts - q.correct_answers,
    accuracy: (q.correct_answers / q.total_attempts) * 100,
    timeSpent: q.average_time_spent,
  })) || [];

  const scoreDistribution = [
    { range: '90-100%', students: 25, color: '#22C55E' },
    { range: '80-89%', students: 45, color: '#3B82F6' },
    { range: '70-79%', students: 38, color: '#F59E0B' },
    { range: '60-69%', students: 28, color: '#EF4444' },
    { range: '0-59%', students: 20, color: '#6B7280' },
  ];

  const timeTrendData = [
    { week: 'Week 1', avgTime: 75, avgScore: 72 },
    { week: 'Week 2', avgTime: 82, avgScore: 76 },
    { week: 'Week 3', avgTime: 78, avgScore: 79 },
    { week: 'Week 4', avgTime: 85, avgScore: 81 },
    { week: 'Week 5', avgTime: 80, avgScore: 78 },
  ];

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="spinner w-8 h-8"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-surface-900">Analytics Dashboard</h1>
            <p className="text-surface-600 mt-2">Track student performance and learning insights</p>
          </div>
          <select
            value={selectedTest}
            onChange={(e) => setSelectedTest(e.target.value)}
            className="form-select"
          >
            <option value="all">All Tests</option>
            <option value="test-1">Midterm Exam</option>
            <option value="test-2">Data Structures Quiz</option>
            <option value="test-3">Final Exam</option>
          </select>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="card p-6">
            <div className="flex items-center">
              <div className="p-2 bg-primary-100 rounded-lg">
                <UserGroupIcon className="h-6 w-6 text-primary-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-surface-600">Total Attempts</p>
                <p className="text-2xl font-bold text-surface-900">{analytics?.total_attempts}</p>
                <div className="flex items-center mt-1">
                  <TrendingUpIcon className="h-4 w-4 text-success-600 mr-1" />
                  <span className="text-sm text-success-600">+12%</span>
                </div>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center">
              <div className="p-2 bg-success-100 rounded-lg">
                <ChartBarIcon className="h-6 w-6 text-success-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-surface-600">Average Score</p>
                <p className="text-2xl font-bold text-surface-900">{analytics?.average_score}%</p>
                <div className="flex items-center mt-1">
                  <TrendingUpIcon className="h-4 w-4 text-success-600 mr-1" />
                  <span className="text-sm text-success-600">+5.2%</span>
                </div>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center">
              <div className="p-2 bg-warning-100 rounded-lg">
                <ClockIcon className="h-6 w-6 text-warning-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-surface-600">Completion Rate</p>
                <p className="text-2xl font-bold text-surface-900">{analytics?.completion_rate}%</p>
                <div className="flex items-center mt-1">
                  <TrendingUpIcon className="h-4 w-4 text-success-600 mr-1" />
                  <span className="text-sm text-success-600">+2.1%</span>
                </div>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center">
              <div className="p-2 bg-secondary-100 rounded-lg">
                <AcademicCapIcon className="h-6 w-6 text-secondary-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-surface-600">Avg Time (min)</p>
                <p className="text-2xl font-bold text-surface-900">{analytics?.average_time_taken}</p>
                <div className="flex items-center mt-1">
                  <TrendingDownIcon className="h-4 w-4 text-danger-600 mr-1" />
                  <span className="text-sm text-danger-600">-3.5%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Question Performance */}
          <div className="card">
            <div className="card-header">
              <h2 className="text-lg font-semibold text-surface-900">Question Performance</h2>
            </div>
            <div className="card-body">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="question" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="correct" fill="#22C55E" name="Correct" />
                  <Bar dataKey="incorrect" fill="#EF4444" name="Incorrect" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Score Distribution */}
          <div className="card">
            <div className="card-header">
              <h2 className="text-lg font-semibold text-surface-900">Score Distribution</h2>
            </div>
            <div className="card-body">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={scoreDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ range, percent }) => `${range} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="students"
                  >
                    {scoreDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Time vs Score Trend */}
        <div className="card">
          <div className="card-header">
            <h2 className="text-lg font-semibold text-surface-900">Performance Trends</h2>
          </div>
          <div className="card-body">
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={timeTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="avgTime"
                  stroke="#3B82F6"
                  name="Average Time (min)"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="avgScore"
                  stroke="#22C55E"
                  name="Average Score (%)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Question Analysis Table */}
        <div className="card">
          <div className="card-header">
            <h2 className="text-lg font-semibold text-surface-900">Detailed Question Analysis</h2>
          </div>
          <div className="card-body">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-surface-200">
                <thead className="bg-surface-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">
                      Question
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">
                      Correct Answers
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">
                      Accuracy
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">
                      Difficulty
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">
                      Avg Time (min)
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-surface-200">
                  {analytics?.question_analytics.map((question, index) => (
                    <tr key={question.question_id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-surface-900">
                        Question {index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-surface-900">
                        {question.correct_answers}/{question.total_attempts}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-surface-900">
                        <div className="flex items-center">
                          <div className="w-16 bg-surface-200 rounded-full h-2 mr-2">
                            <div
                              className="bg-primary-600 h-2 rounded-full"
                              style={{ width: `${(question.correct_answers / question.total_attempts) * 100}%` }}
                            ></div>
                          </div>
                          <span>{((question.correct_answers / question.total_attempts) * 100).toFixed(1)}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-surface-900">
                        <span className={`badge ${
                          question.difficulty_score > 0.8 ? 'badge-success' :
                          question.difficulty_score > 0.6 ? 'badge-warning' : 'badge-danger'
                        }`}>
                          {question.difficulty_score > 0.8 ? 'Easy' :
                           question.difficulty_score > 0.6 ? 'Medium' : 'Hard'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-surface-900">
                        {Math.round(question.average_time_spent / 60)}m {question.average_time_spent % 60}s
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Insights */}
        <div className="card">
          <div className="card-header">
            <h2 className="text-lg font-semibold text-surface-900">Key Insights</h2>
          </div>
          <div className="card-body">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-medium text-surface-900">Strengths</h3>
                <ul className="space-y-2 text-sm text-surface-600">
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-success-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    High completion rate (92.3%) indicates good student engagement
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-success-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    Questions 1, 3, and 5 show excellent performance (>85% accuracy)
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-success-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    Average score improvement of 5.2% compared to previous tests
                  </li>
                </ul>
              </div>
              <div className="space-y-4">
                <h3 className="font-medium text-surface-900">Areas for Improvement</h3>
                <ul className="space-y-2 text-sm text-surface-600">
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-danger-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    Questions 2 and 4 need attention (accuracy below 70%)
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-danger-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    Some students are spending too much time on difficult questions
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-danger-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    Consider adding more practice materials for data structures
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
} 