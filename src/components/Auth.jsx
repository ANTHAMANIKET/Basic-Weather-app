import { useState } from 'react';
import { Container, TextField, Button, Typography } from '@mui/material';
import PropTypes from 'prop-types'; 

// Function to generate SHA-256 hash
const hashPassword = async (password) => {
  const msgBuffer = new TextEncoder().encode(password); 
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer); 
  const hashArray = Array.from(new Uint8Array(hashBuffer)); 
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join(''); 
  return hashHex; // Return the hashed password
};

const Auth = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignup, setIsSignup] = useState(false);
  const [error, setError] = useState('');

  const handleAuth = async () => {
    const userData = localStorage.getItem('user');

    if (isSignup) {
      if (email && password) {
        const hashedPassword = await hashPassword(password); // Hash the password
        localStorage.setItem('user', JSON.stringify({ email, password: hashedPassword })); // Save hashed password
        onLogin();
      } else {
        setError('Please fill in all fields');
      }
    } else {
      if (userData) {
        const savedUser = JSON.parse(userData);
        const hashedPassword = await hashPassword(password); // Hash the input password
        if (savedUser.email === email && savedUser.password === hashedPassword) {
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

// Adding PropTypes validation
Auth.propTypes = {
  onLogin: PropTypes.func.isRequired,
};

export default Auth;
