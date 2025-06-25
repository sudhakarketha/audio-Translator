import axios from 'axios';

const API_URL = 'http://localhost:5000';

export interface TranscriptionResponse {
    success: boolean;
    transcription?: string;
    error?: string;
}

export const uploadVideo = async (file: File): Promise<TranscriptionResponse> => {
    try {
        const formData = new FormData();
        formData.append('video', file);

        const response = await axios.post(`${API_URL}/transcribe`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            return {
                success: false,
                error: error.response?.data?.error || 'Error uploading video',
            };
        }
        return {
            success: false,
            error: 'An unexpected error occurred',
        };
    }
};

export const getTranscriptions = async () => {
    try {
        const response = await axios.get(`${API_URL}/transcriptions`);
        return response.data;
    } catch (error) {
        throw new Error('Failed to fetch transcriptions');
    }
}; 



// services/api.ts
export const deleteTranscription = async (id: number): Promise<void> => {
    const res = await fetch(`http://localhost:5000/transcriptions/${id}`, {
      method: 'DELETE',
    });
  
    if (!res.ok) {
      throw new Error('Failed to delete transcription');
    }
  };