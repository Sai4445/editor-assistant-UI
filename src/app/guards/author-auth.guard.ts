
import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { LoginService } from '../login/login.service';

@Injectable({
  providedIn: 'root',
})
export class AuthorAuthGuard implements CanActivate {
  constructor(private router: Router, private service: LoginService) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
      const role: string | null = localStorage.getItem('role');
      if (!this.service.isLoggedIn() || (this.service.isLoggedIn() && !(role === 'author'))) {
      this.router.navigate(['/login']);
    }
    return this.service.isLoggedIn() && role === 'author';
  }
}
