/* eslint-disable @typescript-eslint/member-ordering */
import { Component, OnInit, Input } from '@angular/core';
import { MapServiceService } from './Services/map-service.service';
import { Geoposition } from '@ionic-native/geolocation';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import * as mapboxgl from 'mapbox-gl';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from './Services/data-service.service';
import { AlertController } from '@ionic/angular';


@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit{

  showSave = false;

  constructor(private router: Router, private mapService: MapServiceService, public geolocation: Geolocation,
    private rutaActiva: ActivatedRoute, private dataService: DataService, private alertCtrl: AlertController) {
  }

  ngOnInit() {
    this.mapService.getCurrentPosition().then((geoposition: Geoposition) => {

      this.mapService.setCoords(
          (this.rutaActiva.snapshot.params.lati === '0') ? geoposition.coords.latitude : this.rutaActiva.snapshot.params.lati,
          (this.rutaActiva.snapshot.params.long === '0') ? geoposition.coords.longitude : this.rutaActiva.snapshot.params.long
      );
      this.mapService.buildMap();
      this.crearMarcador();

      this.mapService.marker.on('drag', () => {
        this.showSave = true;
      });

    });
  }

  crearMarcador() {
    this.mapService.marker = new mapboxgl.Marker({
      draggable : true
    })
    .setLngLat([this.mapService.getLng(), this.mapService.getLat()])
    .addTo(this.mapService.map);
  }

  guardarUbicacion() {
      this.alertCtrl.create({
        header: 'Añadir',
        message: 'Indique el nombre de la ubicación',
        inputs: [
          {
            name: 'name',
            placeholder: 'Nombre',

          },
        ],
        buttons: [
          {
            text: 'Cancelar',
            handler: (data: any) => {

            }
          },
          {
            text: 'Añadir',
            handler: (data: any) => {

              const newName = (data.name === '')? 'Sin nombre' : data.name;

              const longSave = this.mapService.marker.getLngLat().lng;
              const latiSave = this.mapService.marker.getLngLat().lat;

              this.dataService.addPosition({name:newName, long: longSave, lati: latiSave});

              const ok = this.alertCtrl.create({
                header: '¡Añadido!',
                message: 'Puede ver la ubicición añadida en la lista de ubicaciones',
                buttons: [
                {
                  text: 'Ok'
                }
              ]}).then(res => {
                res.present();
              });
            }
          }
        ]
      }).then(res => {
        res.present();
      });
  }

  miPosicion()  {
    this.showSave = false;
    this.mapService.getCurrentPosition().then((geoposition: Geoposition) => {
      this.mapService.map.setCenter([geoposition.coords.longitude, geoposition.coords.latitude]);
      this.mapService.marker.setLngLat([geoposition.coords.longitude, geoposition.coords.latitude]);
    });
  }
}
