import { Component, Input, OnInit } from '@angular/core';
import { from } from 'rxjs';
import { UtilsService } from 'src/app/core/services/utils.service';
import * as Enumerable from 'linq';
import { environment } from 'src/environments/environment';
import { FileQueryModel } from 'src/app/core/models/QueryModels';
import { CardTemplate } from 'src/app/core/models/CardTemplates';
import { CardComponent } from '../card/card.component';

@Component({
  selector: 'app-card-container',
  templateUrl: './card-container.component.html',
  styleUrls: ['./card-container.component.scss']
})
export class CardContainerComponent implements OnInit {

  // @Input() rowSize = 5;
  @Input() dataSource: CardComponent[] = [];
  @Input() showDownloadAll = true;

  countedArr = [];

  // get chunks() {
  //   return this.utilService.chunk(this.dataSource, this.rowSize);
  // }

  constructor(private utilService: UtilsService) {

    // this.countedArr = utilService.countedArray(this.rowSize);
  }

  ngOnInit(): void {
  }

  async downloadImages() {
    debugger;
    Enumerable.from(this.dataSource).forEach(async (item) => {
      await this.utilService.downloadWithResponseFileName(environment.apiEndPoint.file.downloadFile, null, new FileQueryModel(item.imageSrc))
        .toPromise();
    });
  }


}
