import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { LoginModel } from 'src/app/shared/models/authentication-models';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginModel: LoginModel = new LoginModel();
  submitted = false;
  errorMessage = '';
  constructor(private authService: AuthenticationService, private router: Router) {

  }

  ngOnInit(): void {
  }
  onSubmit() {
    this.authService.login(this.loginModel)
      .toPromise()
      .then((res: any) => {
        if (res && res.token) {
          localStorage.setItem('tokenDetails', JSON.stringify(res));
          this.authService.isLoggedIn = true;
          this.router.navigate(['/dashboard']);
          window.location.reload();
        }
        else {
          this.errorMessage = 'Invalid Email or password';
        }
      })
      .catch(err => {
        this.errorMessage = err.statusText || 'Something went wrong';
      });
  }
}
