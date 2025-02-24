import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Grid, Typography, Container, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';
import { useParams } from 'react-router-dom';
import Header from '../components/Header';
import { fetchGithubContributions } from '../services/githubService';
import { fetchGitlabContributions } from '../services/gitlabService';

interface User {
  platform: 'github' | 'gitlab';
  username: string;
  token?: string;
  id: number;
}

interface DisplayUser extends User {
  firstName: string;
  lastName: string;
}

interface ContributionDay {
  date: string;
  count: number;
}

const GitContributions: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [displayUsers, setDisplayUsers] = useState<DisplayUser[]>([]);
  const [nextId, setNextId] = useState(1);
  const [newUsername, setNewUsername] = useState('');
  const [newToken, setNewToken] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState<'github' | 'gitlab'>('github');
  const [contributions, setContributions] = useState<{[key: string]: ContributionDay[]}>({});
  const [expandedUsers, setExpandedUsers] = useState<number[]>([]);
  const [showDetails, setShowDetails] = useState(false);
  const [showAddForm, setShowAddForm] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  const { users: urlUsers } = useParams();

  const encodeUserData = (platform: string, username: string, token?: string) => {
    const data = `${platform}:${username}${token ? ':' + token : ''}`;
    return btoa(data);
  };

  const decodeUserData = (encodedString: string): User => {
    const decodedString = atob(encodedString);
    const [platform, username, token] = decodedString.split(':');
    return {
      id: 0,
      platform: platform as 'github' | 'gitlab',
      username: username || '',
      token
    };
  };

  useEffect(() => {
    if (urlUsers) {
      const parsedUsers = urlUsers.split(',').map((encodedString, index) => {
        const userData = decodeUserData(encodedString);
        return {
          ...userData,
          id: index + 1 // Ajoute un ID unique pour chaque utilisateur
        };
      });
      setUsers(parsedUsers);
      setNextId(parsedUsers.length + 1); // Met à jour le prochain ID disponible
    }
  }, [urlUsers]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const newContributions: {[key: string]: ContributionDay[]} = {};

      for (const user of users) {
        const contributionKey = `${user.platform}-${user.username}`;
        
        if (user.platform === 'github') {
          const userContributions = await fetchGithubContributions(user.username, user.token);
          newContributions[contributionKey] = userContributions;
        } else if (user.platform === 'gitlab') {
          const userContributions = await fetchGitlabContributions(user.username, user.token);
          newContributions[contributionKey] = userContributions;
        }
      }

      setContributions(newContributions);
      setIsLoading(false);
    };

    if (users.length > 0) {
      fetchData();
    }
  }, [users]);

  const handleInputChange = (
    type: 'username' | 'token' | 'platform',
    value: string
  ) => {
    if (type === 'username') setNewUsername(value);
    if (type === 'token') setNewToken(value);
    if (type === 'platform') setSelectedPlatform(value as 'github' | 'gitlab');
  };

  const handleAddUser = () => {
    if (newUsername.trim()) {
      const newUser: User = {
        id: nextId,
        platform: selectedPlatform,
        username: newUsername.trim(),
        token: newToken.trim() || undefined
      };

      setUsers(prevUsers => [...prevUsers, newUser]);
      setNextId(nextId + 1);
      setNewUsername('');
      setNewToken('');
      setShowAddForm(false);
    }
  };

  const handleRemoveUser = (index: number) => {
    setUsers(users.filter((_, i) => i !== index));
  };

  const getColorScale = (count: number) => {
    if (count === 0) return 'color-empty';
    if (count <= 2) return 'color-scale-1';
    if (count <= 5) return 'color-scale-2';
    if (count <= 10) return 'color-scale-3';
    return 'color-scale-4';
  };

  const getOneYearAgo = () => {
    const today = new Date();
    return new Date(today.setFullYear(today.getFullYear() - 1));
  };

  const toggleUserDetails = (index: number) => {
    setExpandedUsers(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  return (
    <>
      <Header displayUsers={displayUsers} />
      <Container maxWidth="lg">
        <Box sx={{ py: 4 }}>
          <Typography variant="h4" gutterBottom>
            Visualisation des Contributions
          </Typography>

          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: 2,
            mb: 4,
            transition: 'all 0.3s ease'
          }}>
            {displayUsers.map((user, index) => (
              <Box key={index} sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <FormControl sx={{ minWidth: 120 }} size="small">
                  <InputLabel>Plateforme</InputLabel>
                  <Select
                    value={user.platform}
                    label="Plateforme"
                    disabled
                  >
                    <MenuItem value={user.platform}>
                      {user.platform === 'github' ? 'GitHub' : 'GitLab'}
                    </MenuItem>
                  </Select>
                </FormControl>

                <TextField
                  value={user.username}
                  label="Nom d'utilisateur"
                  size="small"
                  disabled
                />

                <TextField
                  value={user.token || ''}
                  label="Token"
                  type="password"
                  size="small"
                  disabled
                />

                <Button 
                  size="small" 
                  color="error" 
                  onClick={() => handleRemoveUser(index)}
                >
                  Supprimer
                </Button>
              </Box>
            ))}

            {showAddForm && (
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 3 }}>
                <FormControl sx={{ minWidth: 120 }}>
                  <InputLabel>Plateforme</InputLabel>
                  <Select
                    value={selectedPlatform}
                    label="Plateforme"
                    onChange={(e) => setSelectedPlatform(e.target.value as 'github' | 'gitlab')}
                    size="small"
                  >
                    <MenuItem value="github">GitHub</MenuItem>
                    <MenuItem value="gitlab">GitLab</MenuItem>
                  </Select>
                </FormControl>

                <TextField
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  label="Nom d'utilisateur"
                  size="small"
                />

                <TextField
                  value={newToken}
                  onChange={(e) => setNewToken(e.target.value)}
                  label="Token (optionnel)"
                  type="password"
                  size="small"
                />

                <Button 
                  onClick={handleAddUser}
                  variant="contained"
                  disabled={!newUsername.trim()}
                >
                  Ajouter
                </Button>
              </Box>
            )}

            {!showAddForm && (
              <Button 
                onClick={() => setShowAddForm(true)}
                variant="outlined"
                color="primary"
                sx={{ 
                  alignSelf: 'flex-start',
                  borderStyle: 'dashed',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}
              >
                <Typography variant="h6" component="span">+</Typography>
                Ajouter un compte
              </Button>
            )}
          </Box>

          {/* Calendrier global */}
          <Box sx={{ mb: 4, p: 2, border: '1px solid #ddd', borderRadius: 1 }}>
            <Typography variant="h6" gutterBottom>
              Vue d'ensemble des contributions
            </Typography>
            {isLoading ? (
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                height: '160px',
                backgroundColor: 'rgba(0, 0, 0, 0.04)',
                borderRadius: 1
              }}>
                <Typography variant="body1" color="text.secondary">
                  Chargement des contributions...
                </Typography>
              </Box>
            ) : (
              <Box sx={{ 
                '& .react-calendar-heatmap': {
                  width: '100%',
                  height: '160px'
                },
                '& .react-calendar-heatmap-small-rect': {
                  width: '10px',
                  height: '10px'
                },
                '& .color-scale-1': { fill: '#cce4ff' },
                '& .color-scale-2': { fill: '#99c9ff' },
                '& .color-scale-3': { fill: '#66adff' },
                '& .color-scale-4': { fill: '#3392ff' },
                '& .color-empty': { fill: '#ebedf0' }
              }}>
                <CalendarHeatmap
                  startDate={getOneYearAgo()}
                  endDate={new Date()}
                  values={users.flatMap(user => contributions[`${user.platform}-${user.username}`] || [])}
                  classForValue={value => (!value ? 'color-empty' : getColorScale(value.count))}
                  titleForValue={value => (!value ? 'Pas de contributions' : `${value.count} contributions le ${value.date}`)}
                  showWeekdayLabels={true}
                  gutterSize={2}
                />
              </Box>
            )}
          </Box>

          {/* Section des calendriers détaillés */}
          <Box sx={{ mt: 4 }}>
            <Button 
              onClick={() => setShowDetails(!showDetails)}
              sx={{ 
                width: '100%', 
                justifyContent: 'space-between',
                mb: 2,
                py: 2,
                borderRadius: 1,
                backgroundColor: 'rgba(0, 0, 0, 0.04)'
              }}
            >
              <Typography variant="h6">Calendriers détaillés par utilisateur</Typography>
              <Box sx={{ 
                transform: showDetails ? 'rotate(180deg)' : 'none',
                transition: 'transform 0.3s'
              }}>
                ▼
              </Box>
            </Button>

            <Box sx={{ display: showDetails ? 'block' : 'none' }}>
              <Grid container spacing={3}>
                {displayUsers.map((user, index) => (
                  <Grid item xs={12} key={`${user.platform}-${user.username}-${index}`}>
                    <Box sx={{ p: 2, border: '1px solid #ddd', borderRadius: 1 }}>
                      <Typography variant="h6" gutterBottom>
                        {user.platform === 'github' ? 'GitHub' : 'GitLab'}: {user.username}
                      </Typography>
                      <Box sx={{ 
                        '& .react-calendar-heatmap': {
                          width: '100%',
                          height: '140px'
                        },
                        '& .react-calendar-heatmap-small-rect': {
                          width: '10px',
                          height: '10px'
                        },
                        ...(user.platform === 'github' ? {
                          '& .color-scale-1': { fill: '#ddd' },
                          '& .color-scale-2': { fill: '#aaa' },
                          '& .color-scale-3': { fill: '#666' },
                          '& .color-scale-4': { fill: '#333' },
                        } : {
                          '& .color-scale-1': { fill: '#ffead7' },
                          '& .color-scale-2': { fill: '#ffc591' },
                          '& .color-scale-3': { fill: '#ff9d4d' },
                          '& .color-scale-4': { fill: '#ff7400' },
                        }),
                        '& .color-empty': { fill: '#ebedf0' }
                      }}>
                        <CalendarHeatmap
                          startDate={getOneYearAgo()}
                          endDate={new Date()}
                          values={contributions[`${user.platform}-${user.username}`] || []}
                          classForValue={value => (!value ? 'color-empty' : getColorScale(value.count))}
                          titleForValue={value => (!value ? 'Pas de contributions' : `${value.count} contributions le ${value.date}`)}
                          showWeekdayLabels={true}
                          gutterSize={2}
                        />
                      </Box>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Box>
        </Box>
      </Container>
    </>
  );
};

export default GitContributions;