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

// Async/await with sequential execution
async function fetchSequentialAsync(): Promise<void> {
  const startTime = Date.now();
  
  try {
    console.log('🔄 Starting ASYNC/AWAIT (sequential)...');
    
    console.log('📡 Fetching weather data...');
    const weatherData = await httpsGetPromise(WEATHER_API);
    console.log('✅ Weather data received');
    
    console.log('📡 Fetching news data...');
    const newsData = await httpsGetPromise(NEWS_API);
    console.log('✅ News data received');
    
    const weather: WeatherData = JSON.parse(weatherData);
    const news: NewsData = JSON.parse(newsData);
    const executionTime = Date.now() - startTime;
    
    displayResults(weather, news, 'async/await sequential', executionTime);
    
    // Simulate another async operation
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('✅ Additional async operation completed!');
    
  } catch (error) {
    displayError((error as Error).message, 'async/await sequential');
  }
}

// Async/await with parallel execution
async function fetchParallelAsync(): Promise<void> {
  const startTime = Date.now();
  
  try {
    console.log('🔄 Starting ASYNC/AWAIT (parallel)...');
    
    console.log('📡 Fetching both weather and news simultaneously...');
    const [weatherData, newsData] = await Promise.all([
      httpsGetPromise(WEATHER_API),
      httpsGetPromise(NEWS_API)
    ]);
    
    console.log('✅ Both requests completed!');
    
    const weather: WeatherData = JSON.parse(weatherData);
    const news: NewsData = JSON.parse(newsData);
    const executionTime = Date.now() - startTime;
    
    displayResults(weather, news, 'async/await parallel', executionTime);
    
  } catch (error) {
    displayError((error as Error).message, 'async/await parallel');
  }
}

// Async/await with error handling and multiple operations
async function fetchWithErrorHandling(): Promise<void> {
  const startTime = Date.now();
  
  try {
    console.log('🔄 Starting ASYNC/AWAIT with comprehensive error handling...');
    
    // Simulate various async operations
    const weatherPromise = httpsGetPromise(WEATHER_API);
    const newsPromise = httpsGetPromise(NEWS_API);
    
    // Wait for both with timeout
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Request timeout')), 10000)
    );
    
    const [weatherData, newsData] = await Promise.race([
      Promise.all([weatherPromise, newsPromise]),
      timeoutPromise
    ]) as [string, string];
    
    const weather: WeatherData = JSON.parse(weatherData);
    const news: NewsData = JSON.parse(newsData);
    const executionTime = Date.now() - startTime;
    
    displayResults(weather, news, 'async/await with error handling', executionTime);
    
  } catch (error) {
    if ((error as Error).message === 'Request timeout') {
      displayError('Request took too long to complete', 'async/await');
    } else {
      displayError((error as Error).message, 'async/await');
    }
  }
}

// Main execution function
async function main(): Promise<void> {
  console.log('🎯 DEMONSTRATING ASYNC/AWAIT PROGRAMMING\n');
  
  await fetchSequentialAsync();
  await fetchParallelAsync();
  await fetchWithErrorHandling();
  
  console.log('\n🎉 All async/await demonstrations completed!');
}

// Run the async/await demonstrations
main().catch(error => {
  console.error('💥 Unexpected error in main:', error);
});