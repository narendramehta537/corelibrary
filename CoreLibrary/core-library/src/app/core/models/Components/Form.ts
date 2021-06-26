import { Location } from "@angular/common";
import { FormGroup } from "@angular/forms";
import { FormComponent } from "src/app/shared/modules/form/form.component";
import { SweetAlertOptions } from "sweetalert2";
import { Func } from "../../classes/Funcs";
import { AlertService } from "../../services/alert.service";
import { UtilsService } from "../../services/utils.service";
import { IAjaxSettings } from "./Table";



export interface IFormOptions {
    onBeforeSend?: (operation: string, ajaxSettings: IAjaxSettings) => void;
    errorHandler?: (e: any) => void,
    onFormLoading?: () => void;
    onLoading?: (result: any) => void;
    onLoaded?: () => void;

    onInserting?: (values: any) => void;
    onInserted?: (values: any, key: any) => void;

    onUpdating?: (key: any, values: any) => void;
    onUpdated?: (key: any, values: any) => void;

    onRemoving?: (key: any) => void;
    onRemoved?: (key: any) => void;

    onPagination?: (result: any) => void;

    loadUrl?: string;
    loadFormatArgs?: any[];

    insertUrl?: string;
    insertFormatArgs?: any[];

    updateUrl?: string;
    updateFormatArgs?: any[];

    deleteUrl?: string;
    deleteFormatArgs?: any[];

    removeAlert?: AlertTemplate
}

export interface ISweetAlertOptions extends SweetAlertOptions {
    onYesClick?: Function;
}

export class AlertTemplate {

    constructor(title: string, text: string, onYesClick?: Function) {

        this.title = title;
        this.text = text;
        this.onYesClick = onYesClick;

    }


    title: string;
    text: string;
    onYesClick?: Function;
    confirmText = 'Yes';
    cancelText = 'Cancel';

    setValue(propertyName, value) {
        this[propertyName] = value;
    }
}

export interface IFormTemplate {
    operation?: Operation;
    submitPosition?: Position;
    validationErrors?: ValidationErrors[];
    formGroup?: FormGroup;
    submitText?: string;
    submitButtonClass?: string;
    fieldsHeaderClass?: string;
    submitClass?: string;
    hideOperation?: boolean;
    addRow?: boolean;
    addFlex?: boolean;
    valid?: boolean;
    submitting?: boolean;
    showFormHeader?: boolean;
    cancelText?: string;
    defaultOperations?: boolean;
    showDelete?: boolean;
    deleteText?: string;
    showView?: boolean;
    allowEdit?: boolean;
    allowSubmit?: boolean;
}

export interface IKeyValue<T = any> {
    key: T,
    value: any
}

export class FormTemplate implements IFormTemplate {

    operation = Operation.View;
    submitPosition = Position.top;
    validationErrors: ValidationErrors[];
    formGroup?: FormGroup;
    submitText = 'Save';
    submitButtonClass = 'btn btn-outline-success fs-7 px-4 ';
    fieldsHeaderClass = 'padd--container--responsive ';
    submitClass = 'padd--container--responsive ';
    hideOperation = false;
    addRow = false;
    addFlex = true;
    valid = false;
    submitting = false;
    showFormHeader = false;
    cancelText = 'Cancel';
    defaultOperations = false;
    showDelete = false;
    deleteText = 'Delete';
    showView = true;
    allowEdit = true;
    allowSubmit = true;

    get isEdit() { return this.operation == Operation.Edit || this.operation == Operation.PopUpEdit || this.operation == Operation.Create; }
    get isCreate() { return this.operation == Operation.Create; }
    get isCustom() { return this.operation == Operation.Custom; }
    get onTop() { return this.submitPosition == Position.top; }

    get header(): string { return this.hideOperation || this.operation == Operation.View ? ' ' : this.operation.toString() }

    submitted(status: boolean): Func {
        return () => this.submitting = status;
    }

    form?: FormComponent;
    options?: IFormOptions;
    utilService: UtilsService;
    alertService: AlertService;
    location: Location;

    constructor(options?: IFormOptions, formTemplate?: IFormTemplate) {
        this.options = options;
        if (options) {
            this.options.loadFormatArgs = this.options.loadFormatArgs || [];
            this.options.insertFormatArgs = this.options.insertFormatArgs || [];
            this.options.updateFormatArgs = this.options.updateFormatArgs || [];
            this.options.deleteFormatArgs = this.options.deleteFormatArgs || [];
        }
        if (formTemplate) {
            Object.keys(formTemplate).forEach((key) => {
                formTemplate[key] !== undefined && this.setValue(key, formTemplate[key]);
            });
        }
    }

    setValue(propertyName, value) {
        this[propertyName] = value;
    }

