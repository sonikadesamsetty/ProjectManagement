import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from './models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  getAllUsers() {
    const token = localStorage.getItem("token");
    const headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + token 
  });
    return this.httpClient.get<User[]>('http://localhost:8088/auth-service/users',{ headers});
  }

  loggedInUser!: string;
  httpClient = inject(HttpClient);
  registerUser(email: any, password: any): Observable<any> {
    const obj = {
      email: email,
      password: password
    }

    return this.httpClient.post('http://localhost:8088/auth-service/register', obj);
  }

  loginUser(email: any, password: any): Observable<any> {
    const obj = {
      email: email,
      password: password
    }
    return this.httpClient.post('http://localhost:8088/auth-service/login', obj);
  }

  getLoggedInUser() {
    return this.loggedInUser;
  }

  setLoggedInUser(user: string) {
    this.loggedInUser = user;
    console.log(this.loggedInUser);
  }
  constructor() { }
}