import { User } from './../../models/user';
import { Component, OnInit } from '@angular/core';
import * as jwt_decode from 'jwt-decode';
import { TranslateService } from '@ngx-translate/core';
import { MainServiceService } from 'app/services/main.service';
import { DataServiceService } from 'app/services/data-service.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  isLoggedIn: boolean;
  currentUser: User;
  callbackQueries: object;

  constructor(private translate: TranslateService, private __ms: MainServiceService, private __ds: DataServiceService) {
    translate.setDefaultLang('en');
    this.currentUser = jwt_decode(localStorage.getItem('currentUser'));
  }

  ngOnInit() {
    if (this.currentUser) {
      this.isLoggedIn = true;
    }
    // console.log('token docode on front end '+this.currentUser.username)
  }
  getSectorVehicleLists() {
    this.__ds.getData(this.__ms.url + 'Cms/callbackQueriesNotification').subscribe(res => {
      this.callbackQueries = res.data;
    });
  }

  switchLanguage(language: string) {
    this.translate.use(language);
  }

}
