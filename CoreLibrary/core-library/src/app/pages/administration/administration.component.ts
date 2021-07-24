import { Component, OnInit } from '@angular/core';
import { UtilsService } from 'src/app/core/services/utils.service';
import { CardComponent } from 'src/app/shared/components/card/card.component';
import * as htmlToImage from 'html-to-image';
import { FormTemplate } from 'src/app/core/models/components/Form';
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
      let card = new CardComponent(this.utilService).setCardValue({
        media: { src: 'https://www.sciencenews.org/wp-content/uploads/2016/10/102116_EC_bubble_nucleus_main_0.jpg' },
        onHoverShowDetails: true
      });
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


