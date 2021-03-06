import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import { AuthenticationService } from 'src/app/core/services/authentication.service';

@Component({
  selector: 'app-nav-bootstrap',
  templateUrl: './nav-bootstrap.component.html',
  styleUrls: ['./nav-bootstrap.component.scss']
})
export class NavBootstrapComponent implements OnInit {

  isLoggedIn = false;
  constructor(private authService: AuthenticationService) {
    this.isLoggedIn = authService.isLoggedIn;
  }
  ngAfterViewInit() {

  }
  ngOnInit() {
  }

  signOut() {
    this.authService.logOut();
  }
}
