import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import '../App.css'; 
import { Container, TextField, Typography, Card, CardContent, CircularProgress, Grid, IconButton, Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import Auth from './Auth'; 

function App() {
  const [weather, setWeather] = useState(null);
  const [city, setCity] = useState('');    
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchHistory, setSearchHistory] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(4);  
  const apiKey = import.meta.env.VITE_WEATHER_API_KEY;
  const [isLoggedIn, setIsLoggedIn] = useState(false); 

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

  const handleDelete = (index) => {
    setSearchHistory((prevHistory) => prevHistory.filter((_, i) => i !== index));
  };

  const handleLogout = () => {
    setIsLoggedIn(false); 
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = searchHistory.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(searchHistory.length / itemsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  return (
    <Container maxWidth='sm' style={{ textAlign: 'center', marginTop: '50px' }}>
      {!isLoggedIn ? ( 
        <Auth onLogin={() => setIsLoggedIn(true)} />
      ) : (
        <>
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
            {currentItems.map((item, index) => (
              <Grid item xs={12} sm={6} key={index}>
                <Card>
                  <CardContent>
                    <Typography variant="h6">{item.name}</Typography>
                    <Typography>{item.main.temp}°C</Typography>
                    <Typography>{item.weather[0].description}</Typography>
                    <IconButton onClick={() => handleDelete(index)} aria-label="delete">
                      <DeleteIcon />
                    </IconButton>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Pagination Controls */}
          <div style={{ marginTop: '20px' }}>
            <Button
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              sx={{
                backgroundColor: '#0072ff',
                color: '#fff',
                padding: '10px 20px',
                borderRadius: '25px',
                '&:hover': { backgroundColor: '#0056cc' },
                '&:disabled': { backgroundColor: '#b0c4de' },
                marginRight: '10px',
              }}
            >
              Previous
            </Button>
            <Typography variant="body1" component="span" style={{ margin: '0 10px' }}>
              Page {currentPage} of {totalPages}
            </Typography>
            <Button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              sx={{
                backgroundColor: '#0072ff',
                color: '#fff',
                padding: '10px 20px',
                borderRadius: '25px',
                '&:hover': { backgroundColor: '#0056cc' },
                '&:disabled': { backgroundColor: '#b0c4de' },
              }}
            >
              Next
            </Button>
          </div>
          <Button variant="contained" color="secondary" onClick={handleLogout} style={{ marginTop: '20px' }}>
            Logout
          </Button>
        </>
      )}
    </Container>
  );
}

export default App;
