import { Component, OnInit } from '@angular/core';
import { AuthGoogleService } from '../../services/auth.service';
import { WxService } from '../../services/weather.service';
import { User } from '../../../models/user.model';
import { CommonModule, DatePipe } from '@angular/common';
import { HeaderComponent } from '../../components/header/header.component';
import { RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LeafletMapComponent } from '../../components/leaflet-map/leaflet-map.component';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { WxModel } from '../../../models/weather.model';

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
