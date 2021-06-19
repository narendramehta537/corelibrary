import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { CoreModule } from '../core/core.module';
import { CardComponent } from './components/card/card.component';
import { CardContainerComponent } from './components/card-container/card-container.component';
import { FormModule } from './modules/form/form.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [CardComponent, CardContainerComponent],

  imports: [
    CommonModule,
    RouterModule,
    CoreModule,
    FormModule,
    HttpClientModule,
    NgbModule,
    ReactiveFormsModule
  ],
  exports: [CardComponent, CardContainerComponent],
})
export class SharedModule { }
