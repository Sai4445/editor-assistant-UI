import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { API } from "../shared/Constants";
import { Event } from "../shared/Event";
import { Paper } from "../shared/Paper";
import { CustomResponse } from "../shared/response";

@Injectable()
export class AdminDashboardService {
    constructor (private http: HttpClient) {}

    createEvent(event:Event): Observable<CustomResponse> {
        return this.http.post(`${API}event/createEvent`, event);
    }

    updateEvent(event:Event): Observable<CustomResponse> {
        return this.http.put(`${API}event/updateEvent`, event);
    }

    deleteEvent(eventId: number): Observable<CustomResponse> {
        return this.http.delete(`${API}event/deleteEventById/${eventId}`);
    }

    getAllEvents(): Observable<any> {
        return this.http.get(`${API}event/getAllEvents`);
    }

    updateReviewer(paper: Paper): Observable<any> {
        return this.http.put(`${API}paper/updatePaper`, paper);
    }

    // getPapersByEventId(eventId: number): Observable<any> {
    //     return this.http.get(`${API}paper/getAllPapersByEvent/${eventId}`);
    // }

    getPapersByEventIdAndStatus(eventId: number, status: any): Observable<any> {
        return this.http.get(`${API}paper/getAllPapersStatus/${eventId}?paperStatus=${status}`);
    }
    
    publish(paperId: any): Observable<any> {
        return this.http.put(`${API}paper/changePaperStatus?paperId=${paperId}&status=PUBLISHED`, null);
    }

    getReviewers(): Observable<any> {
        return this.http.get(`${API}user/getAllReviewers`);
    }

    getUsers(): Observable<any> {
        return this.http.get(`${API}user/getAllUsers`)
    }
}