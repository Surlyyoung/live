import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LiveListComponent } from './live-list/live-list.component';
import { AddLiveComponent } from './add-live/add-live.component';
const routes: Routes = [
  {
    path: '',
    component: LiveListComponent,
  },
  {
    path: 'add',
    component: AddLiveComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LiveRoutingModule {}
