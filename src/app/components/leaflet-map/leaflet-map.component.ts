import { Component, Input, OnInit } from '@angular/core';
import { WxModel } from '../../../models/weather.model';
import * as L from 'leaflet';

@Component({
  selector: 'app-leaflet-map',
  standalone: true,
  imports: [],
  templateUrl: './leaflet-map.component.html',
  styleUrl: './leaflet-map.component.css'
})
export class LeafletMapComponent implements OnInit
{
  @Input() weatherData!: WxModel | WxModel[];

  public map!: L.Map;

  ngOnInit(): void {
    // console.log(this.weatherData);
    this.loadMap();
  }

  loadMap() {
    this.map = L.map('map').setView([0, 0], 1);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
    }).addTo(this.map);

    // météo à la position de l'utilisateur
    // (WeatherData est un objet On est sur la page Météo actuelle)
    if(!Array.isArray(this.weatherData)){
      this.map.flyTo([this.weatherData.lat, this.weatherData.lon], 13);
      this.showWeatherInfo(this.weatherData.lat, this.weatherData.lon);
    } else{
      // weatherData est un tableau d'objets
      // on est sur la page Historique
      this.loadMarkers();
      this.map.flyTo([this.weatherData[0].lat, this.weatherData[0].lon], 7);

    }

  }

  private showWeatherInfo(latitude: number, longitude: number): void {
    if(Array.isArray(this.weatherData)) {
      return;
    }
    const popupContent = `
      <h3>${this.weatherData.weather.name}</h3>
      <p>${new Date().toLocaleTimeString('fr-FR')}</p>
      <p>${this.weatherData.weather.weather[0].description}</p>
      <p>Température: ${this.weatherData.weather.main.temp} °C</p>
      <p>Qualité de l'air: ${this.weatherData.airQuality}</p>
    `;

    const icon = L.icon({
      iconUrl: 'assets/images/marker-icon.png',
      shadowUrl: 'assets/images/marker-shadow.png',
      popupAnchor: [13, 0],
    });

    const marker = L.marker([latitude, longitude], { icon })
      .bindPopup(popupContent)
      .addTo(this.map);
  }

  private loadMarkers() {
    if(!Array.isArray(this.weatherData)) {
      return;
    }

    const markers: any[] = this.weatherData.map((position: any) => {
      let popupContent = `
      <h3>${position.weather.name}</h3>
      <p>${new Date(position.createdAt).toLocaleDateString('fr-FR')}</p>
      <p>${new Date(position.createdAt).toLocaleTimeString('fr-FR')}</p>
      <p>${position.weather.weather[0].description}</p>
      <p>Température: ${position.weather.main.temp} °C</p>
      <p>Qualité de l'air: ${position.airQuality}</p>
    `;

    const icon = L.icon({
      iconUrl: 'assets/images/marker-icon.png',
      shadowUrl: 'assets/images/marker-shadow.png',
      popupAnchor: [13, 0],
    });

    const marker = L.marker([position.lat, position.lon], { icon })
      .bindPopup(popupContent)
      .addTo(this.map);

      return marker;
    })

    // console.log(markers);
  }

}
