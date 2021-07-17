import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
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
  @Input() id: string;
  @Input() func?: Func;
  @Output() onChange = new EventEmitter<any>();

  constructor() { }

  ngOnInit(): void {
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.onChange.emit(this);
  }

}
