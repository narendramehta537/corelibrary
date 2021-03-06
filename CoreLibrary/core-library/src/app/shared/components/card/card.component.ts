import { Component, Input, OnInit } from '@angular/core';

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
  constructor() { }

  ngOnInit(): void {
  }

}
