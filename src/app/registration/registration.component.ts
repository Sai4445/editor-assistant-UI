import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { NgxSpinnerService } from "ngx-spinner";
import { MessageService } from "primeng/api";
import { DialogService } from "primeng/dynamicdialog";
import { AdminDashboardService } from "../admin-dashboard/admin-dashboard.Service";
import { AlertDialogComponent } from "../shared/Components/alert-dialog-component/alert-dialog.component";
import { ResponseStatus } from "../shared/response";
import { UtilityClass } from "../shared/UtilityClass";
import { Registration } from "./registration";
import { RegistrationService } from "./registration.service";

@Component({
    selector: 'register',
    templateUrl: './registration.component.html',
    styleUrls: ['./registration.component.css'],
})
export class RegistrationComponent implements OnInit {

    registrationForm: FormGroup = this.fb.group({
        firstName: [null, { validators: [Validators.required] }],
        lastName: [null, { validators: [Validators.required] }],
        email: [null, { validators: [Validators.required] }],
        password: [null, { validators: [Validators.required] }],
        role: ['author', { validators: [Validators.required] }]
    });

    constructor(private fb: FormBuilder, private registrationService: RegistrationService,
        private router: Router, private messageService: MessageService, public dialogService: DialogService,
        private adminService: AdminDashboardService, private SpinnerService: NgxSpinnerService) { }

    ngOnInit() { }

    onClickSubmit() {
        console.log("on click sibmit:", this.registrationForm.value);
        this.SpinnerService.show();
        this.registrationService.register(this.registrationForm.value).subscribe(resp => {
            console.log("resp:", resp);
            this.SpinnerService.hide();
            if (!!resp && !!resp.status && resp.status === ResponseStatus.FAIL) {
                this.dialogService.open(AlertDialogComponent, {
                    header: 'Error',
                    data: resp.data,
                    height: '150px',
                    width: '350px'
                })
            } else {
                this.messageService.add({ key: 'tc', severity: 'success', summary: 'Success', detail: 'Registered Successfully!' });
                this.adminService.getUsers().subscribe(resp => {
                    UtilityClass.addEventsToLocalStorage(resp.data);
                    this.adminService.getReviewers().subscribe(resp => {
                        UtilityClass.addReviewersToLocalStorage(resp.data);
                        setTimeout(() => {
                            this.router.navigate(['/login']);
                        }, 1000);
                    })
                })
            }
        });
    }
}