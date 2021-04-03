import { Injectable } from "@angular/core";
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { TokenModel } from "src/app/shared/models/token-models";
import { environment } from "src/environments/environment";
import { AuthenticationService } from "../services/authentication.service";

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

    constructor(private authService: AuthenticationService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (request.url.includes('pstmn.io')) {
            return next.handle(request);
        }
        if (request.url.includes('/auth/login') === false) {
            let token = '';
            const tokenDetails = localStorage.getItem(environment.tokenName) || null;
            if (tokenDetails) {
                let tempTokenDetail: TokenModel = JSON.parse(tokenDetails);
                token = tempTokenDetail.token;
            }
            request = request.clone({
                headers: request.headers.set('Authorization', `Bearer ${token}`)
            });
        }

        return next.handle(request).pipe(
            tap((event: HttpEvent<any>) => {
                if (event instanceof HttpResponse) {
                }
            }, (err: any) => {
                if (err instanceof HttpErrorResponse) {
                    if (err.status === 401) {
                        this.authService.logOut();
                    }
                }
            })
        )
    }

}