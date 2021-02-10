import { Component, NgZone } from '@angular/core';

import { Platform } from '@ionic/angular';
import { Plugins, Capacitor } from '@capacitor/core';

import { AuthService } from './auth/auth.service';
import { Router } from '@angular/router';
import { Deeplinks } from '@ionic-native/deeplinks/ngx';
import { AppAvailability } from '@ionic-native/app-availability/ngx';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private authService: AuthService,
    private router: Router,
    private deeplinks: Deeplinks,
    private zone: NgZone,
    private appAvailability: AppAvailability
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      if (Capacitor.isPluginAvailable('SplashScreen')) {
        Plugins.SplashScreen.hide();
      }
      this.setupDeeplinks();
    });
  }

  onLogout() {
    this.authService.logout();
    this.router.navigateByUrl('/auth');
  }

  setupDeeplinks() {
    this.deeplinks.route({
      '/appredirect': 'places'
    }).subscribe(match => {
      console.log('successfully found match', match);
      const internalPath = `/places/tabs/discover}`
      let app
      if (this.platform.is('android')) {
        app = 'com.airbnbdummy.app';
      }
      this.appAvailability.check(app)
        .then(
          (yes: boolean) => this.zone.run(() => { this.router.navigateByUrl(internalPath); }),
          (no: boolean) => window.location.href = 'https://play.google.com/store/apps/details?id=com.whatsapp&hl=en_IN&gl=US'
        );

    })
  }
}
