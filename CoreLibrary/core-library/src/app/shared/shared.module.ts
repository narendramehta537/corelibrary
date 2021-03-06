import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { CoreModule } from '../core/core.module';
import { CardComponent } from './components/card/card.component';
import { CardContainerComponent } from './components/card-container/card-container.component';



@NgModule({
  declarations: [CardComponent, CardContainerComponent],

  imports: [
    CommonModule,
    RouterModule,
    CoreModule,
    HttpClientModule
  ],
  exports: [CardComponent, CardContainerComponent],
})
export class SharedModule { }