    getFormValue(itemName: string) {
        return this.formGroup && this.formGroup.get(itemName)?.value;
    }
    getFormValueBool(itemName: string) {
        if (this.formGroup) {
            let val = this.formGroup.get(itemName)?.value;
            return (val == true || val == 'true');
        }
        return false;
    }
    getFormValueNumber(itemName: string) {
        if (this.formGroup) {
            let val = this.formGroup.get(itemName)?.value;
            return (Number.parseInt(val) || 0);
        }
        return 0;
    }
    setFormValue(itemName: string, value: any) {
        this.formGroup && this.formGroup.get(itemName)?.setValue(value);
    }

    setFormValues(...keyValues: IKeyValue<string>[]) {
        keyValues.forEach((keyValue) => {
            this.setFormValue(keyValue.key, keyValue.value);
        })
    }

    submit() {
        this.operation == Operation.Create && this.insert();
        this.operation == Operation.Create || this.update();
    }

    operations(func: Func, currentOperation) {
        if (this.defaultOperations) {
            let ajaxSettings = { data: {}, params: {} };
            this.options.onBeforeSend && this.options.onBeforeSend(currentOperation, ajaxSettings);
            func(ajaxSettings);
        }
    }

    onFormLoading() {
        this.options && this.options.onFormLoading && this.options.onFormLoading();
    }

    load() {
        let func: Func = (ajaxSettings) => {
            this.utilService.getRequestUnhandled(this.options.loadUrl, ajaxSettings.params, this.submitted(false), ...this.options.loadFormatArgs).subscribe((result) => {
                if (this.options.onLoading) {
                    this.options.onLoading(result);
                }
                else {
                    this.formGroup.setValue(result);
                }
                this.options.onLoaded && this.options.onLoaded();

            }, error => {
                this.options.errorHandler && this.options.errorHandler(error);
                this.options.onLoaded && this.options.onLoaded();
            })
        }

        if (this.operation != Operation.Create && this.options && this.options.loadUrl) {
            this.operations(func, ApiOperations.Load)
        }
        else {
            this.options && this.options.onLoaded && this.options.onLoaded();
        }
    }


    insert() {
        let func: Func = (ajaxSettings: IAjaxSettings) => {
            this.utilService.postRequestUnHandled(this.options.insertUrl, ajaxSettings.data, this.submitted(false), ...this.options.insertFormatArgs).subscribe((result) => {
                this.options.onInserting && this.options.onInserting(result);
                if (this.options.onInserted) {
                    this.options.onInserted(result, '');
                } else {
                    this.location.back();
                }
            }, error => {
                this.submitting = false;
                this.options.errorHandler && this.options.errorHandler(error);
            })
        }
        this.operations(func, ApiOperations.Insert);
    }

    update() {
        let func: Func = (ajaxSettings: IAjaxSettings) => {
            this.utilService.putRequestUnHandled(this.options.updateUrl, ajaxSettings.data, this.submitted(false), ...this.options.updateFormatArgs).subscribe((result) => {
                this.load();
                if (this.options.onUpdating) {
                    this.options.onUpdating('', result);
                }
                this.operation = Operation.View;
            }, error => {
                this.options.errorHandler && this.options.errorHandler(error);
            })
        }
        this.operations(func, ApiOperations.Update);
    }

    delete() {

        let func: Func = (ajaxSettings: IAjaxSettings) => {
            this.utilService.deleteRequestUnHandled(this.options.deleteUrl, ajaxSettings.params, null, ...this.options.deleteFormatArgs).subscribe((result) => {
                if (this.options.onRemoving) {
                    this.options.onRemoving(result);
                }
                else {
                    this.location.back();
                }
            }, error => {
                this.options.errorHandler && this.options.errorHandler(error);
            })
        }
        if (this.options) {
            if (this.options.removeAlert) {
                this.options.removeAlert.onYesClick = () => {
                    this.operations(func, ApiOperations.Delete);
                }
                this.alertService.confirmAlert(this.options.removeAlert);

            }
            else {
                this.operations(func, ApiOperations.Delete);
            }
        }

    }

    loadFormSource(dataSource) {
        this.formGroup.setValue(dataSource);
    }
}
export interface IUploadTemplate {
    success: boolean;
    validationErrors: string[];
}
export interface ValidationErrors {
    header: string;
    errors: string[];
}
export enum Position {
    top,
    bottom
}
export enum Operation {
    Edit = "Edit ",
    PopUpEdit = "PopUpEdit",
    Create = "Create ",
    View = "View",
    Custom = "Custom"
}

export enum ApiOperations {
    Insert = 'Insert',
    Update = 'Update',
    Delete = 'Delete',
    Load = 'Load'
}

export enum FormElement {
    text = "text",
    password = "password",
    textarea = "textarea",
    select = "select",
    checkbox = "checkbox",
    custom = "custom",
}

export interface Validations {
    pattern?: string | RegExp;
    message: string;
    function?: Func;
    type?: "required" | "function" | "pattern";
}
export enum ValidationType {
    required = 'required',
    pattern = 'pattern',
    function = 'function',
}
export interface IForValidationMessage {
    validationType?: "required" | "function" | "pattern",
    message: string | Func,
    funcMessage?: Func,
    onDisplay: () => boolean
    //dataField: any
}
