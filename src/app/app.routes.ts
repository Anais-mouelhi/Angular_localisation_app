import { Routes } from '@angular/router';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { WeatherPageComponent } from './pages/weather-page/weather-page.component';
import { HistoryPageComponent } from './pages/history-page/history-page.component';
import { NotFoundPageComponent } from './pages/not-found-page/not-found-page.component';
import { CguPageComponent } from './pages/cgu-page/cgu-page.component';
import { PrivacyPageComponent } from './pages/privacy-page/privacy-page.component';
import { ErrorPageComponent } from './pages/error-page/error-page.component';
import { RgpdComponent } from './pages/rgpd/rgpd.component';

export const routes: Routes = [
  {path: '', component: RgpdComponent},
  {path: 'login', component: LoginPageComponent},
  {path: 'home', component: HomePageComponent},
  {path: 'wx', component: WeatherPageComponent},
  {path: 'history', component: HistoryPageComponent},
  {path: 'cgu', component: CguPageComponent},
  {path: 'privacy', component: PrivacyPageComponent},
  {path: 'error', component: ErrorPageComponent},
  {path: '**', component: NotFoundPageComponent},
];
