'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { TestForm, TestSection, Question } from '@/types';
import toast from 'react-hot-toast';
import {
  PlusIcon,
  TrashIcon,
  DocumentTextIcon,
  ClockIcon,
  CogIcon,
} from '@heroicons/react/24/outline';

const questionSchema = z.object({
  question_text: z.string().min(1, 'Question text is required'),
  question_type: z.enum(['single_choice', 'multiple_choice', 'numeric']),
  marks: z.number().min(1, 'Marks must be at least 1'),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  options: z.array(z.object({
    option_text: z.string().min(1, 'Option text is required'),
    is_correct: z.boolean(),
  })).optional(),
  correct_answer: z.number().optional(),
});

const sectionSchema = z.object({
  name: z.string().min(1, 'Section name is required'),
  description: z.string().optional(),
  time_limit_minutes: z.number().optional(),
  questions: z.array(questionSchema),
});

const testFormSchema = z.object({
  title: z.string().min(1, 'Test title is required'),
  description: z.string().optional(),
  course_id: z.string().min(1, 'Course is required'),
  duration_minutes: z.number().min(1, 'Duration must be at least 1 minute'),
  start_time: z.string().min(1, 'Start time is required'),
  end_time: z.string().min(1, 'End time is required'),
  has_negative_marking: z.boolean(),
  negative_marking_percentage: z.number().min(0).max(100),
  shuffle_options: z.boolean(),
  sections: z.array(sectionSchema).min(1, 'At least one section is required'),
});

type TestFormData = z.infer<typeof testFormSchema>;

