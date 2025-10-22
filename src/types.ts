export interface WeatherData{
    latitude: number;
    longitute: number;
    generationtime_ms: number;
    utc_offset_seconds: number;
    timezone: string;
    timezone_abbreviation: string;
    elevation: number;
    current_weather: {
        temperature: number;
        windspeed: number;
        winddirection: number;
        weathercode: number;
        time: string;
    };
}

export interface NewData{
    posts: Array<{
        id: number;
        title: string;
        body: string;
        tags: string[];
        reactions: number;
        views: number;
        userId: number;
    }>
}

export interface ApiResponse<T>{
    success: boolean;
    data?: T;
    error?: string;
    executionTime?: number;
}