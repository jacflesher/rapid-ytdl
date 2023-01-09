import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class RequestbuilderService {

  constructor(private httpClient: HttpClient) { }

  getSubmit(getSubmitEndpoint: string): Observable<any> {
    // let httpHeaders = new HttpHeaders().set('Authorization', 'Bearer ' + authtoken);
    // return this.httpClient.get(getSubmitEndpoint, {headers: httpHeaders, responseType: 'json'})
    return this.httpClient.get(getSubmitEndpoint, {responseType: 'json'})
  }

  getToken(getTokenEndpoint: string): Observable<any> {
    let httpHeaders = new HttpHeaders().set('Metadata-Flavor', 'Google');
    return this.httpClient.get(getTokenEndpoint, {headers: httpHeaders, responseType: 'text'})
  }
}
