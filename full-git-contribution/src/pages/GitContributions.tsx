import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Grid, Typography, Container, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import CalendarHeatmap, { TooltipDataAttrs } from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { fetchGithubContributions } from '../services/githubService';
import { fetchGitlabContributions } from '../services/gitlabService';
import { BaseUser, User, ContributionDay } from '../types';
import { UrlService } from '../services/urlService';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ShareModal from '../components/ShareModal';

interface DisplayUser extends User {
  firstName: string;
  lastName: string;
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
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isReadOnly, setIsReadOnly] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [readOnlyUrl, setReadOnlyUrl] = useState('');
  const navigate = useNavigate();

  const { users: urlUsers } = useParams();

  const handleAddUser = () => {
    if (newUsername.trim()) {
      const newUser: DisplayUser = {
        id: nextId,
        platform: selectedPlatform,
        username: newUsername.trim(),
        token: newToken.trim() || undefined,
        firstName,
        lastName
      };

      const updatedUsers = [...users, newUser];
      setUsers(updatedUsers);
      setDisplayUsers(prev => [...prev, newUser]);
      setNextId(nextId + 1);
      setNewUsername('');
      setNewToken('');
      
      const newUrl = UrlService.updateURL(updatedUsers, firstName, lastName);
      navigate(newUrl, { replace: true });
    }
  };

  const handleUserInfoChange = (newFirstName: string, newLastName: string) => {
    setFirstName(newFirstName);
    setLastName(newLastName);
    setDisplayUsers(prev => prev.map(user => ({
      ...user,
      firstName: newFirstName,
      lastName: newLastName
    })));
    const newUrl = UrlService.updateURL(users, newFirstName, newLastName);
    navigate(newUrl, { replace: true });
  };

  useEffect(() => {
    const { users: parsedUsers, firstName: parsedFirstName, lastName: parsedLastName, readonly } = 
      UrlService.parseUrlUsers(urlUsers);
    
    if (parsedUsers.length > 0) {
      setUsers(parsedUsers);
      setDisplayUsers(parsedUsers.map(user => ({
        ...user,
        firstName: parsedFirstName,
        lastName: parsedLastName
      })));
      setFirstName(parsedFirstName);
      setLastName(parsedLastName);
      setNextId(parsedUsers.length + 1);
      setIsReadOnly(readonly);
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

  const handleRemoveUser = (index: number) => {
    const updatedUsers = users.filter((_, i) => i !== index);
    const updatedDisplayUsers = displayUsers.filter((_, i) => i !== index);
    
    setUsers(updatedUsers);
    setDisplayUsers(updatedDisplayUsers);

    if (updatedUsers.length === 0) {
      // Si plus d'utilisateurs, redirection vers la page de base
      navigate('/contributions');
    } else {
      // Mise à jour de l'URL avec les utilisateurs restants
      const newUrl = UrlService.updateURL(updatedUsers, firstName, lastName);
      navigate(newUrl, { replace: true });
    }
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

  const handleCopyReadOnlyLink = () => {
    const readOnlyUrl = UrlService.getReadOnlyUrl(users, firstName, lastName);
    navigator.clipboard.writeText(readOnlyUrl);
  };

  const handleShareClick = () => {
    const url = UrlService.getReadOnlyUrl(users, firstName, lastName);
    setReadOnlyUrl(url);
    setShareModalOpen(true);
  };

  const theme = {
    typography: {
      fontFamily: 'Montserrat, sans-serif',
    }
  };

  return (
    <>
      <Header 
        displayUsers={displayUsers}
        onUserInfoChange={handleUserInfoChange}
        firstName={firstName}
        lastName={lastName}
        readonly={isReadOnly}
        onCopyReadOnlyLink={handleCopyReadOnlyLink}
      />
      <Container maxWidth="lg" sx={{ mt: 4, fontFamily: 'Montserrat, sans-serif' }}>
        <Box sx={{ py: 4 }}>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'flex-end',
            width: '100%',
            mt: 4
          }}>
            {!isReadOnly && (
              <Button
                variant="outlined"
                size="small"
                onClick={handleShareClick}
                startIcon={<ContentCopyIcon />}
                sx={{
                  marginLeft: 'auto'
                }}
              >
                Partager
              </Button>
            )}
          </Box>

          <Typography variant="h4" gutterBottom>
            {isReadOnly 
              ? `CONTRIBUTIONS DE : ${firstName} ${lastName}`
              : 'VOS COMPTES'
            }
          </Typography>

          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: 2,
            mb: 4,
            mt: 4,
            transition: 'all 0.3s ease'
          }}>
            {displayUsers.map((user, index) => (
              <Box key={index} sx={{ 
                display: 'flex', 
                justifyContent: 'center',
                alignItems: 'center', 
                gap: 2,
                mt: 1,
                mb: 1
              }}>
                {isReadOnly ? (
                  <Typography variant="h5">
                    {user.platform === 'github' ? (
                      <a 
                        href={`https://github.com/${user.username}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ 
                          color: '#24292e',
                          textDecoration: 'none',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          fontSize: '1.5rem',
                          padding: '12px 24px',
                          borderRadius: '8px',
                          transition: 'all 0.2s ease',
                          backgroundColor: '#f6f8fa',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                          minWidth: '300px',
                          justifyContent: 'center'
                        }}
                      >
                        <img 
                          src="https://github.com/favicon.ico" 
                          alt="GitHub" 
                          style={{ width: '24px', height: '24px' }}
                        />
                        {user.username}
                      </a>
                    ) : (
                      <a 
                        href={`https://gitlab.com/${user.username}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ 
                          color: '#fc6d26',
                          textDecoration: 'none',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          fontSize: '1.5rem',
                          padding: '12px 24px',
                          borderRadius: '8px',
                          transition: 'all 0.2s ease',
                          backgroundColor: '#fdf4f1',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                          minWidth: '300px',
                          justifyContent: 'center'
                        }}
                      >
                        <img 
                          src="https://gitlab.com/favicon.ico" 
                          alt="GitLab" 
                          style={{ width: '24px', height: '24px' }}
                        />
                        {user.username}
                      </a>
                    )}
                  </Typography>
                ) : (
                  <>
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
                  </>
                )}

                {!isReadOnly && (
                  <Button 
                    size="small" 
                    color="error" 
                    onClick={() => handleRemoveUser(index)}
                  >
                    Supprimer
                  </Button>
                )}
              </Box>
            ))}

            {!isReadOnly && showAddForm && (
              <Box sx={{ 
                display: 'flex', 
                gap: 2, 
                alignItems: 'center',
                justifyContent: 'center',
                mt: 4,
                mb: 2
              }}>
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
                  label="Token (read-only profile)"
                  size="small"
                  type="password"
                />

                <Button
                  variant="contained"
                  onClick={handleAddUser}
                  size="small"
                >
                  Ajouter
                </Button>
              </Box>
            )}

            {!isReadOnly && !showAddForm && (
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
          <Box sx={{ mt: 12, mb: 4 }}>
            <Typography variant="h5" sx={{ mb: 3, color: '#000' }}>
              PARTICIPATION GLOBALE DE L'ANNÉE PASSÉE
            </Typography>
            {isLoading ? (
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                height: '250px',
                backgroundColor: 'rgba(0, 0, 0, 0.04)',
                borderRadius: 1
              }}>
                <Typography variant="body1" color="text.secondary">
                  Chargement des contributions...
                </Typography>
              </Box>
            ) : (
              <Box sx={{ 
                width: '100%',
                '& .react-calendar-heatmap': {
                  width: '100%',
                  height: '250px'
                },
                '& .react-calendar-heatmap-small-rect': {
                  width: '14px',
                  height: '14px'
                },
                '& .color-scale-1.github': { fill: '#9be9a8' },
                '& .color-scale-2.github': { fill: '#40c463' },
                '& .color-scale-3.github': { fill: '#30a14e' },
                '& .color-scale-4.github': { fill: '#216e39' },
                '& .color-scale-1.gitlab': { fill: '#ffead7' },
                '& .color-scale-2.gitlab': { fill: '#ffc591' },
                '& .color-scale-3.gitlab': { fill: '#ff9d4d' },
                '& .color-scale-4.gitlab': { fill: '#ff7400' },
                '& .color-empty': { fill: '#ebedf0' }
              }}>
                <CalendarHeatmap
                  startDate={getOneYearAgo()}
                  endDate={new Date()}
                  values={users.flatMap(user => contributions[`${user.platform}-${user.username}`] || [])}
                  classForValue={value => {
                    if (!value) return 'color-empty';
                    const user = users.find(u => 
                      contributions[`${u.platform}-${u.username}`]?.some(c => 
                        c.date === value.date && c.count === value.count
                      )
                    );
                    const colorScale = getColorScale(value.count);
                    return `${colorScale} ${user?.platform || 'github'}`;
                  }}
                  titleForValue={value => value ? `${value.count} contributions le ${new Date(value.date).toLocaleDateString('fr-FR')}` : 'Pas de contributions'}
                  showWeekdayLabels={true}
                  gutterSize={4}
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
                backgroundColor: 'transparent',
                display: 'flex',
                alignItems: 'center',
                gap: 2
              }}
            >
              <Typography variant="h6" sx={{ color: '#666', whiteSpace: 'nowrap' }}>
                Calendriers détaillés par utilisateur
              </Typography>
              <Box sx={{ 
                flex: 1,
                height: '1px',
                backgroundColor: '#666'
              }} />
              <Box sx={{ 
                transform: showDetails ? 'rotate(180deg)' : 'none',
                transition: 'transform 0.3s',
                color: '#666',
                display: 'flex',
                alignItems: 'center'
              }}>
                ▼
              </Box>
            </Button>

            <Box sx={{ display: showDetails ? 'block' : 'none' }}>
              <Grid container spacing={3}>
                {displayUsers.map((user, index) => (
                  <Grid item xs={12} key={`${user.platform}-${user.username}-${index}`}>
                    <Box sx={{ 
                      p: 2, 
                      borderRadius: 1,
                      '& .react-calendar-heatmap': {
                        width: '100%',
                        height: '200px'
                      },
                      '& .react-calendar-heatmap-small-rect': {
                        width: '10px',
                        height: '10px'
                      }
                    }}>
                      <CalendarHeatmap
                        startDate={getOneYearAgo()}
                        endDate={new Date()}
                        values={contributions[`${user.platform}-${user.username}`] || []}
                        classForValue={(value) => {
                          if (!value || value.count === 0) return 'color-empty';
                          const scale = value.count <= 3 ? 1 : 
                                      value.count <= 6 ? 2 : 
                                      value.count <= 9 ? 3 : 4;
                          return `color-scale-${scale} ${user.platform}`;
                        }}
                        titleForValue={value => value ? `${value.count} contributions le ${new Date(value.date).toLocaleDateString('fr-FR')}` : 'Pas de contributions'}
                        showWeekdayLabels={true}
                        gutterSize={2}
                      />
                      <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'center',
                        mt: 0,
                        mb: 8
                      }}>
                        <a 
                          href={`https://${user.platform}.com/${user.username}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ 
                            color: user.platform === 'github' ? '#24292e' : '#fc6d26',
                            textDecoration: 'none',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            fontSize: '1.5rem',
                            padding: '12px 24px',
                            borderRadius: '8px',
                            transition: 'all 0.2s ease',
                            backgroundColor: user.platform === 'github' ? '#f6f8fa' : '#fdf4f1',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                            minWidth: '300px',
                            justifyContent: 'center'
                          }}
                        >
                          <img 
                            src={`https://${user.platform}.com/favicon.ico`}
                            alt={user.platform} 
                            style={{ width: '24px', height: '24px' }}
                          />
                          {user.username}
                        </a>
                      </Box>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Box>
        </Box>
      </Container>
      <ShareModal 
        open={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        url={readOnlyUrl}
      />
    </>
  );
};

export default GitContributions;