import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { error } from 'protractor';
import { Constants } from 'src/app/core/models/Constants';
import { QueryModel } from 'src/app/core/models/QueryModels';
import { UtilsService } from 'src/app/core/services/utils.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-oauth',
  templateUrl: './oauth.component.html',
  styleUrls: ['./oauth.component.scss']
})
export class OauthComponent implements OnInit {

  code: string;

  constructor(private utilService: UtilsService, private activatedRoute: ActivatedRoute) {
    activatedRoute.queryParams.subscribe((params) => {
      this.code = params.code;
    })

  }

  ngOnInit(): void {
    let securityData = JSON.parse(localStorage.getItem(Constants.secureData));
    delete securityData.scope
    delete securityData.ts;
    delete securityData.responseType;

    securityData.code = this.code;
    securityData.grant_type = 'authorization_code';

    let queryModel = new QueryModel({ Url: 'https://api.instagram.com/oauth/access_token', RequestType: 'POSTFORM', Form: securityData });
    this.utilService.postRequestUnHandled(environment.apiEndPoint.insta.httpRequest, queryModel).subscribe((response: any) => {
      let res = JSON.parse(response.data);
      res.ts = new Date().getTime();
      localStorage.removeItem(Constants.secureData);
      localStorage.setItem(Constants.instaToken, JSON.stringify(res));
    }, error => {
      alert(error.error.displayError);
    });

  }

}
