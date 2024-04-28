import { Component } from '@angular/core';
import { AuthGoogleService } from '../../services/auth.service';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css'
})
export class LoginPageComponent {
  constructor(
    private authService: AuthGoogleService
  ) {
    this.authService.login()
  }
}
