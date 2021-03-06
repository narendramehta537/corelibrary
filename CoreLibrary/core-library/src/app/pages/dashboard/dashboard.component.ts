import { Component, OnInit } from '@angular/core';
import { SampleData } from 'src/app/core/contents/SampleData';
import { UtilsService } from 'src/app/core/services/utils.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  constructor(public utilService: UtilsService) {

  }

  ngOnInit(): void {
  }

}
