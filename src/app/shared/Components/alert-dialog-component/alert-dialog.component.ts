import { Component, OnInit } from "@angular/core";
import { DynamicDialogConfig } from "primeng/dynamicdialog";

@Component({
    selector: 'alert-dialog',
    template: 
    `
        {{data}}
    `,
    styles: []
})
export class AlertDialogComponent implements OnInit {

    data: string;

    constructor( public config: DynamicDialogConfig) {}

    ngOnInit() {
        this.data = this.config.data;
    }
}