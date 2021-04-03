import { Component, Input, OnInit } from '@angular/core';
import { FileQueryModel } from 'src/app/core/models/QueryModels';
import { UtilsService } from 'src/app/core/services/utils.service';
import { environment } from 'src/environments/environment';
import { String } from 'typescript-string-operations';

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

  constructor(private utilService: UtilsService) { }

  ngOnInit(): void {
  }

  downloadImage() {
    this.utilService.downloadWithResponseFileName(environment.apiEndPoint.file.downloadFile, null, new FileQueryModel(this.imageSrc))
      .subscribe((res) => {

      });
    // this.utilService.downloadWithResponseFileName(this.imageSrc);
  }

}
