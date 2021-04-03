import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { SampleData } from '../contents/SampleData';
import { Constants } from '../models/Constants';
import { AuthenticationService } from './authentication.service';
import { saveAs } from 'file-saver';
// import odiff from "odiff";

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor(private httpClient: HttpClient, private authService: AuthenticationService) { }

  public get httpClientInstance() { return this.httpClient; }
  public get Constants() { return Constants; }
  public get SampleData() { return new SampleData(); }



  getRequest(url, params?) {
    return this.httpClient.get(url, params).pipe(
      map((res) => res),
      map((body) => body),
      catchError((body) => of(body))
    );
  }
  postRequest(url, params) {
    return this.httpClient.post(url, params).pipe(
      map((res) => res),
      map((body) => body),
      catchError((body) => of(body))
    );
  }
  putRequest(url, params) {
    return this.httpClient.put(url, params).pipe(
      map((res) => res),
      map((body) => body),
      catchError((body) => of(body))
    );
  }
  deleteRequest(url, params?) {
    return this.httpClient.delete(url, params).pipe(
      map((res) => res),
      map((body) => body),
      catchError((body) => of(body))
    );
  }
  postRequestUnHandled(url, params) {
    return this.httpClient.post(url, params).pipe(
      map((res) => res),
      map((body) => body),
      catchError((err) => throwError(err))
    );
  }
  putRequestUnHandled(url, params) {
    return this.httpClient.put(url, params).pipe(
      map((res) => res),
      map((body) => body),
      catchError((err) => throwError(err))
    );
  }
  deleteRequestUnHandled(url, params?) {
    return this.httpClient.delete(url, params).pipe(
      map((res) => res),
      map((body) => body),
      catchError((body) => throwError(body))
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

  downloadFileResponse(data) {
    const blob = new Blob([data]);
    const url = window.URL.createObjectURL(blob);
    window.open(url);
  }


  downloadFile(url, fileName = '') {
    this.httpClient.get(url, { responseType: 'blob' }).subscribe((data) => {
      this.downloadFileResponse(data);
    }
    );
  }

  downloadWithResponseFileName(url: string, postData?: any): Observable<any> {
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

    return this.httpClient.get(url, { responseType: 'blob', observe: 'response' }).pipe(
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

  // objectDiff(original, updated) {
  //   let diff = odiff(original, updated);
  //   let obj = {}; diff.map((a: any) => obj[a.path[0]] = a.val);
  //   return obj;
  // }
}
