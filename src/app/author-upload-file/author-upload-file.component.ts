import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from "@angular/core";
import { NgxSpinner, NgxSpinnerService } from "ngx-spinner";
import { MessageService } from "primeng/api";
import { DialogService } from "primeng/dynamicdialog";
import { FileUpload } from "primeng/fileupload";
import { AuthorDashboardService } from "../author-dashboard/author-dashboard.service";
import { AlertDialogComponent } from "../shared/Components/alert-dialog-component/alert-dialog.component";
import { Paper } from "../shared/Paper";
import { ResponseStatus } from "../shared/response";

@Component({
    selector: 'author-upload-file',
    templateUrl: './author-upload-file.component.html',
    styleUrls: ['./author-upload-file.component.css']
})
export class AuthorUploadFileComponent implements OnInit {
    
    @Input() showDialog: boolean;
    @Input() paperId: any;
    @Input() paperStatus: any;
    @Input() paper: Paper;
    @Input() pdf: any;

    @Output() onEmit = new EventEmitter<any>();

    @ViewChild('fup') fileUpload: FileUpload;

    constructor(private service: AuthorDashboardService,private messageService: MessageService, private dialogService: DialogService,
        private spinnerService: NgxSpinnerService) {}

    ngOnInit() {
        this.service.getPaperByPaperId(this.paperId).subscribe((file: ArrayBuffer) => {
            console.log("resp for paperId:", file);
            this.pdf = new Uint8Array(file);
        })
    }

    myUploader($event: any) {
        // console.log('$event:', $event);
        // console.log('$event:', $event.files[0]);
        // this.onEmit.emit($event.files[0])
        const formData: FormData = new FormData();
            formData.append('paperAttachement', $event.files[0]);
            formData.append('paperId', this.paper.paperId+'');
            formData.append('eventId', this.paper.eventId+'');
            formData.append('authorId', this.paper.authorId+'');
            formData.append('paperStatus', this.paper.paperStatus ? this.paper.paperStatus+'' : '');
            console.log('formData:', formData);
            this.spinnerService.show();
            this.service.uploadPaper(formData).subscribe(resp => {
                console.log('resp after upload paper:', resp);
                this.spinnerService.hide();
                if (!!resp && !!resp.status && resp.status === ResponseStatus.FAIL) {
                    this.dialogService.open(AlertDialogComponent, {
                        header: 'Error',
                        data: resp.data,
                        height: '150px',
                        width: '350px'
                    })
                } else {
                    this.messageService.add({ key: 'tc', severity: 'success', summary: 'Success', detail: 'Paper uploaded successfully!' });
                    this.fileUpload.clear();
                    this.service.getPaperByPaperId(this.paperId).subscribe((file: ArrayBuffer) => {
                        console.log("resp for paperId:", file);
                        this.pdf = new Uint8Array(file);
                    })
                }
            });
    }

    submit() {
        this.onEmit.emit();
    }
}