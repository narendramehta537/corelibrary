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
    let map = new Map<string, string>();
    Object.keys(securityData).forEach((key) => {
      map.set(key, securityData[key].toString())
    });

    delete securityData.scope
    delete securityData.ts;
    delete securityData.responseType;

    securityData.code = this.code;
    securityData.grant_type = 'authorization_code';

    let queryModel = new QueryModel({ Url: 'https://api.instagram.com/oauth/authorize', RequestType: 'POSTFORM', Form: securityData });
    this.utilService.postRequest(environment.apiEndPoint.insta.httpRequest, queryModel).subscribe((res) => {
      debugger;
    });

  }

}
