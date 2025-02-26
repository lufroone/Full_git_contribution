import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography, Button, Container, IconButton } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import LogoAnimation from '../components/LogoAnimation';
import { useLanguage } from '../hooks/useLanguage';

const Home: React.FC = () => {
  const [showTutorial, setShowTutorial] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    if (showTutorial) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showTutorial]);

  const handleScroll = () => {
    setShowTutorial(!showTutorial);
  };

  return (
    <Container 
      maxWidth="md" 
      sx={{ 
        height: '100vh',
        overflow: 'hidden',
        position: 'relative'
      }}
    >
      <Box 
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          alignItems: 'center',
          textAlign: 'center',
          gap: { xs: 2, sm: 2, md: 3 },
          py: { xs: 3, sm: 4 },
          transition: 'transform 0.5s ease-in-out',
          transform: showTutorial ? 'translateY(-100vh)' : 'translateY(0)',
        }}
      >
        <Box sx={{ 
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          alignItems: 'center',
          gap: { xs: 0, sm: 1, md: 2 },
          mt: { xs: 1, sm: 4, md: 6 }
        }}>
          <LogoAnimation />
          
          <Typography 
            variant="h2" 
            component="h1" 
            gutterBottom
            sx={{
              fontSize: { xs: '2rem', sm: '2.5rem', md: '3.5rem' },
              mb: { xs: 0, sm: 1 }
            }}
          >
            {t('title')}
          </Typography>
          
          <Typography 
            variant="h5" 
            component="h2" 
            color="text.secondary" 
            gutterBottom
            sx={{
              fontSize: { xs: '1.1rem', sm: '1.3rem', md: '1.5rem' },
              px: { xs: 2, sm: 4 },
              mb: { xs: 0, sm: 1 }
            }}
          >
            {t('subtitle')}
          </Typography>

          <Typography 
            variant="body1" 
            color="text.secondary" 
            sx={{ 
              mb: { xs: 2, sm: 3 },
              px: { xs: 2, sm: 4 }
            }}
          >
            {t('description')}
          </Typography>

          <Box sx={{ mt: { xs: 2, sm: 3, md: 4 } }}>
            <Button 
              component={Link} 
              to="/contributions" 
              variant="contained" 
              size="large"
              sx={{ 
                fontSize: { xs: '1rem', sm: '1.1rem', md: '1.2rem' },
                padding: { xs: '8px 24px', sm: '10px 28px', md: '12px 32px' }
              }}
            >
              {t('createProfile')}
            </Button>
          </Box>
        </Box>

        <IconButton 
          onClick={handleScroll}
          sx={{ 
            position: 'absolute',
            bottom: { xs: '8%', sm: '12%', md: '10%' },
            left: '50%',
            transform: 'translateX(-50%)',
            animation: 'bounce 2s infinite',
            '@keyframes bounce': {
              '0%, 100%': { transform: 'translate(-50%, 0)' },
              '50%': { transform: 'translate(-50%, 10px)' }
            },
            zIndex: 1
          }}
        >
          <KeyboardArrowDownIcon fontSize="large" />
        </IconButton>
      </Box>

      <Box 
        sx={{
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'flex-start',
          textAlign: 'left',
          gap: { xs: 2, sm: 3, md: 4 },
          position: 'absolute',
          top: '100vh',
          left: 0,
          right: 0,
          transition: 'transform 0.5s ease-in-out',
          transform: showTutorial ? 'translateY(-100vh)' : 'translateY(0)',
          padding: { xs: '16px', sm: '24px', md: '32px' },
          '& > *': {
            transform: 'translateY(-10%)'
          }
        }}
      >
        <IconButton 
          onClick={handleScroll}
          sx={{ 
            position: 'absolute',
            top: { xs: 10, sm: 15, md: 20 },
            left: '50%',
            transform: 'translateX(-50%)'
          }}
        >
          <KeyboardArrowUpIcon fontSize="large" />
        </IconButton>

        <Typography 
          variant="h3" 
          component="h2" 
          gutterBottom
          sx={{
            fontSize: { xs: '1.8rem', sm: '2.2rem', md: '2.5rem' },
            mt: { xs: 6, sm: 8, md: 10 }
          }}
        >
          {t('howItWorks')}
        </Typography>

        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: { xs: 2, sm: 3, md: 4 }, 
          maxWidth: '800px',
          width: '100%'
        }}>
          <Box>
            <Typography 
              variant="h5" 
              gutterBottom
              sx={{
                fontSize: { xs: '1.2rem', sm: '1.4rem', md: '1.5rem' }
              }}
            >
              {t('step1.title')}
            </Typography>
            <Typography 
              color="text.secondary"
              sx={{
                fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' }
              }}
            >
              {t('step1.description')}
            </Typography>
          </Box>

          <Box>
            <Typography 
              variant="h5" 
              gutterBottom
              sx={{
                fontSize: { xs: '1.2rem', sm: '1.4rem', md: '1.5rem' }
              }}
            >
              {t('step2.title')}
            </Typography>
            <Typography 
              color="text.secondary"
              sx={{
                fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' }
              }}
            >
              {t('step2.description')}
            </Typography>
          </Box>

          <Box>
            <Typography 
              variant="h5" 
              gutterBottom
              sx={{
                fontSize: { xs: '1.2rem', sm: '1.4rem', md: '1.5rem' }
              }}
            >
              {t('step3.title')}
            </Typography>
            <Typography 
              color="text.secondary"
              sx={{
                fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' }
              }}
            >
              {t('step3.description')}
            </Typography>
          </Box>

          <Box>
            <Typography 
              variant="h5" 
              gutterBottom
              sx={{
                fontSize: { xs: '1.2rem', sm: '1.4rem', md: '1.5rem' }
              }}
            >
              {t('step4.title')}
            </Typography>
            <Typography 
              color="text.secondary"
              sx={{
                fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' }
              }}
            >
              {t('step4.description')}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default Home;