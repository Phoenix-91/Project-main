# Voice Assistant Web App

An interactive voice assistant web application built with Vite and React that allows users to interact using voice commands. The app uses the Web Speech API for speech recognition and synthesis to create a hands-free experience.

## Features

- Voice recognition using Web Speech API
- Text-to-speech responses
- Real-time weather updates (mock implementation)
- Wikipedia knowledge queries (mock implementation)
- Responsive design that works on both desktop and mobile

## Commands

The voice assistant can respond to various commands, including:

- Greetings: "Hello", "Hi"
- Time: "What's the time?"
- Date: "What's today's date?"
- Weather: "What's the weather in London?"
- Knowledge: "Who is Albert Einstein?", "What is React?"
- Help: "Help", "What can you do?"

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

## Setup

1. Clone the repository:
   ```
   git clone <repository-url>
   cd voice-assistant
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm run dev
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:5173
   ```

## API Integration

The app is designed to work with:

- OpenWeatherMap API for weather data
- Wikipedia API for knowledge queries

Currently, the app uses mock implementations. To connect to real APIs:

1. Get an API key from [OpenWeatherMap](https://openweathermap.org/api)
2. Update the API_KEY constant in `src/services/weatherService.js`
3. Uncomment the actual API calls in the service files

## Browser Compatibility

This app requires browser support for the Web Speech API. Currently supported in:

- Chrome (desktop and Android)
- Edge
- Safari (with limited functionality)
- Firefox (with limited functionality)

## License

MIT
