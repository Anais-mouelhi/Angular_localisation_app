import { Component, Input, OnInit } from '@angular/core';
import { WxModel } from '../../../models/weather.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-wx-display',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './wx-display.component.html',
  styleUrl: './wx-display.component.css'
})
export class WxDisplayComponent{
  @Input() weatherData!: WxModel;
  @Input() todayLocale!: string;

}
