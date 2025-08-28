import { createClientSupabaseClient } from './supabase';
import { FileType } from '@/types';

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

export interface UploadResult {
  url: string;
  path: string;
  size: number;
  mimeType: string;
  fileName: string;
}

export interface FileValidation {
  isValid: boolean;
  error?: string;
}

// File type validation
const ALLOWED_FILE_TYPES: Record<FileType, string[]> = {
  pdf: ['application/pdf'],
  ppt: ['application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation'],
  pptx: ['application/vnd.openxmlformats-officedocument.presentationml.presentation'],
  doc: ['application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  docx: ['application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  image: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'],
  audio: ['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/mp4'],
  video: ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime'],
  other: ['text/plain', 'application/zip', 'application/x-rar-compressed'],
};

const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB

export class FileUploader {
  private supabase = createClientSupabaseClient();

  // Validate file before upload
  validateFile(file: File, allowedTypes: FileType[] = ['other']): FileValidation {
    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      return {
        isValid: false,
        error: `File size must be less than ${MAX_FILE_SIZE / (1024 * 1024)}MB`,
      };
    }

    // Check file type
    const allowedMimeTypes = allowedTypes.flatMap(type => ALLOWED_FILE_TYPES[type]);
    if (!allowedMimeTypes.includes(file.type)) {
      return {
        isValid: false,
        error: `File type ${file.type} is not allowed. Allowed types: ${allowedTypes.join(', ')}`,
      };
    }

    return { isValid: true };
  }

  // Upload file to Supabase Storage
  async uploadFile(
    file: File,
    bucket: string = 'content',
    path: string = '',
    onProgress?: (progress: UploadProgress) => void
  ): Promise<UploadResult> {
    try {
      // Generate unique filename
      const timestamp = Date.now();
      const fileName = `${timestamp}-${file.name}`;
      const filePath = path ? `${path}/${fileName}` : fileName;

      // Upload file
      const { data, error } = await this.supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (error) {
        throw new Error(`Upload failed: ${error.message}`);
      }

      // Get public URL
      const { data: urlData } = this.supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

      return {
        url: urlData.publicUrl,
        path: filePath,
        size: file.size,
        mimeType: file.type,
        fileName: file.name,
      };
    } catch (error) {
      throw new Error(`Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Upload multiple files
  async uploadFiles(
    files: File[],
    bucket: string = 'content',
    path: string = '',
    onProgress?: (progress: UploadProgress) => void
  ): Promise<UploadResult[]> {
    const results: UploadResult[] = [];
    let totalLoaded = 0;
    let totalSize = files.reduce((sum, file) => sum + file.size, 0);

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      try {
        const result = await this.uploadFile(file, bucket, path);
        results.push(result);
        
        totalLoaded += file.size;
        if (onProgress) {
          onProgress({
            loaded: totalLoaded,
            total: totalSize,
            percentage: Math.round((totalLoaded / totalSize) * 100),
          });
        }
      } catch (error) {
        console.error(`Failed to upload ${file.name}:`, error);
        throw error;
      }
    }

    return results;
  }

  // Delete file from storage
  async deleteFile(bucket: string, path: string): Promise<void> {
    const { error } = await this.supabase.storage
      .from(bucket)
      .remove([path]);

    if (error) {
      throw new Error(`Delete failed: ${error.message}`);
    }
  }

  // Get file info
  async getFileInfo(bucket: string, path: string) {
    const { data, error } = await this.supabase.storage
      .from(bucket)
      .list(path);

    if (error) {
      throw new Error(`Failed to get file info: ${error.message}`);
    }

    return data;
  }

  // Download file
  async downloadFile(bucket: string, path: string): Promise<Blob> {
    const { data, error } = await this.supabase.storage
      .from(bucket)
      .download(path);

    if (error) {
      throw new Error(`Download failed: ${error.message}`);
    }

    return data;
  }
}

// Utility functions for file handling
export const fileUtils = {
  // Get file type from MIME type
  getFileType(mimeType: string): FileType {
    if (mimeType.startsWith('image/')) return 'image';
    if (mimeType.startsWith('video/')) return 'video';
    if (mimeType.startsWith('audio/')) return 'audio';
    if (mimeType === 'application/pdf') return 'pdf';
    if (mimeType.includes('powerpoint') || mimeType.includes('presentation')) return 'ppt';
    if (mimeType.includes('word') || mimeType.includes('document')) return 'doc';
    return 'other';
  },

  // Get file icon based on type
  getFileIcon(fileType: FileType): string {
    const icons = {
      pdf: '📄',
      ppt: '📊',
      pptx: '📊',
      doc: '📝',
      docx: '📝',
      image: '🖼️',
      audio: '🎵',
      video: '🎥',
      other: '📎',
    };
    return icons[fileType] || icons.other;
  },

  // Format file size
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  },

  // Get file extension
  getFileExtension(fileName: string): string {
    return fileName.split('.').pop()?.toLowerCase() || '';
  },

  // Check if file is an image
  isImage(file: File): boolean {
    return file.type.startsWith('image/');
  },

  // Check if file is a video
  isVideo(file: File): boolean {
    return file.type.startsWith('video/');
  },

  // Check if file is an audio
  isAudio(file: File): boolean {
    return file.type.startsWith('audio/');
  },

  // Check if file is a document
  isDocument(file: File): boolean {
    return file.type.includes('pdf') || 
           file.type.includes('word') || 
           file.type.includes('document') ||
           file.type.includes('powerpoint') ||
           file.type.includes('presentation');
  },

  // Create object URL for preview
  createPreviewUrl(file: File): string {
    return URL.createObjectURL(file);
  },

  // Revoke object URL
  revokePreviewUrl(url: string): void {
    URL.revokeObjectURL(url);
  },

  // Generate unique filename
  generateFileName(originalName: string): string {
    const timestamp = Date.now();
    const extension = this.getFileExtension(originalName);
    const nameWithoutExt = originalName.replace(/\.[^/.]+$/, '');
    return `${nameWithoutExt}-${timestamp}.${extension}`;
  },

  // Validate file name
  validateFileName(fileName: string): boolean {
    const invalidChars = /[<>:"/\\|?*]/;
    return !invalidChars.test(fileName) && fileName.length <= 255;
  },

  // Sanitize file name
  sanitizeFileName(fileName: string): string {
    return fileName
      .replace(/[<>:"/\\|?*]/g, '_')
      .replace(/\s+/g, '_')
      .substring(0, 255);
  },
};

// Drag and drop utilities
export const dragDropUtils = {
  // Check if file is being dragged over
  isDragOver(event: DragEvent): boolean {
    return event.dataTransfer?.types.includes('Files') || false;
  },

  // Get files from drop event
  getFilesFromDrop(event: DragEvent): File[] {
    const files: File[] = [];
    if (event.dataTransfer?.files) {
      for (let i = 0; i < event.dataTransfer.files.length; i++) {
        const file = event.dataTransfer.files[i];
        if (file instanceof File) {
          files.push(file);
        }
      }
    }
    return files;
  },

  // Prevent default drag behaviors
  preventDefaults(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
  },
}; 