export default function CreateTestPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeSection, setActiveSection] = useState(0);

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<TestFormData>({
    resolver: zodResolver(testFormSchema),
    defaultValues: {
      has_negative_marking: false,
      negative_marking_percentage: 0,
      shuffle_options: false,
      sections: [
        {
          name: 'Section 1',
          description: '',
          time_limit_minutes: undefined,
          questions: [],
        },
      ],
    },
  });

  const { fields: sections, append: appendSection, remove: removeSection } = useFieldArray({
    control,
    name: 'sections',
  });

  const { fields: questions, append: appendQuestion, remove: removeQuestion } = useFieldArray({
    control,
    name: `sections.${activeSection}.questions`,
  });

  const hasNegativeMarking = watch('has_negative_marking');

  const onSubmit = async (data: TestFormData) => {
    setIsSubmitting(true);
    try {
      // Here you would typically save to Supabase
      console.log('Test data:', data);
      toast.success('Test created successfully!');
      router.push('/instructor/tests');
    } catch (error) {
      toast.error('Failed to create test');
    } finally {
      setIsSubmitting(false);
    }
  };

  const addSection = () => {
    appendSection({
      name: `Section ${sections.length + 1}`,
      description: '',
      time_limit_minutes: undefined,
      questions: [],
    });
    setActiveSection(sections.length);
  };

  const addQuestion = (type: 'single_choice' | 'multiple_choice' | 'numeric') => {
    const newQuestion = {
      question_text: '',
      question_type: type,
      marks: 1,
      difficulty: 'medium' as const,
      options: type !== 'numeric' ? [
        { option_text: '', is_correct: false },
        { option_text: '', is_correct: false },
        { option_text: '', is_correct: false },
        { option_text: '', is_correct: false },
      ] : undefined,
      correct_answer: type === 'numeric' ? 0 : undefined,
    };
    appendQuestion(newQuestion);
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-surface-900">Create New Test</h1>
            <p className="text-surface-600 mt-2">Design a comprehensive assessment for your students</p>
          </div>
          <button
            onClick={() => router.back()}
            className="btn-outline"
          >
            Cancel
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Test Basic Information */}
          <div className="card">
            <div className="card-header">
              <h2 className="text-xl font-semibold text-surface-900">Test Information</h2>
            </div>
            <div className="card-body space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="form-label">Test Title *</label>
                  <input
                    {...register('title')}
                    className={`form-input ${errors.title ? 'border-danger-500' : ''}`}
                    placeholder="Enter test title"
                  />
                  {errors.title && <p className="form-error">{errors.title.message}</p>}
                </div>

                <div>
                  <label className="form-label">Course *</label>
                  <select
                    {...register('course_id')}
                    className={`form-select ${errors.course_id ? 'border-danger-500' : ''}`}
                  >
                    <option value="">Select a course</option>
                    <option value="course-1">Introduction to Computer Science</option>
                    <option value="course-2">Data Structures and Algorithms</option>
                  </select>
                  {errors.course_id && <p className="form-error">{errors.course_id.message}</p>}
                </div>
              </div>

              <div>
                <label className="form-label">Description</label>
                <textarea
                  {...register('description')}
                  className="form-textarea"
                  rows={3}
                  placeholder="Enter test description"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="form-label">Duration (minutes) *</label>
                  <input
                    type="number"
                    {...register('duration_minutes', { valueAsNumber: true })}
                    className={`form-input ${errors.duration_minutes ? 'border-danger-500' : ''}`}
                    min="1"
                  />
                  {errors.duration_minutes && <p className="form-error">{errors.duration_minutes.message}</p>}
                </div>

                <div>
                  <label className="form-label">Start Time *</label>
                  <input
                    type="datetime-local"
                    {...register('start_time')}
                    className={`form-input ${errors.start_time ? 'border-danger-500' : ''}`}
                  />
                  {errors.start_time && <p className="form-error">{errors.start_time.message}</p>}
                </div>

                <div>
                  <label className="form-label">End Time *</label>
                  <input
                    type="datetime-local"
                    {...register('end_time')}
                    className={`form-input ${errors.end_time ? 'border-danger-500' : ''}`}
                  />
                  {errors.end_time && <p className="form-error">{errors.end_time.message}</p>}
                </div>
              </div>
            </div>
          </div>

          {/* Test Settings */}
          <div className="card">
            <div className="card-header">
              <h2 className="text-xl font-semibold text-surface-900">Test Settings</h2>
            </div>
            <div className="card-body space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    {...register('has_negative_marking')}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-surface-300 rounded"
                  />
                  <label className="text-sm font-medium text-surface-700">Enable Negative Marking</label>
                </div>

                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    {...register('shuffle_options')}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-surface-300 rounded"
                  />
                  <label className="text-sm font-medium text-surface-700">Shuffle Question Options</label>
                </div>
              </div>

              {hasNegativeMarking && (
                <div>
                  <label className="form-label">Negative Marking Percentage</label>
                  <input
                    type="number"
                    {...register('negative_marking_percentage', { valueAsNumber: true })}
                    className={`form-input ${errors.negative_marking_percentage ? 'border-danger-500' : ''}`}
                    min="0"
                    max="100"
                    step="0.01"
                  />
                  {errors.negative_marking_percentage && (
                    <p className="form-error">{errors.negative_marking_percentage.message}</p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Sections and Questions */}
          <div className="card">
            <div className="card-header">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-surface-900">Test Sections</h2>
                <button
                  type="button"
                  onClick={addSection}
                  className="btn-primary"
                >
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Add Section
                </button>
              </div>
            </div>
            <div className="card-body">
              {sections.length === 0 ? (
                <p className="text-center text-surface-500 py-8">No sections added yet.</p>
              ) : (
                <div className="space-y-6">
                  {/* Section Tabs */}
                  <div className="border-b border-surface-200">
                    <nav className="-mb-px flex space-x-8">
                      {sections.map((section, index) => (
                        <button
                          key={section.id}
                          type="button"
                          onClick={() => setActiveSection(index)}
                          className={`py-2 px-1 border-b-2 font-medium text-sm ${
                            activeSection === index
                              ? 'border-primary-500 text-primary-600'
                              : 'border-transparent text-surface-500 hover:text-surface-700 hover:border-surface-300'
                          }`}
                        >
                          Section {index + 1}
                        </button>
                      ))}
                    </nav>
                  </div>

                  {/* Active Section Content */}
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="form-label">Section Name *</label>
                        <input
                          {...register(`sections.${activeSection}.name`)}
                          className={`form-input ${
                            errors.sections?.[activeSection]?.name ? 'border-danger-500' : ''
                          }`}
                        />
                        {errors.sections?.[activeSection]?.name && (
                          <p className="form-error">{errors.sections[activeSection]?.name?.message}</p>
                        )}
                      </div>

                      <div>
                        <label className="form-label">Time Limit (minutes)</label>
                        <input
                          type="number"
                          {...register(`sections.${activeSection}.time_limit_minutes`, { valueAsNumber: true })}
                          className="form-input"
                          min="1"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="form-label">Section Description</label>
                      <textarea
                        {...register(`sections.${activeSection}.description`)}
                        className="form-textarea"
                        rows={2}
                      />
                    </div>

                    {/* Questions */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium text-surface-900">Questions</h3>
                        <div className="flex space-x-2">
                          <button
                            type="button"
                            onClick={() => addQuestion('single_choice')}
                            className="btn-outline text-sm"
                          >
                            <PlusIcon className="h-4 w-4 mr-1" />
                            Single Choice
                          </button>
                          <button
                            type="button"
                            onClick={() => addQuestion('multiple_choice')}
                            className="btn-outline text-sm"
                          >
                            <PlusIcon className="h-4 w-4 mr-1" />
                            Multiple Choice
                          </button>
                          <button
                            type="button"
                            onClick={() => addQuestion('numeric')}
                            className="btn-outline text-sm"
                          >
                            <PlusIcon className="h-4 w-4 mr-1" />
                            Numeric
                          </button>
                        </div>
                      </div>

                      {questions.length === 0 ? (
                        <p className="text-center text-surface-500 py-8">No questions added to this section yet.</p>
                      ) : (
                        <div className="space-y-4">
                          {questions.map((question, qIndex) => (
                            <div key={question.id} className="border border-surface-200 rounded-lg p-4">
                              <div className="flex items-start justify-between mb-4">
                                <h4 className="font-medium text-surface-900">Question {qIndex + 1}</h4>
                                <button
                                  type="button"
                                  onClick={() => removeQuestion(qIndex)}
                                  className="text-danger-600 hover:text-danger-700"
                                >
                                  <TrashIcon className="h-4 w-4" />
                                </button>
                              </div>

                              <div className="space-y-4">
                                <div>
                                  <label className="form-label">Question Text *</label>
                                  <textarea
                                    {...register(`sections.${activeSection}.questions.${qIndex}.question_text`)}
                                    className="form-textarea"
                                    rows={3}
                                  />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                  <div>
                                    <label className="form-label">Question Type</label>
                                    <select
                                      {...register(`sections.${activeSection}.questions.${qIndex}.question_type`)}
                                      className="form-select"
                                    >
                                      <option value="single_choice">Single Choice</option>
                                      <option value="multiple_choice">Multiple Choice</option>
                                      <option value="numeric">Numeric</option>
                                    </select>
                                  </div>

                                  <div>
                                    <label className="form-label">Marks</label>
                                    <input
                                      type="number"
                                      {...register(`sections.${activeSection}.questions.${qIndex}.marks`, { valueAsNumber: true })}
                                      className="form-input"
                                      min="1"
                                    />
                                  </div>

                                  <div>
                                    <label className="form-label">Difficulty</label>
                                    <select
                                      {...register(`sections.${activeSection}.questions.${qIndex}.difficulty`)}
                                      className="form-select"
                                    >
                                      <option value="easy">Easy</option>
                                      <option value="medium">Medium</option>
                                      <option value="hard">Hard</option>
                                    </select>
                                  </div>
                                </div>

                                {/* Options for choice questions */}
                                {watch(`sections.${activeSection}.questions.${qIndex}.question_type`) !== 'numeric' && (
                                  <div className="space-y-3">
                                    <label className="form-label">Options</label>
                                    {[0, 1, 2, 3].map((optionIndex) => (
                                      <div key={optionIndex} className="flex items-center space-x-3">
                                        <input
                                          type="checkbox"
                                          {...register(`sections.${activeSection}.questions.${qIndex}.options.${optionIndex}.is_correct`)}
                                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-surface-300 rounded"
                                        />
                                        <input
                                          {...register(`sections.${activeSection}.questions.${qIndex}.options.${optionIndex}.option_text`)}
                                          className="form-input flex-1"
                                          placeholder={`Option ${optionIndex + 1}`}
                                        />
                                      </div>
                                    ))}
                                  </div>
                                )}

                                {/* Correct answer for numeric questions */}
                                {watch(`sections.${activeSection}.questions.${qIndex}.question_type`) === 'numeric' && (
                                  <div>
                                    <label className="form-label">Correct Answer</label>
                                    <input
                                      type="number"
                                      {...register(`sections.${activeSection}.questions.${qIndex}.correct_answer`, { valueAsNumber: true })}
                                      className="form-input"
                                      step="0.01"
                                    />
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="btn-outline"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary"
            >
              {isSubmitting ? (
                <div className="flex items-center">
                  <div className="spinner w-4 h-4 mr-2"></div>
                  Creating Test...
                </div>
              ) : (
                'Create Test'
              )}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
} 