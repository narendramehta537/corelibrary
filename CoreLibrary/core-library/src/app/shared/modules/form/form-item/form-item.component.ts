import { AfterViewChecked, ContentChild, ContentChildren, OnChanges, QueryList, SimpleChanges, TemplateRef, ViewChild } from '@angular/core';
import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { Constants } from 'src/app/core/models/Constants';
import { Validations } from 'src/app/core/models/components/Form';
import { DataSourceType } from 'src/app/core/models/globals';
import { UtilsService } from 'src/app/core/services/utils.service';
import { String } from 'typescript-string-operations';
import { FormItemBaseComponent } from '../form-item-base.component';
import { FormValidationComponent } from '../form-validation.component';

@Component({
  selector: 'app-form-item',
  templateUrl: './form-item.component.html',
  styleUrls: ['./form-item.component.scss'],
  providers: [
    { provide: FormItemBaseComponent, useExisting: FormItemComponent }
  ]
})

export class FormItemComponent extends FormItemBaseComponent implements OnInit, AfterViewChecked, OnChanges {

  @Input() dataSource = [];
  @Input() displayExpr: string;
  @Input() keyExpr: string;
  @Input() diplayOnView = true;
  @Input() dataSourceType: "ObjectArray" | "Object" | "Array" = "Array";// DataSourceType = DataSourceType.;
  @Input() showPassword = false;
  @Input() defaultFirst = false;


  @ContentChild('viewLabel', { read: TemplateRef }) viewLabel: TemplateRef<any>;
  @ContentChild('customLabel', { read: TemplateRef }) customLabel: TemplateRef<any>;
  @ContentChild('customItem', { read: TemplateRef }) customItem: TemplateRef<any>;
  @ViewChild('selector') selector: any;
  @ContentChildren(FormValidationComponent, { descendants: true }) formValidations: QueryList<FormValidationComponent>;


  get getLabelFieldValue() {

    if (!this.formData || !this.formData[this.dataField] === undefined || String.IsNullOrWhiteSpace(this.formData[this.dataField]))
      return Constants.NA;

    if (this.dataSourceType == DataSourceType.Array) {
      return this.formData[this.dataField];
    }
    else if (!this.dataSource || this.dataSource.length == 0) {
      return Constants.NA;
    }
    else if (this.dataSourceType == DataSourceType.ObjectArray) {
      let data = this.dataSource.filter((currentValue, index, arr) => { return currentValue[this.keyExpr] == this.formData[this.dataField] })[0];
      return (data && data[this.displayExpr]) || Constants.NA;
    }
    else {
      let data = this.dataSource[this.formData[this.dataField]];
      return (data && data[this.displayExpr]) || Constants.NA;
    }
  }
  constructor(protected cdr: ChangeDetectorRef, public utilService: UtilsService) {
    super(cdr, utilService);
  }
  ngOnChanges(changes: SimpleChanges): void {
    let require = changes.required;
    let hide = changes.hide;
    if (require) {
      this.changeValidation(require.currentValue);
    }
    else if (hide && this.required) {
      this.changeValidation(!hide.currentValue);
    }
  }
  changeValidation(required) {
    this.control.clearValidators();
    let validators = [];
    required && validators.push(Validators.required);
    this.control.setValidators(validators);
    this.control.updateValueAndValidity()
  }


  ngAfterContentInit() {

    let patterns: Validations[] = this.formValidations.toArray().map((res) => {
      return {
        pattern: res.pattern, message: res.message, type: res.type, function: res.func
      };
    });
    this.assignValidations(patterns);

    this.bsConfig = Object.assign({}, {
      minMode: this.dateViewMode,
      containerClass: this.dateColorTheme,
      dateInputFormat: this.dateInputFormat
    });

  }

  ngAfterContentChecked() {

    this.assignedChangeEvent || this.ngAfterContentInit();
  }

  ngAfterViewInit() {

    if (this.formTemplate && this.formTemplate.formGroup) {
      this.formTemplate.formGroup.controls[this.key].valueChanges.subscribe((value) => { this.onChanged(value); });
      this.assignedChangeEvent = true;
    }
  }

  ngAfterViewChecked() {
    this.cdr.detectChanges();
  }

  changeType(e) {
    let element: any = document.getElementsByName(this.dataField)[0];
    if (element.type == 'text') {
      element.type = 'password';
      e.target.classList.remove('fa-eye');
      e.target.classList.add('fa-eye-slash');
    }
    else {
      element.type = 'text';
      e.target.classList.remove('fa-eye-slash');
      e.target.classList.add('fa-eye');
    }
  }

  returnZero() {
    return 0
  }
  selectValue() {
    if (!this.control.value) {
      this.defaultFirst && (this.keyExpr ? this.control.setValue(this.dataSource[0][this.keyExpr]) :
        this.control.setValue(this.dataSource[0][this.keyExpr]));

      this.value && this.control.setValue(this.value);
    }
    if (this.selector && this.multiple) {
      this.selector.nativeElement.multiple || this.selector.nativeElement.setAttribute('multiple', true);
    }
  }

  updateOnEnter(e) {
    this.formTemplate.isEdit && this.setValue(e.target.value);
  }


}

