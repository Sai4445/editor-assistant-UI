import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { AuthorDashboardComponent } from './author-dashboard/author-dashboard.component';
import { DummyComponent } from './dummy/dummy.component';
import { AdminAuthGuard } from './guards/admin-auth.guard';
import { AuthorAuthGuard } from './guards/author-auth.guard';
import { ReviewerAuthGuard } from './guards/reviewer-auth.guard';
import { LoginComponent } from './login/login.component';
import { RegistrationComponent } from './registration/registration.component';
import { ReviewerDashboardComponent } from './reviewer-dashboard/reviewer-dashboard.component';

const routes: Routes = [
  {path: '', redirectTo: '/login', pathMatch: 'full'},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegistrationComponent},
  {path: 'admin-dashboard',  component: AdminDashboardComponent},
  {path: 'author-dashboard',  component: AuthorDashboardComponent},
  {path: 'reviewer-dashboard',  component: ReviewerDashboardComponent},
  {path: 'dummy', component: DummyComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
