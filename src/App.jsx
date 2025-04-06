import { useState, useEffect, useRef } from 'react'
import './App.css'
import { getWeather, formatWeatherResponse } from './services/weatherService'
import { getWikiSummary, formatWikiResponse } from './services/wikiService'

function App() {
  const [isListening, setIsListening] = useState(false);
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState('');
  const recognition = useRef(null);
  const synth = useRef(window.speechSynthesis);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Initialize speech recognition
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognition.current = new SpeechRecognition();
      recognition.current.continuous = false;
      recognition.current.interimResults = false;
      recognition.current.lang = 'en-US';

      recognition.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        addMessage('user', transcript);
        processCommand(transcript);
      };

      recognition.current.onerror = (event) => {
        setError(`Speech recognition error: ${event.error}`);
        setIsListening(false);
      };

      recognition.current.onend = () => {
        setIsListening(false);
      };
    } else {
      setError('Speech recognition not supported in your browser.');
    }

    return () => {
      if (recognition.current) {
        recognition.current.abort();
      }
      if (synth.current) {
        synth.current.cancel();
      }
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const toggleListening = () => {
    if (isListening) {
      recognition.current.stop();
    } else {
      setError('');
      recognition.current.start();
      setIsListening(true);
    }
  };

  const addMessage = (sender, text) => {
    setMessages(prev => [...prev, { sender, text, time: new Date() }]);
  };

  const speak = (text) => {
    if (synth.current) {
      synth.current.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      synth.current.speak(utterance);
    }
  };

  const processCommand = async (command) => {
    const lowerCommand = command.toLowerCase();
    
    try {
      // Greeting
      if (lowerCommand.includes('hello') || lowerCommand.includes('hi ') || lowerCommand === 'hi') {
        const response = "Hello! How can I help you today?";
        addMessage('assistant', response);
        speak(response);
      }
      // Time
      else if (lowerCommand.includes('time')) {
        const now = new Date();
        const response = `The current time is ${now.toLocaleTimeString()}.`;
        addMessage('assistant', response);
        speak(response);
      }
      // Date
      else if (lowerCommand.includes('date') || lowerCommand.includes('day')) {
        const now = new Date();
        const response = `Today is ${now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}.`;
        addMessage('assistant', response);
        speak(response);
      }
      // Weather
      else if (lowerCommand.includes('weather')) {
        // Extract location (default to "London" if not specified)
        let location = "London";
        const locationMatch = command.match(/weather\s+in\s+([a-zA-Z\s]+)/i);
        if (locationMatch && locationMatch[1]) {
          location = locationMatch[1];
        }
        
        addMessage('assistant', `Checking weather for ${location}...`);
        
        try {
          const weatherData = await getWeather(location);
          const response = formatWeatherResponse(weatherData);
          addMessage('assistant', response);
          speak(response);
        } catch (err) {
          const errorMsg = `Sorry, I couldn't get the weather for ${location}.`;
          addMessage('assistant', errorMsg);
          speak(errorMsg);
        }
      }
      // Wikipedia info
      else if (lowerCommand.includes('who is') || lowerCommand.includes('what is') || lowerCommand.includes('tell me about')) {
        const query = lowerCommand.replace(/who is|what is|tell me about/g, '').trim();
        
        if (query) {
          addMessage('assistant', `Looking up information about "${query}"...`);
          
          try {
            const wikiData = await getWikiSummary(query);
            const response = formatWikiResponse(wikiData);
            addMessage('assistant', response);
            speak(response);
          } catch (err) {
            const errorMsg = `Sorry, I couldn't find information about ${query}.`;
            addMessage('assistant', errorMsg);
            speak(errorMsg);
          }
        } else {
          const response = "I'm not sure what you're asking about. Could you please be more specific?";
          addMessage('assistant', response);
          speak(response);
        }
      }
      // Help
      else if (lowerCommand.includes('help') || lowerCommand.includes('what can you do')) {
        const response = "I can tell you the time, date, weather, and answer general knowledge questions. Try asking me about the weather, time, or ask me to look up information.";
        addMessage('assistant', response);
        speak(response);
      }
      // Default response
      else {
        const response = "I'm not sure how to respond to that. Try asking me about the weather, time, or for general information.";
        addMessage('assistant', response);
        speak(response);
      }
    } catch (error) {
      console.error('Error processing command:', error);
      const response = "I encountered an error processing your request. Please try again.";
      addMessage('assistant', response);
      speak(response);
    }
  };

  return (
    <div className="app-container">
      <header>
        <h1>Voice Assistant</h1>
      </header>
      
      <main>
        <div className="messages-container">
          {messages.length === 0 ? (
            <div className="empty-state">
              <p>Tap the microphone and start speaking</p>
            </div>
          ) : (
            messages.map((message, index) => (
              <div 
                key={index} 
                className={`message ${message.sender === 'user' ? 'user-message' : 'assistant-message'}`}
              >
                <div className="message-content">
                  <span className="message-text">{message.text}</span>
                  <span className="message-time">
                    {message.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
      </main>

      <footer>
        {error && <div className="error-message">{error}</div>}
        <button 
          className={`mic-button ${isListening ? 'listening' : ''}`} 
          onClick={toggleListening}
          aria-label={isListening ? 'Stop listening' : 'Start listening'}
        >
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
            <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
          </svg>
        </button>
      </footer>
    </div>
  );
}

export default App
