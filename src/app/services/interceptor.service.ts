import { UserModel } from './../models/user.model';
import { AuthService } from './auth.service';
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpParams } from '@angular/common/http';

@Injectable()
export class InterceptorService implements HttpInterceptor {

  constructor(private authService: AuthService) { }

  // ATTACH USER TOKEN TO REQUESTS IF NOT SIGNING IN OR UP
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const user: UserModel = this.authService.getUser();
    if (user) {
      const modifiedRequest = req.clone({
        params: new HttpParams().set('auth', user.getToken())
      });
      return next.handle(modifiedRequest);
    }
    return next.handle(req);
  }

}
