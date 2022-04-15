import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { DialogService } from "primeng/dynamicdialog";
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AlertDialogComponent } from "../Components/alert-dialog-component/alert-dialog.component";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

    constructor(private dialogService: DialogService) {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req).pipe(
            catchError(err => {
                console.log('err:', err);
              if (err.status !== 200) {
                console.log('error status:', err.status)
                this.dialogService.open(AlertDialogComponent, {
                    height: '250px',
                    width: '250px',
                    header: 'Error',
                    data: err.error? (err.error.data ? err.error.data : 'Uncaught exception caught. Please contact admin') : 'Uncaught exception caught. Please contact admin'
                })
                return throwError(err);
              } else {
                return throwError(null);
              }
            })
          );
    }
    
}
