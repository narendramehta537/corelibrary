import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { CoreModule } from '../core/core.module';



@NgModule({
  declarations: [],

  imports: [
    CommonModule,
    RouterModule,
    CoreModule,
    HttpClientModule
  ]
})
export class SharedModule { }
