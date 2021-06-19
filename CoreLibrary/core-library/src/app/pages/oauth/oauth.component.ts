import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { error } from 'protractor';
import { UtilsService } from 'src/app/core/services/utils.service';

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

    let postData = {
      client_id: 1215772298875241,
      client_secret: 'f62aaa040fc0aa5d3e8dea2830988eec',
      code: this.code,
      grant_type: 'authorization_code',
      redirect_uri: 'https://localhost:4200/oauth'
      // state:1
    };

    fetch('https://api.instagram.com/oauth/authorize', { body: JSON.stringify(postData) }).then((response) => {
      // debugger
    }, error => {
      // debugger
    })



    // this.utilService.postRequestUnHandled('https://api.instagram.com/oauth/authorize', postData).subscribe((res: any) => {
    //   localStorage.setItem('tokenDetails', JSON.stringify(res));
    // }, (error) => {
    //   console.log(error);
    // });

  }

}
