import { AfterContentInit, AfterViewChecked, ChangeDetectorRef, Component, ContentChild, ContentChildren, EventEmitter, Input, OnChanges, OnInit, Output, QueryList, SimpleChanges, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import * as Enumerable from 'linq';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { FormElement, FormTemplate, Operation, Position, ValidationType } from 'src/app/core/models/components/Form';
import { FormItemBaseComponent } from './form-item-base.component';
import { Location } from '@angular/common'
import { FormItemComponent } from './form-item/form-item.component';
import { UtilsService } from 'src/app/core/services/utils.service';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class FormComponent implements OnInit, AfterContentInit, AfterViewChecked, OnChanges {

  @Input() header: string;
  @Input() headerClass = 'p-0 border-bottom';
  @Input() formData: any;
  @Input() formTemplate: FormTemplate;
  @Output() onSubmit = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<any>();
  @Output() onLoaded = new EventEmitter<any>();
  @Output() onDelete = new EventEmitter<any>();
  @Output() isValid = new EventEmitter<boolean>();
  @ContentChildren(FormItemBaseComponent, { descendants: true }) formInputItems: QueryList<FormItemBaseComponent>;
  @ContentChild('formHeader', { read: TemplateRef }) formHeader: TemplateRef<any>;
  @ContentChild('formCancel', { read: TemplateRef }) formCancel: TemplateRef<any>;
  @ViewChild('editForm', { static: true }) editForm: NgForm;

  position = Position;
  error: any;


  get formGroup() {
    return this.formTemplate.formGroup;
  }

  // updateFormData() {
  //   this.formData = { ...this.formData, ...this.formTemplate.formGroup.value };
  //   this.onLoaded.emit(this.formData);
  // }

  constructor(private cdr: ChangeDetectorRef, private location: Location,
    private utilService: UtilsService) {


  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.formData) {
      this.updateChildTemplate();
    }
  }

  ngOnInit(): void {
  }

  ngAfterContentChecked() {
    if (this.formInputItems && !this.formTemplate.formGroup) this.ngAfterContentInit();
    else if (this.formInputItems && this.formTemplate.formGroup && Object.keys(this.formTemplate.formGroup.controls).length < this.formInputItems.length) {

      this.formInputItems.forEach((item: FormItemComponent) => {
        if (!this.formTemplate.formGroup.get(item.key?.toString())) {
          let validators = [];
          let required = Enumerable.from(item.formValidations.toArray()).any((a) => { return a.type == ValidationType.required });
          (item.required || required) && validators.push(item.type == FormElement.checkbox ? Validators.requiredTrue : Validators.required)
          let control = new FormControl((this.formData && this.formData[item.key]) || (item.type == FormElement.checkbox ? '' : false), validators);
          this.formTemplate.formGroup.addControl(item.key, control);

        }
      });

      this.cdr.detectChanges();
    }
  }

  ngAfterViewChecked() {
    this.cdr.detectChanges();
  }

  ngAfterContentInit(): void {
    const group: any = {};

    this.formInputItems.forEach((item: FormItemComponent) => {
      let validators = [];
      let required = Enumerable.from(item.formValidations.toArray()).any((a) => { return a.type == ValidationType.required });
      (item.required || required) && validators.push(item.type == FormElement.checkbox ? Validators.requiredTrue : Validators.required)
      //item.email && validators.push(Validators.email);
      group[item.key] = new FormControl((this.formData && this.formData[item.key]) || (item.type == FormElement.checkbox ? '' : false),
        { validators: validators, updateOn: 'change' });
    });

    this.formTemplate.formGroup = new FormGroup(group);
    this.formTemplate.form = this;
    this.formTemplate.utilService = this.utilService;
    this.formTemplate.utilService = this.utilService;

    this.formTemplate.formGroup.valueChanges.subscribe((value) => {
      this.checkValidation();
    });
    //this.formData && this.formTemplate.formGroup.valueChanges.subscribe((value) => { value && this.updateFormData(); })
    this.updateChildTemplate();
    this.formTemplate.onFormLoading();
    this.formTemplate.load();
    this.onLoaded.emit(this.editForm);

  }
  checkValidation() {
    let result = this.formGroup && this.formGroup.valid && !Enumerable.from(this.formInputItems.toArray()).any((a) => {
      let error = !a.hide && a.fieldError;
      error && console.log(a.dataField);
      return error;
    });
    this.formTemplate.valid = result;
    this.isValid.observers.length > 0 && this.isValid.emit(result);
  }

  dismissValidationErrors(index) {
    // delete this.formTemplate.validationErrors[index];
    this.formTemplate.validationErrors.splice(index, 1);
  }

  back() {
    if ((this.cancel.observers.length > 0) || (this.formTemplate.operation == Operation.Edit)) {
      this.cancel.observers.length > 0 && this.cancel.emit();
      if (this.formTemplate.operation == Operation.Edit && this.formTemplate.showView) {
        this.formTemplate.operation = Operation.View;
      }
    }
    else if (this.formTemplate.operation == Operation.PopUpEdit) {
    }
    else {
      this.location.back();
    }
    this.formTemplate.showView && this.setEdit();
  }

  delete() {
    this.formTemplate.delete();
    this.onDelete.emit();
  }

  async submitForm(editForm) {
    this.utilService.formFieldsTouch(this.formGroup);
    this.formInputItems.forEach((item) => item.isFocused = false);
    this.checkValidation();
    if (this.formTemplate.valid) {
      this.formTemplate.submitting = true;
      this.formTemplate.submit();
      this.onSubmit.emit(editForm);
    }
    Object.keys(this.formGroup.controls).forEach((key) => { if (!this.formGroup.get(key).valid) console.log(key); });
  }

  onEdit(editForm) {
    if (this.formTemplate.isEdit) {
      this.submitForm(editForm);
    }
    else {
      this.formTemplate.operation = Operation.Edit;
    }
    this.setEdit();
  }


  setEdit() {
    this.formInputItems.forEach((item) => {
      item.onEdit();
    });
  }

  updateChildTemplate() {
    if (this.formInputItems) {
      this.formInputItems.forEach((item) => {
        item.formTemplate = this.formTemplate;
        item.formData = this.formData;
        item.updateFieldChanges();
      });
    }
  }

  showDone() {
    return this.utilService.equalAnyValueFromArray(this.formTemplate.operation, Operation.Create, Operation.View) ? 'Done' : this.formTemplate.cancelText;
  }


}
