import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthConfig, OAuthService } from 'angular-oauth2-oidc';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { User } from '../../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthGoogleService {


  private profileSubject = new BehaviorSubject<any>(null);
  public profile$ = this.profileSubject.asObservable();

  constructor(
    private oAuthService: OAuthService,
    private router: Router
  ) {
    this.initConfiguration();
    this.loadUserProfile();
  }

  initConfiguration() {
    const authConfig: AuthConfig = {
      issuer: 'https://accounts.google.com',
      strictDiscoveryDocumentValidation: false,
      clientId: environment.googleClientId,
      redirectUri: window.location.origin + '/home',
      scope: 'openid profile email',
      responseType: 'token id_token',
      showDebugInformation: true,
    };

    this.oAuthService.configure(authConfig);
    this.oAuthService.setupAutomaticSilentRefresh();
    this.oAuthService.loadDiscoveryDocumentAndTryLogin().then(() => {
      if (this.oAuthService.hasValidAccessToken()) {
        this.fetchAndSetProfile();
      }
    });
  }

  login() {
    this.oAuthService.initImplicitFlow();
  }

  async logout() {
    this.oAuthService.revokeTokenAndLogout().then(() => {
      this.router.navigate(['/']);
    });

  }

  fetchAndSetProfile() {
    const profile = this.oAuthService.getIdentityClaims();
    // console.log('FULL PROFILE');
    // console.log(profile);
    const userProfile: User = {
      sub: profile?.["sub"],
      email: profile?.["email"],
      name: profile?.["name"],
      picture: profile?.["picture"]
    };
    this.profileSubject.next(userProfile);
  }

  private loadUserProfile() {
    if (this.oAuthService.hasValidAccessToken()) {
      this.fetchAndSetProfile();
    }
  }

  getToken() {
    return this.oAuthService.getAccessToken();
  }

  getIdToken() {
    return this.oAuthService.getIdToken();
  }
}
