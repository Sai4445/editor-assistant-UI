import {
  Component,
  ComponentFactoryResolver,
  ComponentRef,
  Inject,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { AuthorUploadFileComponent } from '../author-upload-file/author-upload-file.component';
import { LoginService } from '../login/login.service';
import { AlertDialogComponent } from '../shared/Components/alert-dialog-component/alert-dialog.component';
import { Event } from '../shared/Event';
import { Paper } from '../shared/Paper';
import { ResponseStatus } from '../shared/response';
import { Reviewer, User } from '../shared/User';
import { UtilityClass } from '../shared/UtilityClass';
import { AddEventComponent } from './add-event.component';
import { AdminDashboardService } from './admin-dashboard.Service';

@Component({
  selector: 'admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css'],
})
export class AdminDashboardComponent implements OnInit {
  @ViewChild('addevent', { read: ViewContainerRef, static: true })
  addEventContainer: ViewContainerRef;

  events: Event[] = [];
  submittedPapers: Paper[] = [];
  addEventComponentRef: ComponentRef<AddEventComponent>;
  selectedEventName: Event;
  selectedEventNamePublish: Event;
  reviewers: Reviewer[] = [];
  eligiblePublishPapers: Paper[] = [];
  isRejectedPapers = false;

  @ViewChild('authorFileupload', { read: ViewContainerRef, static: true })
    authorFileUploadContainer: ViewContainerRef;
    
