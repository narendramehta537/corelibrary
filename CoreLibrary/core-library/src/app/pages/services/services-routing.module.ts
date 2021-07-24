import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { ServicesComponent } from './services.component';
import { InstaComponent } from './insta/insta.component';
import { TwtComponent } from './twt/twt.component';
import { PinComponent } from './pin/pin.component';

const routes: Routes = [{
  path: '',
  component: ServicesComponent,
  children: [
    {
      path: 'insta',
      component: InstaComponent
    },
    {
      path: 'twt',
      component: TwtComponent
    },
    {
      path: 'pin',
      component: PinComponent
    },
  ]
}]

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class ServicesRoutingModule { }
