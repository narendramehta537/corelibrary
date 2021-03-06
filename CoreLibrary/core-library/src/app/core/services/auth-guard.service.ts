import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from './authentication.service';

@Injectable()
export class AuthGuardService implements CanActivate {

  constructor(private router: Router,
    private authService: AuthenticationService) { }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    const isLoggedIn = this.authService.isLoggedIn;
    const isLoginForm = route.routeConfig.path === 'login';
    if (isLoggedIn && (isLoginForm || route.routeConfig.path === '')) {
      this.router.navigate(['/dashboard']);
      return false;
    }

    if (!isLoggedIn && !isLoginForm) {
      this.router.navigate(['/login']);
      return false;
    }


    return isLoggedIn || isLoginForm;
  }
}
