import { CommonModule, registerLocaleData } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import * as fr from '@angular/common/locales/fr';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'SkyFind';

  constructor() {
    registerLocaleData(fr.default);
  }
}
