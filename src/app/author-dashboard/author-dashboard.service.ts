import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { API } from "../shared/Constants";
import { Paper } from "../shared/Paper";
import { CustomResponse } from "../shared/response";

@Injectable()
export class AuthorDashboardService {
    constructor(private http: HttpClient) {}

    getRegisteredEventsByAuthor(authorId: any): Observable<any> {
        return this.http.get(`${API}event/getAllRegisteredEvents/${authorId}`);
    }

    registerEvent(formData: FormData): Observable<any> {
        return this.http.post(`${API}paper`, formData);
    }

    papersByAuthor(userId: any): Observable<CustomResponse> {
        return this.http.get(`${API}paper/getAllPapersByAuthor/${userId}`);
    }

    uploadPaper(formData: FormData): Observable<CustomResponse> {
        return this.http.post(`${API}paper`, formData);
    }

    getPaperByPaperId(paperId: any): Observable<any> {
        return this.http.get(`${API}paper/getPaperAttachement/${paperId}`, {responseType: 'arraybuffer'})
    }

    submit(paperId: any): Observable<any> {
        return this.http.put(`${API}paper/changePaperStatus?paperId=${paperId}&status=SUBMITTED`, null);
    }
 }