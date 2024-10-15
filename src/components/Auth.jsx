import { useState } from 'react';
import { Container, TextField, Button, Typography } from '@mui/material';
import { signup, login } from '../api'; 
import PropTypes from 'prop-types'; // Import PropTypes

const Auth = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignup, setIsSignup] = useState(false);
  const [error, setError] = useState('');

  const handleAuth = async () => {
    try {
      if (isSignup) {
        const response = await signup(email, password);
        console.log('Signup successful:', response);
        onLogin(); 
      } else {
        const response = await login(email, password);
        console.log('Login successful:', response);
        localStorage.setItem('token', response.access_token); 
        onLogin(); 
      }
    } catch (err) {
      setError('Authentication failed: ' + err.response?.data?.message || err.message);
      console.error('Auth error:', err);
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

// Adding PropTypes validation
Auth.propTypes = {
  onLogin: PropTypes.func.isRequired,
};

export default Auth;
