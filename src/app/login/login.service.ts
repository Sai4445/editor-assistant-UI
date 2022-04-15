import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Observable, of } from "rxjs";
import { API } from "../shared/Constants";
import { CustomResponse } from "../shared/response";

@Injectable()
export class LoginService {

    constructor(private http: HttpClient, private router: Router) {}

    setToken(token: string): void {
        localStorage.setItem('token', token);
      }
    
      getToken(): string | null {
        return localStorage.getItem('token');
      }
    
      isLoggedIn() {
        return this.getToken() !== null;
      }
    
      logout() {
        localStorage.removeItem('token');
        localStorage.clear();
        this.router.navigate(['login']);
      }

    login(loginDetails: any): Observable<CustomResponse> {
        return this.http.post(`${API}login`, loginDetails);
    }

}