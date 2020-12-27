import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LocationPickerComponent } from './pickers/location-picker/location-picker.component';
import { IonicModule } from '@ionic/angular';



@NgModule({
  declarations: [LocationPickerComponent],
  imports: [
    CommonModule, IonicModule.forRoot()
  ],
  exports: [LocationPickerComponent]
})
export class SharedModule { }
