import { Component, OnInit } from '@angular/core';
import { SocialQueryModel } from 'src/app/core/models/QueryModels';
import { UtilsService } from 'src/app/core/services/utils.service';
import { CardComponent } from 'src/app/shared/components/card/card.component';
import { environment } from 'src/environments/environment';
import * as data from './tweets.data.json';

@Component({
  selector: 'app-twt',
  templateUrl: './twt.component.html',
  styleUrls: ['./twt.component.scss']
})
export class TwtComponent implements OnInit {

  tweetData: any = data;
  currentPageResponse: any;
  tweetsList: any;
  dataSource: any;
  cursorText = '';

  constructor(private utilService: UtilsService) { }

  ngOnInit(): void {
  }
  async getTweets() {
    let username = 'AnimalsWorId';
    let index = 0;
    do {

      let res: any = await this.utilService.getRequestUnhandled(environment.apiEndPoint.twt.tweets, new SocialQueryModel({
        UserName: encodeURIComponent(username), Cursor: encodeURIComponent(this.cursorText)
      })).toPromise().catch((error) => {
        console.log(error);
      });

      this.currentPageResponse = res.data;
      let tweets = JSON.parse(this.currentPageResponse).globalObjects.tweets;
      Object.keys(tweets).forEach((key) => {
        this.tweetsList.push(tweets[key]);
        let media = tweets[key].entities.media;
        if (media) {
          let card = new CardComponent(this.utilService);
          card.setCardValue({ media: { src: media[0].media_url } });
          this.dataSource.push(card);
        }
      });
      let cursor = this.utilService.getBetween(this.currentPageResponse, 'operation":{"cursor":{"value":"', '"');
      if (cursor) {
        this.cursorText = cursor[1];
      }

    } while (++index < 5 && this.cursorText)
  }

}
