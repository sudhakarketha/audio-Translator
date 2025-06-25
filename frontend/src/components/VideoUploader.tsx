import React, { useState, useRef } from 'react';
import {
    Box,
    Button,
    CircularProgress,
    Typography,
    Paper,
    Alert
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { uploadVideo, TranscriptionResponse } from '../services/api';

interface VideoUploaderProps {
    onTranscriptionComplete: (transcription: string) => void;
}

const VideoUploader: React.FC<VideoUploaderProps> = ({ onTranscriptionComplete }) => {
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            setError(null);
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            setError('Please select a video file');
            return;
        }

        setUploading(true);
        setError(null);

        try {
            const response: TranscriptionResponse = await uploadVideo(selectedFile);
            if (response.success && response.transcription) {
                onTranscriptionComplete(response.transcription);
                setSelectedFile(null);
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
            } else {
                setError(response.error || 'Failed to transcribe video');
            }
        } catch (err) {
            setError('An error occurred while uploading the video');
        } finally {
            setUploading(false);
        }
    };

    return (
        <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
            <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
                <Typography variant="h6" component="h2">
                    Upload Video for Transcription
                </Typography>

                <input
                    ref={fileInputRef}
                    type="file"
                    accept="video/*"
                    onChange={handleFileSelect}
                    style={{ display: 'none' }}
                    id="video-upload-input"
                />

                <label htmlFor="video-upload-input">
                    <Button
                        variant="outlined"
                        component="span"
                        startIcon={<CloudUploadIcon />}
                        disabled={uploading}
                    >
                        Select Video
                    </Button>
                </label>

                {selectedFile && (
                    <Typography variant="body2" color="textSecondary">
                        Selected: {selectedFile.name}
                    </Typography>
                )}

                {error && (
                    <Alert severity="error" sx={{ width: '100%' }}>
                        {error}
                    </Alert>
                )}

                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleUpload}
                    disabled={!selectedFile || uploading}
                    sx={{ mt: 2 }}
                >
                    {uploading ? (
                        <>
                            <CircularProgress size={24} sx={{ mr: 1 }} />
                            Processing...
                        </>
                    ) : (
                        'Upload and Transcribe'
                    )}
                </Button>

            </Box>
            <Button
        variant="text"
        onClick={() => window.location.href = '/history'}
        sx={{ mt: 1 }}
      >
        View History
      </Button>

        </Paper>
        
    );
};

export default VideoUploader; 