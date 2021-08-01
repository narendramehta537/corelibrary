import { AfterContentChecked, ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { UtilsService } from 'src/app/core/services/utils.service';
import * as Enumerable from 'linq';
import { environment } from 'src/environments/environment';
import { FileQueryModel } from 'src/app/core/models/QueryModels';
import { CardComponent } from '../card/card.component';
import { saveAs } from "file-saver";

@Component({
  selector: 'app-card-container',
  templateUrl: './card-container.component.html',
  styleUrls: ['./card-container.component.scss']
})
export class CardContainerComponent implements OnInit, OnChanges {

  // @Input() rowSize = 5;
  @Input() dataSource: CardComponent[] = [];;
  @Input() showDownloadAll = true;
  @Input() showExportUrls = true;
  @Input() cardWrapperClass = 'col-sm-6 col-md-6 col-lg-3';

  countedArr = [];

  constructor(private utilService: UtilsService, private cdr: ChangeDetectorRef) {

  }

  ngOnChanges(changes: SimpleChanges): void {
  }

  ngOnInit(): void {
  }

  ngAfterViewChecked(): void {
    this.cdr.detectChanges();
  }

  downloadImages() {
    Enumerable.from(this.dataSource).forEach((item) => {
      item.cards.forEach(async (card) => {
        if (card?.media?.src)
          await this.utilService.downloadWithResponseFileName(environment.apiEndPoint.file.downloadFile, null, new FileQueryModel(card.media.src))
            .toPromise();
      })

    });
  }

  exportUrls() {
    let links = [];
    this.dataSource.forEach((item, index, arr) => {
      let temp = `${item.cards.map(a => `"${a.media.src}"`).join(',')}`;
      links.push(temp)
    })
    const blob = new Blob([links.join('\n')], { type: 'text/csv' });
    saveAs(blob, 'Export Url.csv');
    // const url = window.URL.createObjectURL(blob);
    // window.open(url);
  }


}
