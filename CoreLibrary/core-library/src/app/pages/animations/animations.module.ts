import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnimationsComponent } from './animations.component';
import { AnimationsRoutingModule } from './animations-routing.module';
import { RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { BubblesComponent } from './bubbles/bubbles.component';



@NgModule({
  declarations: [AnimationsComponent, BubblesComponent],
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule,
    AnimationsRoutingModule,

  ]
  , exports: [BubblesComponent]
})
export class AnimationsModule { }
