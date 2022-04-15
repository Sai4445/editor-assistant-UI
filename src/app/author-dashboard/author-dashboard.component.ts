import { Component, ComponentFactoryResolver, ComponentRef, OnInit, ViewChild, ViewContainerRef } from "@angular/core";
import { MatTab } from "@angular/material/tabs";
import { Router } from "@angular/router";
import { NgxSpinnerService } from "ngx-spinner";
import { MessageService } from "primeng/api";
import { DialogService } from "primeng/dynamicdialog";
import { AdminDashboardComponent } from "../admin-dashboard/admin-dashboard.component";
import { AdminDashboardService } from "../admin-dashboard/admin-dashboard.Service";
import { AuthorUploadFileComponent } from "../author-upload-file/author-upload-file.component";
import { AlertDialogComponent } from "../shared/Components/alert-dialog-component/alert-dialog.component";
import { Event } from "../shared/Event";
import { Paper } from "../shared/Paper";
import { ResponseStatus } from "../shared/response";
import { User } from "../shared/User";
import { UtilityClass } from "../shared/UtilityClass";
import { AuthorDashboardService } from "./author-dashboard.service";

@Component({
    selector: 'author-dashboard',
    templateUrl: './author-dashboard.component.html',
    styleUrls: ['./author-dashboard.component.css']
})
export class AuthorDashboardComponent implements OnInit {

    @ViewChild('authorFileupload', { read: ViewContainerRef, static: true })
    authorFileUploadContainer: ViewContainerRef;

    authorUploadComponentRef: ComponentRef<AuthorUploadFileComponent>;

    events: Event[] = [];
    papers: Paper[] = [];
    buttonLabel: string = 'Upload';

    constructor(private service: AuthorDashboardService, private adminService: AdminDashboardService, 
        private router: Router, private componentFactoryResolver: ComponentFactoryResolver,
        private messageService: MessageService, private dialogService: DialogService,
        private spinnerService: NgxSpinnerService) {}

    ngOnInit() {
        this.service.getRegisteredEventsByAuthor(localStorage.getItem('userId')).subscribe(resp => {
            console.log("resp for getAllEvents:", resp);
            if (!!resp) {
                this.events = resp.data;
            }
        })
        this.service.papersByAuthor(localStorage.getItem('userId')).subscribe(resp => {
            if (!!resp && !!resp.status && resp.status === ResponseStatus.FAIL) {
                this.dialogService.open(AlertDialogComponent, {
                    header: 'Error',
                    data: resp.data,
                    height: '150px',
                    width: '350px'
                })
            } else {
                this.papers = resp.data;
            }
        })
    }

    onChangeTab($event: any) {
        console.log('onChnage tab:', $event);
        const matTab: MatTab = $event.tab;
        if (matTab.textLabel === 'Registered Events') {
            this.spinnerService.show();
            this.service.papersByAuthor(localStorage.getItem('userId')).subscribe(resp => {
                this.spinnerService.hide();
                if (!!resp && !!resp.status && resp.status === ResponseStatus.FAIL) {
                    this.dialogService.open(AlertDialogComponent, {
                        header: 'Error',
                        data: resp.data,
                        height: '150px',
                        width: '350px'
                    })
                } else {
                    const paperList: Paper[] = resp.data;
                    for (let i = 0; i < paperList.length; i++) {
                        const respPaper: Paper = paperList[i];
                        const event: any = UtilityClass.getEventById(respPaper.eventId);
                        const author: any = UtilityClass.getUserByUserId(respPaper.authorId);
                        const reviewer1: any = UtilityClass.getReviewerById(respPaper.reviewer1);
                        const reviewer2: any = UtilityClass.getReviewerById(respPaper.reviewer2);
                        paperList[i] = {...paperList[i], 
                            event: event, 
                            authorName: author.firstName + ' ' + author.lastName, 
                            reviewer1Name: reviewer1 ? reviewer1.reviewerName : '',
                            reviewer2Name: reviewer2 ? reviewer2.reviewerName : ''}
                    }
                    console.log('paperList:', paperList);
                    this.papers = [...paperList];
                }
            })
        }
    }

