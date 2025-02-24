import React from 'react';
import { AppBar, Toolbar, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

interface User {
  platform: 'github' | 'gitlab';
  username: string;
  token?: string;
  id: number;
  firstName: string;
  lastName: string;
}

interface DisplayUser extends User {
  firstName: string;
  lastName: string;
}

interface HeaderProps {
  displayUsers: DisplayUser[];
}

const Header: React.FC<HeaderProps> = ({ displayUsers }) => {
  const navigate = useNavigate();

  const generateShareableUrl = () => {
    const userParams = displayUsers.map(user => 
      btoa(`${user.platform}:${user.username}${user.token ? ':' + user.token : ''}`)
    ).join(',');
    return `/contributions/${userParams}`;
  };

  React.useEffect(() => {
    if (displayUsers.length > 0) {
      navigate(generateShareableUrl(), { replace: true });
    }
  }, [displayUsers]);

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Git Contributions
        </Typography>
        {displayUsers.length > 0 && (
          <Box sx={{ display: 'flex', gap: 2 }}>
            {displayUsers.map((user, index) => (
              <Typography key={index} variant="body1">
                {user.firstName} {user.lastName}
              </Typography>
            ))}
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;