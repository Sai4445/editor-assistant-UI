import {
  Component,
  ComponentFactoryResolver,
  ComponentRef,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { AdminDashboardService } from '../admin-dashboard/admin-dashboard.Service';
import { AuthorDashboardService } from '../author-dashboard/author-dashboard.service';
import { ReviewScoreComponent } from '../review-score/review-score.component';
import { AlertDialogComponent } from '../shared/Components/alert-dialog-component/alert-dialog.component';
import { Event } from '../shared/Event';
import { Paper } from '../shared/Paper';
import { ResponseStatus } from '../shared/response';
import { UtilityClass } from '../shared/UtilityClass';
import { ReviewerDashboardService } from './reviewer-dashboard.service';

@Component({
  selector: 'reviewer-dashboard',
  templateUrl: './reviewer-dashboard.component.html',
  styleUrls: ['./reviewer-dashboard.component.css'],
})
export class ReviewerDashboardComponent implements OnInit {
  events: Event[] = [];
  submittedPapers: Paper[] = [];
  selectedEventName: Event;

  @ViewChild('reviewScoreUploadContainer', {
    read: ViewContainerRef,
    static: true,
  })
  reviewScoreUploadContainer: ViewContainerRef;

  reviewScoreComponentRef: ComponentRef<ReviewScoreComponent>;

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private messageService: MessageService,
    private dialogService: DialogService,
    private service: AdminDashboardService,
    private authorService: AuthorDashboardService,
    private reviewerService: ReviewerDashboardService,
    private spinnerService: NgxSpinnerService
  ) {}

  ngOnInit() {
    this.spinnerService.show();
    this.service.getAllEvents().subscribe((resp) => {
      this.spinnerService.hide();
      if (!!resp) {
        this.events = resp.data;
        console.log('events:', this.events);
      }
    });
  }

  selectedEvent($event: any) {
    console.log('selected event from dropdown:', $event);
    console.log('selectedEventName:', this.selectedEventName);
    const userId = localStorage.getItem('userId');
    this.spinnerService.show();
    this.reviewerService
      .getPapersByReviewerId(userId, this.selectedEventName.eventId)
      .subscribe((resp) => {
        this.spinnerService.hide();
        console.log('resp for getPapersByReviewerId:', resp);
        if (!!resp && !!resp.status && resp.status === ResponseStatus.FAIL) {
          this.dialogService.open(AlertDialogComponent, {
            header: 'Error',
            data: resp.data,
            height: '150px',
            width: '350px',
          });
        } else {
          const paperList: Paper[] = resp.data;
          for (let i = 0; i < paperList.length; i++) {
            const respPaper: Paper = paperList[i];
            const event: any = UtilityClass.getEventById(respPaper.eventId);
            const author: any = UtilityClass.getUserByUserId(
              respPaper.authorId
            );
            const reviewer1: any = UtilityClass.getReviewerById(
              respPaper.reviewer1
            );
            const reviewer2: any = UtilityClass.getReviewerById(
              respPaper.reviewer2
            );
            const reviewer3: any = UtilityClass.getReviewerById(
              respPaper.reviewer3
            );
            paperList[i] = {
              ...paperList[i],
              event: event,
              authorName: author.firstName + ' ' + author.lastName,
              reviewer1Name: reviewer1 ? reviewer1.reviewerName : '',
              reviewer2Name: reviewer2 ? reviewer2.reviewerName : '',
              reviewer3Name: reviewer3 ? reviewer3.reviewerName : '',
            };
          }
          console.log('paperList:', paperList);
          this.submittedPapers = [...paperList];
        }
      });
  }

  onClickEdit(i: number) {
    const componentFactory =
      this.componentFactoryResolver.resolveComponentFactory(
        ReviewScoreComponent
      );
    this.reviewScoreComponentRef =
      this.reviewScoreUploadContainer.createComponent(componentFactory);
    const reviewScoreUploadInstance = this.reviewScoreComponentRef.instance;
    reviewScoreUploadInstance.showDialog = true;
    reviewScoreUploadInstance.paperId = this.submittedPapers[i].paperId;
    reviewScoreUploadInstance.onEmit.subscribe((data) => {
      this.spinnerService.show();
      console.log('data:', data);
      console.log('paper:', this.submittedPapers[i]);
      const userId = localStorage.getItem('userId');
      let reqBody = [];
      if (this.submittedPapers[i].reviewer1 + '' === userId) {
        reqBody.push(
          { fieldName: 'reviewer1Score', fieldValue: data.score },
          { fieldName: 'reviewer1Feedback', fieldValue: data.comment }
        );
      } else if (this.submittedPapers[i].reviewer2 + '' === userId) {
        reqBody.push(
          { fieldName: 'reviewer2Score', fieldValue: data.score },
          { fieldName: 'reviewer2Feedback', fieldValue: data.comment }
        );
      } else if (this.submittedPapers[i].reviewer3 + '' === userId) {
        reqBody.push(
          { fieldName: 'reviewer3Score', fieldValue: data.score },
          { fieldName: 'reviewer3Feedback', fieldValue: data.comment }
        );
      }
      this.reviewerService
        .updateReviewerScoreAndFeedback(
          this.submittedPapers[i].paperId,
          reqBody
        )
        .subscribe((resp) => {
          console.log('resp after upload paper:', resp);
          this.spinnerService.hide();
          if (!!resp && !!resp.status && resp.status === ResponseStatus.FAIL) {
            this.dialogService.open(AlertDialogComponent, {
              header: 'Error',
              data: resp.data,
              height: '150px',
              width: '350px',
            });
          } else {
            this.messageService.add({
              key: 'tc',
              severity: 'success',
              summary: 'Success',
              detail: 'Score submitted successfully!',
            });
            this.selectedEvent(null);
          }
        });
      setTimeout(() => {
        reviewScoreUploadInstance.showDialog = false;
        this.reviewScoreComponentRef.destroy;
      });
    });
  }
}
