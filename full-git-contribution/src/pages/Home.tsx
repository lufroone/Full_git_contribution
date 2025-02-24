import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography, Button, Container } from '@mui/material';

const Home: React.FC = () => {
  return (
    <Container maxWidth="md">
      <Box 
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          gap: 4
        }}
      >
        <Typography variant="h2" component="h1" gutterBottom>
          Git Contributions Viewer
        </Typography>
        
        <Typography variant="h5" component="h2" color="text.secondary" gutterBottom>
          Visualisez les contributions GitHub et GitLab de plusieurs utilisateurs en un seul endroit
        </Typography>

        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Un outil simple et efficace pour suivre l'activité de développement sur différentes plateformes Git
        </Typography>

        <Button 
          component={Link} 
          to="/contributions" 
          variant="contained" 
          size="large"
          sx={{ fontSize: '1.2rem', padding: '12px 32px' }}
        >
          Voir les Contributions
        </Button>
      </Box>
    </Container>
  );
};

export default Home;