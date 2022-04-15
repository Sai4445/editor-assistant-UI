import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { DialogService } from "primeng/dynamicdialog";
import { AlertDialogComponent } from "../shared/Components/alert-dialog-component/alert-dialog.component";
import { Event } from "../shared/Event";
import { Paper } from "../shared/Paper";

@Component({
    selector: 'add-event',
    templateUrl: './add-event.component.html',
    styleUrls: ['./add-event.component.css']
})
export class AddEventComponent implements OnInit {

    @Input() reviewer1: any;
    @Input() reviewer2: any;
    @Input() reviewer3: any;
    @Input() data: any = {};
    @Input() paperData: Paper;
    @Input() selectedTab: string;
    @Input() reviewers: any = [];

    @Output() onSubmit = new EventEmitter<any>();
    @Output() onCancel = new EventEmitter<boolean>();

    showAddEvent=true;
    eventForm: FormGroup;

    constructor(private fb: FormBuilder, private dialogService: DialogService) {}

    ngOnInit() {
        console.log('add event data:', this.data);
        console.log('selectedTab:', this.selectedTab);
        if (this.data === undefined ||this.data === null) this.data = {};
        let eventId;
        if (this.selectedTab === 'Events') {
            eventId = this.data.eventId;
        } else {
            eventId = this.paperData.eventId;
        }
        this.eventForm = this.fb.group({
            eventId: [{value: (eventId ? eventId : null), disabled: (this.selectedTab !== 'Events')}],
            eventName: [{value: (this.data.eventName ? this.data.eventName : null), disabled: (this.selectedTab !== 'Events')}, [Validators.required]],
            description: [{value: (this.data.description ? this.data.description : null), disabled: (this.selectedTab !== 'Events')}],
            startDateTime: [{value: (this.data.startDateTime ? new Date(this.data.startDateTime) : null), disabled: (this.selectedTab !== 'Events')}, [Validators.required]],
            endDateTime: [{value: (this.data.endDateTime ? new Date(this.data.endDateTime) : null), disabled: (this.selectedTab !== 'Events')}, [Validators.required]],
            createdBy: [(this.data.createdBy ? this.data.createdBy : null)]
        }); 
        console.log('eventForm:', this.eventForm);
    }

    addEvent() {
        console.log('event:', this.eventForm.value);
        let resp:any = {
            eventId: this.eventForm.get('eventId')?.value,
            eventName: this.eventForm.get('eventName')?.value,
            description: this.eventForm.get('description')?.value,
            startDateTime: this.eventForm.get('startDateTime')?.value,
            endDateTime: this.eventForm.get('endDateTime')?.value,
            createdBy: this.eventForm.get('createdBy')?.value
        };
        if (this.selectedTab === 'SubmittedPapers' && this.validateReviewers(this.reviewer1.reviewerId,this.reviewer2.reviewerId, this.reviewer3.reviewerId)) {
            this.dialogService.open(AlertDialogComponent, {
                height: '250px',
                width: '250px',
                header: 'Error',
                data: 'Reviewer1 and Reviewer2 should be different'
            })
        } else {
            if (this.selectedTab === 'SubmittedPapers') {
                resp = {...resp, reviewer1Id: this.reviewer1.reviewerId, reviewer2Id: this.reviewer2.reviewerId, reviewer3Id: this.reviewer3.reviewerId, reviewer1Name: this.reviewer1.reviewerName, reviewer2Name: this.reviewer2.reviewerName, reviewer3Name: this.reviewer3.reviewerName};
            }
            this.onSubmit.emit(resp);
        }
    }

    private validateReviewers(rev1id: any, rev2id: any, rev3id: any): boolean {

        let isSame: boolean = false;
        if (rev1id === rev2id === rev3id) isSame = true;
        else if (rev1id === rev2id) isSame = true;
        else if (rev1id === rev3id) isSame = true;
        else if (rev2id === rev3id) isSame = true;

        return isSame;

    }

    onClickCancel() {
        this.showAddEvent = false;
        this.onCancel.emit(true);
    }

}