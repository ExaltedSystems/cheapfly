import { HttpClient } from '@angular/common/http';
import { MainServiceService } from './main.service';
import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';
// Import RxJs required methods
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { HttpHeaders } from '@angular/common/http';

// const headers = new HttpHeaders({'Content-Type':'application/json; charset=utf-8'});

@Injectable()
export class DataServiceService {

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': localStorage.getItem('currentUser'),
      'headers': 'Access-Control-Allow-Origin',
    })
  };
  visaCurrenciesList;
  visaIncludes;
  visaTypeLists;
  visaNumEntryList;
  documentsRequired;

  header = new HttpHeaders();
  headers = this.header.set('Content-Type', 'application/json; charset=utf-8');

  public pageEditData: object;

  constructor(private http: Http, private _http: HttpClient, private mainService: MainServiceService) {

  }

  /**
   * get all data
   * @param url type any 
   * @return json 
   */
  getData(url): Observable<response> {
    return this._http.get<response>(url);
  }

  getJsonFile(url) {
    return this.http.get(url).map(res => res.json());
  }

  /**
    * Get All Client All Informations
    * @param url type any 
    * @return json 
  */
  getClientInfo(url): Observable<ipInformation> {
    return this._http.get<ipInformation>(url);
  }

  /**
   * post data to server api
   * @param url 
   * @param obj 
   */
  postData(url, obj): Observable<response> {
    return this._http.post<response>(url, obj);
  }

  // PostNew(url,obj){
  //   return this.http.post(url,obj).map(res => res.json());
  // }

  putData(url, obj) {
    return this._http.put(url, obj)
  }

  deleteData(url) {
    return this._http.delete(url);
  }

  propertiesLinting(sort: string, order: string, page: number): Observable<pagesList> {
    const href = this.mainService.url + 'hotelLists/myProperties';
    const requestUrl = `${href}?sort=${sort}&order=${order}&page=${page + 1}`;
    return this._http.get<pagesList>(requestUrl);
  }

  pagesListing(sort: string, order: string, page: number): Observable<pagesList> {
    const href = this.mainService.url + 'Cms/allPages';
    const requestUrl = `${href}?sort=${sort}&order=${order}&page=${page + 1}`;
    return this._http.get<pagesList>(requestUrl);
  }

  visasListing(sort: string, order: string, page: number): Observable<visaLists> {
    const href = this.mainService.url + 'Cms/allVisas';
    const requestUrl = `${href}?sort=${sort}&order=${order}&page=${page + 1}`;
    return this._http.get<visaLists>(requestUrl);
  }
  dealsListings(sort: string, order: string, page: number): Observable<visaLists> {
    const href = this.mainService.url + 'Cms/dealsListing';
    const requestUrl = `${href}?sort=${sort}&order=${order}&page=${page + 1}`;
    return this._http.get<visaLists>(requestUrl);
  }
  scrollerListings(sort: string, order: string, page: number): Observable<visaLists> {
    const href = this.mainService.url + 'Cms/scrollerListing';
    const requestUrl = `${href}?sort=${sort}&order=${order}&page=${page + 1}`;
    return this._http.get<visaLists>(requestUrl);
  }

  setDateFormat(date) {
    let newDate = new Date(date)
    // If Less than 9 then concatenate 0 e.g (01, 02 ..... 09)
    // getMonth() give month from 0 = January, 1 = February etc.....
    // getDate() give day from 1, 2, 3 ..... 31
    let month = (newDate.getMonth() + 1 > 9 ? (newDate.getMonth() + 1) : "0" + (newDate.getMonth() + 1));
    let day = (newDate.getDate() > 9 ? newDate.getDate() : "0" + newDate.getDate());
    let formatedDate = newDate.getFullYear() + '-' + month + '-' + day;
    return formatedDate;
  }
  // getVisaOptions(): Observable<visaOptionResponse> {
  //   const href = this.mainService.url + 'Cms/readJsonFile';
  //   return this._http.get<visaOptionResponse>(href);
  // }
  getVisaOptions(): Observable<response>  {
    const href = this.mainService.url + 'Cms/readJsonFile';
    return this._http.get<response>(href);
  }

}

export interface response {
  status: boolean,
  message: string,
  data: object
}

export interface propertyList {
  status: boolean,
  message: string,
  items: Element[];
  total_count: number;
}

export interface Element {
  id: number;
  name: string;
  phone_no: number;
  address: number;
  contact_name: string;
  total_rooms: number;
}

export interface pagesList {
  items: pagesArray[];
  total_count: number;
}

export interface pagesArray {
  name: string;
  parentId: number;
  shortDescription: string;
  URL: string;
  sort: number;
  status: number;
}

export interface visaLists {
  items: visasArr[];
  total_count: number;
}

export interface visasArr {
  sNo: number;
  countryId: string;
  details: string;
  status: number;
  createdDate: DateTimeFormat;
}

export interface ipInformation {
  city: string;
  country: string;
  hostname: string;
  ip: string;
  loc: string;
  org: string;
  postal: string;
  region: string;
}
// export interface visaOptionResponse {
//   status: boolean,
//   message: string,
//   data:object,
//   // data: [{
//   //   visaDocuments: object;
//   //   visaTypes: object;
//   //   numOfEntries: object;
//   //   visaIncludes: object;
//   //   worldCurrencies: object;
//   // }]
// }