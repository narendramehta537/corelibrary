import { AfterContentInit, Component, ContentChild, Input, OnInit, TemplateRef } from '@angular/core';
import { CardTemplate } from 'src/app/core/models/CardTemplates';
import { FileQueryModel } from 'src/app/core/models/QueryModels';
import { UtilsService } from 'src/app/core/services/utils.service';
import { environment } from 'src/environments/environment';
import { String } from 'typescript-string-operations';

export interface ICardComponent {
  imageSrc?: string;
  title?: string;
  text?: string;
  redirectUrl?: string;
  showDownload?: boolean;
}

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {

  @Input() imageSrc: string;
  @Input() title: string = 'title';
  @Input() text: string = 'Some quick example text to build on the card title and make up the bulk of the card\'s content.';
  @Input() redirectUrl: string;
  @Input() showDownload = true;
  @Input() cardTemplate: CardComponent;
  @Input() onHoverShowDetails = false;
  customCardTemplate: TemplateRef<any>;

  constructor(private utilService: UtilsService) {
  }

  ngOnInit(): void {
    if (this.cardTemplate) {
      this.imageSrc = this.cardTemplate.imageSrc;
      this.title = this.cardTemplate.title;
      this.text = this.cardTemplate.text;
      this.redirectUrl = this.cardTemplate.redirectUrl;
      this.showDownload = this.cardTemplate.showDownload;
      this.onHoverShowDetails = this.cardTemplate.onHoverShowDetails;
      this.customCardTemplate = this.cardTemplate.customCardTemplate;
    }
  }

  setCardValue(card?: ICardComponent) {
    this.utilService.setClassValuesFromInterfaceObj(card, this);
  }


  downloadImage() {
    this.utilService.downloadWithResponseFileName(environment.apiEndPoint.file.downloadFile, null, new FileQueryModel(this.imageSrc))
      .subscribe((res) => {
      });
    // this.utilService.downloadWithResponseFileName(this.imageSrc);
  }

}
