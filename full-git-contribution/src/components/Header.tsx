import React, { useState, useEffect } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Box, 
  TextField,
  Button
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { User } from '../types';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

interface HeaderProps {
  displayUsers: User[];
  onUserInfoChange: (firstName: string, lastName: string) => void;
  firstName: string;
  lastName: string;
  readonly: boolean;
  onCopyReadOnlyLink?: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
  displayUsers, 
  onUserInfoChange, 
  firstName, 
  lastName, 
  readonly,
  onCopyReadOnlyLink 
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const updateUrlWithUserInfo = (newFirstName: string, newLastName: string) => {
    if (displayUsers.length > 0) {
      const userParams = displayUsers.map(user => 
        btoa(`${user.platform}:${user.username}:${newFirstName}:${newLastName}${user.token ? ':' + user.token : ''}`)
      ).join(',');
      navigate(`/contributions/${userParams}`, { replace: true });
    }
  };

  const handleFirstNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUserInfoChange(e.target.value, lastName);
    updateUrlWithUserInfo(e.target.value, lastName);
  };

  const handleLastNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUserInfoChange(firstName, e.target.value);
    updateUrlWithUserInfo(firstName, e.target.value);
  };

  return (
    <AppBar position="static" sx={{ 
      backgroundColor: 'white', 
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Typography 
          variant="h6" 
          component="div" 
          sx={{ 
            color: '#333',
            fontWeight: 600,
            fontSize: '1.5rem'
          }}
        >
          Git Contributions
        </Typography>

        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 2 
        }}>
          {readonly ? (
            <>
              <Typography 
                variant="h6" 
                sx={{ 
                  color: '#333',
                  fontSize: '1.2rem',
                  fontWeight: 500
                }}
              >
                {firstName} {lastName}
              </Typography>
            </>
          ) : (
            <>
              <TextField
                size="small"
                label="Prénom"
                value={firstName}
                onChange={handleFirstNameChange}
                sx={{ backgroundColor: '#f5f5f5', borderRadius: '4px' }}
              />
              <TextField
                size="small"
                label="Nom"
                value={lastName}
                onChange={handleLastNameChange}
                sx={{ backgroundColor: '#f5f5f5', borderRadius: '4px' }}
              />
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;