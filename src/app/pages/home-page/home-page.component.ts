import { Component } from '@angular/core';
import { AuthGoogleService } from '../../services/auth.service';
import { HeaderComponent } from '../../components/header/header.component';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { User } from '../../../models/user.model';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CommonModule, HeaderComponent, RouterLink, TitleCasePipe, ],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css'
})
export class HomePageComponent {
  public loading: boolean = true;
  public profile!: User;
  public activePage!: string;

  constructor(
    private authService: AuthGoogleService
  )
  {
    this.activePage = "home";
    // verification de l'authentification
    this.authService.profile$.subscribe((profile) => {
      if (profile) {
        this.loading = false;
        this.profile = profile;
        this.profile.token = this.authService.getIdToken();
        console.log(this.profile);
      }
    });
    setTimeout(async () => {
      if(this.loading) {
        await this.logout();
      }
    }, 3000)
  }

  async logout(): Promise<void> {
    await this.authService.logout();
  }

  getToken() {
    const token = this.authService.getToken();
    console.log(token);
    return token;
  }
}
