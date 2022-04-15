import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { API } from "../shared/Constants";
import { CustomResponse } from "../shared/response";
import { User } from "../shared/User";

@Injectable()
export class RegistrationService {
    constructor(private http: HttpClient) {}

    register(user: User): Observable<CustomResponse> {
        return this.http.post(`${API}user/registerUser`, user);
    }
}