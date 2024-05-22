import { Component, OnInit } from '@angular/core';
import { AuthGoogleService } from '../../services/auth.service';
import { HeaderComponent } from '../../components/header/header.component';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { User } from '../../../models/user.model';
import { WxService } from '../../services/weather.service';
import { AirQuality, WxModel } from '../../../models/weather.model';
import { LeafletMapComponent } from '../../components/leaflet-map/leaflet-map.component';
import { WxDisplayComponent } from '../../components/wx-display/wx-display.component';
import { ToastrService } from 'ngx-toastr';
import { SlickCarouselModule } from 'ngx-slick-carousel';


@Component({
  selector: 'app-weather-page',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    RouterLink,
    TitleCasePipe,
    LeafletMapComponent,
    WxDisplayComponent,
    SlickCarouselModule,
    DatePipe,
  ],
  templateUrl: './weather-page.component.html',
  styleUrl: './weather-page.component.css'
})
export class WeatherPageComponent implements OnInit{
  public loading: boolean = true;
  public loadingWx: boolean = true;
  public dataError: boolean = false;
  public profile!: User;
  public activePage!: string;
  public weatherData!: any;
  public airQualityData!: any;
  public cityName: string = '';
  public airQuality: string = '';
  public todayLocale: string = '';
  public today: Date = new Date();
  public slideConfig!: any;


  constructor(
    private authService: AuthGoogleService,
    private weatherService: WxService,
    private toastr: ToastrService
  )
  {
    this.activePage = "meteo";
    this.todayLocale = this.getCurrentDay();
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
      this.loadWeatherData()
      .then(() => {
        this.toastr.success('Position et données météo correctement sauvegardées');
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
