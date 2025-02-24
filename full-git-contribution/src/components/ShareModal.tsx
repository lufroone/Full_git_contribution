import React, { useRef } from 'react';
import { Modal, Box, Button, Typography } from '@mui/material';
import { QRCodeSVG } from 'qrcode.react';
import { Share as ShareIcon, ContentCopy as ContentCopyIcon, Download as DownloadIcon } from '@mui/icons-material';

interface ShareModalProps {
  open: boolean;
  onClose: () => void;
  url: string;
}

const BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://afc.meakuumi.com'
  : 'http://localhost:3000';

const ShareModal: React.FC<ShareModalProps> = ({ open, onClose, url }) => {
  const qrRef = useRef<SVGSVGElement>(null);
  const fullUrl = url.startsWith('http') ? url : `${BASE_URL}${url}`;

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(fullUrl);
  };

  const handleDownloadQR = () => {
    if (qrRef.current) {
      const svg = qrRef.current;
      const svgData = new XMLSerializer().serializeToString(svg);
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        canvas.width = img.width * 4; // Augmente la qualité
        canvas.height = img.height * 4;
        if (ctx) {
          ctx.fillStyle = 'white';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          
          const pngFile = canvas.toDataURL('image/png');
          const downloadLink = document.createElement('a');
          downloadLink.download = 'git-contributions-qr.png';
          downloadLink.href = pngFile;
          downloadLink.click();
        }
      };
      
      img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
    }
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
          ref={qrRef}
          value={fullUrl}
          size={300}
          level="M"
          style={{ 
            margin: '20px 0',
            padding: '20px',
            backgroundColor: 'white',
            borderRadius: '10px'
          }}
          includeMargin={true}
          bgColor="#FFFFFF"
          fgColor="#000000"
        />

        <Button
          variant="contained"
          startIcon={<DownloadIcon />}
          onClick={handleDownloadQR}
          fullWidth
        >
          Télécharger le QR Code
        </Button>

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