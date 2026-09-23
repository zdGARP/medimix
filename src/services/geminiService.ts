import type { ExtractedEvidence } from '../types';

export interface AnalysisResponse {
  success: boolean;
  evidence?: ExtractedEvidence;
  error?: string;
  message?: string;
}

/**
 * Sends captured base64 image data URLs to the secure server API endpoint (/api/analyze-medicine)
 */
export async function analyzeMedicineImages(images: string[]): Promise<AnalysisResponse> {
  if (!images || images.length === 0) {
    return {
      success: false,
      error: 'NO_IMAGES',
      message: 'No captured medicine photos were provided.'
    };
  }

  try {
    const response = await fetch('/api/analyze-medicine', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ images })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.warn('[GeminiService] API Error:', response.status, errorData);
      return {
        success: false,
        error: errorData.error || 'SERVICE_UNAVAILABLE',
        message: errorData.message || 'Analysis service unavailable.'
      };
    }

    const data: AnalysisResponse = await response.json();
    return data;
  } catch (err: any) {
    console.error('[GeminiService] Analysis request exception:', err);
    return {
      success: false,
      error: 'NETWORK_ERROR',
      message: 'Could not connect to the evidence extraction engine.'
    };
  }
}
