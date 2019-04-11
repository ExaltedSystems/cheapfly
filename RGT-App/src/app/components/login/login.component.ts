import { AlertService } from './../../services/alert.service';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenticationService } from './../../services/index';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  isLoggedIn: boolean;
  isLoading: boolean;
  model: any = {};
  loading = false;
  returnUrl: string;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private authenticationService: AuthenticationService,
        private alertService: AlertService) { }

  ngOnInit() {
    this.isLoggedIn = false;
    // reset login status
    this.authenticationService.logout();

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  login() {
    this.isLoading = true;
    this.authenticationService.login(this.model.email, this.model.password,this.model.remember)
      .subscribe(
        data => {
          this.router.navigate([this.returnUrl]);
          this.isLoggedIn = true;
          this.alertService.success(data)
        },
        error => {
          this.isLoading = false;
          this.alertService.error(error.error);
          this.isLoggedIn = false;
        }
      );
  }
  
}
