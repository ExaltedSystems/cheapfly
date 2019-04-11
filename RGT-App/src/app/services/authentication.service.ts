import { MainServiceService } from './../services/main.service';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Injectable()
export class AuthenticationService {
    constructor(private http: HttpClient,public mainService: MainServiceService) { }

    login(email: any, password: string, remember: any) {
        return this.http.post<any>(this.mainService.url+'auth/login', { email: email, password: password, remember:remember })
            .map(user => {
                console.log(user);
                // login successful if there's a jwt token in the response
                if (user && user.token) {
                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                    localStorage.setItem('currentUser', JSON.stringify(user));
                }
                return user;
            });
    }

    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('currentUser');
        // let token = localStorage.getItem('currentUser');
        // return this.http.post(this.mainService.url+'auth/logout',JSON.stringify(token)).map(res => {
        //     console.log(res);
        //     console.log('test');
        // })
    }
}