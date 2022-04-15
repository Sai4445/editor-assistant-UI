import { Component, OnInit } from "@angular/core";
import { LoginService } from "../login/login.service";

@Component({
    selector: 'navigation-bar',
    templateUrl: './navigation-bar.component.html',
    styleUrls: ['./navigation-bar.component.css']
})
export class NavigatopnBarComponent implements OnInit {

    userName = localStorage.getItem('userName');
    constructor(private loginService: LoginService) {}

    ngOnInit() {}

    displayProfile() {

    }
    
    logOut() {
        this.loginService.logout();
    }
}