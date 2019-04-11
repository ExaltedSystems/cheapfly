import { User } from './models/user';
import { Component, OnInit, Input } from '@angular/core';
import {
  Router,
  // import as RouterEvent to avoid confusion with the DOM Event
  Event as RouterEvent,
  NavigationStart,
  NavigationEnd,
  NavigationCancel,
  NavigationError
} from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

declare var jQuery: any;
// declare var feather: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {

  title = 'app';
  isLoggedIn: boolean;
  currentUser: User;

  routeLoading: boolean = true;

  constructor(private router: Router, private translate: TranslateService){
    translate.setDefaultLang('en');

    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));

    router.events.subscribe((event: RouterEvent) => {
      this.navigationInterceptor(event)
    })
  }

  // Shows and hides the loading spinner during RouterEvent changes
  navigationInterceptor(event: RouterEvent): void {
    if (event instanceof NavigationStart) {
      this.routeLoading = true
    }
    if (event instanceof NavigationEnd) {
      this.routeLoading = false
    }

    // Set routeLoading state to false in both of the below events to hide the spinner in case a request fails
    if (event instanceof NavigationCancel) {
      this.routeLoading = false
    }
    if (event instanceof NavigationError) {
      this.routeLoading = false
    }
  }

  ngOnInit(){
    // jQuery.material.init();
  }

  switchLanguage(language: string) {
    this.translate.use(language);
  }
}
