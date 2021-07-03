import { Template } from '@angular/compiler/src/render3/r3_ast';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { SocialQueryModel } from 'src/app/core/models/QueryModels';
import { UtilsService } from 'src/app/core/services/utils.service';
import { CardComponent } from 'src/app/shared/components/card/card.component';
import { environment } from 'src/environments/environment';
import { String } from 'typescript-string-operations';
import * as data from './tweets.data.json';
import * as htmlToImage from 'html-to-image';
import { toPng, toJpeg, toBlob, toPixelData, toSvg } from 'html-to-image';

@Component({
  selector: 'app-administration',
  templateUrl: './administration.component.html',
  styleUrls: ['./administration.component.scss']
})
export class AdministrationComponent implements OnInit {

  dataSource: CardComponent[] = [];
  tweetData: any = data;
  constructor(private utilService: UtilsService) {
    for (let index = 0; index < 3; index++) {
      let card = new CardComponent(this.utilService);
      card.imageSrc = 'https://www.sciencenews.org/wp-content/uploads/2016/10/102116_EC_bubble_nucleus_main_0.jpg';
      card.onHoverShowDetails = true;
      this.dataSource.push(card);
    }

    // utilService.SampleData.images.map((img) => {
    //   let card = new CardComponent(utilService);
    //   card.imageSrc = img;
    //   // card.onHoverShowDetails = true;
    //   this.dataSource.push(card);
    // })
  }

  currentPageResponse: any;
  cursorText = '';
  tweetsList = [];
  @ViewChild(TemplateRef) customCard: TemplateRef<any>;

  ngOnInit(): void {




    this.instaLogin();
    //this.getTweets();

  }

  ngAfterViewInit() {

  }
  async instaLogin() {
    //IGQVJYUDhpN0hZAQ3N2U3JzemhZAMVZA2MFBmU2IwMUVrRzh0dkxOd2NVV2pxMWpNV3hDdHBmdFlGQmF0ZAWxsZAnRtVjNsSTF2eWduQm5vWEFIR09DTkZAaNDRBS29fRnp0M1Q2ZAjdXTGlkMFB5QUVPR1NFegZDZD
    let url = `https://api.instagram.com/oauth/authorize?client_id=1215772298875241&redirect_uri=https://localhost:4200/oauth&scope=user_profile,user_media&response_type=code`;
    let params = {
      client_id: 1215772298875241,
      redirect_uri: 'https://localhost:4200/oauth',
      response_type: 'code',
      scope: 'user_profile,user_media',
      // state:1
    };

    // fetch(url, {
    //   mode: 'cors', headers: {
    //     'Access-Control-Allow-Origin': '*'
    //   }
    // }).then((res) => {
    //   console.log(res);
    // }, (error) => {
    //   console.log(error);
    // })
    // this.utilService.getRequestUnhandled('https://api.instagram.com/oauth/authorize', params).subscribe((res) => {
    //   debugger;
    // }, (error) => {
    //   console.log(error);
    // });

    // let resp = await this.utilService.postRequestUnHandled('https://api.instagram.com/oauth/access_token',)
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
          card.setCardValue({ imageSrc: media[0].media_url });
          this.dataSource.push(card);
        }
      });
      let cursor = this.utilService.getBetween(this.currentPageResponse, 'operation":{"cursor":{"value":"', '"');
      if (cursor) {
        this.cursorText = cursor[1];
      }

    } while (++index < 5 && this.cursorText)
  }

  downloadAsPng(filename: string, index: number): void {
    document.getElementById(`non-printable-${index}`).style.display = 'none';

    htmlToImage.toPng(document.getElementById(`printable-${index}`)).then((dataurl) => {
      const link: any = document.createElement('a');

      link.download = `${filename}.png`;
      link.href = dataurl;
      link.click();

      document.getElementById(`non-printable-${index}`).style.display = 'block';
    });
  }

}
