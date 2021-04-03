import { Component, OnInit } from '@angular/core';
import { SampleData } from 'src/app/core/contents/SampleData';
import { UtilsService } from 'src/app/core/services/utils.service';
import { CardComponent } from 'src/app/shared/components/card/card.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  dataSource: CardComponent[] = [];
  constructor(private utilService: UtilsService) {
    utilService.SampleData.images.map((img) => {
      let card = new CardComponent(utilService);
      card.imageSrc = img;
      this.dataSource.push(card);
    })
  }

  ngOnInit(): void {
  }

}
