import { Component, OnInit, Output } from '@angular/core';
import { EventEmitter } from 'events';
import { Capacitor, Plugins } from '@capacitor/core';
import { AlertController } from '@ionic/angular';
import { Coordinates } from 'src/app/places/location.model';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-location-picker',
  templateUrl: './location-picker.component.html',
  styleUrls: ['./location-picker.component.scss'],
})
export class LocationPickerComponent implements OnInit {
  @Output() locationPick = new EventEmitter();
  constructor(private alertCtrl: AlertController, private http: HttpClient) { }

  ngOnInit() { }

  onPickLocation() {
    if (!Capacitor.isPluginAvailable('GeoLocation')) {
      this.showALert();
      return;
    }
    Plugins.Geolocation.getCurrentPosition().then(geoPosition => {
      const coordinates: Coordinates = {
        lat: geoPosition.coords.latitude,
        lng: geoPosition.coords.longitude
      }
    }).catch(err => {
      this.showALert();
    });
  }


  private getAddress(lat: number, lng: number) {

  }
  private showALert() {
    this.alertCtrl.create({ header: 'Could not fetch the location', message: 'Please Try again Later' })
      .then(alertEl => { alertEl.present(); });
  }

}
