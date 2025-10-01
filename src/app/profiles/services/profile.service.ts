import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

    constructor(private httpClient:HttpClient) {}

    getCurrentUserProfile(){
      return this.httpClient.get('/apiX/profile/me');
    }
   
}
