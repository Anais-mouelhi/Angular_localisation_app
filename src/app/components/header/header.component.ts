
import { RouterLink } from '@angular/router';
import { Component,Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthGoogleService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    RouterLink,
    CommonModule
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],

})
export class HeaderComponent {
  @Input() activePage!: string
  @Input() profile!: any

  locationData: any;

  constructor(
    private authService: AuthGoogleService
  ) {}

  async logout() {
    await this.authService.logout();
  }

}
