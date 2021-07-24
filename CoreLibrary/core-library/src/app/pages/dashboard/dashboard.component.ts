import { Component, OnInit } from '@angular/core';
import { SampleData } from 'src/app/core/contents/SampleData';
import { QueryModel } from 'src/app/core/models/QueryModels';
import { UtilsService } from 'src/app/core/services/utils.service';
import { CardComponent } from 'src/app/shared/components/card/card.component';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  dataSource: CardComponent[] = [];
  instDataSource: CardComponent[] = [];
  cursor: string;
  userInfo: any;
  pageInfo: PageInfo;

  constructor(private utilService: UtilsService) {
    utilService.SampleData.images.map((img) => {
      let card = new CardComponent(utilService);
      card.imageSrc = img;
      // card.onHoverShowDetails = true;
      this.dataSource.push(card);
    })
  }

  ngOnInit(): void {
    let queryModel = new QueryModel({ Url: 'https://www.instagram.com/serbanlorena' });
    this.utilService.postRequestUnHandled(environment.apiEndPoint.insta.httpRequest, queryModel).subscribe((res) => {

    })
  }
  ngAfterViewInit() {

  }

  loadImages() {
    // let postData:InstaPagination ={}
  }
}
interface PageInfo {
  user_id: string;
  currenPage: number;
}

interface InstaPagination {
  id: string;
  first: number;
  after: string;

}
