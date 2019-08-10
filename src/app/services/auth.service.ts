import { LocalStorageService } from './local-storage.service';
import { UserModel } from './../models/user.model';
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { throwError, Subject } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';

interface AuthResponseData {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private http: HttpClient,
    private localStorageService: LocalStorageService,
    private router: Router
  ) { }

  private user: UserModel;
  userUpdate = new Subject<UserModel>();

  private firebaseAPI = 'AIzaSyBRr1xTqrDn_R-gczdadRzRLCPRBz_GeiE';

  logIn(email: string, password: string) {
    return this.http.post<AuthResponseData>(
              'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + this.firebaseAPI,
              {email, password, returnSecureToken: true}
            )
            .pipe(
              catchError(this.handleAuthErrorResponse),
              tap(res => this.handleAuthSuccessResponse(res))
            );
  }
  register(email: string, password: string) {
    return this.http.post<AuthResponseData>(
            'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' + this.firebaseAPI,
            {email, password, returnSecureToken: true}
          ).pipe(
            catchError(this.handleAuthErrorResponse),
            tap(res => this.handleAuthSuccessResponse(res))
          );
  }

  handleAuthErrorResponse(err: HttpErrorResponse) {
    let errorMsg = 'Error ocured';
    if (err.error.error.message) {
      switch (err.error.error.message) {
        case 'EMAIL_NOT_FOUND':
          errorMsg = 'Email was not found!';
          break;
        case 'EMAIL_EXISTS':
          errorMsg = 'Email already registered!';
          break;
        case 'TOO_MANY_ATTEMPTS_TRY_LATER':
          errorMsg = 'Too many attempts, try later!';
          break;
        case 'EMAIL_NOT_FOUND':
          errorMsg = 'Email was not found!';
          break;
        case 'INVALID_PASSWORD':
          errorMsg = 'Password is invalid!';
          break;
        case 'USER_DISABLED':
          errorMsg = 'User is disabled by admin';
          break;
      }
    }
    return throwError(errorMsg);
  }

  handleAuthSuccessResponse(res: any) {
    const expires = new Date(new Date().getTime() + +res.expiresIn * 1000);
    const user = new UserModel(res.email, res.idToken, expires);
    this.user = user;
    this.userUpdate.next(user);
    this.localStorageService.saveItem('user', user);
  }

  // RETUR USER IF USER OR IF USER IN LOCAL STORAGE
  getUser() {
    if (this.user) {
      return this.user;
    } else {
      const localStorageUser = this.localStorageService.getItem('user');
      if (localStorageUser) {
        this.user = localStorageUser;
        this.userUpdate.next(localStorageUser);
        return localStorageUser;
      }
    }
    return null;
  }

  logOut() {
    this.user = null;
    this.localStorageService.removeItem('user');
    this.userUpdate.next(null);
    this.router.navigate(['/']);
  }

}
