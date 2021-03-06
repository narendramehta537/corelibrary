import { Component } from '@angular/core';
import { AuthenticationService } from './core/services/authentication.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  isAuthorized = false;
  constructor(private authService: AuthenticationService) {
    this.isAuthorized = authService.isLoggedIn;
  }
  title = 'core-library';
  //NOTE: comment @import "./app/layout/nav-bootstrap/nav-bootstrap.component.scss"; in style.scss to work top nav properly
  topNav = false;

}
