import { Injectable, Output } from '@angular/core';
import Swal, { SweetAlertOptions } from 'sweetalert2'
import { AlertTemplate, ISweetAlertOptions } from '../models/components/Form';
@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor() { }

  simpleAlert() {
    Swal.fire('Hello world!');
  }

  alertWithSuccess() {
    Swal.fire('Thank you...', 'You submitted succesfully!', 'success')
  }

  confirmAlert(alert: AlertTemplate) {
    Swal.fire({
      title: alert.title,
      text: alert.text || 'Are you sure?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: alert.confirmText,
      cancelButtonText: alert.cancelText
    }).then((result) => {
      if (result.value) {
        alert.onYesClick();
      } else if (result.dismiss === Swal.DismissReason.cancel) {

      }
    })
  }

  confirmAlertOptions(alert: ISweetAlertOptions) {

    alert.title = alert.title || 'Are you sure?';
    alert.icon = 'warning';
    alert.showCancelButton = true;
    alert.confirmButtonText = alert.confirmButtonText || 'Yes';
    alert.cancelButtonText = alert.cancelButtonText || 'Cancel';

    Swal.fire(alert).then((result) => {
      if (result.value) {
        alert.onYesClick();
      } else if (result.dismiss === Swal.DismissReason.cancel) {

      }
    })
  }
}
