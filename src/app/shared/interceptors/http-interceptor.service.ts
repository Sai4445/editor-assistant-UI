import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LoginService } from 'src/app/login/login.service';

@Injectable()
export class TokenInterceptorService implements HttpInterceptor {
    constructor(public auth: LoginService) { }
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        console.log("intercepting the api",this.auth.getToken());
        request = request.clone({
            setHeaders: {
               // Cookie: `${this.auth.getToken()}`
            },
            withCredentials: true
        });
        return next.handle(request)
    }
}
