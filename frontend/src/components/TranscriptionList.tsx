// import React from 'react';
// import {
//     Paper,
//     List,
//     ListItem,
//     ListItemText,
//     Typography,
//     Divider,
// } from '@mui/material';

// interface Transcription {
//     id: number;
//     video_name: string;
//     transcription: string;
//     created_at?: string;
// }

// interface TranscriptionListProps {
//     transcriptions: Transcription[];
// }

// const TranscriptionList: React.FC<TranscriptionListProps> = ({ transcriptions }) => {
//     return (
//         <Paper elevation={3} sx={{ p: 3 }}>
//             <Typography variant="h6" component="h2" gutterBottom>
//                 Transcription History
//             </Typography>

//             {transcriptions.length === 0 ? (
//                 <Typography color="textSecondary">
//                     No transcriptions available yet.
//                 </Typography>
//             ) : (
//                 <List>
//                     {transcriptions.map((item, index) => (
//                         <React.Fragment key={item.id}>
//                             {index > 0 && <Divider />}
//                             <ListItem>
//                                 <ListItemText
//                                     primary={item.video_name}
//                                     secondary={
//                                         <>
//                                             <Typography
//                                                 component="span"
//                                                 variant="body2"
//                                                 color="textSecondary"
//                                             >
//                                                 {item.created_at && new Date(item.created_at).toLocaleString()}
//                                             </Typography>
//                                             <Typography
//                                                 component="p"
//                                                 variant="body2"
//                                                 sx={{ mt: 1 }}
//                                             >
//                                                 {item.transcription}
//                                             </Typography>
//                                         </>
//                                     }
//                                 />
//                             </ListItem>
//                         </React.Fragment>
//                     ))}
//                 </List>
//             )}
//         </Paper>
//     );
// };

// export default TranscriptionList; 
















import React, { useState } from 'react';
import {
  Paper,
  List,
  ListItem,
  ListItemText,
  Typography,
  Divider,
  Button,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import jsPDF from 'jspdf';

interface Transcription {
  id: number;
  video_name: string;
  transcription: string;
  created_at?: string;
}

interface TranscriptionListProps {
  transcriptions: Transcription[];
  onDelete?: (id: number) => void;
}

const TranscriptionList: React.FC<TranscriptionListProps> = ({ transcriptions, onDelete }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const handleDownload = (transcription: Transcription) => {
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text(`Video Name: ${transcription.video_name}`, 10, 20);
    if (transcription.created_at) {
      doc.setFontSize(12);
      doc.text(`Date: ${new Date(transcription.created_at).toLocaleString()}`, 10, 30);
    }
    doc.text('Transcription:', 10, 40);
    doc.setFont('courier', 'normal');
    doc.text(transcription.transcription, 10, 50, { maxWidth: 180 });
    doc.save(`${transcription.video_name.replace(/\s+/g, '_') || 'transcription'}.pdf`);
  };

  const confirmDelete = (id: number) => {
    setSelectedId(id);
    setOpenDialog(true);
  };

  const handleConfirm = () => {
    if (selectedId !== null && onDelete) {
      onDelete(selectedId);
    }
    setOpenDialog(false);
    setSelectedId(null);
  };

  const handleCancel = () => {
    setOpenDialog(false);
    setSelectedId(null);
  };

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography variant="h6" component="h2" gutterBottom>
        Transcription Result
      </Typography>

      {transcriptions.length === 0 ? (
        <Typography color="textSecondary">
          No transcriptions available yet.
        </Typography>
      ) : (
        <List>
          {transcriptions.map((item, index) => (
            <React.Fragment key={item.id}>
              {index > 0 && <Divider />}
              <ListItem alignItems="flex-start">
                <ListItemText
                  primary={
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <span>{item.video_name}</span>
                      <Box>
                        <Button
                          variant="outlined"
                          size="small"
                          sx={{ mr: 1 }}
                          onClick={() => handleDownload(item)}
                        >
                          Download PDF
                        </Button>
                        {onDelete && (
                          <Button
                            variant="outlined"
                            color="error"
                            size="small"
                            onClick={() => confirmDelete(item.id)}
                          >
                            Delete
                          </Button>
                        )}
                      </Box>
                    </Box>
                  }
                  secondary={
                    <>
                      <Typography
                        component="span"
                        variant="body2"
                        color="textSecondary"
                      >
                        {item.created_at && new Date(item.created_at).toLocaleString()}
                      </Typography>
                      <Typography
                        component="p"
                        variant="body2"
                        sx={{ mt: 1 }}
                      >
                        {item.transcription}
                      </Typography>
                    </>
                  }
                />
              </ListItem>
            </React.Fragment>
          ))}
        </List>
      )}

      {/* Delete confirmation dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCancel}
      >
        <DialogTitle>Delete Transcription?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this transcription? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel}>Cancel</Button>
          <Button onClick={handleConfirm} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default TranscriptionList;



