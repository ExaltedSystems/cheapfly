import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
// Import RxJs required methods
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class MainServiceService {

  public header = new Headers();
  // public urlLarevel = 'http://192.168.5.75/rtl/api/';
  //public baseUrl = 'http://192.168.100.75:4200/';
  //public url = 'http://127.0.0.1/rgtapp/index.php/services/';
  //public uploadUrl = 'http://192.168.100.75/rgtapp/index.php/services/';

  public baseUrl = 'http://localhost:4200';
  public uploadUrl = 'http://127.0.0.1/rgtapp/index.php/services/';
  public url = 'http://127.0.0.1/rgtapp/index.php/services/';
  public token;

  constructor() {
    // this.header.append('Content-type', 'application/json; charset=utf-8');
  }

  setToken(){
      this.token = localStorage.getItem('token');
  }
  getLatestToken(){
      this.setToken();
      return this.token;
  }
}
