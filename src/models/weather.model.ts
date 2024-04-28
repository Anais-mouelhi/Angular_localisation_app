export interface WxModel {
  email: string
  lat: number
  lon: number
  city: string
  weather: any
  airQuality?: number
}

export interface AirQuality {
  list?: {
    main: {
      aqi: number;
    };
  }[];
}
