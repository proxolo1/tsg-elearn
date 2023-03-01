import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { LoaderComponent } from './loader/loader.component';
import { PopoverComponent } from './popover/popover.component';
import { OverlayPanelModule } from 'primeng/overlaypanel';
@NgModule({
  imports: [TranslateModule, CommonModule,OverlayPanelModule],
  declarations: [LoaderComponent, PopoverComponent],
  exports: [LoaderComponent,PopoverComponent],
})
export class SharedModule {}
