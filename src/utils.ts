import type {WeatherData, NewsData, ApiResponse} from './types'

export const weatherCodeMap: { [key: number]: string } = {
    0: "Clear sky",
    1: 'Mainly clear',
    2: 'Partly cloudy',
    3: 'Overcast',
    45: 'Fog',
    48: 'Depositing rime fog',
    51: 'Light drizzle',
    53: 'Moderate drizzle',
    55: 'Dense drizzle',
    61: 'Slight rain',
    63: 'Moderate rain',
    65: 'Heavy rain',
    80: 'Slight rain showers',
    81: 'Moderate rain showers',
    82: 'Violent rain showers',
};

export function getWeatherDescription(code: number): string {
  return weatherCodeMap[code] || 'Unknown weather condition';
}

export function displayResults(
  weather: WeatherData, 
  news: NewsData, 
  style: string,
  executionTime: number
): void {
  console.log('\n' + '='.repeat(60));
  console.log(`${style.toUpperCase()} VERSION RESULTS`);
  console.log('='.repeat(60));
  
  console.log('\n🌤️  WEATHER DATA:');
  console.log('-'.repeat(40));
  console.log(`Location: ${weather.latitude.toFixed(2)}°N, ${weather.longitude.toFixed(2)}°E`);
  console.log(`🌡️  Temperature: ${weather.current_weather.temperature}°C`);
  console.log(`💨 Wind Speed: ${weather.current_weather.windspeed} km/h`);
  console.log(`☁️  Conditions: ${getWeatherDescription(weather.current_weather.weathercode)}`);
  console.log(`🕐 Time: ${new Date(weather.current_weather.time).toLocaleString()}`);
  
  console.log('\n📰 NEWS HEADLINES:');
  console.log('-'.repeat(40));
  news.posts.slice(0, 5).forEach((post, index) => {
    console.log(`${index + 1}. ${post.title}`);
    console.log(`   💬 ${post.body.substring(0, 80)}...`);
    console.log(`   🏷️  Tags: ${post.tags.join(', ')}`);
    console.log(`   👍 Reactions: ${post.reactions} | 👀 Views: ${post.views}`);
    console.log();
  });
  
  console.log('⏱️  EXECUTION TIME:');
  console.log('-'.repeat(40));
  console.log(`Total time: ${executionTime.toFixed(2)}ms`);
  console.log('='.repeat(60));
}

export function displayError(error: string, style: string): void {
  console.log('\n' + '❌'.repeat(20));
  console.log(`🚨 ERROR IN ${style.toUpperCase()} VERSION`);
  console.log('❌'.repeat(20));
  console.log(`💥 ${error}`);
  console.log('❌'.repeat(20));
}

