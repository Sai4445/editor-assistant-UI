import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { API } from "../shared/Constants";

@Injectable()
export class ReviewerDashboardService {

    constructor(private http: HttpClient) {}

    getPapersByReviewerId(reviewerId: any, eventId: any): Observable<any> {
        return this.http.get(`${API}paper/getAllPapersByReviewerAndEvent/${reviewerId}/${eventId}`);
    }

    updateReviewerScoreAndFeedback(paperId: any, reqBody: any): Observable<any> {
        return this.http.put(`${API}paper/upDatePaperFields/${paperId}`, reqBody);
    }

}