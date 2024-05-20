import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Coords } from '../../models/geo.model';
import { environment } from '../../environments/environment.development';
import { WxModel } from '../../models/weather.model';

const geoCodingApiUrl: string = `https://nominatim.openstreetmap.org/reverse?`;
const weatherApiUrl: string  = `https://api.openweathermap.org/data/2.5/weather?`;
const airQualiyApiUrl: string  = `https://api.openweathermap.org/data/2.5/air_pollution/forecast?`;
const backendApiRoot: string  = 'https://location-backend-441bf7e22256.herokuapp.com/api/';
const wxApiKey: string = environment.open_weather_api_key;

type HttpOptionsType = {
  headers: HttpHeaders,
  responseType: "json"
}


@Injectable({
  providedIn: 'root',
})

export class ApiService
{
  constructor(
    private readonly http: HttpClient
  ) {}

  getCityName(coords: Coords) {
    return this.http.get(`${geoCodingApiUrl}lat=${coords.lat}&lon=${coords.lon}&format=json`, this.getHttpOptions());
  }

  getWx(cityName: string) {
    return this.http.get(`${weatherApiUrl}q=${cityName}&appid=${wxApiKey}&units=metric`, this.getHttpOptions());
  }

  getAirQuality(coords: Coords) {
    return this.http.get(`${airQualiyApiUrl}lat=${coords.lat}&lon=${coords.lon}&appid=${wxApiKey}`, this.getHttpOptions());
  }

  storeWx(wx: WxModel, token?: string) {
    return this.http.post(`${backendApiRoot}history/add`, wx, this.getHttpOptionsWithBearer(token))
  }

  getUserHistory(email: string, token?: string) {
    return this.http.post(`${backendApiRoot}history`, {email: email}, this.getHttpOptionsWithBearer(token))
  }

  removeUserHistory(email: string, token?: string) {
    return this.http.post(`${backendApiRoot}history/remove`, {email: email}, this.getHttpOptionsWithBearer(token))
  }

  private getHttpOptions(): HttpOptionsType {
    return {
      headers: new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept': 'text/html, application/xhtml+xml, */*',
      }),
      responseType: 'json' as 'json'
    }
  }

  private getHttpOptionsWithBearer(token?: string): HttpOptionsType {
    if(!token) {
      return this.getHttpOptions();
    }
    return {
      headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'text/html, application/xhtml+xml, */*',
      'withCredentials': 'true',
      'Authorization': 'Bearer ' + token,
      }),
      responseType: 'json' as 'json'
    }
  }
}
