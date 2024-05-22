import { Component, OnInit } from '@angular/core';
import { AuthGoogleService } from '../../services/auth.service';
import { WxService } from '../../services/weather.service';
import { User } from '../../../models/user.model';
import { CommonModule, DatePipe, TitleCasePipe  } from '@angular/common';
import { HeaderComponent } from '../../components/header/header.component';
import { RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LeafletMapComponent } from '../../components/leaflet-map/leaflet-map.component';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { WxModel, AirQuality } from '../../../models/weather.model';

import { WxDisplayComponent } from '../../components/wx-display/wx-display.component';


@Component({
  selector: 'app-history-page',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    RouterLink,
    LeafletMapComponent,
    SlickCarouselModule,
    DatePipe,
    TitleCasePipe,
    WxDisplayComponent
  ],
  templateUrl: './history-page.component.html',
  styleUrl: './history-page.component.css'
})
export class HistoryPageComponent implements OnInit{
  public activePage!: string;
  public profile!: User;
  public loading: boolean = true;
  public loadingWx: boolean = true;
  public weatherData!: any;
  public slideConfig!: any;
  public airQualityData!: any;
  public cityName: string = '';
  public airQuality: string = '';
  public todayLocale: string = '';
  public today: Date = new Date();

  constructor(
    private authService: AuthGoogleService,
    private weatherService: WxService,
    private toastr: ToastrService
  )
  {
    this.activePage = "historique";
    this.slideConfig = {"slidesToShow": 3, "slidesToScroll": 2};
    // verification de l'authentification
    this.authService.profile$.subscribe((profile) => {
      if (profile) {
        this.loading = false;
        this.profile = profile;
        this.profile.token = this.authService.getIdToken();
      }
    });
    setTimeout(async () => {
      if(this.loading) {
        await this.logout();
      }
    }, 3000)
  }

  ngOnInit(): void {
    this.loadWxHistory()
    .then(() => {
      this.toastr.success('Historique données météo chargées!');
    })
    .catch((e) => {
      console.log(e);
    })
  }

  private async loadWeatherData() {
    const coords = await this.weatherService.getCurrentCoordinates();
    // console.log(coords);

    const location = await this.weatherService.getCityName(coords);
    // console.log(location);

    const cityName = location.address.city || location.address.town || location.address.village;

    const weatherData: any = await this.weatherService.getWx(cityName);
    // console.log(weatherData);

    const airQuality = await this.weatherService.getAirQuality(coords);
    // console.log(airQuality);

    const weather: WxModel = {
      email: this.profile.email,
      lat: coords.lat,
      lon: coords.lon,
      city: cityName,
      weather: weatherData,
      airQuality: (airQuality as AirQuality).list?.[0]?.main?.aqi,
    };
    this.weatherData = weather;
    // console.log(this.weatherData);
    this.loadingWx = false;
    await this.weatherService.storeWx(weather, this.profile.token);
  }

  getCurrentDay(): string {
    const today = new Date();
    return today.toLocaleDateString('fr-FR');
  }

  async loadWxHistory() {
    const wx = await this.weatherService.getUserHistory(this.profile.email, this.profile.token);
    // console.log(wx);
    this.weatherData = wx;
    this.loadingWx = false;
  }

  slickInit(event: any) {
    console.log('slick initialized', event);
  }

  async removeHistory() {
    console.log("kjhkjhkj");
    this.loadingWx = true;
    this.loading = true;
    const res = await this.weatherService.deleteUserHistory(this.profile.email, this.profile.token)
    await this.loadWxHistory()
    console.log(res)
    this.loadingWx = false;
    this.loading = false;
  }

  async logout(): Promise<void> {
    await this.authService.logout();
  }
}
