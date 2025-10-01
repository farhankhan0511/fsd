import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Iregister } from '../models/iregister';
import { Observable, throwError } from 'rxjs';
import { Ilogin } from '../models/ilogin';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private httpClient:HttpClient) { }

  registerUser(user:Iregister):Observable<any>{
    return this.httpClient.post('/apiX/users',user)
  }
  loginUser(user:Ilogin):Observable<any>{
    return this.httpClient.post('http://172.10.8.61:8080/sports-backend-0.0.1-SNAPSHOT/api/auth',user).pipe(
      catchError((error) => {
        console.error('Login failed:', error);
        return throwError(error);
      })
    );
  }
}
