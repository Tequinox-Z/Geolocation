import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { DataService } from '../tab1/Services/data-service.service';
import { Position } from '../tab1/Interface/Position';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { MapServiceService } from '../tab1/Services/map-service.service';

import { take } from 'rxjs/operators';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit {

  positions: Position[] = [];

  constructor(private route: ActivatedRoute, private router: Router, public dataService: DataService,
    private alertCtrl: AlertController, private mapService: MapServiceService) {

  }

  ngOnInit() {

    this.dataService.getPositions().subscribe({
      next: (data: Position[]) => {
        this.positions = data;
      }
    });

  }

  delete(id: string) {

    this.alertCtrl.create({
      header: 'Borrar',
      message: '¿Está seguro? Esta acción no se puede deshacer',
      buttons: [
        {
          text: 'Cancelar'
        },
        {
          text: 'Borrar',
          handler: () => {
            this.dataService.deletePosition(id)
            .then((data) => {

              const ok = this.alertCtrl.create({
                header: '¡Borrado!',
                message: 'Se ha borrado la ubicación',
                buttons: [
                {
                  text: 'Ok'
                }
              ]}).then(res => {
                res.present();
              });
            });
          }
        }
      ]
    }).then(res => {
      res.present();
    });
  }

  edit(id) {
    this.dataService.getPositionById(id).pipe(take(1)).subscribe({
      next: (data: Position) => {
        this.alertCtrl.create({
          header: 'Renombrar',
          message: 'Indique el nombre de la ubicación',
          inputs: [
            {
              name: 'name',
              placeholder: data.name,

            },
          ],
          buttons: [
            {
              text: 'Cancelar'
            },
            {
              text: 'Editar',
              handler: (newdata: any) => {
                data.name = newdata.name;
                this.dataService.updatePosition(data);
              }
            }
          ]
        }).then(res => {
          res.present();
        });
      }
    });
  }

  view(id: string) {

    this.dataService.getPositionById(id).subscribe({
      next: (data: Position) => {
        this.mapService.marker.setLngLat([data.long, data.lati]);
        this.mapService.map.setCenter([data.long, data.lati]);
        this.router.navigate(['../tab1/position/' + data.long + '/' + data.lati], { relativeTo: this.route});
      }
    });
  }


  openQr(id: string) {

    const qr = this.alertCtrl.create({
      header: 'Compartir',
      message: `<img src="https://barcode.tec-it.com/barcode.ashx?code=QRCode&data=${id}"
       class="">`})
    .then(res => {
      res.present();
    });

  }


}
