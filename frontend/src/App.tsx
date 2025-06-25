// import React, { useState, useEffect } from 'react';
// import { Container, CssBaseline, ThemeProvider, createTheme } from '@mui/material';
// import VideoUploader from './components/VideoUploader';
// import TranscriptionList from './components/TranscriptionList';
// import { getTranscriptions } from './services/api';

// const theme = createTheme({
//   palette: {
//     mode: 'light',
//     primary: {
//       main: '#1976d2',
//     },
//     secondary: {
//       main: '#dc004e',
//     },
//   },
// });

// interface Transcription {
//   id: number;
//   video_name: string;
//   transcription: string;
//   created_at?: string;
// }

// function App() {
//   const [transcriptions, setTranscriptions] = useState<Transcription[]>([]);

//   const fetchTranscriptions = async () => {
//     try {
//       const data = await getTranscriptions();
//       setTranscriptions(data);
//     } catch (error) {
//       console.error('Failed to fetch transcriptions:', error);
//     }
//   };

//   useEffect(() => {
//     fetchTranscriptions();
//   }, []);

//   const handleTranscriptionComplete = (transcription: string) => {
//     fetchTranscriptions(); // Refresh the list after new transcription
//   };

//   return (
//     <ThemeProvider theme={theme}>
//       <CssBaseline />
//       <Container maxWidth="md" sx={{ py: 4 }}>
//         <VideoUploader onTranscriptionComplete={handleTranscriptionComplete} />
//         <TranscriptionList transcriptions={transcriptions} />
//       </Container>
//     </ThemeProvider>
//   );
// }

// export default App;














// import React from 'react';
// import {
//   Container,
//   CssBaseline,
//   ThemeProvider,
//   createTheme
// } from '@mui/material';
// import {
//   BrowserRouter as Router,
//   Routes,
//   Route
// } from 'react-router-dom';
// import VideoUploader from './components/VideoUploader';
// import TranscriptionHistoryPage from './components/TranscriptionHistoryPage';

// const theme = createTheme({
//   palette: {
//     mode: 'light',
//     primary: {
//       main: '#1976d2',
//     },
//     secondary: {
//       main: '#dc004e',
//     },
//   },
// });

// function App() {
//   return (
//     <ThemeProvider theme={theme}>
//       <CssBaseline />
//       <Router>
//         <Routes>
//           <Route
//             path="/"
//             element={
//               <Container maxWidth="md" sx={{ py: 4 }}>
//                 <VideoUploader onTranscriptionComplete={() => {}} />
//               </Container>
//             }
//           />
//           <Route
//             path="/history"
//             element={<TranscriptionHistoryPage />}
//           />
//         </Routes>
//       </Router>
//     </ThemeProvider>
//   );
// }

// export default App;












import React, { useState } from 'react';
import {
  Container,
  CssBaseline,
  ThemeProvider,
  createTheme
} from '@mui/material';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import VideoUploader from './components/VideoUploader';
import TranscriptionList from './components/TranscriptionList';
import TranscriptionHistoryPage from './components/TranscriptionHistoryPage';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

interface Transcription {
  id: number;
  video_name: string;
  transcription: string;
  created_at?: string;
}

function App() {
  const [latestTranscription, setLatestTranscription] = useState<Transcription | null>(null);

  const handleTranscriptionComplete = (text: string) => {
    const newTranscription: Transcription = {
      id: Date.now(), // temporary unique ID
      video_name: 'Uploaded Video',
      transcription: text,
      created_at: new Date().toISOString(),
    };
    setLatestTranscription(newTranscription);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <Container maxWidth="md" sx={{ py: 4 }}>
                <VideoUploader onTranscriptionComplete={handleTranscriptionComplete} />
                {latestTranscription && (
                  <TranscriptionList transcriptions={[latestTranscription]} />
                )}
              </Container>
            }
          />
          <Route path="/history" element={<TranscriptionHistoryPage />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;

