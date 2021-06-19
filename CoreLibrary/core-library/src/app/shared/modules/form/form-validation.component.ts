import { Component, Input, OnInit } from '@angular/core';
import { Func } from 'src/app/core/classes/Funcs';
import { ValidationType } from 'src/app/core/models/components/Form';

@Component({
  selector: 'app-form-validation',
  template: '',
  styles: [''],
})
export class FormValidationComponent implements OnInit {

  @Input() type: "required" | "function" | "pattern" = 'pattern';// ValidationType = ValidationType.pattern;
  @Input() pattern: string;
  @Input() message: string;
  @Input() func?: Func;

  constructor() { }

  ngOnInit(): void {
  }

}
