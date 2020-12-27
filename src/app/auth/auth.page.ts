import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {
  isLoading = false;
  isLogin = true;
  constructor(
    private authService: AuthService,
    private router: Router,
    private loadingController: LoadingController
  ) { }

  ngOnInit() {
  }
  onLogin() {
    this.isLoading = true;
    this.loadingController.create({ keyboardClose: true, message: 'Logging in...' }).then(locadingEl => {
      locadingEl.present();
      setTimeout(() => {
        this.loadingController.dismiss();
        this.isLoading = false;
        this.router.navigateByUrl('/places/tabs/discover');
      }, 1500);
    });
    this.authService.login();
  }
  onSubmit(f: NgForm) {
    if (f.invalid) {
      return;
    }

    const email = f.value.email;
    const password = f.value.password;

    if (this.isLogin) {
      //Send a Request to Login Server
    } else {
      //Send a Request to Signup Server
    }
  }
  onSwitchAuthMode() {
    this.isLogin = !this.isLogin;
  }
}
