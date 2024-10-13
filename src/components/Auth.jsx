import { useState } from 'react';
import { Container, TextField, Button, Typography } from '@mui/material';
import PropTypes from 'prop-types'; 

const Auth = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignup, setIsSignup] = useState(false);
  const [error, setError] = useState('');

  const handleAuth = () => {
    const userData = localStorage.getItem('user');

    if (isSignup) {
      if (email && password) {
        localStorage.setItem('user', JSON.stringify({ email, password }));
        onLogin();
      } else {
        setError('Please fill in all fields');
      }
    } else {
      if (userData) {
        const savedUser = JSON.parse(userData);
        if (savedUser.email === email && savedUser.password === password) {
          onLogin();
        } else {
          setError('Invalid email or password');
        }
      } else {
        setError('No user found, please sign up');
      }
    }
  };

  return (
    <Container maxWidth="sm" style={{ textAlign: 'center', marginTop: '50px' }}>
      <Typography variant="h4">{isSignup ? 'Sign Up' : 'Login'}</Typography>
      <TextField
        label="Email"
        variant="outlined"
        fullWidth
        margin="normal"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <TextField
        label="Password"
        type="password"
        variant="outlined"
        fullWidth
        margin="normal"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {error && <Typography color="error">{error}</Typography>}
      <Button
        variant="contained"
        color="primary"
        onClick={handleAuth}
        style={{ marginTop: '20px' }}
      >
        {isSignup ? 'Sign Up' : 'Login'}
      </Button>
      <Button
        onClick={() => setIsSignup(!isSignup)}
        style={{ marginTop: '20px', display: 'block', textDecoration: 'underline' }}
      >
        {isSignup ? 'Already have an account? Login' : "Don't have an account? Sign up"}
      </Button>
    </Container>
  );
};

// Add PropTypes validation
Auth.propTypes = {
  onLogin: PropTypes.func.isRequired,
};

export default Auth;
