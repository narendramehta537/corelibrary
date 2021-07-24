import { AfterContentInit, Component, ContentChild, Input, OnInit, TemplateRef } from '@angular/core';
import { CardTemplate } from 'src/app/core/models/CardTemplates';
import { FileQueryModel } from 'src/app/core/models/QueryModels';
import { UtilsService } from 'src/app/core/services/utils.service';
import { environment } from 'src/environments/environment';
import { String } from 'typescript-string-operations';

export interface IMedia {
  src?: string;
  type?: 'Audio' | 'Video' | 'Image';
  ext?: string;
}

export interface ICardTemplate {
  media?: IMedia;
  title?: string;
  text?: string;
  redirectUrl?: string;
  redirectName?: string;
  showDownload?: boolean;
  onHoverShowDetails?: boolean;
  fontClass?: string;
}

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {

  @Input() cards: ICardTemplate[] = [];
  @Input() cardTemplate: CardComponent;
  customCardTemplate: TemplateRef<any>;

  currentIndex = 0;
  images = ["https://i.pinimg.com/236x/e5/f4/89/e5f48909ee5a2ba064e1914e9368e398.jpg",
    "https://i.pinimg.com/236x/3b/18/cf/3b18cf9dd99784b6dd9b476e76979150.jpg",
    "https://i.pinimg.com/236x/e3/86/01/e386018e123942bf74170443136f6377.jpg",
    "https://i.pinimg.com/236x/83/88/92/838892b2b0d10509aab8dcbe47fe02d8.jpg",
    "https://i.pinimg.com/236x/0b/eb/00/0beb0029521af83bf32568a21c10a135.jpg",
    "https://i.pinimg.com/236x/23/44/30/234430af1c76678bcdb68fed26c06955.jpg",
    "https://i.pinimg.com/236x/37/cf/7d/37cf7dbf301c59c4a0eb9653430dc9d9.jpg",
    "https://i.pinimg.com/236x/40/d0/9e/40d09e5a2bc255fe8f1075cc9ff58ef9.jpg"];

  slickConfig = {
    enabled: false,
    initialSlide: this.currentIndex,
    arrows: true,
    swipe: true,
    dots: true,
    // slidesToShow: 4,
    // slidesToScroll: 4,
    // autoplay: true,
    // autoplaySpeed: 2000,
    method: {},
    event: {
      init: (event, slick) => {
        slick.slickGoTo(this.currentIndex);
      },
      afterChange: (event, slick, currentSlide, nextSlide) => {
        this.currentIndex = currentSlide;
      }
    }
  };

  constructor(private utilService: UtilsService) {
  }

  ngOnInit(): void {
    if (this.cardTemplate) {
      // this.cardTemplate.cards = this.cardTemplate.cards;
      this.customCardTemplate = this.cardTemplate.customCardTemplate;
    }
  }

  setCardValue(card?: ICardTemplate) {
    this.cards.push(this.setCardDefault(card));
    return this
  }
  setCards(cards?: ICardTemplate[]) {
    cards.map((card) => {
      this.cards.push(this.setCardDefault(card));
    })
    return this
  }

  setCardDefault(card?: ICardTemplate) {
    card.title = card.title || 'title';
    card.text = card.text || 'Some quick example text to build on the card title and make up the bulk of the card\'s content.';
    card.redirectName = card.redirectName || 'Link';
    card.showDownload = true;
    card.media && (card.media = { src: card.media.src, type: card.media.type || 'Image' });
    return card;
  }

  downloadMedia(mediaSrc) {
    // window.open(this.imageSrc);
    this.utilService.downloadWithResponseFileName(environment.apiEndPoint.file.downloadFile, null, new FileQueryModel(mediaSrc))
      .subscribe((res) => {
      });
    // this.utilService.downloadWithResponseFileName(this.imageSrc);
  }

}
