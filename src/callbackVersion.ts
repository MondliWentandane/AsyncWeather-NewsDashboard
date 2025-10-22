import { get } from 'https';
import { WeatherData, NewsData, ApiResponse } from './types';
import { displayResults, displayError } from './utils';

const WEATHER_API = 'https://api.open-meteo.com/v1/forecast?latitude=40.7128&longitude=-74.0060&current_weather=true';
const NEWS_API = 'https://dummyjson.com/posts';

// Helper function for HTTPS GET with callbacks
function httpsGet(url: string, callback: (error: string | null, data?: string) => void): void {
  get(url, (response) => {
    let data = '';
    
    response.on('data', (chunk) => {
      data += chunk;
    });
    
    response.on('end', () => {
      if (response.statusCode === 200) {
        callback(null, data);
      } else {
        callback(`HTTP ${response.statusCode}: ${response.statusMessage}`);
      }
    });
    
  }).on('error', (error) => {
    callback(error.message);
  });
}

// Callback hell demonstration - sequential requests
function fetchDataSequential(): void {
  const startTime = Date.now();
  
  console.log('🔄 Starting CALLBACK HELL (sequential requests)...');
  
  // First callback - fetch weather
  httpsGet(WEATHER_API, (weatherError, weatherData) => {
    if (weatherError) {
      displayError(weatherError, 'callback');
      return;
    }
    
    console.log('✅ Weather data received, fetching news...');
    
    // Second callback - fetch news (nested)
    httpsGet(NEWS_API, (newsError, newsData) => {
      if (newsError) {
        displayError(newsError, 'callback');
        return;
      }
      
      console.log('✅ News data received, processing...');
      
      try {
        const weather: WeatherData = JSON.parse(weatherData!);
        const news: NewsData = JSON.parse(newsData!);
        const executionTime = Date.now() - startTime;
        
        displayResults(weather, news, 'callback hell', executionTime);
        
        // Demonstrate even deeper nesting
        console.log('🔄 Starting dependent operation...');
        setTimeout(() => {
          console.log('✅ Dependent operation completed after news!');
        }, 1000);
        
      } catch (parseError) {
        displayError('Failed to parse API response', 'callback');
      }
    });
  });
}

// Parallel requests with callback counting
function fetchDataParallel(): void {
  const startTime = Date.now();
  let completed = 0;
  let weather: WeatherData | null = null;
  let news: NewsData | null = null;
  
  console.log('🔄 Starting PARALLEL CALLBACKS...');
  
  function checkCompletion(): void {
    completed++;
    if (completed === 2 && weather && news) {
      const executionTime = Date.now() - startTime;
      displayResults(weather, news, 'parallel callbacks', executionTime);
    }
  }
  
  // Fetch weather
  httpsGet(WEATHER_API, (weatherError, weatherData) => {
    if (weatherError) {
      displayError(weatherError, 'callback');
      return;
    }
    
    console.log('✅ Weather data received (parallel)');
    weather = JSON.parse(weatherData!);
    checkCompletion();
  });
  
  // Fetch news
  httpsGet(NEWS_API, (newsError, newsData) => {
    if (newsError) {
      displayError(newsError, 'callback');
      return;
    }
    
    console.log('✅ News data received (parallel)');
    news = JSON.parse(newsData!);
    checkCompletion();
  });
}

// Run both examples
console.log('🎯 DEMONSTRATING CALLBACK-BASED ASYNC PROGRAMMING\n');

// Run sequential (callback hell)
setTimeout(() => {
  fetchDataSequential();
}, 1000);

// Run parallel after a delay
setTimeout(() => {
  fetchDataParallel();
}, 5000);