import { createTool } from '@mastra/core/tools'
import { z } from 'zod'

interface GeocodingResponse {
  results?: {
    id: number
    latitude: number
    longitude: number
    name: string
  }[]
}

interface WeatherResponse {
  current: {
    apparent_temperature: number
    relative_humidity_2m: number
    temperature_2m: number
    time: string
    weather_code: number
    wind_gusts_10m: number
    wind_speed_10m: number
  }
}

const getWeather = async (location: string) => {
  const geocodingUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(location)}&count=1`
  const geocodingResponse = await fetch(geocodingUrl)
  const geocodingData = await geocodingResponse.json() as GeocodingResponse

  if (!geocodingData.results?.[0]) {
    throw new Error(`Location '${location}' not found`)
  }

  const { latitude, longitude, name } = geocodingData.results[0]

  const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,wind_gusts_10m,weather_code`

  const response = await fetch(weatherUrl)
  const data = await response.json() as WeatherResponse

  return {
    conditions: getWeatherCondition(data.current.weather_code),
    feelsLike: data.current.apparent_temperature,
    humidity: data.current.relative_humidity_2m,
    location: name,
    temperature: data.current.temperature_2m,
    windGust: data.current.wind_gusts_10m,
    windSpeed: data.current.wind_speed_10m,
  }
}

function getWeatherCondition(code: number): string {
  const conditions: Record<number, string> = {
    0: 'Clear sky',
    1: 'Mainly clear',
    2: 'Partly cloudy',
    3: 'Overcast',
    45: 'Foggy',
    48: 'Depositing rime fog',
    51: 'Light drizzle',
    53: 'Moderate drizzle',
    55: 'Dense drizzle',
    56: 'Light freezing drizzle',
    57: 'Dense freezing drizzle',
    61: 'Slight rain',
    63: 'Moderate rain',
    65: 'Heavy rain',
    66: 'Light freezing rain',
    67: 'Heavy freezing rain',
    71: 'Slight snow fall',
    73: 'Moderate snow fall',
    75: 'Heavy snow fall',
    77: 'Snow grains',
    80: 'Slight rain showers',
    81: 'Moderate rain showers',
    82: 'Violent rain showers',
    85: 'Slight snow showers',
    86: 'Heavy snow showers',
    95: 'Thunderstorm',
    96: 'Thunderstorm with slight hail',
    99: 'Thunderstorm with heavy hail',
  }
  return conditions[code] || 'Unknown'
}

export const weatherTool = createTool({
  description: 'Get current weather for a location',
  execute: async ({ context }) => getWeather(context.location),
  id: 'get-weather',
  inputSchema: z.object({
    location: z.string().describe('City name'),
  }),
  outputSchema: z.object({
    conditions: z.string(),
    feelsLike: z.number(),
    humidity: z.number(),
    location: z.string(),
    temperature: z.number(),
    windGust: z.number(),
    windSpeed: z.number(),
  }),
})
