import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { AuthorDashboardService } from "../author-dashboard/author-dashboard.service";

@Component({
    selector: 'review-score',
    templateUrl: './review-score.component.html',
    styleUrls: ['./review-score.component.css']
})
export class ReviewScoreComponent implements OnInit {

    @Input() showDialog: boolean;
    @Input() paperId: any;

    @Output() onEmit = new EventEmitter<any>();

    pdf: any;
    selectedScore: number;
    comment: string;
    scores: number[] = [1,2,3,4,5,6,7,8,9,10];

    constructor(private service: AuthorDashboardService) {}

    ngOnInit() {
        this.service.getPaperByPaperId(this.paperId).subscribe((file: ArrayBuffer) => {
            console.log("resp for paperId:", file);
            this.pdf = new Uint8Array(file);
        })
    }

    submitScore() {
        console.log('comment:', this.comment);
        console.log('score:', this.selectedScore);
        this.onEmit.emit({comment: this.comment, score: this.selectedScore})
    }

}