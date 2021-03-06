import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { UtilsService } from './utils.service';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  profilePic: string;
  loggedInUser: any;

  constructor(private utilService: UtilsService) { }

  refreshProfilePic() {
    this.utilService.getRequest(environment.apiEndPoint.user.profilePic).subscribe((res) => {
      if (res && res.profilePictureUrl) {
        this.profilePic = this.utilService.getProfileUrl(res.profilePictureUrl);
      } else {
        this.profilePic = '';
      }
    });
  }
  refreshLoggedUserDetails() {
    this.utilService.getRequest(environment.apiEndPoint.user.userLoggedIn).subscribe((res) => {
      this.loggedInUser = res;
    });
  }
}
