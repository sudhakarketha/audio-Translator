// // src/pages/TranscriptionHistoryPage.tsx
// import React, { useEffect, useState } from 'react';
// import { Container, Typography, CircularProgress, Alert, Button } from '@mui/material';
// import TranscriptionList from '../components/TranscriptionList';
// import { getTranscriptions } from '../services/api';
// import { useNavigate } from 'react-router-dom';

// interface Transcription {
//   id: number;
//   video_name: string;
//   transcription: string;
//   created_at?: string;
// }

// const TranscriptionHistoryPage: React.FC = () => {
//   const [transcriptions, setTranscriptions] = useState<Transcription[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetch = async () => {
//       try {
//         const data = await getTranscriptions();
//         setTranscriptions(data);
//       } catch (err) {
//         setError('Failed to fetch transcriptions');
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetch();
//   }, []);

//   return (
//     <Container maxWidth="md" sx={{ py: 4 }}>
//       <Button onClick={() => navigate('/')} variant="outlined" sx={{ mb: 2 }}>
//         ← Back to Upload
//       </Button>

//       <Typography variant="h5" gutterBottom>
//         Transcription History
//       </Typography>

//       {loading && <CircularProgress />}
//       {error && <Alert severity="error">{error}</Alert>}
//       {!loading && !error && <TranscriptionList transcriptions={transcriptions} />}
//     </Container>
//   );
// };

// export default TranscriptionHistoryPage;















import React, { useEffect, useState } from 'react';
import { Container, Typography, CircularProgress, Alert, Button } from '@mui/material';
import TranscriptionList from '../components/TranscriptionList';
import { getTranscriptions, deleteTranscription } from '../services/api';
import { useNavigate } from 'react-router-dom';

interface Transcription {
  id: number;
  video_name: string;
  transcription: string;
  created_at?: string;
}

const TranscriptionHistoryPage: React.FC = () => {
  const [transcriptions, setTranscriptions] = useState<Transcription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const data = await getTranscriptions();
      setTranscriptions(data);
    } catch (err) {
      setError('Failed to fetch transcriptions');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteTranscription(id);
      setTranscriptions((prev) => prev.filter((t) => t.id !== id));
    } catch {
      alert('Failed to delete transcription');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Button onClick={() => navigate('/')} variant="outlined" sx={{ mb: 2 }}>
        ← Back to Upload
      </Button>

      <Typography variant="h5" gutterBottom>
        Transcription History
      </Typography>

      {loading && <CircularProgress />}
      {error && <Alert severity="error">{error}</Alert>}
      {!loading && !error && (
        <TranscriptionList transcriptions={transcriptions} onDelete={handleDelete} />
      )}
    </Container>
  );
};

export default TranscriptionHistoryPage;
