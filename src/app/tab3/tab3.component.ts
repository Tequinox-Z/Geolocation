import { Component, OnInit } from '@angular/core';

import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { MapServiceService } from '../tab1/Services/map-service.service';
import { DataService } from '../tab1/Services/data-service.service';
import { AlertController } from '@ionic/angular';
import { take } from 'rxjs/operators';
import { Position } from '../tab1/Interface/Position';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-tab3',
  templateUrl: './tab3.component.html',
  styleUrls: ['./tab3.component.css']
})
export class Tab3Component implements OnInit {

  constructor(private route: ActivatedRoute, private router: Router, private alertCtrl: AlertController,
    private scanner: BarcodeScanner, public dataService: DataService, private mapService: MapServiceService) { }

   ngOnInit() {
   }

   scan() {
    this.scanner.scan().then(barcodeData => {
        this.dataService.getPositionById(barcodeData.text).pipe(take(1)).subscribe({
          next: ( position: Position ) => {
            if (position == null) {
              const notFound = this.alertCtrl.create({
                header: 'Error',
                message: 'La ubicación no ha sido encontrada, es posible que el usuario haya borrado la ubicación',
                buttons: [
                {
                  text: 'Ok'
                }
              ]}).then(res => {
                res.present();
              });
            }
            else {
              this.mapService.marker.setLngLat([position.long, position.lati]);
              this.mapService.map.setCenter([position.long, position.lati]);
              this.router.navigate(['../tab1/position/' + position.long + '/' + position.lati], { relativeTo: this.route});
            }
          },
          error: () => {
            const notFound = this.alertCtrl.create({
              header: 'Error',
              message: 'El código QR escaneado no ha sido generado con esta aplicación, inténtelo de nuevo',
              buttons: [
              {
                text: 'Ok'
              }
            ]}).then(res => {
              res.present();
            });
          }


        });


     })
     .catch(err => {
         console.log('Error', err);
     });
   }
}
