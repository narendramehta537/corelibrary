import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { CoreModule } from 'src/app/core/core.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { ServicesRoutingModule } from './services-routing.module';
import { InstaComponent } from './insta/insta.component';
import { FormsModule } from '@angular/forms';
import { FormModule } from 'src/app/shared/modules/form/form.module';
import { TwtComponent } from './twt/twt.component';
import { PinComponent } from './pin/pin.component';


@NgModule({
  declarations: [InstaComponent, TwtComponent, PinComponent],
  imports: [
    CommonModule,
    ServicesRoutingModule,
    CoreModule,
    SharedModule,
    FormsModule,
    FormModule
  ]
})
export class ServicesModule { }
