import React from 'react';
import { Modal, Box, Button, Typography } from '@mui/material';
import { QRCodeSVG } from 'qrcode.react';
import { Share as ShareIcon, ContentCopy as ContentCopyIcon } from '@mui/icons-material';

interface ShareModalProps {
  open: boolean;
  onClose: () => void;
  url: string;
}

const BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://afc.meakuumi.com'
  : 'http://localhost:3000';

const ShareModal: React.FC<ShareModalProps> = ({ open, onClose, url }) => {
  const fullUrl = `${BASE_URL}${url}`;

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(fullUrl);
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
        borderRadius: 2,
        width: 'auto',
        maxWidth: '90%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 2
      }}>
        <Typography variant="h6">Partager votre profil</Typography>
        
        <QRCodeSVG
          value={fullUrl}
          size={256}
          level="H"
          style={{ margin: '20px 0' }}
        />

        <Button
          variant="contained"
          startIcon={<ShareIcon />}
          onClick={() => {
            if (navigator.share) {
              navigator.share({
                title: 'Git Contributions',
                url: fullUrl
              });
            } else {
              handleCopyUrl();
            }
          }}
          fullWidth
        >
          Partager
        </Button>

        <Button
          variant="outlined"
          startIcon={<ContentCopyIcon />}
          onClick={handleCopyUrl}
          fullWidth
        >
          Copier le lien
        </Button>
      </Box>
    </Modal>
  );
};

export default ShareModal; 