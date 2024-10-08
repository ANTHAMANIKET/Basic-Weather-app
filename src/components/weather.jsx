import { useState, useEffect } from 'react';
import axios from 'axios';
import '../App.css';


function App() {
  const [weather, setWeather] = useState(null);
  const [city, setCity] = useState('Hyderabad');    
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const apiKey = '0b840f291503d7babc7c8bb1e6d7fc87'; 

  const fetchWeather = async (city) => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
      );
      setWeather(response.data);
    } catch (err) {
        console.log(err)
      setError('City not found');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather(city); 
  }, [city]);

  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      fetchWeather(e.target.value);
      setCity(e.target.value);
    }
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <h1>Weather App</h1>
      <input 
        type="text" 
        placeholder="Search city"
        onKeyDown={handleSearch}
      />
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : weather ? (
        <div>
          <h2>{weather.name}</h2>
          <p>{weather.main.temp}°C</p>
          <p>{weather.weather[0].description}</p>
        </div>
      ) : null}
    </div>
  );
}

export default App;
