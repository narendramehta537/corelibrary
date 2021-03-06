import { Component, Input, OnInit } from '@angular/core';
import { UtilsService } from 'src/app/core/services/utils.service';

@Component({
  selector: 'app-card-container',
  templateUrl: './card-container.component.html',
  styleUrls: ['./card-container.component.scss']
})
export class CardContainerComponent implements OnInit {

  // @Input() rowSize = 5;
  @Input() dataSource = [];

  countedArr = [];

  // get chunks() {
  //   return this.utilService.chunk(this.dataSource, this.rowSize);
  // }

  constructor(private utilService: UtilsService) {
    // this.countedArr = utilService.countedArray(this.rowSize);
  }

  ngOnInit(): void {
  }



}
