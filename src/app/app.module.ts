import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RegistrationComponent } from './registration/registration.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularMaterialModule } from './angularMaterial.module';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { LoginService } from './login/login.service';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { PrimengModule } from './primeng.module';
import { AddEventComponent } from './admin-dashboard/add-event.component';
import { RegistrationService } from './registration/registration.service';
import { AdminDashboardService } from './admin-dashboard/admin-dashboard.Service';
import { AuthorDashboardComponent } from './author-dashboard/author-dashboard.component';
import { AuthorDashboardService } from './author-dashboard/author-dashboard.service';
import { AuthorUploadFileComponent } from './author-upload-file/author-upload-file.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { DummyComponent } from './dummy/dummy.component';
import { ReviewerDashboardComponent } from './reviewer-dashboard/reviewer-dashboard.component';
import { AlertDialogComponent } from './shared/Components/alert-dialog-component/alert-dialog.component';
import { MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { NavigatopnBarComponent } from './navigation-bar/navigation-bar.component';
import { ErrorInterceptor } from './shared/interceptors/error.interceptor';
import { ReviewScoreComponent } from './review-score/review-score.component';
import { ReviewerDashboardService } from './reviewer-dashboard/reviewer-dashboard.service';
import { TokenInterceptorService } from './shared/interceptors/http-interceptor.service';
import { NgxSpinnerModule } from 'ngx-spinner';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegistrationComponent,
    AdminDashboardComponent,
    AddEventComponent,
    AuthorDashboardComponent,
    AuthorUploadFileComponent,
    ReviewerDashboardComponent,
    AlertDialogComponent,
    NavigatopnBarComponent,
    ReviewScoreComponent,
    DummyComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    AngularMaterialModule,
    HttpClientModule,
    PrimengModule,
    PdfViewerModule,
    NgxSpinnerModule
  ],
  exports: [FormsModule, ReactiveFormsModule],
  providers: [LoginService, RegistrationService, AdminDashboardService, AuthorDashboardService,
  MessageService, DialogService, ReviewerDashboardService,
  {
    provide: HTTP_INTERCEPTORS,
    useClass: ErrorInterceptor,
    multi: true,
  },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorService,
      multi: true,
    }

],
  bootstrap: [AppComponent],
  entryComponents:[AddEventComponent]
})
export class AppModule { }
