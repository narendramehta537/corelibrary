import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Route } from '@angular/compiler/src/core';
import { RouterModule, Routes } from '@angular/router';
import { AnimationsComponent } from './animations.component';
import { BubblesComponent } from './bubbles/bubbles.component';


const routes: Routes = [{
  path: '',
  component: AnimationsComponent,
  children: [
    {
      path: 'bubbles',
      component: BubblesComponent
    }
  ]
}]

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
  ],
  exports: [RouterModule]
})
export class AnimationsRoutingModule { }
