import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-nav-icon-toolbar',
  templateUrl: './nav-icon-toolbar.component.html',
  styleUrls: ['./nav-icon-toolbar.component.scss']
})
export class NavIconToolbarComponent implements OnInit {

  constructor() {

  }

  ngOnInit(): void {
  }
  ngAfterViewInit() {
    this.style();
  }
  style() {
    let showMenu = (toggleId, navbarId, bodyId) => {
      let toggle = document.getElementById(toggleId);
      let navbar = document.getElementById(navbarId);
      let bodypadding = document.getElementById(bodyId);

      if (toggle && navbar) {
        toggle.addEventListener('click', () => {
          navbar.classList.toggle('expander')
          bodypadding.classList.toggle('body-pd')
        })
      }
    }
    showMenu('nav-toggle', 'navbar', 'body-pd');

    /*===== LINK ACTIVE  =====*/
    const linkColor = document.querySelectorAll('.nav__link');
    function colorLink() {
      linkColor.forEach(l => l.classList.remove('active'))
      this.classList.add('active')
    }
    linkColor.forEach(l => l.addEventListener('click', colorLink))


    /*===== COLLAPSE MENU  =====*/
    const linkCollapse = document.getElementsByClassName('collapse__link')

    for (let i = 0; i < linkCollapse.length; i++) {
      linkCollapse[i].addEventListener('click', function () {
        const collapseMenu = this.nextElementSibling
        collapseMenu.classList.toggle('showCollapse')

        const rotate = collapseMenu.previousElementSibling
        rotate.classList.toggle('rotate')
      })
    }
  }

}
