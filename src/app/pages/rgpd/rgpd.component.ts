import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-rgpd',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './rgpd.component.html',
  styleUrl: './rgpd.component.css'
})
export class RgpdComponent implements OnInit{
  public consentChecked!: boolean;

  ngOnInit(): void {
      this.consentChecked = false;
  }

  public consentChange() {

  }
}
