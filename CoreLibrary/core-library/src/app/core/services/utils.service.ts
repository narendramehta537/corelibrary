import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { map, catchError, switchMap, finalize } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { SampleData } from '../contents/SampleData';
import { Constants } from '../models/Constants';
import { AuthenticationService } from './authentication.service';
import { saveAs } from 'file-saver';
import { String } from 'typescript-string-operations';
import { Func } from '../classes/Funcs';
import { FormGroup } from '@angular/forms';
import * as Enumerable from 'linq';
// import odiff from "odiff";

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor(private httpClient: HttpClient, private authService: AuthenticationService) { }

  public get httpClientInstance() { return this.httpClient; }
  public get Constants() { return Constants; }
  public get SampleData() { return new SampleData(); }

  formatUrl(url, ...args: any[]) {
    return args.length > 0 ? String.Format(url, ...args) : url;
  }

  request(url, method = Constants.GET, options?, ...args: any[]) {
    url = this.formatUrl(url, ...args);
    let payLoad = {
      params: Constants.isBody(method) ? null : options,
      body: Constants.isBody(method) ? options : null,
    };

    return this.httpClient.request(method, url, payLoad).pipe(
      map((res) => res),
      map((body) => body),
      catchError((body) => of(body))
    );
  }

  getRequest(url, params?, ...args: any[]) {

    url = this.formatUrl(url, ...args);
    return this.httpClient.get(url, { params: params }).pipe(
      map((res) => res),
      map((body) => body),
      catchError((body) => of(body))
    );
  }

  postRequest(url, body, ...args: any[]) {

    url = this.formatUrl(url, ...args);
    return this.httpClient.post(url, body).pipe(
      map((res) => res),
      map((body) => body),
      catchError((body) => of(body))
    );
  }
  putRequest(url, body, ...args: any[]) {
    url = this.formatUrl(url, ...args);
    return this.httpClient.put(url, body).pipe(
      map((res) => res),
      map((body) => body),
      catchError((body) => of(body))
    );
  }
  deleteRequest(url, params?, ...args: any[]) {
    url = this.formatUrl(url, ...args);
    return this.httpClient.delete(url, params).pipe(
      map((res) => res),
      map((body) => body),
      catchError((body) => of(body))
    );
  }

  requestUnhandled(url, method = Constants.GET, options?, func?: Func, ...args: any[]) {
    url = this.formatUrl(url, ...args);
    let payLoad = {
      params: Constants.isBody(method) ? null : options,
      body: Constants.isBody(method) ? options : null,
    };

    return this.httpClient.request(method, url, payLoad).pipe(
      map((res) => res),
      map((body) => body),
      finalize(() => func && func())
    );
  }

  postRequestUnHandled(url, body, func?: Func, ...args: any[]) {
    url = this.formatUrl(url, ...args);
    return this.httpClient.post(url, body).pipe(
      map((res) => res),
      map((body) => body),
      finalize(() => func && func())
    );
  }
  putRequestUnHandled(url, body, func?: Func, ...args: any[]) {
    url = this.formatUrl(url, ...args);
    return this.httpClient.put(url, body).pipe(
      map((res) => res),
      map((body) => body),
      finalize(() => func && func())
    );
  }
  deleteRequestUnHandled(url, params?, func?: Func, ...args: any[]) {
    url = this.formatUrl(url, ...args);
    return this.httpClient.delete(url, { params: params }).pipe(
      map((res) => res),
      map((body) => body),
      finalize(() => func && func())
    );
  }

  getRequestUnhandled(url, params?, func?: Func, ...args: any[]) {

    url = this.formatUrl(url, ...args);
    return this.httpClient.get(url, { params: params }).pipe(
      map((res) => res),
      map((body) => body),
      finalize(() => func && func())
    );
  }

  dateFormatDDMMYYYYHHSS(date) {
    var dateStr =
      ('00' + date.getDate()).slice(-2) +
      '/' +
      ('00' + (date.getMonth() + 1)).slice(-2) +
      '/' +
      date.getFullYear() +
      ' ' +
      ('00' + date.getHours()).slice(-2) +
      ':' +
      ('00' + date.getMinutes()).slice(-2) +
      ':' +
      ('00' + date.getSeconds()).slice(-2);
    return dateStr;
  }
  dateFormatMMDDYYYY(date) {
    var dateStr =
      ('00' + (date.getMonth() + 1)).slice(-2) +
      '/' +
      ('00' + date.getDate()).slice(-2) +
      '/' +
      date.getFullYear();
    return dateStr;
  }


  momentDate(date) {
    if (date) {
      return new Date(date).toISOString().slice(0, 10);
    }
    return null;
  }
  getProfileUrl(profilePic) {
    return `${environment.serverOrigin}${profilePic}`
    //return `${environment.serverOrigin}${profilePic}/?access_token=${this.authService.tokenDetails.token}`
  }

  chunk(arr, chunkSize) {
    if (chunkSize <= 0) throw "Invalid chunk size";
    var R = [];
    for (var i = 0, len = arr.length; i < len; i += chunkSize)
      R.push(arr.slice(i, i + chunkSize));
    return R;
  }
  countedArray(numbers) {
    return Array(numbers).fill(0).map((x, i) => i);
  }



  downloadWithResponseFileName(url: string, postData?: any, params?: any): Observable<HttpResponse<Blob>> {
    if (postData) {

      return this.httpClient.post(url, postData, { responseType: 'blob', observe: 'response' }).pipe(
        map((result: HttpResponse<Blob>) => {
          const contentDisposition = result.headers.get('content-disposition');
          let filename: any = this.getFilenameFromContentDisposition(contentDisposition);
          filename = filename.replaceAll("\"", "")
          saveAs(result.body, filename);
          return result;
        }));

    }

    return this.httpClient.get(url, { responseType: 'blob', observe: 'response', params: params }).pipe(
      map((result: HttpResponse<Blob>) => {
        const contentDisposition = result.headers.get('content-disposition');
        let filename: any = this.getFilenameFromContentDisposition(contentDisposition);
        filename = filename.replaceAll("\"", "")
        saveAs(result.body, filename);
        return result;
      }));

  }

  private getFilenameFromContentDisposition(contentDisposition: string) {
    const regex = /filename=(?<filename>[^,;]+);/g;
    const match = regex.exec(contentDisposition);
    const filename = match.groups.filename;
    return filename;
  }

  getBetween(input: string, firstvariable, secondvariable) {
    let matchList = [];
    var matches = input.match(new RegExp(firstvariable + "(.*?)" + secondvariable, 'g'));
    if (matches) {
      matches.forEach((val) => {
        let match = val.match(new RegExp(firstvariable + "(.*?)" + secondvariable));
        matchList.push(match[1]);
      })
    }
    return matchList;
  }

  setClassValuesFromInterfaceObj(interfaceObj: any, classObj: any) {
    if (interfaceObj) {
      Object.keys(interfaceObj).forEach((key) => {
        if (interfaceObj[key] != null) classObj[key] = interfaceObj[key];
      });
    }
  }
  formFieldsTouch(form: FormGroup) {
    if (!form) return;
    for (let i in form.controls) {
      form.controls[i].markAsTouched();
    }
    // this.sleep(1000);
  }
  equalAnyValueFromArray(value, ...comparingValues: any[]) {
    return Enumerable.from(comparingValues).any((item) => value == item);
  }
  trimmedValue(input: any) {
    return typeof (input) == 'string' ? input.trim() : input;
  }

  setTheme(themes: Themes) {
    let root: any = document.querySelector(':root');

    Object.keys(themes).forEach((key) => {
      if (themes[key]) {
        let varName = `--${key.replace(/_/g, '-')}`;
        root.style.setProperty(varName, themes[key]);
      }
    });
  }

}

export interface Themes {
  primary_color?: string;
  primary_color_rgb?: string;
}
