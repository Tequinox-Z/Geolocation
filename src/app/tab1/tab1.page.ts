import { Component, OnInit } from '@angular/core';
import { MapServiceService } from './Services/map-service.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit{

  constructor(private mapService: MapServiceService) {

  }


  ngOnInit() {
      this.mapService.buildMap();

      setTimeout(() => {
        this.mapService.setCoords(this.mapService.getLat() + 10, this.mapService.getLng() + 10);
        this.mapService.buildMap();
      }, 1000);
  }
}
