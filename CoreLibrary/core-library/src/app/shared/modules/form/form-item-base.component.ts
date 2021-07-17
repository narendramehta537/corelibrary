import { ChangeDetectorRef, Component, EventEmitter, HostListener, Input, OnInit, Output, QueryList } from '@angular/core';
import * as Enumerable from 'linq';
import { FormElement, FormTemplate, Validations, ValidationType } from 'src/app/core/models/components/Form';
import { IForValidationMessage } from 'src/app/core/models/components/Form';
import { UtilsService } from 'src/app/core/services/utils.service';
import { String as StringF } from 'typescript-string-operations';
import { formatNumber } from '@angular/common';
import { FormatNumber } from 'src/app/core/models/components/format';
import { FormControl, Validators } from '@angular/forms';
import { FormValidationComponent } from './form-validation.component';
import { BsDatepickerViewMode, BsDatepickerConfig } from 'ngx-bootstrap/datepicker';

@Component({
  selector: 'app-form-base',
  template: ''
})
export class FormItemBaseComponent implements OnInit {

  @Input() formData: any;

  //NOTE: if key assigned then pick else use dataField
  @Input() dataField: string;
  @Input() subDataField: string;
  @Input() key?: string;
  @Input() label: string;
  @Input() labelClass = 'type--label control-label';
  @Input() labelTooltip = '';
  @Input() colClass = 'mb-1';
  @Input() elementClass = '';
  @Input() subElementClass = 'w-25';
  @Input() required = false;
  @Input() type: "text" | "password" | "textarea" | "select" | "checkbox" | "custom" | 'datepicker' = "text";// FormElement = FormElement.text;
  @Input() email = false;
  @Input() readonly = false;
  @Input() disabled = false;
  @Input() subDisabled = true;
  @Input() errors = new Array<IForValidationMessage>();
  defaultValidaionErrors = new Array<IForValidationMessage>();
  @Input() compareKey?: string;
  @Input() compareErrorMessage?: string;
  @Input() placeHolder: string;
  @Input() value: any;
  @Input() hide = false;

  @Input() diplayOnView = true;
  @Input() showLabel = true;
  @Input() hideOptional = false;
  @Input() validations: Validations[] = [];
  @Input() emailPattern: string;
  @Input() requiredMessage = '{0} is required';
  @Input() formatNum: FormatNumber;
  @Input() restrictPattern: string | RegExp;
  @Output() onChange = new EventEmitter<any>();
  @Input() diplayTemplateOnView = false;


  formTemplate: FormTemplate;
  previousValue: any;
  assignedChangeEvent = false;
  @Input() multiple = false;

  formElement = FormElement;
  formValidations: QueryList<FormValidationComponent>;

  @Input() datePickerValue: Date = new Date();
  @Input() dateViewMode: BsDatepickerViewMode;
  @Input() dateColorTheme = 'theme-blue';
  @Input() dateInputFormat;

  bsConfig: Partial<BsDatepickerConfig>;

  isFocused = true;

  @HostListener('focusin', ['$event.target'])
  onFocus(target) {
    this.isFocused = true;
  }

  @HostListener('focusout', ['$event.target'])
  onFocusout(target) {
    this.isFocused = false;
  }

  get control() {
    if (this.formTemplate && this.formTemplate.formGroup) {
      return this.formTemplate.formGroup.controls[this.key];
    }
    return new FormControl();
  };
  get equals() { return this.control.value === this.formTemplate.formGroup.controls[this.compareKey].value; }
  get fieldError() { return this.formTemplate && this.formTemplate.isEdit && (this.control.invalid || this.error) && (this.touched && !this.isFocused) }

  get touched() {
    if (this.formTemplate.isEdit) {
      return this.formTemplate && this.formTemplate.formGroup.controls[this.key].touched;
    }
    return true;
  }
  get dirty() {
    if (this.formTemplate.isEdit) {
      return this.control.dirty;
    }
    return true;
  }

  get error() {
    let status = Enumerable.from(this.defaultValidaionErrors).any((a) => a.onDisplay());
    return status;
  }

  defaultEmailPattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,10}))$/;

  constructor(protected cdr: ChangeDetectorRef, public utilService: UtilsService) {

  }


  ngOnInit(): void {
    if (this.subDataField) this.elementClass = 'w-75';
    this.key = this.key || this.dataField;
    if (this.hideOptional || this.placeHolder || !(this.required && this.placeHolder)) {
      this.placeHolder = this.placeHolder || '';
    }
    else {
      this.placeHolder = 'Optional';
    }
    // NOTE : for dynamic binding we needed

    this.required && this.validations.push({
      id: 'required',
      message: this.requiredMessage,
      function: () => {
        return this.required &&
          (!this.control.value === undefined || !new RegExp("\\S").test(this.control.value) || StringF.IsNullOrWhiteSpace(this.control.value));
      }
    });

    this.email && this.validations.push({
      id: 'email',
      message: 'Please enter a valid email address.',
      pattern: (this.emailPattern || this.defaultEmailPattern)
    });

    this.compareKey && this.validations.push({
      id: 'compareField',
      message: `${this.compareErrorMessage}`,
      function: () => { return this.compareKey && !this.equals; }
    });

    this.assignValidations(this.validations);
  }
  ngAfterViewChecked() {
    this.cdr.detectChanges();
  }

  keyPressNumbers(event) {
    if (this.restrictPattern) {
      var inp = String.fromCharCode(event.keyCode);
      if (new RegExp(this.restrictPattern).test(inp)) {
        return true
      } else {
        event.preventDefault();
        return false;
      }
    }
    return true;
  }


  onChanged(e) {
    this.onChange.observers.length > 0 && this.onChange.emit(e);
    let regex = /^[0-9,]*$/;
    if (this.formatNum && this.control.value && regex.test(this.control.value) && (this.control.value !== this.previousValue)) {
      let num = typeof (this.control.value) == 'string' ? formatNumber(Number(this.control.value.replace(/,/g, '')), this.formatNum.locale, this.formatNum.digitsInfo) : this.control.value;
      this.previousValue = num;
      this.formatNum && this.control.setValue(num);
    }

  }

  assignValidations(patterns: Validations[]) {
    if (patterns.length > 0) {
      Enumerable.from(patterns).forEach((validation) => {

        let message = StringF.Format(validation.message, (this.label && this.label.toUpperCase()) || '');
        let validationType = ((validation.function && "function") || validation.type || 'pattern');

        //checking already added validation
        // here we using id to check validation item

        if (validation.id) {
          this.defaultValidaionErrors.filter((element) => {
            return element.id == validation.id
          }).forEach((valid) => {
            valid = Object.assign(valid, this.getFormValidation(validation, message, validationType));
          })
        }

        if (Enumerable.from(this.defaultValidaionErrors).any((element) => {
          return (element.id && element.id == validation.id) || (element.message == message && element.validationType == validationType);
        })) {
        }
        else {
          this.defaultValidaionErrors.push(this.getFormValidation(validation, message, validationType))
        }

      }
      )
    }
  }

  getFormValidation(validation: Validations, message: string, validationType) {
    let valid: IForValidationMessage =
    {
      id: validation.id,
      message: StringF.Format(validation.message, (this.label && this.label.toUpperCase()) || ''),
      funcMessage: () => {
        return StringF.Format(validation.message, (this.label && this.label.toUpperCase()) || '');
      },
      validationType: validationType,
      onDisplay: () => {
        if (validation.function) {
          return validation.function();
        }
        else if (validation.type && validation.type == ValidationType.required) {
          validation.message = message;
          return () => !this.control.value;
        }
        else {
          let val = this.control.value;
          return (!StringF.IsNullOrWhiteSpace(val) || val === 0) && !new RegExp(validation.pattern).test(this.utilService.trimmedValue(val));
        }
      }
    }
    return valid;

  }
  onEdit() {
    this.updateFieldChanges();
    // NOTE: since  [formControlName]="dataField" and  [(ngModel)]="formModel[dataField]" we can't use it togeather 
    // therefore we are using this invoking this event to map the data to input value
  }

  defaultValidations() {

  }
  updateFieldChanges() {
    let defaultValue = this.type == FormElement.checkbox ? false : '';
    let value = this.formData && this.formData[this.dataField];
    this.control.setValue(value === undefined ? defaultValue : value);
  }


  setValue(value) {
    this.control.setValue(value);
    // this.formData[this.key] = value;
  }

  display(e) {
    console.log(e);
    return e;
  }
}