  authorUploadComponentRef: ComponentRef<AuthorUploadFileComponent>;

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private router: Router,
    private service: AdminDashboardService,
    private dialogService: DialogService,
    private loginService: LoginService,
    private messageService: MessageService,
    private spinnerService: NgxSpinnerService
  ) {}

  ngOnInit() {
    this.service.getAllEvents().subscribe((resp) => {
      if (!!resp) {
        this.events = resp.data;
        console.log('events:', this.events);
      }
    });
    this.service.getReviewers().subscribe((resp) => {
      this.reviewers = resp.data;
    });
  }

  addNewEvent() {
    const componentFactory =
      this.componentFactoryResolver.resolveComponentFactory(AddEventComponent);
    this.addEventComponentRef =
      this.addEventContainer.createComponent(componentFactory);
    const addEventInstance = this.addEventComponentRef.instance;
    addEventInstance.selectedTab = 'Events';
    addEventInstance.onSubmit.subscribe((data) => {
      let newEvent: Event = {
        eventId: -1,
        eventName: data.eventName,
        description: data.description,
        startDateTime: data.startDateTime,
        endDateTime: data.endDateTime,
      };
      this.spinnerService.show();
      this.service.createEvent(newEvent).subscribe((resp) => {
        console.log('resp:', resp);
        this.spinnerService.hide();
        if (!!resp && !!resp.status && resp.status === ResponseStatus.FAIL) {
          this.dialogService.open(AlertDialogComponent, {
            header: 'Error',
            data: resp.data,
            height: '150px',
            width: '350px',
          });
        } else {
          addEventInstance.showAddEvent = false;
          this.messageService.add({
            key: 'tc',
            severity: 'success',
            summary: 'Success',
            detail: 'Event created successfully!',
          });
          this.service.getAllEvents().subscribe((resp) => {
            console.log('resp for getAllEvents:', resp);
            if (!!resp) {
              this.events = resp.data;
              UtilityClass.addEventsToLocalStorage(this.events);
            }
          });
        }
      });
    });

    addEventInstance.onCancel.subscribe((_) => {
      setTimeout(() => {
        this.addEventComponentRef.destroy();
      });
    });
  }

  onClickEdit(i: number, tabName: string) {
    const componentFactory =
      this.componentFactoryResolver.resolveComponentFactory(AddEventComponent);
    this.addEventComponentRef =
      this.addEventContainer.createComponent(componentFactory);
    const addEventInstance = this.addEventComponentRef.instance;
    addEventInstance.data =
      tabName === 'Events' ? this.events[i] : this.submittedPapers[i].event;
    if (tabName !== 'Events') {
      addEventInstance.paperData = this.submittedPapers[i];
      addEventInstance.reviewer1 = {
        reviewerId: this.submittedPapers[i].reviewer1,
        reviewerName: this.submittedPapers[i].reviewer1Name,
      };
      addEventInstance.reviewer2 = {
        reviewerId: this.submittedPapers[i].reviewer2,
        reviewerName: this.submittedPapers[i].reviewer2Name,
      };
      addEventInstance.reviewer3 = {
        reviewerId: this.submittedPapers[i].reviewer3,
        reviewerName: this.submittedPapers[i].reviewer3Name,
      };
    }
    addEventInstance.selectedTab = tabName;
    addEventInstance.reviewers = this.reviewers;
    addEventInstance.onSubmit.subscribe((data) => {
      console.log('data after submit:', data);
      addEventInstance.showAddEvent = false;
      if (tabName === 'Events') {
        this.spinnerService.show();
        this.service.updateEvent(data).subscribe((resp) => {
          console.log('resp after update:', resp);
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
              detail: 'Event updated successfully!',
            });
            this.events[i] = { ...data };
          }
        });
      } else {
        console.log('paper with reviewer:', this.submittedPapers[i]);
        this.submittedPapers[i] = {
          ...this.submittedPapers[i],
          eventId: data.eventId,
          reviewer1: data.reviewer1Id,
          reviewer2: data.reviewer2Id,
          reviewer3: data.reviewer3Id,
          reviewer1Name: data.reviewer1Name,
          reviewer2Name: data.reviewer2Name,
          reviewer3Name: data.reviewer3Name,
        };
        this.spinnerService.show();
        this.service
          .updateReviewer(this.submittedPapers[i])
          .subscribe((resp) => {
            this.spinnerService.hide();
            if (
              !!resp &&
              !!resp.status &&
              resp.status === ResponseStatus.FAIL
            ) {
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
                detail: 'Event updated successfully!',
              });
            }
            this.selectedEvent(null);
          });
      }
    });

    addEventInstance.onCancel.subscribe((_) => {
      setTimeout(() => {
        this.addEventComponentRef.destroy();
      });
    });
  }

  onClickDelete(i: number) {
    const eventId: number = this.events[i].eventId;
    this.spinnerService.show();
    this.service.deleteEvent(eventId).subscribe((resp) => {
      console.log('resp after deleting event:', resp);
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
          detail: 'Event deleted successfully!',
        });
        this.events.splice(i, 1);
      }
    });
  }

  selectedEvent($event: any) {
    console.log('selected event from dropdown:', $event);
    console.log('selectedEventName:', this.selectedEventName);
    this.spinnerService.show();
    this.service
      .getPapersByEventIdAndStatus(this.selectedEventName.eventId, 'SUBMITTED')
      .subscribe((resp) => {
        console.log('resp for getAllapepersByEventId:', resp);
        this.spinnerService.hide();
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

  selectedEventPublish($event: any) {
    console.log('selected event from dropdown:', $event);
    console.log('selectedEventNamePublish:', this.selectedEventNamePublish);
    this.spinnerService.show();
    this.service
      .getPapersByEventIdAndStatus(
        this.selectedEventNamePublish.eventId,
        this.isRejectedPapers ?  'REJECTED' : 'ELIGIBLE_TO_PUBLISH'
      )
      .subscribe((resp) => {
        console.log('resp for getAllapepersByEventId:', resp);
        this.spinnerService.hide();
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
          this.eligiblePublishPapers = [...paperList];
        }
      });
  }

  view(i: any) {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(AuthorUploadFileComponent);
    this.authorUploadComponentRef = this.authorFileUploadContainer.createComponent(componentFactory);
    const authorFileUploadInstance = this.authorUploadComponentRef.instance;
    authorFileUploadInstance.showDialog = true;
    authorFileUploadInstance.paperId = this.eligiblePublishPapers[i].paperId;
    authorFileUploadInstance.paperStatus = this.eligiblePublishPapers[i].paperStatus;
    authorFileUploadInstance.paper = this.eligiblePublishPapers[i];
  }

  publish(i: any) {
    this.spinnerService.show();
    this.service
      .publish(this.eligiblePublishPapers[i].paperId)
      .subscribe((resp) => {
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
            detail: 'Paper published successfully!',
          });
          this.selectedEventPublish(null);
        }
      });
  }

  onChangePublished($event: any) {
    if (this.selectedEventNamePublish === null || this.selectedEventNamePublish === undefined || this.selectedEventNamePublish.eventId < 0) {
      this.dialogService.open(AlertDialogComponent, {
        height: '250px',
        width: '250px',
        header: 'Error',
        data: 'Please select the event'
      })
      return;
    }
    console.log('this.isPublishedPapers:', this.isRejectedPapers);
    this.spinnerService.show();
    this.service
      .getPapersByEventIdAndStatus(
        this.selectedEventNamePublish.eventId,
        this.isRejectedPapers ?  'REJECTED' : 'ELIGIBLE_TO_PUBLISH'
      )
      .subscribe((resp) => {
        console.log('resp for getAllapepersByEventId:', resp);
        this.spinnerService.hide();
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
          this.eligiblePublishPapers = [...paperList];
        }
      });
  }

  logOut() {
    this.loginService.logout();
  }
}
