import { Component, OnInit } from '@angular/core';
import { AdminDashboardService } from './admin-dashboard/admin-dashboard.Service';
import { UtilityClass } from './shared/UtilityClass';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor (private adminService: AdminDashboardService) {}

  ngOnInit() {
    // this.adminService.getAllEvents().subscribe(resp => {
    //   UtilityClass.addEventsToLocalStorage(resp.data);
    // })

    // this.adminService.getReviewers().subscribe(resp => {
    //   UtilityClass.addReviewersToLocalStorage(resp.data);
    // })

    // this.adminService.getUsers().subscribe(resp => {
    //   UtilityClass.addUsersToLocalStorage(resp.data);
    // })
  }

}
