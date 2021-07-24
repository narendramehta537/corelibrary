import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { catchError, map } from 'rxjs/operators';
import { of, throwError } from 'rxjs';
import { TokenModel } from 'src/app/shared/models/token-models';
import { LoginModel } from 'src/app/shared/models/authentication-models';
import { Constants } from '../models/Constants';

@Injectable()
export class AuthenticationService {
  tokenDetails: TokenModel;
  isLoggedIn = false;
  constructor(private router: Router, private httpClient: HttpClient) { //private httpClient: HttpClient,
    let storageToken = localStorage.getItem(environment.tokenName);
    if (storageToken) {
      this.tokenDetails = JSON.parse(storageToken);
      if (this.tokenDetails.token) this.isLoggedIn = true;
    }
  }
  login(loginModel: LoginModel) {
    const params = {
      username: loginModel.username,
      password: loginModel.password
    }
    return this.httpClient.post(environment.apiEndPoint.auth.login, loginModel)
      .pipe(
        map((res) => res),
        map((body) => body),
        catchError((err) => throwError(err))
      );
  }

  getInstaToken() {
    let instaTokenDetails = localStorage.getItem(Constants.instaToken);
    return JSON.parse(instaTokenDetails).access_token;
  }

  logOut() {
    localStorage.removeItem(environment.tokenName);
    this.isLoggedIn = false;
    this.router.navigate(['/login']);
  }
}
