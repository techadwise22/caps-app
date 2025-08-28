import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, formatDistanceToNow, parseISO } from 'date-fns';

// Utility function to merge Tailwind classes
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Date formatting utilities
export function formatDate(date: string | Date, formatString: string = 'MMM dd, yyyy') {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, formatString);
}

export function formatDateTime(date: string | Date) {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, 'MMM dd, yyyy HH:mm');
}

export function formatTimeAgo(date: string | Date) {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return formatDistanceToNow(dateObj, { addSuffix: true });
}

export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (hours > 0) {
    return `${hours}h ${mins}m`;
  }
  return `${mins}m`;
}

export function formatTime(time: string): string {
  // Format time string (e.g., "14:30" to "2:30 PM")
  const [hours, minutes] = time.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
}

// Test utilities
export function calculateScore(
  correctAnswers: number,
  totalQuestions: number,
  negativeMarking: boolean = false,
  negativePercentage: number = 0
): number {
  if (totalQuestions === 0) return 0;
  
  const percentage = (correctAnswers / totalQuestions) * 100;
  
  if (negativeMarking) {
    const incorrectAnswers = totalQuestions - correctAnswers;
    const negativeDeduction = (incorrectAnswers / totalQuestions) * negativePercentage;
    return Math.max(0, percentage - negativeDeduction);
  }
  
  return percentage;
}

export function getQuestionStatus(
  questionId: string,
  answers: Record<string, any>,
  markedForReview: Set<string>
): 'unanswered' | 'answered' | 'marked' {
  if (markedForReview.has(questionId)) {
    return 'marked';
  }
  
  const answer = answers[questionId];
  if (answer && (
    (typeof answer === 'string' && answer.trim() !== '') ||
    (Array.isArray(answer) && answer.length > 0) ||
    (typeof answer === 'number' && !isNaN(answer))
  )) {
    return 'answered';
  }
  
  return 'unanswered';
}

// File utilities
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export function getFileIcon(fileType: string): string {
  const iconMap: Record<string, string> = {
    pdf: '📄',
    doc: '📝',
    docx: '📝',
    ppt: '📊',
    pptx: '📊',
    xls: '📈',
    xlsx: '📈',
    image: '🖼️',
    audio: '🎵',
    video: '🎥',
    other: '📎'
  };
  
  return iconMap[fileType] || iconMap.other;
}

// YouTube utilities
export function extractYouTubeVideoId(url: string): string | null {
  const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

export function extractYouTubePlaylistId(url: string): string | null {
  const regex = /(?:youtube\.com\/playlist\?list=|youtu\.be\/.*[?&]list=)([^&]+)/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

// Validation utilities
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

// Role-based access control
export function hasPermission(userRole: string, requiredRole: string): boolean {
  const roleHierarchy = {
    admin: 4,
    instructor: 3,
    student: 2,
    committee_tester: 1
  };
  
  return roleHierarchy[userRole as keyof typeof roleHierarchy] >= roleHierarchy[requiredRole as keyof typeof roleHierarchy];
}

// Local storage utilities
export function setLocalStorage(key: string, value: any): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(key, JSON.stringify(value));
  }
}

export function getLocalStorage(key: string): any {
  if (typeof window !== 'undefined') {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  }
  return null;
}

export function removeLocalStorage(key: string): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(key);
  }
}

// Debounce utility
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// Generate random ID
export function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

// Color utilities for difficulty levels
export function getDifficultyColor(difficulty: string): string {
  const colors = {
    easy: 'text-success-600 bg-success-50',
    medium: 'text-warning-600 bg-warning-50',
    hard: 'text-danger-600 bg-danger-50'
  };
  
  return colors[difficulty as keyof typeof colors] || colors.medium;
}

// Test status utilities
export function getTestStatusColor(status: string): string {
  const colors = {
    in_progress: 'text-primary-600 bg-primary-50',
    submitted: 'text-success-600 bg-success-50',
    timeout: 'text-danger-600 bg-danger-50',
    abandoned: 'text-surface-600 bg-surface-50'
  };
  
  return colors[status as keyof typeof colors] || colors.in_progress;
}

// Pagination utilities
export function paginate<T>(array: T[], page: number, limit: number): T[] {
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  return array.slice(startIndex, endIndex);
}

// Search utilities
export function searchFilter<T>(
  items: T[],
  searchTerm: string,
  searchFields: (keyof T)[]
): T[] {
  if (!searchTerm.trim()) return items;
  
  const term = searchTerm.toLowerCase();
  
  return items.filter(item =>
    searchFields.some(field => {
      const value = item[field];
      return value && String(value).toLowerCase().includes(term);
    })
  );
} 