    registerEvent(i: number) {
        console.log('register for the event:', this.events[i]);
        const userId: any = localStorage.getItem('userId');
        console.log('userId:', userId);
        const formData: FormData = new FormData();
        formData.append('authorId', userId+'');
        formData.append('eventId', this.events[i].eventId+'');
        this.spinnerService.show();
        this.service.registerEvent(formData).subscribe(resp => {
            console.log('resp for reg event:', resp);
            this.spinnerService.hide();
            if (!!resp && !!resp.status && resp.status === ResponseStatus.FAIL) {
                this.dialogService.open(AlertDialogComponent, {
                    header: 'Error',
                    data: resp.data,
                    height: '150px',
                    width: '350px'
                })
            } else {
                this.messageService.add({ key: 'tc', severity: 'success', summary: 'Success', detail: 'Event registered successfully!' });
                this.service.getRegisteredEventsByAuthor(localStorage.getItem('userId')).subscribe(resp => {
                    console.log("resp for getAllEvents:", resp);
                    if (!!resp) {
                        this.events = resp.data;
                    }
                })
            }
        })
    }

    onClickEdit(i: number) {
        const componentFactory = this.componentFactoryResolver.resolveComponentFactory(AuthorUploadFileComponent);
        this.authorUploadComponentRef = this.authorFileUploadContainer.createComponent(componentFactory);
        const authorFileUploadInstance = this.authorUploadComponentRef.instance;
        authorFileUploadInstance.showDialog = true;
        authorFileUploadInstance.paperId = this.papers[i].paperId;
        authorFileUploadInstance.paperStatus = this.papers[i].paperStatus;
        authorFileUploadInstance.paper = this.papers[i];
        authorFileUploadInstance.onEmit.subscribe(data => {
            this.spinnerService.show();
            this.service.submit(this.papers[i].paperId).subscribe(resp => {
                this.spinnerService.hide();
                if (!!resp && !!resp.status && resp.status === ResponseStatus.FAIL) {
                    this.dialogService.open(AlertDialogComponent, {
                        header: 'Error',
                        data: resp.data,
                        height: '150px',
                        width: '350px'
                    })
                } else {
                    this.messageService.add({ key: 'tc', severity: 'success', summary: 'Success', detail: 'Paper submitted successfully!' });
                    this.spinnerService.show();
                    this.service.papersByAuthor(localStorage.getItem('userId')).subscribe(resp => {
                        this.spinnerService.hide();
                        if (!!resp && !!resp.status && resp.status === ResponseStatus.FAIL) {
                            this.dialogService.open(AlertDialogComponent, {
                                header: 'Error',
                                data: resp.data,
                                height: '150px',
                                width: '350px'
                            })
                        } else {
                            const paperList: Paper[] = resp.data;
                            for (let i = 0; i < paperList.length; i++) {
                                const respPaper: Paper = paperList[i];
                                const event: any = UtilityClass.getEventById(respPaper.eventId);
                                const author: any = UtilityClass.getUserByUserId(respPaper.authorId);
                                const reviewer1: any = UtilityClass.getReviewerById(respPaper.reviewer1);
                                const reviewer2: any = UtilityClass.getReviewerById(respPaper.reviewer2);
                                paperList[i] = {...paperList[i], 
                                    event: event, 
                                    authorName: author.firstName + ' ' + author.lastName, 
                                    reviewer1Name: reviewer1 ? reviewer1.reviewerName : '',
                                    reviewer2Name: reviewer2 ? reviewer2.reviewerName : ''}
                            }
                            console.log('paperList:', paperList);
                            this.papers = [...paperList];
                        }
                    })
                }
            })
            setTimeout(() => {
                authorFileUploadInstance.showDialog = false;
                this.authorUploadComponentRef.destroy;
            })
        })
    }

    isRegistered(i: number) {
        return this.events[i].registered;
    }

    getButtonLabel(i: number): string|any {
        if (this.papers[i] !== null && this.papers[i].paperStatus !== null) {
            return this.papers[i].paperStatus === 'Submitted' ? 'View' : 'Upload';
        }
    }

    logOut() {
        this.router.navigate(['/login']);
    }
}