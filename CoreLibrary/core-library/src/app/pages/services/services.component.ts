import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UtilsService } from 'src/app/core/services/utils.service';
import { CardComponent } from 'src/app/shared/components/card/card.component';

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss']
})
export class ServicesComponent implements OnInit {

  pathName = location.pathname;
  dataSource: CardComponent[] = [];

  constructor(private utilService: UtilsService) {

  }

  //https://similarpng.com/
  ngOnInit(): void {
    let card = [
      new CardComponent(this.utilService)
        .setCardValue({
          title: 'Instagram',
          fontClass: 'fg-theme',
          media: {
            src: '/assets/images/insta-logo.png',
          },
          onHoverShowDetails: true,
          redirectUrl: '/services/insta',
          redirectName: 'Visit',
          text: 'Instagram (from Facebook) allows you to create and share your photos, stories, and videos with the friends and followers you care about.'
        }),
      new CardComponent(this.utilService)
        .setCardValue({
          title: 'Twitter',
          fontClass: 'fg-theme',
          media: {
            src: '/assets/images/twt-logo.png',
          },
          onHoverShowDetails: true,
          redirectUrl: '/services/twt',
          redirectName: 'Visit',
          text: "Join the conversation! Expand your social network and stay updated on what's trending now. Retweet, chime in on a thread, go viral, or just scroll through ."
        }),

      new CardComponent(this.utilService)
        .setCardValue({
          title: 'Pinterest',
          fontClass: 'fg-theme',
          media: {
            src: '/assets/images/pin-logo.png',
          },
          onHoverShowDetails: true,
          redirectUrl: '/services/pin',
          redirectName: 'Visit',
          text: "Looking for creative ideas? Whether you're planning your next big travel adventure, searching for home design concepts, looking for fashion & fitness ..."
        }),

    ];
    this.dataSource.push(...card);
  }

}
