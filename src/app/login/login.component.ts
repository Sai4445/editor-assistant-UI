import { Component, Input, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router, RouterModule } from "@angular/router";
import { NgxSpinner, NgxSpinnerService } from "ngx-spinner";
import { AdminDashboardService } from "../admin-dashboard/admin-dashboard.Service";
import { ResponseStatus } from "../shared/response";
import { UtilityClass } from "../shared/UtilityClass";
import { LoginService } from "./login.service";

@Component({
    selector: 'login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

    loginFG: FormGroup =  this.fb.group({
        email: [null, [Validators.required]],
        password: [null, [Validators.required]]
    })

    loginError: boolean;
    errorMessage: string;

    constructor(private router: Router, private fb: FormBuilder, private loginService: LoginService,
        private adminService: AdminDashboardService, private spinnerService: NgxSpinnerService) {}

    ngOnInit() {
        if (this.loginService.isLoggedIn()) {
            const role = localStorage.getItem('role');
            if (role === 'author') {
                this.router.navigate(['/author-dashboard']);
            } else if (role === 'reviewer') {
                this.router.navigate(['/reviewer-dashboard']);
            } else {
                this.router.navigate(['/admin-dashboard']);
            }
        }
    }

    onClickLogin() {
        this.spinnerService.show();
        this.loginService.login(this.loginFG.value).subscribe(resp => {
            console.log('resp:', resp);
            this.spinnerService.hide();
            if (!!resp && !!resp.status && resp.status === ResponseStatus.FAIL) {
                console.log('error:', resp.data);
                this.loginError = true;
                this.errorMessage = resp.data;
            } else {
                if (!!resp.data) {
                    this.loginService.setToken(resp.data.random);
                    UtilityClass.addToLocalStorage('role', resp.data.role);
                    UtilityClass.addToLocalStorage('userId', resp.data.userId);
                    UtilityClass.addToLocalStorage('userName', (resp.data.firstName + ' ' + resp.data.lastName));

                    this.adminService.getAllEvents().subscribe(resp => {
                        UtilityClass.addEventsToLocalStorage(resp.data);
                      })

                      this.adminService.getReviewers().subscribe(resp => {
                        UtilityClass.addReviewersToLocalStorage(resp.data);
                      })

                      this.adminService.getUsers().subscribe(resp => {
                        UtilityClass.addUsersToLocalStorage(resp.data);
                      })
console.log("role---> ", resp.data.role)
                    if (resp.data.role === 'author') {
                        this.router.navigate(['/author-dashboard']);
                    } else if (resp.data.role === 'reviewer') {
                        this.router.navigate(['/reviewer-dashboard']);
                    } else {
                      console.log("role---> 71", resp.data.role)
                        this.router.navigate(['/admin-dashboard']);
                    }
                }
            }
        });
    }
}
