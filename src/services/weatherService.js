import axios from 'axios';

// Replace with your OpenWeatherMap API key
const API_KEY = 'YOUR_OPENWEATHERMAP_API_KEY';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

export const getWeather = async (location) => {
  try {
    // This is a mock implementation
    // In a real app, you would use:
    // const response = await axios.get(`${BASE_URL}/weather?q=${location}&units=metric&appid=${API_KEY}`);
    // return response.data;
    
    // Mock response for demo purposes
    return {
      name: location,
      main: {
        temp: 22,
        feels_like: 23,
        humidity: 65
      },
      weather: [
        {
          main: 'Clouds',
          description: 'partly cloudy'
        }
      ]
    };
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw new Error('Failed to fetch weather data');
  }
};

export const formatWeatherResponse = (data) => {
  return `The weather in ${data.name} is currently ${data.main.temp}°C and ${data.weather[0].description}. 
          The humidity is ${data.main.humidity}% and it feels like ${data.main.feels_like}°C.`;
}; 