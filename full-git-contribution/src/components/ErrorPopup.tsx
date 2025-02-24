import React from 'react';
import { Box, Typography } from '@mui/material';
import { Error as ErrorIcon } from '@mui/icons-material';

interface ErrorPopupProps {
  message: string;
}

const ErrorPopup: React.FC<ErrorPopupProps> = ({ message }) => {
  if (!message) return null;

  return (
    <Box
      sx={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        backgroundColor: '#ff4444',
        color: 'white',
        padding: '12px 20px',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        zIndex: 9999,
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        maxWidth: '400px'
      }}
    >
      <ErrorIcon />
      <Typography variant="body1">
        {message}
      </Typography>
    </Box>
  );
};

export default ErrorPopup; 