import { NgModule } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { CalendarModule } from 'primeng/calendar';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { FileUploadModule } from 'primeng/fileupload';
import { ToastModule } from 'primeng/toast';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { AvatarModule } from 'primeng/avatar';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import {InputSwitchModule} from 'primeng/inputswitch';

@NgModule({
  imports: [
    DialogModule,
    CalendarModule,
    InputTextModule,
    DropdownModule,
    FileUploadModule,
    ToastModule,
    DynamicDialogModule,
    AvatarModule,
    OverlayPanelModule,
    InputSwitchModule
  ],
  exports: [
    DialogModule,
    CalendarModule,
    InputTextModule,
    DropdownModule,
    FileUploadModule,
    ToastModule,
    DynamicDialogModule,
    AvatarModule,
    OverlayPanelModule,
    InputSwitchModule
  ],
})
export class PrimengModule {}
