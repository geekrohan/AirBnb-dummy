import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavController, ModalController, ActionSheetController, LoadingController, AlertController } from '@ionic/angular';
import { CreateBookingComponent } from '../../../bookings/create-booking/create-booking.component';
import { Place } from '../../place.model';
import { ActivatedRoute, Router } from '@angular/router';
import { PlacesService } from '../../places.service';
import { Subscription } from 'rxjs';
import { BookingService } from 'src/app/bookings/booking.service';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-place-detail',
  templateUrl: './place-detail.page.html',
  styleUrls: ['./place-detail.page.scss'],
})
export class PlaceDetailPage implements OnInit, OnDestroy {
  place: Place;
  isBookable = false;
  isLoading = false;
  private placeSub: Subscription;

  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private placesService: PlacesService,
    private modalCtrl: ModalController,
    private actionSheetController: ActionSheetController,
    private bookingService: BookingService,
    private loadingCtrl: LoadingController,
    private authService: AuthService,
    private alertCtrl: AlertController,
    private router: Router) { }

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('placeId')) {
        this.navCtrl.navigateBack('/places/tabs/offers');
        return;
      }
      this.isLoading = true;
      this.placesService.getPlace(paramMap.get('placeId')).subscribe(place => {
        this.place = place;
        this.isBookable = place.userId !== this.authService.userId;
        this.isLoading = false;
      }, (error) => {
        this.alertCtrl.create({
          header: 'An error Occurred', message: 'Could not load place', buttons: [{
            text: 'Okay', handler: () => {
              this.router.navigateByUrl('/places/tabs/discover');
            }
          }]
        }).then(alertEl => {
          alertEl.present();
        })
      });
    }
    );
  }
  ngOnDestroy() {
    if (this.placeSub) {
      this.placeSub.unsubscribe();
    }
  }

  onBookPlace() {
    this.actionSheetController.create({
      header: 'Choose an Action',
      buttons: [{
        text: 'Select Date',
        handler: () => {
          this.openBookingModal('select');
        }
      }, {
        text: 'Random Date',
        handler: () => {
          this.openBookingModal('random');
        }
      }, {
        text: 'Cancel',
        role: 'destructive'
      }]
    }).then(actionSheetEl => { actionSheetEl.present() });

  }

  openBookingModal(mode: 'select' | 'random') {
    console.log(mode);
    this.modalCtrl.create({ component: CreateBookingComponent, componentProps: { selectedPlace: this.place, selectedMode: mode } })
      .then(modalEl => {
        modalEl.present();
        return modalEl.onDidDismiss();
      }).then(resultData => {
        console.log(resultData.data, resultData.role);
        if (resultData.role === 'confirm') {

          this.loadingCtrl.create({ message: 'Confirming Booking...' }).then(loadingEl => {
            loadingEl.present();
            const data = resultData.data.bookingData;
            this.bookingService.addBooking(
              this.place.id,
              this.place.title,
              this.place.imageUrl,
              data.firstName,
              data.lastName,
              data.guestNumber,
              data.startDate,
              data.endDate).subscribe(() => {
                this.loadingCtrl.dismiss();
              });
          });

        }
      });
    // this.navCtrl.navigateBack('/places/tabs/discover');
  }
}
