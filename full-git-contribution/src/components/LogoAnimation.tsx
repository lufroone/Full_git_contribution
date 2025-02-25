import React from 'react';
import { Box, keyframes } from '@mui/material';
import githubLogo from '../assets/github-logo.png';
import gitlabLogo from '../assets/gitlab-logo.svg';

const moveInEllipse1 = keyframes`
  0% {
    transform: translate(-120px, 0) translateZ(0);
    scale: 1;
    z-index: 1;
  }
  20% {
    transform: translate(0, 20px) translateZ(-100px);
    scale: 0.7;
    z-index: 0;
  }
  45% {
    transform: translate(120px, 0) translateZ(0);
    scale: 1;
    z-index: 1;
  }
  70% {
    transform: translate(0, -20px) translateZ(100px);
    scale: 1.3;
    z-index: 2;
  }
  100% {
    transform: translate(-120px, 0) translateZ(0);
    scale: 1;
    z-index: 1;
  }
`;

const moveInEllipse2 = keyframes`
  0% {
    transform: translate(120px, 0) translateZ(0);
    scale: 1;
    z-index: 1;
  }
  20% {
    transform: translate(0, -20px) translateZ(100px);
    scale: 1.3;
    z-index: 2;
  }
  45% {
    transform: translate(-120px, 0) translateZ(0);
    scale: 1;
    z-index: 1;
  }
  70% {
    transform: translate(0, 20px) translateZ(-100px);
    scale: 0.7;
    z-index: 0;
  }
  100% {
    transform: translate(120px, 0) translateZ(0);
    scale: 1;
    z-index: 1;
  }
`;

const LogoAnimation: React.FC = () => {
  return (
    <Box sx={{ 
      display: 'flex', 
      justifyContent: 'center',
      alignItems: 'center',
      perspective: '1200px',
      height: { xs: '70px', sm: '150px', md: '180px' },
      width: '100%',
      position: 'relative',
      mb: { xs: 0.5, sm: 2, md: 3 }
    }}>
      <Box
        component="img"
        src={githubLogo}
        sx={{
          maxWidth: { xs: '35px', sm: '80px', md: '100px' },
          maxHeight: { xs: '35px', sm: '80px', md: '100px' },
          width: 'auto',
          height: 'auto',
          position: 'absolute',
          animation: `${moveInEllipse1} 20s linear infinite`,
          transformStyle: 'preserve-3d',
          filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))',
          willChange: 'transform, z-index',
          backgroundColor: '#fff',
          borderRadius: '50%',
          padding: { xs: '4px', sm: '8px', md: '10px' },
          objectFit: 'contain'
        }}
      />
      <Box
        component="img"
        src={gitlabLogo}
        sx={{
          maxWidth: { xs: '35px', sm: '80px', md: '100px' },
          maxHeight: { xs: '35px', sm: '80px', md: '100px' },
          width: 'auto',
          height: 'auto',
          position: 'absolute',
          animation: `${moveInEllipse2} 20s linear infinite`,
          transformStyle: 'preserve-3d',
          filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))',
          willChange: 'transform, z-index'
        }}
      />
    </Box>
  );
};

export default LogoAnimation; 