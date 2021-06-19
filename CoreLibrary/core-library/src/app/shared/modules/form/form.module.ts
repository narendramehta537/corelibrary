import {
  CUSTOM_ELEMENTS_SCHEMA,
  NgModule,
  NO_ERRORS_SCHEMA,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormComponent } from './form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormItemComponent } from './form-item/form-item.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormValidationComponent } from './form-validation.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

@NgModule({
  declarations: [
    FormComponent,
    FormItemComponent,
    FormValidationComponent,
  ],
  imports: [CommonModule, FormsModule, NgbModule, ReactiveFormsModule
    , BsDatepickerModule.forRoot()],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
  exports: [
    FormComponent,
    FormItemComponent,
    FormValidationComponent
  ],
})
export class FormModule { }
