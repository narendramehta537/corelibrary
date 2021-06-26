import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavIconToolbarComponent } from './nav-icon-toolbar/nav-icon-toolbar.component';
import { NavBootstrapComponent } from './nav-bootstrap/nav-bootstrap.component';
import { FooterComponent } from './footer/footer.component';
import { NavTopComponent } from './nav-top/nav-top.component';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    RouterModule
  ],
  declarations: [NavIconToolbarComponent, NavBootstrapComponent, FooterComponent, NavTopComponent],
  exports: [NavIconToolbarComponent, NavBootstrapComponent, FooterComponent, NavTopComponent]

})
export class LayoutModule { }
