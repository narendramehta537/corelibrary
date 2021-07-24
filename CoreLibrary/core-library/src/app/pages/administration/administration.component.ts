import { Template } from '@angular/compiler/src/render3/r3_ast';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { QueryModel, SocialQueryModel } from 'src/app/core/models/QueryModels';
import { UtilsService } from 'src/app/core/services/utils.service';
import { CardComponent } from 'src/app/shared/components/card/card.component';
import { environment } from 'src/environments/environment';
import { String } from 'typescript-string-operations';

import * as htmlToImage from 'html-to-image';
import { toPng, toJpeg, toBlob, toPixelData, toSvg } from 'html-to-image';
import { FormTemplate, Operation } from 'src/app/core/models/components/Form';
import { IAjaxSettings } from 'src/app/core/models/components/Table';
import { AuthenticationService } from 'src/app/core/services/authentication.service';

@Component({
  selector: 'app-administration',
  templateUrl: './administration.component.html',
  styleUrls: ['./administration.component.scss']
})
export class AdministrationComponent implements OnInit {

  dataSource: CardComponent[] = [];

  constructor(private utilService: UtilsService, private authService: AuthenticationService) {
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


  tweetsList = [];


  formTemplate: FormTemplate;

  ngOnInit(): void {

    //this.getTweets();

  }

  ngAfterViewInit() {

  }

  //https://developers.facebook.com/docs/instagram-basic-display-api/guides/getting-access-tokens-and-permissions/






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


