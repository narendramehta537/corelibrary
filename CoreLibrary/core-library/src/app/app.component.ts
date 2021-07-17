import { Component } from '@angular/core';
import { Constants } from './core/models/Constants';
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
    let data = localStorage.getItem(Constants.secureData);
    if (data) {
      data = JSON.parse(data);
      let currentTime = new Date().getTime();
      if ((data['ts'] - currentTime) > 180000) localStorage.removeItem(Constants.secureData);
    }

  }
  title = 'core-library';
  //NOTE: comment @import "./app/layout/nav-bootstrap/nav-bootstrap.component.scss"; in style.scss to work top nav properly
  topNav = false;

}
