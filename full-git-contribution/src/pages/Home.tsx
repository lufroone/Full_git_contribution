import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography, Button, Container, IconButton } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import LogoAnimation from '../components/LogoAnimation';

const Home: React.FC = () => {
  const [showTutorial, setShowTutorial] = useState(false);

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
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          gap: 4,
          transition: 'transform 0.5s ease-in-out',
          transform: showTutorial ? 'translateY(-100vh)' : 'translateY(0)',
        }}
      >
        <LogoAnimation />
        
        <Typography variant="h2" component="h1" gutterBottom>
          All Git Contributions
        </Typography>
        
        <Typography variant="h5" component="h2" color="text.secondary" gutterBottom>
          Visualisez toutes vos contributions au même endroit de tous vos comptes de versionning au même endroit
        </Typography>

        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Un outil simple pour montrer votre investissement et votre participation
        </Typography>

        <Button 
          component={Link} 
          to="/contributions" 
          variant="contained" 
          size="large"
          sx={{ fontSize: '1.2rem', padding: '12px 32px' }}
        >
          Créez votre profil
        </Button>

        <IconButton 
          onClick={handleScroll}
          sx={{ 
            position: 'absolute',
            bottom: 20,
            animation: 'bounce 1s infinite',
            '@keyframes bounce': {
              '0%, 100%': { transform: 'translateY(0)' },
              '50%': { transform: 'translateY(10px)' }
            }
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
          gap: 4,
          position: 'absolute',
          top: '100vh',
          left: 0,
          right: 0,
          transition: 'transform 0.5s ease-in-out',
          transform: showTutorial ? 'translateY(-100vh)' : 'translateY(0)',
          padding: '0 32px'
        }}
      >
        <IconButton 
          onClick={handleScroll}
          sx={{ 
            position: 'absolute',
            top: 20,
            left: '50%',
            transform: 'translateX(-50%)'
          }}
        >
          <KeyboardArrowUpIcon fontSize="large" />
        </IconButton>

        <Typography variant="h3" component="h2" gutterBottom>
          Comment ça marche ?
        </Typography>

        <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
          Nous ne sauvegardons aucune donnée, toutes les informations de votre profil sont contenues dans votre URL de profil uniquement. De plus, le site ne permet pas la lecture de gitlab privé fermé à internet.
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4, maxWidth: '800px' }}>
          <Box>
            <Typography variant="h5" gutterBottom>
              1. Créez votre profil
            </Typography>
            <Typography color="text.secondary">
              Cliquez sur le bouton, Créez votre profil et renseignez votre nom et prénom
            </Typography>
          </Box>

          <Box>
            <Typography variant="h5" gutterBottom>
              2. Ajoutez vos comptes
            </Typography>
            <Typography color="text.secondary">
              Connectez vos comptes GitHub et GitLab en utilisant vos identifiants et vos tokens d'accès personnels, avec uniquement les permissions read_user (gitlab) ou read:user (dans la catégorie user de github), aucune information n'est stocké sur le site donc à la date d'expiration du token il faudra le changer sur votre profil.
            </Typography>
          </Box>

          <Box>
            <Typography variant="h5" gutterBottom>
              3. Visualisez vos contributions
            </Typography>
            <Typography color="text.secondary">
              Observez toutes vos contributions sur un seul et même calendrier
            </Typography>
          </Box>

          <Box>
            <Typography variant="h5" gutterBottom>
              4. Partagez votre profil
            </Typography>
            <Typography color="text.secondary">
              Partagez votre profil avec vos collègues et vos clients pour montrer votre investissement et votre participation
            </Typography>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default Home;