import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import '../App.css';
import { Container, TextField, Typography, Card, CardContent, CircularProgress, Grid } from '@mui/material';

function App() {
  const [weather, setWeather] = useState(null);
  const [city, setCity] = useState('');    
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchHistory, setSearchHistory] = useState([]);
  const apiKey = import.meta.env.VITE_WEATHER_API_KEY;

  // Memoize fetchWeather to avoid unnecessary re-renders
  const fetchWeather = useCallback(async (city) => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
      );
      setWeather(response.data);

      setSearchHistory((prevHistory) =>
        prevHistory.some((item) => item.name === response.data.name)
          ? prevHistory
          : [...prevHistory, response.data]
      );
    } catch (err) {
      console.log(err);
      setError('City not found');
    } finally {
      setLoading(false);
    }
  }, [apiKey]);

  useEffect(() => {
    if (city) {
      fetchWeather(city); 
    }
  }, [city, fetchWeather]);

  const handleSearch = (e) => {
    if (e.key === 'Enter' && e.target.value.trim()) {
      fetchWeather(e.target.value.trim());
      setCity(e.target.value.trim());
    }
  };

  return (
    <Container maxWidth='sm' style={{ textAlign: 'center', marginTop: '50px' }}>
      <Typography variant='h3' gutterBottom>
        Weather App
      </Typography>
      <TextField 
        variant='outlined'
        label='Search Your city'
        onKeyDown={handleSearch}
        fullWidth 
        style={{ marginBottom: '20px' }}
      />

      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : weather ? (
        <Card>
          <CardContent>
            <Typography variant="h5">{weather.name}</Typography>
            <Typography variant="h6">{weather.main.temp}°C</Typography>
            <Typography variant="body1">{weather.weather[0].description}</Typography>
          </CardContent>
        </Card>
      ) : null}

      <Typography variant='h4' style={{ marginTop: '30px' }}>
        Search History
      </Typography>

      <Grid container spacing={2} style={{ marginTop: '20px' }}>
        {searchHistory.map((item, index) => (
          <Grid item xs={12} sm={6} key={index}>
            <Card>
              <CardContent>
                <Typography variant="h6">{item.name}</Typography>
                <Typography>{item.main.temp}°C</Typography>
                <Typography>{item.weather[0].description}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default App;
