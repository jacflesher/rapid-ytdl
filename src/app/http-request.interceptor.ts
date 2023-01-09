import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpHeaders,
  HttpClient,
  HttpBackend
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { HomeComponent } from './home/home.component';
import { RequestbuilderService } from './requestbuilder.service';


@Injectable()
export class HttpRequestInterceptor implements HttpInterceptor {
  httpClient: HttpClient;
  token: string;
  constructor() {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // request = request.clone({
    //   setHeaders: {
    //     Authorization: 'Bearer ' + this.token
    //   }
    // })
    return next.handle(request);
  }
}
