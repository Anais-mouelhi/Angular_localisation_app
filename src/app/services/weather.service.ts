import { lastValueFrom, Observable, Subscriber, throwError } from 'rxjs';
import { ApiService } from './api.service';
import { Injectable } from '@angular/core';
import { Coords } from '../../models/geo.model';
import { WxModel } from '../../models/weather.model';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root',
})

export class WxService
{
  constructor(
    private readonly apiService: ApiService,
    private router: Router
  ) {}

  async getCityName(coords: Coords): Promise<any> {
    try {
      return await lastValueFrom(this.apiService.getCityName(coords));
    } catch(e) {
      console.error('Error: ', e)
      this.router.navigate(['/error']);
    }

  }

  async getWx(cityName: string): Promise<any>  {
    try {
      return await lastValueFrom(this.apiService.getWx(cityName));
    } catch(e) {
      console.error('Error: ', e)
      this.router.navigate(['/error']);
    }
  }

  async storeWx(wx: WxModel, token?: string): Promise<any>  {
    try {
      return await lastValueFrom(this.apiService.storeWx(wx,token));
    } catch(e) {
      console.error('Error: ', e)
      this.router.navigate(['/error']);
    }
  }

  async getUserHistory(email: string, token?: string): Promise<any>  {
    try {
      return await lastValueFrom(this.apiService.getUserHistory(email,token));
    } catch(e) {
      console.error('Error: ', e)
      this.router.navigate(['/error']);
    }
  }

  async deleteUserHistory(email: string, token?: string): Promise<any> {
    try {
      return await lastValueFrom(this.apiService.removeUserHistory(email,token));
    } catch(e) {
      console.error('Error: ', e)
      this.router.navigate(['/error']);
    }
  }

  async getAirQuality(coords: Coords): Promise<any> {
    try {
      return await lastValueFrom(this.apiService.getAirQuality(coords));
    } catch(e) {
      console.error('Error: ', e)
      this.router.navigate(['/error']);
    }
  }

  async getCurrentCoordinates(): Promise<any>  {
    try {
      const res = await lastValueFrom(this.getCurrentPosition());
      return {
        lat: res.latitude,
        lon: res.longitude,
      }
    } catch(e) {
      console.error('Error: ', e)
      this.router.navigate(['/error']);
    }
  }

  private getCurrentPosition(): Observable<any> {
    return new Observable<any>((observer: Subscriber<any>) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position: any) => {
          observer.next({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          observer.complete();
        });
      } else {
        observer.error();
      }
    });
  }
}
