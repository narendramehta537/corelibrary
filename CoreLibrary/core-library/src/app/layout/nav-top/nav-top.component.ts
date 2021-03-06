import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/core/services/authentication.service';

@Component({
  selector: 'app-nav-top',
  templateUrl: './nav-top.component.html',
  styleUrls: ['./nav-top.component.scss']
})
export class NavTopComponent implements OnInit {

  constructor(public authService: AuthenticationService) {
    console.log(authService.tokenDetails);
  }

  ngOnInit(): void {
  }

}
