import { stringify } from '@angular/compiler/src/util';
import { Component, OnInit } from '@angular/core';
import { SocialQueryModel } from 'src/app/core/models/QueryModels';
import { UtilsService } from 'src/app/core/services/utils.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-administration',
  templateUrl: './administration.component.html',
  styleUrls: ['./administration.component.scss']
})
export class AdministrationComponent implements OnInit {

  dataSource: any[] = [];
  constructor(private utilService: UtilsService) { }

  ngOnInit(): void {
    debugger;
    let username = 'vponamariov';
    let cursor = '';
    this.utilService.getRequest(environment.apiEndPoint.twt.tweets, new SocialQueryModel(username)).subscribe((res) => {
      let tweets = res.globalObjects.tweets;
      Object.keys(tweets).forEach((key) => {
        let media = tweets[key].entities.media;
        if (media) {
          this.dataSource.push(media[0]);
        }
      });
    });
  }


}
