/**
 * KILIMO Storage Utilities
 * Handles all file uploads to Supabase Storage
 * NO UI CHANGES - Backend integration only
 */

import { projectId, publicAnonKey } from './supabase/info';

const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-ce1844e7`;

interface UploadResponse {
  success: boolean;
  filePath?: string;
  signedUrl?: string;
  error?: string;
}

/**
 * Upload image to Supabase Storage
 * Converts base64 to file and uploads to server
 */
export async function uploadImage(
  base64Data: string,
  userId: string,
  category: 'crop-diagnosis' | 'livestock' | 'profile' | 'general'
): Promise<UploadResponse> {
  try {
    const response = await fetch(`${API_BASE}/upload/image`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${publicAnonKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        imageData: base64Data,
        category,
      }),
    });

    if (!response.ok) {
      throw new Error('Upload failed');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Image upload error:', error);
    return {
      success: false,
      error: String(error),
    };
  }
}

/**
 * Upload audio to Supabase Storage
 * Handles voice recordings
 */
export async function uploadAudio(
  audioBlob: Blob,
  userId: string,
  language: string = 'sw'
): Promise<UploadResponse> {
  try {
    // Convert Blob to base64
    const base64Audio = await blobToBase64(audioBlob);

    const response = await fetch(`${API_BASE}/upload/audio`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${publicAnonKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        audioData: base64Audio,
        language,
      }),
    });

    if (!response.ok) {
      throw new Error('Audio upload failed');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Audio upload error:', error);
    return {
      success: false,
      error: String(error),
    };
  }
}

/**
 * Get signed URL for a file path
 * Used to retrieve images/audio from storage
 */
export async function getSignedUrl(
  filePath: string,
  bucket: 'crop-images' | 'livestock-images' | 'voice-recordings' | 'profile-images'
): Promise<string | null> {
  try {
    const response = await fetch(`${API_BASE}/storage/signed-url`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${publicAnonKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        filePath,
        bucket,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to get signed URL');
    }

    const data = await response.json();
    return data.signedUrl || null;
  } catch (error) {
    console.error('Signed URL error:', error);
    return null;
  }
}

/**
 * Helper: Convert Blob to Base64
 */
function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      resolve(reader.result as string);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

/**
 * Helper: Convert File to Base64
 */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      resolve(reader.result as string);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
