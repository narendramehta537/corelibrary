import { Injectable } from "@angular/core";
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from "src/environments/environment";

@Injectable()
export class APIPrefixInterceptor implements HttpInterceptor {

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (request.url.includes('pstmn.io')) {
            return next.handle(request);
        }
        request = request.clone({ url: environment.serverUrl + request.url });

        return next.handle(request)
    }

}