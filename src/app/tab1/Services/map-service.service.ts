import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Injectable } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MapServiceService {

  mapbox = (mapboxgl as typeof mapboxgl);
  public map: mapboxgl.Map;
  style = `mapbox://styles/mapbox/dark-v10`;
  lat = 43.1746;
  lng = -2.4125;
  zoom = 15;

  public marker = null;


  constructor(public geolocation: Geolocation) {
    this.mapbox.accessToken = environment.mapBoxToken;
  }

  getCurrentPosition() {
    return this.geolocation.getCurrentPosition();
  }

  buildMap() {
    this.map = new mapboxgl.Map({
      container: 'map',
      style: this.style,
      zoom: this.zoom,
      center: [this.lng, this.lat],
      logoPosition: 'top-left',
    });
    this.map.addControl(new mapboxgl.FullscreenControl());
    this.map.addControl(new mapboxgl.NavigationControl());
    this.map.addControl(new mapboxgl.GeolocateControl());
  }

  setCoords(lat: number, lng: number) {
    this.lat = lat;
    this.lng = lng;
  }

  getLat() {
    return this.lat;
  }

  getLng() {
    return this.lng;
  }

}
