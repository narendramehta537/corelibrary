import { Component, OnInit } from '@angular/core';
// import * as $ from 'jquery';

@Component({
  selector: 'app-nav-toolbar',
  templateUrl: './nav-toolbar.component.html',
  styleUrls: ['./nav-toolbar.component.scss']
})
export class NavToolbarComponent implements OnInit {

  constructor() {

  }

  ngOnInit(): void {

  }
  ngAfterViewInit() {
    // this.style();
  }

  // style() {

  //   let $els = $('.menu a, .menu header');
  //   let count = $els.length;
  //   let grouplength = Math.ceil(count / 3);
  //   let groupNumber = 0;
  //   let i = 1;
  //   $('.menu').css('--count', count + '');
  //   $els.each(function (j) {
  //     if (i > grouplength) {
  //       groupNumber++;
  //       i = 1;
  //     }
  //     $(this).attr('data-group', groupNumber);
  //     i++;
  //   });

  //   $('.menu footer button').on('click', function (e) {
  //     e.preventDefault();
  //     $els.each(function (j) {
  //       let top = $(this)[0].getBoundingClientRect().top
  //       let dg = ($(this).attr('data-group') || 0 * -15).toString();
  //       let total = top + parseFloat(dg) - 20;
  //       if (total < 0) total = 0;
  //       $(this).css('--top', total);
  //       $(this).css('--delay-in', j * .1 + 's');
  //       $(this).css('--delay-out', (count - j) * .1 + 's');
  //     });
  //     $('.menu').toggleClass('closed');
  //     e.stopPropagation();
  //   });

  //   // run animation once at beginning for demo
  //   setTimeout(function () {
  //     $('.menu footer button').click();
  //     setTimeout(function () {
  //       $('.menu footer button').click();
  //     }, (count * 100) + 500);
  //   }, 1000);
  // }


}
