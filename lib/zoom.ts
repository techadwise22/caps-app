import { ZoomMeeting } from '@/types';

const ZOOM_CLIENT_ID = process.env.ZOOM_CLIENT_ID;
const ZOOM_CLIENT_SECRET = process.env.ZOOM_CLIENT_SECRET;
const ZOOM_REDIRECT_URI = process.env.ZOOM_REDIRECT_URI;

export interface ZoomAuthResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  scope: string;
}

export interface ZoomMeetingRequest {
  topic: string;
  type: 2; // Scheduled meeting
  start_time: string;
  duration: number;
  timezone: string;
  password?: string;
  settings: {
    host_video: boolean;
    participant_video: boolean;
    join_before_host: boolean;
    mute_upon_entry: boolean;
    watermark: boolean;
    use_pmi: boolean;
    approval_type: number;
    audio: string;
    auto_recording: string;
  };
}

export class ZoomAPI {
  private accessToken: string | null = null;

  constructor(accessToken?: string) {
    this.accessToken = accessToken || null;
  }

  // Get OAuth URL for Zoom authorization
  static getAuthURL(): string {
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: ZOOM_CLIENT_ID!,
      redirect_uri: ZOOM_REDIRECT_URI!,
      scope: 'meeting:write meeting:read',
    });
    
    return `https://zoom.us/oauth/authorize?${params.toString()}`;
  }

  // Exchange authorization code for access token
  static async getAccessToken(code: string): Promise<ZoomAuthResponse> {
    const response = await fetch('https://zoom.us/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${Buffer.from(`${ZOOM_CLIENT_ID}:${ZOOM_CLIENT_SECRET}`).toString('base64')}`,
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: ZOOM_REDIRECT_URI!,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to get Zoom access token');
    }

    return response.json();
  }

  // Refresh access token
  async refreshToken(refreshToken: string): Promise<ZoomAuthResponse> {
    const response = await fetch('https://zoom.us/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${Buffer.from(`${ZOOM_CLIENT_ID}:${ZOOM_CLIENT_SECRET}`).toString('base64')}`,
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to refresh Zoom access token');
    }

    return response.json();
  }

  // Create a Zoom meeting
  async createMeeting(meetingData: ZoomMeetingRequest): Promise<ZoomMeeting> {
    if (!this.accessToken) {
      throw new Error('No access token available');
    }

    const response = await fetch('https://api.zoom.us/v2/users/me/meetings', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(meetingData),
    });

    if (!response.ok) {
      throw new Error('Failed to create Zoom meeting');
    }

    const data = await response.json();
    
    return {
      id: data.id,
      meeting_id: data.id.toString(),
      topic: data.topic,
      start_time: data.start_time,
      duration: data.duration,
      join_url: data.join_url,
      password: data.password,
      host_email: data.host_email,
      status: 'waiting',
      created_at: new Date().toISOString(),
    };
  }

  // Get meeting details
  async getMeeting(meetingId: string): Promise<ZoomMeeting> {
    if (!this.accessToken) {
      throw new Error('No access token available');
    }

    const response = await fetch(`https://api.zoom.us/v2/meetings/${meetingId}`, {
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to get Zoom meeting');
    }

    const data = await response.json();
    
    return {
      id: data.id,
      meeting_id: data.id.toString(),
      topic: data.topic,
      start_time: data.start_time,
      duration: data.duration,
      join_url: data.join_url,
      password: data.password,
      host_email: data.host_email,
      status: data.status,
      created_at: new Date().toISOString(),
    };
  }

  // Update meeting
  async updateMeeting(meetingId: string, updates: Partial<ZoomMeetingRequest>): Promise<void> {
    if (!this.accessToken) {
      throw new Error('No access token available');
    }

    const response = await fetch(`https://api.zoom.us/v2/meetings/${meetingId}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      throw new Error('Failed to update Zoom meeting');
    }
  }

  // Delete meeting
  async deleteMeeting(meetingId: string): Promise<void> {
    if (!this.accessToken) {
      throw new Error('No access token available');
    }

    const response = await fetch(`https://api.zoom.us/v2/meetings/${meetingId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to delete Zoom meeting');
    }
  }

  // Get user profile
  async getUserProfile(): Promise<any> {
    if (!this.accessToken) {
      throw new Error('No access token available');
    }

    const response = await fetch('https://api.zoom.us/v2/users/me', {
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to get user profile');
    }

    return response.json();
  }
}

// Utility functions for Zoom integration
export const zoomUtils = {
  // Generate meeting password
  generatePassword(): string {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  },

  // Format meeting time for Zoom API
  formatMeetingTime(date: Date): string {
    return date.toISOString().replace(/\.\d{3}Z$/, 'Z');
  },

  // Validate Zoom meeting URL
  isValidZoomUrl(url: string): boolean {
    return url.includes('zoom.us') && (url.includes('/j/') || url.includes('/meeting/'));
  },

  // Extract meeting ID from Zoom URL
  extractMeetingId(url: string): string | null {
    const match = url.match(/\/j\/(\d+)/) || url.match(/\/meeting\/(\d+)/);
    return match ? match[1] : null;
  },
}; 