import { Http } from '@angular/http';
import { MainServiceService } from './main.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/delay';

// import { User } from '../models/index';
import { DataServiceService } from './data-service.service';

@Injectable()
export class UserService {
    users: any
    constructor(private _http: HttpClient, private http: Http, private dataService: DataServiceService, private mainService: MainServiceService) { }

    /**
     * Check Email Validity
     * @param email 
     */
    checkEmailNotTaken(email: string) {
        return this.http.get(this.mainService.url+'auth/checkEmail')
          .delay(1000)
          .map(res => res.json())
          .map(users => users.filter(user => user.email === email))
          .map(users => !users.length);
    }

    // getAll() {
    //     return this.http.get<User[]>('/api/users');
    // }

    // getById(id: number) {
    //     return this.http.get('/api/users/' + id);
    // }

    /**
     * 
     * @param url 
     * @param obj 
     */
    create(url,obj): Observable<regUser> {
        return this._http.post<regUser>(url, obj);
    }

    // update(user: User) {
    //     return this.http.put('/api/users/' + user.id, user);
    // }

    // delete(id: number) {
    //     return this.http.delete('/api/users/' + id);
    // }
}

interface regUser{
    message: string,
    status: boolean,
    data:object
  }