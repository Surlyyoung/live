import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared';

import { LiveRoutingModule } from './live-routing.module';

import { LiveListComponent } from './live-list/live-list.component';
import { AddLiveComponent } from './add-live/add-live.component';

@NgModule({
  declarations: [LiveListComponent, AddLiveComponent],
  imports: [CommonModule, LiveRoutingModule, SharedModule],
})
export class LiveModule {}
