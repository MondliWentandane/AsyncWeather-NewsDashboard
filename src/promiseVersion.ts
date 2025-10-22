import { get } from 'https';
import { WeatherData, NewsData, ApiResponse } from './types';
import { displayResults, displayError } from './utils';

const WEATHER_API = 'https://api.open-meteo.com/v1/forecast?latitude=40.7128&longitude=-74.0060&current_weather=true';
const NEWS_API = 'https://dummyjson.com/posts';

// Helper function to wrap HTTPS GET in a Promise
function httpsGetPromise(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    get(url, (response) => {
      let data = '';
      
      response.on('data', (chunk) => {
        data += chunk;
      });
      
      response.on('end', () => {
        if (response.statusCode === 200) {
          resolve(data);
        } else {
          reject(new Error(`HTTP ${response.statusCode}: ${response.statusMessage}`));
        }
      });
      
    }).on('error', (error) => {
      reject(error);
    });
  });
}

// Promise chain - sequential execution
function fetchWithPromiseChain(): void {
  const startTime = Date.now();
  
  console.log('🔄 Starting PROMISE CHAIN (sequential)...');
  
  httpsGetPromise(WEATHER_API)
    .then(weatherData => {
      console.log('✅ Weather data received, fetching news...');
      const weather: WeatherData = JSON.parse(weatherData);
      return Promise.all([weather, httpsGetPromise(NEWS_API)]);
    })
    .then(([weather, newsData]) => {
      console.log('✅ News data received, processing...');
      const news: NewsData = JSON.parse(newsData);
      const executionTime = Date.now() - startTime;
      
      displayResults(weather, news, 'promise chain', executionTime);
      
      // Chain another operation
      return new Promise(resolve => setTimeout(resolve, 1000));
    })
    .then(() => {
      console.log('✅ Chained operation completed!');
    })
    .catch(error => {
      displayError(error.message, 'promise chain');
    });
}

// Promise.all - parallel execution
function fetchWithPromiseAll(): void {
  const startTime = Date.now();
  
  console.log('🔄 Starting PROMISE.ALL (parallel)...');
  
  Promise.all([
    httpsGetPromise(WEATHER_API),
    httpsGetPromise(NEWS_API)
  ])
    .then(([weatherData, newsData]) => {
      console.log('✅ Both requests completed!');
      const weather: WeatherData = JSON.parse(weatherData);
      const news: NewsData = JSON.parse(newsData);
      const executionTime = Date.now() - startTime;
      
      displayResults(weather, news, 'promise.all', executionTime);
    })
    .catch(error => {
      displayError(error.message, 'promise.all');
    });
}

// Promise.race - get fastest response
function fetchWithPromiseRace(): void {
  const startTime = Date.now();
  
  console.log('🔄 Starting PROMISE.RACE (fastest wins)...');
  
  Promise.race([
    httpsGetPromise(WEATHER_API).then(data => ({ type: 'weather', data })),
    httpsGetPromise(NEWS_API).then(data => ({ type: 'news', data }))
  ])
    .then(winner => {
      const executionTime = Date.now() - startTime;
      console.log(`\n🎉 ${winner.type.toUpperCase()} won the race!`);
      console.log(`⏱️  Time: ${executionTime}ms`);
      
      if (winner.type === 'weather') {
        const weather: WeatherData = JSON.parse(winner.data);
        console.log(`🌡️  Temperature: ${weather.current_weather.temperature}°C`);
      } else {
        const news: NewsData = JSON.parse(winner.data);
        console.log(`📰 First news title: ${news.posts[0].title}`);
      }
    })
    .catch(error => {
      displayError(error.message, 'promise.race');
    });
}

// Run all promise examples
console.log('🎯 DEMONSTRATING PROMISE-BASED ASYNC PROGRAMMING\n');

// Run promise chain
setTimeout(() => {
  fetchWithPromiseChain();
}, 1000);

// Run Promise.all after chain
setTimeout(() => {
  fetchWithPromiseAll();
}, 5000);

// Run Promise.race last
setTimeout(() => {
  fetchWithPromiseRace();
}, 9000);